// 白話證明的畫面：入口清單、教學頁、題目編輯器、三色 gutter。
//
// 檢查器在 kernel/proof_lang.js（純函式），狀態（正在寫哪題、草稿、debounce）留在 app.js；
// 這裡只有「拿資料畫 HTML」的純函式。從 app.js 搬出來是因為主程式撞到效能預算 ——
// 該搬的是整頁的 render，不是調數字（見 tools/validate_performance_budget.js）。
//
// 用法：const plUI = window.BuzzProofLangUI.create({ escapeHtml, escapeAttr, icon });

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

    function renderProofLangEditor(spec, text, report, showReference, options = {}) {
      const rows = Math.max(6, Math.min(16, String(text || "").split("\n").length + 2));
      return `
        <div class="pl-editor" data-pl-editor>
          <div class="pl-templates" role="toolbar" aria-label="句型範本">
            ${PROOF_LANG_TEMPLATES.map(([label, tpl]) => `<button type="button" class="pl-template" data-action="pl-insert" data-text="${escapeAttr(tpl)}">${escapeHtml(label)}</button>`).join("")}
          </div>
          <label class="sr-only" for="pl-text">證明內容</label>
          <textarea id="pl-text" data-proof-lang-text rows="${rows}" spellcheck="false" placeholder="一行一句。例如：任取 ε > 0。">${escapeHtml(text || "")}</textarea>
          <div data-pl-report>
            ${renderProofLangVerdict(report)}
            ${renderProofLangLines(report)}
          </div>
          <div class="action-row pl-actions">
            <button class="button secondary" data-action="pl-toggle-reference">${icon("eye")}${showReference ? "收起參考證明" : "看參考證明"}</button>
            <button class="button ghost" data-action="pl-clear">${icon("trash")}清空重寫</button>
            ${options.extra || ""}
          </div>
          ${showReference ? `<div class="pl-reference"><p class="section-label">參考證明</p><pre>${escapeHtml(spec.reference.join("\n"))}</pre></div>` : ""}
        </div>`;
    }

    // 找不到題就回 null，app.js 退回證明訓練頁
    function renderProofWrite(proofWrite) {
      const spec = proofLangSpec(proofWrite.id);
      if (!spec) return null;
      return `
        <main class="screen">
          <section class="panel page-panel pl-screen">
            <div class="page-head">
              <div>
                <p class="section-label">白話證明 · ${escapeHtml(spec.family === "epsilon-delta" ? "ε-δ" : spec.family === "induction" ? "歸納法" : spec.family === "cases" ? "分情況" : spec.family === "contradiction" ? "反證" : "直接證明")}</p>
                <h2>${escapeHtml(spec.title)}</h2>
                <p>${escapeHtml(spec.statement)}</p>
              </div>
              <div class="action-row">
                <button class="button secondary" data-action="open-proofs">${icon("chevron-right")}回證明訓練</button>
              </div>
            </div>
            <div class="pl-goal math-block" data-tex="${escapeAttr(spec.prompt)}"></div>
            <p class="pl-coach">${icon("lightbulb")}${escapeHtml(spec.coach || "")}</p>
            ${renderProofLangEditor(spec, proofWrite.text, proofWrite.report, proofWrite.showReference)}
          </section>
        </main>`;
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

    // 證明訓練頁上的入口：課程 + 題目清單（照證法分組，帶你上次的結果）
    function renderProofLangEntry(records) {
      const problems = proofLangProblems();
      if (!problems.length || !window.BuzzProofLang) return "";
      const store = records.proofLang || {};
      const verdictChip = (id) => {
        const draft = store[id];
        if (!draft) return "";
        const label = { verified: "✔ 全綠", partial: "△ 部分", incomplete: "△ 未完", broken: "✘ 有錯", empty: "草稿" }[draft.verdict] || "草稿";
        return `<span class="pl-chip is-${draft.verdict}">${escapeHtml(label)}</span>`;
      };
      const lessonsDone = Object.keys(records.proofLangLessons || {}).length;
      return `
        <section class="study-card pl-entry">
          <div class="panel-title-row">
            <div>
              <p class="section-label">白話證明 · 可以被檢查的證明</p>
              <h3>一行一句，寫完每一行立刻告訴你過不過</h3>
            </div>
          </div>
          <p class="panel-note">不用 Lean、不用後端：代數鏈在假設下取樣驗、規則對形狀、骨架看有沒有到齊。它驗不了的會標黃，不會假裝。</p>
          <div class="action-row">
            <button class="button home-primary" data-action="pl-open-lesson" data-lesson-id="${escapeAttr((proofLangLessons()[0] || {}).id || "")}">${icon("book-open")}先上 ${proofLangLessons().length} 課${lessonsDone ? ` · 已完成 ${lessonsDone}` : ""}</button>
          </div>
          ${PROOF_LANG_FAMILIES.map(([family, label]) => {
            // 題目照證法分組、同組內由淺到深；四十幾題平鋪會找不到東西
            const group = problems.filter((spec) => spec.family === family).sort((x, y) => x.difficulty - y.difficulty);
            if (!group.length) return "";
            const solved = group.filter((spec) => store[spec.id] && store[spec.id].verdict === "verified").length;
            return `
              <p class="section-label pl-family-label">${escapeHtml(label)} · ${group.length} 題${solved ? ` · 全綠 ${solved}` : ""}</p>
              <div class="pl-problem-grid">
                ${group.map((spec) => `
                  <button type="button" class="pl-problem" data-action="pl-open-problem" data-proof-lang-id="${escapeAttr(spec.id)}">
                    <span class="pl-problem-family">${escapeHtml(label)} · R${spec.difficulty}</span>
                    <strong>${escapeHtml(spec.title)}</strong>
                    ${verdictChip(spec.id)}
                  </button>`).join("")}
              </div>`;
          }).join("")}
        </section>`;
    }

    return {
      problems: proofLangProblems,
      lessons: proofLangLessons,
      spec: proofLangSpec,
      draft: proofLangDraft,
      check: runProofLangCheck,
      renderVerdict: renderProofLangVerdict,
      renderLines: renderProofLangLines,
      renderWrite: renderProofWrite,
      renderTutorial: renderProofTutorial,
      renderEntry: renderProofLangEntry
    };
  }

  window.BuzzProofLangUI = { create };
})();
