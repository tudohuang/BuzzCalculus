# BuzzCalculus Gap Pack Report

日期：2026-06-06  
版本：v0.9.0-beta

## 結論

已依題庫審核補上 52 題 gap pack。

題庫總量從 262 題提升到 314 題。

目前分布：

| 題型 | 題數 |
|---|---:|
| 極限 | 47 |
| 微分 | 111 |
| 積分 | 102 |
| 級數 | 54 |

## 新增重點

這次不是泛泛加題，而是針對 95 分缺口補洞：

- Partial Fraction
- Parametric Differentiation
- Polar Curve / Polar Area
- Related Rates
- Tangent / Normal
- Linear Approximation
- Newton Method
- Curvature
- Triple Integral
- Change of Variables / Jacobian
- ODE Intro
- Root Test
- Limit Comparison
- Endpoint Analysis
- Full Taylor Expansion
- Technique Recognition

## 新增檔案

- `src/problem_gap_pack.js`

## 題庫驗證

已通過：

- `node --check src\problem_gap_pack.js`
- `node tools\validate_problems.js`
- `node tools\validate_answer_checker.js`
- `node tools\smoke_app_render.js`

答案檢查器已擴充：

- 原本 P0 測試：15 cases
- 新 gap 題 canonical answer：52 cases
- 合計：67 cases

## RC 文件同步

已重新產生：

- `reports/problem_audit_sample.md`
- `workbook/buzzcalculus_workbook.tex`

新的人工審核抽樣表仍維持 50 題，但已納入 gap pack 題目。

## 產品定位影響

這輪補題讓 BuzzCalculus 更接近：

- Calculus Techniques Workbook
- Calculus Reflex Training
- Integral Bee style trainer

新增題目不是章節補齊，而是強化技巧辨識與反射訓練。
