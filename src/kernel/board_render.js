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

  // 落筆瞬間的壓力下限。
  //
  // Apple Pencil 剛碰到玻璃時回報的壓力常常接近 0，要幾十毫秒才爬上來。
  // 照原始值畫的話，每一筆的開頭都是一條 1.3px 的髮絲 —— 使用者的感覺不是
  // 「這裡比較細」，是「筆沒反應」。所以壓力先墊到 0.35 再算寬度。
  const MIN_PRESSURE = 0.35;
  // 再加一個絕對下限，避免任何情況下畫出看不見的線。
  const MIN_WIDTH_CSS = 1.6;

  function widthOf(point, isEraser, base, ratio) {
    if (isEraser) return base;
    const pressure = Math.max(MIN_PRESSURE, point.pressure);
    return Math.max(MIN_WIDTH_CSS * ratio, base * (0.5 + 1.1 * pressure));
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

    const base = (isEraser ? ERASER_WIDTH : PEN_WIDTH) * ratio;

    // 單點：點一下要留下一個點，不是什麼都沒有
    if (points.length === 1) {
      if (!stroke.drawnTo) {
        const only = points[0];
        ctx.beginPath();
        ctx.arc(only.x * canvas.width, only.y * canvas.height, widthOf(only, isEraser, base, ratio) / 2, 0, Math.PI * 2);
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
      const from = mid(previous, control);
      const to = mid(control, next);
      ctx.beginPath();
      ctx.lineWidth = widthOf(control, isEraser, base, ratio);
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
      ctx.lineWidth = widthOf(last, isEraser, base, ratio);
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
