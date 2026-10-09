"""極座標面積：心臟線 r = 1 + cos θ（課 polar-area 範例 1），觀念 ① 切成扇形。

一片扇形半徑 r、角度 Δθ，面積 ½ r² Δθ；射線轉一圈，24 片扇形（取中點的半徑）一片片加起來，
累加值跟積分 ½∫₀^{2π} (1 + cos θ)² dθ = 3π/2 對照。
扇形和直接一片片加；3π/2 用 Simpson 數值積分獨立驗算。
"""

import math

from manim import *  # noqa: F401,F403

from buzz_style import (
    BLUE, GOLD, GOLD_DARK, GREEN, INK, LINE, MUTED, PANEL, PAPER, RED, VIOLET,
    BuzzScene, CAP_TM, M, T, TM, live, stick, title,
)

N = 24
DTH = 2 * math.pi / N


def r_of(th):
    return 1 + math.cos(th)


def sector_area(i):
    mid = (i + 0.5) * DTH
    return 0.5 * r_of(mid) ** 2 * DTH


def simpson(fn, a, b, n=2000):
    h = (b - a) / n
    s = fn(a) + fn(b) + sum((4 if i % 2 else 2) * fn(a + i * h) for i in range(1, n))
    return s * h / 3


EXACT = 1.5 * math.pi
TOTAL = sum(sector_area(i) for i in range(N))
# 自我檢查
assert abs(simpson(lambda t: 0.5 * r_of(t) ** 2, 0, 2 * math.pi) - EXACT) < 1e-10
assert abs(TOTAL - EXACT) < 1e-9          # 等分一整圈、取中點：cos θ、cos 2θ 的和剛好抵消
assert f"{EXACT:.4f}" == "4.7124"
# 扇形面積 = 整圓面積 × 角度比例
assert abs(math.pi * 2.0 ** 2 * (DTH / (2 * math.pi)) - 0.5 * 2.0 ** 2 * DTH) < 1e-15

K = 2.05
O = np.array([-4.15, -0.05, 0])
FILL_A = interpolate_color(ManimColor(GOLD), ManimColor(PAPER), 0.35)
FILL_B = interpolate_color(ManimColor(GOLD), ManimColor(PAPER), 0.6)


def pol(r, th):
    return O + K * r * np.array([math.cos(th), math.sin(th), 0])


def sector(i, color=None):
    a0, a1 = i * DTH, (i + 1) * DTH
    r = r_of((i + 0.5) * DTH)
    pts = [O] + [pol(r, a0 + (a1 - a0) * t) for t in np.linspace(0, 1, 9)]
    return Polygon(*pts, stroke_color=GOLD_DARK, stroke_width=1.5,
                   fill_color=color or (FILL_A if i % 2 == 0 else FILL_B), fill_opacity=1)


