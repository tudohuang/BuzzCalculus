// Buzz Ability — 能力模型
//
// 從作答紀錄推導出「這個人每個技巧有多熟」。這是整個產品的差異化核心：
// 別人給正確率，這裡要給「你是不會、還是來不及、還是壓力下垮掉」。
//
// 設計規則：
//   1. 純函數。輸入 (records, problems, now) 輸出資料，不碰 DOM / localStorage。
//      now 是參數而不是 Date.now()，所以能力曲線可以「回放」到任何一天 ——
//      成長曲線因此不需要每天寫快照，使用者中斷使用也不會斷線。
//   2. 完全從既有的 records.history 推導，不需要任何新欄位。
//      舊使用者第一次打開新版就有完整能力圖，migration 風險為零。
//   3. 樣本不足時回傳 null，不回傳猜測值。寧可留白也不要給錯的能力數字。
//
// 這個檔不決定「要練什麼」（那是 planner），也不畫任何東西（那是 app.js）。

(function () {
  "use strict";

  /* ── 參數 ────────────────────────────────────────────────────
     每個常數都要能解釋為什麼，否則就會變成沒人敢動的魔術數字。 */

  const DAY_MS = 86400000;

  const TIME_CONSTANT_DAYS = 30;  // 作答權重的時間常數：30 天前的一題約值今天的 0.37 題
  const PRIOR_STRENGTH = 6;       // 先驗強度，等價於 6 次「不確定」的作答
  const PRIOR_ACCURACY = 0.45;    // 未知技巧的預設正確率，偏低 —— 沒證據就不給高分
  const MIN_CONFIDENCE_W = 12;    // 加權作答量到這裡才算「測準了」
  const MIN_SHOW_CONF = 0.4;      // conf 低於此值一律顯示「未測」而不是分數

  // PA / UA 分流的最低樣本。用原始題數而不是加權量，因為這個數字要能
  // 直接講給使用者聽：「你在這個技巧只做了 5 題，還看不出來」。
  const MIN_SPLIT_N = 8;

  const ASSISTED_CREDIT = 0.5;    // 看過完整解答才對，只給半分
  const HINT_PENALTY = 0.15;      // 每用一層提示扣的比例
  const HINT_FLOOR = 0.55;        // 提示扣分的下限

  const FAST_RATIO = 0.6;         // elapsed / timeLimit 低於此值算「快」
  const SOLID_ACCURACY = 0.7;     // 正確率高於此值算「準」

  const GAP_PRESSURE = 0.15;      // UA - PA 超過此值判定為「壓力下垮掉」
  const BIAS_OVERCONFIDENT = 0.2; // 信心校準偏差，正的代表過度自信

  // 精熟度分級。門檻要能對應到明確的訓練動作，不然分級只是裝飾。
  const STATES = [
    { max: 39, state: "weak", label: "還沒建立" },
    { max: 64, state: "shaky", label: "會但不穩" },
    { max: 84, state: "solid", label: "穩了" },
    { max: 100, state: "reflex", label: "反射" }
  ];

  // 不限時的模式。以 src/app.js 的 MODES 為準：只有 practice flag
  // （practice / cooldown）與 noTimer（accuracy）真的沒有計時器。
  // mistakes 與 warmup 是有計時的，別被名字騙了。
  const UNTIMED_MODES = new Set(["practice", "cooldown", "accuracy"]);

  // 既有 8 軸雷達的軸名。app.js 可以用 opts.radarAxes 傳自己的定義進來，
  // 這裡的預設只是為了讓 kernel 單獨在 node 裡也跑得動。
  const DEFAULT_AXES = [
    { key: "taylor", label: "Taylor" },
    { key: "substitution", label: "換元" },
    { key: "ibp", label: "分部" },
    { key: "partial_fraction", label: "部分分式" },
    { key: "improper", label: "瑕積分" },
    { key: "series", label: "級數" },
    { key: "multivariable", label: "多變數" },
    { key: "special", label: "特殊函數" }
  ];

  // 既有的 ERROR_TAGS 是中文，能力模型要用穩定的 key。
  const LEGACY_CAUSE = {
    "粗心": "algebra-slip",
    "不會": "wrong-technique",
    "忘公式": "forgot-formula"
  };

  // 信心自評到主觀機率。三個選項刻意不對稱：「確定」給 0.9 而不是 1.0，
  // 因為沒有人真的 100% 確定，給 1.0 會讓 Brier 分數被單次失誤炸掉。
  const CONFIDENCE_P = { guess: 0.25, unsure: 0.6, sure: 0.9 };

  /* ── 小工具 ─────────────────────────────────────────────────── */

  function median(values) {
    if (!values.length) return null;
    const sorted = values.slice().sort((a, b) => a - b);
    const mid = sorted.length >> 1;
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  function clamp(value, low, high) {
    return Math.max(low, Math.min(high, value));
  }

  function stateOf(mastery) {
    return STATES.find((entry) => mastery <= entry.max) || STATES[STATES.length - 1];
  }

  function resolveGraph(opts) {
    return (
      (opts && opts.graph) ||
      (typeof window !== "undefined" && window.BuzzSkillGraph) ||
      (typeof globalThis !== "undefined" && globalThis.BuzzSkillGraph) ||
      null
    );
  }

  function resolveProblems(opts) {
    return (
      (opts && opts.problems) ||
      (typeof window !== "undefined" && window.BUZZ_PROBLEMS) ||
      (typeof globalThis !== "undefined" && globalThis.BUZZ_PROBLEMS) ||
      []
    );
  }

  /* ── 1. 把 history 攤平成逐題作答 ────────────────────────────
     records.history 是「一場一場」的，能力模型要的是「一題一題」。
     每一題的時間戳用該場的 finishedAt —— 逐題時間沒有被記錄，
     以 30 天為時間常數來說，場內的時間差可以忽略。 */

  // 把一筆逐題紀錄補上題庫資訊（rank / timeLimit / skills）。
  // rank 與 timeLimit 不存在紀錄裡，因為題目校準之後它們會變 ——
  // 每次都從現在的題庫查回來才是對的。
  function decorate(raw, byId, graph) {
    const problem = byId.get(raw.problemId);
    if (!problem) return null; // 題目已下架（quarantine）就不算進能力
    const skills = graph ? graph.skillsForProblem(problem) : [];
    if (!skills.length) return null;
    return {
      at: raw.at,
      problemId: problem.id,
      skills,
      rank: clamp(Number(problem.rank || problem.difficulty || 1), 1, 6),
      topic: problem.topic,
      correct: Boolean(raw.correct),
      unanswered: Boolean(raw.unanswered),
      assisted: Boolean(raw.assisted),
      hints: Number(raw.hints || 0),
      elapsed: Number(raw.elapsed || 0),
      timeLimit: Number(problem.timeLimit || 0),
      timed: Boolean(raw.timed),
      mode: raw.mode || "",
      cause: raw.cause || ""
    };
  }

  function extractAttempts(records, problems, graph) {
    const byId = new Map(problems.map((problem) => [problem.id, problem]));

    // attemptLog（records v2）是首選來源：它保留了 5000 筆逐題紀錄，
    // 而 history 只有最近 40 場。沒有 attemptLog 時退回 history，
    // 所以還沒遷移的資料一樣算得出能力。
    const log = Array.isArray(records.attemptLog) ? records.attemptLog : null;
    if (log && log.length) {
      const decoder =
        (typeof window !== "undefined" && window.BuzzRecords) ||
        (typeof globalThis !== "undefined" && globalThis.BuzzRecords) ||
        null;
      if (decoder) {
        const out = [];
        decoder.attempts(records).forEach((raw) => {
          const attempt = decorate(raw, byId, graph);
          if (attempt) out.push(attempt);
        });
        return tagScience(out, graph);
      }
    }

    return tagScience(fromHistory(records, byId, graph), graph);
  }

  function fromHistory(records, byId, graph) {
    const attempts = [];
    const history = Array.isArray(records.history) ? records.history : [];
    history.forEach((session) => {
      // 匯入的 JSON、跨版本的舊資料都可能有破洞，能力模型不能因此整個掛掉
      if (!session || typeof session !== "object") return;
      const at = Date.parse(session.finishedAt || "");
      if (!Number.isFinite(at)) return;
      const untimed = Boolean(session.practice) || UNTIMED_MODES.has(session.mode);

      const answers = Array.isArray(session.answers) ? session.answers : [];
      answers.forEach((answer) => {
        if (!answer || typeof answer !== "object") return;
        const attempt = decorate(
          {
            at,
            problemId: answer.problemId,
            correct: answer.correct,
            unanswered: answer.unanswered,
            assisted: answer.assisted,
            hints: answer.hintsUsed,
            elapsed: answer.elapsed,
            timed: !untimed,
            mode: session.mode,
            cause: LEGACY_CAUSE[answer.errorTag] || ""
          },
          byId,
          graph
        );
        if (attempt) attempts.push(attempt);
      });
    });

    return attempts;
  }

  // 理科題不進微積分的總分與雷達（沿用站上的科目閘門精神）。
  function tagScience(attempts, graph) {
    attempts.forEach((attempt) => {
      attempt.science =
        Boolean(graph) &&
        attempt.skills.length > 0 &&
        attempt.skills.every((id) => (graph.byId(id) || {}).subject === "science");
    });
    return attempts;
  }

  /* ── 2. 單次作答的權重與得分 ─────────────────────────────────
     權重 = 時間衰減 × 難度。難題答對本來就該比簡單題答對值錢，
     否則刷 R1 就能把精熟度養到滿。 */

  function weightOf(attempt, now) {
    const ageDays = Math.max(0, (now - attempt.at) / DAY_MS);
    const timeWeight = Math.exp(-ageDays / TIME_CONSTANT_DAYS);
    const rankWeight = 0.6 + 0.2 * attempt.rank;
    return timeWeight * rankWeight;
  }

  function scoreOf(attempt, weight) {
    if (!attempt.correct) return 0;
    if (attempt.assisted) return ASSISTED_CREDIT * weight;
    if (attempt.hints > 0) return Math.max(HINT_FLOOR, 1 - HINT_PENALTY * attempt.hints) * weight;
    return weight;
  }

  /* ── 3. 精熟度 ──────────────────────────────────────────────
     帶 Beta 先驗，所以「答 3 題全對」不會拿到 100 分。
     衰退用半衰期，且精熟度越高衰退越慢 —— 真的練到反射的技巧不會一週就忘光。 */

  function masteryFrom(sumWeight, sumScore, lastAt, now) {
    if (!sumWeight) return { mastery: null, accuracy: null, confidence: 0, halfLife: null };

    const accuracy = (sumScore + PRIOR_STRENGTH * PRIOR_ACCURACY) / (sumWeight + PRIOR_STRENGTH);
    const idleDays = Math.max(0, (now - lastAt) / DAY_MS);
    const halfLife = 10 + 0.25 * (100 * accuracy);
    const decay = Math.pow(0.5, idleDays / halfLife);
    const mastery = Math.round(clamp(100 * accuracy * decay, 0, 100));

    return {
      mastery,
      accuracy,
      confidence: Math.min(1, sumWeight / MIN_CONFIDENCE_W),
      halfLife
    };
  }

  // 加權正確率，給 PA / UA 用。這裡刻意不套先驗 —— PA 與 UA 是拿來
  // 「互相比較」的，兩邊都被先驗拉向 0.45 反而會把差距壓平。
  function rawAccuracy(bucket) {
    return bucket.weight ? bucket.score / bucket.weight : null;
  }

  function emptyBucket() {
    return { weight: 0, score: 0, n: 0, correct: 0 };
  }

  function addTo(bucket, attempt, weight, score) {
    bucket.weight += weight;
    bucket.score += score;
    bucket.n += 1;
    if (attempt.correct) bucket.correct += 1;
  }

  /* ── 4. 逐技巧統計 ──────────────────────────────────────────── */

  function computeSkills(attempts, now, graph) {
    const stats = new Map();

    attempts.forEach((attempt) => {
      if (attempt.at > now) return; // 回放到過去時，未來的作答不算
      const weight = weightOf(attempt, now);
      const score = scoreOf(attempt, weight);

      attempt.skills.forEach((skillId) => {
        if (!stats.has(skillId)) {
          stats.set(skillId, {
            id: skillId,
            all: emptyBucket(),
            timed: emptyBucket(),
            untimed: emptyBucket(),
            lastAt: 0,
            ratios: [],
            timedN: 0,
            timeouts: 0,
            wrongs: 0,
            causes: {},
            conf: { n: 0, sumP: 0, sumO: 0, brier: 0 }
          });
        }
        const stat = stats.get(skillId);
        addTo(stat.all, attempt, weight, score);
        addTo(attempt.timed ? stat.timed : stat.untimed, attempt, weight, score);
        if (attempt.at > stat.lastAt) stat.lastAt = attempt.at;

        if (attempt.timed) {
          stat.timedN += 1;
          if (attempt.unanswered) stat.timeouts += 1;
          else if (!attempt.correct) stat.wrongs += 1;
          // 只有真的作答且題目有時限，相對耗時才有意義
          if (!attempt.unanswered && attempt.timeLimit > 0 && attempt.elapsed > 0) {
            stat.ratios.push(attempt.elapsed / attempt.timeLimit);
          }
        }

        if (!attempt.correct) {
          const cause = attempt.unanswered ? "timeout" : attempt.cause || "";
          if (cause) stat.causes[cause] = (stat.causes[cause] || 0) + 1;
        }
      });
    });

    return stats;
  }

  /* ── 5. 象限判定 ────────────────────────────────────────────
     這是「不會 vs 來不及」的視覺化：橫軸速度、縱軸限時正確率。 */

  function quadrantOf(speed, pressureAccuracy) {
    if (speed === null || pressureAccuracy === null) return null;
    const fast = speed < FAST_RATIO;
    const accurate = pressureAccuracy >= SOLID_ACCURACY;
    if (fast && accurate) return { key: "reflex", label: "反射區", advice: "拉高難度或進 Boss" };
    if (!fast && accurate) return { key: "slow", label: "會但慢", advice: "同技巧限時訓練，時限逐次收緊" };
    if (fast && !accurate) return { key: "rushed", label: "衝太快", advice: "練習模式 + 標註錯因" };
    return { key: "unbuilt", label: "還沒建立", advice: "看關鍵一句 + 三層提示 + 慢練" };
  }

  /* ── 6. 診斷：這個技巧到底怎麼了 ────────────────────────────
     數字本身不是產品，這一段才是。 */

  function diagnose(entry) {
    const { pressureAccuracy: pa, untimedAccuracy: ua, gap, timeoutRate, wrongRate } = entry;

    if (gap !== null && gap >= GAP_PRESSURE && ua !== null && ua >= 0.7) {
      return { key: "pressure", text: "你會做，是壓力下垮掉", advice: "同技巧限時重練，時限設在你自己的中位數 ×1.2" };
    }
    if (pa !== null && ua !== null && Math.abs(gap) < 0.1 && pa < 0.5 && ua < 0.5) {
      return { key: "unknown", text: "這個技巧還沒建立", advice: "先看關鍵一句 + 慢練 5 題不限時" };
    }
    if (timeoutRate !== null && timeoutRate > 0.3) {
      return { key: "timeout", text: "不是不會，是來不及", advice: "練熟不練新，同一批題重複到反射" };
    }
    if (wrongRate !== null && timeoutRate !== null && wrongRate > timeoutRate * 2 && wrongRate > 0.3) {
      return { key: "wrong", text: "時間夠但做錯，是方法問題", advice: "補技巧本身，先別加速" };
    }
    if (pa !== null && pa >= 0.8 && (ua === null || ua >= 0.8)) {
      return { key: "reflex", text: "這題型你已經反射", advice: "提高難度或拉長複習間隔" };
    }
    return null;
  }

  /* ── 7. 組裝一個技巧的完整資料 ──────────────────────────────── */

  function buildSkillEntry(stat, now, graph) {
    const node = graph ? graph.byId(stat.id) : null;
    const core = masteryFrom(stat.all.weight, stat.all.score, stat.lastAt, now);

    const pa = stat.timed.n >= MIN_SPLIT_N ? rawAccuracy(stat.timed) : null;
    const ua = stat.untimed.n >= MIN_SPLIT_N ? rawAccuracy(stat.untimed) : null;
    const gap = pa !== null && ua !== null ? ua - pa : null;
    const speed = median(stat.ratios);

    const entry = {
      id: stat.id,
      label: node ? node.label : stat.id,
      family: node ? node.family : "",
      tier: node ? node.tier : null,
      subject: node && node.subject ? node.subject : "calculus",
      prereq: node ? node.prereq.slice() : [],

      mastery: core.mastery,
      accuracy: core.accuracy,
      confidence: core.confidence,
      measured: core.confidence >= MIN_SHOW_CONF,
      // 「從沒測過」和「練過但太久沒碰、資料已經不算數」是兩件事。
      // 對一個練了幾百題的人顯示「未測」看起來像資料不見了 ——
      // UI 要能講「太久沒練，先重測」而不是「未測」。
      stale: stat.all.n > 0 && core.confidence < MIN_SHOW_CONF,
      state: core.mastery === null ? null : stateOf(core.mastery).state,
      stateLabel: core.mastery === null ? null : stateOf(core.mastery).label,
      halfLife: core.halfLife,

      n: stat.all.n,
      weight: stat.all.weight,
      lastAt: stat.lastAt || null,

      pressureAccuracy: pa,
      untimedAccuracy: ua,
      gap,
      timedN: stat.timed.n,
      untimedN: stat.untimed.n,

      speed,
      timeoutRate: stat.timedN ? stat.timeouts / stat.timedN : null,
      wrongRate: stat.timedN ? stat.wrongs / stat.timedN : null,
      causes: stat.causes,

      brier: stat.conf.n ? stat.conf.brier / stat.conf.n : null,
      bias: stat.conf.n ? stat.conf.sumP / stat.conf.n - stat.conf.sumO / stat.conf.n : null,
      confN: stat.conf.n
    };

    entry.quadrant = quadrantOf(speed, pa);
    entry.diagnosis = diagnose(entry);
    // 下次該複習的時間：精熟度掉到 65（solid 門檻）的那一天
    entry.dueAt =
      core.mastery === null || core.mastery <= 65 || !core.halfLife
        ? stat.lastAt || null
        : stat.lastAt + core.halfLife * Math.log2(core.mastery / 65) * DAY_MS;

    return entry;
  }

  /* ── 8. 信心校準 ────────────────────────────────────────────
     records.conf 目前還沒有 UI 在寫（見 spec 03.6），所以這裡的實作是
     前向相容的：有資料就算，沒資料就回 null，而不是回 0 假裝有測。 */

  function applyConfidence(stats, records, problems, graph) {
    const table = records.conf;
    if (!table || typeof table !== "object") return;
    const byId = new Map(problems.map((problem) => [problem.id, problem]));

    Object.keys(table).forEach((problemId) => {
      const record = table[problemId];
      const problem = byId.get(problemId);
      if (!problem || !record) return;
      const p = CONFIDENCE_P[record.level];
      if (typeof p !== "number") return;
      const outcome = record.correct ? 1 : 0;

      (graph ? graph.skillsForProblem(problem) : []).forEach((skillId) => {
        const stat = stats.get(skillId);
        if (!stat) return;
        stat.conf.n += 1;
        stat.conf.sumP += p;
        stat.conf.sumO += outcome;
        stat.conf.brier += (p - outcome) * (p - outcome);
      });
    });
  }

  /* ── 9. 8 軸雷達（與既有 masteryRadarData 同形狀）────────────
     輸出刻意做成 [{key,label,score}]，現有的雷達 UI 一行都不用改。
     分數會和舊版不同 —— 舊版沒有先驗、沒有難度權重，一題全對就是 100 分。 */

  function computeAxes(attempts, now, graph, axisDefs) {
    const buckets = new Map(axisDefs.map((axis) => [axis.key, { weight: 0, score: 0, lastAt: 0 }]));

    attempts.forEach((attempt) => {
      if (attempt.at > now || attempt.science) return;
      const weight = weightOf(attempt, now);
      const score = scoreOf(attempt, weight);

      // 同一題命中同一軸的多個技巧時只算一次，否則多標籤的題目會被重複加權
      const axes = new Set();
      attempt.skills.forEach((skillId) => {
        const node = graph ? graph.byId(skillId) : null;
        if (node && node.radarAxis && buckets.has(node.radarAxis)) axes.add(node.radarAxis);
      });
      axes.forEach((key) => {
        const bucket = buckets.get(key);
        bucket.weight += weight;
        bucket.score += score;
        if (attempt.at > bucket.lastAt) bucket.lastAt = attempt.at;
      });
    });

    return axisDefs.map((axis) => {
      const bucket = buckets.get(axis.key);
      const core = masteryFrom(bucket.weight, bucket.score, bucket.lastAt, now);
      return {
        ...axis,
        score: core.confidence >= MIN_SHOW_CONF ? core.mastery : null,
        confidence: core.confidence,
        // 練過但資料已衰減到不算數 —— UI 該說「太久沒練」而不是「未測」
        stale: bucket.weight > 0 && core.confidence < MIN_SHOW_CONF,
        n: bucket.weight
      };
    });
  }

  /* ── 10. 對外 API ───────────────────────────────────────────── */

  function overallFrom(attempts, now) {
    let weight = 0;
    let score = 0;
    let lastAt = 0;
    let n = 0;
    attempts.forEach((attempt) => {
      if (attempt.at > now || attempt.science) return;
      const w = weightOf(attempt, now);
      weight += w;
      score += scoreOf(attempt, w);
      n += 1;
      if (attempt.at > lastAt) lastAt = attempt.at;
    });
    const core = masteryFrom(weight, score, lastAt, now);
    return { mastery: core.mastery, accuracy: core.accuracy, confidence: core.confidence, n };
  }

  function profile(records, opts) {
    const options = opts || {};
    const now = Number.isFinite(options.now) ? options.now : Date.now();
    const graph = resolveGraph(options);
    const problems = resolveProblems(options);
    const axisDefs = options.radarAxes || DEFAULT_AXES;
    const safeRecords = records && typeof records === "object" ? records : {};

    const attempts = extractAttempts(safeRecords, problems, graph);
    const stats = computeSkills(attempts, now, graph);
    applyConfidence(stats, safeRecords, problems, graph);

    const skills = {};
    stats.forEach((stat, id) => {
      skills[id] = buildSkillEntry(stat, now, graph);
    });

    const measured = Object.values(skills).filter((entry) => entry.measured && entry.subject !== "science");

    // 趨勢：同一組資料回放到 7 / 30 天前重算。因為模型是純函數，
    // 這不需要任何歷史快照，也不會因為使用者中斷使用而斷線。
    //
    // 回放只算精熟度，不建完整的技巧物件 —— 象限、診斷、信心那些欄位
    // 在趨勢裡用不到，重建它們會讓 profile() 的成本變成三倍。
    const past = (days) => {
      const at = now - days * DAY_MS;
      const masteries = new Map();
      computeSkills(attempts, at, graph).forEach((stat, id) => {
        masteries.set(id, masteryFrom(stat.all.weight, stat.all.score, stat.lastAt, at).mastery);
      });
      return { overall: overallFrom(attempts, at), masteries };
    };

    const overall = overallFrom(attempts, now);
    const week = past(7);
    const month = past(30);

    const deltas = measured
      .map((entry) => {
        const before = week.masteries.get(entry.id);
        if (before === undefined || before === null || entry.mastery === null) return null;
        return { id: entry.id, label: entry.label, delta: entry.mastery - before };
      })
      .filter(Boolean)
      .sort((a, b) => b.delta - a.delta);

    return {
      now,
      overall,
      skills,
      axes: computeAxes(attempts, now, graph, axisDefs),

      weakest: measured
        .filter((entry) => entry.mastery !== null)
        .sort((a, b) => a.mastery - b.mastery)
        .map((entry) => entry.id),

      dangerous: Object.values(skills)
        .filter((entry) => entry.bias !== null && entry.bias > BIAS_OVERCONFIDENT && entry.confN >= 10)
        .map((entry) => entry.id),

      underrated: Object.values(skills)
        .filter((entry) => entry.bias !== null && entry.bias < -BIAS_OVERCONFIDENT && entry.pressureAccuracy > 0.7)
        .map((entry) => entry.id),

      pressureGap: measured
        .filter((entry) => entry.diagnosis && entry.diagnosis.key === "pressure")
        .map((entry) => entry.id),

      trend: {
        d7: overall.mastery !== null && week.overall.mastery !== null ? overall.mastery - week.overall.mastery : null,
        d30: overall.mastery !== null && month.overall.mastery !== null ? overall.mastery - month.overall.mastery : null,
        fastestUp: deltas.length && deltas[0].delta > 0 ? deltas[0] : null,
        fastestDown: deltas.length && deltas[deltas.length - 1].delta < 0 ? deltas[deltas.length - 1] : null
      },

      coverage: {
        skillsTouched: Object.keys(skills).length,
        skillsMeasured: measured.length,
        attempts: attempts.length
      }
    };
  }

  // 單一技巧的細節，含最近 20 次作答（給技巧詳情頁用）
  function skill(records, skillId, opts) {
    const options = opts || {};
    const now = Number.isFinite(options.now) ? options.now : Date.now();
    const graph = resolveGraph(options);
    const problems = resolveProblems(options);
    const attempts = extractAttempts(records || {}, problems, graph).filter((a) => a.skills.includes(skillId));
    const stats = computeSkills(attempts, now, graph);
    const stat = stats.get(skillId);
    if (!stat) return null;
    applyConfidence(stats, records || {}, problems, graph);
    const entry = buildSkillEntry(stat, now, graph);
    entry.recent = attempts
      .slice()
      .sort((a, b) => b.at - a.at)
      .slice(0, 20)
      .map((a) => ({
        problemId: a.problemId, at: a.at, correct: a.correct, elapsed: a.elapsed,
        timeLimit: a.timeLimit, timed: a.timed, unanswered: a.unanswered, rank: a.rank
      }));
    return entry;
  }

  // 「再不練就會掉到 …」—— 拿來做提醒與排程，不是拿來嚇人的。
  function decayForecast(records, days, opts) {
    const options = opts || {};
    const now = Number.isFinite(options.now) ? options.now : Date.now();
    const future = now + (Number(days) || 7) * DAY_MS;
    const current = profile(records, options);
    const later = profile(records, Object.assign({}, options, { now: future }));
    return Object.keys(current.skills)
      .map((id) => ({
        id,
        label: current.skills[id].label,
        now: current.skills[id].mastery,
        future: later.skills[id] ? later.skills[id].mastery : null
      }))
      .filter((row) => row.now !== null && row.future !== null && row.future < row.now)
      .sort((a, b) => (b.now - b.future) - (a.now - a.future));
  }

  const api = {
    version: 1,
    profile,
    skill,
    decayForecast,
    constants: {
      TIME_CONSTANT_DAYS, PRIOR_STRENGTH, PRIOR_ACCURACY, MIN_CONFIDENCE_W,
      MIN_SHOW_CONF, MIN_SPLIT_N, FAST_RATIO, SOLID_ACCURACY, GAP_PRESSURE
    }
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.BuzzAbility = api;
})();
