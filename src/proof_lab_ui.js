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

  function create(deps) {
    const { escapeHtml, escapeAttr, icon } = deps;

    function proofLangProblems() {
      return Array.isArray(window.BUZZ_PROOF_LANG_PROBLEMS) ? window.BUZZ_PROOF_LANG_PROBLEMS : [];
    }

    const PROOF_LANG_FAMILIES = [["epsilon-delta", "ε-δ"], ["direct", "直接"], ["cases", "分情況"], ["contradiction", "反證"], ["induction", "歸納"]];

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

    function runProofLangCheck(spec, text) {
      if (!window.BuzzProofLang || !spec) return null;
      try {
        return window.BuzzProofLang.check(spec, text);
      } catch (error) {
        return { lines: [], counts: { ok: 0, unsure: 0, error: 0 }, missing: [], verdict: "empty", verdictText: `檢查器出錯：${error.message}`, goalDone: false };
      }
    }

    // 句型範本：按一下插到游標處。跟鍵盤一樣的邏輯 —— 使用者不用背關鍵字。
    const PROOF_LANG_TEMPLATES = [
      ["任取", "任取 ε > 0。"],
      ["取", "取 δ = ε/3。"],
      ["假設", "假設 0 < |x − a| < δ。"],
      ["則", "則 A = B < C。"],
      ["由定理", "由平均值定理，…。"],
      ["因為所以", "因為 …，所以 …。"],
      ["分情況", "分兩種情況。"],
      ["情況", "情況一：x ≥ 0。"],
      ["歸納", "用歸納法。"],
      ["基底", "當 n = 1 時，左式 = …，右式 = …，成立。"],
      ["歸納假設", "假設 n = k 時成立，即 …。"],
      ["反設", "反設 …。"],
      ["矛盾", "這與 … 矛盾。"],
      ["故", "故 …。"]
    ];

    function renderProofLangVerdict(report) {
      if (!report) return "";
      const tone = { verified: "is-ok", partial: "is-unsure", incomplete: "is-unsure", broken: "is-error", empty: "" }[report.verdict] || "";
      const label = { verified: "✔ 每一步都通過檢查", partial: "△ 讀得懂，有幾句驗不了", incomplete: "△ 結構還沒到齊", broken: "✘ 有一行過不了", empty: "還沒寫" }[report.verdict] || "";
      return `
        <div class="pl-verdict ${tone}" data-pl-verdict aria-live="polite">
          <strong>${escapeHtml(label)}</strong>
          <span>${escapeHtml(report.verdictText || "")}</span>
          ${report.missing && report.missing.length ? `<ul>${report.missing.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
        </div>`;
    }

    function renderProofLangLines(report) {
      if (!report || !report.lines.length) return `<p class="panel-note">寫一行就會立刻檢查。每一行要用一種句型開頭 —— 不確定就按上面的範本。</p>`;
      return `
        <ol class="pl-lines">
          ${report.lines.map((line) => `
            <li class="is-${line.status}">
              <span class="pl-line-mark" aria-hidden="true">${line.status === "ok" ? "✔" : line.status === "unsure" ? "△" : "✘"}</span>
              <div>
                <div class="pl-line-text"><small>第 ${line.n} 行 · ${escapeHtml(line.label || "？")}</small>${escapeHtml(line.raw)}</div>
                <p class="pl-line-note">${escapeHtml(line.note || "")}</p>
              </div>
            </li>`).join("")}
        </ol>`;
    }

    // 編輯器：範本列、textarea、即時報告、底下的按鈕列。
    // 題目頁不放「看參考證明」（題解在左邊的分頁）；教學頁還是用切換的。
    function renderProofLangEditor(spec, text, report, showReference, options = {}) {
      const rows = Math.max(8, Math.min(18, String(text || "").split("\n").length + 2));
      const referenceButton = options.noReference ? "" : `<button class="button secondary" data-action="pl-toggle-reference">${icon("eye")}${showReference ? "收起參考證明" : "看參考證明"}</button>`;
      return `
        <div class="pl-editor" data-pl-editor>
          <div class="pl-templates" role="toolbar" aria-label="句型範本">
            ${PROOF_LANG_TEMPLATES.map(([label, tpl]) => `<button type="button" class="pl-template" data-action="pl-insert" data-text="${escapeAttr(tpl)}">${escapeHtml(label)}</button>`).join("")}
          </div>
          <label class="sr-only" for="pl-text">證明內容</label>
          <textarea id="pl-text" data-proof-lang-text rows="${rows}" spellcheck="false" placeholder="一行一句。例如：任取 ε > 0。">${escapeHtml(text || "")}</textarea>
          <div class="action-row pl-actions">
            ${referenceButton}
            <button class="button ghost" data-action="pl-clear">${icon("trash")}清空重寫</button>
            ${options.extra || ""}
          </div>
          ${options.after || ""}
          ${showReference && !options.noReference ? `<div class="pl-reference"><p class="section-label">參考證明</p><pre>${escapeHtml(spec.reference.join("\n"))}</pre></div>` : ""}
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
    const LEVELS = [["easy", "簡單"], ["medium", "中等"], ["hard", "困難"]];
    const LEVEL_LABEL = Object.fromEntries(LEVELS);
    const TIER_LABEL = { basic: "基礎", standard: "標準", advanced: "進階", boss: "終極", contest: "競賽", classic: "經典解析", lean: "Lean" };
    const FAMILY_LABEL = Object.fromEntries(PROOF_LANG_FAMILIES);
    const STATUS_LABEL = { none: "未做", attempted: "嘗試中", solved: "已解" };

    const levelOf = (kind, difficulty) => (kind === "auto"
      ? (difficulty <= 1 ? "easy" : difficulty === 2 ? "medium" : "hard")
      : (difficulty <= 2 ? "easy" : difficulty <= 4 ? "medium" : "hard"));

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
        const solved = entry.status === "understood" || drillsDone;
        const touched = Object.keys(entry).length > 0;
        return {
          key: `pf:${proof.id}`, kind: proof.tier === "lean" ? "lean" : "self", id: proof.id, n: auto.length + i + 1, title: proof.title,
          level: levelOf("self", proof.difficulty), difficulty: proof.difficulty,
          family: "", tier: proof.tier, tags: [TIER_LABEL[proof.tier] || proof.tier].concat((proof.tags || []).slice(0, 3)),
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
      const chip = (key, value, label, count) => `<button type="button" class="lc-chip ${f[key] === value ? "is-active" : ""}" data-action="proof-filter" data-filter-key="${key}" data-filter-value="${escapeAttr(value)}" aria-pressed="${f[key] === value ? "true" : "false"}">${escapeHtml(label)}${count !== undefined ? `<small>${count}</small>` : ""}</button>`;
      const countBy = (key, value) => all.filter((row) => value === "all" || row[key] === value || (key === "group" && (row.family === value || row.tier === value))).length;
      const sortNext = f.sort === "level" ? "-level" : f.sort === "-level" ? "n" : "level";
      const sortMark = f.sort === "level" ? " ↑" : f.sort === "-level" ? " ↓" : "";
      return `
        <main class="screen">
          <section class="panel page-panel lc-index">
            <div class="page-head">
              <div>
                <p class="section-label">證明訓練</p>
                <h2>證明題庫</h2>
                <p class="proof-subtitle">${all.length} 題：白話證明一行一句即時判、骨架重排與填空機器判、長證明自評。不限時、不進計分。</p>
              </div>
              <div class="action-row">
                <button class="button home-primary" data-action="pl-open-lesson" data-lesson-id="${escapeAttr((lessons[0] || {}).id || "")}">${icon("book-open")}先上 ${lessons.length} 課${lessonsDone ? ` · 已完成 ${lessonsDone}` : ""}</button>
                <button class="button secondary" data-action="proof-random">${icon("shuffle")}隨機一題</button>
                <button class="button secondary" data-action="home">${icon("home")}回主線</button>
              </div>
            </div>

            <div class="lc-progress">
              <div class="lc-progress-main">
                <strong>${stat.solved}<small>/ ${stat.total}</small></strong>
                <span>已解</span>
              </div>
              ${LEVELS.map(([level, label]) => `
                <div class="lc-progress-level is-${level}">
                  <span>${escapeHtml(label)}</span>
                  <strong>${stat.by[level].solved}<small>/ ${stat.by[level].total}</small></strong>
                  <i style="--pct:${stat.by[level].total ? Math.round(stat.by[level].solved / stat.by[level].total * 100) : 0}%"></i>
                </div>`).join("")}
              <div class="lc-progress-level"><span>嘗試中</span><strong>${stat.attempted}</strong></div>
            </div>

            <div class="lc-filters">
              <label class="lc-search">
                ${icon("search")}
                <input type="search" data-proof-search value="${escapeAttr(f.q)}" placeholder="搜題目、標籤或編號" aria-label="搜尋證明題">
              </label>
              <div class="lc-chip-row" role="group" aria-label="難度">
                ${chip("level", "all", "全部難度")}
                ${LEVELS.map(([level, label]) => chip("level", level, label, countBy("level", level))).join("")}
              </div>
              <div class="lc-chip-row" role="group" aria-label="狀態">
                ${chip("status", "all", "全部狀態")}
                ${["none", "attempted", "solved"].map((status) => chip("status", status, STATUS_LABEL[status], countBy("status", status))).join("")}
              </div>
              <div class="lc-chip-row" role="group" aria-label="判卷方式">
                ${chip("kind", "all", "全部")}
                ${chip("kind", "auto", "白話證明 · 自動判", countBy("kind", "auto"))}
                ${chip("kind", "self", "骨架／填空／自評", countBy("kind", "self"))}
                ${chip("kind", "lean", "Lean", countBy("kind", "lean"))}
              </div>
              <div class="lc-chip-row lc-chip-row-groups" role="group" aria-label="證法與層級">
                ${chip("group", "all", "全部標籤")}
                ${PROOF_LANG_FAMILIES.map(([family, label]) => chip("group", family, label, countBy("group", family))).join("")}
                ${Object.entries(TIER_LABEL).map(([tier, label]) => chip("group", tier, label, countBy("group", tier))).join("")}
              </div>
            </div>

            <div class="lc-table-wrap">
              <table class="lc-table">
                <thead>
                  <tr>
                    <th class="lc-col-status" scope="col"><span class="sr-only">狀態</span></th>
                    <th class="lc-col-n" scope="col">#</th>
                    <th scope="col">題目</th>
                    <th class="lc-col-tags" scope="col">標籤</th>
                    <th class="lc-col-level" scope="col"><button type="button" class="lc-sort" data-action="proof-sort" data-sort="${sortNext}">難度${sortMark}</button></th>
                    <th class="lc-col-record" scope="col">你的紀錄</th>
                  </tr>
                </thead>
                <tbody>
                  ${list.length ? list.map((row) => `
                    <tr class="lc-row is-${row.status}" data-proof-key="${escapeAttr(row.key)}" tabindex="0" role="link" aria-label="${escapeAttr(`#${row.n} ${row.title}`)}">
                      <td class="lc-col-status">${statusMark(row.status)}</td>
                      <td class="lc-col-n">${row.n}</td>
                      <td class="lc-col-title"><span class="lc-title">${escapeHtml(row.title)}</span><span class="lc-kind">${row.kind === "auto" ? "自動判" : row.kind === "lean" ? "Lean" : "骨架／填空判 · 自評"}</span></td>
                      <td class="lc-col-tags">${row.tags.map((tag) => `<span class="lc-tag">${escapeHtml(tag)}</span>`).join("")}</td>
                      <td class="lc-col-level">${levelPill(row.level)}</td>
                      <td class="lc-col-record">${recordCell(row)}</td>
                    </tr>`).join("") : `<tr><td colspan="6"><div class="empty-state">沒有符合篩選的題目。</div></td></tr>`}
                </tbody>
              </table>
            </div>
          </section>
        </main>`;
    }

    function recordCell(row) {
      if (row.status === "solved") return `<span class="lc-record is-solved">已解${row.attempts ? ` · ${row.attempts} 次提交` : ""}</span>`;
      if (row.status === "attempted") {
        if (row.kind === "auto") return `<span class="lc-record">${row.attempts ? `${row.attempts} 次提交` : "有草稿"}${row.lastVerdict && row.lastVerdict !== "empty" ? ` · ${({ partial: "有黃", incomplete: "未完", broken: "有紅", verified: "全綠" })[row.lastVerdict] || ""}` : ""}</span>`;
        return `<span class="lc-record">${({ partial: "部分會", stuck: "還不會" })[row.lastVerdict] || "看過"}</span>`;
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
              <button type="button" class="button ghost" data-action="open-proofs">${icon("list")}題庫</button>
              <div class="lc-topbar-title">
                <span class="lc-n">#${row.n}</span>
                <h2>${escapeHtml(row.title)}</h2>
                ${levelPill(row.level)}
                ${row.status === "solved" ? `<span class="lc-status is-solved" title="已解">✔</span>` : ""}
              </div>
              <div class="lc-topbar-nav">
                ${jump(nav.prev, "上一題", "left")}
                <span class="lc-topbar-pos">${nav.index + 1} / ${nav.total}</span>
                ${jump(nav.next, "下一題", "right")}
              </div>
            </div>
            <div class="lc-split">
              <section class="lc-pane lc-desc">${left}</section>
              <section class="lc-pane lc-work">${right}</section>
            </div>
          </section>
        </main>`;
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
          <div class="lc-meta">
            <span class="lc-tag">${escapeHtml(FAMILY_LABEL[spec.family] || spec.family)}</span>
            <span class="lc-tag">R${spec.difficulty}</span>
            <span class="lc-tag">白話證明 · 自動判</span>
            ${spec.source ? `<span class="lc-tag lc-tag-source">${escapeHtml(spec.source)}</span>` : ""}
          </div>
          <details class="lc-howto">
            <summary>怎麼寫、怎麼判</summary>
            <p>一行一句，每句用一種句型開頭（任取／取／假設／則／由…／因為…所以／故）。右邊每打一行就檢查：代數鏈在假設下取樣驗、定理對形狀、骨架看有沒有到齊。綠＝驗過、黃＝讀得懂但驗不了、紅＝不成立或讀不懂。按「提交」會記一筆，全綠就是通過。</p>
          </details>
          ${related.length ? `
            <div class="lc-related">
              <p class="section-label">同一種證法</p>
              ${related.map((item) => `<button type="button" class="lc-related-item" data-action="open-proof-problem" data-proof-key="pl:${escapeAttr(item.id)}"><span>${escapeHtml(item.title)}</span>${levelPill(levelOf("auto", item.difficulty))}</button>`).join("")}
            </div>` : ""}`,
        hint: `
          <div class="lc-hint">
            <p class="section-label">教練提示</p>
            <p class="pl-coach">${icon("lightbulb")}${escapeHtml(spec.coach || "這題沒有額外提示 —— 先從骨架開始寫。")}</p>
            <p class="section-label">這一族的骨架</p>
            <p>${escapeHtml({
              "epsilon-delta": "任取 ε > 0 → 取 δ（或 N）用 ε 寫 → 假設 0 < |x − a| < δ → 一條鏈推到 |f(x) − L| < ε → 結論。",
              induction: "當 n = 1 時成立（基底）→ 假設 n = k 時成立 → 從 n = k+1 的左式一路走到右式 → 結論。",
              cases: "分兩種情況 → 情況一：條件 → 走到目標 → 情況二：否則 → 走到目標 → 故 …。",
              contradiction: "反設 … → 造出一個更大／更小／不該存在的東西 → 這與 … 矛盾 → 故 …。",
              direct: "從顯然的起點（平方 ≥ 0、題目給的條件、一個定理）出發 → 一條鏈走到目標 → 故 …。"
            }[spec.family] || "")}</p>
          </div>`,
        solution: `
          <div class="lc-solution">
            <p class="section-label">參考證明</p>
            <p class="panel-note">先自己寫過再看。看了之後這題仍然可以提交，但紀錄會註明「看過題解」。</p>
            <pre>${escapeHtml(spec.reference.join("\n"))}</pre>
          </div>`,
        submissions: submissions.length ? `
          <ol class="lc-submissions">
            ${submissions.map((item) => `
              <li class="is-${item.verdict}">
                <span class="lc-sub-verdict">${escapeHtml(verdictWord(item.verdict))}</span>
                <span class="lc-sub-detail">${item.lines ? `${item.lines} 行` : ""}${item.error ? ` · ${item.error} 紅` : ""}${item.unsure ? ` · ${item.unsure} 黃` : ""}${item.viewedSolution ? " · 看過題解" : ""}</span>
                <time>${escapeHtml(formatWhen(item.at))}</time>
              </li>`).join("")}
          </ol>` : `<div class="empty-state">還沒提交過。寫完按右下角的「提交」。</div>`
      };
      const left = `
        <nav class="lc-tabs" role="tablist" aria-label="題目分頁">
          ${tabButton("problem", "題目")}
          ${tabButton("hint", "提示")}
          ${tabButton("solution", "題解")}
          ${tabButton("submissions", "提交紀錄", submissions.length)}
        </nav>
        <div class="lc-tab-body" role="tabpanel">${body[tab] || body.problem}</div>`;
      const last = proofWrite.lastSubmit;
      const right = `
        <div class="lc-work-head">
          <span class="section-label">白話證明 · 一行一句</span>
          <span class="lc-live">${icon("zap")}每一行都即時檢查</span>
        </div>
        ${renderProofLangEditor(spec, proofWrite.text, proofWrite.report, false, {
          noReference: true,
          // 剛提交、內容沒改：提交結果就是結論，不再重複畫一次即時結論
          hideVerdict: Boolean(last && last.source === proofWrite.text),
          extra: `<button class="button home-primary lc-submit" data-action="pl-submit">${icon("send")}提交</button>`,
          after: last ? `
            <div class="lc-result is-${last.verdict}" data-pl-submit-result aria-live="polite">
              <strong>${escapeHtml(verdictWord(last.verdict))}</strong>
              <span>${escapeHtml(last.text)}</span>
              ${last.verdict === "verified" && nav.next ? `<button type="button" class="button secondary" data-action="open-proof-problem" data-proof-key="${escapeAttr(nav.next.key)}">${icon("chevron-right")}下一題：#${nav.next.n} ${escapeHtml(nav.next.title)}</button>` : ""}
            </div>` : ""
        })}`;
      return renderProblemShell(row, nav, left, right, { className: "pl-screen" });
    }

    function verdictWord(verdict) {
      return { verified: "Accepted · 通過", partial: "未通過 · 有句子驗不了", incomplete: "未通過 · 結構沒到齊", broken: "Wrong Answer · 有一行不成立", empty: "空的" }[verdict] || verdict;
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
                <p class="section-label">白話證明教學 · 第 ${index + 1} / ${lessons.length} 課</p>
                <h2>${escapeHtml(lesson.title.replace(/^第 \d 課 · /, ""))}</h2>
                <p>約 ${lesson.minutes} 分鐘 · 先看一份寫好的證明，再自己寫幾行。</p>
              </div>
              <div class="action-row">
                <button class="button secondary" data-action="open-proofs">${icon("chevron-right")}回證明訓練</button>
              </div>
            </div>
            <nav class="pl-lesson-nav" aria-label="課程">
              ${lessons.map((item, i) => `<button type="button" class="${item.id === lesson.id ? "is-active" : ""} ${done[item.id] ? "is-done" : ""}" data-action="pl-open-lesson" data-lesson-id="${escapeAttr(item.id)}">${i + 1}${done[item.id] ? " ✔" : ""}</button>`).join("")}
            </nav>
            <div class="pl-intro">${lesson.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
            ${example ? `
              <section class="pl-example">
                <div class="pl-example-head"><p class="section-label">範例 · ${escapeHtml(example.title)}</p><span>每一行旁邊是檢查器真的跑出來的註解</span></div>
                <div class="pl-goal math-block" data-tex="${escapeAttr(example.prompt)}"></div>
                ${renderProofLangLines(exampleReport)}
              </section>` : ""}
            ${exercise ? `
              <section class="pl-exercise">
                <div class="pl-example-head"><p class="section-label">練習 · ${escapeHtml(exercise.title)}</p><span>${escapeHtml(lesson.exercise.task)}</span></div>
                <div class="pl-goal math-block" data-tex="${escapeAttr(exercise.prompt)}"></div>
                ${renderProofLangEditor(exercise, proofWrite.text, proofWrite.report, proofWrite.showReference, {
                  extra: index + 1 < lessons.length
                    ? `<button class="button home-primary" data-action="pl-open-lesson" data-lesson-id="${escapeAttr(lessons[index + 1].id)}">${icon("play")}下一課</button>`
                    : `<button class="button home-primary" data-action="open-proofs">${icon("check")}上完了，去題庫寫</button>`
                })}
              </section>` : ""}
          </section>
        </main>`;
    }

    return {
      problems: proofLangProblems,
      lessons: proofLangLessons,
      spec: proofLangSpec,
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
