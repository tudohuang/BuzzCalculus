# BuzzCalculus

> Build your calculus reflexes.

**BuzzCalculus 不是另一個微積分題庫。**

它是一個全靜態、免登入、打開就能練的 **微積分反射訓練台**。

目標不是重新教你整本微積分，而是讓你在短時間內練出：

- 看到題目後快速辨識技巧
- 選對解題工具
- 穩定提高正確率與速度
- 找出自己最常錯的題型

[立即開始訓練](https://tudohuang.github.io/BuzzCalculus/)

---

## 為什麼需要 BuzzCalculus

很多人不是不會微積分，而是看到混合題時不知道第一步該拔哪把刀。

一般題庫常常長這樣：

```text
第三章
第四章
第五章
```

BuzzCalculus 更接近這樣：

```text
Taylor
Rationalization
u-substitution
Integration by Parts
Frullani
Jacobian
Hessian
Boss
```

真正的速度來自技巧辨識。

BuzzCalculus 要練的就是這件事。

---

## 主線訓練路線

首頁不是功能清單，而是一條可以一路打下去的學習路線：

```text
單變極限
-> 單變微分
-> 基礎積分
-> U-sub
-> IBP
-> 技巧積分
-> 級數
-> 多變數
-> 進階工具
-> Boss
```

每一關進入前都有短講解。

想跳關也可以，但要先通過小測驗。

打完一局後，系統會直接告訴你：

- 本關是否通過
- 要不要重練
- 下一關是哪裡
- 哪些題目進錯題本

---

## 目前能做什麼

- **426 題微積分題庫**
- **32 個技巧題包**
- **手機優先的選擇題練習**
- **手寫黑板草稿**
- **每日任務**
- **錯題本**
- **弱點複習**
- **最近 30 題 / 最近 7 天表現**
- **段位與主線進度**
- **作答歷史**
- **JSON 匯出 / 匯入**
- **作業本式題目整理**

全部都不需要後端。

---

## 題目 Demo

完整題庫在網站內練習。這裡只放幾題展示 BuzzCalculus 的題感。

### 簡單題

**1. 標準極限**

求：

$$
\lim_{x \to 0} \frac{\sin x}{x}
$$

答案：$1$

技巧：標準極限

**2. 基礎微分**

求：

$$
\frac{d}{dx}\left(x^2 e^x\right)
$$

答案：$e^x(x^2+2x)$

技巧：Product Rule

**3. 基礎積分**

求：

$$
\int 2x\cos(x^2)\,dx
$$

答案：$\sin(x^2)+C$

技巧：u-substitution

### 進階題

**1. Taylor 極限**

求：

$$
\lim_{x \to 0} \frac{\ln(1+x)-x+\frac{x^2}{2}}{x^3}
$$

答案：$\frac{1}{3}$

技巧：Taylor Expansion

**2. Frullani Integral**

求：

$$
\int_0^\infty \frac{e^{-2x}-e^{-5x}}{x}\,dx
$$

答案：$\ln\frac{5}{2}$

技巧：Frullani Integral

**3. Lagrange Multiplier**

在 $x^2+y^2=1$ 下，求 $f(x,y)=3x+4y$ 的最大值。

答案：$5$

技巧：Cauchy / Lagrange Multiplier

### Boss Preview

這幾題是拿來展示壓迫感的，不是 BuzzCalculus 最硬的 Boss+。

真正更硬的 Bessel、三重積分變數變換、高階 Frullani 與複變混合題，不放在 README。

**1. Frullani + Inverse Trig**

求：

$$
\int_0^\infty \frac{\arctan(5x)-\arctan(2x)}{x}\,dx
$$

答案：$\frac{\pi}{2}\ln\frac{5}{2}$

技巧：Frullani Integral / Parameter Scaling

**2. Jacobian Chain Rule**

令

$$
u=2x+y,\quad v=x+3y,\quad p=u^2-v^2,\quad q=2uv.
$$

求：

$$
\frac{\partial(p,q)}{\partial(x,y)}
$$

答案：$20\left((2x+y)^2+(x+3y)^2\right)$

技巧：Jacobian Chain Rule / Complex Squaring

**3. Complex Residue**

求：

$$
\frac{1}{2\pi i}\oint_{|z|=2}\frac{e^z}{z^3(z-1)}\,dz
$$

答案：$e-\frac{5}{2}$

技巧：Residue Theorem / Laurent Expansion

完整作業本內容未公開，未來可能整理成正式版本。

---

## 題庫規模

| 類型 | 題數 |
| --- | ---: |
| 極限 | 61 |
| 微分 / 多變數微分 | 148 |
| 積分 / 重積分 | 148 |
| 級數 | 69 |
| **總計** | **426** |

---

## 題庫特色

BuzzCalculus 的題庫不是單純照章節堆題，而是以技巧為核心。

**極限**

- 標準極限
- Taylor 展開
- 有理化
- 三角極限
- 夾擠定理
- 多變數路徑測試

**微分**

- Chain Rule
- Implicit Differentiation
- Logarithmic Differentiation
- Partial Derivatives
- Directional Derivatives
- Jacobian
- Hessian
- Wronskian
- Lagrange Multiplier
- Nabla / Vector Calculus

**積分**

- u-substitution
- Integration by Parts
- Trig Substitution
- Partial Fraction
- Improper Integral
- Double / Triple Integral
- Change of Variables
- King's Property
- Frullani Integral
- Beta / Gamma Function
- Wallis Integral

**級數與進階**

- Ratio Test
- Root Test
- Integral Test
- Alternating Series
- Endpoint Analysis
- Power Series
- Taylor Coefficients
- ODE-style Problems
- Complex Basics
- Bessel Basics
- Trap Drill

---

## 適合誰

BuzzCalculus 適合已經學過微積分、想把解題速度練起來的人。

特別適合：

- 大一微積分複習
- 工學院考前暖身
- 微積分混合題訓練
- Integral Bee 風格速度練習
- 想知道自己到底哪種技巧最不穩的人

如果你完全沒學過微積分，BuzzCalculus 不會像課本一樣從零講起。

它比較像訓練場，不是講義。

---

## 手機也能練

手機版預設走選擇題，降低打字負擔。

首頁會優先顯示：

- 今日任務
- 下一關
- 主線路線
- 底部固定開始按鈕

手寫模式仍然保留，適合需要推導或草稿的題目。

---

## 全靜態，資料存在本機

BuzzCalculus 沒有帳號系統，也不需要後端。

所有紀錄都存在瀏覽器的 `localStorage`：

- 作答歷史
- 錯題本
- 每日任務
- 弱點分析
- 主線進度
- 段位資料
- 手寫草稿回顧

換裝置時可以用 JSON 匯出 / 匯入。

---

## 目前狀態

```text
v0.9.0-beta
```

BuzzCalculus 目前已進入 Beta / RC 階段。

現在重點不是繼續堆功能，而是打磨：

- 手機體驗
- 主線訓練流程
- 題庫品質
- 答案判定穩定性
- GitHub Pages 部署體驗

---

## 本機開發

這是一個純靜態專案。

可以直接開 `index.html`，也可以用任意 static server 跑。

常用檢查：

```bash
node tools/validate_problems.js
node tools/validate_training_packs.js
node tools/validate_path_nodes.js
node tools/validate_answer_checker.js
node tools/smoke_app_render.js
```

## Note

BuzzCalculus 受到 Integral Bee 類型的速度訓練文化啟發，但不是 MIT 或任何官方 Integral Bee 活動的附屬專案。

```text
Train speed.
Train accuracy.
Train calculus.
```
