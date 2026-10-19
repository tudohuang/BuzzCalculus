// ── 分節模式的結算畫面（「你現在會：」、這一課的 XP、下一課、在地圖上看）──
// 從 course_sections.js 拆出來（data-lazy="secfinish"）：分節那一組的預算滿了，而結算一課只看一次 ——
// 讀到最後一節時 course_sections.js 先抓這一支，按「完成這一課」時通常已經到了。
(function () {
  "use strict";

  const STYLE = `
.cv2s-goals { display: grid; gap: 8px; margin: 0 0 18px; padding: 0; list-style: none; }
.cv2s-goals li { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 8px; line-height: 1.75; }
.cv2s-goals li > * { min-width: 0; overflow-wrap: anywhere; }
.cv2s-goals li > svg { width: 18px; height: 18px; margin-top: 5px; color: var(--green); }
.cv2s-goals .cv2s-bullet { width: 6px; height: 6px; margin: 12px 0 0 6px; border-radius: 50%; background: var(--muted); }
.cv2s-stats { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 16px; margin: 0 0 18px; color: var(--muted); font-size: 0.9rem; font-variant-numeric: tabular-nums; }
.cv2s-stats strong { color: var(--ink); font-size: 1.5rem; }
.cv2s-todo { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; margin: 0 0 16px; color: var(--muted); font-size: 0.9rem; }
.cv2s-finish .action-row { display: flex; flex-wrap: wrap; gap: 8px; }
.cv2s-tier { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; margin: 0 0 16px; font-variant-numeric: tabular-nums; }
.cv2s-tier b { font-size: 1.05rem; }
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
    // 章首魔王題（course_boss.js 畫）：離魔王題還差 n 課，或「現在解得開了」—— 那時主按鈕讓給解題，下一課降成次要
    const boss = api.boss ? api.boss.finish : null;
    // 自己算（course_solve.js）：這一課的自己算第一次就打對幾題
    const solved = window.BuzzCourseSolve ? window.BuzzCourseSolve.stat(data, e) : null;
    // 下一層還差什麼、按哪裡做：完成 → 重做小測；熟練 → 練還沒對的核心題；全破 → 練還沒對的（含挑戰）
    const g = api.progress ? api.progress(records) : null;
    const left = g && (g.tier === 1 ? g.mid : g.tier === 2 ? g.all : null);
    const tierRow = !g ? "" : g.tier === 0
      ? `<p class="cv2s-tier" data-cv2s-tier="1"><span>完成還差：小測首次就對 <b>${g.quiz}/${g.pass}</b></span><button type="button" class="button secondary" data-action="course-s-requiz">${icon("refresh")}${g.tried ? "重做小測" : "做小測"}</button></p>`
      : left && left.left.length
        ? `<p class="cv2s-tier" data-cv2s-tier="${g.tier + 1}"><span>${g.tier === 1 ? "熟練" : "全破"}還差：${g.tier === 1 ? g.midName : g.allName} <b>${left.ok}/${left.n}</b></span><button type="button" class="button secondary" data-action="course-lesson-practice" data-lesson-id="${escapeAttr(m.id)}" data-ids="${escapeAttr(left.left.join(" "))}">${icon("play")}練這 ${left.left.length} 題</button></p>`
        : g.tier === 3 ? `<p class="cv2s-tier" data-cv2s-tier="3"><b>✔ 全破</b>${g.none ? "<span>這一課沒有推薦題：小測完成就是全破</span>" : ""}</p>` : "";
    // 學習目標：節都做完才打勾（「你現在會」）；還有沒做的節就只列出來（中性的點，不放灰色的勾 —— 灰勾讀起來像「做過了」）。
    // XP 是 0（什麼都還沒做）就不印那一格
    const allDone = !todo.length;
    // 「你現在會」＋綠勾只在小測也過了（完成層）才給：節都讀完、小測全錯還打滿勾，跟下面「完成還差 0/3」互相矛盾
    const learned = allDone && !(g && g.tier === 0);
    const xp = Number(e.xp) || 0;
    return `
      <article class="cv2s-sec cv2s-finish" data-cv2s-finish>
        <h3><small>${n} / ${n}</small>${learned ? "你現在會：" : allDone ? "快會了，小測再對幾題：" : "這一課要學會："}</h3>
        <ul class="cv2s-goals ${learned ? "" : "is-plain"}">${data.objectives.map((line) => `<li class="${learned ? "" : "is-todo"}">${learned ? icon("check") : '<i class="cv2s-bullet" aria-hidden="true"></i>'}<span>${rich(line, data)}</span></li>`).join("")}</ul>
        ${todo.length ? `<p class="cv2s-todo"><span>還沒做完</span>${todo.map((i) => `<button type="button" class="cv2-link" data-action="course-s-go" data-to="${i}">第 ${i + 1} 節</button>`).join("")}</p>` : ""}
        <p class="cv2s-stats" data-cv2s-stats>
          ${xp ? `<span><strong>+${xp}</strong> XP</span>` : ""}
          ${level ? `<span>Lv.${level.level} · ${level.into}/${level.span}</span>` : ""}
          ${streak ? `<span>${icon("flame")}連勝 ${streak} 天</span>` : ""}
          ${solved ? `<span data-cs-stat>自己算：首次答對 ${solved.first} / ${solved.total}</span>` : ""}
          ${Array.isArray(e.rvItems) && e.rvItems.length && !e.rvLast && e.rvAt && new Date(e.rvAt).toDateString() === new Date().toDateString() ? `<span data-cs-tomorrow>明天回溫 ${e.rvItems.length} 題</span>` : ""}
        </p>
        ${tierRow}
        ${boss ? boss.html : ""}
        <div class="action-row">
          ${api.next ? `<button type="button" class="button ${boss && boss.pay ? "secondary" : "home-primary"}" data-action="open-course-lesson" data-lesson-id="${escapeAttr(api.next.id)}">下一課：${escapeHtml(api.label(api.next))}${icon("chevron-right")}</button>` : `<button type="button" class="button home-primary" data-action="open-course">課程表</button>`}
          <button type="button" class="button secondary" data-action="course-map-focus" data-lesson-id="${escapeAttr(m.id)}" data-lit="1">在地圖上看</button>
          ${practice && !(left && left.left.length) ? `<button type="button" class="button ghost" data-action="course-practice" data-set="main">${icon("play")}練推薦題 · ${practice} 題</button>` : ""}
        </div>
      </article>`;
  }

  window.BuzzCourseFinish = { view: finishView };
})();
