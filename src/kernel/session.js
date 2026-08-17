// Buzz Session — 照配方抽題
//
// planner 說「要 4 題到期複習、5 題弱點、2 題新技巧」，這個檔負責真的把題抽出來。
//
// 這裡最容易出錯、也最重要的一件事是「抽不滿怎麼辦」。
// 一個新使用者沒有錯題可複習，一個只練過極限的人沒有多變數弱點資料，
// 難度上限開 2 的人抽不到 R5。這些情況下配方一定會有 slot 抽不滿 ——
// 那時候**必須降級補滿，不能留白**。給使用者 12 題就是 12 題，
// 少給 3 題比給錯 3 題更傷信任。
//
// 降級路徑是明確的，而且會被記錄在 meta.fallbacks 裡，
// 這樣 UI 可以誠實說「今天沒有到期的錯題，改成多練兩題弱點」。
//
// 設計規則：
//   1. 純函數，而且抽題必須可重現：同樣的 (配方, 題庫, seed) 抽出同一組題。
//      不可重現的話沒辦法寫測試，也沒辦法讓「每日一題」全站同題。
//   2. 不做科目閘門、不做難度上限過濾 —— 那些規則歸 app.js，
//      呼叫端傳進來的 pool 就已經是合法的候選集。

(function () {
  "use strict";

  /* ── 可重現的亂數 ─────────────────────────────────────────── */

  function seedFrom(value) {
    let hash = 2166136261;
    const text = String(value);
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function shuffle(list, seed) {
    const out = list.slice();
    let state = seed >>> 0 || 1;
    for (let i = out.length - 1; i > 0; i -= 1) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      const j = state % (i + 1);
      const tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  function rankOf(problem) {
    return Math.max(1, Math.min(6, Number(problem.rank || problem.difficulty || 1)));
  }

  /* ── slot 的篩選條件 ────────────────────────────────────────── */

  function matches(problem, filter, skillsOf) {
    if (!filter) return true;
    if (filter.problemIds && !filter.problemIds.includes(problem.id)) return false;
    if (filter.maxRank && rankOf(problem) > filter.maxRank) return false;
    if (filter.minRank && rankOf(problem) < filter.minRank) return false;
    if (filter.skills && filter.skills.length) {
      const skills = skillsOf(problem);
      if (!filter.skills.some((id) => skills.includes(id))) return false;
    }
    return true;
  }

  /* ── 降級路徑 ───────────────────────────────────────────────
     由嚴格到寬鬆。每往下一階都要記錄，因為那是要講給使用者聽的。 */

  function relaxations(slot) {
    const filter = slot.filter || {};
    const steps = [{ note: "", filter }];

    // 第一階：放掉難度上下限，技巧條件保留
    if (filter.minRank || filter.maxRank) {
      const loosened = Object.assign({}, filter);
      delete loosened.minRank;
      delete loosened.maxRank;
      steps.push({ note: "放寬難度範圍", filter: loosened });
    }

    // 第二階：技巧擴大到同一個 family（同家族的題練起來仍然有遷移效果）
    if (filter.skills && filter.skills.length) {
      steps.push({ note: "擴大到同家族技巧", filter: { families: true, skills: filter.skills } });
    }

    // 第三階：只剩題數要求，什麼都收
    steps.push({ note: "改用一般練習題補滿", filter: {} });
    return steps;
  }

  function expandToFamilies(skillIds, graph) {
    if (!graph) return [];
    const families = new Set();
    skillIds.forEach((id) => {
      const node = graph.byId(id);
      if (node) families.add(node.family);
    });
    return graph.skills.filter((node) => families.has(node.family)).map((node) => node.id);
  }

  /* ── 抽題 ───────────────────────────────────────────────────── */

  function fill(recipe, opts) {
    const options = opts || {};
    const pool = Array.isArray(options.problems) ? options.problems : [];
    const graph =
      options.graph ||
      (typeof window !== "undefined" && window.BuzzSkillGraph) ||
      (typeof globalThis !== "undefined" && globalThis.BuzzSkillGraph) ||
      null;
    const seed = seedFrom(options.seed || "buzz-session");
    const exclude = new Set(options.exclude || []);
    // 最近做過的題往後排，但不是硬排除 —— 硬排除會在題庫小的技巧上抽不到題
    const recent = new Set(options.recent || []);

    const skillCache = new Map();
    const skillsOf = (problem) => {
      if (!skillCache.has(problem.id)) {
        skillCache.set(problem.id, graph ? graph.skillsForProblem(problem) : []);
      }
      return skillCache.get(problem.id);
    };

    const used = new Set();
    const picked = [];
    const meta = { fallbacks: [], byRole: {}, shortfall: 0 };

    // 時間預算：「5 分鐘快刷」就該是 5 分鐘。候選夠多的時候，優先挑
    // 單題時長接近理想值的題目 —— 否則 6 題全抽到 R6，標榜 5 分鐘會變成 11 分鐘，
    // 那等於對使用者說謊。
    const budget = Number(recipe.budgetSeconds) || 0;
    const ideal = budget && recipe.count ? budget / 1.35 / recipe.count : 0;

    const take = (candidates, count, role) => {
      let taken = 0;
      // 排序優先序：沒做過的 > 最近做過的；同一層裡再挑時長接近理想值的
      const ordered = candidates
        .filter((problem) => !used.has(problem.id) && !exclude.has(problem.id))
        .map((problem) => ({
          problem,
          recent: Number(recent.has(problem.id)),
          drift: ideal ? Math.abs((Number(problem.timeLimit) || 60) - ideal) : 0
        }))
        .sort((a, b) => a.recent - b.recent || a.drift - b.drift);
      for (const entry of ordered) {
        if (taken >= count) break;
        used.add(entry.problem.id);
        picked.push({ problem: entry.problem, role });
        taken += 1;
      }
      return taken;
    };

    (recipe.slots || []).forEach((slot) => {
      const shuffled = shuffle(pool, seed + seedFrom(slot.role));
      let remaining = slot.count;
      const notes = [];

      relaxations(slot).forEach((step) => {
        if (remaining <= 0) return;
        let filter = step.filter;
        if (filter.families) {
          filter = { skills: expandToFamilies(filter.skills, graph) };
          if (!filter.skills.length) return;
        }
        const candidates = shuffled.filter((problem) => matches(problem, filter, skillsOf));
        const got = take(candidates, remaining, slot.role);
        if (got > 0 && step.note) notes.push({ note: step.note, count: got });
        remaining -= got;
      });

      meta.byRole[slot.role] = slot.count - remaining;
      if (remaining > 0) meta.shortfall += remaining;
      notes.forEach((entry) => {
        meta.fallbacks.push({
          role: slot.role,
          label: slot.label || slot.role,
          note: entry.note,
          count: entry.count
        });
      });
    });

    // 配方全部跑完還是不足額時，用整個 pool 補到目標題數。
    // 這是最後一道防線：使用者按下「12 題」就該拿到 12 題。
    if (picked.length < recipe.count) {
      const short = recipe.count - picked.length;
      const got = take(shuffle(pool, seed + 7), short, "filler");
      if (got > 0) {
        meta.fallbacks.push({ role: "filler", label: "補滿", note: "題庫可用題不足，改抽一般練習題", count: got });
      }
    }

    // ── 對時間預算負最終責任 ──────────────────────────────────
    // planner 只能「估」這個人會拿到多長的題；只有這裡知道實際抽到什麼。
    // 到期複習不受難度上限約束，所以估值常常會偏 —— 由這裡收尾，
    // 讓「15 分鐘每日訓練」真的是 15 分鐘。
    const estimate = (list) =>
      Math.round(list.reduce((sum, entry) => sum + (Number(entry.problem.timeLimit) || 60), 0) * 1.35);

    if (budget) {
      // 砍題時從最不關鍵的角色開始砍。到期複習與弱點是這次訓練的目的，
      // 最後才動它們。
      const dropOrder = ["filler", "boss", "hard", "stretch", "warmup", "maintain", "new", "weak", "review"];
      const minCount = Math.max(1, Number(recipe.minCount) || Math.ceil(recipe.count * 0.6));
      const maxCount = Math.max(recipe.count, Number(recipe.maxCount) || recipe.count);
      let trimmed = 0;

      for (const role of dropOrder) {
        while (estimate(picked) > budget * 1.35 && picked.length > minCount) {
          const index = picked.map((entry) => entry.role).lastIndexOf(role);
          if (index < 0) break;
          used.delete(picked[index].problem.id);
          picked.splice(index, 1);
          trimmed += 1;
        }
        if (estimate(picked) <= budget * 1.35) break;
      }

      // 反過來：抽到的題太短就補幾題，不然「15 分鐘」只做了 6 分鐘
      if (estimate(picked) < budget * 0.75 && picked.length < maxCount) {
        const room = maxCount - picked.length;
        const added = take(shuffle(pool, seed + 11), room, "filler");
        while (estimate(picked) > budget * 1.35 && picked.length > minCount) {
          const index = picked.map((entry) => entry.role).lastIndexOf("filler");
          if (index < 0) break;
          used.delete(picked[index].problem.id);
          picked.splice(index, 1);
        }
        if (added > 0) meta.extended = picked.length;
      }

      if (trimmed > 0) meta.trimmed = trimmed;
    }

    const problems = picked.map((entry) => entry.problem);
    const estSeconds = estimate(picked);

    return {
      problems,
      roles: picked.map((entry) => entry.role),
      estSeconds,
      meta: Object.assign(meta, {
        requested: recipe.count,
        delivered: problems.length,
        // 「抽滿」的定義是「拿到配方要的題數，或為了守住時間預算而合理調整過」，
        // 不是「剛好等於一開始那個數字」。
        complete: problems.length === recipe.count || Boolean(meta.trimmed || meta.extended)
      })
    };
  }

  // 把降級情況翻成一句人話。UI 要能誠實說明「為什麼跟講好的不一樣」。
  function explainFallbacks(meta) {
    if (!meta || !meta.fallbacks || !meta.fallbacks.length) return "";
    const first = meta.fallbacks[0];
    const extra = meta.fallbacks.length - 1;
    const base = `${first.label}${first.note}（${first.count} 題）`;
    return extra > 0 ? `${base}，另有 ${extra} 項調整` : base;
  }

  const api = {
    version: 1,
    fill,
    explainFallbacks,
    shuffle,
    seedFrom
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.BuzzSession = api;
})();
