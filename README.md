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

- **1116 題微積分題庫**
- **39 個技巧題包**
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
- **錯題本**
- **弱點分析**
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
| Limits | 158 |
| Derivatives / Multivariable derivatives | 307 |
| Integrals / Multiple integrals | 487 |
| Series | 164 |
| **Total** | **1116** |

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
node tools/validate_app_shell.js
node tools/smoke_app_render.js
```

---

## Release

Current version:

```text
v0.9.13-beta
```

Current target:

```text
small public beta
```

BuzzCalculus is inspired by the spirit of Integral Bee training, but it is an independent project.