// ── 課程影片（新版課程一課最多一支 Manim 概念動畫）──
//
// course_v2_ui.js 在課文裡放一個固定 16:9 的佔位（data-cv2-video="<短名>" data-duration="<秒>"＋一行說明），
// 這支（index.html 的 type="text/lazy" data-lazy="video"，只有有影片的課才抓）把它換成：
//   預覽圖（loading="lazy" 的 <img>）＋播放鍵＋片長。點了才建 <video>（preload="none"、playsinline、controls、muted；不自動播放）。
// 網址在這裡組，課文只寫短名：media/<id>-<light|dark>-<720p|1080p>.mp4 與 media/<id>-<theme>-poster.jpg
//   （視窗 < 900px 用 720p；主題跟 <html data-theme> 走，切主題時換預覽圖，影片停著就換片源、接回原來的秒數）。
// 檔案由部署時的 tools/fetch_media.js 放進站上的 /media/；本機沒有那個資料夾時，預覽圖載不到 → 只留一行安靜的說明，不留破圖框。
// sw.js 不碰 /media/ 與 Range 請求（影片不進 Cache Storage）。
// app 整頁重繪會把影片從 DOM 拿掉（瀏覽器會自動暫停）：同一支 <video> 留在這裡，重繪後接回去、原本在播就接著播。
// 中文介面專用（新版課程只在中文介面），字直接寫中文。
(function () {
  "use strict";

  const STYLE = `
.cv2-video-box { position: relative; overflow: hidden; }
.cv2-video-poster { position: absolute; inset: 0; display: block; width: 100%; height: 100%; padding: 0; border: 0; background: none; cursor: pointer; }
.cv2-video-poster img, .cv2-video-box video { display: block; width: 100%; height: 100%; object-fit: cover; }
.cv2-video-play { position: absolute; left: 50%; top: 50%; display: grid; place-items: center; width: 64px; height: 64px; margin: -32px 0 0 -32px; border-radius: 50%; background: color-mix(in srgb, var(--ink) 72%, transparent); color: var(--paper); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25); }
.cv2-video-play svg { width: 26px; height: 26px; margin-left: 4px; }
.cv2-video-poster:hover .cv2-video-play, .cv2-video-poster:focus-visible .cv2-video-play { background: var(--ink); }
.cv2-video-time { position: absolute; right: 10px; bottom: 10px; padding: 2px 8px; border-radius: 999px; background: color-mix(in srgb, var(--ink) 70%, transparent); color: var(--paper); font-size: 0.78rem; font-weight: 700; font-variant-numeric: tabular-nums; }
.cv2-video.is-off .cv2-video-box { display: none; }
.cv2-video-off { margin: 0; color: var(--muted); font-size: 0.84rem; text-align: center; }
`;
  const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>';

  const players = new Map(); // 短名 → { video, interrupted }
  let watching = false;

  const theme = () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  const quality = () => ((window.innerWidth || document.documentElement.clientWidth) < 900 ? "720p" : "1080p");
  const posterUrl = (id) => `media/${id}-${theme()}-poster.jpg`;
  const videoUrl = (id) => `media/${id}-${theme()}-${quality()}.mp4`;
  const clock = (sec) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, "0")}`;

  function injectStyle() {
    if (document.getElementById("cv2-video-style")) return;
    const node = document.createElement("style");
    node.id = "cv2-video-style";
    node.textContent = STYLE;
    document.head.appendChild(node);
  }

  // 載不到（本機沒有 media/、離線、404）：框拿掉，說明那一行後面補一句
  function fail(figure) {
    if (figure.classList.contains("is-off")) return;
    figure.classList.add("is-off");
    const note = document.createElement("p");
    note.className = "cv2-video-off";
    note.textContent = "影片暫時載不到";
    figure.appendChild(note);
  }

  function showPoster(figure, id, duration, caption) {
    const box = figure.querySelector(".cv2-video-box");
    box.innerHTML = `<button type="button" class="cv2-video-poster" aria-label="播放影片：${caption.replace(/"/g, "&quot;")}（${duration} 秒）"><img alt="" loading="lazy" decoding="async"><span class="cv2-video-play">${PLAY}</span><span class="cv2-video-time">${clock(duration)}</span></button>`;
    const img = box.querySelector("img");
    img.addEventListener("error", () => fail(figure));
    img.src = posterUrl(id);
    box.querySelector("button").addEventListener("click", () => play(figure, id));
  }

  function makeVideo(id) {
    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.muted = true; // 影片本身無聲；靜音也讓 iOS 不擋播放
    video.preload = "none";
    video.setAttribute("playsinline", "");
    video.dataset.theme = theme();
    video.poster = posterUrl(id);
    video.src = videoUrl(id);
    const entry = { video, interrupted: false };
    // 重繪把它拿出 DOM 時瀏覽器會暫停：那不是使用者按的暫停，接回去要接著播
    video.addEventListener("pause", () => { entry.interrupted = !video.isConnected && !video.ended; });
    video.addEventListener("play", () => { entry.interrupted = false; });
    video.addEventListener("error", () => { const fig = video.closest("[data-cv2-video]"); if (fig) fail(fig); });
    players.set(id, entry);
    return entry;
  }

  function play(figure, id) {
    const entry = players.get(id) || makeVideo(id);
    const box = figure.querySelector(".cv2-video-box");
    box.innerHTML = "";
    box.appendChild(entry.video);
    const started = entry.video.play();
    if (started && typeof started.catch === "function") started.catch(() => {});
  }

  // 切主題：預覽圖換色；影片停著就換片源（接回原本的秒數），正在播就不打斷
  function retheme() {
    document.querySelectorAll("[data-cv2-video] .cv2-video-poster img").forEach((img) => {
      const id = img.closest("[data-cv2-video]").dataset.cv2Video;
      img.src = posterUrl(id);
    });
    players.forEach((entry, id) => {
      const v = entry.video;
      if (v.dataset.theme === theme()) return;
      v.poster = posterUrl(id);
      if (!v.paused && !v.ended) return;
      const at = v.currentTime || 0;
      v.dataset.theme = theme();
      v.src = videoUrl(id);
      if (at > 0) v.addEventListener("loadedmetadata", () => { v.currentTime = at; }, { once: true });
    });
  }

  function mount(root) {
    injectStyle();
    if (!watching && typeof MutationObserver === "function") {
      watching = true;
      new MutationObserver(retheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    }
    (root || document).querySelectorAll("[data-cv2-video]:not([data-mounted])").forEach((figure) => {
      figure.dataset.mounted = "1";
      const id = figure.dataset.cv2Video;
      const duration = Number(figure.dataset.duration) || 0;
      const caption = (figure.querySelector("figcaption") || {}).textContent || "";
      const entry = players.get(id);
      if (entry && (entry.video.currentTime > 0 || entry.interrupted)) {
        // 重繪前已經點開過：同一支影片接回去
        figure.querySelector(".cv2-video-box").appendChild(entry.video);
        if (entry.interrupted) { const p = entry.video.play(); if (p && p.catch) p.catch(() => {}); }
        return;
      }
      showPoster(figure, id, duration, caption);
    });
  }

  window.BuzzCourseVideo = { mount };
})();
