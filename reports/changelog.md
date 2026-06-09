# BuzzCalculus Changelog

## v0.9.0-beta

日期：2026-06-05

### Added

- 2026-06-09：新增題庫搜尋、收藏、題目回報、Boss 專區
- 2026-06-09：新增 Warm-up、Integral Bee、No Hint、Accuracy、Survival、Boss Rush、Cooldown 挑戰模式
- 2026-06-09：新增每日目標、週任務、streak 點、最近關卡結果、關卡金牌 / CLEAR 徽章
- 2026-06-09：新增弱點時間衰減與錯題答對降權

- 新增手寫答題模式
- 新增選擇題模式
- 新增手機黑板與全螢幕黑板
- 新增每題黑板草稿回顧
- 新增錯題本、錯題重練、錯題題型篩選、清除錯題
- 新增提示系統與提示扣分
- 新增自適應出題
- 新增每日挑戰固定題組
- 新增作答歷史
- 新增練習模式
- 新增錯誤分類與使用者標註
- 新增本機成就
- 新增 JSON 匯出 / 匯入
- 新增答案輸入即時 LaTeX 預覽
- 新增選項 LaTeX 渲染
- 新增 XeLaTeX / XeCJK 作業本產生器
- 新增答案檢查器驗證腳本
- 新增題庫人工審核抽樣腳本
- 新增手機 QA checklist
- 新增 GA4 scaffold

### Changed

- 首頁改成較簡潔的操作介面
- CDN 改為固定版本：KaTeX `0.16.10`，Lucide `0.468.0`
- Topbar 顯示版本與 Build 日期
- 答案檢查器支援常見隱式乘法，例如 `2x`、`2(x+1)`、`2sin(x)`

### Validation

- 題庫驗證通過：314 題
- 答案檢查器驗證通過：15 個測試案例
- 首頁 render smoke test 通過
- Live Preview HTTP 回應確認：`200`

### Pending

- 題庫人工審核
- Android Chrome 實機測試
- iPhone Safari 實機測試
- GA4 Measurement ID 設定
- GitHub Pages 正式部署
