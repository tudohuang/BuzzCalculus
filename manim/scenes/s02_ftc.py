"""微積分基本定理：累積面積 A(x) = ∫₀ˣ f，A 的斜率等於 f(x) 的高度。

為了不偷用定理本身：A(x) 用 Simpson 法數值積分（f 是二次式，Simpson 恰好精確），
A 的斜率用中央差分從 A 的數值算出來，再跟 f(x) 對照。
"""

from manim import *  # noqa: F401,F403

from buzz_style import (
    BLUE, GOLD, GOLD_DARK, GREEN, INK, MUTED, RED,
    BuzzScene, M, T, TM, axes, fmt, title,
)


def f(t):
    return 1 + t - t * t / 4


def A(x, n=200):
    """∫₀ˣ f(t) dt，複合 Simpson 法。"""
    if x == 0:
        return 0.0
    h = x / n
    s = f(0) + f(x)
    for i in range(1, n):
        s += (4 if i % 2 else 2) * f(i * h)
    return s * h / 3


def slope_of_A(x, h=1e-3):
    return (A(x + h) - A(x - h)) / (2 * h)


# 自我檢查：數值的 A 與封閉式一致；A 的斜率與 f 一致
for x in (0.5, 1, 2, 3, 3.5):
    assert abs(A(x) - (x + x * x / 2 - x ** 3 / 12)) < 1e-12
    assert abs(slope_of_A(x) - f(x)) < 1e-5

STOPS = [1.0, 2.0, 3.0, 3.6]