class PolarArea(BuzzScene):
    def construct(self):
        head = title("極座標面積：切成細扇形")
        grid = VGroup(*[Circle(radius=K * rr, color=LINE, stroke_width=1.5).move_to(O) for rr in (1,)])
        axis = Line(O + LEFT * 0.9, O + RIGHT * (2 * K + 0.5), color=MUTED, stroke_width=2)
        curve = ParametricFunction(lambda t: pol(r_of(t), t), t_range=[0, 2 * math.pi], color=BLUE,
                                   stroke_width=5).set_z_index(4)
        # 名字放在左上角的空地（心臟線最左只到 x = −1/4，r = 1 的格線圓頂在 y = K）
        clab = M(r"r=1+\cos\theta", size=36, color=BLUE).move_to([-5.65, 2.55, 0])

        self.play(FadeIn(head), FadeIn(grid), Create(axis), run_time=0.8)
        self.play(Create(curve), FadeIn(clab), run_time=1.6)
        self.say("心臟線 r = 1 + cos θ：每個方向給一個距離 r")
        self.wait(1.6)

        # 一片扇形
        px = 1.25
        demo = sector(2, FILL_A).set_z_index(2)
        rmid = r_of(2.5 * DTH)
        r_lbl = M("r", size=36, color=GOLD_DARK).next_to((O + pol(rmid, 2 * DTH)) / 2, DR, buff=0.12)
        d_lbl = M(r"\Delta\theta", size=34, color=GOLD_DARK).next_to(pol(rmid, 2.5 * DTH), UR, buff=0.3)
        one = VGroup(TM(r"一片：", size=34, color=GOLD_DARK),
                     M(r"\tfrac12\,r^2\,\Delta\theta", size=42, color=GOLD_DARK)).arrange(RIGHT, buff=0.1)
        one.move_to([px, 2.3, 0], aligned_edge=LEFT)
        why = M(r"\pi r^2\cdot\frac{\Delta\theta}{2\pi}=\tfrac12 r^2\Delta\theta", size=36, color=MUTED)
        why.move_to([px, 1.45, 0], aligned_edge=LEFT)
        self.say("切成從原點出發的細扇形：一片面積 ½ r² Δθ")
        self.play(FadeIn(demo), FadeIn(r_lbl), FadeIn(d_lbl), run_time=0.8)
        self.play(FadeIn(one), run_time=0.6)
        self.play(FadeIn(why), run_time=0.6)
        self.wait(2.2)
        self.play(FadeOut(demo), FadeOut(r_lbl), FadeOut(d_lbl), FadeOut(why), run_time=0.5)

        # 射線轉一圈
        th = ValueTracker(0.0)
        ray = always_redraw(lambda: Line(O, pol(r_of(th.get_value()) + 0.18, th.get_value()), color=RED, stroke_width=4).set_z_index(5))

        def done():
            return min(N, int(th.get_value() / DTH + 1e-9))

        fan = always_redraw(lambda: VGroup(*[sector(i) for i in range(done())]).set_z_index(1))
        tl = M(r"\theta=", size=40).move_to([px, 1.25, 0], aligned_edge=LEFT)
        tv = stick(live(lambda: th.get_value() / math.pi, 2, 40), tl, RIGHT)
        tpi = stick(M(r"\pi", size=40), tv, RIGHT, buff=0.08)
        sl = M(r"\textstyle\sum\tfrac12 r^2\Delta\theta\approx", size=40, color=GOLD_DARK).move_to([px, 0.25, 0], aligned_edge=LEFT)
        sv = stick(live(lambda: sum(sector_area(i) for i in range(done())), 3, 40, GOLD_DARK), sl, RIGHT)

        self.say("射線轉一圈，把扇形一片片加起來")
        self.add(fan)
        self.play(FadeIn(ray), FadeIn(tl), FadeIn(tv), FadeIn(tpi), FadeIn(sl), FadeIn(sv), run_time=0.6)
        self.play(th.animate.set_value(math.pi), run_time=3.0, rate_func=linear)
        self.wait(0.6)
        self.play(th.animate.set_value(2 * math.pi), run_time=3.0, rate_func=linear)
        self.wait(0.8)

        final = VGroup(
            M(r"A=\int_0^{2\pi}\tfrac12(1+\cos\theta)^2\,d\theta", size=40),
            M(rf"=\tfrac{{3\pi}}{{2}}\approx {EXACT:.4f}", size=40, color=GREEN),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        final.move_to([px, -1.5, 0], aligned_edge=LEFT)
        box = SurroundingRectangle(final, color=GOLD, buff=0.2, corner_radius=0.12, stroke_width=3)
        assert box.get_right()[0] < 6.9 and box.get_bottom()[1] > -3.0
        self.say("Δθ → 0：扇形和變成積分，面積是 3π/2")
        self.play(FadeOut(ray), FadeIn(final, shift=UP * 0.15), Create(box), run_time=1.0)
        self.wait(3.2)
