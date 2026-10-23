// 效能預算。
//
// zero-build 靜態站的效能故事很簡單：首屏就是把 index.html 列的每支
// script 抓下來、跑一遍。所以預算直接掛在「出貨的位元組」上 ——
// 它跨平台確定、不會 flaky，而且違約時能指名是誰超支。
//
// 時間類指標（TTI、首繪）刻意不進閘門：CI 機器的快慢每天不同，
// 拿它當門檻的下場就是大家學會重跑直到綠燈。時間只印出來給人看。
//
// 預算數字是 2026-09 大改版後的現況加上合理餘裕 —— 它的目的不是
// 逼優化，是擋「不知不覺又肥回去」。要調預算可以，但要在這裡改數字，
// 留下紀錄，而不是默默超過。

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

// 各類別的預算（bytes）。gzip 前的原始大小 —— 部署雖有壓縮，
// 但解析與執行成本跟原始大小走，而且原始大小人人都能本機重現。
// kernel 分兩類：手寫的邏輯模組，跟工具產生的側表（uid/origin/rubric/
// derived_hints/verified_answers/equivalence/skill_tags）。側表是資料 ——
// 它們隨題庫成長是正常的，跟著題庫預算走；邏輯肥大才是要擋的事。
const GENERATED_TABLES = /^src\/kernel\/(uid_map|origin|rubric|rubric_reviewed|derived_hints|verified_answers|equivalence|skill_tags)\.js$/;

