# BuzzCalculus P0-1 題庫人工審核抽樣表

日期：2026-06-05

Seed：`buzzcalculus-rc-audit-2026-06-05`

## 審核目標

確認題目本身沒有錯誤，公開 Beta 前錯誤率需小於 2%。

本次抽查共 50 題：

| 題型 | 目標題數 | 實際題數 | 難度分布 |
|---|---:|---:|---|
| 極限 | 10 | 10 | D1: 1 · D2: 1 · D3: 7 · D4: 1 |
| 微分 | 15 | 15 | D1: 1 · D2: 4 · D3: 3 · D4: 7 |
| 積分 | 15 | 15 | D1: 1 · D2: 1 · D3: 3 · D4: 10 |
| 級數 | 10 | 10 | D1: 1 · D2: 1 · D3: 4 · D4: 4 |

## 審核標準

每題檢查：

- 題目是否正確
- 答案是否正確
- 難度是否合理
- Tags 是否合理
- 提示是否合理

建議填寫方式：

- 若題目完全通過，勾選該題所有審核項與「通過」。
- 若只是措辭、tag、提示可優化，但不影響答案，請在備註寫「Minor」。
- 若題目、答案或判定方向錯誤，請在備註寫「Major」，並不要勾選「通過」。
- 錯誤率只計 Major；Minor 納入後續修正清單。

錯誤率計算：

```text
錯誤題數 / 50
```

驗收標準：

```text
錯誤率 < 2%
```

也就是最多只能有 0 題重大錯誤；若有 1 題錯，錯誤率就是 2%，不符合「小於 2%」。

## 抽樣清單

## 01. 極限 · lim-020

- 題型：極限
- 難度：4/4
- 答案型態：數值
- Tags：無
- Time limit：70s
- Tab limit：1

題目：

```tex
\lim_{x \to 0}\frac{\arctan x-x}{x^3}
```

參考答案：

```text
-1/3
```

提示：

```text
自動提示
```

解法 / 說明：

```text
arctan x = x-x^3/3+...。
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 02. 極限 · lim-039

- 題型：極限
- 難度：3/4
- 答案型態：數值
- Tags：multivariable, path-test, dne
- Time limit：80s
- Tab limit：1
- Source: Buzz original

題目：

```tex
\lim_{(x,y)\to(0,0)}\frac{x^2y}{x^4+y^2}
```

參考答案：

```text
dne
```

提示：

```text
Try y=kx^2. / The expression becomes k/(1+k^2). / Different k gives different limits.
```

解法 / 說明：

```text
Along y=kx^2 the expression is k/(1+k^2). Since this depends on k, the limit does not exist.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 03. 極限 · lim-040

- 題型：極限
- 難度：2/4
- 答案型態：數值
- Tags：standard-limit, log, infinity
- Time limit：55s
- Tab limit：1
- Source: Buzz original

題目：

```tex
\lim_{x\to\infty}x\log\left(1+\frac{2}{x}\right)
```

參考答案：

```text
2
```

提示：

```text
Let u=2/x. / Use log(1+u)~u. / Then x*(2/x) remains.
```

解法 / 說明：

```text
Since log(1+2/x)~2/x, the limit is 2.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 04. 極限 · lim-004

- 題型：極限
- 難度：1/4
- 答案型態：數值
- Tags：無
- Time limit：30s
- Tab limit：2

題目：

```tex
\lim_{x \to \infty}\frac{3x^2-x+7}{2x^2+5}
```

參考答案：

```text
3/2
```

提示：

```text
自動提示
```

解法 / 說明：

```text
最高次項係數比是 3/2。
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 05. 極限 · lim-032

- 題型：極限
- 難度：3/4
- 答案型態：數值
- Tags：multivariable, path-test, dne
- Time limit：70s
- Tab limit：1
- Source: Buzz original

題目：

```tex
\lim_{(x,y)\to(0,0)}\frac{x^2-y^2}{x^2+y^2}
```

參考答案：

```text
dne
```

提示：

```text
Test y=0 and x=0. / The two paths give different values. / Different path values mean DNE.
```

解法 / 說明：

