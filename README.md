# BuzzCalculus

> Build your calculus reflexes.

BuzzCalculus 是一個微積分反射訓練台。它不是課本，也不是解題聊天機器人，而是讓你快速練出：

- 看題型的速度
- 選技巧的直覺
- 計算的穩定度
- 錯題回收能力

線上版：

https://tudohuang.github.io/BuzzCalculus/

---

## What It Is

一般微積分題庫常用章節分類：

```text
極限 -> 微分 -> 積分 -> 級數
```

BuzzCalculus 更偏向技巧分類：

```text
Taylor
Rationalization
u-substitution
Integration by Parts
Partial Fraction
Frullani
Jacobian
Hessian
Boss
```

目標不是慢慢教完一整本微積分，而是讓已經有基礎的人反覆練：

```text
這題該用哪個工具？
```

---

## Current Features

- **1407 題微積分題庫**
- **171 題物理 / 化學秒殺題（理科秒殺包，含背誦型分類題）**
- **51 個技巧題包**
- **主線路線圖**
- **每日任務**
- **每週任務與本機目標**
- **題庫搜尋 / 收藏 / 題目回報**
- **Boss 專區與 Boss Rush**
- **Integral Bee、No Hint、Accuracy、Survival、Warm-up、Cooldown**
- **手機優先的選擇題練習**
- **WebWork 式答案輸入**
- **LaTeX 預覽**
- **黑板草稿**
- **錯題本（SRS 間隔重複排程）**
- **弱點分析與技巧精熟雷達**
- **練習熱力圖、連勝與每週護盾**
- **5 分鐘定位測驗（自適應開局）**
- **逐步解答（技巧 → 關鍵步驟 → 完整推導）**
- **具名模擬卷（期中 / 期末 / 轉學考 / Integral Bee）**
- **每週挑戰與成績代碼比拚**
- **成績分享卡（PNG 匯出）**
- **最近 30 題 / 最近 7 天表現**
- **本機成就**
- **Proof Lab 證明題庫**
- **JSON 匯出 / 匯入**
- **PWA 離線安裝**
- **深色模式**

所有紀錄都存在本機瀏覽器，不需要帳號，不需要後端。

---

## Training Path

首頁主線會照這條順序往下練：

```text
單變極限
-> 單變微分
-> 基礎積分
-> U-sub
-> IBP
-> 技巧積分
-> 級數與審斂
-> 多變數
-> 進階工具
-> Boss
```

如果你已經很強，可以跳關。跳關前會先做小測驗，通過後直接進入後面的關卡。

---

## Demo Problems

### Warm-Up

**Basic Limit**

$$
\lim_{x\to0}\frac{\sin x}{x}
$$

Answer:

$$
1
$$

Technique: standard limit

**Basic Derivative**

$$
\frac{d}{dx}\left(x^2e^x\right)
$$

Answer:

$$
e^x(x^2+2x)
$$

Technique: product rule

**Basic U-Sub**

$$
\int 2x\cos(x^2)\,dx
$$

Answer:

$$
\sin(x^2)+C
$$

Technique: u-substitution

---

### Advanced

**Taylor Limit**

$$
\lim_{x\to0}
\frac{\ln(1+x)-x+\frac{x^2}{2}}{x^3}
$$

Answer:

$$
\frac13
$$

Technique: Taylor expansion

**Frullani Integral**

$$
\int_0^\infty \frac{e^{-2x}-e^{-5x}}{x}\,dx
$$

Answer:

$$
\ln\frac52
$$

Technique: Frullani integral

**Lagrange Multiplier**

Maximize

$$
f(x,y)=3x+4y
$$

subject to

$$
x^2+y^2=1.
$$

Answer:

$$
5
$$

Technique: Cauchy-Schwarz / Lagrange multiplier

---

### Boss Preview

These are not the hardest problems in the bank, but they show the direction.

**Complex Residue**

$$
\frac{1}{2\pi i}
\oint_{|z|=2}
\frac{e^z}{z^3(z-1)}\,dz
$$

Answer:

$$
e-\frac52
$$

Technique: residue theorem / Laurent expansion

**Jacobian Chain Rule**

Let

$$
u=2x+y,\qquad v=x+3y,
$$

and

$$
p=u^2-v^2,\qquad q=2uv.
$$

Find

$$
\frac{\partial(p,q)}{\partial(x,y)}.
$$

Answer:

$$
20\left((2x+y)^2+(x+3y)^2\right)
$$

Technique: Jacobian chain rule / complex squaring structure

**Boss Integral**

$$
\int_0^\infty
\frac{\arctan(5x)-\arctan(2x)}{x}\,dx
$$

