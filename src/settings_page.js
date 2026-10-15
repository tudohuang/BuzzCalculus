// 設定頁（view = "settings"）的畫面：從 app.js 搬出來的 render（2026-10-15，app.js 撞到 736KB 上限 —— 照預算的規則搬整頁 render，不調數字）。
// 延後載入（data-lazy="settings"）：第一次打開設定頁才抓。按鈕的 data-action 仍由 app.js 的事件處理接；這裡只產生 HTML。
(function () {
  "use strict";
  function create(deps) {
    const { t, escapeHtml, escapeAttr, icon, loadRecords, analyticsEnabled, boardSurface, dailyGoal, focusModeOn, lessonsDone, soundEnabled, tagLabel, weeklyMissionInfo, BuzzSync, syncState, APP_VERSION, BUILD_DATE, HISTORY_LIMIT, LANG_OPTIONS, PEN_SCALES } = deps;

    function renderDataManagementCard(records) {
      return `
        <section class="study-card data-card">
          <div class="panel-title-row">
            <div>
              <p class="section-label">${t("本機紀錄")}</p>
              <h3>${t("備份、搬家、清除")}</h3>
            </div>
          </div>
          <!-- 這三個數字原本叫「作答歷史 / 錯題 / 練習局」，而前後兩個
               在使用者眼裡是同一件事，數字卻不一樣（一個是累計，一個只留最近 40 局）。
               看到兩個矛盾的數字之後，人會開始懷疑畫面上所有的數字。 -->
          <div class="mini-stats">
            <div><span>${t("練過幾局")}</span><strong>${(records.attempts || 0) + (records.practiceRuns || 0)}</strong></div>
            <div><span>${t("錯題本")}</span><strong>${Object.keys(records.mistakes || {}).length}</strong></div>
            <div><span>${t("課程完成")}</span><strong>${lessonsDone(records)}</strong></div>
            <div title="${t("逐題明細只保留最近 {HISTORY_LIMIT} 局；更早的局數仍然算在「練過幾局」裡", { HISTORY_LIMIT })}"><span>${t("保留明細")}</span><strong>${(records.history || []).length}<small> / ${HISTORY_LIMIT}</small></strong></div>
          </div>
          <p class="panel-note">${t("匯入是")}<strong>${t("合併")}</strong>${t("不是覆蓋 —— 兩台裝置各自練過的都會留下來。")}</p>
          <div class="stack-actions home-record-actions">
            <button class="button secondary" data-action="open-history">${icon("clock")}${t("作答歷史")}</button>
            <button class="button ghost" data-action="export-records">${icon("download")}${t("匯出 JSON")}</button>
            <label class="button ghost import-label" for="import-records">${icon("upload")}${t("匯入 JSON")}</label>
            <button class="button ghost" data-action="reset-records">${icon("trash")}${t("清除資料")}</button>
            <input class="sr-only" id="import-records" type="file" accept="application/json" />
          </div>
        </section>
      `;
    }

    // 設定頁的骨架：分節（練習／介面／資料／隱私／說明），每節下面排卡片。
    // 之前是「左欄一條 2000px、右欄兩張卡就斷掉」的兩欄格線，
    // 介面與隱私開關全埋在一張叫「資料管理」的巨卡裡 —— 沒有人會去那裡找音效開關。
    function settingsSection(title, cards) {
      if (!cards || !String(cards).trim()) return "";
      return `
        <section class="settings-section" id="settings-${{ "練習": "practice", "介面": "interface", "資料": "data", "隱私": "privacy", "說明": "help" }[title] || "other"}" tabindex="-1">
          <h3 class="settings-section-title">${escapeHtml(t(title))}</h3>
          <div class="settings-cards">${cards}</div>
        </section>
      `;
    }

    // 統一的設定列：左邊「這是什麼」，右邊「怎麼改」。
    // 開關一律用 開／關 兩段式 —— 按鈕寫狀態還是寫動作的老問題直接消失，
    // 亮的那顆就是現況，按另一顆就是改變。
    function renderSettingRow(title, desc, controlHtml) {
      return `
        <div class="setting-row">
          <div class="setting-copy">
            <strong>${title}</strong>
            <p>${desc}</p>
          </div>
          <div class="setting-control">${controlHtml}</div>
        </div>
      `;
    }

    function onOffControl(action, on, ariaLabel) {
      return `
        <div class="segmented compact" role="radiogroup" aria-label="${escapeAttr(ariaLabel)}">
          <button class="tag-button ${on ? "is-active" : ""}" aria-pressed="${on ? "true" : "false"}" data-action="${escapeAttr(action)}" data-on="1">${t("開")}</button>
          <button class="tag-button ${on ? "" : "is-active"}" aria-pressed="${on ? "false" : "true"}" data-action="${escapeAttr(action)}" data-on="">${t("關")}</button>
        </div>
      `;
    }

    // 多選一的一排（亮的那顆是現況）：items = [[值, 字], …]，按鈕帶 data-<key>="值"
    function pickControl(action, key, current, items, label, cls = "") {
      return `<div class="segmented compact${cls}" role="radiogroup" aria-label="${label}">${items.map(([v, text]) => `<button class="tag-button ${current === v ? "is-active" : ""}" aria-pressed="${current === v}" data-action="${action}" data-${key}="${v}">${text}</button>`).join("")}</div>`;
    }

    function renderInterfaceSettingsCard(records) {
      const settings = records.settings || {};
      const langSetting = LANG_OPTIONS.some((item) => item.key === settings.lang) ? settings.lang : "auto";
      return `
        <section class="study-card interface-card">
          ${renderSettingRow(
            t("介面語言"),
            t("沒設定就跟著瀏覽器。紀錄、錯題本與連結兩種語言共用，換語言會重新載入頁面。"),
            pickControl("set-lang", "lang", langSetting, LANG_OPTIONS.map((item) => [item.key, item.label]), t("介面語言"), " lang-row")
          )}
          ${renderSettingRow(
            t("顯示全部功能"),
            t("預設是跟著練習慢慢出現：練完一局才有弱點與模擬考，三局之後才有每日一題、證明訓練、對戰與出題。想一次看到全部就打開。"),
            onOffControl("set-show-all-features", settings.showAllFeatures === true, t("顯示全部功能"))
          )}
          ${renderSettingRow(
            t("專注模式"),
            t("收起連勝、盾牌與成就，只留練習本身。連勝照算，只是不顯示。"),
            onOffControl("set-focus-mode", focusModeOn(), t("專注模式"))
          )}
          ${renderSettingRow(
            t("答題音效"),
            t("答對上行兩聲、答錯低一聲，跳過不出聲。圖書館練習就關掉。"),
            onOffControl("set-sound", soundEnabled(), t("答題音效"))
          )}
          ${window.BUZZ_COURSE_V2?.narrationM ? renderSettingRow(
            t("旁白聲音"),
            t("課程分節模式的旁白。旁白列上也能切。"),
            pickControl("set-narr-voice", "voice", settings.narrVoice === "m" ? "m" : "f", [["f", t("女聲")], ["m", t("男聲")]], t("旁白聲音"))
          ) : ""}
          ${renderSettingRow(
            t("計算紙筆寬"),
            t("用 Apple Pencil 覺得線太粗或太細，在這裡調。橡皮擦不受影響。"),
            pickControl("set-pen-scale", "scale", settings.penScale || "standard", PEN_SCALES.map((item) => [item.key, item.label]), t("筆寬"), " pen-scale-row")
          )}
          ${renderSettingRow(
            t("計算紙紙面"),
            t("白紙配深色筆跡，黑板反過來。計算紙的工具列上也能隨手切。"),
            pickControl("set-board-surface", "surface", boardSurface(), [["paper", t("白紙")], ["board", t("黑板")]], t("紙面"))
          )}
        </section>
      `;
    }

    function renderPrivacyCard() {
      return `
        <section class="study-card privacy-card">
          ${renderSettingRow(
            t("使用分析"),
            t("只送「哪個功能被用了幾次」這種計數。<strong>不會</strong>送你的作答內容、答案或題目。"),
            onOffControl("set-analytics", analyticsEnabled(), t("使用分析"))
          )}
        </section>
      `;
    }

    function renderGuideCard() {
      return `
        <section class="study-card guide-card">
          <div class="panel-title-row">
            <div>
              <p class="section-label">${t("使用手冊")}</p>
              <h3>${t("十分鐘搞懂全部功能")}</h3>
            </div>
          </div>
          <div class="action-row">
            <a class="button secondary" href="guide.html" target="_blank" rel="noopener">${icon("book")}${t("打開使用手冊")}</a>
            <button class="button ghost" data-action="replay-tour">${icon("sparkles")}${t("再看一次導覽")}</button>
          </div>
        </section>
      `;
    }

    function renderAboutLinksCard() {
      return `
        <section class="study-card about-links-card">
          <div class="panel-title-row">
            <div>
              <p class="section-label">${t("關於")}</p>
              <h3>BuzzCalculus</h3>
            </div>
          </div>
          ${window.BuzzAppUpdate ? window.BuzzAppUpdate.panel() : `<p class="app-version">${t("版本")} ${APP_VERSION} · ${BUILD_DATE}</p>`}
          ${
            // 2026-09-16 使用者：更新紀錄／隱私政策／服務條款／給家教助教的文件先關掉。
            // 隱私與條款的檔案留著（放 GA 得有政策頁可指），只是產品裡不再連；更新紀錄與家教文件連部署都拿掉。
            ""
          }
          <p class="privacy-links">
            <a href="about.html" target="_blank" rel="noopener">${t("關於")}</a>
          </p>
        </section>
      `;
    }

    // 校準包的說明必須寫在按鈕旁邊，而不是藏在條款裡。
    // 使用者要能在按下去之前就知道「這份檔案裡有什麼、沒有什麼」。
    function renderCalibrationCard(records) {
      const answered = Object.keys(records.problemStats || {}).length;
      if (answered < 20) return "";
      return `
        <section class="study-card calibration-card">
          <div class="panel-title-row">
            <div>
              <p class="section-label">${t("幫忙校準難度（選填）")}</p>
              <h3>${t("匯出一份作答統計")}</h3>
            </div>
          </div>
          <p class="panel-note calibration-contents">
            ${t("檔案裡只有")} <strong>${t("題號、難度、對錯次數、中位秒數")}</strong>${t("， 以及你的整體程度分層（高／中／低）。")}
            <strong>${t("沒有")}</strong>${t("題目內容、作答內容、時間戳記，也沒有任何可以認出你的東西。 自訂題一律不匯出。")}
          </p>
          <div class="action-row">
            <button class="button ghost" data-action="preview-calibration">${icon("eye")}${t("先看內容")}</button>
            <button class="button ghost" data-action="export-calibration">${icon("download")}${t("匯出校準包（{answered} 題）", { answered })}</button>
          </div>
        </section>
      `;
    }

    function renderGoalCard(records) {
      const week = weeklyMissionInfo(records);
      const goal = dailyGoal(records);
      return `
        <section class="study-card">
          <div class="panel-title-row">
            <div>
              <p class="section-label">${t("目標")}</p>
              <h3>${t("每日 {goal} 題", { goal })}</h3>
            </div>
            <span class="study-count">${week.completed}/${week.target}</span>
          </div>
          <div class="goal-options">
            ${[5, 10, 12, 20].map((value) => `<button class="tag-button ${goal === value ? "is-active" : ""}" data-action="set-daily-goal" data-goal="${value}">${t("{value} 題", { value })}</button>`).join("")}
          </div>
          <div class="meter-track"><div class="meter-fill" style="width:${week.progress}%"></div></div>
          <p class="panel-note">${t("本週已完成 {completed} 題，{daysDone} 天有練。", { completed: week.completed, daysDone: week.daysDone })}</p>
        </section>
      `;
    }

    function renderSettings() {
      const records = loadRecords();
      return `
        <main class="screen">
          <section class="panel page-panel settings-page">
            <div class="page-head">
              <div>
                <p class="section-label">${t("PREFERENCES / 偏好與設定")}</p>
                <h2>${t("打造適合你的練習環境。")}</h2>
              </div>
              <button class="button secondary" data-action="home">${icon("home")}${t("回首頁")}</button>
            </div>
            <nav class="settings-jump" aria-label="${t("設定分類")}"><a href="#settings-practice">${t("練習")}</a><a href="#settings-interface">${t("介面")}</a><a href="#settings-data">${t("資料")}</a><a href="#settings-privacy">${t("隱私")}</a><a href="#settings-help">${t("說明")}</a></nav>
            ${settingsSection(/* zh-key */ "練習",renderGoalCard(records) + renderPlacementSettingsCard(records) + renderExamCountdownSettingsCard(records))}
            ${settingsSection(/* zh-key */ "介面",renderInterfaceSettingsCard(records))}
            ${settingsSection(/* zh-key */ "資料",renderDataManagementCard(records) + renderSyncSettingsCard() + renderCalibrationCard(records))}
            ${settingsSection(/* zh-key */ "隱私",renderPrivacyCard())}
            ${settingsSection(/* zh-key */ "說明",renderGuideCard() + renderIosInstallCard() + renderAboutLinksCard())}
          </section>
        </main>
      `;
    }

    function renderExamCountdownSettingsCard(records) {
      const plan = records.plan;
      const dateValue = plan && plan.examAt ? String(plan.examAt).slice(0, 10) : "";
      return `
        <section class="study-card exam-countdown-settings">
          <div class="panel-title-row">
            <div>
              <p class="section-label">${t("考前衝刺")}</p>
              <h3>${plan && plan.examAt ? `${escapeHtml(plan.label || t("考試"))} · ${dateValue}` : t("設一個考試日期")}</h3>
            </div>
          </div>
          <div class="exam-plan-form">
            <label>${t("名稱")} <input id="exam-plan-label" type="text" maxlength="12" value="${escapeAttr(plan ? plan.label || "" : "")}" placeholder="${t("期中考")}"></label>
            <label>${t("日期")} <input id="exam-plan-date" type="date" value="${escapeAttr(dateValue)}"></label>
            <label>${t("每天")}
              <select id="exam-plan-minutes">
                ${[15, 30, 45].map((value) => `<option value="${value}" ${plan && Number(plan.dailyMinutes) === value ? "selected" : ""}>${t("{value} 分鐘", { value })}</option>`).join("")}
              </select>
            </label>
            <label>${t("目標精熟")}
              <select id="exam-plan-target">
                ${[60, 70, 85].map((value) => `<option value="${value}" ${plan && Number(plan.target) === value ? "selected" : ""}>${value}</option>`).join("")}
              </select>
            </label>
          </div>
          <div class="action-row">
            <button class="button" data-action="exam-countdown-set">${icon("flag")}${plan && plan.examAt ? t("更新倒數") : t("開始倒數")}</button>
            ${plan && plan.examAt ? `<button class="button ghost" data-action="exam-countdown-clear">${t("清除（封存到歷史）")}</button>` : ""}
          </div>
        </section>
      `;
    }

    function renderPlacementSettingsCard(records) {
      const placement = records.placement;
      const summary = placement
        ? `${t("目前定位 R{rank}", { rank: placement.rank })}${placement.weakTag ? ` ${t("· 最不穩：{weakTag}", { weakTag: tagLabel(placement.weakTag) })}` : ""}`
        : t("還沒做過定位測驗");
      const note = placement
        ? `${t("上次定位：{v}。重新定位會覆蓋結果，並依表現重新解鎖主線。", { v: String(placement.date || "").slice(0, 10) || "—" })}`
        : t("8 題調適測驗，約 5 分鐘。做完會依表現解鎖主線起點。");
      return `
        <section class="study-card placement-card">
          <div class="panel-title-row">
            <div>
              <p class="section-label">${t("定位")}</p>
              <h3>${escapeHtml(summary)}</h3>
            </div>
          </div>
          <p class="panel-note">${escapeHtml(note)}</p>
          <div class="action-row">
            <button class="button secondary" data-action="start-placement">${icon("target")}${placement ? t("重新定位") : t("開始定位測驗")}</button>
          </div>
        </section>
      `;
    }

    // iOS 裝機指引。Safari 沒有 beforeinstallprompt，「安裝」這件事
    // 只能用文字教 —— 而 iPad 正是這個產品的主力裝置。
    // 只在 iOS、瀏覽器分頁（非 standalone）時出現；裝好之後這張卡自己消失。
    function renderIosInstallCard() {
      const ua = navigator.userAgent || "";
      const isIos = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
      const standalone = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
      if (!isIos || standalone || window.navigator.standalone) return "";
      return `
        <section class="study-card">
          <div class="panel-title-row">
            <div>
              <p class="section-label">${t("裝到主畫面")}</p>
              <h3>${t("像 App 一樣開，離線也能練")}</h3>
            </div>
          </div>
          <p class="panel-note">
            ${t("Safari 分享鈕")} ${icon("share-2")} ${t("→ 「加入主畫面」。 之後從主畫面開啟：全螢幕、沒有網址列、沒訊號照樣出題。")}
          </p>
        </section>
      `;
    }

    function renderSyncSettingsCard() {
      const status = BuzzSync.status();
      // 沒設同步端點就不出卡：換裝置的流程（匯出→匯入合併）已經寫在
      // 「本機紀錄」卡上，再放一張「雲端同步還沒有」的卡只是把沒做的
      // 功能掛在牆上。自架者設了 BUZZ_SYNC_ENDPOINT 才會看到下面那張。
      if (!status.configured) return "";
      // 同步中／上一次的訊息是 app.js 的可變狀態：每次 render 現讀
      const { busy: syncBusy, message: syncMessage } = syncState();
      const lastLine = status.lastSyncAt
        ? `${t("上次同步：{v}", { v: String(status.lastSyncAt).slice(0, 16).replace("T", " ") })}`
        : t("尚未同步過");
      return `
        <section class="study-card sync-card">
          <div class="panel-title-row">
            <div>
              <p class="section-label">${t("雲端同步")}</p>
              <h3>${t("已連接同步端點")}</h3>
            </div>
            <span class="sync-chip is-on">${t("已設定")}</span>
          </div>
          <p class="panel-note">${t("{lastLine}。衝突時以最新的一份為準。", { lastLine: escapeHtml(lastLine) })}</p>
          ${syncMessage ? `<p class="panel-note sync-message">${escapeHtml(syncMessage)}</p>` : ""}
          <div class="action-row">
            <button class="button secondary" data-action="sync-now" ${syncBusy ? "disabled" : ""}>${icon("refresh")}${t("手動同步")}</button>
          </div>
        </section>
      `;
    }

    return { renderSettings };
  }
  window.BuzzSettingsPage = { create };
})();
