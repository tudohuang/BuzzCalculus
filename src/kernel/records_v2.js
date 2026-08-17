// Buzz Records v2 — 作答紀錄的分層儲存
//
// 問題：能力模型直接讀 records.history，而 history 上限只有 40 場（約 400-500 題）。
// 那對雷達夠用，對「30 天能力變化」「同難度趨勢」「成長曲線」完全不夠 ——
// 一個認真練的使用者兩週就把 history 洗掉了，等於每兩週失憶一次。
//
// 解法：分三層，各自負責不同的時間尺度。
//
//   history      完整 session + 每題明細（現況格式，app.js 擁有）
//                -> 結算頁、最近表現、明細檢視。上限維持 40 場。
//   attemptLog   極精簡逐題紀錄，tuple 不是物件
//                -> 能力模型、趨勢、百分位。上限 5000 筆。
//   sessions     session 級摘要
//                -> 熱力圖、成長曲線。上限 400 場，涵蓋一年以上。
//
// 設計規則：
//   1. 同一把 localStorage key、同一支 normalizeRecords，只加頂層命名空間。
//   2. 惰性遷移：舊使用者第一次載入時從 history 回填 attemptLog，
//      不需要遷移腳本，也不會看到空白的趨勢圖。
//   3. 純函數。不碰 DOM、不碰 localStorage、不吃 Date.now()。