Answer:

$$
\frac{\pi}{2}\ln\frac52
$$

Technique: Frullani-type parameter integral

---

## Problem Coverage

| Type | Count |
| --- | ---: |
| Limits | 204 |
| Derivatives / Multivariable derivatives | 386 |
| Integrals / Multiple integrals | 612 |
| Series | 205 |
| **Calculus total** | **1407** |
| Physics (flash) | 90 |
| Chemistry (flash) | 81 |
| **Total** | **1578** |

Proof Lab currently includes **21 proof problems**. Proof problems are not included in timed sessions or daily missions.

---

## Supported Topics

**Limits**

- Standard limits
- Taylor limits
- Rationalization
- Multivariable path tests
- Squeeze-style limits
- High-order asymptotics

**Derivatives**

- Chain rule
- Product / quotient rule
- Logarithmic differentiation
- Implicit differentiation
- Parametric differentiation
- Partial derivatives
- Directional derivatives
- Jacobian
- Hessian
- Wronskian
- Lagrange multiplier
- Nabla / vector calculus

**Integrals**

- u-substitution
- Integration by parts
- Trig substitution
- Partial fraction
- Improper integrals
- Double / triple integrals
- Change of variables
- King's property
- Frullani integral
- Beta / Gamma function
- Wallis integral

**Series / Advanced**

- Geometric and p-series
- Ratio test
- Root test
- Integral test
- Alternating series
- Endpoint analysis
- Power series
- Taylor coefficients
- ODE-style problems
- Complex residues
- Bessel basics

---

## 理科秒殺（Science Flash）

微積分之外，有一批物理 / 化學題也是「看到就該秒殺」的反射題：`v=fλ`、`F=ma`、`pH`、氧化數、莫耳數。

- 題型選單多了 **物理** 與 **化學**，題包多了 **理科秒殺 / 物理速算 / 化學速算 / 轉動 · 熱力學 / 沉澱表 · 氧化還原**。
- rank 1-4，每題 20-55 秒。常數（`g=10`、`c=3×10⁸`、`k=9×10⁹`、`R=0.082`、原子量）一律寫在題幹，答案唯一且精確。

主站仍主攻微積分：**只有主動選了物理 / 化學題型或理科題包才會抽到這些題**。快速訓練、每日挑戰、每日一題、每週卷、大考模式、定位測驗、收操與主線路線圖維持純微積分，這條界線由 `tools/validate_science_gate.js` 在 CI 鎖住。

**計算題**（數值答案）：物理涵蓋運動學、拋體、牛頓定律、圓周運動、動量與碰撞、功與能量、簡諧與波、光學、電路與庫侖、熱學、近代物理、流體壓力與浮力、轉動慣量與角動量、熱力學第一定律與卡諾循環；化學涵蓋莫耳與計量、平衡係數、限量試劑、濃度與稀釋、氣體定律與分壓、酸鹼滴定、原子結構與同位素、氧化數與半反應、鍵結與 VSEPR、反應速率與平衡。

**背誦題**（分類答案）：沉澱表與溶解度規則、沉澱顏色、氧化劑 / 還原劑、活性順序、熱力學四種過程判別。這類題目在題目本身寫死誘答（`problem.distractors`），選擇題才不會冒出「收斂 / 發散」這種微積分選項。

---

## Proof Lab

Proof Lab is separate from timed practice.

It is meant for slow work:

1. Try writing the proof yourself.
2. Open the reference proof.
3. Mark it as `看懂`, `部分會`, or `還不會`.

It includes problems from basic MVT proofs to Jacobian chain rule, Hessian tests, Wronskian identities, and Todai-inspired multivariable arguments.

---

## Workbook

A BuzzCalculus workbook is a future paid idea.

The website does not provide a downloadable workbook. The current public version is the interactive trainer.

Preview page:

https://tudohuang.github.io/BuzzCalculus/workbook.html

The workbook direction is:

- curated technique drills
- printable answer spaces
- proof-writing sections
- Boss problem sets
- exam-style pacing

---

## Local Development

Open `index.html` directly, or serve the folder with any static server.

Validation commands:

```bash
node tools/validate_problems.js
node tools/validate_training_packs.js
node tools/validate_path_nodes.js
node tools/validate_answer_checker.js
node tools/validate_science_gate.js
node tools/validate_app_shell.js
node tools/smoke_app_render.js
```

---

## Release

Current version:

```text
v0.10.0-beta
```

Current target:

```text
small public beta
```

BuzzCalculus is inspired by the spirit of Integral Bee training, but it is an independent project.