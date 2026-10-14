// 兩段式抽題與課程先修閘門（題庫精修提案 v1.0 第二階段）。
//
// 問題：一般練習的抽題是 adaptiveShuffle 排好順序後直接取前 n 題。能力模型的訊號（弱技巧、
// 挑戰點、交錯、回溫）都在順序裡，但「方法」沒有人管 —— 極限 R4 有四成多是 Taylor，
// 微分 R6 七成是超高階導數，學生看到的就是一招打天下。
//
// 這支只做兩件事，都不改題目、不改 rank：
//   draw(ordered, n, opts)  兩段式：先抽「主題×rank×方法家族」的格子（質量 = defaultWeight × 能力模型排序的位置權重，
//                           預設池再用 clampShares 壓到 EXPOSURE_CAPS 內），再從格子裡挑排序最前、而且不違反一局限制的那一題。
//                           一局限制：同家族 ≤ 30%、同 noveltyFamily ≤ 1、同模板母題 ≤ 1、同來源題包 ≤ 40%；
//                           池子不夠時依序放寬（題包 → 家族 → 模板），寧可放寬也不少給題。
//   gate(pool, records, o)  課程先修閘門：課程練習（o.courseLessonId）不出「先修課既沒完成、也排在這一課之後」的題；
//                           新手保護期（o.bridged）只出先修課已經走到的題。
//
// 資料：window.BuzzProblemProfiles（src/kernel/problem_profiles.js，tools/build_problem_profiles.js 產生）。
// 兩支都是 lazy 群組 sampler：開站閒下來就載；還沒載到的那幾秒 app.js 照舊抽題（不擋、不壞）。
// 純函式、node 可測：tools/validate_problem_profiles.js 每種模式×主題×rank 模擬 1,000 局。

