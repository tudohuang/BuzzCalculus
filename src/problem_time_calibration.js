(function () {
  "use strict";

  // 時限校準（2026-09，公開發布前的盤點）。
  //
  // 實測回報：「同一局裡 Boss 330–420 秒、標準 65–75、基礎 34–180 跳來跳去，
  // 看不出邏輯」。量出來的真相是：每個難度的**中位數**其實很健康
  // （R1 25s → R6 300s），病在同難度內的極端值 —— R6 給 45 秒是不可能的任務，
  // R1 給 180 秒是在發呆。
  //
  // 這裡只夾掉極端，不動主體：每個 rank 有一條「合理帶」，
  // 帶內的作者判斷照舊（同 rank 有難有易本來就對），帶外的拉回邊界。
  // 跟 difficulty_calibration 同一個哲學：載入時校準，題庫檔一個都不用改。
  const BANDS = {
    1: [20, 90],
    2: [30, 160],
    3: [40, 240],
    4: [60, 330],
    5: [90, 420],
    6: [120, 600]
  };

  const problems = window.BUZZ_PROBLEMS || [];
  let clamped = 0;
  problems.forEach((problem) => {
    const rank = Math.max(1, Math.min(6, Number(problem.rank || problem.difficulty || 1)));
    const band = BANDS[rank];
    const limit = Number(problem.timeLimit || 0);
    if (!band || !Number.isFinite(limit)) return;
    const next = Math.min(band[1], Math.max(band[0], limit));
    if (next !== limit) {
      problem.timeLimit = next;
      clamped += 1;
    }
  });

  // 必須排在所有題庫檔（含難度校準）之後。
  window.BUZZ_TIME_LIMITS_CLAMPED = clamped;
})();
