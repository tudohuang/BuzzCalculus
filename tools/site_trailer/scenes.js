// 全站 trailer 的分鏡（對 STORYBOARD.md）。長度用「拍」算（120 BPM，一拍 0.5 秒），切點都落在拍上。
// app 的 cam：[t, cx, cy, w] —— 素材（1180×820 的 CSS 座標）上的中心與看到的寬度；frame 是它在舞台上的位置。
window.__SITE_SCENES = (B) => {
  const R = { ox: 1250, oy: 540, S: 1180 }; // 左邊放字、視窗在右
  const still = (f) => `still:site/raw/stills/${f}`;
  return [
    // ── 鉤子：四個式子跟著拍子砸下來 ──
    { kind: "formula", beats: 4, in: "cut", items: ["\\int_0^{\\infty} e^{-x^2}\\,dx", "\\lim_{n\\to\\infty}\\left(1+\\frac{1}{n}\\right)^{n}", "\\sum_{n=1}^{\\infty}\\frac{1}{n^2}", "\\frac{d}{dx}\\,x^{x}"], music: "hits" },
    { kind: "type", beats: 4, in: "zoom", flash: 0.55, lines: [{ t: "微積分，" }, { t: "{g}練到真的會{/g}。" }] },
    // ── 題庫 ──
    { kind: "count", beats: 4, in: "whip", n: 4581, sub: "道題，從暖身到魔王" },
    { kind: "type", beats: 4, in: "rise", lines: [{ t: "其中 {g}4,344{/g} 題", c: "mid" }, { t: "答案用另一條路{g}獨立驗算{/g}過", c: "sub" }] },
    // ── 作答 ──
    { kind: "app", beats: 6, in: "whip", dir: "ok", from: 0.75, to: 2.85, frame: R, cap: [{ t: "打出答案，", c: "mid" }, { t: "{g}馬上判{/g}。", c: "mid" }],
      cam: [[0, 590, 400, 1180], [1.4, 600, 470, 940], [3, 610, 480, 900]], ring: [164, 509, 853, 58, 1.45] },
    { kind: "app", beats: 7, in: "whip", dir: "wrong", from: 1.55, frame: R, cap: [{ t: "答錯了，", c: "mid" }, { t: "{g}一步一步{/g}", c: "mid" }, { t: "帶你看。", c: "mid" }],
      cam: [[0, 600, 520, 960], [0.85, 600, 520, 960], [1.5, 620, 360, 980], [3.5, 620, 400, 940]] },
    // ── 題型：四格同時動 ──
    { kind: "type", beats: 3, in: "zoom", flash: 0.35, lines: [{ t: "不只{g}選擇題{/g}。" }] },
    { kind: "bento", beats: 10, in: "zoom", pop: B / 2, music: "drop", panels: [
      { dir: "slope", from: 0.45, to: 3.2, cam: [583, 506, 560], tag: "拖出切線" },
      { dir: "tap", from: 0.45, to: 3.0, cam: [590, 507, 560], tag: "點出臨界點" },
      { dir: "sketch", from: 0.45, to: 3.2, cam: [589, 390, 860], tag: "畫出圖形" },
      { dir: "eps", from: 0.5, to: 6.1, rate: 1.25, cam: [590, 340, 720], tag: "ε-δ 挑戰" }
    ] },
    // ── 證明 ──
    { kind: "app", beats: 10, in: "whip", dir: "proof", from: 0.3, to: 6.8, rate: 1.4, frame: R, cap: [{ t: "證明，", c: "mid" }, { t: "{g}一行一句{/g}", c: "mid" }, { t: "即時判。", c: "mid" }],
      cam: [[0, 860, 400, 780], [3.0, 860, 420, 760], [3.6, 860, 560, 760], [5, 860, 580, 740]] },
    // ── 課程 ──
    { kind: "app", beats: 8, in: "whip", dir: "course:c-plot", from: 8.7, frame: R, cap: [{ t: "{g}213{/g} 堂課，", c: "mid" }, { t: "邊講，", c: "mid" }, { t: "邊寫。", c: "mid" }],
      cam: [[0, 420, 420, 720], [4, 440, 440, 760]] },
    { kind: "app", beats: 4, in: "zoom", dir: "course:a-wrong", from: 11.6, cam: [[0, 410, 405, 560], [2, 430, 430, 620]], frame: { ox: 960, oy: 540, S: 1700 }, tiltY: 0, tiltX: 0 },
    // ── 每天 ──
    { kind: "app", beats: 6, in: "whip", dir: "home", from: 0.6, frame: R, cap: [{ t: "每天，", c: "mid" }, { t: "{g}知道該練什麼{/g}。", c: "mid" }],
      cam: [[0, 640, 410, 1180], [3, 640, 430, 1100]] },
    { kind: "app", beats: 4, in: "whip", dir: still("radar.jpg"), from: 0, frame: { ox: 960, oy: 540, S: 1500 }, tiltY: 12, label: "哪個技巧弱，{g}一眼看到{/g}",
      cam: [[0, 430, 560, 800], [2, 420, 580, 700]] },
    // ── 快切：其他練法 ──
    { kind: "app", beats: 2, in: "whip", xin: 0.22, dir: still("daily.jpg"), from: 0, frame: { ox: 960, oy: 470, S: 1500 }, tiltY: -8, label: "每日一題", cam: [[0, 590, 380, 1180], [1, 590, 380, 1100]] },
    { kind: "app", beats: 2, in: "whip", xin: 0.22, dir: still("train.jpg"), from: 0, frame: { ox: 960, oy: 470, S: 1500 }, tiltY: -8, label: "弱點 · 模擬 · 挑戰", cam: [[0, 620, 300, 1180], [1, 620, 300, 1100]] },
    { kind: "app", beats: 2, in: "whip", xin: 0.22, dir: still("mistakes.jpg"), from: 0, frame: { ox: 960, oy: 470, S: 1500 }, tiltY: -8, label: "錯題本", cam: [[0, 620, 380, 1180], [1, 620, 380, 1100]] },
    { kind: "app", beats: 2, in: "whip", xin: 0.22, dir: still("proofs.jpg"), from: 0, frame: { ox: 960, oy: 470, S: 1500 }, tiltY: -8, label: "證明題庫", cam: [[0, 620, 380, 1180], [1, 620, 380, 1100]] },
    { kind: "app", beats: 2, in: "whip", xin: 0.22, dir: still("library.jpg"), from: 0, frame: { ox: 960, oy: 470, S: 1500 }, tiltY: -8, label: "自己挑題", cam: [[0, 620, 380, 1180], [1, 620, 380, 1100]] },
    // ── 收 ──
    { kind: "type", beats: 4, in: "zoom", flash: 0.4, lines: [{ t: "{g}4,581{/g} 題 · {g}213{/g} 課 · {g}45{/g} 道證明", c: "mid" }] },
    { kind: "end", beats: 10, in: "rise", xin: 0.4, desk: still("home.jpg"), phone: still("phone-home.jpg"), tag: "免安裝 · 離線可用 · 手機電腦都能練", music: "end" }
  ];
};