const BUDGETS = {
  // 2026-09-13 從 700 調到 720：初學者走查補進新手保護期、診斷式定位、
  // 考前衝刺卡（+14KB），同時把 TAG_LABELS 搬成 kernel/tag_labels.js（−7KB）。
  // 下一次撞頂不該再調數字 —— 該搬的是整頁的 render（首頁、結算、設定）。
  // 2026-09-28 720 → 736：英文版。1,800 個中文字串包成 t("…") 是純語法開銷（+14.6KB），
  // 不是新功能長胖；量出來多少就加多少。功能再撞頂仍然照上一條：搬 render，不調數字。
  "app.js 主程式": { pattern: /^src\/app\.js$/, budget: 736 * 1024 }, // 2026-10-15 設定頁的 render 搬去 settings_page.js，退回 736KB。（2026-10-14 曾經 736 → 737KB：旁白只剩一個聲音（女聲 Omni）時設定頁不出「旁白聲音」那一列（看大綱有沒有 narrationM），多 41 bytes；原本只剩 11 bytes）
  // 2026-10-21 調高：10-19 課程缺口補題（約 1,300 題、讓 317 課的推薦題都有題可練）：uid／rubric／origin 側表跟著題數長，463 → 605KB。
  "kernel 產生側表": { pattern: GENERATED_TABLES, budget: 620 * 1024 },
  // 2026-09-28 新增：zh→en 介面字典（i18n_en.js）。每個使用者都會抓（模組初始化期就要有語言），
  // 所以它有自己的上限；題目的英文側表走延後載入，不在這裡。
  "語言字典（zh→en）": { pattern: /^src\/kernel\/i18n_en\.js$/, budget: 240 * 1024 },
  // 2026-09-13 200 → 260：kernel/proof_lang.js（句型、代數、規則三個引擎）59KB 一次進來。
  // 2026-09-14 260 → 280：proof_lang.js 101KB —— 收緊語法（接地、前提、符號正負引擎 parseTree/signOf、
  // 線性解 solveLinear、泰勒規則）。這是檢查器的骨幹，不是可以搬去別處的 render；再撞頂該做的是
  // 把 signOf 那類純函式拆成 kernel/proof_sign.js 之類、順便量一次是不是真的都在用。
  // 2026-09-19 280 → 330：proof_surface.js 36KB —— Proof Input v2／v2.1 自由書寫層（LaTeX 表層、切句、
  // 一句多動作、目標宣告、結論接地、連鎖抑制、原文映射）。它是獨立模組，proof_lang.js 不用學自然語言。
  // 2026-09-19 330 → 345：Proof Input v2.2 —— proof_lang.js +11KB（改寫規則四條、接地優先序、provenance 事實表），
  // proof_surface.js +6KB（語意目標：lim 形式與 ∀ε∃δ 形式等價、目標寫錯紅、結論接地）。都是驗證邏輯，不是資料。
  // 2026-09-20 345 → 365：Proof Engine v2.3／v2.4 —— proof_lang.js +21KB（全稱條件實例化、全稱主張、自訂函數數值微分、單調性接地）。
  // 都是驗證邏輯；下一次再漲就該把接地規則搬去獨立模組（proof_grounding.js），不是再調數字。
  // 2026-09-20 365 → 385：Proof Engine v2.5 積分——tanh–sinh 數值積分、∫／Σ 寫法改寫、int()/sum() 編譯（+14KB）。
  // 這是新能力不是長胖；但 proof_lang.js 已 155KB，下一版應該把數值積分與接地規則拆成獨立檔並延遲載入（只有證明頁用）。
  // 2026-09-21 385 → 390：tex_lite 排完量畫面——過寬的 display 式子改走換行流／一式一行／縮字（+3KB）。
  // 下一次再超就不是加預算，是把 proof_lang.js（167KB）拆成按需載入。
  "kernel 邏輯模組": { pattern: /^src\/kernel\//, budget: 390 * 1024 },
  // 2026-10-21 調高：10-19 課程缺口補題（約 1,300 題、讓 317 課的推薦題都有題可練）：2106 → 2749KB（原始碼含 verify；部署時拿掉 verify，見 bundle_site.js）。
  //   這是首屏要付的：再長就該把題庫拆成延後載入的分片，不是再調數字。
  "題庫資料合計": { pattern: /^src\/problem|^src\/problems\.js$|^src\/proofs\.js$/, budget: 2800 * 1024 },
  // 2026-09-15 300 → 310：「從零開始」課程表與單課頁（course.js）約 4KB 的樣式；
  // 已盡量沿用 pl-tutorial / pl-intro / pl-goal / first-steps。再撞頂該做的是
  // 把 styles.css 的三層歷史覆蓋（見 duolingo-path-design 那次的教訓）清一輪。
  // 2026-10-23 310 → 314：證明梯子的卡片與格子、題解的常見錯法（約 2.6KB）
  "樣式 styles.css": { pattern: /^styles\.css$/, budget: 314 * 1024, fromCss: true },
  // 2026-10-21 300 → 304：證明訓練表的精選清單（proof_lab_ui.js 的 SHELF，45 題 id）。
  // 2026-10-23 304 → 307：證明題庫的梯子（首頁八張卡、題目頁「第幾級教什麼」、通過後接下一級；proof_lab_ui.js）
  "其他 src 腳本": { pattern: /^src\//, budget: 307 * 1024, catchAll: true },
  // 2026-09-24 新增這一類：index.html 上 type="text/lazy" 的檔案瀏覽器不會在首屏抓，
  // 進到需要它的頁面才載（目前是證明引擎三支）。它們跟首屏無關，預算也不該跟首屏的檔搶 ——
  // 但仍然要有上限：延後載入不是「隨便長」的許可證，載入那一刻使用者還是要等。
  // 2026-09-28 320 → 460：題目的英文側表（i18n_problems_en.js）只在英文介面載，中文使用者零成本。
  // 2026-09-30 新增：逐步解答側表（problem_solution_steps.js）。它也是 text/lazy，但跟上面那類不同：
  // 不是「進到某一頁才抓」，是頁面載完、閒下來就抓（答完題看解答時一定要已經在）。
  // 首屏不用解析它，所以不跟首屏的檔搶；也不跟證明引擎、英文側表搶同一個上限。
  // 它隨內容成長（每題約 0.5KB），上限給到現況的兩倍左右 —— 再撞頂就該拆成按題包載入。
  // 2026-10-21 調高：10-19 課程缺口補題（約 1,300 題、讓 317 課的推薦題都有題可練）：新題的逐步解答 186 → 414KB。
  "延後載入：逐步解答": { pattern: /^$/, budget: 440 * 1024, lazy: "steps" },
  // 2026-10-13 新增：更新檢查與版本（src/kernel/app_update.js，從 app.js 搬出 setupPwa／更新橫幅並加上回到前景的檢查、版本列）。
  // 跟 steps 一樣是開站閒下來就載（註冊 Service Worker 本來就在那個時間點），不佔 script 標籤上限。
  "延後載入：更新與版本": { pattern: /^$/, budget: 14 * 1024, lazy: "pwa" },
  // 2026-10-13 新增：量測漏斗與回訪（src/kernel/metrics.js，約 8KB、一半是中文註解）。只有分析開著才在開站時載（跟 gtag.js 同一道閘），
  // 不佔 script 標籤上限（已 67／67）、也不佔 app.js 的位元組（app.js 只留兩處掛鉤）。上限留約五成。
  "延後載入：量測": { pattern: /^$/, budget: 12 * 1024, lazy: "metrics" },
  // 2026-10-15 新增：設定頁的畫面（src/settings_page.js，約 19KB）。app.js 撞到 736KB 上限時照上面的規則搬整頁 render（不調數字）。
  // 第一次打開設定頁才抓（進 APP_SHELL，離線也有）。上限留約兩成。
  "延後載入：設定頁": { pattern: /^$/, budget: 24 * 1024, lazy: "settings" },
  // 2026-10-14 新增：題目側寫＋兩段式抽題（題庫精修提案 v1.0）。problem_profiles.js 是產生的側表（每題一列：方法家族、模板母題、
  // 權重、角色、先修課，約 125KB，隨題庫成長）＋ sampler.js 約 11KB 的抽題邏輯。開站閒下來才載（跟 pwa 同一個時間點），
  // 不佔 script 標籤上限（67／67）也不佔 app.js（只留三處掛鉤）。上限留約三成給題庫成長；再撞頂該做的是把列壓成
  // 只有抽題要的四欄（家族、模板、權重、先修），完整側寫只留在 reports/，不是調數字。
  // 2026-10-21 調高：10-19 課程缺口補題（約 1,300 題、讓 317 課的推薦題都有題可練）：每題一份側寫，163 → 211KB。
  "延後載入：抽題側寫": { pattern: /^$/, budget: 220 * 1024, lazy: "sampler" },
  // 2026-09-30 拆成兩類：兩組是各自載入的（進證明頁才抓 proof 那三支；英文介面才抓 i18n 那一支），
  // 合在一起算等於讓英文側表跟證明引擎搶同一個額度 —— 載入的那一刻，使用者等的只是其中一組。
  // 拆開時的量：證明組 290KB（proof_lang 167 ＋ proof_surface 44 ＋ 內容 79；內容多了 20 講的 10 題證明小題 +10KB），
  // 英文側表 175KB。上限各留約兩成：證明組 320KB（下一次撞頂照 kernel 那條：把 proof_lang.js 拆檔，不是調數字）、
  // 英文側表 240KB（第二批翻譯——解說、提示——會進這一支，那是預期中的成長）。
  // 2026-10-23 320 → 334：機器判證明 12 題新題＋每題的常見錯法（traps）＋八條梯子，引擎 v2.7（不等式相加、與已知矛盾、由已知極限取 N）
  "延後載入：證明頁": { pattern: /^$/, budget: 334 * 1024, lazy: "proof" },
  // 2026-09-30 240 → 720：英文第二批（解說／提示／逐步解／課文／證明的句型表 i18n_text_en.js 481KB）進了這一組。
  // 只有英文介面在開站時抓（中文使用者零位元組，sw.js 也不預快取）；英文使用者第一幀要等它，所以仍然要有上限（現況 655KB）。
  // 2026-09-30 720 → 800：合併逐步解答分支後補翻 879 個句型（多是 552 題的步驟），句型表 481 → 554KB，合計 728KB。
  // 下一次撞頂該做的是把句型表按種類拆（解說／步驟／提示各一支，看解答時才抓步驟），不是再調數字。
  // 2026-10-14 800 → 880：題庫精修 2026-10（+260 題）的英文 —— 151 題的題幹側表（+24KB）與 1,088 個新句型（解說／步驟／提示，+105KB），
  // 合計 855KB。這是內容成長不是長胖（每題約 0.2KB 英文）。上面那條「按種類拆」仍然欠著：拆法要動 app.js 的 ensureLazy("i18n")，
  // 而 app.js 只剩 11 位元組，那是另一件事（先把 app.js 的 render 搬出去）。中文使用者仍然零位元組。
  // 2026-10-16 880 → 640，並拆出第二支：照上面欠的那條把句型表按種類拆 —— 第一幀要的（題幹側表、提示、機器推的提示、課文）留在這一組，
  // 舊解說／推導步驟／證明題搬去 i18nmore（第一幀畫完才抓；英文詳解 v2 上了之後，舊解說只剩沒詳解的題用得到）。
  // 拆完這一組 529KB（含原本卡在「英文待上」的 200 題），第二支 417KB。上限各留約兩成。
  // 2026-10-21 調高：10-19 課程缺口補題（約 1,300 題、讓 317 課的推薦題都有題可練）與課程擴寫的英文：517 → 941KB、417 → 710KB。只有英文介面才抓。
  "延後載入：英文內容": { pattern: /^$/, budget: 960 * 1024, lazy: "i18n" },
  "延後載入：英文內容（第二支）": { pattern: /^$/, budget: 730 * 1024, lazy: "i18nmore" },
  // 2026-10-08 新增：新版課程（中文介面取代舊的 25 課）。317 課的課文合計 1.8MB，絕不進首屏：
  // 打開課程（或新手首頁要畫主卡）才抓大綱＋畫面這一組（大綱 63KB ＋ 畫面 33KB）；英文介面永遠不抓。
  // 上限留約四成：大綱隨課數與推薦題長，畫面再長就該拆，不是調數字。
  // 2026-10-21 140 → 146：大綱多了推薦題（課程缺口補題）、藏起來的 Stage 與解鎖（course_v2_ui.js）。
  "延後載入：課程": { pattern: /^$/, budget: 146 * 1024, lazy: "course" },
  // 2026-10-13 新增：課程畫面的樣式（course_v2_style.js，約 21KB）從 course_v2_ui.js 整段搬出來 —— 課程組只剩 24 位元組，
  // 塞不下「完成／熟練／全破還差多少」的那幾行。跟課程組一起抓（course.js），上限留約兩成。
  "延後載入：課程樣式": { pattern: /^$/, budget: 26 * 1024, lazy: "coursestyle" },
  // 2026-10-09 新增：課程地圖（課程表切到「地圖」才抓）。自己一組，不跟課程那一組搶：課程組已經用到九成多，
  // 而只看清單的人一個位元組都不該為地圖付。版面在 build 時算好（map.js 約 16KB），畫法 course_map.js 約 40KB。
  // 上限留約五成；再撞頂該做的是把座標壓成整數陣列以外的格式（例如差分），不是調數字。
  // 2026-10-09 調高 90 → 100KB：地圖從「好看」變成「有意義」—— 點亮／可以學／目標（缺的先修閉包＋拓撲順序）／
  // 該練（錯題、回溫、答對率、弱技巧、還沒熟練）的推導、篩選列、目標列、該練清單、小卡的「練這課」「設為目標」，
  // 以及給測試的 state()：course_map.js 55 → 76KB（約一半是中文註解與門檻說明）。只有切到地圖（或設了目標的人看課程表）才付。
  // 課程組（大綱＋畫面）只剩 6KB，這些放不進去。下一次撞頂該做的是把推導（derive／goalPlan）拆成自己一支，不是再調數字。
  "延後載入：課程地圖": { pattern: /^$/, budget: 100 * 1024, lazy: "map" },
  // 2026-10-09 新增：分節模式（course_sections.js，約 25KB）。只有打開「有分節的課」才抓；課程組只剩幾百位元組，
  // 而沒有分節的課（目前 313 / 317 課）一個位元組都不該為它付。上限留約四成；分節推到全部的課之後再撞頂，
  // 該做的是把結算畫面拆出去，不是調數字。
  // 2026-10-09 調高 36 → 44KB：旁白播放（播放／暫停、語速、字幕、念完自己出下一句、載不到退回點的）約 9KB，
  // 只有打開有分節的課才付；錄音本身（/media/narration/*.mp3）不在預算裡：按了播放才載、不進 Service Worker 快取。
  // 2026-10-10 加了證明節的掛鉤（「為什麼」擋住下一句、問句的旁白、證明節的動作轉給 course_proof.js）約 1.5KB，
  // 照上面那條把結算畫面拆成 course_finish.js（約 4KB）：上限不動。
  // 2026-10-12 調高 44 → 46KB：黑板（board）與自己算（solve）兩個平行做的功能合併後各留了一組掛鉤
  // （載入各自的 lazy 群組、把 show 換成黑板、solve 動作轉給 course_solve.js、捲動對位），合起來 44.5KB。
  // 引擎本體都在自己的群組（course_board.js、course_solve.js），這裡只有掛鉤。下一次再撞頂：把旁白播放（約 9KB）拆成自己一支，不是再調數字。
  // 2026-10-13 照上一行說的做：旁白播放（dock、播放／暫停、語速、字幕、念完自己出下一句）搬去 course_narration.js（narration 組），
  // 分節這一組 45 → 32KB；空出來的地方給「為什麼／動作出現時黑板最後一行跟問題都要看得到」的捲動對位。上限不動。
  "延後載入：課程分節": { pattern: /^$/, budget: 46 * 1024, lazy: "sections" },
  // 2026-10-13 新增：分節的旁白播放（course_narration.js，約 16KB）。有 say 的課才抓；行為跟搬出來之前一模一樣（e2e_course_sections 的旁白那一段）。上限留約兩成五。
  // 2026-10-14 兩個聲音（女聲／男聲：旁白列的切換鈕、念到一半換聲音、選的那一個沒有或載不到用另一個）16 → 18.6KB，上限不動（還剩約 8%）。
  // 2026-10-15 句間停頓（旁白列「停 n 拍」）18.6 → 20.0KB，只剩 50 bytes：上限 20 → 24KB（跟其他延後載入組一樣留約兩成；這一組不在首屏）。
  "延後載入：分節旁白": { pattern: /^$/, budget: 24 * 1024, lazy: "narration" },
  // 2026-10-10 新增：分節的結算畫面（course_finish.js，約 4KB）。讀到一課的最後一節才抓（點「完成這一課」時通常已經到了）。
  "延後載入：分節結算": { pattern: /^$/, budget: 8 * 1024, lazy: "secfinish" },
  // 2026-10-10 新增：證明節（sections[].proof）的互動 course_proof.js —— 句子的「這一步為什麼成立？」、把證明排回順序、
  // 「這個假設用在哪一步？」。只有有證明節的課才抓（其他課一個位元組都不付）；不塞進分節那一組（它只剩 2KB）。上限留約四成。
  "延後載入：證明節": { pattern: /^$/, budget: 16 * 1024, lazy: "secproof" },
  // 2026-10-12 新增：自己算（sections[].solve：分節結尾的打字作答，判分借 app.js 的 checkAnswer）與課程回溫（隔天一輪自己算）
  // course_solve.js 約 26KB（約四成是中文註解）。只有打開「有自己算的課」或點了回溫才抓；分節組只剩 1KB、課程組只剩十幾個位元組，都塞不下。
  // 排程（今天該回溫什麼）是 kernel/planner.js 的純函式，首頁那張卡在 course.js（不能為了一行字去抓課程組）。上限留約一成五。
  "延後載入：自己算與回溫": { pattern: /^$/, budget: 30 * 1024, lazy: "secsolve" },
  // 2026-10-11 新增：章首魔王題（course_boss.js，約 8KB）—— 章的第一課那張卡、讀完的「離魔王題還差 n 課」、payoff 的「現在解得開了」、解完的結算。
  // 只有打開「有魔王題那一章」的課才抓（試行 3 章；其他章、只看課程表的人一個位元組都不付）。課程組只剩 1KB，塞不下（課程組裡只留課程表那一行與「還差 n 課」的算法）。上限留約兩成。
  "延後載入：章首魔王題": { pattern: /^$/, budget: 10 * 1024, lazy: "boss" },
  // 2026-10-12 新增：分節的黑板（course_board.js：寫上去、變形、粉筆記號、畫曲線，連同自己的樣式）。只有句子帶 board 的課才抓，
  // 其他課一個位元組都不付；不塞進分節那一組（它只剩 1KB）。上線時約 21KB（brotli 約 7.5KB；其中樣式 2KB、中文註解 2KB）。
  // 再撞頂該做的是把 plot（畫曲線，只有少數句子用）拆成自己一支，不是調數字。
  // 2026-10-12 調高 24 → 54KB（黑板 v2）：v1 是「照順序把東西疊上去」，結果東西會疊在一起、時間也對不上旁白。
  // v2 多了一整個排版模型（course_board_layout.js 約 18KB：切式子、換行、= 對齊、整節的狀態、標籤避讓、箭頭繞字、時間表）
  // 與跟錄音時鐘走的畫面（course_board.js 約 34KB，其中約五分之一是中文註解與樣式）。brotli 之後約 18KB，只有有黑板的課才付。
  // 照上一條把 plot（畫曲線）拆成自己一組（boardplot，見下面）。再撞頂：把 debug／lint 用的掛鉤搬去 tools 注入，不是再調數字。
  // 2026-10-18 → 72KB：教授的黑板（不擦、一塊一塊並排、板子裡捲、鏡頭跟著粉筆）、真的黑板的樣子（木框、粉筆溝、粉筆尖跟著寫）約 +9KB。
  // 2026-10-20 72 → 88：一課一塊黑板（從 BuzzPhysics2 移植）——整課的句子接成一塊板、分欄換面排版（stackFlow）、小測寫上板在板上點選、圖釘在板上保留的一塊（+5KB）。
  //   這是新能力；物理站同一套約 80KB。
  // 2026-10-20 88 → 92：筆記本原型（方格紙、整個本文區、節不拆頁）、捲軸樣式、寫字時不翻頁；自己寫的筆在自己一組（ink，見下面）。
  // 2026-10-21 92 → 98：筆記本紙的樣式與字型、證明的「為什麼」與「用在哪一步」寫上板在板上點（約 +3KB）、
  //   筆記本兩欄左文右圖（推導寫左欄、圖與題目寫右欄，約 +2KB）。
  // 2026-10-21 98 → 101：打字的「自己算」也寫上板（題目寫在板上、輸入框疊在題目底下跟著板子捲）、直式的板高重排（約 +2.5KB）。
  // 2026-10-22 101 → 102：攤開筆記的墨跡對位修正、分節拿掉滑桿互動圖後「有圖的節」只算真的畫得出來的圖（約 +0.5KB，原本貼著上限）。
  // 2026-10-23 102 → 109：手機上寬式子不縮字——框起來的長式子、aligned 拆開換行（框照整組畫、整組上色）、
  //   + − · × )( \quad \text 也能換行、橫的表放不下轉直的（約 +6KB；交付的筆記本課在 360px 有上百行縮到 10–15px）。
  // 2026-10-23 109 → 111：筆記本版面不留空——沒有圖與題的節寫滿兩欄寬、這一頁剩四成以上就接著寫、被擠到新頁的題寫左欄（約 +1.5KB）
  "延後載入：課程黑板": { pattern: /^$/, budget: 111 * 1024, lazy: "board" },
  // 2026-10-12 新增：黑板上的圖（course_board_plot.js，約 2KB）。只有節裡有 plot 的才由 course_board.js 抓。
  // 2026-10-23 4 → 22KB：同一組多了 course_board_nbplot.js（約 16KB，交付的筆記本課的函數圖：BuzzNotebook 的 plot 畫法原樣搬來）。
  // 316 課換成交付的課之後，有圖的節幾乎都用得到它，所以放同一組、不另開一組（也省掉 course_board.js 多抓一組的程式）。
  "延後載入：黑板的圖": { pattern: /^$/, budget: 22 * 1024, lazy: "boardplot" },
  // 2026-10-20 新增：筆記本上自己寫（course_ink.js，約 20KB，其中 perfect-freehand 約 4KB、工具列樣式與圖示約 4KB）。只有筆記本模式打開一課一塊板才抓。
  // 2026-10-23 24 → 26：工具列的「看乾淨的」（眼睛，藏起筆跡不刪）與「攤開整本」，攤開頁的「我的筆記／乾淨版」與一頁一張的列印
  "延後載入：筆記本自己寫": { pattern: /^$/, budget: 26 * 1024, lazy: "ink" },
  // 2026-10-09 新增：課程的圖（course_figures.js，約 15KB，figures 與 8 種 widget 的畫法）。從 course_v2_ui.js 搬出來：
  // 課程組到了 140 / 140KB，而沒有圖的課、只看課程表的人都不用它。有圖或有分節的課打開時才抓。上限留約五成。
  "延後載入：課程的圖": { pattern: /^$/, budget: 24 * 1024, lazy: "figures" },
  // 2026-10-09 課文改成按章分檔（原本按 Stage：Stage 12 已經 398 / 450KB，分節推到全部的課之後每課多 4–5KB，
  // 最大的 Stage 會到 600KB 以上）。打開某一課只抓那一章 —— 使用者等的是「一章」，所以上限管最大的那一支。
  // 改的時候：最大的一章是 11D（Gamma 與 Beta，9 課）58KB；每課加上分節與旁白起訖約 +5KB → 約 105KB。上限 160KB。
  // 撞頂該做的是把那一章拆小（大綱的章本來就該 ≤ 8 課），不是調數字。
  // 2026-10-23 160 → 768KB：316 課換成交付的筆記本課（tools/import_notebook.js），內容比原本長（每課 30–40 句、一句一段黑板），
  // 而且帶著交付者手畫的圖（黑板 plot 的 svg）—— 多變數那幾章的立體圖（曲面網格）一張就 100–160KB，拆章也拆不掉。
  // 最大的是 8E（712KB，brotli 71KB）；svg 重複的屬性多，壓縮後是原本的十分之一，使用者等的是壓過的那一份。
  // 下一次撞頂：把立體圖的網格在匯入時減點（座標一位小數已經做了），或把圖拆成一課一支，不是再調數字。
  "延後載入：課文（最大的一章）": { pattern: /^src\/course_v2\/ch-[a-z0-9-]+\.js$/, budget: 768 * 1024, maxFile: true },
  // 2026-10-16 新增：詳解 v2 的分片（src/detail/d-XX.js，64 片，開局只抓這一局的題目在的那幾片）。
  // 全題庫約 3,000 份、4MB 上下 → 平均一片 65KB；使用者等的是一片，所以管最大的那一片。撞頂就加片數
  // （build_solution_detail.js 的 SHARDS 跟 problem_authored_solutions.js 一起改），不是調數字。
  "延後載入：詳解（最大的一片）": { pattern: /^src\/detail\/d-\d{2}\.js$/, budget: 128 * 1024, maxFile: true },
  // 英文詳解（src/detail/en/d-XX.js）：同一個雜湊、同一個片號，英文介面抓這一套；一樣管最大的那一片。
  "延後載入：英文詳解（最大的一片）": { pattern: /^src\/detail\/en\/d-\d{2}\.js$/, budget: 128 * 1024, maxFile: true }
};

const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const allTags = [...html.matchAll(/<script[^>]*src="(src\/[^"]+\.js)"[^>]*>/g)];
const lazyScripts = new Set(allTags.filter((m) => /type="text\/lazy"/.test(m[0])).map((m) => m[1]));
const lazyGroupOf = new Map(allTags.filter((m) => /type="text\/lazy"/.test(m[0])).map((m) => [m[1], (m[0].match(/data-lazy="([^"]+)"/) || [])[1] || ""]));
const scripts = allTags.map((m) => m[1]).filter((rel) => !lazyScripts.has(rel));
const failures = [];

// 題庫檔量「部署時真的送出去」的大小：bundle_site.js 會把 verify（只給驗證器用的驗算描述子）拿掉，
// 見 tools/lib/strip_verify.js。原始碼留著 verify，是讓作者寫題時驗算就在題目旁邊。
const { shipProblemFile } = require("./lib/strip_verify.js");
const sizeOf = (rel) => {
  try {
    if (/^src\/problem_[a-z0-9_]+\.js$/.test(rel)) {
      const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
      return Buffer.byteLength(shipProblemFile(text, rel), "utf8");
    }
    return fs.statSync(path.join(ROOT, rel)).size;
  } catch (_e) { return 0; }
};

const claimed = new Set();
const rows = [];
for (const [label, spec] of Object.entries(BUDGETS)) {
  let files = [];
  if (spec.maxFile) {
    // 不在 index.html 上、由頁面自己按需抓的檔：量的是最大的那一支（一次只等一支）
    // 按需抓的檔住在 src/course_v2（課文）與 src/detail（詳解分片）
    files = ["course_v2", "detail", "detail/en"].flatMap((sub) => {
      const dir = path.join(ROOT, "src", sub);
      return fs.existsSync(dir) ? fs.readdirSync(dir).map((name) => `src/${sub}/${name}`) : [];
    }).filter((rel) => spec.pattern.test(rel));
    const biggest = files.reduce((max, f) => Math.max(max, sizeOf(f)), 0);
    const pctMax = Math.round((biggest / spec.budget) * 100);
    rows.push({ label, total: biggest, budget: spec.budget, pct: pctMax, count: files.length });
    if (biggest > spec.budget) failures.push(`${label} 超出預算：${Math.round(biggest / 1024)}KB / ${Math.round(spec.budget / 1024)}KB`);
    continue;
  } else if (spec.lazy) {
    files = [...lazyScripts].filter((rel) => lazyGroupOf.get(rel) === spec.lazy);
  } else if (spec.fromCss) {
    files = ["styles.css"];
  } else if (spec.catchAll) {
    files = scripts.filter((s) => spec.pattern.test(s) && !claimed.has(s));
  } else {
    // 類別依宣告順序互斥：先宣告的先認領。side table 歸資料、
    // 剩下的 kernel 才算邏輯 —— 順序反了整個分類就失真。
    files = scripts.filter((s) => spec.pattern.test(s) && !claimed.has(s));
    files.forEach((f) => claimed.add(f));
  }
  const total = files.reduce((sum, f) => sum + sizeOf(f), 0);
  const pct = Math.round((total / spec.budget) * 100);
  rows.push({ label, total, budget: spec.budget, pct, count: files.length });
  if (total > spec.budget) {
    const worst = files.map((f) => [f, sizeOf(f)]).sort((a, b) => b[1] - a[1]).slice(0, 3)
      .map(([f, b]) => `${f} ${Math.round(b / 1024)}KB`).join("、");
    failures.push(`${label} 超出預算：${Math.round(total / 1024)}KB / ${Math.round(spec.budget / 1024)}KB（最大：${worst}）`);
  }
}

console.log("效能預算（原始位元組）");
rows.forEach((r) => {
  console.log(
    `  ${r.label.padEnd(14)} ${String(Math.round(r.total / 1024)).padStart(5)} KB / ${String(Math.round(r.budget / 1024)).padStart(5)} KB  ${String(r.pct).padStart(3)}%  （${r.count} 檔）`
  );
});

// script 數量：每支都是一次 request 與一次解析。上限一樣是「擋回肥」。
// 2026-09-13 60 → 64：白話證明的 kernel 與內容各一支。下一次該做的是把題庫檔合併，不是再加數字。
// 2026-09-16 64 → 65：share_cards.js 是從 app.js 搬出去的 230 行（app.js 撞頂），總位元組沒變；
// 題庫檔合併（37 檔）還是欠著的債，下一支再加就先合併。
// 2026-09-19 65 → 66：kernel/proof_surface.js（Proof Input v2 自由書寫層）是一支獨立的 kernel 模組，
// 讓 proof_lang.js 不用學自然語言；舊測試繼續保護引擎，新測試只管翻譯。
// 2026-09-29 66 → 67：problem_lecture_pack.js 是 tools/build_lecture_pack.js 從外部考卷產生的檔（336 題＋ 20 張固定卷的題序），
// 有自己的重產流程；塞進手寫的題庫檔會讓產生的內容跟手寫的內容擠在同一個檔裡，下一次重產就沖掉人家的字。
const SCRIPT_COUNT_BUDGET = 67;
console.log(`  script 標籤        ${String(scripts.length).padStart(5)} 支 / ${SCRIPT_COUNT_BUDGET} 支上限`);
if (scripts.length > SCRIPT_COUNT_BUDGET) {
  failures.push(`index.html 的 script 數量 ${scripts.length} 超過 ${SCRIPT_COUNT_BUDGET}`);
}

// 每一支延後載入的檔都要屬於某個有預算的組：新加一組 data-lazy 就要在上面寫它的上限
const budgetedGroups = new Set(Object.values(BUDGETS).map((spec) => spec.lazy).filter(Boolean));
[...lazyScripts].filter((rel) => !budgetedGroups.has(lazyGroupOf.get(rel))).forEach((rel) => {
  failures.push(`${rel} 是延後載入（data-lazy="${lazyGroupOf.get(rel)}"），但這一組沒有預算`);
});

if (failures.length) {
  console.error(`\n效能預算超支（${failures.length}）：`);
  failures.forEach((f) => console.error("  " + f));
  console.error("要調預算就改這個檔案裡的數字並寫清楚為什麼 —— 不要默默超過。");
  process.exit(1);
}

console.log("\nperformance budget OK");
