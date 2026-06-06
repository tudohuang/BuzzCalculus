# BuzzCalculus RC Status

日期：2026-06-05

## RC 總覽

| 項目 | 狀態 | 備註 |
|---|---|---|
| P0-1 題庫人工審核 | 進行中 | 抽樣表已建立：`reports/problem_audit_sample.md`，待人工審核 |
| P0-2 答案檢查器驗證 | 完成 | `node tools\validate_answer_checker.js` 通過 15 個測試案例 |
| P0-3 Android Chrome 實機測試 | 待測 | Checklist 已建立：`reports/mobile_qa_checklist.md` |
| P0-3 iPhone Safari 實機測試 | 待測 | Checklist 已建立：`reports/mobile_qa_checklist.md` |
| P1-1 GA4 | 已設定 | Measurement ID：`G-95ST898KT1`，待 GA4 DebugView 實測事件 |
| P1-2 Version System | 完成 | Topbar 顯示 `v0.9.0-beta · Build 2026-06-05` |
| P1-3 CDN 固定版本 | 完成 | KaTeX `0.16.10`，Lucide `0.468.0` |
| P2-1 GitHub Pages 部署 | 待設定 | 需要 GitHub repo / username |
| P2-2 發布頁面 | 初稿完成 | 已建立 `reports/about.md`、`reports/changelog.md`、`reports/known_issues.md`，待轉成正式頁面 |

## 已完成驗證

- 題庫驗證通過：314 題
- `src/app.js` 語法檢查通過
- 首頁 render smoke test 通過
- 答案檢查器驗證通過：15 個測試案例
- P0-1 題庫人工審核抽樣表已建立：50 題
- P0-3 手機實機測試表已建立
- Live Preview `index.html` 曾確認 HTTP `200`

## 目前阻塞

- P0-1 仍需要人工審核 `reports/problem_audit_sample.md`
- P0-3 仍需要 Android Chrome / iPhone Safari 實機測試
- GA4 已設定 Measurement ID，仍需在 GA4 DebugView 確認事件有進站
- GitHub Pages 需要 GitHub repo / username

## 下一步

1. 依 `reports/mobile_qa_checklist.md` 完成 Android Chrome 測試。
2. 依 `reports/mobile_qa_checklist.md` 完成 iPhone Safari 測試。
3. 人工審核 `reports/problem_audit_sample.md` 的 50 題。
4. 開啟 GA4 DebugView，確認 `start_session`、`submit_answer`、`finish_session` 有進站。
5. 提供 GitHub repo / username 後建立 GitHub Pages 部署流程。
