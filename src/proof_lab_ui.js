// 證明訓練的畫面：像 LeetCode 一樣的一張題目表、左題右寫的題目頁、白話證明的教學頁。
//
// 兩個題庫合在一張表：白話證明（kernel/proof_lang.js 自動判）與 proofs.js（骨架重排、
// 填空機器判，其餘自評）。狀態（正在寫哪題、篩選、草稿、debounce）留在 app.js；
// 這裡只有「拿資料畫 HTML」的純函式。從 app.js 搬出來是因為主程式撞到效能預算 ——
// 該搬的是整頁的 render，不是調數字（見 tools/validate_performance_budget.js）。
//
// 用法：const plUI = window.BuzzProofLabUI.create({ escapeHtml, escapeAttr, icon, proofs });

(function () {
  "use strict";
  // 語言層：t() 由 src/kernel/i18n.js 掛在 globalThis；node 的驗證器直接 require 這一支時沒有它，
  // 就原樣印出（佔位符照填），所以每個模組都能單獨載入。
  const t = typeof globalThis.t === "function" ? globalThis.t : (text, vars) => (vars ? String(text).replace(/\{(\w+)(?:\|[^}]*)?\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : text);

  function create(deps) {
    const { escapeHtml, escapeAttr, icon } = deps;

    function proofLangProblems() {
      return Array.isArray(window.BUZZ_PROOF_LANG_PROBLEMS) ? window.BUZZ_PROOF_LANG_PROBLEMS : [];
    }

    const PROOF_LANG_FAMILIES = [["epsilon-delta", "ε-δ"], ["direct", t("直接")], ["cases", t("分情況")], ["contradiction", t("反證")], ["induction", t("歸納")]];

    function proofLangLessons() {
      return Array.isArray(window.BUZZ_PROOF_LANG_LESSONS) ? window.BUZZ_PROOF_LANG_LESSONS : [];
    }

    function proofLangSpec(id) {
      return proofLangProblems().find((item) => item.id === id) || null;
    }

    function proofLangDraft(records, id) {
      const store = records.proofLang || {};
      return store[id] || null;
    }

    // mode：free（預設）走自由書寫層（proof_surface）：中文、英文、LaTeX 混寫都翻成句型語言再驗；
    // guided 直接餵引擎（一行一句、指定句型）。兩者的三色語意一樣。
    function runProofLangCheck(spec, text, mode) {
      if (!window.BuzzProofLang || !spec) return null;
      try {
        if (mode !== "guided" && window.BuzzProofSurface) return window.BuzzProofSurface.check(window.BuzzProofLang, spec, text);
        return window.BuzzProofLang.check(spec, text);
      } catch (error) {
        return { lines: [], counts: { ok: 0, unsure: 0, error: 0 }, missing: [], verdict: "empty", verdictText: `${t("檢查器出錯：{message}", { message: error.message })}`, goalDone: false };
      }
    }

    // 句型範本：按一下插到游標處。跟鍵盤一樣的邏輯 —— 使用者不用背關鍵字。
    const PROOF_LANG_TEMPLATES = [
      [t("任取"), t("任取 ε > 0。")],
      [t("取"), t("取 δ = ε/3。")],
      [t("假設"), t("假設 0 < |x − a| < δ。")],
      [t("則"), t("則 A = B < C。")],
      [t("由定理"), t("由平均值定理，…。")],
      [t("因為所以"), t("因為 …，所以 …。")],
      [t("分情況"), t("分兩種情況。")],
      [t("情況"), t("情況一：x ≥ 0。")],
      [t("歸納"), t("用歸納法。")],
      [t("基底"), t("當 n = 1 時，左式 = …，右式 = …，成立。")],
      [t("歸納假設"), t("假設 n = k 時成立，即 …。")],
      [t("反設"), t("反設 …。")],
      [t("矛盾"), t("這與 … 矛盾。")],
      [t("故"), t("故 …。")]
    ];

    function renderProofLangVerdict(report) {
      if (!report) return "";
      const tone = { verified: "is-ok", partial: "is-unsure", incomplete: "is-unsure", broken: "is-error", empty: "" }[report.verdict] || "";
      const label = { verified: t("✔ 每一步都通過檢查"), partial: t("△ 讀得懂，有幾句驗不了"), incomplete: t("△ 結構還沒到齊"), broken: t("✘ 有一行過不了"), empty: t("還沒寫") }[report.verdict] || "";
      return `
        <div class="pl-verdict ${tone}" data-pl-verdict aria-live="polite">
          <strong>${escapeHtml(label)}</strong>
          <span>${escapeHtml(report.verdictText || "")}</span>
          ${report.missing && report.missing.length ? `<ul>${report.missing.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
        </div>`;
    }

    const MARK = { ok: "✔", unsure: "△", error: "✘" };
    // 一句多動作（Choose δ = ε/3 > 0 and suppose …）在畫面上是一張卡，裡面列每個動作的結果
    function groupLines(lines) {
      const groups = [];
      lines.forEach((line) => {
        const prev = groups[groups.length - 1];
        const same = prev && line.part && prev.lines[0].part && prev.lines[0].sourceRange && line.sourceRange
          && prev.lines[0].sourceRange.start === line.sourceRange.start && prev.lines[0].sourceRange.end === line.sourceRange.end;
        if (same) prev.lines.push(line);
        else groups.push({ lines: [line] });
      });
      return groups;
    }
    function renderProofLangLines(report) {
      if (!report || !report.lines.length) return `<p class="panel-note">${t("寫一句就會立刻檢查。可以直接用中文、英文或 LaTeX 寫 —— 不確定就按上面的範本。")}</p>`;
      const worst = (lines) => (lines.some((l) => l.status === "error") ? "error" : lines.some((l) => l.status === "unsure") ? "unsure" : "ok");
      return `
        <ol class="pl-lines">
          ${groupLines(report.lines).map((group) => {
            const first = group.lines[0];
            const status = worst(group.lines);
            if (group.lines.length === 1) {
              const line = first;
              return `
            <li class="is-${line.status}">
              <span class="pl-line-mark" aria-hidden="true">${MARK[line.status] || "?"}</span>
              <div>
                <div class="pl-line-text"><small>${t("第 {n}", { n: line.n })} ${line.sourceRange ? t("句") : t("行")} · ${escapeHtml(line.label || "？")}</small>${escapeHtml(line.raw)}</div>
                ${line.canonical && line.canonical.replace(/[。.]$/, "") !== String(line.raw).replace(/[。.]$/, "") ? `<p class="pl-line-canonical">${t("讀成：{canonical}", { canonical: escapeHtml(line.canonical) })}</p>` : ""}
                <p class="pl-line-note">${escapeHtml(line.note || "")}</p>
              </div>
            </li>`;
            }
            return `
            <li class="is-${status}">
              <span class="pl-line-mark" aria-hidden="true">${MARK[status] || "?"}</span>
              <div>
                <div class="pl-line-text"><small>${t("第 {n}–{n2} 句 · 一句 {length} 個動作", { n: first.n, n2: group.lines[group.lines.length - 1].n, length: group.lines.length })}</small>${escapeHtml(first.raw)}</div>
                <ul class="pl-line-parts">
                  ${group.lines.map((line) => `<li class="is-${line.status}"><span aria-hidden="true">${MARK[line.status] || "?"}</span><span>${escapeHtml(line.canonical || line.raw)}</span><small>${escapeHtml(line.note || "")}</small></li>`).join("")}
                </ul>
              </div>
            </li>`;
          }).join("")}
        </ol>`;
    }

    // 編輯器：範本列、textarea、即時報告、底下的按鈕列。
    // 題目頁不放「看參考證明」（題解在左邊的分頁）；教學頁還是用切換的。
    // 速查表：支援的句型、定理、文字事實、符號寫法。內容從引擎的 cheatsheet 拿，不另外抄一份。
    function renderCheatSheet(open) {
      const lang = window.BuzzProofLang;
      const sheet = lang && lang.cheatsheet;
      if (!sheet) return "";
      const rulesRows = sheet.rules.map((rule) => `
        <tr>
          <th scope="row">${escapeHtml(rule.name)}${rule.aliases.length ? `<small>${escapeHtml(rule.aliases.join("、"))}</small>` : ""}</th>
          <td>${escapeHtml(rule.form || "")}</td>
          <td>${escapeHtml(rule.requires || "—")}</td>
        </tr>`).join("");
      const syntaxRows = sheet.syntax.map((row) => `
        <tr>
          <th scope="row">${escapeHtml(row.label)}</th>
          <td>${escapeHtml(row.keywords)}</td>
          <td>${escapeHtml(row.example)}</td>
        </tr>`).join("");
      const notationRows = sheet.notation.map(([name, how]) => `<tr><th scope="row">${escapeHtml(name)}</th><td colspan="2">${escapeHtml(how)}</td></tr>`).join("");
      return `
        <details class="lc-cheat" ${open ? "open" : ""}>
          <summary>${icon("book-open")}${t("速查表：支援的句型、定理與寫法")}</summary>
          <div class="lc-cheat-body">
            <p class="section-label">${t("句型（每一行用一種開頭）")}</p>
            <div class="lc-cheat-scroll"><table><thead><tr><th>${t("句型")}</th><th>${t("關鍵字")}</th><th>${t("例句")}</th></tr></thead><tbody>${syntaxRows}</tbody></table></div>
            <p class="section-label">${t("定理（寫「由 <定理>，…」）")}</p>
            <div class="lc-cheat-scroll"><table><thead><tr><th>${t("定理")}</th><th>${t("會認的寫法")}</th><th>${t("前提")}</th></tr></thead><tbody>${rulesRows}</tbody></table></div>
            <p class="section-label">${t("文字事實（算不出來但可以引用）")}</p>
            <ul class="lc-cheat-list">${sheet.facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>
            <p class="section-label">${t("符號與規矩")}</p>
            <div class="lc-cheat-scroll"><table><tbody>${notationRows}</tbody></table></div>
            <p class="section-label">${t("不用點名也會認的改寫（接上前文的來源）")}</p>
            <ul class="lc-cheat-list">${(sheet.transformations || []).map((item) => `<li><strong>${escapeHtml(item.title)}</strong> — ${escapeHtml(item.explain)}</li>`).join("")}</ul>
            <p class="lc-cheat-note">${t("字典外的定理可以照寫：式子驗得過就綠，只是備註會說它不在字典裡。")}</p>
          </div>
        </details>`;
    }

    const FREE_PLACEHOLDER = t("可以直接用中文、英文或 LaTeX 寫證明。\n\n例如：\nLet ε > 0 be given.\nChoose δ = ε/3.\n\n或：\n任取 ε > 0。\n取 δ = ε/3。");
    function renderProofLangEditor(spec, text, report, showReference, options = {}) {
      const rows = Math.max(8, Math.min(18, String(text || "").split("\n").length + 2));
      const referenceButton = options.noReference ? "" : `<button class="button secondary" data-action="pl-toggle-reference">${icon("eye")}${showReference ? t("收起參考證明") : t("看參考證明")}</button>`;
      const mode = options.mode === "guided" ? "guided" : "free";
      const modeButton = (key, label) => `<button type="button" class="${mode === key ? "is-active" : ""}" data-action="pl-mode" data-mode="${key}" aria-pressed="${mode === key ? "true" : "false"}">${label}</button>`;
      return `
        <div class="pl-editor" data-pl-editor>
          <div class="pl-mode" role="group" aria-label="${t("書寫模式")}">
            <span class="section-label">${t("書寫模式")}</span>
            ${modeButton("free", t("自由書寫"))}${modeButton("guided", t("引導句型"))}
            <small>${mode === "free" ? t("中文、英文、LaTeX 都可以，一句可以有好幾個動作。") : t("一行一句，每句用一種句型開頭。")}</small>
          </div>
          <div class="pl-templates" role="toolbar" aria-label="${t("句型範本")}">
            ${PROOF_LANG_TEMPLATES.map(([label, tpl]) => `<button type="button" class="pl-template" data-action="pl-insert" data-text="${escapeAttr(tpl)}">${escapeHtml(label)}</button>`).join("")}
          </div>
          <label class="sr-only" for="pl-text">${t("證明內容")}</label>
          <textarea id="pl-text" data-proof-lang-text rows="${rows}" spellcheck="false" placeholder="${escapeAttr(mode === "free" ? FREE_PLACEHOLDER : t("一行一句。例如：任取 ε > 0。"))}">${escapeHtml(text || "")}</textarea>
          <div class="action-row pl-actions">
            ${referenceButton}
            <button class="button ghost" data-action="pl-clear">${icon("trash")}${t("清空重寫")}</button>
            ${options.extra || ""}
          </div>
          ${renderCheatSheet(false)}
          ${options.after || ""}
          ${showReference && !options.noReference ? `<div class="pl-reference"><p class="section-label">${t("參考證明")}</p><pre>${escapeHtml(spec.reference.join("\n"))}</pre></div>` : ""}
          <div data-pl-report>
            ${options.hideVerdict ? "" : renderProofLangVerdict(report)}
            ${renderProofLangLines(report)}
          </div>
        </div>`;
    }

    /* ── 統一的題目列：白話證明（自動判）＋ proofs.js（骨架／填空判、其餘自評） ── */
    //
    // 兩個題庫本來各有各的頁面；像 LeetCode 一樣列成一張表之後，每一列要長得一樣：
    // 編號、標題、標籤、難度（簡單／中等／困難）、狀態（未做／嘗試中／已解）、你的紀錄。
    // 難度：白話證明 R1→簡單 R2→中等 R3→困難；proofs.js 的 R1–2／3–4／5–6。
    const LEVELS = [["easy", t("簡單")], ["medium", t("中等")], ["hard", t("困難")]];
    const LEVEL_LABEL = Object.fromEntries(LEVELS);
    const TIER_LABEL = { basic: t("基礎"), standard: t("標準"), advanced: t("進階"), boss: t("終極"), contest: t("競賽"), classic: t("經典解析"), lean: "Lean" };
    const FAMILY_LABEL = Object.fromEntries(PROOF_LANG_FAMILIES);
    const STATUS_LABEL = { none: t("未做"), attempted: t("嘗試中"), solved: t("已解") };

    const levelOf = (kind, difficulty) => (kind === "auto"
      ? (difficulty <= 1 ? "easy" : difficulty === 2 ? "medium" : "hard")
      : (difficulty <= 2 ? "easy" : difficulty <= 4 ? "medium" : "hard"));

    // 經典證明題 ↔ 白話證明規格：規格的 classic 欄位指到 proofs.js 的題號。有規格的經典題可以「自己寫，機器判」。
    function specForClassic(proofId) {
      return proofLangProblems().find((spec) => spec.classic === proofId) || null;
    }

    function rows(records) {
      const store = records.proofLang || {};
      const progress = records.proofs || {};
      const auto = proofLangProblems().map((spec, i) => {
        const entry = store[spec.id] || {};
        const submissions = entry.submissions || [];
        // 已解＝提交過且全綠；沒提交過的舊草稿（這個按鈕出現之前的）全綠也算，不讓人的紀錄消失
        const solved = Boolean(entry.solvedAt) || (entry.verdict === "verified" && !submissions.length);
        return {
          key: `pl:${spec.id}`, kind: "auto", id: spec.id, n: i + 1, title: spec.title,
          level: levelOf("auto", spec.difficulty), difficulty: spec.difficulty,
          family: spec.family, tier: "", tags: [FAMILY_LABEL[spec.family] || spec.family],
          status: solved ? "solved" : (submissions.length || (entry.text && entry.text.trim())) ? "attempted" : "none",
          attempts: submissions.length, solvedAt: entry.solvedAt || "", lastAt: entry.updatedAt || "", lastVerdict: entry.verdict || ""
        };
      });
      const self = (deps.proofs || []).map((proof, i) => {
        const entry = progress[proof.id] || {};
        const drillsDone = Boolean(entry.orderPassed) && (!(proof.cloze || []).length || Boolean(entry.clozePassed));
        // 機器判：這題若有對應的白話證明規格，自己寫的證明全綠提交過就算解了
        const machine = specForClassic(proof.id);
        const solved = entry.status === "understood" || drillsDone || Boolean(entry.machinePassedAt);
        const touched = Object.keys(entry).length > 0;
        return {
          key: `pf:${proof.id}`, kind: proof.tier === "lean" ? "lean" : "self", id: proof.id, n: auto.length + i + 1, title: proof.title,
          level: levelOf("self", proof.difficulty), difficulty: proof.difficulty,
          family: "", tier: proof.tier, tags: [TIER_LABEL[proof.tier] || proof.tier].concat(machine ? [t("可機器判")] : []),
          machine: machine ? machine.id : "",
          status: solved ? "solved" : touched ? "attempted" : "none",
          attempts: (entry.orderPassed ? 1 : 0) + (entry.clozePassed ? 1 : 0), solvedAt: "", lastAt: entry.updatedAt || entry.lastViewedAt || "", lastVerdict: entry.status || ""
        };
      });
      return auto.concat(self);
    }

    const DEFAULT_FILTER = { q: "", level: "all", status: "all", kind: "all", group: "all", sort: "n" };

    function filterRows(all, filter) {
      const f = Object.assign({}, DEFAULT_FILTER, filter || {});
      const q = f.q.trim().toLowerCase();
      let out = all.filter((row) =>
        (f.level === "all" || row.level === f.level)
        && (f.status === "all" || row.status === f.status)
        && (f.kind === "all" || row.kind === f.kind)
        && (f.group === "all" || row.family === f.group || row.tier === f.group)
        && (!q || row.title.toLowerCase().includes(q) || row.tags.join(" ").toLowerCase().includes(q) || String(row.n) === q));
      const rank = { easy: 1, medium: 2, hard: 3 };
      if (f.sort === "level") out = out.slice().sort((a, b) => rank[a.level] - rank[b.level] || a.difficulty - b.difficulty || a.n - b.n);
      if (f.sort === "-level") out = out.slice().sort((a, b) => rank[b.level] - rank[a.level] || b.difficulty - a.difficulty || a.n - b.n);
      return out;
    }

    function summary(all) {
      const by = {};
      LEVELS.forEach(([level]) => { by[level] = { total: 0, solved: 0 }; });
      let solved = 0; let attempted = 0;
      all.forEach((row) => {
        by[row.level].total += 1;
        if (row.status === "solved") { by[row.level].solved += 1; solved += 1; }
        if (row.status === "attempted") attempted += 1;
      });
      return { total: all.length, solved, attempted, by };
    }

    const levelPill = (level) => `<span class="lc-level is-${level}">${escapeHtml(LEVEL_LABEL[level] || level)}</span>`;
    const statusMark = (status) => `<span class="lc-status is-${status}" title="${escapeHtml(STATUS_LABEL[status])}" aria-label="${escapeHtml(STATUS_LABEL[status])}">${status === "solved" ? "✔" : status === "attempted" ? "◐" : ""}</span>`;

    // 題庫頁：進度、篩選、一張表。列是可以點的（app.js 接 [data-proof-key]）。
    function renderIndex(records, filter) {
      const f = Object.assign({}, DEFAULT_FILTER, filter || {});
      const all = rows(records);
      const list = filterRows(all, f);
      const stat = summary(all);
      const lessons = proofLangLessons();
      const lessonsDone = Object.keys(records.proofLangLessons || {}).length;
      // 兩條路線：初學（課 1–5、簡單題）、高手（課 6–9、中等與困難）。卡片上寫著各自的進度，
      // 點下去就把表篩成那條路線的題；「上課」跳到那條路線第一堂還沒上完的課。
      const done = records.proofLangLessons || {};
      const routes = [
        { key: "beginner", label: t("初學路線"), note: t("五種證法的骨架，一堂一種；題目全是簡單題"), lessons: lessons.slice(0, 5), levels: ["easy"] },
        { key: "advanced", label: t("高手路線"), note: t("定理當工具、ε-N、黃色怎麼修、抽象函數與泰勒；中等與困難題"), lessons: lessons.slice(5), levels: ["medium", "hard"] }
      ].map((route) => {
        const pool = all.filter((row) => route.levels.includes(row.level));
        const solved = pool.filter((row) => row.status === "solved").length;
        const lessonsLeft = route.lessons.filter((lesson) => !done[lesson.id]);
        return Object.assign(route, { pool: pool.length, solved, lessonsDoneCount: route.lessons.length - lessonsLeft.length, next: lessonsLeft[0] || null, active: route.levels.length === 1 ? f.level === route.levels[0] : f.level === "medium" || f.level === "hard" });
      });
      const chip = (key, value, label, count) => `<button type="button" class="lc-chip ${f[key] === value ? "is-active" : ""}" data-action="proof-filter" data-filter-key="${key}" data-filter-value="${escapeAttr(value)}" aria-pressed="${f[key] === value ? "true" : "false"}">${escapeHtml(label)}${count !== undefined ? `<small>${count}</small>` : ""}</button>`;
      const countBy = (key, value) => all.filter((row) => value === "all" || row[key] === value || (key === "group" && (row.family === value || row.tier === value))).length;
      const sortNext = f.sort === "level" ? "-level" : f.sort === "-level" ? "n" : "level";
      const sortMark = f.sort === "level" ? " ↑" : f.sort === "-level" ? " ↓" : "";
      return `
        <main class="screen">
          <section class="panel page-panel lc-index">
            <div class="page-head">
              <div>
                <p class="section-label">${t("證明訓練")}</p>
                <h2>${t("證明題庫")}</h2>
                <p class="proof-subtitle">${t("{length} 題：白話證明一行一句即時判、骨架重排與填空機器判、長證明自評。不限時、不進計分。", { length: all.length })}</p>
              </div>
              <div class="action-row">
                <button class="button home-primary" data-action="pl-open-lesson" data-lesson-id="${escapeAttr((lessons[0] || {}).id || "")}">${icon("book-open")}${t("先上 {length} 課", { length: lessons.length })}${lessonsDone ? ` ${t("· 已完成 {lessonsDone}", { lessonsDone })}` : ""}</button>
                <button class="button secondary" data-action="proof-random">${icon("shuffle")}${t("隨機一題")}</button>
                <button class="button secondary" data-action="home">${icon("home")}${t("回主線")}</button>
              </div>
            </div>
            ${renderCheatSheet(false)}

            <div class="lc-routes">
              ${routes.map((route) => `
                <div class="lc-route ${route.active ? "is-active" : ""}">
                  <button type="button" class="lc-route-main" data-action="proof-route" data-route="${route.key}">
                    <strong>${escapeHtml(route.label)}</strong>
                    <span>${escapeHtml(route.note)}</span>
                    <small>${t("課程 {lessonsDoneCount} / {length} · 題目已解 {solved} / {pool}", { lessonsDoneCount: route.lessonsDoneCount, length: route.lessons.length, solved: route.solved, pool: route.pool })}</small>
                  </button>
                  ${route.next
                    ? `<button type="button" class="button secondary lc-route-lesson" data-action="pl-open-lesson" data-lesson-id="${escapeAttr(route.next.id)}">${icon("book-open")}${escapeHtml(route.next.title.replace(/^第 \d+ 課 · /, "").slice(0, 14))}${route.lessonsDoneCount ? "" : t(" · 從這裡開始")}</button>`
                    : `<span class="lc-route-done">${icon("check")}${t("課程上完了")}</span>`}
                </div>`).join("")}
            </div>

            <div class="lc-progress">
              <div class="lc-progress-main">
                <strong>${stat.solved}<small>/ ${stat.total}</small></strong>
                <span>${t("已解")}</span>
              </div>
              ${LEVELS.map(([level, label]) => `
                <div class="lc-progress-level is-${level}">
                  <span>${escapeHtml(label)}</span>
                  <strong>${stat.by[level].solved}<small>/ ${stat.by[level].total}</small></strong>
                  <i style="--pct:${stat.by[level].total ? Math.round(stat.by[level].solved / stat.by[level].total * 100) : 0}%"></i>
                </div>`).join("")}
              <div class="lc-progress-level"><span>${t("嘗試中")}</span><strong>${stat.attempted}</strong></div>
            </div>

            <div class="lc-filters">
              <label class="lc-search">
                ${icon("search")}
                <input type="search" data-proof-search value="${escapeAttr(f.q)}" placeholder="${t("搜題目、標籤或編號")}" aria-label="${t("搜尋證明題")}">
              </label>
              <div class="lc-chip-row" role="group" aria-label="${t("難度")}">
                ${chip("level", "all", t("全部難度"))}
                ${LEVELS.map(([level, label]) => chip("level", level, label, countBy("level", level))).join("")}
              </div>
              <div class="lc-chip-row" role="group" aria-label="${t("狀態")}">
                ${chip("status", "all", t("全部狀態"))}
                ${["none", "attempted", "solved"].map((status) => chip("status", status, STATUS_LABEL[status], countBy("status", status))).join("")}
              </div>
              <div class="lc-chip-row" role="group" aria-label="${t("判卷方式")}">
                ${chip("kind", "all", t("全部"))}
                ${chip("kind", "auto", t("白話證明 · 自動判"), countBy("kind", "auto"))}
                ${chip("kind", "self", t("骨架／填空／自評"), countBy("kind", "self"))}
                ${chip("kind", "lean", "Lean", countBy("kind", "lean"))}
              </div>
              <div class="lc-chip-row lc-chip-row-groups" role="group" aria-label="${t("證法與層級")}">
                ${chip("group", "all", t("全部標籤"))}
                ${PROOF_LANG_FAMILIES.map(([family, label]) => chip("group", family, label, countBy("group", family))).join("")}
                ${Object.entries(TIER_LABEL).map(([tier, label]) => chip("group", tier, label, countBy("group", tier))).join("")}
              </div>
            </div>

            <div class="lc-table-wrap">
              <table class="lc-table">
                <thead>
                  <tr>
                    <th class="lc-col-status" scope="col"><span class="sr-only">${t("狀態")}</span></th>
                    <th class="lc-col-n" scope="col">#</th>
                    <th scope="col">${t("題目")}</th>
                    <th class="lc-col-tags" scope="col">${t("標籤")}</th>
                    <th class="lc-col-level" scope="col"><button type="button" class="lc-sort" data-action="proof-sort" data-sort="${sortNext}">${t("難度{sortMark}", { sortMark })}</button></th>
                    <th class="lc-col-record" scope="col">${t("你的紀錄")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${list.length ? list.map((row) => `
                    <tr class="lc-row is-${row.status}" data-proof-key="${escapeAttr(row.key)}" tabindex="0" role="link" aria-label="${escapeAttr(`#${row.n} ${row.title}`)}">
                      <td class="lc-col-status">${statusMark(row.status)}</td>
                      <td class="lc-col-n">${row.n}</td>
                      <td class="lc-col-title"><span class="lc-title">${escapeHtml(row.title)}</span><span class="lc-kind">${row.kind === "auto" ? t("自動判") : row.kind === "lean" ? "Lean" : row.machine ? t("自己寫機器判 · 骨架／填空") : t("骨架／填空判 · 自評")}</span></td>
                      <td class="lc-col-tags">${row.tags.map((tag) => `<span class="lc-tag">${escapeHtml(tag)}</span>`).join("")}</td>
                      <td class="lc-col-level">${levelPill(row.level)}</td>
                      <td class="lc-col-record">${recordCell(row)}</td>
                    </tr>`).join("") : `<tr><td colspan="6"><div class="empty-state">${t("沒有符合篩選的題目。")}</div></td></tr>`}
                </tbody>
              </table>
            </div>
          </section>
        </main>`;
    }

    function recordCell(row) {
      if (row.status === "solved") return `<span class="lc-record is-solved">${t("已解")}${row.attempts ? ` ${t("· {attempts} 次提交", { attempts: row.attempts })}` : ""}</span>`;
      if (row.status === "attempted") {
        if (row.kind === "auto") return `<span class="lc-record">${row.attempts ? `${t("{attempts} 次提交", { attempts: row.attempts })}` : t("有草稿")}${row.lastVerdict && row.lastVerdict !== "empty" ? ` · ${({ partial: t("有黃"), incomplete: t("未完"), broken: t("有紅"), verified: t("全綠") })[row.lastVerdict] || ""}` : ""}</span>`;
        return `<span class="lc-record">${({ partial: t("部分會"), stuck: t("還不會") })[row.lastVerdict] || t("看過")}</span>`;
      }
      return `<span class="lc-record is-none">—</span>`;
    }

    /* ── 題目頁的殼：左邊題目／提示／題解／提交紀錄，右邊寫 ─────────────── */
    // nav = { prev, next, index, total }（app.js 照目前篩選算）；left/right 是兩欄的 HTML
    function renderProblemShell(row, nav, left, right, options = {}) {
      const jump = (target, label, glyph) => target
        ? `<button type="button" class="button ghost lc-jump" data-action="open-proof-problem" data-proof-key="${escapeAttr(target.key)}" title="${escapeAttr(`#${target.n} ${target.title}`)}">${glyph === "left" ? icon("chevron-left") : ""}${label}${glyph === "right" ? icon("chevron-right") : ""}</button>`
        : `<button type="button" class="button ghost lc-jump" disabled>${glyph === "left" ? icon("chevron-left") : ""}${label}${glyph === "right" ? icon("chevron-right") : ""}</button>`;
      return `
        <main class="screen">
          <section class="panel page-panel lc-screen ${options.className || ""}">
            <div class="lc-topbar">
              <button type="button" class="button ghost" data-action="open-proofs">${icon("list")}${t("題庫")}</button>
              <div class="lc-topbar-title">
                <span class="lc-n">#${row.n}</span>
                <h2>${escapeHtml(row.title)}</h2>
                ${levelPill(row.level)}
                ${row.status === "solved" ? `<span class="lc-status is-solved" title="${t("已解")}">✔</span>` : ""}
              </div>
              <div class="lc-topbar-nav">
                ${jump(nav.prev, t("上一題"), "left")}
                <span class="lc-topbar-pos">${nav.index + 1} / ${nav.total}</span>
                ${jump(nav.next, t("下一題"), "right")}
              </div>
            </div>
            <div class="lc-split">
              <section class="lc-pane lc-desc">${left}</section>
              <section class="lc-pane lc-work">${right}</section>
            </div>
          </section>
        </main>`;
    }

    // 手機是單欄：題目說明排在編輯器前面，「同一種證法」那四張卡會把編輯器推到 800px 以下。
    // 窄畫面預設收起來（桌機側欄夠高，照樣攤開）。
    function narrowScreen() {
      return Boolean(window.matchMedia && window.matchMedia("(max-width: 900px)").matches);
    }

    // 白話證明的題目頁。tab：problem / hint / solution / submissions
    function renderProblem(row, spec, proofWrite, records, nav) {
      const tab = proofWrite.tab || "problem";
      const entry = (records.proofLang || {})[spec.id] || {};
      const submissions = (entry.submissions || []).slice().reverse();
      const related = proofLangProblems().filter((item) => item.family === spec.family && item.id !== spec.id).slice(0, 4);
      const tabButton = (id, label, count) => `<button type="button" class="lc-tab ${tab === id ? "is-active" : ""}" role="tab" aria-selected="${tab === id ? "true" : "false"}" data-action="pl-tab" data-tab="${id}">${escapeHtml(label)}${count ? `<small>${count}</small>` : ""}</button>`;
      const body = {
        problem: `
          <div class="lc-statement">
            <p>${escapeHtml(spec.statement)}</p>
            <div class="pl-goal math-block" data-tex="${escapeAttr(spec.prompt)}"></div>
          </div>
          ${spec.classic ? `<p class="panel-note lc-classic-link">${t("這是經典證明題的機器判版本：寫完全綠提交，那一題就算解了。")}<button type="button" class="link-button" data-action="open-proof-problem" data-proof-key="pf:${escapeAttr(spec.classic)}">${t("看原題（骨架重排、填空、參考證明）")}</button></p>` : ""}
          <div class="lc-meta">
            <span class="lc-tag">${escapeHtml(FAMILY_LABEL[spec.family] || spec.family)}</span>
            <span class="lc-tag">R${spec.difficulty}</span>
            <span class="lc-tag">${t("白話證明 · 自動判")}</span>
          </div>
          <details class="lc-howto">
            <summary>${t("怎麼寫、怎麼判")}</summary>
            <p>${t("一行一句，每句用一種句型開頭（任取／取／假設／則／由…／因為…所以／故）。右邊每打一行就檢查：代數鏈在假設下取樣驗、定理對形狀、骨架看有沒有到齊。綠＝驗過、黃＝讀得懂但驗不了、紅＝不成立或讀不懂。按「提交」會記一筆，全綠就是通過。")}</p>
          </details>
          ${related.length ? `
            <details class="lc-related" ${narrowScreen() ? "" : "open"}>
              <summary class="section-label">${t("同一種證法 · {length} 題", { length: related.length })}</summary>
              <div class="lc-related-list">
              ${related.map((item) => `<button type="button" class="lc-related-item" data-action="open-proof-problem" data-proof-key="pl:${escapeAttr(item.id)}"><span>${escapeHtml(item.title)}</span>${levelPill(levelOf("auto", item.difficulty))}</button>`).join("")}
              </div>
            </details>` : ""}`,
        hint: `
          <div class="lc-hint">
            <p class="section-label">${t("教練提示")}</p>
            <p class="pl-coach">${icon("lightbulb")}${escapeHtml(spec.coach || t("這題沒有額外提示 —— 先從骨架開始寫。"))}</p>
            <p class="section-label">${t("這一族的骨架")}</p>
            <p>${escapeHtml({
              "epsilon-delta": t("任取 ε > 0 → 取 δ（或 N）用 ε 寫 → 假設 0 < |x − a| < δ → 一條鏈推到 |f(x) − L| < ε → 結論。"),
              induction: t("當 n = 1 時成立（基底）→ 假設 n = k 時成立 → 從 n = k+1 的左式一路走到右式 → 結論。"),
              cases: t("分兩種情況 → 情況一：條件 → 走到目標 → 情況二：否則 → 走到目標 → 故 …。"),
              contradiction: t("反設 … → 造出一個更大／更小／不該存在的東西 → 這與 … 矛盾 → 故 …。"),
              direct: t("從顯然的起點（平方 ≥ 0、題目給的條件、一個定理）出發 → 一條鏈走到目標 → 故 …。")
            }[spec.family] || "")}</p>
          </div>`,
        solution: `
          <div class="lc-solution">
            <p class="section-label">${t("參考證明")}</p>
            <p class="panel-note">${t("先自己寫過再看。看了之後這題仍然可以提交，但紀錄會註明「看過題解」。")}</p>
            <pre>${escapeHtml(spec.reference.join("\n"))}</pre>
          </div>`,
        submissions: submissions.length ? `
          <ol class="lc-submissions">
            ${submissions.map((item) => `
              <li class="is-${item.verdict}">
                <span class="lc-sub-verdict">${escapeHtml(verdictWord(item.verdict))}</span>
                <span class="lc-sub-detail">${item.lines ? `${t("{lines} 行", { lines: item.lines })}` : ""}${item.error ? ` ${t("· {error} 紅", { error: item.error })}` : ""}${item.unsure ? ` ${t("· {unsure} 黃", { unsure: item.unsure })}` : ""}${item.viewedSolution ? t(" · 看過題解") : ""}</span>
                <time>${escapeHtml(formatWhen(item.at))}</time>
              </li>`).join("")}
          </ol>` : `<div class="empty-state">${t("還沒提交過。寫完按右下角的「提交」。")}</div>`
      };
      const left = `
        <nav class="lc-tabs" role="tablist" aria-label="${t("題目分頁")}">
          ${tabButton("problem", t("題目"))}
          ${tabButton("hint", t("提示"))}
          ${tabButton("solution", t("題解"))}
          ${tabButton("submissions", t("提交紀錄"), submissions.length)}
        </nav>
        <div class="lc-tab-body" role="tabpanel">${body[tab] || body.problem}</div>`;
      const last = proofWrite.lastSubmit;
      const right = `
        <div class="lc-work-head">
          <span class="section-label">${t("白話證明 · 一行一句")}</span>
          <span class="lc-live">${icon("zap")}${t("每一行都即時檢查")}</span>
        </div>
        ${renderProofLangEditor(spec, proofWrite.text, proofWrite.report, false, {
          mode: (records.settings || {}).proofInputMode,
          noReference: true,
          // 剛提交、內容沒改：提交結果就是結論，不再重複畫一次即時結論
          hideVerdict: Boolean(last && last.source === proofWrite.text),
          extra: `<button class="button home-primary lc-submit" data-action="pl-submit">${icon("send")}${t("提交")}</button>`,
          after: last ? `
            <div class="lc-result is-${last.verdict}" data-pl-submit-result aria-live="polite">
              <strong>${escapeHtml(verdictWord(last.verdict))}</strong>
              <span>${escapeHtml(last.text)}</span>
              ${last.verdict === "verified" && nav.next ? `<button type="button" class="button secondary" data-action="open-proof-problem" data-proof-key="${escapeAttr(nav.next.key)}">${icon("chevron-right")}${t("下一題：#{n} {title}", { n: nav.next.n, title: escapeHtml(nav.next.title) })}</button>` : ""}
            </div>` : ""
        })}`;
      return renderProblemShell(row, nav, left, right, { className: "pl-screen" });
    }

    function verdictWord(verdict) {
      return { verified: t("Accepted · 通過"), partial: t("未通過 · 有句子驗不了"), incomplete: t("未通過 · 結構沒到齊"), broken: t("Wrong Answer · 有一行不成立"), empty: t("空的") }[verdict] || verdict;
    }

    function formatWhen(iso) {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return "";
      const pad = (n) => String(n).padStart(2, "0");
      return `${date.getMonth() + 1}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function renderProofTutorial(proofWrite, records) {
      const lessons = proofLangLessons();
      const lesson = lessons.find((item) => item.id === proofWrite.lessonId) || lessons[0];
      if (!lesson) return null;
      const example = proofLangSpec(lesson.exampleId);
      const exampleReport = example ? runProofLangCheck(example, example.reference.join("\n")) : null;
      const exercise = proofLangSpec(lesson.exercise.id);
      const index = lessons.indexOf(lesson);
      const done = records.proofLangLessons || {};
      return `
        <main class="screen">
          <section class="panel page-panel pl-screen pl-tutorial">
            <div class="page-head">
              <div>
                <p class="section-label">${t("白話證明教學 · 第 {v} / {length} 課", { v: index + 1, length: lessons.length })}</p>
                <h2>${escapeHtml(lesson.title.replace(/^第 \d+ 課 · /, ""))}</h2>
                <p>${t("約 {minutes} 分鐘 · 先看一份寫好的證明，再自己寫幾行。", { minutes: lesson.minutes })}</p>
              </div>
              <div class="action-row">
                <button class="button secondary" data-action="open-proofs">${icon("chevron-right")}${t("回證明訓練")}</button>
              </div>
            </div>
            <nav class="pl-lesson-nav" aria-label="${t("課程")}">
              ${lessons.map((item, i) => `<button type="button" class="${item.id === lesson.id ? "is-active" : ""} ${done[item.id] ? "is-done" : ""}" data-action="pl-open-lesson" data-lesson-id="${escapeAttr(item.id)}">${i + 1}${done[item.id] ? " ✔" : ""}</button>`).join("")}
            </nav>
            <div class="pl-intro">${lesson.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
            ${example ? `
              <section class="pl-example">
                <div class="pl-example-head"><p class="section-label">${t("範例 · {title}", { title: escapeHtml(example.title) })}</p><span>${t("每一行旁邊是檢查器真的跑出來的註解")}</span></div>
                <div class="pl-goal math-block" data-tex="${escapeAttr(example.prompt)}"></div>
                ${renderProofLangLines(exampleReport)}
              </section>` : ""}
            ${exercise ? `
              <section class="pl-exercise">
                <div class="pl-example-head"><p class="section-label">${t("練習 · {title}", { title: escapeHtml(exercise.title) })}</p><span>${escapeHtml(lesson.exercise.task)}</span></div>
                <div class="pl-goal math-block" data-tex="${escapeAttr(exercise.prompt)}"></div>
                ${renderProofLangEditor(exercise, proofWrite.text, proofWrite.report, proofWrite.showReference, {
                  mode: (records.settings || {}).proofInputMode,
                  extra: index + 1 < lessons.length
                    ? `<button class="button home-primary" data-action="pl-open-lesson" data-lesson-id="${escapeAttr(lessons[index + 1].id)}">${icon("play")}${t("下一課")}</button>`
                    : `<button class="button home-primary" data-action="open-proofs">${icon("check")}${t("上完了，去題庫寫")}</button>`
                })}
              </section>` : ""}
          </section>
        </main>`;
    }

    // 經典證明題頁上的入口卡：這題有機器判版本（spec.classic）時，帶去白話證明編輯器；通過後卡片變綠
    function renderMachineCard(machineSpec, progress) {
      if (!machineSpec) return "";
      const passed = Boolean(progress && progress.machinePassedAt);
      return `
        <div class="proof-machine ${passed ? "is-passed" : ""}">
          <div>
            <strong>${passed ? `${icon("check")}${t("你寫的證明機器判通過了")}` : t("自己寫，機器判")}</strong>
            <small>${passed ? t("可以再寫一次，或回題庫。") : t("用白話證明寫這題：一句一句即時檢查，全綠提交就算解了。排步驟與填空仍在下面。")}</small>
          </div>
          <button class="button home-primary" data-action="open-proof-problem" data-proof-key="pl:${escapeAttr(machineSpec.id)}">${icon("pen")}${passed ? t("再寫一次") : t("開始寫")}</button>
        </div>`;
    }

    return {
      problems: proofLangProblems,
      lessons: proofLangLessons,
      spec: proofLangSpec,
      specForClassic,
      renderMachineCard,
      draft: proofLangDraft,
      check: runProofLangCheck,
      rows,
      filterRows,
      summary,
      renderVerdict: renderProofLangVerdict,
      renderLines: renderProofLangLines,
      renderIndex,
      renderProblem,
      renderProblemShell,
      renderTutorial: renderProofTutorial,
      levelPill,
      verdictWord
    };
  }

  window.BuzzProofLabUI = { create };
})();
