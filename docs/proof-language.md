# 白話證明（proof language）

一行一句、可以在瀏覽器裡被檢查的證明語言。沒有後端、不用 Lean。

## 它檢查什麼、不檢查什麼

三個引擎，各自誠實：

| 引擎 | 做什麼 | 綠 | 黃 | 紅 |
|---|---|---|---|---|
| 句型 | 認得每一句在做什麼（13 種句型） | 認得 | — | 讀不懂 |
| 代數 | `A = B ≤ C < D` 在目前假設下隨機取 160 個點驗 | 每段都成立 | 含未知符號（抽象 f、`lim`） | 某段不成立（附反例） |
| 推論 | 規則字典（16 條：MVT、三角不等式、夾擠、AM-GM…）比對句子形狀 | 形狀對上 | 引用了但形狀對不上 | — |

再加一層**骨架**：ε-δ 要有「任取 ε、取 δ、假設 |x−a|<δ、推到 |f(x)−L|<ε」；歸納要有基底、歸納假設、從 k+1 左式走到右式的鏈；分情況每一種都要走到目標再總結；反證要有反設與矛盾。

「數值上成立」不等於「推導出來」。一條單獨的關係式要**接得上**：至少兩段的鏈、顯然的起點（平方 ≥ 0、|sin| ≤ 1）、跟前面某條關係式等價、或某一邊在前面出現過。一行直接寫目標會標黃。

整篇結論四種：**verified**（全綠、骨架齊）、**partial**（有黃）、**incomplete**（缺骨架）、**broken**（有紅）。

## 句型

| 句型 | 例 |
|---|---|
| 任取／設／取／令（Let / Fix / Take） | `任取 ε > 0。`、`取 δ = ε/3。`、`設 x, y 為實數。` |
| 假設／若…則…（Assume / If … then） | `假設 0 < \|x − 2\| < δ。` |
| 則／所以／展開得／整理得（Then / Hence） | `則 \|3x − 6\| = 3\|x − 2\| < 3δ = ε。` |
| 由 <規則>，… （By …） | `由平均值定理，存在 c ∈ (x, y) 使 f(y) − f(x) = f'(c)(y − x)。` |
| 因為…，所以…（Because …, so …） | `因為 1 + h ≥ 0，所以 (1+h)^(k+1) ≥ (1+kh)(1+h)。` |
| 分情況／情況一：條件（Case 1:） | `分兩種情況。`、`情況一：x + y ≥ 0。`、`情況二：否則。` |
| 用歸納法／當 n = 1 時／假設 n = k 時成立 | `當 n = 1 時，左式 = 1，右式 = 1，成立。` |
| 反設／矛盾 | `反設 m 是最大的實數且 m < 1。`、`這與 m 是最大的矛盾。` |
| 故／得證 | `故 \|x + y\| ≤ \|x\| + \|y\|。` |

數學用作答同一套 ASCII；`ε δ √ ≤ ≥ ≠ ² ³ ∈ ∞` 與全形標點都會被正規化。`3x`、`k(k+1)`、`2kh` 這種隱式乘法看得懂；`1 + 2 + ... + n` 由題目的 macro 轉成可算的和。

## 檔案

- `src/kernel/proof_lang.js` — 純函式：`parse(text)`、`check(spec, text)`。
- `src/proof_lang_content.js` — 題目 spec（`BUZZ_PROOF_LANG_PROBLEMS`）與五課教學（`BUZZ_PROOF_LANG_LESSONS`）。
- `tools/validate_proof_lang.js` — 每題參考證明必須全綠；刪掉任一非 optional 行不能還全綠；翻符號要紅；一行寫目標不能全綠。
- `tools/e2e_proof_lang.js` — 畫面：即時三色、範本插入、錯 δ 紅在第 4 行、草稿存活。

## spec 欄位

```js
{
  id, family, title, difficulty, statement, prompt (TeX),
  vars: { x: { min, max, int? } },      // 取樣範圍
  given: ["a >= 0"],                     // 題目給的條件
  functions: { S: (n) => … },           // 可算的和之類
  macros: [{ pattern, replace }],        // 「1+2+...+n」→ S(n)
  goal: { relation: "S(n) = n*(n+1)/2" } | { text: ["lim_{x->2} 3x = 6", …] },
  bound: { lhs: "abs(3*x-6)", rhs: "eps" },   // ε-δ 的收尾鏈兩端
  induction: { variable: "n", base: 1 },
  skeleton: "epsilon-delta" | "induction" | "cases" | "contradiction" | "direct",
  reference: ["…", "…"],                // 參考證明
  optional: [0],                        // 刪了也該還全綠的行（宣告、標籤、可跳過的一步）
  allowUnsure: true,                    // 抽象 f 的題：允許 partial
  coach: "…"
}
```

## 已知邊界

- 抽象函數（f、f′）驗不了，只能靠規則形狀 → 黃。
- 數論與存在性的矛盾算不出來 → 黃。
- 取樣是機率式的：等式看差、不等式看方向，160 個點；極端邊界（等號成立的單點）靠容差。