(function () {
  "use strict";

  const SCHEMA = 2;

  // 5000 筆 tuple 約 250-300KB，在 localStorage 的 5MB 額度內很安全。
  // 以每天練 30 題計，這是半年份的逐題資料。
  const ATTEMPT_LIMIT = 5000;
  // 400 場摘要即使每天練兩場也涵蓋超過半年，熱力圖與成長曲線都夠。
  const SESSION_LIMIT = 400;

  /* ── flags 位元編碼 ───────────────────────────────────────────
     每筆作答只存 [problemId, 秒級時間戳, 對錯, 耗時秒, flags]。
     rank、timeLimit、topic、skill 都能從題庫查回來，不必重複存。 */
  const F_UNANSWERED = 1;   // bit 0：逾時未作答（這是「來不及」的唯一證據）
  const F_ASSISTED = 2;     // bit 1：看過完整解答
  const F_TIMED = 4;        // bit 2：這場有計時（Pressure Accuracy 的分流依據）
  const HINT_SHIFT = 3;     // bits 3-5：用了幾層提示（0-7）
  const CAUSE_SHIFT = 6;    // bits 6-8：錯因代碼（0-7）

  // 錯因用數字代碼而不是中文字串：中文文案會改，代碼不能改。
  const CAUSES = ["", "algebra-slip", "wrong-technique", "forgot-formula", "timeout", "misread"];
  const CAUSE_BY_LEGACY_TAG = {
    "粗心": 1,
    "不會": 2,
    "忘公式": 3
  };

  function encodeFlags(answer, timed) {
    let flags = 0;
    if (answer.unanswered) flags |= F_UNANSWERED;
    if (answer.assisted) flags |= F_ASSISTED;
    if (timed) flags |= F_TIMED;

    const hints = Math.max(0, Math.min(7, Math.round(Number(answer.hintsUsed) || 0)));
    flags |= hints << HINT_SHIFT;

    let cause = 0;
    if (answer.unanswered) cause = 4; // timeout 是系統判定，不需要使用者標
    else if (answer.errorCause) cause = Math.max(0, CAUSES.indexOf(answer.errorCause));
    else if (answer.errorTag) cause = CAUSE_BY_LEGACY_TAG[answer.errorTag] || 0;
    flags |= (cause & 7) << CAUSE_SHIFT;

    return flags;
  }

  function decodeFlags(flags) {
    const value = Number(flags) || 0;
    return {
      unanswered: Boolean(value & F_UNANSWERED),
      assisted: Boolean(value & F_ASSISTED),
      timed: Boolean(value & F_TIMED),
      hints: (value >> HINT_SHIFT) & 7,
      cause: CAUSES[(value >> CAUSE_SHIFT) & 7] || ""
    };
  }

  /* ── 限時判定 ─────────────────────────────────────────────────
     以 src/app.js 的 MODES 為準：只有 practice flag（practice / cooldown）
     與 noTimer（accuracy）真的沒有計時器。mistakes 與 warmup 是有計時的。 */
  const UNTIMED_MODES = new Set(["practice", "cooldown", "accuracy"]);

  function isTimedSession(session) {
    if (!session) return true;
    return !session.practice && !UNTIMED_MODES.has(session.mode);
  }

  /* ── tuple 轉換 ───────────────────────────────────────────── */

  // 時間存秒不存毫秒：少 3 個字元 × 5000 筆，而且對 30 天的時間常數來說
  // 秒級精度綽綽有餘。
  function toTuple(problemId, atMs, correct, elapsedSec, flags) {
    return [String(problemId), Math.round(atMs / 1000), correct ? 1 : 0, Math.round(elapsedSec) || 0, flags];
  }

  function fromTuple(tuple) {
    if (!Array.isArray(tuple) || tuple.length < 5) return null;
    const flags = decodeFlags(tuple[4]);
    return {
      problemId: String(tuple[0]),
      at: Number(tuple[1]) * 1000,
      correct: Boolean(tuple[2]),
      elapsed: Number(tuple[3]) || 0,
      unanswered: flags.unanswered,
      assisted: flags.assisted,
      timed: flags.timed,
      hints: flags.hints,
      cause: flags.cause
    };
  }

  function sessionSummary(session, atMs, n, correct, sumSec) {
    return {
      id: String(session.id || ""),
      at: Math.round(atMs / 1000),
      mode: String(session.mode || ""),
      timed: isTimedSession(session) ? 1 : 0,
      n,
      ok: correct,
      sec: Math.round(sumSec),
      score: Number(session.score) || 0
    };
  }

  /* ── 從一場 session 抽出 tuple ────────────────────────────── */

  function tuplesFromSession(session) {
    if (!session || typeof session !== "object") return null;
    const at = Date.parse(session.finishedAt || "");
    if (!Number.isFinite(at)) return null;
    const answers = Array.isArray(session.answers) ? session.answers : [];
    if (!answers.length) return null;

    const timed = isTimedSession(session);
    const tuples = [];
    let correct = 0;
    let sumSec = 0;

    answers.forEach((answer) => {
      if (!answer || typeof answer !== "object") return;
      const id = answer.problemId || (answer.problem && answer.problem.id);
      if (!id) return;
      const elapsed = Number(answer.elapsed) || 0;
      if (answer.correct) correct += 1;
      sumSec += elapsed;
      tuples.push(toTuple(id, at, answer.correct, elapsed, encodeFlags(answer, timed)));
    });

    if (!tuples.length) return null;
    return { at, tuples, summary: sessionSummary(session, at, tuples.length, correct, sumSec) };
  }

  /* ── 正規化與惰性遷移 ─────────────────────────────────────────
     舊使用者第一次載入新版時，從既有的 history 回填 attemptLog。
     這是 v2 最重要的體驗細節：不回填的話，老使用者打開新版會看到
     一張空白的趨勢圖，那看起來像資料不見了。 */

  function normalize(records) {
    const next = records && typeof records === "object" ? records : {};
    const schema = Number(next.schema) || 1;

    if (!Array.isArray(next.attemptLog)) next.attemptLog = [];
    if (!Array.isArray(next.sessions)) next.sessions = [];

    if (schema < SCHEMA) {
      const derived = deriveFromHistory(next.history);
      // 回填只在第一次遷移做。之後每場結束時 appendSession 增量寫入，
      // 不需要（也不應該）每次載入都重掃 history。
      if (derived.attempts.length) {
        next.attemptLog = derived.attempts;
        next.sessions = derived.sessions;
      }
      next.schema = SCHEMA;
    }

    compact(next);
    return next;
  }

  function deriveFromHistory(history) {
    const list = Array.isArray(history) ? history : [];
    const rows = [];
    const sessions = [];

    list.forEach((session) => {
      const extracted = tuplesFromSession(session);
      if (!extracted) return;
      rows.push(...extracted.tuples);
      sessions.push(extracted.summary);
    });

    rows.sort((a, b) => a[1] - b[1]);
    sessions.sort((a, b) => a.at - b.at);
    return { attempts: rows, sessions };
  }

  /* ── 增量寫入 ─────────────────────────────────────────────────
     app.js 存完一場之後呼叫。用 session id 去重，
     避免遷移當下正在存的那一場被算兩次。 */

  function appendSession(records, session) {
    const target = records && typeof records === "object" ? records : {};
    if (!Array.isArray(target.attemptLog)) target.attemptLog = [];
    if (!Array.isArray(target.sessions)) target.sessions = [];

    const extracted = tuplesFromSession(session);
    if (!extracted) return target;

    const id = extracted.summary.id;
    if (id && target.sessions.some((entry) => entry && entry.id === id)) return target;

    target.attemptLog.push(...extracted.tuples);
    target.sessions.push(extracted.summary);
    compact(target);
    return target;
  }

  /* ── 修剪 ─────────────────────────────────────────────────────
     超過上限時丟最舊的。spec 原本設計「更早的資料降採樣成每技巧每週彙總」，
     實作時改成不做，理由寫在 docs/spec/02-data-model.md：
     長期成長曲線由 sessions 摘要（400 場、涵蓋一年以上）就能畫出來，
     再多一層 skill 級 rollup 會讓能力模型要同時吃兩種資料形狀，
     複雜度換來的價值在超過 5000 筆之前都是零。 */

  function compact(records) {
    if (records.attemptLog.length > ATTEMPT_LIMIT) {
      records.attemptLog = records.attemptLog.slice(-ATTEMPT_LIMIT);
    }
    if (records.sessions.length > SESSION_LIMIT) {
      records.sessions = records.sessions.slice(-SESSION_LIMIT);
    }
    return records;
  }

  /* ── 讀取 ─────────────────────────────────────────────────── */

  function attempts(records) {
    const rows = records && Array.isArray(records.attemptLog) ? records.attemptLog : [];
    const out = [];
    rows.forEach((tuple) => {
      const decoded = fromTuple(tuple);
      if (decoded && Number.isFinite(decoded.at)) out.push(decoded);
    });
    return out;
  }

  function sessions(records) {
    const rows = records && Array.isArray(records.sessions) ? records.sessions : [];
    return rows.filter((entry) => entry && Number.isFinite(Number(entry.at)))
      .map((entry) => ({
        id: entry.id || "",
        at: Number(entry.at) * 1000,
        mode: entry.mode || "",
        timed: Boolean(entry.timed),
        n: Number(entry.n) || 0,
        correct: Number(entry.ok) || 0,
        elapsed: Number(entry.sec) || 0,
        score: Number(entry.score) || 0
      }));
  }

  function stats(records) {
    const log = (records && records.attemptLog) || [];
    const list = (records && records.sessions) || [];
    return {
      schema: Number(records && records.schema) || 1,
      attempts: log.length,
      sessions: list.length,
      oldestAt: log.length ? Number(log[0][1]) * 1000 : null,
      newestAt: log.length ? Number(log[log.length - 1][1]) * 1000 : null,
      approxBytes: JSON.stringify(log).length + JSON.stringify(list).length
    };
  }

  /* ── 合併 ─────────────────────────────────────────────────────
     兩份紀錄要合成一份。這是整個 kernel 裡最危險的函數：
     寫錯的後果是「我幾個月的練習不見了」，而那種使用者不會回來。

     現行的雲端同步 scaffold 用「整份 updatedAt 最新者獲勝」，那對訓練紀錄
     是災難：手機練了 10 題、電腦練了 5 題，同步後其中一邊整份消失。
     訓練紀錄是**只增不減**的資料，正確做法是逐欄位合併。

     這支函數刻意**先用在匯入功能上**（spec 06.2 階段 A）：
     等接雲端同步時，它已經被真實使用者驗證過幾個月了。

     不變式（由 tools/validate_records_v2.js 鎖住）：
       merge(a, b) 與 merge(b, a) 結果相同（交換律）
       merge(a, a) === a（冪等）
       合併後的作答總數 >= max(兩邊)（不丟資料） */

  // 只增不減的物件（收藏、成就、解鎖）：兩邊聯集
  function mergeUnion(a, b) {
    return Object.assign({}, a || {}, b || {});
  }

  // 分數型的物件（每日、每週、具名考卷）：同一 key 取分數高的
  function mergeByScore(a, b, field) {
    const out = Object.assign({}, a || {});
    Object.keys(b || {}).forEach((key) => {
      const mine = out[key];
      const theirs = b[key];
      if (!mine) { out[key] = theirs; return; }
      const mineScore = Number((mine && mine[field]) || 0);
      const theirsScore = Number((theirs && theirs[field]) || 0);
      out[key] = theirsScore > mineScore ? theirs : mine;
    });
    return out;
  }

  // 錯題：錯得多的次數勝、最近錯的時間勝、SRS 到期日取**較早**者。
  // 到期日取早的是刻意的保守選擇 —— 寧可多複習一次，也不要漏掉一題。
  function mergeMistakes(a, b) {
    const out = Object.assign({}, a || {});
    Object.keys(b || {}).forEach((id) => {
      const mine = out[id];
      const theirs = b[id];
      if (!mine) { out[id] = theirs; return; }
      const mineAt = Date.parse(mine.lastWrongAt || "") || 0;
      const theirsAt = Date.parse(theirs.lastWrongAt || "") || 0;
      const base = theirsAt > mineAt ? theirs : mine;
      const mineDue = mine.srs && Number.isFinite(Number(mine.srs.dueAt)) ? Number(mine.srs.dueAt) : 0;
      const theirsDue = theirs.srs && Number.isFinite(Number(theirs.srs.dueAt)) ? Number(theirs.srs.dueAt) : 0;
      out[id] = Object.assign({}, base, {
        wrongCount: Math.max(Number(mine.wrongCount || 0), Number(theirs.wrongCount || 0)),
        srs: { interval: Math.min(
                 mine.srs ? Number(mine.srs.interval || 0) : 0,
                 theirs.srs ? Number(theirs.srs.interval || 0) : 0
               ),
               dueAt: Math.min(mineDue || theirsDue, theirsDue || mineDue) }
      });
    });
    return out;
  }

  // 證明自評：看懂 > 部分會 > 還不會，取比較進階的那個
  const PROOF_ORDER = { understood: 3, partial: 2, unknown: 1 };
  function mergeProofs(a, b) {
    const out = Object.assign({}, a || {});
    Object.keys(b || {}).forEach((id) => {
      const mine = out[id];
      const theirs = b[id];
      if (!mine) { out[id] = theirs; return; }
      const rank = (v) => PROOF_ORDER[(v && v.status) || v] || 0;
      out[id] = rank(theirs) > rank(mine) ? theirs : mine;
    });
    return out;
  }

  function mergeTuples(a, b) {
    const seen = new Set();
    const rows = [];
    [...(a || []), ...(b || [])].forEach((row) => {
      if (!Array.isArray(row) || row.length < 5) return;
      const key = row[0] + "@" + row[1];
      if (seen.has(key)) return;
      seen.add(key);
      rows.push(row);
    });
    rows.sort((x, y) => x[1] - y[1]);
    return rows;
  }

  function mergeById(a, b, idKey, timeKey) {
    const seen = new Set();
    const rows = [];
    [...(a || []), ...(b || [])].forEach((row) => {
      if (!row || typeof row !== "object") return;
      const id = String(row[idKey] || "");
      if (id && seen.has(id)) return;
      if (id) seen.add(id);
      rows.push(row);
    });
    rows.sort((x, y) => {
      const xa = typeof x[timeKey] === "number" ? x[timeKey] : Date.parse(x[timeKey] || "") || 0;
      const ya = typeof y[timeKey] === "number" ? y[timeKey] : Date.parse(y[timeKey] || "") || 0;
      return xa - ya;
    });
    return rows;
  }

  // 計數器不能直接相加（會重複計），也不該取 max（會漏掉另一邊的練習）。
  // 正確做法是從合併後的 attemptLog / sessions 重算。
  function recount(target, problemTopics) {
    const attempts = target.attemptLog || [];
    if (!attempts.length) return;

    let answered = 0;
    let correct = 0;
    const problemStats = {};
    const topicStats = {};

    attempts.forEach((row) => {
      const decoded = fromTuple(row);
      if (!decoded) return;
      answered += 1;
      if (decoded.correct) correct += 1;

      const ps = problemStats[decoded.problemId] || { correct: 0, wrong: 0, total: 0 };
      ps.total += 1;
      ps[decoded.correct ? "correct" : "wrong"] += 1;
      problemStats[decoded.problemId] = ps;

      const topic = problemTopics ? problemTopics[decoded.problemId] : null;
      if (topic) {
        const ts = topicStats[topic] || { correct: 0, wrong: 0, total: 0 };
        ts.total += 1;
        ts[decoded.correct ? "correct" : "wrong"] += 1;
        topicStats[topic] = ts;
      }
    });

    target.totalAnswered = answered;
    target.totalCorrect = correct;
    target.problemStats = problemStats;
    // 沒有題庫對照表時保留原本的 topicStats —— 寧可用舊的，也不要清空
    if (problemTopics) target.topicStats = topicStats;

    const sessions = target.sessions || [];
    if (sessions.length) {
      target.attempts = sessions.filter((s) => s && s.timed).length;
      target.practiceRuns = sessions.filter((s) => s && !s.timed).length;
    }
  }

  // 使用者偏好用 LWW（最後設定的算數），資料用合併。
  // 分不清楚的時候問一句：「兩台裝置都做過這件事，該留哪一個？」
  // 偏好 → 留最後設定的；紀錄 → 兩邊都要留。
  // 兩份紀錄先排成固定順序，之後所有合併都照這個順序做。
  // 不這樣的話 merge(a,b) 和 merge(b,a) 會在「兩邊都有同一個 key」時給出不同結果 ——
  // 那對同步是災難：兩台裝置各自合併會得到兩份不一樣的資料，然後永遠收斂不了。
  function canonicalOrder(x, y) {
    const xa = Date.parse(x.updatedAt || "") || 0;
    const ya = Date.parse(y.updatedAt || "") || 0;
    if (xa !== ya) return xa < ya ? [x, y] : [y, x];
    // 時間戳相同時仍要有確定的順序，否則交換律還是會破。
    const xk = (x.attemptLog || []).length;
    const yk = (y.attemptLog || []).length;
    if (xk !== yk) return xk < yk ? [x, y] : [y, x];
    return JSON.stringify(x) <= JSON.stringify(y) ? [x, y] : [y, x];
  }

  function merge(a, b, options) {
    const opts = options || {};
    const [older, newer] = canonicalOrder(
      a && typeof a === "object" ? a : {},
      b && typeof b === "object" ? b : {}
    );
    // 之後一律用 older / newer，不再用 a / b —— 這是交換律的來源
    const left = older;
    const right = newer;

    const out = {};

    // 偏好類：新的覆蓋舊的，但舊的有、新的沒有時仍然保留
    ["settings", "plan", "placement", "onboardingLevel", "onboardingSeen", "planReportSeen", "schema"].forEach((key) => {
      out[key] = newer[key] !== undefined && newer[key] !== null ? newer[key] : older[key];
    });
    out.updatedAt = newer.updatedAt || older.updatedAt || "";
    out.lastPlayed =
      (Date.parse(left.lastPlayed || "") || 0) > (Date.parse(right.lastPlayed || "") || 0)
        ? left.lastPlayed
        : right.lastPlayed;

    // 最佳成績：取高的
    out.bestScore = Math.max(Number(left.bestScore || 0), Number(right.bestScore || 0));
    out.bestStreak = Math.max(Number(left.bestStreak || 0), Number(right.bestStreak || 0));

    // 只增不減
    out.favorites = mergeUnion(left.favorites, right.favorites);
    out.achievements = mergeUnion(left.achievements, right.achievements);
    out.pathUnlocks = mergeUnion(left.pathUnlocks, right.pathUnlocks);
    out.pathGateAttempts = mergeUnion(left.pathGateAttempts, right.pathGateAttempts);
    out.pathLessonRuns = mergeUnion(left.pathLessonRuns, right.pathLessonRuns);
    out.problemReports = mergeUnion(left.problemReports, right.problemReports);
    out.streakShields = mergeUnion(left.streakShields, right.streakShields);
    out.conf = mergeUnion(left.conf, right.conf);

    // 分數高者勝
    out.daily = mergeByScore(left.daily, right.daily, "score");
    out.dailyOne = mergeByScore(left.dailyOne, right.dailyOne, "correct");
    out.weeklyChallenge = mergeByScore(left.weeklyChallenge, right.weeklyChallenge, "score");
    out.namedExams = mergeByScore(left.namedExams, right.namedExams, "score");

    out.mistakes = mergeMistakes(left.mistakes, right.mistakes);
    out.proofs = mergeProofs(left.proofs, right.proofs);

    // 序列：聯集後排序截斷
    out.history = mergeById(left.history, right.history, "id", "finishedAt").slice(-60);
    out.attemptLog = mergeTuples(left.attemptLog, right.attemptLog);
    out.sessions = mergeById(left.sessions, right.sessions, "id", "at");
    out.planHistory = mergeById(left.planHistory, right.planHistory, "examAt", "endedAt");

    // 計數器從合併後的資料重算
    out.topicStats = mergeUnion(left.topicStats, right.topicStats);
    recount(out, opts.problemTopics || null);

    // cache 是純推導結果，合併時直接丟掉重算
    delete out.cache;

    compact(out);
    return normalize(out);
  }

  const api = {
    version: 2,
    SCHEMA,
    merge,
    ATTEMPT_LIMIT,
    SESSION_LIMIT,
    CAUSES,
    normalize,
    appendSession,
    deriveFromHistory,
    compact,
    attempts,
    sessions,
    stats,
    encodeFlags,
    decodeFlags,
    isTimedSession
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.BuzzRecords = api;
})();