```text
Along y=0 the value is 1; along x=0 the value is -1. The limit does not exist.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 06. 極限 · lim-027

- 題型：極限
- 難度：3/4
- 答案型態：數值
- Tags：multivariable, path-test, dne
- Time limit：70s
- Tab limit：1
- Source: Buzz original

題目：

```tex
\lim_{(x,y)\to(0,0)}\frac{xy}{x^2+y^2}
```

參考答案：

```text
dne
```

提示：

```text
試兩條不同路徑。 / 沿 y=x 與 y=-x 比較。 / 如果結果不同，極限不存在。
```

解法 / 說明：

```text
沿 y=x 得 1/2；沿 y=-x 得 -1/2。路徑極限不同，所以 DNE。
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 07. 極限 · lim-038

- 題型：極限
- 難度：3/4
- 答案型態：數值
- Tags：taylor, trig-limit
- Time limit：70s
- Tab limit：1
- Source: Buzz original

題目：

```tex
\lim_{x\to0}\frac{\sin x-x\cos x}{x^3}
```

參考答案：

```text
1/3
```

提示：

```text
Expand sin x and x cos x. / sin x=x-x^3/6+... / x cos x=x-x^3/2+...
```

解法 / 說明：

```text
sin x-x cos x=(x-x^3/6)-(x-x^3/2)+O(x^5)=x^3/3+O(x^5).
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 08. 極限 · lim-036

- 題型：極限
- 難度：3/4
- 答案型態：數值
- Tags：taylor, log
- Time limit：70s
- Tab limit：1
- Source: Buzz original

題目：

```tex
\lim_{x\to0}\frac{\log(1+x+x^2)-x}{x^2}
```

參考答案：

```text
1/2
```

提示：

```text
Let u=x+x^2. / log(1+u)=u-u^2/2+O(u^3). / Keep terms through x^2.
```

解法 / 說明：

```text
log(1+x+x^2)=x+x^2-(x^2/2)+O(x^3)=x+x^2/2+O(x^3). The limit is 1/2.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 09. 極限 · lim-034

- 題型：極限
- 難度：3/4
- 答案型態：數值
- Tags：multivariable, squeeze
- Time limit：70s
- Tab limit：1
- Source: Buzz original

題目：

```tex
\lim_{(x,y)\to(0,0)}\frac{x^3}{x^2+y^2}
```

參考答案：

```text
0
```

提示：

```text
Use |x| <= sqrt(x^2+y^2). / Then |x^3|/(x^2+y^2) <= r. / r tends to 0.
```

解法 / 說明：

```text
Let r=sqrt(x^2+y^2). Since |x|<=r, the absolute value is <= r^3/r^2=r, hence the limit is 0.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 10. 極限 · lim-031

- 題型：極限
- 難度：3/4
- 答案型態：數值
- Tags：multivariable, squeeze
- Time limit：70s
- Tab limit：1
- Source: Buzz original

題目：

```tex
\lim_{(x,y)\to(0,0)}\frac{x^2y^2}{x^2+y^2}
```

參考答案：

```text
0
```

提示：

```text
Use polar size r^2=x^2+y^2. / The numerator has order 4 and denominator order 2. / The whole expression is bounded by a constant times r^2.
```

解法 / 說明：

```text
With x=r cos t, y=r sin t, the expression is r^2 cos^2 t sin^2 t, so the limit is 0.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 11. 微分 · gap-der-polar-001

- 題型：微分
- 難度：4/4
- 答案型態：數值
- Tags：polar-curve, parametric, slope
- Time limit：95s
- Tab limit：1
- Source: Buzz gap pack

題目：

```tex
r=1+\cos\theta.\ \left.\frac{dy}{dx}\right|_{\theta=\pi/2}
```

參考答案：

```text
1
```

提示：

```text
Use x=r cos theta and y=r sin theta. / dy/dx=(r' sin theta+r cos theta)/(r' cos theta-r sin theta). / At pi/2, r=1 and r'=-1.
```

解法 / 說明：

