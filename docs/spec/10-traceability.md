# 10 — 需求追溯表（200 條）

每一條需求都對應到規格章節與期別。**沒有一條被丟掉**，但有幾條被明確改寫或降級，
理由寫在最後一節。

期別代號：`P0` 固化 / `P1` 收納 / `P2` 診斷 / `P3` 內容 / `P4` 帳號 / `P5` 社群 / `P6` 平台 /
`✓` 現況已具備 / `∞` 持續性原則（不是可勾選的工作）

---

## A. 願景（1–50）

| # | 需求 | 期 | 規格 |
| --: | --- | --- | --- |
| 1 | STEM 健身房，不是線上課程 | ∞ | [00 定位](00-north-star.md#一句話定位) |
| 2 | 學過→大量練→錯誤診斷→反射 | ∞ | [00 核心迴圈](00-north-star.md#核心迴圈) |
| 3 | BuzzCalculus 成為成熟旗艦 | P1–P4 | [09 分期](09-roadmap.md#分期總覽) |
| 4 | BuzzPhysics 成為第二旗艦 | P6 | [08.1](08-platform.md#81-從-app-到-engine) |
| 5 | 一個帳號管所有科目 | P4→P6 | [06.2 階段 C](06-identity-sync-legal.md#階段-c跨科目帳號p6) |
| 6 | 一個 Pro 解鎖所有科目 | P6 | [08.6](08-platform.md#86-商業模式) |
| 7 | 每天打開就知道練什麼 | P1–P2 | [04.3 首頁](04-experience-ia.md#43-首頁重構) |
| 8 | 15 分鐘也能有效訓練 | P2 | [04.4 daily15](04-experience-ia.md#三種長度) |
| 9 | 1 小時高強度訓練 | P2 | [04.4 deep45](04-experience-ia.md#三種長度) |
| 10 | 每人一份能力雷達 | ✓→P2 | [03.10 axes](03-ability-model.md#310-buzzability-api) |
| 11 | 完整 skill profile 而非正確率 | P2 | [03.3](03-ability-model.md#33-精熟度-mastery) |
| 12 | 不限時 / 壓力下能力分開 | P2 | [03.4](03-ability-model.md#34-pressure-accuracy-vs-untimed-accuracy) |
| 13 | Pressure Accuracy 指標 | P2 | [03.4](03-ability-model.md#34-pressure-accuracy-vs-untimed-accuracy) |
| 14 | Speed × Accuracy 二維圖 | P2 | [03.5](03-ability-model.md#35-speed--accuracy-二維圖) |
| 15 | 分辨「不會」vs「來不及」 | P2 | [03.5 timeoutRate](03-ability-model.md#不會還是來不及) |
| 16 | 每個技巧有熟練度 | P2 | [03.3](03-ability-model.md#33-精熟度-mastery) |
| 17 | 熟練度衰退 + 間隔複習 | ✓→P2 | [03.3 衰退](03-ability-model.md#衰退)、既有 SRS |
| 18 | 每個錯誤轉成訓練任務 | P2 | [04.4 配方 weak slot](04-experience-ia.md#配方--抽題) |
| 19 | 錯題本 = 救援系統 | ∞ | [00 P3 原則](00-north-star.md#p3-錯題是救援系統不是倉庫) |
| 20 | 題庫是知識圖譜非章節 | P2 | [03.2 skill graph](03-ability-model.md#32-skill-graph) |
| 21 | R1–R6 成為難度品牌 | P3 | [05.1 rubric](05-content-pipeline.md#51-難度-r1r6-正式-rubric) |
| 22 | Boss / Boss+ 是 endgame | ✓ | 既有 `boss-rank` / `boss-plus` |
| 23 | 使用者會說「這題 Buzz R5」 | ∞ | [00 P1 原則](00-north-star.md#p1-難度語言是自有品牌) |
| 24 | 不靠名校建立權威 | P3 | [05.4 名校淡出](05-content-pipeline.md#公開-ui-的名校淡出) |
| 25 | 自有 difficulty language > 來源 | ∞ | 同上 |
| 26 | 新生第一次就被定位 | P1 | [04.5 onboarding](04-experience-ia.md#45-開局onboarding) |
| 27 | 自動生成個人練習路線 | P2 | [04.4 planner](04-experience-ia.md#44-session-引擎) |
| 28 | 可設定「30 天後期中考」 | P2 | [04.6](04-experience-ia.md#46-考試倒推) |
| 29 | 自動倒推每天練多少 | P2 | [04.6 倒推演算法](04-experience-ia.md#倒推演算法) |
| 30 | 考前自動切衝刺模式 | P2 | [04.6 衝刺模式](04-experience-ia.md#衝刺模式t-7-自動切換) |
| 31 | 考完自動生成報告 | P2 | [04.6 考後報告](04-experience-ia.md#考後報告) |
| 32 | 成長曲線本身是價值 | P2 | [03.9](03-ability-model.md#39-成長曲線) |
| 33 | 「兩週前 57% → 今天 78%」 | P2 | [03.9](03-ability-model.md#39-成長曲線) |
| 34 | 讓學生感覺變強 | P2 | [04.3 一行成長證據](04-experience-ia.md#43-首頁重構) |
| 35 | 成為微積分刷題自然選擇 | P1–P4 | [09 指標 D7](09-roadmap.md#指標) |
| 36 | 擴到高中數學 / 線代 / 統計 | P6 | [08.1](08-platform.md#81-從-app-到-engine) |
| 37 | 擴到微分方程 | P6 | 同上 |
| 38 | 擴到離散數學 | P6 | 同上 |
| 39 | 擴到機率 | P6 | 同上 |
| 40 | Buzz = 訓練引擎 | P6 | [08.1](08-platform.md#81-從-app-到-engine) |
| 41 | 老師拿 Buzz 當作業系統 | P5 | [07.2](07-community-classroom.md#72-班級與教師) |
| 42 | 助教快速生成練習包 | P5 | [07.2 packRef](07-community-classroom.md#模型) |
| 43 | 學生分享自己的題包 | ✓→P1 | [07.5](07-community-classroom.md#75-題包分享可以現在就做) |
| 44 | 高品質投稿者成 curator | P5 | [07.1 curator](07-community-classroom.md#curator-制度) |
| 45 | 難度由真實作答校準 | P3→P4 | [05.2](05-content-pipeline.md#52-實證校準) |
| 46 | 題庫越用越準 | P4 | 同上 |
| 47 | 年度 Boss Season | P5 | [07.4](07-community-classroom.md#74-boss-與賽季) |
| 48 | 跨校學生挑戰同一套題 | P5 | [07.4 每週 Boss](07-community-classroom.md#74-boss-與賽季) |
| 49 | 有自己文化的訓練社群 | P5 | [07](07-community-classroom.md) 全章 |
| 50 | 「刷到反射」品牌定位 | ∞ | [00](00-north-star.md#一句話定位) |

---

## B. 必須做／必須改（51–100）

| # | 需求 | 期 | 規格 |
| --: | --- | --- | --- |
| 51 | 停止增加新玩法 | P1 | [04.1 診斷](04-experience-ia.md#41-診斷現在的問題是太多)、[09 P1](09-roadmap.md#p1--收納與止血34-週) |
| 52 | 收納過多練習模式 | P1 | [04.2 四分類](04-experience-ia.md#42-模式分類法) |
| 53 | 首頁只留極少數入口 | P1 | [04.3](04-experience-ia.md#43-首頁重構) |
| 54 | 主 CTA 永遠是「開始今天的訓練」 | P1 | [04.3 規則 1](04-experience-ia.md#目標形狀) |
| 55 | 新使用者必須有 onboarding | P1 | [04.5](04-experience-ia.md#45-開局onboarding) |
| 56 | 第一次先做短診斷 | P1 | [04.5 步驟 3](04-experience-ia.md#新流程首次進站不需要帳號) |
| 57 | 診斷完直接推薦第一個訓練 | P1 | [04.5 步驟 5](04-experience-ia.md#新流程首次進站不需要帳號) |
| 58 | 不要一進來就面對 1400+ 題 | P1 | [04.5 硬規則](04-experience-ia.md#新流程首次進站不需要帳號) |
| 59 | 正式帳號系統 | P4 | [06.2 階段 B](06-identity-sync-legal.md#階段-b帳號與真同步p4) |
| 60 | 跨裝置同步 | P4 | [06.3 merge](06-identity-sync-legal.md#63-同步衝突lww-不夠要-per-key-merge) |
| 61 | 紀錄不因清除瀏覽器消失 | P1→P4 | [06.2 階段 A](06-identity-sync-legal.md#階段-a不上雲先止血p1一週內可做完) |
| 62 | 自動備份 | P1 | 同上（本機）→ P4（雲端） |
| 63 | 題目永久 ID | P3 | [02.2 uid](02-data-model.md#為什麼要-uid-而不是沿用-id) |
| 64 | 公開 UI 不突出內部題號 | P3 | [02.2 題號政策](02-data-model.md#公開-ui-的題號政策) |
| 65 | 每題有來源／原創 metadata | P3 | [05.4](05-content-pipeline.md#54-來源與原創聲明) |
| 66 | 原創 / 改編 / 靈感可區分 | P3 | [05.4 origin.kind 表](05-content-pipeline.md#規則) |
| 67 | 名校 tag 從核心 UI 淡出 | P3 | [05.4 淡出](05-content-pipeline.md#公開-ui-的名校淡出) |
| 68 | 類題不得被誤認官方題 | P3 | [05.4 硬規則](05-content-pipeline.md#規則) |
| 69 | 題目內容審核流程 | P3→P5 | [05.7](05-content-pipeline.md#57-內容審核流程) |
| 70 | 答案驗證流程 | P3 | [05.3](05-content-pipeline.md#53-答案驗證) |
| 71 | 解析驗證流程 | P3 | [05.8](05-content-pipeline.md#58-解析驗證) |
| 72 | 疑似重複題偵測 | P3 | [05.5](05-content-pipeline.md#55-重複偵測) |
| 73 | LaTeX render 可靠 | P1+P3 | [01.7 vendor](01-architecture.md#17-cdn-依賴)、[05.8](05-content-pipeline.md#58-解析驗證) |
| 74 | 數值答案判定可靠 | P3 | [08.3 判分器強化](08-platform.md#判分器要強化的實際問題不需要-cas) |
| 75 | 等價表達式判定可靠 | P3 | 同上（`domain` 取樣、complex/set/interval） |
| 76 | WebWork 輸入體驗夠順 | P1 | [04.8 輸入與無障礙](04-experience-ia.md#輸入與無障礙) |
| 77 | 錯誤回報要容易 | P2→P4 | [05.7 回報](05-content-pipeline.md#回報與自動暫停) |
| 78 | 大量回報自動暫停 | P4 | 同上 |
| 79 | 錯題排程有明確規則 | P2 | [03.3 掌握門檻](03-ability-model.md#掌握門檻與狀態)、既有 SRS |
| 80 | 熟練度計算看得懂 | P2 | [03.3 先驗](03-ability-model.md#帶先驗的精熟度)、`conf < 0.4` 顯示「未測」 |
| 81 | R1–R6 正式 rubric | P3 | [05.1](05-content-pipeline.md#51-難度-r1r6-正式-rubric) |
| 82 | 不單靠作者直覺 | P3 | [05.1 三軸](05-content-pipeline.md#rubric三軸打分) |
| 83 | 真實資料反向校正難度 | P3→P4 | [05.2](05-content-pipeline.md#52-實證校準) |
| 84 | 計時規則寫清楚 | P1 | [04.2 bucket 表](04-experience-ia.md#42-模式分類法)、[03.4 Timed 分流](03-ability-model.md#分流定義) |
| 85 | 高壓規則只在考試模式 | P1 | [00 P4 原則](00-north-star.md#p4-焦慮只准存在於考試模式)、[04.2](04-experience-ia.md#42-模式分類法) |
| 86 | 日常模式不製造焦慮 | P1 | 同上 |
| 87 | 答題狀態 autosave | P1 | [04.8 自動存檔](04-experience-ia.md#自動存檔) |
| 88 | 關掉瀏覽器能繼續 | P1 | 同上 |
| 89 | 模擬考刷新不整份消失 | P1 | 同上（**P1 最高優先單項**） |
| 90 | 手機版可用 | ✓→P1 | [04.8 手機](04-experience-ia.md#輸入與無障礙) |
| 91 | iPad 特別優化 | P1→P3 | [04.8 iPad](04-experience-ia.md#輸入與無障礙) |
| 92 | 鍵盤操作完整 | P1 | [04.8 鍵盤](04-experience-ia.md#輸入與無障礙) |
| 93 | 數學輸入不只靠滑鼠 | P1 | 同上 |
| 94 | 無障礙 focus state | P1 | 同上 |
| 95 | 載入時間壓下來 | P1 | [06.6 效能預算](06-identity-sync-legal.md#66-效能預算) |
| 96 | 題庫搜尋不卡 | P1 | [01.6 render 切分](01-architecture.md#16-render-效能) |
| 97 | 正式 analytics event | P1 | [06.5 事件表](06-identity-sync-legal.md#65-分析事件) |
| 98 | 追蹤開始/完成/答錯/離開/隔日回訪 | P1 | 同上 |
| 99 | Privacy / Terms / 資料刪除 | P4 | [06.4](06-identity-sync-legal.md#64-隱私與法遵) |
| 100 | 先跑通 Calculus 留存再擴科 | ∞ | [00 五年形狀](00-north-star.md#五年形狀)、[09 指標](09-roadmap.md#指標)（D7 >= 22% 為門檻） |

---

## C. 可以做／會明顯更好（101–150）

| # | 需求 | 期 | 規格 |
| --: | --- | --- | --- |
| 101 | 模式分四類 | P1 | [04.2](04-experience-ia.md#42-模式分類法) |
| 102 | Boss / Bee / 生存 → 挑戰 | P1 | 同上 |
| 103 | 期中期末轉學考 → 模擬考 | P1 | 同上 |
| 104 | 首頁「系統推薦下一步」 | P2 | [04.4 planner](04-experience-ia.md#44-session-引擎) |
| 105 | 每天只推薦一個任務 | P1–P2 | [04.3 規則 1](04-experience-ia.md#目標形狀) |
| 106 | 5 分鐘快刷 | P2 | [04.4 sprint5](04-experience-ia.md#三種長度) |
| 107 | 15 分鐘每日訓練 | P2 | [04.4 daily15](04-experience-ia.md#三種長度) |
| 108 | 45 分鐘完整 Session | P2 | [04.4 deep45](04-experience-ia.md#三種長度) |
| 109 | 最近 7 天能力變化 | P2 | [03.9 回放](03-ability-model.md#39-成長曲線) |
| 110 | 最近 30 天能力變化 | P2 | 同上 |
| 111 | Timed Accuracy | P2 | [03.4 PA](03-ability-model.md#三個數字) |
| 112 | Untimed Accuracy | P2 | [03.4 UA](03-ability-model.md#三個數字) |
| 113 | 顯示兩者差距 | P2 | [03.4 診斷輸出](03-ability-model.md#診斷輸出這才是產品不是數字本身) |
| 114 | 平均反應時間 | P2 | [03.5 speed（用中位數）](03-ability-model.md#速度正規化) |
| 115 | 同難度百分位 | P2→P4 | [03.8](03-ability-model.md#38-同難度百分位)（階段 1 是「和自己比」，措辭必須誠實） |
| 116 | 「R3 你比三週前快 28%」 | P2 | [03.8 階段 1](03-ability-model.md#38-同難度百分位) |
| 117 | 答後標註 猜／不確定／確定 | P2 | [03.6 收集](03-ability-model.md#收集) |
| 118 | 計算 confidence calibration | P2 | [03.6 指標](03-ability-model.md#指標) |
| 119 | 找出「自信但常錯」 | P2 | [03.6 產品輸出](03-ability-model.md#產品輸出) |
| 120 | 找出「會做但沒信心」 | P2 | 同上 |
| 121 | 錯題可標記錯因 | ✓→P2 | [03.7](03-ability-model.md#37-錯因error-cause)（既有 `ERROR_TAGS` 擴充） |
| 122 | 錯因可自動推薦 | P2 | [03.7 自動推薦條件](03-ability-model.md#37-錯因error-cause) |
| 123 | 「我是算錯不是不會」統計 | P2 | [03.7 輸出](03-ability-model.md#37-錯因error-cause) |
| 124 | 錯因趨勢 | P2 | 同上 |
| 125 | 提示分三層 | P3 | [04.8 三層提示](04-experience-ia.md#三層提示) |
| 126 | 第一層只給方向 | P3 | 同上 |
| 127 | 第二層給關鍵技巧 | P3 | 同上（**必須題目專屬，泛用文字不得當 L2**） |
| 128 | 第三層完整解法 | ✓→P3 | 同上（已有 `assisted` 半分機制） |
| 129 | 顯示不同解法 | P3 | [04.8 多解法](04-experience-ia.md#多解法) |
| 130 | 高階題「解法 A／B」 | P3 | 同上（R4+） |
| 131 | 「這題真正關鍵是什麼」 | P3 | [04.8 keyIdea](04-experience-ia.md#這題真正關鍵是什麼)（R3+ 必填） |
| 132 | skill heatmap | P2 | [04.3 數據頁](04-experience-ia.md#導覽)、[03.10](03-ability-model.md#310-buzzability-api) |
| 133 | 本週退步最快技巧 | P2 | [03.10 trend.fastestDown](03-ability-model.md#310-buzzability-api) |
| 134 | 本週進步最快技巧 | P2 | [03.10 trend.fastestUp](03-ability-model.md#310-buzzability-api) |
| 135 | 考前弱點清單 | P2 | [04.6 衝刺模式](04-experience-ia.md#衝刺模式t-7-自動切換) |
| 136 | 自訂題包 | ✓ | 既有 `custom_problems.js` |
| 137 | 分享碼 | ✓ | 既有 `#pack=` |
| 138 | 分享碼產 QR code | P1 | [07.5](07-community-classroom.md#75-題包分享可以現在就做)（canvas 自繪，不引 CDN） |
| 139 | 好友打開直接開始 | P1 | 同上 |
| 140 | 題包可設限時 | P1 | 同上 |
| 141 | 題包可設是否顯示提示 | P1 | 同上 |
| 142 | 題包可設難度 | P1 | 同上 |
| 143 | PWA 安裝 | ✓ | 既有 manifest + sw.js |
| 144 | 常用題目 offline cache | ✓→P1 | 既有 `APP_SHELL`；P1 加冷門 pack 按需載入 |
| 145 | 鍵盤快捷鍵 | P1 | [04.8 鍵盤](04-experience-ia.md#輸入與無障礙) |
| 146 | iPad 手寫草稿區 | ✓→P1 | 既有 `renderScratchboard`；P1 加壓感與分欄 |
| 147 | 借用 Physics 計算紙技術 | P1 | [08.1 kernel 共用](08-platform.md#81-從-app-到-engine) |
| 148 | 解題後保留草稿 | P3 | [02.6 IndexedDB](02-data-model.md#26-indexeddb草稿與大型資料) |
| 149 | 重做錯題可看上次草稿 | P3 | 同上 |
| 150 | Session 完成產分享卡 | ✓→P2 | 既有 PNG 匯出；P2 加技巧涵蓋與能力變化 |

---

## D. 野心功能／長期玩法（151–200）

| # | 需求 | 期 | 規格 |
| --: | --- | --- | --- |
| 151 | 正式開放投稿 | P5 | [07.1](07-community-classroom.md#71-題目投稿) |
| 152 | 投稿先進候選區 | P5 | 同上（**不可協商**） |
| 153 | 投稿必附答案 | P5 | [07.1 必填](07-community-classroom.md#投稿必填) |
| 154 | 投稿必附解析 | P5 | 同上 |
| 155 | 投稿必附來源聲明 | P5 | 同上 |
| 156 | 投稿必標是否原創 | P5 | 同上 |
| 157 | 自動檢測重複 | P3（工具）→P5（線上） | [05.5](05-content-pipeline.md#55-重複偵測) |
| 158 | 自動答案 sanity check | P3（工具）→P5（線上） | [05.3](05-content-pipeline.md#53-答案驗證) |
| 159 | Curator 等級 | P5 | [07.1 curator](07-community-classroom.md#curator-制度) |
| 160 | 作者頁 | P5 | 同上 |
| 161 | 「你的題被作答 18,430 次」 | P5 | 同上 |
| 162 | 作者題目平均評價 | P5 | [07.1 社群評價](07-community-classroom.md#社群評價)（改為輕量「好題率」） |
| 163 | 題目可被社群推薦 | P5 | 同上 |
| 164 | 題目可被教師認證 | P5 | [07.1 curator 表](07-community-classroom.md#curator-制度) |
| 165 | Verified Buzz Problem 標章 | P5 | 同上 |
| 166 | 老師建立班級 | P5 | [07.2](07-community-classroom.md#72-班級與教師) |
| 167 | 老師派作業 | P5 | 同上 |
| 168 | 全班 skill heatmap | P5 | [07.2 教師視角](07-community-classroom.md#教師視角) |
| 169 | 助教看全班都錯的題 | P5 | 同上 |
| 170 | 老師設定模擬考 | P5 | 同上 |
| 171 | 班級／學校排行榜（opt-in） | P5 | [07.3 排行榜](07-community-classroom.md#排行榜) |
| 172 | 非同步好友 Duel | P5 | [07.3 Duel](07-community-classroom.md#非同步-duel) |
| 173 | 兩人同一組 10 題比速度＋正確率 | P5 | 同上（快照固定確保公平） |
| 174 | 每週 Boss | P5 | [07.4](07-community-classroom.md#74-boss-與賽季) |
| 175 | Boss 首殺紀錄 | P5 | 同上 |
| 176 | Boss streak | P5 | 同上 |
| 177 | 年度競賽模式 | P5 | 同上 |
| 178 | Integral Bee 正式賽季 | P5 | 同上 |
| 179 | 校際挑戰 | P5 | 同上 |
| 180 | Buzz Season | P5 | 同上 |
| 181 | AI 分析錯因，不亂產答案 | P6 | [08.4](08-platform.md#84-ai-的角色) |
| 182 | AI 只建立在可驗證結果上 | ∞ | 同上（**硬規則**） |
| 183 | 自動生成相似題，經 solver 驗證 | P3 | [05.6 變體](05-content-pipeline.md#56-參數變體) |
| 184 | 真正的 symbolic math backend | P3 | [08.3](08-platform.md#83-symbolic-backend)（**改寫：CAS 在 CI，不進瀏覽器**） |
| 185 | 題目可生成參數變體 | P3 | [05.6](05-content-pipeline.md#56-參數變體) |
| 186 | 無限變體但不犧牲品質 | P3 | 同上（每個變體跑完整驗證 + 去重 + 取樣上限） |
| 187 | 手寫數學辨識 | P6 | [08.5 階段 2](08-platform.md#85-手寫辨識與筆跡回放) |
| 188 | Apple Pencil 筆跡 replay | P3 | [08.5 階段 1](08-platform.md#85-手寫辨識與筆跡回放)（**資料現在就開始存**） |
| 189 | 看到學生一步一步怎麼寫 | P3 | 同上 |
| 190 | 自動找出「出錯步驟」 | P6+ | [08.5 階段 3](08-platform.md#85-手寫辨識與筆跡回放)（研究性，不承諾時程） |
| 191 | Calculus knowledge graph | P2 | [03.2](03-ability-model.md#32-skill-graph) |
| 192 | 跨科 skill graph | P6 | [08.2](08-platform.md#82-跨科-skill-graph) |
| 193 | Physics 知道你 Calculus 的弱點 | P6 | 同上（`crossPrereq`） |
| 194 | 微積分弱影響物理推薦 | P6 | 同上 |
| 195 | Buzz Pro 跨科訂閱 | P6 | [08.6](08-platform.md#86-商業模式) |
| 196 | 考前 14 天 Exam Pass | P6 | 同上 |
| 197 | 學生優惠／經濟困難免費名額 | P6 | 同上（名額數公開） |
| 198 | 英文版 | P6 | [08.7](08-platform.md#87-國際化) |
| 199 | Buzz = 能力訓練 OS | P6 | [08.1](08-platform.md#81-從-app-到-engine) |
| 200 | 像健身一樣固定回來 | ∞ | [00 成功長什麼樣](00-north-star.md#成功長什麼樣) |

---

## 被改寫的需求（要特別看）

這幾條我沒有照字面實作，理由如下。若你不同意，這是要先討論的地方。

| # | 原始需求 | 改寫成 | 理由 |
| --: | --- | --- | --- |
| 115 | 同難度百分位 | 階段 1 只做「和自己過去比」，措辭不得暗示跟別人比；階段 2 有後端才做真百分位 | 沒有跨使用者資料時做「百分位」等於編數字。編出來的數字被發現一次，整個能力模型的信任就沒了 |
| 162 | 題目平均評價 | 改成兩顆按鈕的「好題 / 有問題」與「好題率」 | 5 星評分在低流量下回填率極低且分佈退化成 5 分與 1 分，資訊量低於一個二元訊號 |
| 184 | 真正的 symbolic math backend | symbolic 只放在 CI 與 build time，瀏覽器維持數值取樣判分 | 引入 CAS 會摧毀零 build、離線可用、首屏快這三個現架構最有價值的性質。換來的判分改善極小。詳見 [08.3](08-platform.md#83-symbolic-backend) |
| 187–190 | 手寫辨識與出錯步驟偵測 | 拆成三階段，只承諾階段 1（草稿儲存與回放） | 階段 1 就有真實價值且成本低；階段 3（自動對齊解題步驟找出錯行）是研究等級問題，不該進排程 |
| 51 | 停止增加新玩法 | 收納，不刪除任何模式 | 19 個模式全部是有人在用的內容。問題在入口不在存在 |

## 明確排除

| 需求 | 為什麼不做 |
| --- | --- |
| （未列出但可預期的）AI 家教對話 | 見 [00 Non-goals](00-north-star.md#明確不做的事non-goals) |
| 預設公開排行榜 | 一律 opt-in（#171 已含此約束） |
| 前端框架重寫 | 見 [00 Non-goals](00-north-star.md#明確不做的事non-goals) |
