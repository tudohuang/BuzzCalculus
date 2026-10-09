"""均值定理：f(x) = x³ 在 [0, 3]（課 mean-value-theorem 範例 1），觀念 ①。

連接兩端點的割線斜率 9；把割線平行往下推，跟曲線的兩個交點越靠越近，
合成一點時就是切點 c = √3，f′(c) = 9。
交點用 numpy 解三次方程式（不是用定理找 c）；f′(c) 用中央差分驗算。
"""

import math
from fractions import Fraction

from manim import *  # noqa: F401,F403

from buzz_style import (
    BLUE, GOLD, GOLD_DARK, GREEN, INK, LINE, MUTED, PAPER, RED, VIOLET,
    BuzzScene, CAP_TM, M, T, TM, axes, title,
)

A, B = 0, 3
X_MIN, X_MAX, Y_MIN, Y_MAX = -0.3, 3.3, -12.0, 31.0


def f(x):
    return x ** 3


SLOPE = Fraction(f(B) - f(A), B - A)
C = math.sqrt(3)
K_TAN = f(C) - 9 * C                    # 切線 y = 9x + K_TAN


def crossings(k):
    """直線 y = 9x + k 與 y = x³ 在 [0, 3] 裡的交點。"""
    out = []
    for r in np.roots([1, 0, -9, -k]):
        if abs(r.imag) < 1e-7 and A - 1e-9 <= r.real <= B + 1e-9:
            out.append(float(r.real))
    return sorted(out)


# 自我檢查
assert SLOPE == 9
assert abs((f(C + 1e-6) - f(C - 1e-6)) / 2e-6 - 9) < 1e-6       # f′(√3) = 9（數值微分）
assert A < C < B and f"{C:.3f}" == "1.732"
assert abs(K_TAN - (-6 * math.sqrt(3))) < 1e-12 and Y_MIN < K_TAN
assert crossings(0) == [0.0, 3.0]                                  # 割線本身過兩端點
assert len(crossings(-5)) == 2 and len(crossings(K_TAN - 0.01)) == 0   # 推過頭就碰不到了
assert all(f(x) - (9 * x + K_TAN) >= -1e-12 for x in np.linspace(0, 3, 301))  # 切線在 [0,3] 都在曲線下方


def clipped(ax, m, k, color, width):
    xs = [X_MIN, X_MAX, (Y_MIN - k) / m, (Y_MAX - k) / m]
    xs = sorted(x for x in xs if X_MIN - 1e-9 <= x <= X_MAX + 1e-9 and Y_MIN - 1e-9 <= m * x + k <= Y_MAX + 1e-9)
    return Line(ax.c2p(xs[0], m * xs[0] + k), ax.c2p(xs[-1], m * xs[-1] + k), color=color, stroke_width=width)


class MeanValue(BuzzScene):
    def construct(self):
        head = title("均值定理：平行推過去，切到的地方就是 c")
        ax = axes([X_MIN, X_MAX, 1], [Y_MIN, Y_MAX, 10], 6.0, 5.5, numbers=False)
        ax.move_to([-3.15, -0.2, 0])   # 原點左上要放得下 (0, 0)
        xnums = VGroup(*[M(str(k), size=30, color=MUTED).next_to(ax.c2p(k, 0), DOWN, buff=0.15) for k in (2, 3)])   # 1 不標：切線剛好從那裡穿過 x 軸
        curve = ax.plot(f, x_range=[-0.3, 3.14], color=BLUE, stroke_width=5).set_z_index(3)
        clab = M(r"f(x)=x^3", size=34, color=BLUE).next_to(ax.c2p(2.0, 22), LEFT, buff=0.1)
        pa, pb = Dot(ax.c2p(0, 0), color=INK).set_z_index(5), Dot(ax.c2p(3, 27), color=INK).set_z_index(5)
        la = M(r"(0,\,0)", size=30).next_to(pa, UL, buff=0.2)
        lb = M(r"(3,\,27)", size=30).next_to(pb, DR, buff=0.15)

        self.play(FadeIn(head), Create(ax), FadeIn(xnums), run_time=1.0)
        self.play(Create(curve), FadeIn(clab), FadeIn(pa), FadeIn(pb), FadeIn(la), FadeIn(lb), run_time=1.2)

        secant = clipped(ax, 9, 0, VIOLET, 4).set_z_index(2)
        px = 1.3
        s_eq = VGroup(TM(r"割線斜率", size=34, color=VIOLET),
                      M(r"=\frac{27-0}{3-0}=9", size=40, color=VIOLET)).arrange(RIGHT, buff=0.15)
        s_eq.move_to([px, 2.3, 0], aligned_edge=LEFT)
        self.say("連接兩端點的割線：整段的平均變化率")
        self.play(Create(secant), FadeIn(s_eq), run_time=1.2)
        self.wait(1.8)

        # 平行往下推
        k = ValueTracker(0.0)
        moving = always_redraw(lambda: clipped(ax, 9, k.get_value(), GOLD_DARK, 4).set_z_index(4))

        def hits():
            pts = crossings(k.get_value())
            return VGroup(*[Dot(ax.c2p(x, f(x)), radius=0.08, color=RED).set_z_index(6) for x in pts])
        dots = always_redraw(hits)

        self.say("斜率不變，把它平行往下推：兩個交點越靠越近")
        self.add(moving, dots)
        self.play(k.animate.set_value(-6.0), run_time=2.2, rate_func=smooth)
        self.wait(0.4)
        self.play(k.animate.set_value(K_TAN + 0.02), run_time=2.0, rate_func=smooth)
        self.remove(dots)
        k.set_value(K_TAN)
        cdot = Dot(ax.c2p(C, f(C)), radius=0.1, color=RED).set_z_index(6)
        self.add(cdot)
        self.wait(0.4)

        cdrop = DashedLine(ax.c2p(C, 0), ax.c2p(C, f(C)), color=RED, stroke_width=2, dash_length=0.08)
        clbl = M(r"c", size=36, color=RED).next_to(ax.c2p(C, 0), DOWN, buff=0.2)
        self.say("兩點合成一點：直線剛好切到曲線，這裡就是 c")
        self.play(Create(cdrop), FadeIn(clbl), Flash(cdot, color=RED, line_length=0.18), run_time=1.0)
        self.wait(1.2)

        info = VGroup(
            M(r"c=\sqrt{3}\approx 1.732", size=40, color=RED),
            M(r"f'(c)=3c^2=3\cdot 3=9", size=40, color=GOLD_DARK),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.35).move_to([px, 0.85, 0], aligned_edge=LEFT)
        self.say("切線斜率 f′(c) = 9，正好等於割線斜率")
        self.play(FadeIn(info[0], shift=UP * 0.1), run_time=0.7)
        self.play(FadeIn(info[1], shift=UP * 0.1), run_time=0.7)
        self.wait(2.2)

        final = M(r"f'(c)=\frac{f(b)-f(a)}{b-a}", size=44)
        box = SurroundingRectangle(final, color=GOLD, buff=0.2, corner_radius=0.12, stroke_width=3)
        grp = VGroup(final, box).move_to([px + 2.9, -1.5, 0])
        self.say("連續又可微：(a, b) 裡至少有一點 c 讓切線平行割線")
        self.play(FadeIn(grp, shift=UP * 0.15), run_time=0.9)
        self.wait(2.6)