```text
The numerator and denominator are both -1, so the slope is 1.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 12. 微分 · gap-der-app-007

- 題型：微分
- 難度：3/4
- 答案型態：數值
- Tags：curvature, application
- Time limit：80s
- Tab limit：1
- Source: Buzz gap pack

題目：

```tex
\text{Curvature of }y=x^2\text{ at }x=0
```

參考答案：

```text
2
```

提示：

```text
Curvature is |y''|/(1+(y')^2)^{3/2}. / y'=2x and y''=2. / At x=0, the denominator is 1.
```

解法 / 說明：

```text
The curvature is 2.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 13. 微分 · gap-der-app-006

- 題型：微分
- 難度：2/4
- 答案型態：數值
- Tags：newton-method, application
- Time limit：70s
- Tab limit：1
- Source: Buzz gap pack

題目：

```tex
\text{One Newton step for }f(x)=x^2-2\text{ from }x_0=1
```

參考答案：

```text
3/2
```

提示：

```text
Newton: x1=x0-f(x0)/f'(x0). / f(1)=-1. / f'(1)=2.
```

解法 / 說明：

```text
x1=1-(-1)/2=3/2.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 14. 微分 · gap-tech-007

- 題型：微分
- 難度：1/4
- 答案型態：文字判定
- Tags：technique-recognition, parametric
- Time limit：45s
- Tab limit：1
- Source: Buzz technique recognition

題目：

```tex
x=t^2,\ y=t^3.\ \text{Which differentiation technique?}
```

參考答案：

```text
parametric differentiation
```

提示：

```text
x and y are both functions of t. / Compute dy/dt and dx/dt. / Then divide.
```

解法 / 說明：

```text
Use parametric differentiation.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 15. 微分 · td-der-004

- 題型：微分
- 難度：4/4
- 答案型態：式子
- Tags：無
- Time limit：50s
- Tab limit：1
- Source: 東大

題目：

```tex
\frac{d}{dx}\left(\log(5+3\cos x)\right)
```

參考答案：

```text
-3*sin(x)/(5+3*cos(x))
```

提示：

```text
自動提示
```

解法 / 說明：

```text
鏈鎖律，內層導數是 -3 sin x。
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 16. 微分 · td-der-003

- 題型：微分
- 難度：4/4
- 答案型態：式子
- Tags：無
- Time limit：55s
- Tab limit：1
- Source: 東大

題目：

```tex
\frac{d}{dx}\left(x\log(1+x)\right)
```

參考答案：

```text
log(1+x)+x/(1+x)
```

提示：

```text
自動提示
```

解法 / 說明：

```text
乘法法則。這也是展開 (1+x)^x 時會出現的核心項。
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 17. 微分 · td-der-002

- 題型：微分
- 難度：4/4
- 答案型態：式子
- Tags：無
- Time limit：60s
- Tab limit：1
- Source: 東大

題目：

```tex
\frac{d}{dx}\left[\frac{1}{8}(35x^4-30x^2+3)\right]
```

參考答案：

```text
(35*x^3-15*x)/2
```

提示：

```text
自動提示
```

解法 / 說明：

```text
這是 Legendre P_4 的導數，逐項微分即可。
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 18. 微分 · td-der-001

- 題型：微分
- 難度：4/4
- 答案型態：式子
- Tags：無
- Time limit：100s
- Tab limit：1
- Source: 東大

題目：

```tex
\frac{d^3}{dx^3}\arctan\frac1x
```

參考答案：

```text
2*(1-3*x^2)/(1+x^2)^3
```

提示：

```text
自動提示
```

解法 / 說明：

```text
先算 y'=-1/(1+x^2)，再連續微分兩次。
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 19. 微分 · gap-der-app-003

- 題型：微分
- 難度：3/4
- 答案型態：數值
- Tags：related-rates, implicit-differentiation
- Time limit：85s
- Tab limit：1
- Source: Buzz gap pack

題目：

```tex
\text{Ladder length }10,\ x=6,\ dx/dt=2.\ dy/dt=?
```

參考答案：

```text
-3/2
```

提示：

```text
x^2+y^2=100. / At x=6, y=8. / 2x dx/dt+2y dy/dt=0.
```

解法 / 說明：

```text
dy/dt=-(x/y)dx/dt=-(6/8)*2=-3/2.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 20. 微分 · gap-der-app-001

- 題型：微分
- 難度：3/4
- 答案型態：數值
- Tags：related-rates, volume
- Time limit：80s
- Tab limit：1
- Source: Buzz gap pack

題目：

```tex
\text{A sphere has }r=3,\ dr/dt=2.\ \frac{dV}{dt}=?
```

參考答案：

```text
72*pi
```

提示：

```text
V=(4/3)pi r^3. / dV/dt=4pi r^2 dr/dt. / Substitute r=3 and dr/dt=2.
```

解法 / 說明：

```text
dV/dt=4pi(9)(2)=72pi.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 21. 微分 · gap-der-app-005

- 題型：微分
- 難度：2/4
- 答案型態：數值
- Tags：linear-approximation, application
- Time limit：65s
- Tab limit：1
- Source: Buzz gap pack

題目：

```tex
\text{Linear approximation of }\sqrt{4.04}
```

參考答案：

```text
2.01
```

提示：

```text
Use f(x)=sqrt x near x=4. / f'(4)=1/4. / dx=0.04.
```

解法 / 說明：

```text
sqrt(4.04)≈2+(1/4)(0.04)=2.01.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 22. 微分 · gap-der-app-004

- 題型：微分
- 難度：2/4
- 答案型態：數值
- Tags：tangent-normal, derivative
- Time limit：60s
- Tab limit：1
- Source: Buzz gap pack

題目：

```tex
\text{Normal slope to }y=x^2\text{ at }x=2
```

參考答案：

```text
-1/4
```

提示：

```text
The tangent slope is y'=2x. / At x=2, tangent slope is 4. / Normal slope is the negative reciprocal.
```

解法 / 說明：

```text
The normal slope is -1/4.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 23. 微分 · gap-der-app-002

- 題型：微分
- 難度：2/4
- 答案型態：數值
- Tags：related-rates, area
- Time limit：70s
- Tab limit：1
- Source: Buzz gap pack

題目：

```tex
\text{A circle has }r=5,\ dr/dt=0.2.\ \frac{dA}{dt}=?
```

參考答案：

```text
2*pi
```

提示：

```text
A=pi r^2. / dA/dt=2pi r dr/dt. / Substitute r=5.
```

解法 / 說明：

```text
dA/dt=2pi(5)(0.2)=2pi.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 24. 微分 · der-083

- 題型：微分
- 難度：4/4
- 答案型態：數值
- Tags：complex, laurent, residue
- Time limit：75s
- Tab limit：1
- Source: Buzz advanced

題目：

```tex
\text{Coefficient of }z^{-1}\text{ in }e^z/z^3
```

參考答案：

```text
1/2
```

提示：

```text
Use e^z=sum z^n/n!. / After dividing by z^3, z^{-1} occurs when n=2. / The coefficient is 1/2!.
```

解法 / 說明：

```text
e^z/z^3=sum z^{n-3}/n!, so z^{-1} comes from n=2 and has coefficient 1/2.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 25. 微分 · der-048

- 題型：微分
- 難度：4/4
- 答案型態：數值
- Tags：total-differential-min, optimization, quadratic, hessian
- Time limit：100s
- Tab limit：1
- Source: Buzz advanced

題目：

```tex
\min_{x,y}\left(3x^2+2xy+2y^2-8x-6y\right)
```

參考答案：

```text
-9
```

提示：

```text
Set partial derivatives equal to zero. / The equations reduce to 3x+y=4 and x+2y=3. / Evaluate at the solution.
```

解法 / 說明：

```text
The critical point is (1,1), and the minimum value is -9.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 26. 積分 · int-056

- 題型：積分
- 難度：4/4
- 答案型態：數值
- Tags：integration-by-parts, ibp, inverse-trig, definite-integral
- Time limit：100s
- Tab limit：1
- Source: Buzz hard integrals

題目：

```tex
\int_0^1 x\arctan x\,dx
```

參考答案：

```text
pi/4-1/2
```

提示：

```text
Use u=arctan x and dv=x dx. / Then x^2/(1+x^2)=1-1/(1+x^2). / Evaluate from 0 to 1.
```

解法 / 說明：

```text
IBP gives pi/8 - (1/2)int_0^1 x^2/(1+x^2)dx = pi/8 - 1/2 + pi/8 = pi/4-1/2.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 27. 積分 · gap-int-triple-006

- 題型：積分
- 難度：3/4
- 答案型態：數值
- Tags：triple-integral, spherical-coordinates, volume
- Time limit：70s
- Tab limit：1
- Source: Buzz gap pack

題目：

```tex
\text{Volume of the ball }x^2+y^2+z^2\le4
```

參考答案：

```text
32*pi/3
```

提示：

```text
The radius is 2. / Use 4pi r^3/3. / Substitute r=2.
```

解法 / 說明：

```text
The volume is (4/3)pi(2^3)=32pi/3.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 28. 積分 · gap-int-triple-002

- 題型：積分
- 難度：2/4
- 答案型態：數值
- Tags：triple-integral, iterated-integral
- Time limit：75s
- Tab limit：1
- Source: Buzz gap pack

題目：

```tex
\int_0^1\int_0^1\int_0^1 (x+y+z)\,dz\,dy\,dx
```

參考答案：

```text
3/2
```

提示：

```text
Use symmetry. / The average of x, y, and z on the unit cube is 1/2 each. / Add three copies.
```

解法 / 說明：

```text
Each coordinate contributes 1/2, so the total is 3/2.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 29. 積分 · int-004

- 題型：積分
- 難度：1/4
- 答案型態：不定積分
- Tags：無
- Time limit：35s
- Tab limit：2

題目：

```tex
\int e^{3x}\,dx
```

參考答案：

```text
exp(3*x)/3
```

提示：

```text
自動提示
```

解法 / 說明：

```text
鏈鎖律反向使用。
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 30. 積分 · gap-int-triple-005

- 題型：積分
- 難度：3/4
- 答案型態：數值
- Tags：triple-integral, cylindrical-coordinates, volume
- Time limit：70s
- Tab limit：1
- Source: Buzz gap pack

題目：

```tex
\text{Volume of the cylinder }x^2+y^2\le4,\ 0\le z\le3
```

參考答案：

```text
12*pi
```

提示：

```text
Radius is 2. / Base area is 4pi. / Height is 3.
```

解法 / 說明：

```text
The volume is pi(2^2)(3)=12pi.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 31. 積分 · gap-int-triple-003

- 題型：積分
- 難度：3/4
- 答案型態：數值
- Tags：triple-integral, volume, simplex
- Time limit：80s
- Tab limit：1
- Source: Buzz gap pack

題目：

```tex
\iiint_{x+y+z\le 1,\ x,y,z\ge0}1\,dV
```

參考答案：

```text
1/6
```

提示：

```text
This is a tetrahedron. / Intercepts are all 1. / Volume is 1/6.
```

解法 / 說明：

```text
The standard simplex in R^3 has volume 1/6.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 32. 積分 · int-054

- 題型：積分
- 難度：4/4
- 答案型態：不定積分
- Tags：integration-by-parts, ibp, exponential, trig
- Time limit：95s
- Tab limit：1
- Source: Buzz hard integrals

題目：

```tex
\int e^x\sin x\,dx
```

參考答案：

```text
exp(x)*(sin(x)-cos(x))/2
```

提示：

```text
Use IBP twice or the cyclic method. / The same integral returns after two steps. / Solve the resulting algebraic equation.
```

解法 / 說明：

```text
Let I=int e^x sin x dx. Two IBP steps give 2I=e^x(sin x-cos x).
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 33. 積分 · int-043

- 題型：積分
- 難度：4/4
- 答案型態：不定積分
- Tags：substitution, u-sub, radical, log
- Time limit：95s
- Tab limit：1
- Source: Buzz hard integrals

題目：

```tex
\int \frac{x}{\sqrt{1+x^2}\left(1+\sqrt{1+x^2}\right)}\,dx
```

參考答案：

```text
log(1+sqrt(1+x^2))
```

提示：

```text
Let u=sqrt(1+x^2). / Then du=x/sqrt(1+x^2) dx. / The integral becomes int du/(1+u).
```

解法 / 說明：

```text
With u=sqrt(1+x^2), the integrand becomes du/(1+u), so the answer is log(1+sqrt(1+x^2)).
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 34. 積分 · int-076

- 題型：積分
- 難度：4/4
- 答案型態：數值
- Tags：frullani, rational, improper-integral
- Time limit：105s
- Tab limit：1
- Source: Buzz advanced

題目：

```tex
\int_0^{\infty}\frac{1}{x}\left(\frac{1}{1+x}-\frac{1}{1+6x}\right)dx
```

參考答案：

```text
log(6)
```

提示：

```text
Use f(t)=1/(1+t). / The scale ratio is 6/1. / The integral equals log 6.
```

解法 / 說明：

```text
By Frullani, the value is log 6.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 35. 積分 · int-075

- 題型：積分
- 難度：4/4
- 答案型態：數值
- Tags：frullani, rational, improper-integral
- Time limit：110s
- Tab limit：1
- Source: Buzz advanced

題目：

```tex
\int_0^{\infty}\frac{1}{x}\left(\frac{1}{1+2x}-\frac{1}{1+5x}\right)dx
```

參考答案：

```text
log(5/2)
```

提示：

```text
Use f(t)=1/(1+t). / f(0)=1 and f(infinity)=0. / Scales are 2 and 5.
```

解法 / 說明：

```text
Frullani gives log(5/2).
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 36. 積分 · int-074

- 題型：積分
- 難度：4/4
- 答案型態：數值
- Tags：frullani, inverse-trig, improper-integral
- Time limit：115s
- Tab limit：1
- Source: Buzz advanced

題目：

```tex
\int_0^{\infty}\frac{\arctan(5x)-\arctan(2x)}{x}\,dx
```

參考答案：

```text
pi*log(5/2)/2
```

提示：

```text
Use Frullani with f(t)=arctan t. / f(infinity)-f(0)=pi/2. / The scale ratio is 5/2.
```

解法 / 說明：

```text
Frullani gives (pi/2)log(5/2).
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 37. 積分 · int-073

- 題型：積分
- 難度：4/4
- 答案型態：數值
- Tags：frullani, trig, improper-integral
- Time limit：105s
- Tab limit：1
- Source: Buzz advanced

題目：

```tex
\int_0^{\infty}\frac{\sin x\sin(4x)}{x}\,dx
```

參考答案：

```text
log(5/3)/2
```

提示：

```text
Product-to-sum gives cosine frequencies 3 and 5. / Apply Frullani to cos(3x)-cos(5x). / Remember the factor 1/2.
```

解法 / 說明：

```text
The integral equals (1/2)log(5/3).
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 38. 積分 · int-072

- 題型：積分
- 難度：4/4
- 答案型態：數值
- Tags：frullani, trig, improper-integral
- Time limit：105s
- Tab limit：1
- Source: Buzz advanced

題目：

```tex
\int_0^{\infty}\frac{\sin(2x)\sin(6x)}{x}\,dx
```

參考答案：

```text
log(2)/2
```

提示：

```text
Use product-to-sum. / The frequencies become 4 and 8. / Then use the cosine Frullani identity.
```

解法 / 說明：

```text
The value is (1/2)log(8/4)=log(2)/2.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 39. 積分 · int-071

- 題型：積分
- 難度：4/4
- 答案型態：數值
- Tags：frullani, trig, improper-integral
- Time limit：110s
- Tab limit：1
- Source: Buzz advanced

題目：

```tex
\int_0^{\infty}\frac{\sin(3x)\sin(8x)}{x}\,dx
```

參考答案：

```text
log(11/5)/2
```

提示：

```text
Use 2sin A sin B = cos(A-B)-cos(A+B). / Then apply the cosine Frullani identity. / The ratio is (8+3)/(8-3).
```

解法 / 說明：

```text
The integral is (1/2)int_0^infty (cos 5x - cos 11x)/x dx = (1/2)log(11/5).
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 40. 積分 · int-070

- 題型：積分
- 難度：4/4
- 答案型態：數值
- Tags：frullani, cosine-integral, improper-integral
- Time limit：95s
- Tab limit：1
- Source: Buzz advanced

題目：

```tex
\int_0^{\infty}\frac{\cos(3x)-\cos(9x)}{x}\,dx
```

參考答案：

```text
log(3)
```

提示：

```text
Use log(b/a). / Here b/a=9/3. / So the value is log 3.
```

解法 / 說明：

```text
The integral equals log(9/3)=log 3.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 41. 級數 · td-ser-004

- 題型：級數
- 難度：4/4
- 答案型態：數值
- Tags：無
- Time limit：60s
- Tab limit：1
- Source: 東大

題目：

```tex
\sum_{n=1}^{\infty}\frac{n^2}{3^n}
```

參考答案：

```text
3/2
```

提示：

```text
自動提示
```

解法 / 說明：

```text
公式 sum n^2 r^n = r(1+r)/(1-r)^3，取 r=1/3。
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 42. 級數 · gap-ser-lc-002

- 題型：級數
- 難度：3/4
- 答案型態：文字判定
- Tags：limit-comparison, p-series
- Time limit：75s
- Tab limit：1
- Source: Buzz gap pack

題目：

```tex
\sum_{n=1}^{\infty}\frac{n+1}{n^3+1}\ \text{ converges or diverges?}
```

參考答案：

```text
convergent
```

提示：

```text
Compare with 1/n^2. / The term behaves like n/n^3. / p=2 converges.
```

解法 / 說明：

```text
Limit comparison with 1/n^2 shows convergence.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 43. 級數 · ser-038

- 題型：級數
- 難度：2/4
- 答案型態：數值
- Tags：taylor, coefficient
- Time limit：50s
- Tab limit：1
- Source: Buzz original

題目：

```tex
\text{Coefficient of }x^3\text{ in }\log(1+x)
```

參考答案：

```text
1/3
```

提示：

```text
log(1+x)=x-x^2/2+x^3/3-... / Read the x^3 coefficient. / The sign is positive.
```

解法 / 說明：

```text
The coefficient of x^3 in log(1+x) is 1/3.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 44. 級數 · ser-028

- 題型：級數
- 難度：1/4
- 答案型態：文字判定
- Tags：p-series
- Time limit：45s
- Tab limit：1
- Source: Buzz original

題目：

```tex
\sum_{n=1}^{\infty}\frac{1}{n^2}
```

參考答案：

```text
收斂
```

提示：

```text
這是 p 級數。 / p=2。 / p>1 時收斂。
```

解法 / 說明：

```text
p 級數 sum 1/n^p 在 p>1 時收斂，因此此級數收斂。
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 45. 級數 · td-ser-003

- 題型：級數
- 難度：4/4
- 答案型態：數值
- Tags：無
- Time limit：105s
- Tab limit：1
- Source: 東大

題目：

```tex
\sum_{n=1}^{\infty}\frac{(2n-1)!!}{(2n)!!}\cdot\frac1n
```

參考答案：

```text
2*log(2)
```

提示：

```text
自動提示
```

解法 / 說明：

```text
用 int_0^{pi/2} sin^{2n}x dx 表示雙階乘比，再交換求和。
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 46. 級數 · td-ser-002

- 題型：級數
- 難度：4/4
- 答案型態：數值
- Tags：無
- Time limit：110s
- Tab limit：1
- Source: 東大

題目：

```tex
\text{Coefficient of }x^5\text{ in }e^{2\arcsin x}
```

參考答案：

```text
13/12
```

提示：

```text
自動提示
```

解法 / 說明：

```text
arcsin x=x+x^3/6+3x^5/40+...，再取 exp。
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 47. 級數 · td-ser-001

- 題型：級數
- 難度：4/4
- 答案型態：數值
- Tags：無
- Time limit：100s
- Tab limit：1
- Source: 東大

題目：

```tex
\text{Coefficient of }x^6\text{ in }(1+x)^x
```

參考答案：

```text
33/40
```

提示：

```text
自動提示
```

解法 / 說明：

```text
令 (1+x)^x=exp(x log(1+x))，展開到 x^6。
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 48. 級數 · gap-ser-lc-001

- 題型：級數
- 難度：3/4
- 答案型態：文字判定
- Tags：limit-comparison, harmonic
- Time limit：75s
- Tab limit：1
- Source: Buzz gap pack

題目：

```tex
\sum_{n=1}^{\infty}\frac{3n^2+1}{n^3+2}\ \text{ converges or diverges?}
```

參考答案：

```text
divergent
```

提示：

```text
Compare with 1/n. / The term behaves like 3/n. / The harmonic series diverges.
```

解法 / 說明：

```text
Limit comparison with 1/n gives a nonzero constant, so the series diverges.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 49. 級數 · gap-ser-root-002

- 題型：級數
- 難度：3/4
- 答案型態：數值
- Tags：root-test, power-series, radius
- Time limit：85s
- Tab limit：1
- Source: Buzz gap pack

題目：

```tex
\text{Radius of convergence of }\sum_{n=1}^{\infty}\left(\frac{n}{n+1}\right)^n x^n
```

參考答案：

```text
1
```

提示：

```text
Use the root test. / The nth root is (n/(n+1))|x|. / The factor tends to 1.
```

解法 / 說明：

```text
The root test gives |x|<1, so R=1.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

---

## 50. 級數 · gap-ser-root-001

- 題型：級數
- 難度：3/4
- 答案型態：數值
- Tags：root-test, power-series, radius
- Time limit：75s
- Tab limit：1
- Source: Buzz gap pack

題目：

```tex
\text{Radius of convergence of }\sum_{n=1}^{\infty}\frac{3^n}{n^2}x^n
```

參考答案：

```text
1/3
```

提示：

```text
Use the root test. / The nth root behaves like 3|x|. / Require 3|x|<1.
```

解法 / 說明：

```text
The radius is 1/3.
```

審核：

- [ ] 題目正確
- [ ] 答案正確
- [ ] 難度合理
- [ ] Tags 合理
- [ ] 提示合理
- [ ] 通過

備註：

> 