(function () {
  "use strict";

  let cache = null;
  function table(raw) {
    const src = raw || (typeof window !== "undefined" && window.BuzzProblemProfiles);
    if (!src) return null;
    if (cache && cache.src === src) return cache;
    const rows = new Map();
    const lessonIndex = {};
    src.lessons.forEach((id, i) => { lessonIndex[id] = i; });
    // 一列：id \t 家族(索引.索引) \t 新穎族(題號；空 = 自己) \t 權重(0–100) \t 角色(位元) \t 先修(36 進位.…) \t 模板母題 \t 題包索引
    src.rows.split("\n").forEach((line) => {
      const [id, fam, nov, w, roles, gates, tpl, pack] = line.split("\t");
      rows.set(id, {
        fam: fam ? fam.split(".").map((x) => src.families[parseInt(x, 36)]) : [],
        nov: nov || id,
        w: Number(w) / 100,
        roles: parseInt(roles || "0", 36),
        gates: gates ? gates.split(".").map((x) => parseInt(x, 36)) : [],
        tpl: tpl || "",
        pack: pack ? src.packs[parseInt(pack, 36)] : ""
      });
    });
    cache = { src, rows, lessonIndex, caps: src.caps || [], session: src.session || {}, roles: src.roles || [] };
    return cache;
  }

  /* ── 份額上限 ─────────────────────────────────────────────────
     groups：Map「topic|rank」→ Map「家族 id」→ 質量。caps：[{ topic, ranks, families | any, max }]。
     把超過上限的家族等比例縮到剛好在上限，重複到穩定；回傳 Map「topic|rank|家族」→ 縮放倍率。
     any（任何單一家族）只在可行時套用：家族數 × max < 1 的格子怎麼縮都到不了，留給報表講。
     產生器拿它算 defaultWeight（全題庫），抽題器拿它在執行期壓窗口 —— 同一支，所以兩邊的定義不會分家。 */
  function clampShares(groups, caps) {
    const factor = new Map();
    const scale = (g, fam, k) => {
      const masses = groups.get(g);
      masses.set(fam, masses.get(fam) * k);
      const key = `${g}|${fam}`;
      factor.set(key, (factor.has(key) ? factor.get(key) : 1) * k);
    };
    // 先把「哪些上限管哪一格」配好（不在迴圈裡切字串）
    const work = [];
    groups.forEach((masses, g) => {
      const [topic, rank] = g.split("|");
      const list = (caps || []).filter((cap) => cap.topic === topic && cap.ranks.includes(Number(rank)));
      if (list.length) work.push({ g, masses, list });
    });
    work.forEach(({ g, masses, list }) => {
      // 特定家族的上限與「任一家族」的上限會互相影響（縮了最大的，總量變小，別的家族份額就變大），所以輪幾次到穩定；
      // 每一條本身都是一步到位的解（不是一點一點縮），通常兩三輪就停。
      for (let iter = 0; iter < 12; iter += 1) {
        let changed = false;
        list.forEach((cap) => {
          let total = 0;
          masses.forEach((m) => { total += m; });
          if (total <= 0) return;
          if (cap.any) {
            const live = [...masses.entries()].filter(([, m]) => m > 0).sort((a, b) => b[1] - a[1]);
            if (live.length * cap.max < 1 || live[0][1] / total <= cap.max + 1e-9) return;
            // 注水：最大的 k 個家族壓到同一條線 c，c = max ×（壓後的總量）。從 k=1 往上找第一個自洽的 k。
            let rest = total;
            for (let k = 1; k <= live.length; k += 1) {
              rest -= live[k - 1][1];
              const c = (cap.max * rest) / (1 - k * cap.max);
              const next = k < live.length ? live[k][1] : 0;
              if (c >= next - 1e-12 && c > 0 && 1 - k * cap.max > 0) {
                for (let j = 0; j < k; j += 1) if (live[j][1] > c) { scale(g, live[j][0], c / live[j][1]); changed = true; }
                break;
              }
            }
            return;
          }
          let hit = 0;
          cap.families.forEach((fam) => { hit += masses.get(fam) || 0; });
          if (hit <= 0 || hit / total <= cap.max + 1e-9) return;
          const target = (cap.max / (1 - cap.max)) * (total - hit);
          const k = Math.max(0, target / hit);
          cap.families.forEach((fam) => { if (masses.has(fam)) scale(g, fam, k); });
          changed = true;
        });
        if (!changed) break;
      }
    });
    return factor;
  }

  // 可重現的亂數（seed 相同 → 同一局）
  function rng(seed) {
    let a = (Number(seed) >>> 0) || 1;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const rankOf = (p) => Number(p.rank || p.difficulty || 3);

  /* ── 兩段式抽題 ──────────────────────────────────────────────
     ordered：adaptiveShuffle 排好的整個池（前面 = 能力模型最想出的）。回傳重排過的整個池：
     前 n 題是這一局，後面照原順序（給 padPool 補位用）。opts.focus：使用者自己選了題包／技巧，
     上限與 defaultWeight 都不管（每題權重 1），一局限制照樣（放寬規則相同）。 */
  function draw(ordered, n, opts = {}) {
    const T = table(opts.table);
    if (!T || !ordered || ordered.length <= 1 || !(n > 0)) return ordered;
    const focus = Boolean(opts.focus);
    const random = rng(opts.seed || 1);
    const S = T.session;
    const perFamily = Math.max(1, Math.ceil(n * (S.perFamilyShare || 0.3)));
    const perPack = Math.max(1, Math.ceil(n * (S.perPackShare || 0.4)));
    const perNovelty = S.perNovelty || 1;
    const perTemplate = S.perTemplate || 1;
    // 位置權重：排序越前越重（能力模型的訊號）。τ 讓前 ~3n 題佔大部分質量，又不至於只看前 n 題。
    const tau = Math.max(12, n * 3);
    const itemOf = (p, i) => {
      const prof = T.rows.get(p.id);
      const fam = prof && prof.fam.length ? prof.fam[0] : "_";
      const w = focus ? 1 : prof ? prof.w : 1;
      return {
        p, i, prof,
        cell: `${p.topic}|${rankOf(p)}|${fam}`,
        group: `${p.topic}|${rankOf(p)}`,
        famKey: `${p.topic}|${fam}`,
        fam,
        nov: prof ? prof.nov : p.id,
        tpl: prof ? prof.tpl : "",
        pack: prof ? prof.pack : (p.source || ""),
        mass: w * Math.exp(-i / tau)
      };
    };
    // 候選只在需要時才建（整個池 2,800 題、一局只看前面一段）。
    // 權重 0 的題（預設池上限 0%，例如 R1 的 Taylor）不進預設局；池子只剩它們時才由 padPool 補回來。
    const items = [];
    let cursor = 0;
    const grow = (upto) => {
      while (items.length < upto && cursor < ordered.length) {
        const it = itemOf(ordered[cursor], cursor);
        cursor += 1;
        if (it.mass > 0 || focus) items.push(it);
      }
    };
    const count = { fam: new Map(), nov: new Map(), tpl: new Map(), pack: new Map() };
    const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);
    const ok = (it, level) => (
      (level >= 3 || (count.nov.get(it.nov) || 0) < perNovelty)
      && (level >= 3 || !it.tpl || (count.tpl.get(it.tpl) || 0) < perTemplate)
      && (level >= 2 || (count.fam.get(it.famKey) || 0) < perFamily)
      && (level >= 1 || !it.pack || (count.pack.get(it.pack) || 0) < perPack)
    );
    const taken = new Set();
    const picked = [];
    let level = 0;
    // 窗口：質量幾乎全在前面；先只看前 win 題，選不到才看整個池、再放寬
    grow(Math.max(150, n * 15));
    let win = items.length;
    const widen = () => {
      if (cursor >= ordered.length && win >= items.length) return false;
      grow(Infinity);
      win = items.length;
      return true;
    };
    while (picked.length < n && level < 4) {
      // 格子質量（只算還能選的題）
      const cells = new Map();
      const groups = new Map();
      for (let k = 0; k < win; k += 1) {
        const it = items[k];
        if (taken.has(it) || !ok(it, level)) continue;
        if (!cells.has(it.cell)) cells.set(it.cell, { mass: 0, best: it, group: it.group, fam: it.fam });
        const c = cells.get(it.cell);
        c.mass += it.mass;
        if (!groups.has(it.group)) groups.set(it.group, new Map());
        const g = groups.get(it.group);
        g.set(it.fam, (g.get(it.fam) || 0) + it.mass);
      }
      if (!cells.size) { if (!widen()) level += 1; continue; }
      if (!focus) {
        const factor = clampShares(groups, T.caps);
        cells.forEach((c) => {
          const k = factor.get(`${c.group}|${c.fam}`);
          if (k !== undefined) c.mass *= k;
        });
      }
      let total = 0;
      cells.forEach((c) => { total += c.mass; });
      let chosen = null;
      if (total > 0) {
        let r = random() * total;
        for (const c of cells.values()) { r -= c.mass; if (r <= 0 && c.mass > 0) { chosen = c; break; } }
        if (!chosen) chosen = [...cells.values()].filter((c) => c.mass > 0).pop();
      } else {
        // 窗口裡剩下的全被上限壓成 0：先看整個池，還是沒有才放寬一級（那些家族放到最後才會回來）
        if (!widen()) level += 1;
        continue;
      }
      const it = chosen.best;
      taken.add(it);
      picked.push(it);
      bump(count.fam, it.famKey); bump(count.nov, it.nov); if (it.tpl) bump(count.tpl, it.tpl); if (it.pack) bump(count.pack, it.pack);
    }
    const head = picked.map((it) => it.p);
    const used = new Set(head);
    return head.concat(ordered.filter((p) => !used.has(p)));
  }

  /* ── 課程先修閘門 ──────────────────────────────────────────────
     題目的 prerequisiteGate = 它每一個技巧在新版課程裡第一次被教的那一課（產生器算好、存成大綱順序的索引）。
     課程練習（o.courseLessonId 是一課的 id）：每一個先修課都要「排在這一課或之前」或「已經完成」。
     新手保護期（o.bridged）：每一個先修課都要「已經走到」（打開過或完成的最遠那一課之前）或「已經完成」；
       篩完不到 4 題就維持原本的橋池（橋池本身就是入門課教過的 R1）—— 不讓新手面對空畫面。
     魔王題（boss:XX）與其他模式不篩：魔王題的公平性由 validate_course_v2.js 另外把關。 */
  function gate(pool, records, o = {}, raw) {
    const T = table(raw);
    if (!T || !pool) return pool;
    const cv = (records && records.courseV2) || {};
    const done = (i) => Boolean((cv[T.src.lessons[i]] || {}).doneAt);
    let limit;
    if (o.courseLessonId && T.lessonIndex[o.courseLessonId] !== undefined) {
      limit = T.lessonIndex[o.courseLessonId];
    } else if (o.bridged) {
      limit = -1;
      Object.keys(cv).forEach((id) => {
        const e = cv[id] || {};
        if ((e.openedAt || e.doneAt) && T.lessonIndex[id] !== undefined) limit = Math.max(limit, T.lessonIndex[id]);
      });
    } else return pool;
    const open = (p) => {
      const prof = T.rows.get(p.id);
      return !prof || prof.gates.every((g) => g <= limit || done(g));
    };
    const kept = pool.filter(open);
    if (o.bridged && !o.courseLessonId && kept.length < 4) return pool;
    return kept;
  }

  function profileOf(id, raw) {
    const T = table(raw);
    return T ? T.rows.get(id) || null : null;
  }

  const API = { version: 1, table, clampShares, draw, gate, profileOf, rng };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  if (typeof window !== "undefined") window.BuzzSampler = API;
})();
