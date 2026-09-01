// 手寫筆跡的繪製核心
//
// 這是 app.js 拆分的下一塊。挑這一塊的理由：它已經是純的 ——
// 輸入是 (canvas, ctx, strokes)，輸出是畫布上的像素，不碰 localStorage、
// 不碰 quiz 狀態、不呼叫 render()。把它搬出來不需要改變任何行為。
//
// 拆分不是為了好看。11,642 行的單體讓每一次改動都有連帶風險，
// 於是漸漸沒有人敢動它 —— 而不敢動的產品會停在原地。
// kernel 的做法是一次搬一塊，每一塊都用 golden 測試釘住行為。
//
// 三條規則（跟其他 kernel 模組一樣）：
//   1. 純函式：不碰 DOM 查詢、不碰儲存、不讀 Date.now()
//   2. app.js 用特徵偵測接它，沒有就走原本的路（不能因為少一個檔案就壞掉）
//   3. 行為完全不變，由 tools/validate_golden.js 保證
//
// 座標約定：stroke.points 的 x / y 是 0–1 的比例，跟畫布尺寸無關。
// 這樣旋轉 iPad、進出全螢幕之後，舊筆跡還畫得回原來的相對位置。

(function () {
  "use strict";

  const INK = { paper: "#1d2b3a", board: "#fff8de" };

  // 筆的基準寬度（CSS px，之後乘上 devicePixelRatio）。
  // 橡皮擦固定寬度：擦東西的時候手感一致比壓感重要。
  const PEN_WIDTH = 2.4;
  const ERASER_WIDTH = 20;

  function inkFor(surface) {
    return INK[surface] || INK.paper;
  }

  // 落筆瞬間的壓力下限，以及它只該管落筆。
  //
  // Apple Pencil 剛碰到玻璃時回報的壓力常常接近 0，要幾十毫秒才爬上來。
  // 照原始值畫的話，每一筆的開頭都是一條髮絲 —— 使用者的感覺不是
  // 「這裡比較細」，是「筆沒反應」。所以落筆處要墊高。
  //
  // 但第一版把這個下限套在**整條線**上，代價量得出來：
  // 壓力 0.05 / 0.2 / 0.4 畫出來一模一樣（都是 2.5px），
  // 也就是底下 40% 的壓力範圍完全是死的，怎麼輕壓都一樣粗。
  // 這就是「壓感好像沒有用」的來源。
  //
  // 改成只墊前 LANDING_SAMPLES 個取樣：落筆不會變髮絲，
  // 之後整條線拿回完整的壓力範圍。
  const MIN_PRESSURE = 0.35;
  const LANDING_SAMPLES = 3;
  // 再加一個絕對下限，避免任何情況下畫出看不見的線。
  const MIN_WIDTH_CSS = 1.2;

  // 壓力對線寬的映射。
  //
  // 舊的是 base * (0.5 + 1.1p)，配上整筆的壓力下限，實際只跑出 2.5→4.5px，
  // 也就是最重的一筆只比最輕的粗 1.8 倍 —— 手上感覺不到差別。
  // 改成 base * (0.55 + 1.45p)：輕 1.3px、中 3.1px、重 4.8px，約 3.6 倍。
  // 這個比例接近實際的筆：能寫出細的下標，也能壓出粗的底線。
  const WIDTH_BASE = 0.55;
  const WIDTH_GAIN = 1.45;

  // 沒有壓感的裝置改用速度決定粗細。
  //
  // 滑鼠、手指、以及不少便宜觸控筆一律回報固定壓力，於是畫出來是一條
  // 從頭到尾等寬的線 —— 那看起來不像手寫，像用小畫家拉的。
  // 寫得慢就粗、寫得快就細是所有手寫程式的替代方案，因為真實的筆本來
  // 就是慢的時候墨積得多。距離是正規化座標（0–1），所以跟畫布大小無關。
  const SPEED_SLOW = 0.002;
  const SPEED_FAST = 0.022;

  function clamp01(value) {
    return value < 0 ? 0 : value > 1 ? 1 : value;
  }

  // 壓力在相鄰兩個取樣點之間可以跳很多（Pencil 尤其明顯），
  // 直接拿來算寬度，線就會一節一節的。往回平均三點就順了 ——
  // 而且不會有延遲，因為平均的都是已經到手的點，不需要等未來的取樣。
  function smoothPressure(points, index) {
    let total = 0;
    let count = 0;
    for (let i = index > 2 ? index - 2 : 0; i <= index; i += 1) {
      total += points[i].pressure;
      count += 1;
    }
    return count ? total / count : MIN_PRESSURE;
  }

  function widthAt(points, index, isEraser, base, ratio, finished) {
    if (isEraser) return base;
    const point = points[index];
    // point.pen 是 2026-08 才開始寫入的欄位。舊筆跡沒有它 —— 一律走壓力路徑，
    // 也就是跟改版前畫出來一模一樣，存下來的草稿不會因為升級而變樣。
    if (point.pen === false && index > 0) {
      const previous = points[index - 1];
      const speed = Math.sqrt(
        (point.x - previous.x) * (point.x - previous.x) + (point.y - previous.y) * (point.y - previous.y)
      );
      const fast = clamp01((speed - SPEED_SLOW) / (SPEED_FAST - SPEED_SLOW));
      // 作用範圍要跟壓感那條路徑相稱。
      //
      // 原本是 base*(1.3-0.65f)，實際只跑出 2.24px→1.56px —— 1.4 倍、絕對差 0.7px，
      // 手上根本感覺不到。而有壓感的裝置現在是 3.7 倍。
      // 速度是沒有壓感的裝置**唯一**的表現力來源，不該比壓感窄那麼多。
      return Math.max(MIN_WIDTH_CSS * ratio, base * (1.7 - 1.05 * fast));
    }
    // 落筆與收筆的那幾個取樣墊高壓力，中間照實。
    //
    // 只墊落筆的話，收筆那一端會直接掉到最低 —— 實測畫出來每一筆的尾巴
    // 都收成針尖，一條分數線變成中間粗兩頭尖的透鏡形，看起來很脆。
    // 真實的筆抬起來確實會變細，但不會消失。兩端都墊，中段才是壓感真正在說話的地方。
    const raw = smoothPressure(points, index);
    // 收筆那一端只有在**真的收筆之後**才算數。
    // 畫的過程中「最後三個點」永遠是當下最新的點，用同一條判斷式的話
    // 整條線都會被當成收筆而墊高 —— 壓感又整個失效。實測到才發現。
    const nearEnds = index < LANDING_SAMPLES || (finished && index >= points.length - LANDING_SAMPLES);
    const pressure = nearEnds ? Math.max(MIN_PRESSURE, raw) : raw;
    return Math.max(MIN_WIDTH_CSS * ratio, base * (WIDTH_BASE + WIDTH_GAIN * pressure));
  }

  // 只畫「還沒畫過」的那一段，用 stroke.drawnTo 記進度。
  //
  // 為什麼不每次重畫整塊板子：那是 O(n²)。實測寫到第三行就看得出頓，
  // 而 iPad 上的取樣率是 120–240Hz，點數累積得比想像中快。
  //
  // finish=true 代表收筆，這時候最後一段會被記成「已提交」；
  // 中途畫的時候也會補到筆尖，只是不記，下一次用曲線蓋過去（見下方註解）。
  function paintStrokeTail(canvas, ctx, stroke, options) {
    const opts = options || {};
    const finish = Boolean(opts.finish);
    const ratio = opts.ratio || 1;
    const surface = opts.surface || "paper";
    const points = stroke.points;
    if (!points || !points.length) return;

    const isEraser = stroke.tool === "eraser";
    ctx.save();
    // 橡皮擦用 destination-out 真的挖掉墨水，而不是拿背景色蓋過去 ——
    // 後者在方格紙上會把格線一起蓋掉。
    ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";
    ctx.strokeStyle = isEraser ? "rgba(0,0,0,1)" : inkFor(surface);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // penScale：使用者手感設定（細 0.75 / 標準 1 / 粗 1.3）。
    // 2.4 這個基準是作者的手感，從沒被真人在 iPad 上校準過 ——
    // 與其猜一個對的數字，不如把選擇交給拿筆的人。橡皮擦不縮放。
    const penScale = isEraser ? 1 : (opts.penScale || 1);
    const base = (isEraser ? ERASER_WIDTH : PEN_WIDTH * penScale) * ratio;

    // 單點：點一下要留下一個點，不是什麼都沒有
    if (points.length === 1) {
      if (!stroke.drawnTo) {
        const only = points[0];
        ctx.beginPath();
        ctx.arc(only.x * canvas.width, only.y * canvas.height, widthAt(points, 0, isEraser, base, ratio, finish) / 2, 0, Math.PI * 2);
        ctx.fill();
        stroke.drawnTo = 1;
      }
      ctx.restore();
      return;
    }

    const px = (point) => point.x * canvas.width;
    const py = (point) => point.y * canvas.height;
    const mid = (a, b) => ({ x: (px(a) + px(b)) / 2, y: (py(a) + py(b)) / 2 });

    // 以「相鄰兩點的中點」為端點、取樣點本身為控制點畫二次曲線。
    // 這是把折線變成手寫感最便宜的做法，而且逐段可畫。
    let index = Math.max(1, stroke.drawnTo || 1);
    for (; index < points.length - 1; index += 1) {
      const previous = points[index - 1];
      const control = points[index];
      const next = points[index + 1];
      // 第一段要從**真正的起點**出發，不是從 points[0] 與 points[1] 的中點。
      //
      // 曲線的端點取中點是對的（那是這套平滑的做法），但這讓每一筆的
      // points[0] → mid(0,1) 那一小段從來沒有被畫過。畫面上看得到：
      // 落筆的圓點跟線條之間有一小段空白，圓點像是掉在旁邊的髒點。
      const from = index === 1 ? { x: px(previous), y: py(previous) } : mid(previous, control);
      const to = mid(control, next);
      ctx.beginPath();
      ctx.lineWidth = widthAt(points, index, isEraser, base, ratio, finish);
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo(px(control), py(control), to.x, to.y);
      ctx.stroke();
    }
    stroke.drawnTo = Math.max(1, points.length - 1);

    // 一律把最後一小段補到**真正的筆尖位置**，不是只有收筆的時候。
    //
    // 這是「不靈敏」的主因：二次曲線需要知道下一個取樣點才畫得出來，
    // 所以已提交的曲線永遠停在倒數第二個點。原本只有 finish 才補這一段，
    // 於是書寫過程中墨水一直落後筆尖 —— 寫得越慢，落後看起來越明顯，
    // 而算數學的時候人本來就寫得慢。
    //
    // 代價是下一次會用曲線覆蓋掉這條直線，同一塊地方畫兩次。
    // 墨色不透明、路徑幾乎重合，看不出來 —— 拿這個換掉筆尖的延遲是划算的。
    if (points.length >= 2) {
      const last = points[points.length - 1];
      const beforeLast = points[points.length - 2];
      const from = mid(beforeLast, last);
      ctx.beginPath();
      ctx.lineWidth = widthAt(points, points.length - 1, isEraser, base, ratio, finish);
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(px(last), py(last));
      ctx.stroke();
      if (finish) stroke.drawnTo = points.length;
    }

    ctx.restore();
  }

  // 全部重畫。不填底色 —— 紙的方格與黑板的深色都是 CSS 背景，
  // 畫布保持透明，橡皮擦才挖得動。
  function paintAll(canvas, ctx, strokes, options) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    (strokes || []).forEach((stroke) => {
      stroke.drawnTo = 0;
      paintStrokeTail(canvas, ctx, stroke, Object.assign({}, options, { finish: true }));
    });
  }

  const api = {
    version: 1,
    ink: inkFor,
    penWidth: PEN_WIDTH,
    eraserWidth: ERASER_WIDTH,
    paintStrokeTail,
    paintAll
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.BuzzBoardRender = api;
})();
