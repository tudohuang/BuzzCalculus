// ── 分節模式的結算畫面（「你現在會：」、這一課的 XP、下一課、在地圖上看）──
// 從 course_sections.js 拆出來（data-lazy="secfinish"）：分節那一組的預算滿了，而結算一課只看一次 ——
// 讀到最後一節時 course_sections.js 先抓這一支，按「完成這一課」時通常已經到了。
(function () {
  "use strict";

  const STYLE = `
.cv2s-goals { display: grid; gap: 8px; margin: 0 0 18px; padding: 0; list-style: none; }
.cv2s-goals li { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; line-height: 1.75; }
.cv2s-goals li > * { min-width: 0; overflow-wrap: anywhere; }
.cv2s-goals svg { width: 18px; height: 18px; margin-top: 5px; color: var(--green); }
.cv2s-goals li.is-todo svg { color: var(--line-strong); }
.cv2s-stats { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 16px; margin: 0 0 18px; color: var(--muted); font-size: 0.9rem; font-variant-numeric: tabular-nums; }
.cv2s-stats strong { color: var(--ink); font-size: 1.5rem; }
.cv2s-todo { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; margin: 0 0 16px; color: var(--muted); font-size: 0.9rem; }
.cv2s-finish .action-row { display: flex; flex-wrap: wrap; gap: 8px; }
.cv2s-finish .action-row .button { max-width: 100%; }
`;

  function injectStyle() {
    if (typeof document === "undefined" || !document.head || document.getElementById("cv2f-style")) return;
    const node = document.createElement("style");
    node.id = "cv2f-style";
    node.textContent = STYLE;
    document.head.appendChild(node);
  }

  function finishView(api, e) {
    injectStyle();
    const { m, data, records, rich, deps } = api;
    const { escapeAttr, escapeHtml, icon } = deps;
    const n = data.sections.length;
    const doneSet = new Set(e.secDone || []);
    const todo = data.sections.map((_s, i) => i).filter((i) => !doneSet.has(i));
    const level = deps.xpLevel ? deps.xpLevel(records.xp) : null;
    const quiet = deps.focusModeOn ? deps.focusModeOn() : false;
    const streak = !quiet && deps.streakDays ? deps.streakDays(records) : 0;
    const bank = new Set((window.BUZZ_PROBLEMS || []).map((p) => p.id));
    const practice = (data.practice || []).filter((p) => !p.challenge && bank.has(p.id)).length;
    return `
      <article class="cv2s-sec cv2s-finish" data-cv2s-finish>
        <h3><small>${n} / ${n}</small>你現在會：</h3>
        <ul class="cv2s-goals">${data.objectives.map((line) => `<li class="${todo.length ? "is-todo" : ""}">${icon("check")}<span>${rich(line, data)}</span></li>`).join("")}</ul>
        ${todo.length ? `<p class="cv2s-todo"><span>還沒做完</span>${todo.map((i) => `<button type="button" class="cv2-link" data-action="course-s-go" data-to="${i}">第 ${i + 1} 節</button>`).join("")}</p>` : ""}
        <p class="cv2s-stats" data-cv2s-stats>
          <span><strong>+${Number(e.xp) || 0}</strong> XP</span>
          ${level ? `<span>Lv.${level.level} · ${level.into}/${level.span}</span>` : ""}
          ${streak ? `<span>${icon("flame")}連勝 ${streak} 天</span>` : ""}
        </p>
        <div class="action-row">
          ${api.next ? `<button type="button" class="button home-primary" data-action="open-course-lesson" data-lesson-id="${escapeAttr(api.next.id)}">下一課：${escapeHtml(api.label(api.next))}${icon("chevron-right")}</button>` : `<button type="button" class="button home-primary" data-action="open-course">課程表</button>`}
          <button type="button" class="button secondary" data-action="course-map-focus" data-lesson-id="${escapeAttr(m.id)}" data-lit="1">在地圖上看</button>
          ${practice ? `<button type="button" class="button ghost" data-action="course-practice" data-set="main">${icon("play")}練推薦題 · ${practice} 題</button>` : ""}
        </div>
      </article>`;
  }

  window.BuzzCourseFinish = { view: finishView };
})();
