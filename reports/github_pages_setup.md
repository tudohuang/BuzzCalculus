# GitHub Pages Setup

日期：2026-06-05

## 前置條件

- GitHub repository 已建立
- 專案根目錄包含 `index.html`
- GitHub Pages 指向 repository root 或 `gh-pages` branch

## 建議部署方式

BuzzCalculus 是純前端靜態頁面，最簡單的部署方式是 GitHub Pages。

正式網址格式：

```text
https://<username>.github.io/BuzzCalculus/
```

## 部署前檢查

- [ ] `index.html` 可直接載入
- [ ] `styles.css` 路徑正確
- [ ] `src/*.js` 路徑正確
- [ ] KaTeX CDN 版本固定
- [ ] Lucide CDN 版本固定
- [ ] `window.BUZZ_GA_MEASUREMENT_ID` 已填入或保持空值
- [ ] 手機版首頁正常
- [ ] 選項 LaTeX 正常渲染
- [ ] 手寫黑板正常
- [ ] JSON 匯出 / 匯入正常

## 手動部署流程

1. 確認本機驗證通過。
2. Push 專案到 GitHub。
3. 在 repository Settings 啟用 Pages。
4. Source 選擇 `Deploy from a branch`。
5. Branch 選擇 `main` / root，或另外建立 `gh-pages` branch。
6. 等 GitHub Pages build 完成。
7. 用正式網址測試首頁、題目渲染、手機版。

## 驗收標準

- 正式網址回應 HTTP `200`
- UTF-8 中文正常
- KaTeX 正常
- 手機版可作答
- Android Chrome / iPhone Safari checklist 通過
