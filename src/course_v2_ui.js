// ── 新版課程的畫面（中文介面專用）──
//
// 內容：src/course_v2/outline.js（大綱）＋ stage-<n>.js（課文），由 tools/build_course_v2.js 從
// tools/content/course_v2/ 產生。這支跟 outline.js 是 index.html 上的 type="text/lazy" data-lazy="course"：
// 打開課程（或新手首頁要畫主卡）才抓；課文按 Stage 分檔，打開某一課才抓那一個 Stage。
// 英文介面不載這支：course.js 的 create() 在英文時用舊的 25 課（它們有英文，新版還沒翻）。
// 所以這裡的字直接寫中文，不包 t()（validate_i18n 也不掃這支）。
//
// 顯示規則（review 認可的 v0.8 樣稿）：
//   觀念預設顯示；collapsible 的段落（完整定理條件、嚴格證明、預告）預設收起；
//   範例一步一步揭；常見錯誤是短句清單；小測選錯才顯示那個選項的理由；挑戰題另外標；
//   通過三層 —— 完成（小測第一次就選對 ≥ 3 題）／熟練（核心推薦題全對）／全破（含挑戰全對）—— 不鎖課；
//   閱讀時間與完成時間分開；課號照大綱順序算，正文的〈課名〉連到那一課；visual（給作者的文字規格）不顯示，
//   畫面上的圖是 figures（畫法在 course_figures.js 的 BuzzCourseFigures，data-lazy="figures"），放在 after 指定的觀念段落之後。
//
// 版面（書本式單欄，細節見 course_v2_style.js 與 renderLesson）：觀念①要在手機第一屏；手機黏位置條、≥ 960px 換左側目錄。
// 有 sections 的課預設一節一屏（course_sections.js），全文就是這一頁。
// 狀態：哪一課、範例揭到第幾步、小測選過哪些；收合段落用 <details data-keep>（app.js 重繪時接回）。
// 進度存 records.courseV2[id]；推薦題對錯直接看 records.problemStats。

