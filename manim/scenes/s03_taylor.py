"""Taylor 多項式逼近 eˣ：T₁ … T₇ 輪流出現，貼住曲線的範圍越來越寬。

「貼住」說清楚：|eˣ − Tₙ(x)| < 0.1 的區間（包含 0 的那一段），用二分法算端點。
"""

import math

from manim import *  # noqa: F401,F403

from buzz_style import (
    BLUE, GOLD, GOLD_DARK, GREEN, INK, MUTED, RED,
    BuzzScene, CAP_TM, M, T, TM, axes, fmt, title,
)

X_MIN, X_MAX = -4.0, 3.0
Y_MIN, Y_MAX = -2.0, 12.0
TOL = 0.1
NMAX = 7


def taylor(n):
    return lambda x: sum(x ** k / math.factorial(k) for k in range(n + 1))


def err(n, x):
    return abs(math.exp(x) - taylor(n)(x))


def good_interval(n, step=0.001):
    """包含 0、且 |eˣ − Tₙ| < TOL 的最大區間，端點用二分法逼到 1e-9。"""
    def edge(direction):
        x = 0.0
        while err(n, x + direction * step) < TOL:
            x += direction * step
        lo, hi = x, x + direction * step          # lo 合格、hi 不合格
        for _ in range(60):
            mid = (lo + hi) / 2
            if err(n, mid) < TOL:
                lo = mid
            else:
                hi = mid
        return lo
    return edge(-1), edge(+1)


INTERVALS = {n: good_interval(n) for n in range(1, NMAX + 1)}
VALUES_AT_1 = {n: taylor(n)(1.0) for n in range(1, NMAX + 1)}

# 自我檢查：區間逐次變寬；Tₙ(1) 單調逼近 e；端點真的是 0.1 的邊界
for n in range(2, NMAX + 1):
    a0, b0 = INTERVALS[n - 1]
    a1, b1 = INTERVALS[n]
    assert a1 < a0 and b1 > b0
    assert VALUES_AT_1[n - 1] < VALUES_AT_1[n] < math.e
for n, (a, b) in INTERVALS.items():
    assert abs(err(n, a) - TOL) < 1e-6 and abs(err(n, b) - TOL) < 1e-6
    assert X_MIN < a and b < X_MAX


def term_tex(k):
    if k == 0:
        return "1"
    if k == 1:
        return "x"
    return rf"\frac{{x^{k}}}{{{k}!}}"


def formula(n):
    parts = [r"e^x", r"\approx", term_tex(0)]
    for k in range(1, n + 1):
        parts += ["+", term_tex(k)]
    return M(*parts, size=40)


def clipped_plot(ax, fn, color, width):
    """只畫 y 落在座標範圍內的部分；邊界用二分法切準。"""
    def inside(x):
        y = fn(x)
        return Y_MIN <= y <= Y_MAX

    def cut(a, b):  # a 在內、b 在外
        for _ in range(50):
            m = (a + b) / 2
            if inside(m):
                a = m
            else:
                b = m
        return a

    xs = [X_MIN + i * (X_MAX - X_MIN) / 1400 for i in range(1401)]
    pieces, start = [], None
    for i, x in enumerate(xs):
        if inside(x) and start is None:
            start = x if i == 0 else cut(x, xs[i - 1])
        if start is not None and (not inside(x) or i == len(xs) - 1):
            end = x if inside(x) else cut(xs[i - 1], x)
            pieces.append((start, end))
            start = None
    return VGroup(*[
        ax.plot(fn, x_range=[a, b, (b - a) / 200], color=color, stroke_width=width)
        for a, b in pieces if b - a > 1e-3
    ])


class TaylorExp(BuzzScene):
    def construct(self):
        head = title("Taylor 多項式：用多項式貼住 eˣ")
        ax = axes([X_MIN, X_MAX, 1], [Y_MIN, Y_MAX, 2], 8.4, 4.3)
        ax.move_to([-2.35, -0.8, 0])
        exp_curve = clipped_plot(ax, math.exp, BLUE, 6)
        exp_lbl = M(r"y=e^x", size=36, color=BLUE).next_to(ax.c2p(math.log(11), 11), LEFT, buff=0.15)

        self.play(FadeIn(head), Create(ax), run_time=1.0)
        self.play(Create(exp_curve), FadeIn(exp_lbl), run_time=1.2)
        self.say(TM(r"在 $x=0$ 附近用多項式模仿 $e^x$：值、斜率、彎曲，一項一項對上", size=CAP_TM))

        panel_x = 4.65

        def panel(n):
            a, b = INTERVALS[n]
            g = VGroup(
                M(rf"n = {n}", size=40, color=RED),
                M(rf"T_{n}(1) = {VALUES_AT_1[n]:.5f}", size=36, color=RED),
                M(rf"e = {math.e:.5f}\ldots", size=36, color=BLUE),
                TM(r"誤差 $<0.1$ 的範圍", size=32, color=GREEN),
                M(rf"[{fmt(a, 2)},\ {fmt(b, 2)}]", size=36, color=GREEN),
            ).arrange(DOWN, aligned_edge=LEFT, buff=0.24)
            g.move_to([panel_x, -0.35, 0])
            return g

        def band(n):
            a, b = INTERVALS[n]
            y0 = ax.c2p(0, 0)[1]
            return Line([ax.c2p(a, 0)[0], y0, 0], [ax.c2p(b, 0)[0], y0, 0],
                        color=GREEN, stroke_width=12).set_opacity(0.75)

        f = formula(1).move_to([0, 2.45, 0])
        poly = clipped_plot(ax, taylor(1), RED, 5)
        pnl, bd = panel(1), band(1)
        self.play(Write(f), Create(poly), run_time=1.4)
        self.play(FadeIn(pnl), Create(bd), run_time=0.8)
        self.say(TM(r"$T_1$ 是切線：只在 0 旁邊一小段準（綠色：誤差小於 0.1）", size=CAP_TM))
        self.wait(1.6)

        for n in range(2, NMAX + 1):
            new_f = formula(n).move_to([0, 2.45, 0])
            if new_f.width > 13.4:
                new_f.scale_to_fit_width(13.4)
            new_poly = clipped_plot(ax, taylor(n), RED, 5)
            new_pnl, new_bd = panel(n), band(n)
            self.play(
                TransformMatchingTex(f, new_f),
                Transform(poly, new_poly),
                FadeOut(pnl), FadeIn(new_pnl),
                Transform(bd, new_bd),
                run_time=1.3,
            )
            f, pnl = new_f, new_pnl
            if n == 2:
                self.say("每多一項，就多對上一階導數，綠色範圍往兩邊長")
            if n == 4:
                self.say(TM(r"$T_n(1)$ 一步步逼近 $e = 2.71828\ldots$", size=CAP_TM))
            self.wait(1.4 if n < NMAX else 1.0)

        self.say(TM(r"項數 $\to\infty$：對每個實數 $x$ 都收斂到 $e^x$", size=CAP_TM))
        series = M(r"e^x = \sum_{k=0}^{\infty} \frac{x^k}{k!}", size=40)
        box = SurroundingRectangle(series, color=GOLD, buff=0.12, corner_radius=0.12, stroke_width=3)
        grp = VGroup(series, box).move_to([0, 2.2, 0])
        self.play(FadeOut(f), FadeIn(grp), run_time=1.0)
        self.wait(3.0)
