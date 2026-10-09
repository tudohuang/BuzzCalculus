"""圓盤法：y = √x（0 ≤ x ≤ 4）繞 x 軸（課 volume-disk 範例 1），觀念 ②。

區域翻過 x 軸變成碗狀實體；切一片圓盤（半徑 √x、厚 Δx）沿軸滑動；
再把 n 片圓盤一片片加起來（左端點：圓盤都在碗裡面），n = 8 → 32，體積夾向 8π。
圓盤和用 Fraction 精確算（係數 × π）；8π 用 Simpson 數值積分獨立驗算。
"""

import math
from fractions import Fraction

from manim import *  # noqa: F401,F403

from buzz_style import (
    BLUE, GOLD, GOLD_DARK, GREEN, INK, LINE, MUTED, PANEL, PAPER, RED, VIOLET,
    BuzzScene, CAP_TM, M, T, TM, live, stick, title,
)

B = 4


def r_of(x):
    return math.sqrt(max(x, 0.0))


def disk_sum_coef(n):
    """左端點圓盤和 ÷ π：Σ (√xᵢ)² Δx = Σ xᵢ Δx，xᵢ = iΔx。"""
    dx = Fraction(B, n)
    return sum(i * dx * dx for i in range(n))


def simpson(fn, a, b, n=1000):
    h = (b - a) / n
    s = fn(a) + fn(b) + sum((4 if i % 2 else 2) * fn(a + i * h) for i in range(1, n))
    return s * h / 3


NS = [8, 32]
COEF = {n: disk_sum_coef(n) for n in NS}
# 自我檢查
assert COEF[8] == 7 and COEF[32] == Fraction(31, 4)
assert all(COEF[n] == Fraction(8 * (n - 1), n) for n in NS)            # 封閉式 8(n−1)/n
assert abs(simpson(lambda x: math.pi * r_of(x) ** 2, 0, B) - 8 * math.pi) < 1e-9
assert COEF[8] < COEF[32] < 8                                            # 左端點：從下面逼近

K = 1.25                          # 1 單位 = 1.25 個畫面單位
AX0 = np.array([-6.2, 0.15, 0])   # x = 0、軸上的點
TILT = 0.28                       # 圓盤畫成橢圓：水平半軸 = TILT × 半徑
FILL_REGION = interpolate_color(ManimColor(BLUE), ManimColor(PAPER), 0.7)
FILL_SOLID = interpolate_color(ManimColor(BLUE), ManimColor(PAPER), 0.82)
FILL_DISK = interpolate_color(ManimColor(GOLD), ManimColor(PAPER), 0.5)
FILL_FACE = interpolate_color(ManimColor(GOLD), ManimColor(PAPER), 0.25)


def P(x, y):
    return AX0 + K * np.array([x, y, 0])


def slab(x0, x1, r, sw=1.5):
    """一片圓盤（側看）：長方形＋右邊的橢圓面。"""
    body = Polygon(P(x0, -r), P(x1, -r), P(x1, r), P(x0, r),
                   stroke_color=GOLD_DARK, stroke_width=sw, fill_color=FILL_DISK, fill_opacity=1)
    face = Ellipse(width=max(2 * TILT * r * K, 0.001), height=max(2 * r * K, 0.001),
                   stroke_color=GOLD_DARK, stroke_width=sw, fill_color=FILL_FACE, fill_opacity=1).move_to(P(x1, 0))
    return VGroup(body, face)