class FundamentalTheorem(BuzzScene):
    def construct(self):
        head = title("微積分基本定理：面積的變化率＝高度")

        axf = axes([0, 4, 1], [0, 2.5, 1], 5.8, 3.2)
        axA = axes([0, 4, 1], [0, 7, 1], 5.8, 3.2)
        axf.move_to([-3.45, 0.2, 0])
        axA.move_to([3.45, 0.2, 0])
        lf = M(r"y=f(t)", size=32, color=BLUE).next_to(axf, UP, buff=0.12).align_to(axf, LEFT)
        lA = M(r"y=A(x)=\int_0^x f(t)\,dt", size=32, color=GREEN).next_to(axA, UP, buff=0.12).align_to(axA, LEFT)

        gf = axf.plot(f, x_range=[0, 4], color=BLUE, stroke_width=5)
        gA = axA.plot(A, x_range=[0, 4], color=GREEN, stroke_width=3).set_stroke(opacity=0.25)

        self.play(FadeIn(head), Create(axf), Create(axA), run_time=1.0)
        self.play(Create(gf), FadeIn(lf), run_time=1.0)
        self.say("A(x)：從 0 到 x，曲線底下累積的面積")

        x = ValueTracker(0.001)

        area = always_redraw(lambda: axf.get_area(
            gf, x_range=[0, max(x.get_value(), 0.001)], color=BLUE, opacity=0.30,
        ))
        height = always_redraw(lambda: Line(
            axf.c2p(x.get_value(), 0), axf.c2p(x.get_value(), f(x.get_value())),
            color=RED, stroke_width=6,
        ))
        traced = always_redraw(lambda: axA.plot(
            A, x_range=[0, max(x.get_value(), 0.002)], color=GREEN, stroke_width=5,
        ))
        dotA = always_redraw(lambda: Dot(axA.c2p(x.get_value(), A(x.get_value())), radius=0.08, color=GREEN))

        def tangent():
            x0 = x.get_value()
            m = slope_of_A(x0) if x0 > 0.01 else f(0)
            lo, hi = max(0, x0 - 0.7), min(4, x0 + 0.7)
            return Line(
                axA.c2p(lo, A(x0) + m * (lo - x0)), axA.c2p(hi, A(x0) + m * (hi - x0)),
                color=RED, stroke_width=4,
            )
        tan = always_redraw(tangent)

        # 讀數：左邊是高度，右邊是斜率（從 A 的數值算的）
        def num(getter, color):
            d = DecimalNumber(0, num_decimal_places=3, font_size=38, color=color)
            d.add_updater(lambda m: m.set_value(getter()))
            return d

        hl = TM(r"高度 $f(x)=$", size=34, color=RED)
        hv = num(lambda: f(x.get_value()), RED)
        sl = TM(r"$A$ 的斜率 $=$", size=34, color=RED)
        sv = num(lambda: slope_of_A(max(x.get_value(), 0.002)), RED)
        xl = M(r"x =", size=38)
        xv = DecimalNumber(0, num_decimal_places=2, font_size=38, color=INK)
        xv.add_updater(lambda m: m.set_value(x.get_value()))

        row_f = VGroup(hl, hv).arrange(RIGHT, buff=0.15)
        row_A = VGroup(sl, sv).arrange(RIGHT, buff=0.15)
        row_x = VGroup(xl, xv).arrange(RIGHT, buff=0.15)
        row_f.next_to(axf, DOWN, buff=0.45)
        row_A.next_to(axA, DOWN, buff=0.45)
        row_x.move_to([0, row_f.get_y(), 0])
        # 小數點更新時保持對齊
        hv.add_updater(lambda m: m.next_to(hl, RIGHT, buff=0.15))
        sv.add_updater(lambda m: m.next_to(sl, RIGHT, buff=0.15))
        xv.add_updater(lambda m: m.next_to(xl, RIGHT, buff=0.15))

        self.add(area, traced)
        self.play(FadeIn(gA), FadeIn(lA), FadeIn(dotA), FadeIn(height), FadeIn(row_x), run_time=0.8)

        # 第一段：只看面積長大
        self.play(x.animate.set_value(STOPS[0]), run_time=2.2, rate_func=smooth)
        self.say("x 往右走，藍色面積長大，右邊的 A(x) 跟著往上爬")
        self.wait(0.8)

        # 第二段：細長條
        self.play(x.animate.set_value(STOPS[1]), run_time=1.8)
        dx = 0.3
        x0 = STOPS[1]
        strip = Polygon(
            axf.c2p(x0, 0), axf.c2p(x0 + dx, 0), axf.c2p(x0 + dx, f(x0)), axf.c2p(x0, f(x0)),
            color=GOLD_DARK, fill_color=GOLD, fill_opacity=0.55, stroke_width=2,
        )
        strip_lbl = M(r"\Delta A \approx f(x)\,\Delta x", size=34, color=GOLD_DARK)
        strip_lbl.next_to(axf.c2p(x0 + dx / 2, f(x0)), UP, buff=0.35)
        self.say("再多走 Δx，面積多出一條：寬 Δx、高約 f(x)")
        self.play(FadeIn(strip), FadeIn(strip_lbl), run_time=0.8)
        self.wait(1.4)
        self.say("所以 ΔA ÷ Δx ≈ f(x)：A 的斜率就是 f 的高度")
        self.play(FadeIn(tan), FadeIn(row_f), FadeIn(row_A), run_time=0.8)
        self.wait(2.0)
        self.play(FadeOut(strip), FadeOut(strip_lbl), run_time=0.5)

        # 第三段：一路走，兩個讀數始終相同
        self.say("f 變矮時 A 爬得變慢——切線斜率一直等於紅線的高度")
        self.play(x.animate.set_value(STOPS[2]), run_time=2.4)
        self.wait(0.8)
        self.play(x.animate.set_value(STOPS[3]), run_time=1.6)
        self.wait(1.0)

        final = M(r"\frac{d}{dx}\int_0^x f(t)\,dt", r"=", r"f(x)", size=38)
        final[2].set_color(RED)
        box = SurroundingRectangle(final, color=GOLD, buff=0.22, corner_radius=0.12, stroke_width=3)
        grp = VGroup(final, box).move_to([0, -2.35, 0])
        self.say("這就是微積分基本定理：積分的導數把被積函數還回來")
        self.play(FadeOut(row_x), FadeOut(row_f), FadeOut(row_A), FadeIn(grp), run_time=0.9)
        self.wait(3.0)
