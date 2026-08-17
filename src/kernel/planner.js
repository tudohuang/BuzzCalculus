// Buzz Planner — 今天練什麼
//
// 首頁只有一個主 CTA：「開始今天的訓練」。這個檔就是那顆按鈕背後的大腦。
//
// 最重要的設計約束不是演算法，是 `why`：
// 使用者信任推薦系統的唯一來源，是它說得出為什麼。一個沒有理由的推薦
// 和隨機抽題沒有差別 —— 所以 why 是產品的一部分，不是 debug 訊息，
// 而且驗證器會擋住空字串。
//
// 設計規則：
//   1. 純函數。輸入 (records, now) 輸出配方，不碰 DOM、不抽題。
//      抽題是 session.js 的事：planner 只說「要 4 題到期複習、5 題弱點」。
//   2. 每個 slot 抽不滿時要能降級，不能留白 —— 降級路徑寫在 session.js。
//   3. 任何情況都要給得出配方。新使用者、老使用者、零紀錄、只練過一次，
//      都必須有東西可以按。

(function () {
  "use strict";

  const DAY_MS = 86400000;

  /* ── 三種長度 ─────────────────────────────────────────────────
     「15 分鐘也能完成一次有效訓練」的有效定義寫在 EFFECTIVE：
     至少涵蓋 2 個弱點技巧、且至少 3 題到期複習。
     沒有這個定義的話，「有效訓練」只是行銷詞。 */

  const LENGTHS = {
    sprint5: {
      key: "sprint5",
      label: "5 分鐘快刷",
      minutes: 5,
      count: 6,
      // 短時間只夠做兩件事：清掉到期的、把已經反射的維持住。
      mix: [
        { role: "review", share: 0.6 },
        { role: "maintain", share: 0.4 }
      ]
    },
    daily15: {
      key: "daily15",
      label: "15 分鐘每日訓練",
      minutes: 15,
      count: 12,
      mix: [
        { role: "review", share: 0.35 },
        { role: "weak", share: 0.4 },
        { role: "new", share: 0.2 },
        { role: "stretch", share: 0.05 }
      ]
    },
    deep45: {
      key: "deep45",
      label: "45 分鐘完整 Session",
      minutes: 45,
      count: 26,
      mix: [
        { role: "warmup", share: 0.2 },
        { role: "weak", share: 0.3 },
        { role: "new", share: 0.3 },
        { role: "hard", share: 0.15 },
        { role: "boss", share: 0.05 }
      ]
    }
  };

  const EFFECTIVE = { minWeakSkills: 2, minReview: 3 };

  // 精熟度門檻，和 ability.js 的分級對齊
  const REFLEX = 85;
  const SOLID = 65;
  const WEAK = 40;

  const ROLE_LABEL = {
    review: "到期複習",
    weak: "弱點",
    new: "新技巧",
    stretch: "拉高難度",
    maintain: "反射維持",
    warmup: "熱身",
    hard: "難題",
    boss: "Boss"
  };

  function resolve(name, opts) {
    return (
      (opts && opts[name]) ||
      (typeof window !== "undefined" && window[name]) ||
      (typeof globalThis !== "undefined" && globalThis[name]) ||
      null
    );
  }

  /* ── 到期複習 ────────────────────────────────────────────────
     沿用既有的 SRS：records.mistakes[id].srs.dueAt。
     沒有 srs 欄位的舊資料視為「現在就到期」（惰性遷移）。 */

  function dueMistakes(records, now) {
    const mistakes = (records && records.mistakes) || {};
    const rows = [];
    Object.keys(mistakes).forEach((problemId) => {
      const item = mistakes[problemId];
      if (!item) return;
      const srs = item.srs && typeof item.srs === "object" ? item.srs : null;
      const dueAt = srs && Number.isFinite(Number(srs.dueAt)) ? Number(srs.dueAt) : 0;
      const wrongCount = Number(item.wrongCount || 1);
      const lastWrongAt = Date.parse(item.lastWrongAt || "") || 0;
      rows.push({ problemId, dueAt, wrongCount, lastWrongAt, due: dueAt <= now });
    });
    // 到期的優先，其次錯得多的，再其次最近才錯的
    rows.sort((a, b) => {
      if (a.due !== b.due) return a.due ? -1 : 1;
      if (b.wrongCount !== a.wrongCount) return b.wrongCount - a.wrongCount;
      return b.lastWrongAt - a.lastWrongAt;
    });
    return rows;
  }

  /* ── 考試倒推 ────────────────────────────────────────────────
     使用者設了「30 天後期中考」之後，把剩下的工作量除以剩下的天數。
     做不完的時候必須誠實說做不完，而不是假裝排得下 —— 那是這個功能
     唯一的價值所在。 */

  function examPlan(records, profile, now) {
    const plan = records && records.plan;
    if (!plan || !plan.examAt) return null;
    const examAt = Date.parse(plan.examAt);
    if (!Number.isFinite(examAt)) return null;

    const daysLeft = Math.max(0, Math.ceil((examAt - now) / DAY_MS));
    const scope = Array.isArray(plan.scope) && plan.scope.length ? plan.scope : null;
    const target = Number(plan.target) || 70;

    const inScope = (skillId) => {
      if (!scope) return true;
      return scope.some((pattern) =>
        pattern.endsWith("*") ? skillId.startsWith(pattern.slice(0, -1)) : skillId === pattern
      );
    };

    const skills = (profile && profile.skills) || {};
    const gaps = Object.keys(skills)
      .filter(inScope)
      .map((id) => ({ id, label: skills[id].label, gap: Math.max(0, target - (skills[id].mastery || 0)) }))
      .filter((row) => row.gap > 0)
      .sort((a, b) => b.gap - a.gap);

    // 經驗值：每 6 分精熟度約需一次該技巧的有效曝光
    const totalWork = gaps.reduce((sum, row) => sum + row.gap / 6, 0);
    const usableDays = Math.max(1, daysLeft - 2); // 留 2 天緩衝
    const dailyWork = totalWork / usableDays;
    const dailyMinutes = Number(plan.dailyMinutes) || 15;
    // 一分鐘大約做得完 0.8 次有效曝光（含讀題與結算）
    const dailyCapacity = dailyMinutes * 0.8;

    const sprint = daysLeft <= 7;
    const feasible = dailyWork <= dailyCapacity;
    const coverable = Math.floor(dailyCapacity * usableDays / (totalWork / Math.max(1, gaps.length)));

    return {
      label: plan.label || "考試",
      examAt,
      daysLeft,
      target,
      scope,
      sprint,
      feasible,
      gaps,
      dailyMinutes,
      neededMinutes: Math.ceil(dailyWork / 0.8),
      coverableSkills: Math.max(0, Math.min(gaps.length, coverable)),
      totalSkills: gaps.length
    };
  }

  /* ── 技巧分類 ────────────────────────────────────────────────
     哪些是弱點、哪些該維持、哪些可以開新的。
     「可以開新的」靠 skill graph 的 prereq：前置沒到 solid 就不推薦，
     否則使用者會被丟到一個他還沒準備好的技巧上然後全錯。 */

  function classify(profile, graph) {
    const skills = (profile && profile.skills) || {};
    const weak = [];
    const maintain = [];
    const shaky = [];

    Object.keys(skills).forEach((id) => {
      const entry = skills[id];
      if (entry.subject === "science") return; // 理科不進微積分主線
      if (entry.mastery === null) return;
      if (!entry.measured) {
        // 樣本不足的技巧當作「還沒測準」，排進弱點但優先度低
        shaky.push(entry);
        return;
      }
      if (entry.mastery >= REFLEX) maintain.push(entry);
      else if (entry.mastery < SOLID) weak.push(entry);
    });

    weak.sort((a, b) => a.mastery - b.mastery);
    maintain.sort((a, b) => (a.lastAt || 0) - (b.lastAt || 0)); // 最久沒碰的先維持

    // 沒碰過、但前置已經穩了的技巧 —— 這是「下一步該學什麼」
    const fresh = [];
    if (graph) {
      graph.skills.forEach((node) => {
        if (node.subject === "science") return;
        if (skills[node.id]) return;
        const ready = (node.prereq || []).every((parent) => {
          const entry = skills[parent];
          return !entry || (entry.mastery !== null && entry.mastery >= SOLID);
        });
        if (ready) fresh.push(node);
      });
      fresh.sort((a, b) => a.tier - b.tier);
    }

    return { weak, maintain, shaky, fresh };
  }

  /* ── why：說得出為什麼 ───────────────────────────────────────
     優先序刻意這樣排：具體的個人證據 > 一般性的說法。
     「Frullani 上週掉了 11 分」永遠比「今天練弱點」有說服力。 */

  function buildWhy(context) {
    const { profile, groups, due, exam, length } = context;
    const parts = [];

    if (exam && exam.daysLeft <= 14 && exam.gaps.length) {
      const top = exam.gaps.slice(0, 2).map((row) => row.label).join("、");
      parts.push(`${exam.label}剩 ${exam.daysLeft} 天，${top} 還沒到目標`);
    }

    const down = profile && profile.trend && profile.trend.fastestDown;
    if (down && down.delta <= -3) parts.push(`${down.label}這週掉了 ${Math.abs(down.delta)} 分`);

    const dangerous = (profile && profile.dangerous) || [];
    if (dangerous.length) {
      const entry = profile.skills[dangerous[0]];
      if (entry) parts.push(`${entry.label}你標「確定」卻常錯`);
    }

    const pressure = (profile && profile.pressureGap) || [];
    if (pressure.length) {
      const entry = profile.skills[pressure[0]];
      if (entry) parts.push(`${entry.label}你不限時會、限時垮`);
    }

    if (parts.length < 2 && groups.weak.length) {
      const names = groups.weak.slice(0, 2).map((entry) => entry.label).join("、");
      parts.push(`${names}還沒穩`);
    }

    if (parts.length < 2 && due.filter((row) => row.due).length >= 3) {
      parts.push(`${due.filter((row) => row.due).length} 題錯題今天到期`);
    }

    if (parts.length < 2 && groups.fresh.length) {
      parts.push(`前置已經穩了，可以開始練${groups.fresh[0].label}`);
    }

    // 保底：新使用者什麼資料都沒有時也必須給得出一句話
    if (!parts.length) {
      parts.push(
        profile && profile.coverage && profile.coverage.attempts
          ? "先把最近練過的技巧鞏固一輪"
          : "第一次練，先做一輪混合題看看你的底"
      );
    }

    // 刻意不在 why 裡寫題數：配方產生之後 session.fill 還會為了守住時間預算
    // 增減題目，寫死題數會和使用者實際看到的對不起來。題數由 UI 讀 fill 的結果顯示。
    return `${parts.slice(0, 2).join("；")}。`;
  }

  /* ── 配方 ───────────────────────────────────────────────────── */

  // 用題庫真實的 timeLimit 中位數估時，而不是拍腦袋的固定秒數
  function medianTime(list) {
    const times = list.map((p) => Number(p.timeLimit) || 60).sort((a, b) => a - b);
    if (!times.length) return 60;
    return times[Math.floor(times.length / 2)];
  }

  // 題數要看使用者實際會拿到什麼題。弱點如果落在 R5 的長題上，
  // 12 題本來就不可能是 15 分鐘 —— 這時候該調的是題數，不是謊報時間。
  function fitCount(length, perProblemSeconds) {
    const raw = (length.minutes * 60) / 1.35 / Math.max(20, perProblemSeconds);
    const bounds = {
      sprint5: [4, 10],
      daily15: [8, 20],
      deep45: [14, 40]
    }[length.key] || [6, 30];
    return Math.max(bounds[0], Math.min(bounds[1], Math.round(raw)));
  }

  function recipe(records, lengthKey, opts) {
    const options = opts || {};
    const now = Number.isFinite(options.now) ? options.now : Date.now();
    const graph = resolve("BuzzSkillGraph", options);
    const abilityApi = resolve("BuzzAbility", options);
    const problems = options.problems || resolve("BUZZ_PROBLEMS", options) || [];
    const safeRecords = records && typeof records === "object" ? records : {};

    const length = LENGTHS[lengthKey] || LENGTHS.daily15;
    const profile = options.profile ||
      (abilityApi ? abilityApi.profile(safeRecords, { now, problems, graph }) : { skills: {}, coverage: { attempts: 0 } });

    const groups = classify(profile, graph);
    const due = dueMistakes(safeRecords, now);
    const dueNow = due.filter((row) => row.due);
    const exam = examPlan(safeRecords, profile, now);
    const cap = Math.max(1, Math.min(6, Number(
      (safeRecords.settings && safeRecords.settings.difficultyCap) || 3
    )));

    // 考前 7 天切衝刺：停止引入新技巧，火力集中在 scope 內的弱點與到期複習
    const mix = exam && exam.sprint
      ? [{ role: "weak", share: 0.7 }, { role: "review", share: 0.3 }]
      : length.mix;

    const inScope = (id) => {
      if (!exam || !exam.scope) return true;
      return exam.scope.some((pattern) =>
        pattern.endsWith("*") ? id.startsWith(pattern.slice(0, -1)) : id === pattern
      );
    };
    const scopedWeak = groups.weak.filter((entry) => inScope(entry.id));
    const weakPool = (scopedWeak.length ? scopedWeak : groups.weak).concat(groups.shaky);

    // 先估「這個人這次大概會拿到多長的題」，再決定題數。
    // 取樣範圍限制在難度上限內、且落在這次要練的技巧上。
    const targetSkills = new Set([
      ...weakPool.slice(0, 4).map((entry) => entry.id),
      ...groups.fresh.slice(0, 3).map((node) => node.id),
      ...groups.maintain.slice(0, 4).map((entry) => entry.id)
    ]);
    const graphOf = (problem) => (graph ? graph.skillsForProblem(problem) : []);
    const sample = problems.filter((problem) => {
      const rank = Number(problem.rank || problem.difficulty || 1);
      if (rank > cap + 1) return false;
      if (!targetSkills.size) return true;
      return graphOf(problem).some((id) => targetSkills.has(id));
    });
    const perProblem = medianTime(sample.length >= 8 ? sample : problems);
    const count = fitCount(length, perProblem);

    const slots = [];
    let assigned = 0;
    mix.forEach((part, index) => {
      const isLast = index === mix.length - 1;
      const slotCount = isLast ? count - assigned : Math.round(count * part.share);
      assigned += slotCount;
      if (slotCount <= 0) return;

      const slot = { role: part.role, label: ROLE_LABEL[part.role] || part.role, count: slotCount, filter: {} };
      switch (part.role) {
        case "review":
          slot.filter = { problemIds: dueNow.length ? dueNow.map((r) => r.problemId) : due.map((r) => r.problemId) };
          break;
        case "weak":
          slot.filter = { skills: weakPool.slice(0, 4).map((entry) => entry.id), maxRank: cap };
          break;
        case "new":
          slot.filter = { skills: groups.fresh.slice(0, 3).map((node) => node.id), maxRank: Math.min(cap, 4) };
          break;
        case "maintain":
          slot.filter = { skills: groups.maintain.slice(0, 4).map((entry) => entry.id), maxRank: 3 };
          break;
        case "warmup":
          slot.filter = { maxRank: Math.max(1, Math.min(2, cap)) };
          break;
        case "stretch":
          slot.filter = { minRank: Math.min(6, cap + 1) };
          break;
        case "hard":
          slot.filter = { minRank: Math.min(5, cap + 1) };
          break;
        case "boss":
          slot.filter = { minRank: 5 };
          break;
        default:
          slot.filter = {};
      }
      slots.push(slot);
    });

    const estSeconds = Math.round(count * perProblem * 1.35);

    return {
      length: length.key,
      label: length.label,
      count,
      targetMinutes: length.minutes,
      // session.fill 用這個預算挑時長合適的題。沒有它的話，「5 分鐘快刷」
      // 可能抽到 6 題 R6，變成 11 分鐘。
      budgetSeconds: length.minutes * 60,
      minCount: Math.max(2, Math.round(count * 0.6)),
      maxCount: Math.round(count * 1.5),
      estSeconds,
      slots,
      exam,
      sprint: Boolean(exam && exam.sprint),
      why: buildWhy({ profile, groups, due, exam, length }),
      context: {
        dueNow: dueNow.length,
        dueTotal: due.length,
        weakSkills: groups.weak.length,
        freshSkills: groups.fresh.length,
        reflexSkills: groups.maintain.length,
        difficultyCap: cap
      }
    };
  }

  /* ── 今天推薦哪一種 ─────────────────────────────────────────
     只推薦一個。給三個選項等於沒有推薦。 */

  function today(records, opts) {
    const options = opts || {};
    const now = Number.isFinite(options.now) ? options.now : Date.now();
    const safeRecords = records && typeof records === "object" ? records : {};
    const graph = resolve("BuzzSkillGraph", options);
    const abilityApi = resolve("BuzzAbility", options);
    const problems = options.problems || resolve("BUZZ_PROBLEMS", options) || [];
    const profile = options.profile ||
      (abilityApi ? abilityApi.profile(safeRecords, { now, problems, graph }) : { skills: {}, coverage: { attempts: 0 } });

    const exam = examPlan(safeRecords, profile, now);
    const due = dueMistakes(safeRecords, now).filter((row) => row.due).length;
    // lastPlayed 是 app.js 寫的，但匯入的資料可能沒有 —— 退回用最新一場的時間，
    // 否則一個明明昨天練過的人會被判成「隔了一週沒練」。
    const history = Array.isArray(safeRecords.history) ? safeRecords.history : [];
    const newestSession = history.reduce((newest, item) => {
      const at = item && Date.parse(item.finishedAt || "");
      return Number.isFinite(at) && at > newest ? at : newest;
    }, 0);
    const lastPlayed = Date.parse(safeRecords.lastPlayed || "") || newestSession;
    const idleDays = lastPlayed ? (now - lastPlayed) / DAY_MS : Infinity;

    let key = "daily15";
    let reason = "維持每天的節奏";

    if (exam && exam.sprint) {
      key = "daily15";
      reason = `${exam.label}剩 ${exam.daysLeft} 天，衝刺模式`;
    } else if (!profile.coverage || !profile.coverage.attempts) {
      key = "daily15";
      reason = "第一次練，先測出你的底";
    } else if (idleDays >= 7) {
      key = "sprint5";
      reason = "隔了一週沒練，先用短的把手感找回來";
    } else if (due >= 8) {
      key = "daily15";
      reason = `${due} 題錯題到期，今天以複習為主`;
    }

    const plan = recipe(safeRecords, key, Object.assign({}, options, { now, profile }));
    return {
      length: key,
      reason,
      recipe: plan,
      alternatives: Object.keys(LENGTHS).filter((id) => id !== key),
      dueNow: due,
      exam
    };
  }

  // 「有效訓練」的定義。行銷詞要能被驗證，否則就是空話。
  function isEffective(plan) {
    if (!plan || !Array.isArray(plan.slots)) return false;
    const review = plan.slots.filter((s) => s.role === "review").reduce((n, s) => n + s.count, 0);
    const weakSlot = plan.slots.find((s) => s.role === "weak");
    const weakSkills = weakSlot ? (weakSlot.filter.skills || []).length : 0;
    return review >= EFFECTIVE.minReview && weakSkills >= EFFECTIVE.minWeakSkills;
  }

  const api = {
    version: 1,
    LENGTHS,
    EFFECTIVE,
    ROLE_LABEL,
    recipe,
    today,
    examPlan,
    dueMistakes,
    classify,
    isEffective
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.BuzzPlanner = api;
})();