(function () {
  "use strict";

  const TIER_NAMES = ["", "完成", "熟練", "全破"];
  const PASS = 3;

  // 樣式在 src/course_v2_style.js（data-lazy="coursestyle"，跟這一組一起抓）：課程組的預算給畫面與邏輯

  function injectStyle() {
    if (typeof document === "undefined" || !document.head || document.getElementById("cv2-style")) return;
    const node = document.createElement("style");
    node.id = "cv2-style";
    node.textContent = window.BUZZ_COURSE_V2_STYLE || "";
    document.head.appendChild(node);
  }

  function create(deps) {
    const { escapeHtml, escapeAttr, icon, loadRecords, saveRecords, render, go, startQuiz, legacy } = deps;
    const outline = window.BUZZ_COURSE_V2;
    const lessonData = (id) => (window.BUZZ_COURSE_V2_LESSONS || {})[id] || null;
    injectStyle();

    /* ── 大綱索引：課號在這裡算（Stage 編號.在 Stage 裡的第幾課），資料裡不存 ── */
    const order = [];
    const meta = {};
    const titleIds = {};
    const problemLesson = {};
    outline.stages.forEach((stage) => {
      let k = 0;
      stage.chapters.forEach((chapter) => chapter.lessons.forEach((raw) => {
        k += 1;
        const practice = String(raw.practice || "").split(" ").filter(Boolean).map((token) => {
          const kind = token.endsWith("*") ? "core" : token.endsWith("!") ? "challenge" : "";
          return { id: kind ? token.slice(0, -1) : token, kind };
        });
        const m = {
          id: raw.id, title: raw.title, no: `${stage.n}.${k}`, stage, chapter,
          available: typeof raw.read === "number", read: raw.read, total: raw.total, practice,
          worked: String(raw.worked || "").split(" ").filter(Boolean)
        };
        order.push(m);
        meta[m.id] = m;
        (titleIds[m.title] = titleIds[m.title] || []).push(m.id);
        if (m.available) practice.concat(m.worked.map((id) => ({ id }))).forEach((p) => { if (!problemLesson[p.id]) problemLesson[p.id] = m.id; });
      }));
    });
    // 章首魔王題（outline.bosses）：章 → rows = 第一課到 payoff；還差 n 課 = rows 裡沒完成的。其餘在 course_boss.js
    const bossBy = {};
    outline.stages.forEach((s) => s.chapters.forEach((c) => {
      const b = (outline.bosses || {})[c.code];
      if (!b || !meta[b.at]) return;
      const rows = order.filter((x) => x.chapter === c);
      bossBy[c.code] = c.boss = { ...b, code: c.code, rows: rows.slice(0, rows.indexOf(meta[b.at]) + 1) };
    }));
    const bossSolved = (records, code) => (records.courseV2Boss || {})[code];
    const bossLeft = (records, B, except) => B.rows.filter((x) => x !== except && !isDone(records, x)).length;
    const track = (name, params) => deps.track && deps.track(name, params);
    // course_boss.js 還沒載到：先不畫，載到了重繪
    let bossLoad = 0;
    const bossUI = () => window.BuzzCourseBoss || (bossLoad++ || Promise.resolve(deps.ensureLazy("boss")).then(() => render(), () => {}), null);
    const kit = () => ({ bossBy, bossSolved, bossLeft, isDone, meta, neighbour, label, problem, deps, track, loadRecords });
    const bossView = (records, m) => (m.chapter.boss && bossUI() ? bossUI().view(kit(), records, m, state) : null);
    const live = order.filter((m) => m.available);
    const mainPath = live.filter((m) => !m.stage.branch);
    const usedProblems = new Set(Object.keys(problemLesson));
    const neighbour = (m, step) => {
      const at = live.indexOf(m);
      return at < 0 ? null : live[at + step] || null;
    };
    const label = (m) => `${m.no} ${m.title}`;

    let problemMap = null;
    const problem = (id) => {
      if (!problemMap) problemMap = new Map((window.BUZZ_PROBLEMS || []).map((p) => [p.id, p]));
      return problemMap.get(id) || null;
    };

    /* ── 紀錄 ── */
    const entryOf = (records, id) => ((records.courseV2 || {})[id]) || {};
    const solved = (records, problemId) => {
      const stat = (records.problemStats || {})[problemId];
      return Boolean(stat && stat.correct > 0);
    };
    // 三層是累進的：熟練要先完成、全破要先熟練。沒有核心題的課，熟練跟著「全部推薦題」走。
    // 沒有推薦題的課（19 課，多半是預備與證明入門）：小測完成就是全破 —— 不然它們永遠卡在完成，
    // 地圖、課程表、結算、層級 XP 全都跟著這一支，所以三層加成也一次發齊（course_sections.js 的 settle）。
    function tierOf(records, m) {
      if (!entryOf(records, m.id).doneAt) return 0;
      const all = m.practice.filter((p) => problem(p.id));
      if (!all.length) return 3;
      const core = all.filter((p) => p.kind === "core");
      const coreOk = (core.length ? core : all.filter((p) => p.kind !== "challenge")).every((p) => solved(records, p.id));
      if (!coreOk) return 1;
      return all.every((p) => solved(records, p.id)) ? 3 : 2;
    }
    const isDone = (records, m) => Boolean(entryOf(records, m.id).doneAt);
    // 三層各差多少（畫面寫數字，不寫規則）：完成看小測「第一次就選對」幾題（這一輪還在做就看這一輪）、
    // 熟練看核心題（沒有核心題：非挑戰的推薦題）、全破看全部推薦題（含挑戰）。left = 還沒對的題號，結算的按鈕用
    function progressOf(records, m) {
      const e = entryOf(records, m.id);
      const data = lessonData(m.id);
      let quiz = Number(e.quizBest) || 0;
      if (data) {
        const live = state.lessonId === m.id && Object.keys(state.picks || {}).some((k) => (state.picks[k] || []).length);
        const picks = live ? state.picks : e.picks || {};
        const first = data.checks.filter((c, ci) => { const p = picks[ci] || []; return p.length && c.options[p[0]] && c.options[p[0]].correct; }).length;
        quiz = live ? first : Math.max(quiz, first);
      }
      const all = m.practice.filter((p) => problem(p.id));
      const core = all.filter((p) => p.kind === "core");
      const mid = core.length ? core : all.filter((p) => p.kind !== "challenge");
      const tally = (list) => ({ ok: list.filter((p) => solved(records, p.id)).length, n: list.length, left: list.filter((p) => !solved(records, p.id)).map((p) => p.id) });
      return { tier: tierOf(records, m), pass: PASS, none: !all.length, tried: e.quizBest !== undefined, quiz: Math.min(quiz, PASS), mid: tally(mid), all: tally(all), midName: core.length ? "核心題" : "推薦題", allName: all.some((p) => p.kind === "challenge") ? "含挑戰" : "全部" };
    }
    // 還沒到的下兩層各差多少（到了的看層級標籤）——「完成 小測首次就對 2/3 · 熟練 核心題 1/4」。
    // 全文：標題下自成一行；分節（inline）：擠進課號那一列、字短一點（第一句要在手機第一屏上半，多一行就掉下去）。
    // 沒有推薦題的課只有完成（完成就是全破，全文多寫半句）；全破了不印
    function ruleLine(records, m, inline) {
      const g = progressOf(records, m);
      const title = g.none ? "這一課沒有推薦題：小測完成就是全破" : `完成：小測首次就對 ${PASS} 題 · 熟練：${g.midName}全對 · 全破：${g.allName === "含挑戰" ? "含挑戰全對" : "全部全對"}`;
      const segs = [[1, "完成", inline ? "小測" : "小測首次就對", g.quiz, PASS]].concat(g.all.n ? [[2, "熟練", g.midName, g.mid.ok, g.mid.n], [3, "全破", g.allName, g.all.ok, g.all.n]] : [])
        .filter(([i]) => i > g.tier).slice(0, 2);
      const tag = inline ? "span" : "p";
      return segs.length ? `<${tag} class="cv2-rule" data-cv2-rule title="${title}">${segs.map(([i, name, what, ok, n]) => `<span data-tier="${i}">${name} <b>${what} ${ok}/${n}</b></span>`).join("")}${g.none && !inline ? `<span data-tier="3">沒有推薦題：完成就是全破</span>` : ""}</${tag}>` : "";
    }
    const nextLesson = (records) => mainPath.find((m) => !isDone(records, m)) || null;
    function update(id, change) {
      const records = loadRecords();
      records.courseV2 = records.courseV2 || {};
      records.courseV2[id] = change({ ...(records.courseV2[id] || {}) });
      saveRecords(records);
    }

    /* ── 課文載入（按章：src/course_v2/ch-<章>.js；檔名規則跟 tools/build_course_v2.js 的 chapterFile 一樣）── */
    const chapterFile = (code) => `src/course_v2/ch-${String(code).toLowerCase().replace(/[^a-z0-9]+/g, "-")}.js`;
    const chapterState = {};
    function loadChapter(chapter) {
      const src = chapterFile(chapter.code);
      if (chapterState[src] === "loading" || chapterState[src] === "ready") return;
      chapterState[src] = "loading";
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => { chapterState[src] = "ready"; render(); };
      script.onerror = () => { chapterState[src] = "failed"; script.remove(); render(); };
      document.head.appendChild(script);
    }
    // 圖（figures、widget）的畫法在 course_figures.js（data-lazy="figures"）：有圖的課才抓（分節的句子帶 fig 也是指到這一課的圖）
    let figuresFail = false;
    let figuresLoading = false;
    const needsFigures = (data) => Boolean(data && data.figures && data.figures.length && !window.BuzzCourseFigures);
    // 離線：打開過的課離線也讀得到 —— 打開一課就抓那一章（經過 sw.js 存進快取，cache-first）；分節的結算畫面（secfinish）平常讀到
    // 最後一節才載，這裡在閒置時先抓一次（只抓不執行）讓它也進快取。閒下來時再抓「下一課」那一章（跟這一章不同才抓；
    // 省流量模式 Save-Data 或 2G 不抓）。不再整套預抓：舊版打開課程表就把 74 章全抓一遍（約 3.6MB、brotli 約 1MB），大多沒人讀。
    // 只有已經有 service worker 在管的頁面才做，不然抓了也存不起來。規則由 tools/validate_offline_assets.js 守。
    const swControlled = () => typeof navigator !== "undefined" && Boolean(navigator.serviceWorker && navigator.serviceWorker.controller) && typeof fetch === "function";
    const leanNet = () => { const net = (typeof navigator !== "undefined" && navigator.connection) || {}; return Boolean(net.saveData || /2g/.test(net.effectiveType || "")); };
    const lazySrcs = (group) => [...document.querySelectorAll(`script[type="text/lazy"][data-lazy="${group}"]`)].map((n) => n.getAttribute("src"));
    const warmed = new Set();
    function warm(src) {
      if (!src || warmed.has(src)) return;
      warmed.add(src);
      fetch(src).catch(() => warmed.delete(src));
    }
    let prefetchedFor = "";
    function prefetchNext(m, data) {
      if (prefetchedFor === m.id || !swControlled()) return;
      prefetchedFor = m.id;
      const idle = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 1500));
      idle(() => {
        if (data && data.sections && !window.BuzzCourseFinish) lazySrcs("secfinish").forEach(warm);
        const next = neighbour(m, 1);
        if (!next || leanNet()) return;
        const src = chapterFile(next.chapter.code);
        if (src !== chapterFile(m.chapter.code) && chapterState[src] !== "ready") warm(src);
      });
    }

    /* ── 文字：行內數學 $…$ ＋ 跳脫 ＋ 上下標 ＋〈課名〉變成連到那一課的連結 ──
       行內數學寫成 $…$（KaTeX，跟題目同一份 assets/vendor/katex）：先切出來交給 KaTeX，
       throwOnError:false —— 一段寫壞的式子只會變成紅字，不會讓整頁畫不出來。\$ 是字面上的錢號。
       $…$ 以外還是 Unicode 純文字（轉換期間兩種寫法並存），上下標照作者的寫法：lim_{x→0}、Σ_{n=1}^∞、a_n。
       畫成 <sub>/<sup>，只認大括號一層、或底線／次方後面單一個字元；這一層碰不到 $…$ 裡面。 */
    const SCRIPT_CHAR = "[A-Za-z0-9α-ωΑ-Ω∞πθφ+\\-−′]";
    const SUB_SUP = [
      [/_\{([^{}]*)\}/g, "<sub>$1</sub>"],
      [/\^\{([^{}]*)\}/g, "<sup>$1</sup>"],
      [new RegExp(`_(${SCRIPT_CHAR})`, "g"), "<sub>$1</sub>"],
      [new RegExp(`\\^(${SCRIPT_CHAR})`, "g"), "<sup>$1</sup>"]
    ];
    // 切段：偶數格是文字、奇數格是數學。不用 lookbehind 正規式 —— iOS 16.4 以前的 Safari 一看到就整支檔解析失敗。
    // 落單的 $（沒有成對）當成文字。
    function splitMath(text) {
      const parts = [];
      let buf = "";
      let open = -1;
      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        if (ch === "$" && text[i - 1] !== "\\") {
          if (open < 0) { parts.push(buf); buf = ""; open = i; } else { parts.push(buf); buf = ""; open = -1; }
          continue;
        }
        buf += ch;
      }
      if (open >= 0) parts[parts.length - 1] += `$${buf}`;
      else parts.push(buf);
      return parts;
    }
    const mathCache = new Map();
    function inlineMath(tex) {
      if (mathCache.has(tex)) return mathCache.get(tex);
      let html = "";
      if (window.katex) {
        try {
          html = window.katex.renderToString(tex, { displayMode: false, throwOnError: false, strict: "ignore", output: "htmlAndMathml" });
        } catch (_error) {
          html = "";
        }
      }
      const out = `<span class="cv2-math">${html || (window.BuzzTexLite ? window.BuzzTexLite.renderLiteTex(tex, false) : escapeHtml(tex))}</span>`;
      if (html) mathCache.set(tex, out);
      return out;
    }
    const plain = (text) => SUB_SUP.reduce((out, [pattern, html]) => out.replace(pattern, html), escapeHtml(String(text).replace(/\\\$/g, "$")));
    // 把文字切成「數學」與「文字」兩種段，文字段再交給 each 處理
    // 式子後面緊跟的全形標點黏在式子上（不然「，」會被擠到下一行開頭）；只黏短式子，長式子要留著能斷行
    const GLUE = /^[，。、；：！？）」』]/;
    const withMath = (text, each) => {
      const parts = splitMath(String(text || ""));
      return parts.map((part, i) => {
        if (!(i % 2)) return each(i > 0 && parts[i - 1].length <= 40 && GLUE.test(part) && parts[i - 1].trim() ? part.slice(1) : part);
        if (!part.trim()) return "";
        const next = parts[i + 1] || "";
        return part.length <= 40 && GLUE.test(next) ? `<span class="cv2-glue">${inlineMath(part)}${escapeHtml(next[0])}</span>` : inlineMath(part);
      }).join("");
    };
    const fmt = (text) => withMath(text, plain);
    function rich(text, context) {
      return withMath(text, (chunk) => chunk.split(/(〈[^〈〉]+〉)/).map((part) => {
        const hit = /^〈([^〈〉]+)〉$/.exec(part);
        if (!hit) return plain(part);
        const ids = (titleIds[hit[1]] || []).filter((id) => meta[id].available);
        // 同名的課（例如一維與二維的「臨界點」）：先找這一課的先修／相關／下一課裡的那一個
        const near = context ? [...(context.related || []), ...(context.prerequisites || []), ...(context.next || [])] : [];
        const id = ids.find((x) => near.includes(x)) || ids[0];
        if (!id || (context && id === context.id)) return escapeHtml(part);
        return `<button type="button" class="cv2-link" data-action="open-course-lesson" data-lesson-id="${escapeAttr(id)}">${escapeHtml(part)}</button>`;
      }).join(""));
    }
    const lessonLink = (id) => (meta[id] ? (meta[id].available
      ? `<button type="button" class="cv2-link" data-action="open-course-lesson" data-lesson-id="${escapeAttr(id)}">〈${escapeHtml(meta[id].title)}〉</button>`
      : `<span>〈${escapeHtml(meta[id].title)}〉</span>`) : "");
    const tierPill = (tier) => (tier ? `<em class="cv2-tier t${tier}">${TIER_NAMES[tier]}</em>` : "");

    // 課程表的章名下一行；點了打開這一章還沒完成的第一課（解開了：第一課）
    function bossLine(records, B) {
      const done = bossSolved(records, B.code);
      const n = bossLeft(records, B);
      const to = (!done && B.rows.find((x) => !isDone(records, x))) || B.rows[0];
      return `<button type="button" class="cv2-boss" data-action="open-course-lesson" data-lesson-id="${escapeAttr(to.id)}" data-cv2-boss="${escapeAttr(B.code)}">${icon("trophy")}<span>${escapeHtml(B.h)}</span><small>${done ? "已解開" : n ? `還差 ${n} 課` : "解得開了"}</small></button>`;
    }

    /* ── 課程表 ── */
    function renderIndex(records) {
      // 從別的畫面回到課程表（DOM 上還不是課程表）：畫完捲回離開時的位置
      if (back && typeof document !== "undefined" && !document.querySelector(".cv2-index")) {
        if (typeof queueMicrotask === "function") queueMicrotask(restoreIndex); else window.setTimeout(restoreIndex, 0);
      }
      if (indexView === "map") {
        if (typeof queueMicrotask === "function") queueMicrotask(setupMap); else window.setTimeout(setupMap, 0);
      }
      const next = nextLesson(records);
      const done = mainPath.filter((m) => isDone(records, m)).length;
      const pct = mainPath.length ? Math.round((done / mainPath.length) * 100) : 0;
      const openStage = next ? next.stage : null;
      // 一課一列：課號 · 課名 · 分鐘 · 狀態點（完成綠／熟練藍／全破金；字給螢幕閱讀器與測試）
      const rowTitle = (r, m, tier) => {
        if (!tier) return "還沒完成";
        const g = progressOf(r, m);
        return tier === 1 && g.mid.n ? `完成 · 熟練還差${g.midName} ${g.mid.n - g.mid.ok} 題` : tier === 2 ? `熟練 · 全破還差 ${g.all.n - g.all.ok} 題` : TIER_NAMES[tier];
      };
      const row = (m) => {
        if (!m.available) {
          return `<li><span class="cv2-row is-soon"><span class="cv2-row-no">${m.no}</span><strong>${escapeHtml(m.title)}</strong><small>尚未開放</small><i></i></span></li>`;
        }
        const tier = tierOf(records, m);
        return `<li><button type="button" class="cv2-row ${next === m ? "is-next" : ""} ${tier ? "is-done" : ""}" data-action="open-course-lesson" data-lesson-id="${escapeAttr(m.id)}"><span class="cv2-row-no">${m.no}</span><strong>${escapeHtml(m.title)}</strong><small>${m.read} 分</small><i class="cv2-dot ${tier ? `t${tier}` : ""}" title="${rowTitle(records, m, tier)}">${tier ? `<span class="sr-only">${TIER_NAMES[tier]}</span>` : ""}</i></button></li>`;
      };
      // Stage 是有標題的段落（細進度條），章是小標，課是平的清單；只有目前的 Stage 展開
      const stages = outline.stages.map((stage) => {
        const inStage = order.filter((m) => m.stage === stage);
        const ready = inStage.filter((m) => m.available);
        const stageDone = ready.filter((m) => isDone(records, m)).length;
        const stagePct = ready.length ? Math.round((stageDone / ready.length) * 100) : 0;
        const chapters = stage.chapters.map((chapter) => {
          const rows = order.filter((m) => m.chapter === chapter);
          const chapterDone = rows.filter((m) => m.available && isDone(records, m)).length;
          return `
            <section class="cv2-chapter">
              <p class="cv2-chapter-label">${escapeHtml(chapter.title)}<small>${chapterDone} / ${rows.length}</small></p>
              ${chapter.boss ? bossLine(records, chapter.boss) : ""}
              <ol class="cv2-rows">${rows.map(row).join("")}</ol>
            </section>`;
        }).join("");
        return `
          <details class="cv2-stage ${ready.length && stageDone === ready.length ? "is-done" : ""}" data-keep="cv2-stage-${stage.n}" ${openStage === stage ? "open" : ""}>
            <summary>
              <span class="cv2-stage-no">${stage.n}</span>
              <span class="cv2-stage-name"><strong>${escapeHtml(stage.title)}</strong>${stage.branch ? `<em class="cv2-branch">支線</em>` : ""}</span>
              <small class="cv2-count">${stageDone} / ${inStage.length}</small>
              ${icon("chevron-right")}
              <i class="cv2-bar" style="--pct:${stagePct}%"></i>
            </summary>
            <div class="cv2-stage-body">${chapters}</div>
          </details>`;
      }).join("");
      return `
        <main class="screen">
          <section class="course-index cv2-index ${indexView === "map" ? "is-map" : ""}">
            <div class="page-head">
              <div>
                <p class="section-label">課程</p>
                <h2>微積分 · ${order.length} 課</h2>
              </div>
              <div class="action-row">
                ${next ? `<button class="button home-primary" data-action="open-course-lesson" data-lesson-id="${escapeAttr(next.id)}">${icon("play")}${done || entryOf(records, next.id).openedAt ? "繼續" : "開始"}：${escapeHtml(label(next))}</button>` : ""}
              </div>
            </div>
            <div class="cv2-viewbar">
              ${indexView === "map" ? litLine(records) : `<div class="course-progress"><strong>${done}<small> / ${mainPath.length} 課 · 主線</small></strong><i style="--pct:${pct}%"></i></div>`}
              <div class="cv2-seg" role="group" aria-label="檢視">${[["list", "清單"], ["map", "地圖"]].map(([key, name]) => `<button type="button" data-action="course-view" data-mode="${key}" aria-pressed="${indexView === key}">${name}</button>`).join("")}</div>
            </div>
            <p class="cv2-legend" data-cv2-legend><span><i class="cv2-dot t1"></i>完成：小測首次就對 ${PASS} 題</span><span><i class="cv2-dot t2"></i>熟練：核心題全對</span><span><i class="cv2-dot t3"></i>全破：含挑戰全對</span></p>
            ${indexView === "map" ? `<div class="cv2-map" data-cv2-map><p class="panel-note">載入地圖…</p></div>` : `
            ${goalLine(records)}
            <div class="cv2-stages">${stages}</div>
            ${renderGraduationCard(records)}`}
          </section>
        </main>`;
    }

    /* ── 課程地圖（清單／地圖切換的「地圖」）──
       畫法與版面在 course_map.js ＋ course_v2/map.js（data-lazy="map"，第一次切到地圖才抓）。
       app 整頁重繪會換掉容器，所以每次畫完課程表就重新掛上去；相機與選取由地圖自己留著。 */
    let indexView = "list";
    let mapFocus = "";
    let mapLit = "";
    /* ── 回課程表接回原處 ──
       打開一課時記下：那一列在畫面上的 y、整頁捲到哪、哪些 Stage 開著。回來（‹ 課程表、側欄／分頁列、瀏覽器上一頁）時
       把同一列捲回同一個 y（高度變了也找得到它；不是從課程表點進去的就捲到畫面中間），亮一下、拿焦點；地圖保留相機、選那一課。 */
    let back = null;
    function rememberIndex(id) {
      const root = typeof document !== "undefined" && document.querySelector(".cv2-index");
      const row = root && root.querySelector(`.cv2-row[data-lesson-id="${id}"]`);
      // 不是從課程表點進來的（下一課、結算、首頁）：開著的 Stage 照上次記的，那一列捲到畫面中間
      back = root ? { id, view: indexView, top: row ? row.getBoundingClientRect().top : null, y: window.scrollY, stages: indexView === "list" ? [...root.querySelectorAll("details.cv2-stage[open]")].map((d) => d.dataset.keep) : null }
        : { id, view: indexView, top: null, y: null, stages: back ? back.stages : null };
      mapBack = id;
    }
    function restoreIndex() {
      const b = back;
      const root = b && document.querySelector(".cv2-index");
      if (!root) return;
      const row = indexView === "list" && root.querySelector(`.cv2-row[data-lesson-id="${b.id}"]`);
      if (!row) { if (b.y !== null && b.view === indexView) window.scrollTo(0, b.y); return; }
      if (b.stages) root.querySelectorAll("details.cv2-stage").forEach((d) => { d.open = b.stages.includes(d.dataset.keep); });
      const stage = row.closest("details");
      if (stage) stage.open = true;
      if (b.top !== null) window.scrollTo(0, window.scrollY + row.getBoundingClientRect().top - b.top);
      else row.scrollIntoView({ block: "center" });
      row.classList.add("is-left");
      row.focus({ preventScroll: true });
    }
    let mapBack = "";
    // 瀏覽器／手機的上一頁：一課（含連著讀的下一課）→ 課程表，而不是離開網站。打開一課時推一格 history（網址不變）
    const inLesson = () => typeof document !== "undefined" && Boolean(document.querySelector("#app .cv2-lesson"));
    const ourEntry = () => Boolean(window.history && window.history.state && window.history.state.cv2);
    let popGuard = 0;
    // 自己正在退那一格（history.back() 還沒回來）：別再退第二次，不然會連網站一起退掉
    let backing = false;
    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("popstate", () => { popGuard += 1; backing = false; if (inLesson()) go("course"); });
    }
    // 從一課走別的路離開（首頁、分頁列、練推薦題、在地圖上看…）：打開時推的那一格要收回，
    // 不然它留在最上面，之後按一次上一頁什麼都不會發生（app.js 換畫面時呼叫）。
    // 收回是 history.back()：popstate 晚一拍才到，那時畫面已經不是一課，上面那支 listener 什麼都不做。
    function leftLesson() {
      if (!ourEntry() || backing) return;
      backing = true;
      window.history.back();
    }
    // 地圖的偏好（目標一課、篩選）存在 records.courseMap：跟著紀錄走（同步、匯出），不另外開 localStorage 的鍵
    const mapPrefs = (records) => records.courseMap || {};
    function mapOptions(records) {
      const next = nextLesson(records);
      const prefs = mapPrefs(records);
      const graph = window.BuzzSkillGraph;
      return {
        lessons: order.map((m) => ({
          id: m.id, no: m.no, title: m.title, stageTitle: m.stage.title, branch: Boolean(m.stage.branch),
          read: m.read, total: m.total, available: m.available, tier: tierOf(records, m), opened: Boolean(entryOf(records, m.id).openedAt),
          boss: m.chapter.boss && m.chapter.boss.at === m.id ? (bossSolved(records, m.chapter.boss.code) ? "魔王題已解開" : `讀完就解得開魔王題：${m.chapter.boss.h}`) : "",
          practice: m.practice.filter((p) => problem(p.id))
        })),
        stages: outline.stages,
        crowns: new Set(deps.focusModeOn && deps.focusModeOn() ? [] : Object.keys(records.courseV2Boss || {})),
        next: next ? order.indexOf(next) : -1,
        // 「該練」用的：紀錄本身、能力模型（app 的 abilityProfile，有快取）、題目 → 技巧
        records,
        profile: deps.abilityProfile ? deps.abilityProfile(records) : null,
        skillsOf: (id) => (graph && problem(id) ? graph.skillsForProblem(problem(id)) || [] : []),
        now: Date.now(),
        goal: meta[prefs.goal] ? prefs.goal : "",
        filter: ["ready", "practice"].includes(prefs.filter) ? prefs.filter : "all",
        quiet: deps.focusModeOn ? deps.focusModeOn() : false,
        focusId: mapFocus,
        litId: mapLit,
        selectId: mapBack,
        escapeHtml,
        escapeAttr,
        open: (id) => act("open-course-lesson", { lessonId: id })
      };
    }
    // 地圖檢視的進度（取代主線進度條）：點亮 = 完成的課（含支線），熟練有才寫。數字直接寫，不跑動畫
    function litLine(records) {
      const lit = order.filter((m) => isDone(records, m)).length;
      const good = order.filter((m) => tierOf(records, m) >= 2).length;
      return `<p class="course-progress cmap-lit" data-cv2-lit>已點亮 <strong>${lit}</strong> / ${order.length}${good ? ` · 熟練 ${good}` : ""}</p>`;
    }
    // 課程表（清單）上的目標：一行字＋「照順序學」。先修的圖在地圖那一組（data-lazy="map"），
    // 只有設了目標的人才為這一行去抓它（設目標本來就是在地圖上設的，通常已經在快取裡）
    let goalLoad = false;
    function goalLine(records) {
      const m = meta[mapPrefs(records).goal];
      if (!m) return "";
      if (!window.BuzzCourseMap || !window.BUZZ_COURSE_MAP) {
        if (!goalLoad) { goalLoad = true; Promise.resolve(deps.ensureLazy("map")).then(() => render(), () => {}); }
        return "";
      }
      const g = window.BuzzCourseMap.goal(order.map((x) => isDone(records, x)), order.indexOf(m), order.map((x) => x.total));
      if (!g) return "";
      return `<p class="cv2-goal" data-cv2-goal>目標 <b>${escapeHtml(label(m))}</b>${g.missing
        ? `<span>還差 ${g.missing} 課 · 約 ${g.minutes} 分鐘</span><button type="button" class="button secondary" data-action="open-course-lesson" data-lesson-id="${escapeAttr(order[g.first].id)}">照順序學</button>`
        : `<span>完成了</span><button type="button" class="button ghost" data-action="course-goal" data-lesson-id="">清除目標</button>`}</p>`;
    }
    function setupMap() {
      const el = typeof document !== "undefined" && document.querySelector("[data-cv2-map]");
      if (!el) return;
      const mount = () => {
        if (!el.isConnected) return;
        if (window.BuzzCourseMap.attach(el, mapOptions(loadRecords()))) mapFocus = mapLit = mapBack = "";
      };
      if (window.BuzzCourseMap && window.BUZZ_COURSE_MAP) return mount();
      Promise.resolve(deps.ensureLazy("map")).then(mount, () => {
        if (el.isConnected) el.innerHTML = `<p class="panel-note">地圖載不進來 —— 檢查一下網路再試一次。</p>`;
      });
    }

    // 畢業關（跟舊課共用題目與判定，見 course.js 的橋池）：新版不鎖，課程表最底下隨時可以考
    function renderGraduationCard(records) {
      const grad = legacy.graduation(records);
      if (grad && grad.passed) {
        return `<section class="course-graduation is-passed"><p class="section-label">畢業關</p><strong>${icon("check")}畢業了 · ${grad.correct} / ${grad.total}</strong><div class="action-row"><button class="button ghost" data-action="course-graduation">${icon("refresh")}再考一次</button></div></section>`;
      }
      return `<section class="course-graduation"><p class="section-label">畢業關</p><strong>${grad ? `上次 ${grad.correct} / ${grad.total}，再來一次` : "10 題，8 題過關"}</strong><small>極限、微分、積分的基礎題，不倒數。過了，主線就不再只出基礎題。</small><div class="action-row"><button class="button" data-action="course-graduation">${icon("play")}${grad ? "再考一次" : "開始畢業關"}</button></div></section>`;
    }

    /* ── 單課 ── */
    let state = { lessonId: "", steps: {}, picks: {}, figs: {}, recorded: false };
    let secFail = false;
    const sec = (fn) => Promise.resolve(deps.ensureLazy("sections")).then(fn, () => { secFail = true; render(); });
    const secApi = (records, head) => { const m = meta[state.lessonId]; return { m, data: lessonData(m.id), records, head, state, fmt, rich, update, tierOf: (r) => tierOf(r, m), progress: (r) => progressOf(r, m), next: neighbour(m, 1), label, lessonLink, deps, act, boss: bossView(records, m) }; };

    // 圖的滑桿：只換那一張圖（不整頁重繪 —— 拖動時每一格都重繪整課太貴）；值記在 state.figs，
    // 之後別的動作重繪時圖停在原地。委派在 document 上，app.js 重繪換掉 DOM 也不用重綁。
    if (typeof document !== "undefined" && document.addEventListener) {
      document.addEventListener("input", (event) => {
        const input = event.target;
        if (!input || !input.matches || !input.matches("[data-cv2-slider]")) return;
        const data = lessonData(state.lessonId);
        const k = Number(input.dataset.cv2Slider);
        const fig = data && (data.figures || [])[k];
        const node = input.closest("[data-cv2-fig]");
        if (!fig || !node) return;
        const value = Number(input.value);
        state.figs = { ...state.figs, [k]: value };
        const shown = window.BuzzCourseFigures.view(fig, value, escapeAttr);
        node.querySelector("[data-cv2-plot]").innerHTML = shown.plot;
        node.querySelector("[data-cv2-readout]").textContent = shown.readout;
      });
    }

    /* ── 讀到哪裡：位置條（手機）與目錄（桌機）──
       每一個段落（觀念的每一小節、範例、小測、練習）掛 data-cv2-mark 與 data-cv2-group。
       IntersectionObserver 看段落跨過「頂列＋位置條下面一點」那條線；捲動另外更新位置條下面的閱讀進度。
       整頁重繪（innerHTML 換掉）之後 render 完的那個 microtask 重新接上；離開這一課就自己拆掉。 */
    const reading = { io: null, onScroll: null, frame: 0, group: "concept", mark: "c0", land: "" };
    function teardownReading() {
      if (reading.io) reading.io.disconnect();
      if (reading.frame) window.cancelAnimationFrame(reading.frame);
      reading.frame = 0;
      if (reading.onScroll) window.removeEventListener("scroll", reading.onScroll);
      reading.io = null;
      reading.onScroll = null;
    }
    function setupReading() {
      teardownReading();
      const root = typeof document !== "undefined" && document.querySelector(".cv2-lesson[data-cv2-reading]");
      reading.root = root || null;
      if (!root) return;
      // 手機的頂列是 sticky、橫跨整個寬度：位置條要貼在它下面。桌機的頂列是左側欄，不佔上方。
      const bar = document.querySelector(".topbar");
      let top = 0;
      if (bar) {
        const r = bar.getBoundingClientRect();
        if (r.width >= document.documentElement.clientWidth - 1 && r.top <= 0.5) top = Math.round(r.bottom);
      }
      root.style.setProperty("--cv2-top", `${top}px`);
      const strip = root.querySelector(".cv2-strip");
      const stripH = strip && strip.offsetParent ? strip.offsetHeight : 0;
      root.style.setProperty("--cv2-strip", `${stripH}px`);
      const targets = [...root.querySelectorAll("[data-cv2-mark]")];
      if (!targets.length) return;
      // 練完回來：捲到推薦題（課文晚到也等得到 —— 這一支每次全文畫完都會跑）
      if (reading.land && reading.land === state.lessonId) {
        const practice = root.querySelector('[data-cv2-mark="practice"]');
        if (practice) { reading.land = ""; practice.scrollIntoView({ block: "start" }); }
      }
      const update = () => {
        reading.frame = 0;
        // 舊頁面排進來的那一格：整頁已經換掉，新的那一份會自己接手，這裡什麼都不拆
        if (!root.isConnected) { if (reading.root === root) teardownReading(); return; }
        const line = top + stripH + Math.min(140, window.innerHeight * 0.22);
        let current = targets[0];
        for (const t of targets) {
          if (t.getBoundingClientRect().top <= line) current = t;
          else break;
        }
        const doc = document.documentElement;
        if (window.scrollY > 0 && window.innerHeight + window.scrollY >= doc.scrollHeight - 4) current = targets[targets.length - 1];
        reading.mark = current.dataset.cv2Mark;
        reading.group = current.dataset.cv2Group;
        (root.closest(".cv2-layout") || root).querySelectorAll("[data-cv2-jump]").forEach((b) => {
          const on = b.dataset.cv2Jump === (b.closest(".cv2-strip") ? reading.group : reading.mark);
          b.classList.toggle("is-on", on);
          if (on) b.setAttribute("aria-current", "location"); else b.removeAttribute("aria-current");
        });
        const box = root.getBoundingClientRect();
        const span = Math.max(1, box.height - window.innerHeight + line);
        root.style.setProperty("--cv2-read", `${Math.round(Math.min(1, Math.max(0, (line - box.top) / span)) * 1000) / 10}%`);
      };
      const schedule = () => { if (!reading.frame) reading.frame = window.requestAnimationFrame(update); };
      if (typeof IntersectionObserver === "function") {
        reading.io = new IntersectionObserver(schedule, { rootMargin: `-${top + stripH}px 0px -60% 0px`, threshold: [0, 1] });
        targets.forEach((t) => reading.io.observe(t));
      }
      reading.onScroll = schedule;
      window.addEventListener("scroll", schedule, { passive: true });
      update();
    }
    // 點位置條或目錄：捲到那一段（scroll-margin-top 讓標題停在位置條下面，不被蓋住）
    if (typeof document !== "undefined" && document.addEventListener) {
      document.addEventListener("click", (event) => {
        const button = event.target && event.target.closest ? event.target.closest("[data-cv2-jump]") : null;
        if (!button) return;
        const root = button.closest(".cv2-layout");
        const key = button.dataset.cv2Jump;
        const target = root && (root.querySelector(`[data-cv2-mark="${key}"]`) || root.querySelector(`[data-cv2-group="${key}"]`));
        if (!target) return;
        event.preventDefault();
        const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
      });
    }

    // 回溫的畫面：course_solve.js
    const solve = (fn) => Promise.resolve(deps.ensureLazy("secsolve")).then(fn, () => 0);
    const rvKit = (records) => ({ ...kit(), records, state, fmt, rich, lessonData, loadChapter, render });
    function renderLesson(records) {
      if (state.rv) return window.BuzzCourseSolve ? window.BuzzCourseSolve.page(rvKit(records)) : (solve(render), "<main class=screen></main>");
      const m = meta[state.lessonId];
      if (!m || !m.available) return renderIndex(records);
      const data = lessonData(m.id);
      if (data) prefetchNext(m, data);
      const entry = entryOf(records, m.id);
      const tier = tierOf(records, m);
      // 分節（lesson.sections）：畫面在 course_sections.js（data-lazy="sections"）；選了全文就照舊
      const secMode = data && data.sections && !secFail && (records.settings || {}).courseView !== "full";
      const seg = data && data.sections ? `<div class="cv2-seg" role="group" aria-label="閱讀方式">${[["sec", "分節"], ["full", "全文"]].map(([k, n]) => `<button type="button" data-action="course-s-mode" data-mode="${k}" aria-pressed="${(k === "sec") === Boolean(secMode)}">${n}</button>`).join("")}</div>` : "";
      const kicker = `<p class="cv2-kicker"><button type="button" class="cv2-back" data-action="open-course"><span aria-hidden="true">‹</span>課程表</button><span class="cv2-sep" aria-hidden="true">/</span><span class="section-label">${m.no} · ${escapeHtml(m.stage.title)}${m.stage.branch ? "（支線）" : ""}</span></p>`;
      const mapLink = `<button type="button" class="cv2-link cv2-maplink" data-action="course-map-focus" data-lesson-id="${escapeAttr(m.id)}">在地圖上看</button>`;
      // 標題區要小：課號 · Stage、課名、閱讀／完成時間一行；先修一行、「學完你會」收成一行 —— 觀念①要在手機第一屏
      // 分節模式更緊（第一句要在手機第一屏的上半）：時間、層級、先修、分節／全文擠成一列；先修收成「先修 n」，點了才展開那幾課與「在地圖上看」
      // 第一列：返回（‹）、課名、分節／全文；第二列：課號 · Stage、時間、層級、先修 n（點了展開那幾課與「在地圖上看」）
      const head = secMode ? `
        <header class="page-head cv2-head is-compact">
          <div class="cv2-titlerow">
            <button type="button" class="cv2-back" data-action="open-course" aria-label="回課程表" title="課程表"><span aria-hidden="true">‹</span></button>
            <h2>${escapeHtml(m.title)}</h2>
            ${seg}
          </div>
          <div class="cv2-meta"><span class="section-label">${m.no}</span>${tierPill(tier)}${ruleLine(records, m, true)}${data.prerequisites.length
            ? `<details class="cv2-pre" data-keep="cv2-pre-${escapeAttr(m.id)}"><summary>先修 ${data.prerequisites.length}${icon("chevron-down")}</summary><p class="cv2-prereq">${data.prerequisites.map(lessonLink).join("")}${mapLink}</p></details>`
            : ""}</div>
        </header>` : `
        <header class="page-head cv2-head">
          <div>
            ${kicker}
            <h2>${escapeHtml(m.title)}</h2>
            <p class="cv2-meta"><span>閱讀 ${m.read} 分</span><span>全程 ${m.total} 分</span>${tierPill(tier)}</p>
            ${ruleLine(records, m)}
          </div>
          ${seg}
        </header>`;
      const src = chapterFile(m.chapter.code);
      // 圖的畫法還沒到：先抓，到了再畫
      if (data && needsFigures(data) && !figuresFail && !figuresLoading) {
        figuresLoading = true;
        Promise.resolve(deps.ensureLazy("figures")).then(() => { figuresLoading = false; render(); }, () => { figuresLoading = false; figuresFail = true; render(); });
      }
      if (secMode && !needsFigures(data)) {
        if (window.BuzzCourseSections) return window.BuzzCourseSections.render(secApi(records, head));
        sec(render);
        return `<main class="screen lazy-loading" aria-busy="true"><div class="cv2-layout"><section class="course-lesson cv2-lesson">${head}</section></div></main>`;
      }
      if (!data || needsFigures(data)) {
        if (!data && chapterState[src] !== "failed") loadChapter(m.chapter);
        const failed = chapterState[src] === "failed" || (data && figuresFail);
        return `
          <main class="screen ${failed ? "" : "lazy-loading"}" aria-busy="${failed ? "false" : "true"}">
            <div class="cv2-layout"><section class="course-lesson cv2-lesson">${head}
              <p class="panel-note">${failed ? "課文載不進來 —— 檢查一下網路再試一次。" : "載入課文…"}</p>
              ${failed ? `<div class="action-row"><button class="button" data-action="course-retry">${icon("refresh")}再試一次</button></div>` : ""}
            </section></div>
          </main>`;
      }
      const prev = neighbour(m, -1);
      const next = neighbour(m, 1);
      const boss = bossView(records, m);
      const para = (text) => `<p>${rich(text, data)}</p>`;
      const tex = (list) => (list || []).map((line) => `<div class="math-block course-concept-math" data-tex="${escapeAttr(line)}"></div>`).join("");
      const mark = (key, group) => `data-cv2-mark="${key}" data-cv2-group="${group}"`;

      // 圖：after = 觀念段落的索引（預設 0，第一段之後）或 "examples"（範例區的最後）
      const Figures = window.BuzzCourseFigures;
      const figures = (data.figures || []).map((fig, k) => ({ fig, k, after: fig.after === undefined ? 0 : fig.after }));
      const figuresAt = (slot) => figures.filter((f) => f.after === slot)
        .map(({ fig, k }) => Figures.renderFigure(fig, k, state.figs[k], escapeAttr, escapeHtml)).join("");
      const concept = data.concept.map((part, i) => {
        const body = `${part.body.map(para).join("")}${tex(part.tex)}${figuresAt(i)}`;
        if (!part.collapsible) return `<div class="cv2-part" ${mark(`c${i}`, "concept")}>${part.heading ? `<h3>${fmt(part.heading)}</h3>` : ""}${body}</div>`;
        return `
          <details class="cv2-fold" data-keep="cv2-${escapeAttr(m.id)}-${i}" ${mark(`c${i}`, "concept")}>
            <summary>${icon("chevron-right")}<span>${fmt(part.heading || "展開")}</span><em></em></summary>
            <div class="cv2-part">${body}</div>
          </details>`;
      }).join("");

      const examples = data.workedExamples.map((ex, i) => {
        const shown = Math.min(ex.steps.length, state.steps[i] || 0);
        const steps = ex.steps.slice(0, shown).map((step, k) => `
          <li class="course-step"><span class="course-step-no">${k + 1}</span><div><p>${rich(step, data)}</p></div></li>`).join("");
        return `
          <article class="cv2-example" data-course-example="${i}">
            <p class="cv2-example-title">範例 ${i + 1}${ex.title ? ` · <span>${fmt(ex.title)}</span>` : ""}</p>
            <p class="cv2-prompt">${rich(ex.prompt, data)}</p>
            ${shown ? `<ol class="course-steps">${steps}</ol>` : ""}
            ${shown < ex.steps.length
              ? `<button type="button" class="cv2-reveal" data-action="course-step" data-ex="${i}">${icon("chevron-down")}${shown ? "下一步" : "看第一步"}<small>${shown} / ${ex.steps.length}</small></button>`
              : `<p class="course-answer">${icon("check")}<span>答案：${fmt(ex.answer)}</span></p>${ex.note ? `<p class="cv2-note">${rich(ex.note, data)}</p>` : ""}`}
          </article>`;
      }).join("");

      const checks = data.checks.map((check, ci) => {
        const picks = state.picks[ci] || [];
        const right = picks.some((oi) => check.options[oi] && check.options[oi].correct);
        const wrongs = picks.filter((oi) => check.options[oi] && !check.options[oi].correct);
        return `
          <div class="course-check ${right ? "is-right" : picks.length ? "is-wrong" : ""}">
            <p class="course-check-ask">${ci + 1}. ${rich(check.ask, data)}</p>
            <div class="course-check-options">
              ${check.options.map((option, oi) => `
                <button type="button" class="course-option ${right && option.correct ? "is-correct" : ""} ${picks.includes(oi) && !option.correct ? "is-picked" : ""}" data-action="course-pick" data-check="${ci}" data-option="${oi}" ${right ? "disabled" : ""}>${fmt(option.label)}</button>`).join("")}
            </div>
            ${wrongs.map((oi) => `<p class="course-check-why">${fmt(check.options[oi].label)}：${rich(check.options[oi].why, data)}</p>`).join("")}
            ${right ? `<p class="course-check-why is-right">${icon("check")}對了${picks.length > 1 ? "（第一次選錯，這題不算分）" : ""}</p>` : ""}
          </div>`;
      }).join("");
      const allAnswered = data.checks.every((_check, ci) => (state.picks[ci] || []).length);
      const score = quizScore(data);
      const quizResult = allAnswered ? `
        <div class="cv2-quiz-result ${score >= PASS ? "is-pass" : ""}" data-course-quiz-result>
          <strong>${score} / ${data.checks.length}</strong>
          <span>${score >= PASS ? "這一課完成了" : `第一次就選對 ${PASS} 題才算完成`}</span>
          <button type="button" class="button ghost" data-action="course-quiz-reset">${icon("refresh")}重做小測</button>
        </div>` : "";

      const items = data.practice.map((p) => ({ ...p, problem: problem(p.id) })).filter((p) => p.problem);
      const mainItems = items.filter((p) => !p.challenge);
      const challengeItems = items.filter((p) => p.challenge);
      const practiceRow = (p) => `
        <li class="${solved(records, p.id) ? "is-solved" : ""}">
          <span class="cv2-mark ${p.core ? "is-core" : ""}" title="${p.core ? "核心題" : ""}">${solved(records, p.id) ? "✔" : p.core ? "★" : "·"}</span>
          <div><div class="math-inline" data-tex="${escapeAttr(p.problem.prompt)}"></div>${p.challenge && p.note ? `<p class="cv2-note">${rich(p.note, data)}</p>` : ""}</div>
        </li>`;
      const g = progressOf(records, m);
      const tiers = [
        ["完成", `小測首次就對 ${g.quiz}/${PASS}`],
        ["熟練", `${items.some((p) => p.core) ? "★ 題" : "推薦題"} ${g.mid.ok}/${g.mid.n}`],
        ["全破", `${challengeItems.length ? "含挑戰" : "全部"} ${g.all.ok}/${g.all.n}`]
      ];

      // 位置條（手機）四格、目錄（桌機）逐節；兩者都只是捲到那裡，不改狀態
      const groups = [["concept", "觀念"], ...(examples ? [["worked", "範例"]] : []), ["checks", "小測"], ["practice", "練習"]];
      const strip = `
        <nav class="cv2-strip" aria-label="這一課的段落">
          ${groups.map(([key, name]) => `<button type="button" data-cv2-jump="${key}" class="${reading.group === key ? "is-on" : ""}">${name}</button>`).join("")}
          <i class="cv2-read" aria-hidden="true"></i>
        </nav>`;
      const tocItems = [
        ...data.concept.map((part, i) => [`c${i}`, part.heading ? fmt(part.heading) : `觀念 ${i + 1}`, part.collapsible ? "is-fold" : ""]),
        ...(examples ? [["worked", "範例", "is-group"]] : []),
        ["checks", "小測", "is-group"],
        ["practice", "練習", "is-group"]
      ];
      const toc = `
        <nav class="cv2-toc" aria-label="這一課的目錄">
          <p>${m.no} · 目錄</p>
          <ol>${tocItems.map(([key, text, cls]) => `<li><button type="button" data-cv2-jump="${key}" class="${cls} ${reading.mark === key ? "is-on" : ""}">${text}</button></li>`).join("")}</ol>
        </nav>`;
      if (typeof queueMicrotask === "function") queueMicrotask(setupReading);
      else window.setTimeout(setupReading, 0);

      return `
        <main class="screen">
          <div class="cv2-layout">
            ${toc}
            <section class="course-lesson cv2-lesson" data-cv2-reading>
              ${head}
              <div class="cv2-intro">
                ${data.prerequisites.length ? `<p class="cv2-prereq"><span>先修</span>${data.prerequisites.map(lessonLink).join("")}<button type="button" class="cv2-link cv2-maplink" data-action="course-map-focus" data-lesson-id="${escapeAttr(m.id)}">在地圖上看</button></p>` : ""}
                ${data.objectives.length ? `
                <details class="cv2-goals" data-keep="cv2-goals-${escapeAttr(m.id)}">
                  <summary>${icon("chevron-right")}學完你會<small>${data.objectives.length} 項</small></summary>
                  <ul class="cv2-list">${data.objectives.map((line) => `<li>${rich(line, data)}</li>`).join("")}</ul>
                </details>` : ""}
              </div>
              ${boss ? boss.card() : ""}
              ${strip}

              <section class="course-block cv2-sec" data-course-concept aria-label="觀念">
                ${concept}
              </section>

              ${examples ? `
              <section class="course-block cv2-sec" data-course-worked ${mark("worked", "worked")}>
                <h3 class="cv2-sec-title">範例<small>一步一步揭</small></h3>
                ${examples}
                ${figuresAt("examples")}
              </section>` : ""}

              ${data.pitfalls.length ? `
              <section class="course-block cv2-sec" data-course-pitfalls>
                <h3 class="cv2-sec-title">常見錯誤</h3>
                <ul class="cv2-list">${data.pitfalls.map((line) => `<li>${rich(line, data)}</li>`).join("")}</ul>
              </section>` : ""}

              <section class="course-block cv2-sec" data-course-checks ${mark("checks", "checks")}>
                <h3 class="cv2-sec-title">小測${entry.quizBest !== undefined ? `<small>最好 ${entry.quizBest} / ${data.checks.length}</small>` : ""}</h3>
                ${checks}
                ${quizResult}
              </section>

              <section class="course-block cv2-sec" data-course-practice ${mark("practice", "practice")}>
                <h3 class="cv2-sec-title">推薦題</h3>
                ${items.length ? `<ol class="cv2-tiers">${tiers.map(([name, rule], i) => `<li class="${tier > i ? "is-on" : ""}"><strong>${tier > i ? "✔ " : ""}${name}</strong><span>${rule}</span></li>`).join("")}</ol>` : `<p class="panel-note" data-cv2-none>${tier ? "<strong>✔ 全破</strong> · " : ""}這一課沒有推薦題：小測完成就是全破。</p>`}
                ${mainItems.length ? `
                  <ul class="cv2-practice">${mainItems.map(practiceRow).join("")}</ul>
                  <div class="action-row"><button class="button home-primary" data-action="course-practice" data-set="main">${icon("play")}練推薦題 · ${mainItems.length} 題</button></div>` : ""}
                ${challengeItems.length ? `
                  <h4 class="cv2-subhead section-label">挑戰</h4>
                  <ul class="cv2-practice">${challengeItems.map(practiceRow).join("")}</ul>
                  <div class="action-row"><button class="button secondary" data-action="course-practice" data-set="challenge">${icon("zap")}挑戰 · ${challengeItems.length} 題</button></div>` : ""}
              </section>

              ${boss && tier ? boss.finish.html : ""}
              <nav class="cv2-nav" aria-label="上一課與下一課">
                ${prev ? `<button class="button ghost" data-action="open-course-lesson" data-lesson-id="${escapeAttr(prev.id)}">上一課 ${escapeHtml(prev.no)}</button>` : "<span></span>"}
                ${next ? `<button class="button ${tier ? "home-primary" : "secondary"}" data-action="open-course-lesson" data-lesson-id="${escapeAttr(next.id)}">下一課：${escapeHtml(label(next))}${icon("chevron-right")}</button>` : ""}
              </nav>
            </section>
          </div>
        </main>`;
    }

    // 只算每題「第一次選的」：可以一直選到對，但只有第一次就對的才算分
    function quizScore(data) {
      return data.checks.filter((check, ci) => {
        const first = (state.picks[ci] || [])[0];
        return first !== undefined && check.options[first] && check.options[first].correct;
      }).length;
    }

    /* ── 首頁與結算的出口（新手首頁主卡、三步、答錯回饋、課後結算）── */
    function renderHomeCard(records) {
      const next = nextLesson(records);
      const done = mainPath.filter((m) => isDone(records, m)).length;
      if (!next) {
        const grad = legacy.graduation(records);
        if (grad && grad.passed) return "";
        return `
          <section class="today-card course-home-card">
            <div class="today-card-head"><p class="section-label">${icon("book-open")}課程 · 主線 ${mainPath.length} 課都完成了</p><span>約 10 分鐘</span></div>
            <h2>${grad ? `畢業關再考一次（上次 ${grad.correct} / ${grad.total}）` : "畢業關：10 題，8 題過關"}</h2>
            <div class="action-row"><button class="button home-primary" data-action="course-graduation">${icon("play")}${grad ? "再考一次" : "開始畢業關"}</button><button class="button secondary" data-action="open-course">${icon("list-checks")}課程表</button></div>
          </section>`;
      }
      const started = Boolean(entryOf(records, next.id).openedAt);
      return `
        <section class="today-card course-home-card">
          <div class="today-card-head">
            <p class="section-label">${icon("book-open")}課程 · ${done} / ${mainPath.length} 課</p>
            <span>閱讀 ${next.read} 分</span>
          </div>
          <h2>${started ? "接著上" : "上"} ${escapeHtml(label(next))}</h2>
          <div class="action-row">
            <button class="button home-primary" data-action="open-course-lesson" data-lesson-id="${escapeAttr(next.id)}">${icon("play")}${started ? "繼續這一課" : "開始"}</button>
            <button class="button secondary" data-action="open-course">${icon("list-checks")}課程表</button>
          </div>
        </section>`;
    }

    function renderFirstSteps(records) {
      const next = nextLesson(records);
      const done = mainPath.filter((m) => isDone(records, m)).length;
      const steps = [
        [next ? `上 ${label(next)}` : "主線的課都上完了", "觀念 → 範例 → 小測 → 推薦題", "open-course"],
        ["練完就有能力輪廓", "哪些概念穩、哪些還卡，數據頁看得到", "open-insights"],
        ["畢業關 10 題，過了再走主線", "只出基礎題；主線頭三局也是，不倒數", "open-course"]
      ];
      return `
        <section class="first-steps" aria-label="開始的三步">
          ${steps.map(([title, note, action], index) => `
            <button type="button" class="first-step ${index === (next ? 0 : 2) ? "is-current" : ""}" data-action="${action}">
              <span class="first-step-no">${index === 0 && done ? `${done}/${mainPath.length}` : index + 1}</span>
              <strong>${escapeHtml(title)}</strong>
              <small>${escapeHtml(note)}</small>
            </button>`).join("")}
        </section>`;
    }

    function renderFeedbackLink(problemId) {
      const m = meta[problemLesson[problemId]];
      return m ? `<p class="feedback-course"><button type="button" class="link-button" data-action="open-course-lesson" data-lesson-id="${escapeAttr(m.id)}">${icon("book-open")}這題是〈${escapeHtml(label(m))}〉教的 —— 回去看一眼</button></p>` : "";
    }

    function renderResultsActions(lessonId) {
      if (/^boss/.test(lessonId)) return bossUI() ? bossUI().results(kit(), lessonId) : "";
      const m = meta[lessonId];
      const next = m ? neighbour(m, 1) : null;
      return `${m ? ruleLine(deps.loadRecords(), m) : ""}
        <div class="action-row">
          <button class="button" data-action="open-course-lesson" data-lesson-id="${escapeAttr(lessonId)}" data-to="practice">${icon("book-open")}回到 ${m ? escapeHtml(label(m)) : "課程"}</button>
          ${next ? `<button class="button secondary" data-action="open-course-lesson" data-lesson-id="${escapeAttr(next.id)}">${icon("chevron-right")}下一課</button>` : `<button class="button secondary" data-action="open-course">${icon("list-checks")}課程表</button>`}
          <button class="button ghost" data-action="open-mistakes">${icon("book")}錯題本</button>
        </div>`;
    }

    /* ── 動作 ── */
    const QUIZ = { modeKey: "practice", practice: true, noTimer: true, answerMode: "choice" };
    // 課程練習要等先修閘門（kernel/sampler.js，lazy 群組 sampler）載到才開局：先修課還沒到的題不出（app.js startQuiz 篩）
    const gated = (pool, o) => Promise.resolve(deps.ensureLazy("sampler")).catch(() => {}).then(() => startQuiz(pool, o));
    function act(action, data) {
      const id = data.lessonId || state.lessonId;
      if (action === "open-course") {
        // 從一課回去：退回打開這一課之前的那一格（瀏覽器的上一頁也就不會停在一課）；popstate 沒來就直接去
        if (ourEntry() && inLesson()) {
          const guard = (popGuard += 1);
          backing = true;
          window.history.back();
          window.setTimeout(() => { if (popGuard === guard && inLesson()) { backing = false; go("course"); } }, 400);
          return;
        }
        return go("course");
      }
      if (action === "course-view") {
        indexView = data.mode === "map" ? "map" : "list";
        return render();
      }
      if (action === "course-map-filter" || action === "course-goal") {
        const records = loadRecords();
        records.courseMap = { ...mapPrefs(records), ...(action === "course-goal" ? { goal: meta[data.lessonId] ? data.lessonId : "" } : { filter: data.mode || "all" }) };
        saveRecords(records);
        return render();
      }
      // 魔王題：一題的一局；payoff 還沒讀到（data-try）是 boss-try:，答錯不進錯題本
      if (action === "course-boss") {
        const B = bossBy[data.code];
        const p = B && problem(B.p);
        if (p) startQuiz([p], { ...QUIZ, courseLessonId: `${data.try ? "boss-try" : "boss"}:${B.code}` });
        return;
      }
      if (action === "course-lesson-practice") {
        const pool = String(data.ids || "").split(" ").map(problem).filter(Boolean);
        if (pool.length) gated(pool, { ...QUIZ, courseLessonId: meta[id] ? id : undefined });
        return;
      }
      if (action === "course-map-focus") {
        indexView = "map";
        mapFocus = meta[id] ? id : "";
        mapLit = data.lit ? mapFocus : "";
        return go("course");
      }
      if (action === "open-course-lesson") {
        const m = meta[id];
        if (!m || !m.available) return go("course");
        rememberIndex(id);
        if (!ourEntry() && window.history && window.history.pushState) window.history.pushState({ cv2: 1 }, "");
        update(id, (entry) => ({ ...entry, openedAt: entry.openedAt || new Date().toISOString() }));
        // data-to="practice"（練完推薦題的「回到這一課」）：分節落在結算、全文捲到推薦題
        const land = data.to === "practice";
        state = { lessonId: id, steps: {}, picks: {}, figs: {}, recorded: false, ...(land ? { land: "practice" } : {}) };
        reading.group = land ? "practice" : "concept";
        reading.mark = land ? "practice" : "c0";
        reading.land = land ? id : "";
        if (!lessonData(id)) loadChapter(m.chapter);
        return go("course-lesson");
      }
      if (action === "course-retry") {
        const m = meta[state.lessonId];
        figuresFail = false;
        if (m) { delete chapterState[chapterFile(m.chapter.code)]; if (!lessonData(m.id)) loadChapter(m.chapter); }
        return render();
      }
      if (action === "course-rv") { state = { lessonId: "", rv: data.lessonId || 1, picks: {} }; return go("course-lesson"); }
      if (/^course-rv-/.test(action)) return solve(() => window.BuzzCourseSolve.rv(rvKit(loadRecords()), action, data));
      if (/^course-s-/.test(action)) return sec(() => window.BuzzCourseSections.act(secApi(loadRecords()), action, data));
      const lesson = lessonData(state.lessonId);
      if (action === "course-step" && lesson) {
        const ex = Number(data.ex);
        state.steps = { ...state.steps, [ex]: (state.steps[ex] || 0) + 1 };
        return render();
      }
      if (action === "course-pick" && lesson) {
        const ci = Number(data.check);
        const oi = Number(data.option);
        const check = lesson.checks[ci];
        if (!check || !check.options[oi]) return;
        const picks = state.picks[ci] || [];
        if (picks.some((x) => (check.options[x] || {}).correct) || picks.includes(oi)) return;
        state.picks = { ...state.picks, [ci]: picks.concat(oi) };
        // 每一題都選過就記分（同一輪只記一次）；第一次完成順便排進回溫
        if (!state.recorded && lesson.checks.every((_c, k) => (state.picks[k] || []).length)) {
          state.recorded = true;
          const score = quizScore(lesson);
          let first = false;
          update(state.lessonId, (entry) => {
            first = score >= PASS && !entry.doneAt;
            return { ...entry, quizBest: Math.max(score, Number(entry.quizBest || 0)), quizAt: new Date().toISOString(), ...(first ? { doneAt: new Date().toISOString(), ...deps.review.plan(meta[state.lessonId], lesson) } : {}) };
          });
          // 第一次完成才記（重讀、重做小測不再記）
          if (first) track("course_lesson_complete", { lesson: state.lessonId, tier: tierOf(loadRecords(), meta[state.lessonId]) });
        }
        return render();
      }
      if (action === "course-quiz-reset") {
        state = { ...state, picks: {}, recorded: false };
        update(state.lessonId, (e) => ({ ...e, picks: {} }));
        return render();
      }
      if (action === "course-practice" && lesson) {
        const challenge = data.set === "challenge";
        const pool = lesson.practice.filter((p) => Boolean(p.challenge) === challenge).map((p) => problem(p.id)).filter(Boolean);
        if (pool.length) gated(pool, { ...QUIZ, courseLessonId: state.lessonId });
        return;
      }
      if (action === "course-graduation") {
        const pool = legacy.graduationSet(Date.now(), usedProblems);
        if (pool.length >= 4) startQuiz(pool, { ...QUIZ, courseGraduation: true });
      }
    }

    return {
      renderIndex,
      renderLesson,
      renderHomeCard,
      renderFirstSteps,
      renderFeedbackLink,
      renderResultsActions,
      act,
      // 給測試與工具看的（不是給畫面用的）
      leftLesson,
      lessonMeta: (id) => meta[id] || null,
      tierOf: (records, id) => (meta[id] ? tierOf(records, meta[id]) : 0)
    };
  }

  window.BuzzCourseV2UI = { create };
})();
