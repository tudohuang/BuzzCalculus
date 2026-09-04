# 投稿題目指南

題庫成長的瓶頸不該是「只有一個人在出題」。這份文件讓任何人能開 PR 投稿題目，
而品質底線由機器把關：**答案錯的題進不來、跟現有題撞衫的進不來、
驗算器搆不到又不說明的進不來。**

## 一題長什麼樣

```js
N("yourtag-int-001", "integrals", 3,
  "\\int_0^1 x e^{x^2}\\,dx",          // 題幹：LaTeX
  "(exp(1)-1)/2",                       // 答案：JS 方言（exp/log/sqrt/atan/pi）
  ["substitution", "u-sub"],            // tags：用現有詞彙（skill graph 要認得）
  "令 u=x²，du=2x dx。",                // 解說
  60,                                    // timeLimit 秒
  ["先找內層。", "u=x²。", "別忘了 1/2。"]);  // 三層提示，最後一層不可寫出答案
```

- **topic** 限 `limits` / `derivatives` / `integrals` / `series`。
- **rank** 是三軸（步數/冷門/計算量）推出來的，不是你覺得多難。
  投稿時先給誠實的估計，複核見 `src/kernel/rubric_reviewed.js` 的先例。
- **answerKind**：`numeric`（預設）、`expression`、`antiderivative`、
  `text`（附 `answers[]` 同義詞陣列 + `canonical`）。

## 鐵律：答案必須可驗證

每一題 numeric/expression/antiderivative 答案都要通過獨立數值驗算
（`node tools/verify_answers.js --id 你的題號`）。兩條路：

1. **寫成驗算器認得的題幹形式**（首選）——標準的 ∫/∑/lim/d^n/dx^n、
   收斂半徑、係數、區域積分、參數積分…約 50 種句型。動筆前先看
   `tools/lib/verify_engine.js` 開頭的清單。
2. **自帶 `verify` 欄位**（DSL）——線積分、文字敘述題這類自動辨識
   讀不出結構的。方法清單在 `verify_engine.js` 的 `EXPLICIT_METHODS`，
   規格必須是**跟解法無關的獨立路徑**（參數化是題幹重述，OK；
   把答案再抄一遍，不 OK）。

真的驗不了（概念問答、看圖題）：跑 `node tools/verify_answers.js
--update-allowlist`，讓白名單 diff 出現在 PR 裡 —— 那是一個要說得出
理由的顯式決定，不是預設。

## PR 前的完整關卡（照順序跑）

```bash
node tools/detect_duplicates.js        # 撞衫檢查：literal/semantic 必須零新增
node tools/verify_answers.js --ci      # 答案驗算：不符 = 0、白名單無未登記
node tools/regen_all.js                # 七支產生器（uid/rubric/origin/skill_tags/…）
node tools/validate_problems.js        # 題幹 lint（\text 規則、裸英文單字…）
node tools/validate_hints.js           # 提示不可洩答案
node tools/validate_skill_graph.js     # 新 tag 要嘛被 skill 認領、要嘛列 NON_SKILL_TAGS
node tools/smoke_app_render.js
```

新增**檔案**（整包投稿）還要接四條線：`index.html` script 標籤、
`sw.js` APP_SHELL + CACHE_NAME、`tools/validate_answer_checker.js` 的
id 前綴 regex、（若自成訓練包）app.js 的 PACK_GROUPS。
清單與陷阱詳見 repo 記憶與 `docs/spec/05-content-pipeline.md`。

## 撞衫是常態，不是恥辱

這個題庫密到我們自己出題也三成撞衫（cos(sin x)−cos x 都有人出過）。
`detect_duplicates` 報 literal/semantic 就換一題，`similar` 是參考。

## 提示的紀律

三層：方向 → 關鍵步 → 收尾。最後一層**不能寫出答案本身**
（validate_hints 會擋）。罐頭句（"Identify the dominant tool…"）不算提示。
