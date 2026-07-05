(function () {
  "use strict";

  // 使用者自訂題：存在 localStorage，開機時併入 window.BUZZ_PROBLEMS。
  // app.js 的出題工作坊、分享與匯入都走這裡的 sanitize/encode/decode，
  // 確保能進題庫的題目永遠是同一個形狀（沒有後端，資料不離開瀏覽器）。
  // 檔名刻意不以 problem 開頭：node 端驗證器只載官方題包，不載這支。

  if (typeof window === "undefined" || typeof localStorage === "undefined") return;

  const STORAGE_KEY = "buzzcalculus.customProblems.v1";
  const CODE_PREFIX = "BZP1.";
  const TOPICS = ["limits", "derivatives", "integrals", "series"];
  const ANSWER_KINDS = ["numeric", "expression", "antiderivative", "text"];

  function clampInt(value, min, max, fallback) {
    const num = Math.round(Number(value));
    if (!Number.isFinite(num)) return fallback;
    return Math.max(min, Math.min(max, num));
  }

  function cleanText(value, maxLength) {
    return String(value == null ? "" : value).trim().slice(0, maxLength);
  }

  function randomId() {
    let raw = "";
    while (raw.length < 8) raw += Math.random().toString(36).slice(2);
    return `usr-${raw.slice(0, 8)}`;
  }

  // 回傳可直接進題庫的正規化題目；格式不合直接回 null（匯入時整題略過）。
  function sanitize(raw) {
    if (!raw || typeof raw !== "object") return null;
    const topic = TOPICS.includes(raw.topic) ? raw.topic : null;
    const answerKind = ANSWER_KINDS.includes(raw.answerKind) ? raw.answerKind : null;
    const prompt = cleanText(raw.prompt, 600);
    if (!topic || !answerKind || !prompt) return null;

    const problem = {
      id: /^usr-[a-z0-9-]{4,24}$/i.test(String(raw.id || "")) ? String(raw.id) : randomId(),
      topic,
      difficulty: clampInt(raw.difficulty, 1, 4, 2),
      prompt,
      answerKind,
      timeLimit: clampInt(raw.timeLimit, 10, 600, 60),
      tabLimit: clampInt(raw.tabLimit, 0, 9, 2),
      solution: cleanText(raw.solution, 1200) || "出題者沒有附解說。",
      tags: ["custom"],
      source: "自訂",
      custom: true
    };

    if (answerKind === "text") {
      const answers = (Array.isArray(raw.answers) ? raw.answers : String(raw.answer || "").split(/[,，]/))
        .map((item) => cleanText(item, 60))
        .filter(Boolean)
        .slice(0, 8);
      if (!answers.length) return null;
      problem.answers = answers;
      problem.canonical = answers[0];
    } else {
      const answer = cleanText(raw.answer, 160);
      if (!answer) return null;
      problem.answer = answer;
      if (answerKind !== "numeric") {
        problem.variable = /^[a-z]$/i.test(String(raw.variable || "")) ? String(raw.variable) : "x";
      }
    }
    return problem;
  }

  function load() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      const list = parsed && Array.isArray(parsed.problems) ? parsed.problems : [];
      return list.filter((item) => item && typeof item === "object");
    } catch (_error) {
      return [];
    }
  }

  function save(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, problems: list }));
  }

  // 題包代碼：BZP1. + base64url(UTF-8 JSON)。連結分享走 #pack=<代碼>。
  function encodePack(list) {
    const payload = JSON.stringify({ v: 1, problems: list });
    const bytes = new TextEncoder().encode(payload);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return CODE_PREFIX + btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function decodePack(raw) {
    const text = String(raw || "").trim();
    const hashIndex = text.indexOf("#pack=");
    const code = (hashIndex >= 0 ? text.slice(hashIndex + 6) : text).trim();
    if (!code.startsWith(CODE_PREFIX)) {
      return { problems: [], dropped: 0, error: "這不是 BuzzCalculus 題包（代碼要以 BZP1. 開頭）。" };
    }
    try {
      const base64 = code.slice(CODE_PREFIX.length).replace(/-/g, "+").replace(/_/g, "/");
      const binary = atob(base64);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      const payload = JSON.parse(new TextDecoder().decode(bytes));
      const rawList = Array.isArray(payload && payload.problems) ? payload.problems : [];
      const problems = rawList.map(sanitize).filter(Boolean);
      if (!problems.length) {
        return { problems: [], dropped: rawList.length, error: "代碼解得開，但裡面沒有格式合法的題目。" };
      }
      return { problems, dropped: rawList.length - problems.length, error: "" };
    } catch (_error) {
      return { problems: [], dropped: 0, error: "代碼解不開，可能沒有複製完整。" };
    }
  }

  const api = {
    STORAGE_KEY,
    sanitize,
    load,
    save,
    encodePack,
    decodePack,
    randomId,
    pendingImport: null
  };

  // 開機：把啟用中的自訂題併入官方題庫。calibration 已經跑完，
  // 這裡自己補 rank/tags，讓自訂題和官方題走同一套難度標籤。
  const pool = window.BUZZ_PROBLEMS || [];
  const knownIds = new Set(pool.map((problem) => problem.id));
  load().forEach((raw) => {
    if (raw.enabled === false) return;
    const problem = sanitize(raw);
    if (!problem || knownIds.has(problem.id)) return;
    if (window.BUZZ_DIFFICULTY) window.BUZZ_DIFFICULTY.applyCalibration(problem);
    knownIds.add(problem.id);
    pool.push(problem);
  });

  // 分享連結：解析 #pack=... 後立刻清掉 hash，避免重新整理重複觸發匯入。
  try {
    const match = /[#&]pack=([^&]+)/.exec(window.location.hash || "");
    if (match) {
      api.pendingImport = decodePack(decodeURIComponent(match[1]));
      if (window.history && typeof window.history.replaceState === "function") {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
  } catch (_error) {
    /* 連結壞掉就當作沒有帶題包 */
  }

  window.BUZZ_CUSTOM = api;
})();
