# BuzzCalculus Beta Release Review

日期：2026-06-05

## 結論

BuzzCalculus 已完成核心功能開發。

即日起不建議再新增大型功能。接下來應進入 Release Candidate（RC）階段，主要目標是：

- 驗證穩定性
- 驗證題庫品質
- 驗證答案判定
- 建立部署流程

目前風險不在功能不足，而在穩定性與正確性。

## 目前已做到

- 題庫總量：314 題
- 支援手寫答題與選擇題
- 支援手機黑板與黑板草稿回顧
- 支援錯題本、重練錯題、錯題題型篩選、清除錯題
- 支援提示系統，看提示可扣分
- 支援自適應出題、本機成就、每日挑戰、作答歷史
- 支援練習模式：不限時、不記切分頁、不扣分
- 支援錯誤分類與使用者標註
- 支援 JSON 匯出 / 匯入紀錄
- 支援答案輸入即時 LaTeX 預覽
- 支援題目與選項 LaTeX 渲染
- 已產出 XeLaTeX / XeCJK 作業本
- 已建立 RC 狀態報告、答案檢查報告、題庫人工審核抽樣表、手機 QA checklist

## 目前支援的題庫種類

主類型：

- 極限
- 微分
- 積分
- 級數

進階題型與題包：

- 多變數微積分
- Taylor / 冪級數
- 鏈鎖律
- u-substitution
- 三角代換
- 分部積分 IBP
- ODE-style 積分技巧
- King's property
- 二重積分與極座標
- Frullani 積分
- 全微分估計
- 全微分最小值
- Hessian
- Wronskian
- Jacobian 連鎖律
- 複變入門題
- 級數判別法

## 第一優先事項（P0）

必須完成後才能公開 Beta。

### P0-1 題庫人工審核

目標：確認題目本身沒有錯誤。

抽查：

- 極限：10 題
- 微分：15 題
- 積分：15 題
- 級數：10 題

共 50 題。

檢查：

- 題目是否正確
- 答案是否正確
- 難度是否合理
- Tag 是否合理
- 提示是否合理

驗收標準：錯誤率 < 2%

目前狀態：進行中。抽樣表已建立於 `reports/problem_audit_sample.md`。

### P0-2 答案檢查器驗證

目標：確認等價答案不會被判錯。

已測試：

- `tan(x)`
- `tan(x)+5`
- `sin(x)/cos(x)`
- `2x`
- `x+x`
- `convergent`
- `Convergent`
- `CONVERGENT`

驗收標準：測試案例全部通過。

目前狀態：完成。`node tools\validate_answer_checker.js` 通過 15 個測試案例。

### P0-3 手機實機測試

設備：

- Android Chrome
- iPhone Safari

測試：

- 手寫
- 選擇題
- 錯題本
- 每日挑戰
- 匯出 JSON
- 匯入 JSON

驗收標準：無重大操作中斷。

目前狀態：待測。Checklist 已建立於 `reports/mobile_qa_checklist.md`。

## 第二優先事項（P1）

### P1-1 Google Analytics

加入 GA4，追蹤：

- `start_session`
- `submit_answer`
- `finish_session`
- `use_hint`
- `export_data`
- `import_data`
- 切頁違規次數

目前狀態：已設定 Measurement ID：`G-95ST898KT1`。仍需在 GA4 DebugView 確認事件有進站。

### P1-2 Version System

首頁顯示：

- `BuzzCalculus v0.9.0-beta`
- `Build 2026-06-05`

目前狀態：完成。

### P1-3 CDN 固定版本

目前已固定：

- KaTeX `0.16.10`
- Lucide `0.468.0`

目前狀態：完成。

## 第三優先事項（P2）

### P2-1 GitHub Pages 正式部署

建立：

- `gh-pages` branch

正式網址：

```text
https://<username>.github.io/BuzzCalculus/
```

確認：

- UTF-8
- KaTeX
- 手機版

目前狀態：待設定。需要 GitHub repo / username。

### P2-2 發布頁面

新增：

- About
- 更新紀錄
- 版本號
- 已知問題

目前狀態：文件初稿完成，待轉成正式發布頁面。初稿位於 `reports/about.md`、`reports/changelog.md`、`reports/known_issues.md`。

## 暫停開發項目

Beta 前禁止新增：

- 排行榜
- 帳號系統
- 雲端同步
- AI 解題
- 新訓練模式
- 新成就系統

## 發布條件

- [ ] 題庫抽查完成
- [x] 答案檢查測試完成
- [ ] Android 測試完成
- [ ] iPhone 測試完成
- [x] GA4 完成
- [ ] GitHub Pages 部署完成
- [x] Version System 完成
- [x] CDN 固定版本完成

全部達成後即可發布：

BuzzCalculus `v0.9.0-beta`
