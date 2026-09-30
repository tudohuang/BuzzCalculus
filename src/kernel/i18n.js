// 語言層：t("中文") 以原文當 key，查 zh→en 字典；查不到就原樣印出，並記在 missing 裡。
//
// 為什麼以原文當 key 而不是 t("home.start")：
//   這個站的字串是先寫中文、再翻英文，程式碼裡看得到原句才對得上畫面；
//   而且 CI（tools/validate_i18n.js）可以直接掃原始碼，抓到「有中文卻沒包 t()」與
//   「包了 t() 但字典沒有」兩種漏洞——用代號當 key 的話第一種抓不到。
//
// 語言在**載入時**就決定（localStorage 的 settings.lang，沒有就看瀏覽器語言），
// 之後不會變：模組初始化期的 t() 呼叫（TOPICS、TRAINING_PACKS 這種表）也要拿到對的語言，
// 所以切換語言是存設定後 reload，不做熱切換。
//
// 佔位符：t("已練 {n} 題", { n }) → "Practiced 12 problems"；
// 英文的單複數寫在字典值裡：「{n} {n|problem|problems}」。
// 這一支必須排在所有會呼叫 t() 的 script 前面（index.html 裡緊接在 vendor 之後）。

(function () {
  "use strict";

  const SUPPORTED = ["zh", "en"];
  const LOCALES = { zh: "zh-TW", en: "en-US" };
  const STORAGE_KEY = "buzzcalculus.records.v1";
  const dicts = { en: {} };
  const problemTables = { en: {} };
  const missing = new Set();

  function readSetting() {
    try {
      const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (!raw) return "";
      const records = JSON.parse(raw);
      const lang = records && records.settings && records.settings.lang;
      return SUPPORTED.includes(lang) ? lang : "";
    } catch (error) {
      return "";
    }
  }

  // 沒設定時看瀏覽器：中文（任何地區）→ zh；其他一律 en。
  /** @returns {"zh" | "en"} */
  function detect() {
    // 瀏覽器裡 window.navigator 就是 navigator；node（驗證器）的 window 是假的殼、
    // 但 node 22 自己也有一個 navigator 全域（跟著機器的語系走），所以要先看 window 的。
    const nav = (typeof window !== "undefined" && window.navigator) || (typeof navigator !== "undefined" ? navigator : null);
    const list = nav ? (nav.languages && nav.languages.length ? nav.languages : [nav.language || ""]) : [];
    const first = String(list[0] || "").toLowerCase();
    if (!first) return "zh";
    return first.startsWith("zh") ? "zh" : "en";
  }

  const setting = readSetting();
  const lang = /** @type {"zh" | "en"} */ (setting || detect());

  function plural(text, vars) {
    // {n|one|many}：n 是 1 用 one，其餘用 many
    return text.replace(/\{(\w+)\|([^|}]*)\|([^}]*)\}/g, (match, key, one, many) => {
      if (!vars || !(key in vars)) return match;
      return Number(vars[key]) === 1 ? one : many;
    });
  }

  function fill(text, vars) {
    if (!vars) return text;
    return plural(text, vars).replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
  }

  function t(text, vars) {
    let out = text;
    if (lang !== "zh") {
      const table = dicts[lang];
      const hit = table ? table[text] : undefined;
      if (hit !== undefined) out = hit;
      else if (/[一-鿿]/.test(text)) missing.add(text);
    }
    return fill(out, vars);
  }

  function register(code, table) {
    if (!dicts[code]) dicts[code] = {};
    Object.assign(dicts[code], table);
  }

  // 題目側表：{ id: { prompt, tableCaption, answer, distractors } }，只換畫面看得到的字，不動判分。
  function registerProblems(code, table) {
    if (!problemTables[code]) problemTables[code] = {};
    Object.assign(problemTables[code], table);
  }

  function problemOverlay(id) {
    const table = problemTables[lang];
    return table ? table[id] || null : null;
  }

  // ── 內容句子（解說、提示、課文）：樣板翻譯 ─────────────────────────
  // 解說與提示是夾著 Unicode 數學的中文句子。把中文字與全形標點當分隔，剩下的每一段
  // （不是純標點的）就是數學，換成 〔n〕 → 得到「樣板」。英文表以樣板的雜湊當 key、
  // 存英文樣板；執行時把原句壓成樣板、查表、把數學原封不動填回去。
  // 好處：式子一個位元組都不會被翻譯動到；同一句型（「代 x=1 得 3」）只翻一次；
  // 別人改了題目的數字，句型沒變的話英文照樣對得上。
  // tools/build_i18n_text.js 產生表（src/kernel/i18n_text_en.js，延後載入）、tools/validate_i18n.js 驗。
  const TEXT_SEPARATOR = /[　-〿㐀-䶿一-鿿！-／：-＠［-｀｛-･‘’“”…—]+/g;
  // 只有標點、空白、箭頭或間隔號的片段不算數學，留在樣板裡給翻譯處理
  const TEXT_TRIVIAL = /^[\s()[\].,;:!?'"`\-–—/·→⇒]*$/;
  const CJK_TEXT = /[㐀-䶿一-鿿]/;
  const textTables = { en: {} };
  const missingText = new Set();
  const localized = new WeakSet();

  /** @param {string} text @returns {{ template: string, spans: string[] }} */
  function textTemplate(text) {
    const source = String(text == null ? "" : text);
    const spans = [];
    let out = "";
    let last = 0;
    const take = (piece) => {
      const trimmed = piece.trim();
      if (!trimmed || TEXT_TRIVIAL.test(trimmed)) { out += piece; return; }
      const at = piece.indexOf(trimmed);
      out += `${piece.slice(0, at)}〔${spans.length}〕${piece.slice(at + trimmed.length)}`;
      spans.push(trimmed);
    };
    TEXT_SEPARATOR.lastIndex = 0;
    let match;
    while ((match = TEXT_SEPARATOR.exec(source))) {
      take(source.slice(last, match.index));
      out += match[0];
      last = match.index + match[0].length;
    }
    take(source.slice(last));
    return { template: out, spans };
  }

  /** 中文句子裡的數學片段（依出現順序） */
  const textSpans = (text) => textTemplate(text).spans;

  // FNV-1a 32 位元 → base36。碰撞由 validate_i18n 對全部現有句型檢查。
  /** @param {string} text */
  function textKey(text) {
    let h = 2166136261;
    const s = String(text);
    for (let i = 0; i < s.length; i += 1) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h.toString(36);
  }

  function fillTemplate(template, spans) {
    return String(template).replace(/〔(\d+)〕/g, (m, n) => (Number(n) < spans.length ? spans[Number(n)] : m));
  }

  function registerText(code, table) {
    if (!textTables[code]) textTables[code] = {};
    Object.assign(textTables[code], table);
  }

  // 整句查表：key「=雜湊」是整句（LaTeX 的課文式子不能切，整句翻）；否則照樣板查
  /** @param {string} text @param {string} [code] */
  function translateText(text, code) {
    const target = code || lang;
    if (target === "zh" || typeof text !== "string" || !CJK_TEXT.test(text)) return text;
    const table = textTables[target];
    if (!table) return text;
    const whole = table[`=${textKey(text)}`];
    if (whole !== undefined) return whole;
    const { template, spans } = textTemplate(text);
    const hit = table[textKey(template)];
    if (hit === undefined) { missingText.add(text); return text; }
    return fillTemplate(hit, spans);
  }
  const tx = (text) => translateText(text);

  // 把題庫換成目前語言：原文留在 promptZh，判分用的 answers 別名照舊。
  // 可以重複呼叫（每個欄位只換一次，原文存在 *Zh）。
  function localizeProblems(list) {
    if (lang === "zh") return list;
    const canned = typeof window !== "undefined" && window.BuzzCannedHints;
    list.forEach((problem) => {
      if (!problem || localized.has(problem)) return;
      localized.add(problem);
      if (typeof problem.solution === "string" && problem.solutionZh === undefined && CJK_TEXT.test(problem.solution)) {
        const en = tx(problem.solution);
        if (en !== problem.solution) { problem.solutionZh = problem.solution; problem.solution = en; }
      }
      if (Array.isArray(problem.solutionSteps) && !problem.solutionStepsZh) {
        const en = problem.solutionSteps.map((step) => (typeof step === "string" ? tx(step) : step));
        if (en.some((step, i) => step !== problem.solutionSteps[i])) { problem.solutionStepsZh = problem.solutionSteps; problem.solutionSteps = en; }
      }
      if (Array.isArray(problem.hints) && !problem.hintsZh) {
        // 罐頭句（對每題都成立的提示）留中文原文：app.js 用原文比對把它們濾掉，翻了反而會漏網
        const en = problem.hints.map((hint) => (typeof hint === "string" && !(canned && canned.isCanned(hint)) ? tx(hint) : hint));
        if (en.some((hint, i) => hint !== problem.hints[i])) { problem.hintsZh = problem.hints; problem.hints = en; }
      }
      const overlay = problemOverlay(problem.id);
      if (!overlay) return;
      if (overlay.prompt) { problem.promptZh = problem.prompt; problem.prompt = overlay.prompt; }
      if (overlay.tableCaption) problem.tableCaption = overlay.tableCaption;
      if (overlay.answer) { problem.answerZh = problem.answer; problem.answer = overlay.answer; }
      if (overlay.canonical) {
        problem.canonical = overlay.canonical;
        // 選擇題把 canonical 當正確選項印出來，判分是拿選到的字比 answers 別名 —— 英文的那個字要收進去
        if (Array.isArray(problem.answers) && !problem.answers.includes(overlay.canonical)) problem.answers = problem.answers.concat(overlay.canonical);
      }
      if (overlay.distractors) problem.distractors = overlay.distractors;
      if (overlay.fields && Array.isArray(problem.fields)) {
        problem.fields.forEach((field) => {
          const f = overlay.fields[field.key];
          if (!f) return;
          if (f.label) field.label = f.label;
          if (f.note) field.note = f.note;
        });
      }
    });
    return list;
  }

  const api = {
    lang,
    locale: LOCALES[lang] || LOCALES.zh,
    supported: SUPPORTED.slice(),
    setting,
    detected: detect(),
    t,
    fill,
    register,
    registerProblems,
    problemOverlay,
    localizeProblems,
    registerText,
    tx,
    translateText,
    textTemplate,
    textSpans,
    textKey,
    fillTemplate,
    textTable: (code) => textTables[code] || {},
    missingText,
    missing,
    hasDictionary: (code) => Boolean(dicts[code]) && Object.keys(dicts[code]).length > 0,
    dictionary: (code) => dicts[code] || {},
    problemTable: (code) => problemTables[code] || {}
  };

  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    // index.html 的開站骨架是靜態中文（app.js 第一次 render 才換掉）；英文介面在這裡先把它換掉
    if (lang === "en") {
      const note = document.querySelector(".sk-note");
      if (note) note.textContent = "Loading problems…";
    }
  }

  // 瀏覽器裡 globalThis 就是 window；node（tools/lib/app_api.js）的 window 是另一個殼，
  // 而 app.js 裡 t(…) 是裸識別字，所以兩邊都要掛。
  const root = /** @type {any} */ (typeof globalThis !== "undefined" ? globalThis : window);
  root.BuzzI18n = api;
  root.t = t;
  if (typeof window !== "undefined" && window !== root) {
    window.BuzzI18n = api;
    window.t = t;
  }
})();
