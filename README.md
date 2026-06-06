# BuzzCalculus

> Build your calculus reflexes.

BuzzCalculus 是一個全靜態的微積分反射訓練平台（Calculus Reflex Training Platform）。

與傳統微積分題庫不同，BuzzCalculus 的目標不是照章節教學，而是訓練使用者在有限時間內快速辨識技巧、建立解題直覺，並透過大量練習補強弱點。

你不會看到：

* Chapter 3
* Chapter 4
* Chapter 5

這種課本式分類。

取而代之的是：

* Taylor Expansion
* Rationalization
* Trig Limits
* Integration by Parts
* Frullani Integrals
* Jacobians

因為真正的解題速度來自：

> 看到題目後，立刻知道該用哪個工具。

---

## Philosophy

BuzzCalculus 的核心理念很簡單：

> Don't memorize chapters.
> Recognize techniques.

許多學生學完微積分後仍然不會解題，不是因為不會計算，而是因為不知道：

* 這題該用 Taylor 嗎？
* 該有理化嗎？
* 該分部積分嗎？
* 該換變數嗎？

BuzzCalculus 專注於訓練這種技巧辨識能力。

---

## Features

### Calculus Training

* 314 題精選題庫
* 25 個技巧訓練包
* 快速訓練模式
* 每日挑戰模式
* 階梯測驗模式
* 高難度進階訓練
* 錯題重練

### Learning Analytics

* 弱點分析
* 最近表現追蹤
* 平均作答速度
* 錯題本
* 作答歷史
* 每日練習紀錄

### Answering System

* 手寫黑板模式
* 手機全螢幕黑板
* 選擇題模式
* 提示系統
* LaTeX 題目渲染

### Offline First

* 無帳號
* 無登入
* 無後端
* 所有資料保存在 localStorage
* JSON 匯出／匯入

---

## Problem Coverage

目前題庫涵蓋：

| Category                             | Problems |
| ------------------------------------ | -------: |
| Limits                               |       47 |
| Derivatives & Multivariable Calculus |      111 |
| Integrals & Multiple Integrals       |      102 |
| Series                               |       54 |

---

### Technique Packs

BuzzCalculus 以技巧為核心組織題目。

目前包含：

#### Limits

* Standard Limits
* Taylor Expansion
* Rationalization
* Squeeze Theorem
* Path Test
* Multivariable Limits

#### Differentiation

* Chain Rule
* Product Rule
* Quotient Rule
* Implicit Differentiation
* Logarithmic Differentiation
* Partial Derivatives
* Directional Derivatives
* Jacobians
* Hessians
* Wronskians

#### Integration

* u-Substitution
* Integration by Parts
* Trigonometric Substitution
* Partial Fractions
* Improper Integrals
* Double Integrals
* Triple Integrals
* Change of Variables
* Convolution Integrals

#### Series

* Geometric Series
* p-Series
* Ratio Test
* Root Test
* Integral Test
* Alternating Series
* Power Series
* Radius of Convergence
* Endpoint Analysis
* Taylor Coefficients

#### Advanced Topics

* King's Property
* Frullani Integrals
* Newton Method
* Related Rates
* Parametric Curves
* Polar Curves
* ODE Introduction
* Complex Analysis Basics

---

## Difficulty Design

BuzzCalculus 並不是競賽題庫。

題目大致分布如下：

| Difficulty                   | Ratio |
| ---------------------------- | ----: |
| Basic Warm-up                |   10% |
| Standard University Calculus |   40% |
| Advanced Technique Training  |   40% |
| Boss Problems                |   10% |

---

## Training Modes

### Quick Training

12 題混合練習。

適合作為每日暖身。

### Daily Challenge

每天固定題組。

適合建立長期練習習慣。

### Technique Training

只練一種技巧。

例如：

* Taylor
* Rationalization
* Frullani

### Advanced Training

高難度題集中訓練。

### Ladder Test

由簡到難逐步升級。

### Mistake Review

從錯題本重新抽題。

---

## Data Storage

BuzzCalculus 採用完全本機儲存。

所有資料保存在：

```text
localStorage
```

包含：

* 作答紀錄
* 錯題本
* 草稿
* 每日挑戰
* 統計資料
* 弱點分析

因此：

* 不需要登入
* 不需要帳號
* 不需要後端

換裝置時可透過 JSON 匯出／匯入搬移資料。

---

## Project Status

Current Version:

```text
v0.9.0-beta
```

BuzzCalculus 已完成：

* 核心題庫
* 學習流程
* 弱點分析
* 錯題系統
* 本機資料管理
* 作業本輸出

---

## Why Buzz?

BuzzCalculus 的名稱來自：

> Integral Bee

中的 Bee。

Bee 競賽重視速度、準確率與技巧熟練度。

BuzzCalculus 希望把這種精神帶到微積分訓練中。

> Train speed.
> Train accuracy.
> Train calculus.