class VolumeDisk(BuzzScene):
    def construct(self):
        head = title("圓盤法：切片疊出體積")
        axis = Line(P(-0.25, 0), P(4.75, 0), color=MUTED, stroke_width=2)
        ticks = VGroup(*[M(str(k), size=30, color=MUTED).next_to(P(k, 0), DOWN, buff=0.12) for k in (0, 4)])
        top = ParametricFunction(lambda t: P(t, r_of(t)), t_range=[0, B], color=BLUE, stroke_width=5).set_z_index(4)
        region = Polygon(*[P(t, r_of(t)) for t in np.linspace(0, B, 120)], P(B, 0),
                         stroke_width=0, fill_color=FILL_REGION, fill_opacity=1)
        flab = M(r"y=\sqrt{x}", size=36, color=BLUE).next_to(P(1.2, 1.4), UP, buff=0.05)

        self.play(FadeIn(head), Create(axis), FadeIn(ticks), run_time=0.8)
        self.play(Create(top), FadeIn(region), FadeIn(flab), run_time=1.2)
        self.say(TM(r"$y=\sqrt{x}$（$0\le x\le 4$）和 $x$ 軸之間的區域", size=CAP_TM))
        self.wait(1.0)

        # 翻過 x 軸：像繞軸轉了半圈
        lower = region.copy()
        bottom = top.copy()
        rim = Ellipse(width=2 * TILT * 2 * K, height=2 * 2 * K, color=BLUE, stroke_width=4).move_to(P(B, 0)).set_z_index(4)
        solid = Polygon(*[P(t, r_of(t)) for t in np.linspace(0, B, 120)],
                        *[P(t, -r_of(t)) for t in np.linspace(B, 0, 120)],
                        stroke_width=0, fill_color=FILL_SOLID, fill_opacity=1)
        self.say("繞 x 軸轉一圈，變成碗狀的實體")
        self.add(lower, bottom)
        self.play(lower.animate.stretch(-1, 1, about_point=P(0, 0)),
                  bottom.animate.stretch(-1, 1, about_point=P(0, 0)), run_time=1.4)
        self.play(FadeIn(solid), FadeOut(region), FadeOut(lower), FadeOut(ticks), Create(rim), run_time=0.8)
        self.wait(0.8)

        # 一片圓盤滑過去
        DX = 0.3
        xv = ValueTracker(0.6)
        one = always_redraw(lambda: slab(xv.get_value(), xv.get_value() + DX, r_of(xv.get_value()), 2).set_z_index(3))

        def radius_mark():
            x = xv.get_value() + DX
            r = r_of(xv.get_value())
            # 半徑只畫紅線；名字寫在右邊的看板（碗的外框太近，貼上去會碰到）
            return Line(P(x, 0), P(x, r), color=RED, stroke_width=5).set_z_index(5)

        def dx_mark():
            x = xv.get_value()
            r = r_of(x + DX)
            off = DOWN * (r * K + 0.3)
            br = Line(P(x, 0) + off, P(x + DX, 0) + off, color=INK, stroke_width=3)
            lbl = M(r"\Delta x", size=30).next_to(br, DOWN, buff=0.1)
            return VGroup(br, lbl).set_z_index(5)

        rm, dm = always_redraw(radius_mark), always_redraw(dx_mark)
        px = 0.6
        one_vol = M(r"\pi(\sqrt{x})^2\,\Delta x=\pi x\,\Delta x", size=38, color=GOLD_DARK)
        one_lbl = TM(r"一片：", size=34, color=GOLD_DARK)
        one_row = VGroup(one_lbl, one_vol).arrange(RIGHT, buff=0.1).move_to([px, 2.4, 0], aligned_edge=LEFT)
        legend = TM(r"半徑 $\sqrt{x}$（紅線），厚 $\Delta x$", size=32, color=RED)
        legend.move_to([px, 1.7, 0], aligned_edge=LEFT)

        self.say(TM(r"垂直 $x$ 軸切一片：圓盤，半徑 $\sqrt{x}$，厚 $\Delta x$", size=CAP_TM))
        self.play(FadeIn(one), FadeIn(rm), FadeIn(dm), FadeOut(flab), run_time=0.8)
        self.play(FadeIn(one_row), FadeIn(legend), run_time=0.6)
        self.play(xv.animate.set_value(3.5), run_time=2.4, rate_func=smooth)
        self.wait(0.6)
        self.play(FadeOut(one), FadeOut(rm), FadeOut(dm), run_time=0.5)

        # n 片一片片加起來
        def stack(n, count):
            dx = B / n
            g = VGroup()
            for i in range(int(count)):
                g.add(slab(i * dx, (i + 1) * dx, r_of(i * dx), 1.5 if n <= 8 else 0.8))
            return g.set_z_index(3)

        m = ValueTracker(0)
        st = always_redraw(lambda: stack(8, m.get_value()))

        def partial(n):
            dx = B / n
            k = int(m.get_value())
            return math.pi * sum(i * dx * dx for i in range(k))

        rows_y = [0.85, 0.0]
        n_lbl = M(r"n=8", size=38).move_to([px, rows_y[0], 0], aligned_edge=LEFT)
        sum_lbl = M(r"\textstyle\sum\approx", size=38, color=GOLD_DARK).next_to(n_lbl, RIGHT, buff=0.6)
        sum_val = stick(live(lambda: partial(8), 2, 38, GOLD_DARK), sum_lbl, RIGHT)

        self.say("一片一片加起來")
        self.add(st)
        self.play(FadeIn(n_lbl), FadeIn(sum_lbl), FadeIn(sum_val), run_time=0.5)
        self.play(m.animate.set_value(8), run_time=2.4, rate_func=linear)
        sum_val.clear_updaters()
        res8 = M(rf"\textstyle\sum=7\pi\approx {7 * math.pi:.2f}", size=38, color=GOLD_DARK)
        res8.align_to(sum_lbl, LEFT).set_y(sum_lbl.get_y())
        self.play(FadeOut(sum_lbl), FadeOut(sum_val), FadeIn(res8), run_time=0.5)
        sum8 = VGroup(n_lbl, sum_lbl, res8)
        self.wait(1.0)

        # 切細：n = 32
        st32 = stack(32, 32)
        self.remove(st)
        st8 = stack(8, 8)
        self.add(st8)
        n32 = M(r"n=32", size=38).move_to([px, rows_y[1], 0], aligned_edge=LEFT)
        s32 = M(rf"\textstyle\sum=\tfrac{{31}}{{4}}\pi\approx {float(COEF[32]) * math.pi:.2f}", size=38, color=GOLD_DARK)
        s32.next_to(n32, RIGHT, buff=0.6).align_to(sum_lbl, LEFT)
        self.say("切得越薄，加起來越接近真正的體積")
        self.play(ReplacementTransform(st8, st32), FadeIn(n32), FadeIn(s32), run_time=1.6)
        self.wait(1.4)

        final = M(r"V=\int_0^4 \pi x\,dx", rf"=8\pi\approx {8 * math.pi:.2f}", size=42)
        final[1].set_color(GREEN)
        final.move_to([px + 0.2, -1.6, 0], aligned_edge=LEFT)
        box = SurroundingRectangle(final, color=GOLD, buff=0.2, corner_radius=0.12, stroke_width=3)
        assert box.get_right()[0] < 6.9 and box.get_bottom()[1] > -3.0
        self.say("Δx → 0：圓盤和變成積分，體積是 8π")
        self.play(FadeIn(final, shift=UP * 0.15), Create(box), run_time=1.0)
        self.wait(2.8)
