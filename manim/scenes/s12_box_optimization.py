"""最佳化：12 × 12 紙板四角剪掉 x，摺成無蓋盒子（課 optimization-geometry 範例 1），觀念 ①。

拖 x：紙板、盒子、V(x) = x(12 − 2x)² 的圖一起動。x 太小盒子扁、太大底太小，最高點 x = 2、V = 128。
最大值用 0 到 6 的細格點搜尋獨立驗算，不只靠 V′ = 0。
"""

from fractions import Fraction

from manim import *  # noqa: F401,F403

from buzz_style import (
    BLUE, GOLD, GOLD_DARK, GREEN, INK, LINE, MUTED, PANEL, PAPER, RED, VIOLET,
    BuzzScene, CAP_TM, M, T, TM, axes, live, stick, title,
)

SIDE = 12


def V(x):
    return x * (SIDE - 2 * x) ** 2


def dV(x):
    return (SIDE - 2 * x) * (SIDE - 6 * x)


# 自我檢查
assert V(Fraction(2)) == 128 and V(1) == 100 and V(3) == 108
grid = [Fraction(k, 1000) for k in range(0, 6001)]
best = max(grid, key=V)
assert best == 2 and V(best) == 128                     # 格點搜尋的最大值就在 x = 2
assert dV(2) == 0 and dV(6) == 0                        # V′ 的兩個根；x = 6 時底邊是 0
assert all(abs((V(x + 1e-6) - V(x - 1e-6)) / 2e-6 - dV(x)) < 1e-4 for x in (0.5, 1.7, 2.0, 4.2))

SHEET_SCALE = 0.25
SHEET_C = np.array([-5.0, 0.55, 0])
BOX_S = 0.23
BOX_C = np.array([-1.3, 0.55, 0])
DEPTH = np.array([0.5, 0.32, 0])          # 往後一單位在畫面上的位移（斜投影）
CUT_FILL = interpolate_color(ManimColor(RED), ManimColor(PAPER), 0.55)
SHEET_FILL = interpolate_color(ManimColor(GOLD), ManimColor(PAPER), 0.7)
OUT_FILL = interpolate_color(ManimColor(GOLD), ManimColor(PAPER), 0.45)
IN_FILL = interpolate_color(ManimColor(GOLD_DARK), ManimColor(PAPER), 0.55)


def sheet(x):
    k = SHEET_SCALE
    half = SIDE * k / 2
    base = Square(side_length=SIDE * k, stroke_color=INK, stroke_width=2, fill_color=SHEET_FILL, fill_opacity=1)
    base.move_to(SHEET_C)
    cuts = VGroup()
    for sx in (-1, 1):
        for sy in (-1, 1):
            c = Square(side_length=x * k, stroke_color=RED, stroke_width=2, fill_color=CUT_FILL, fill_opacity=1)
            c.move_to(SHEET_C + np.array([sx * (half - x * k / 2), sy * (half - x * k / 2), 0]))
            cuts.add(c)
    folds = VGroup()
    for t in (-1, 1):
        p = half - x * k
        folds.add(DashedLine(SHEET_C + np.array([t * p, -half + x * k, 0]), SHEET_C + np.array([t * p, half - x * k, 0]),
                             color=MUTED, stroke_width=2, dash_length=0.08))
        folds.add(DashedLine(SHEET_C + np.array([-half + x * k, t * p, 0]), SHEET_C + np.array([half - x * k, t * p, 0]),
                             color=MUTED, stroke_width=2, dash_length=0.08))
    xl = M("x", size=32, color=RED).next_to(cuts[1], UP, buff=0.12)       # 左上角那塊的上面
    return VGroup(base, cuts, folds, xl)


def box(x):
    """斜投影的無蓋盒子：底 s × s、高 x。先畫看得到的內面，再畫外面的前面與右面。"""
    s = SIDE - 2 * x

    def P(u, v, w):
        return BOX_S * (np.array([u, w, 0]) + v * DEPTH)

    def face(pts, fill):
        return Polygon(*pts, stroke_color=INK, stroke_width=2, fill_color=fill, fill_opacity=1)

    inner_bottom = face([P(0, 0, 0), P(s, 0, 0), P(s, s, 0), P(0, s, 0)], IN_FILL)
    inner_back = face([P(0, s, 0), P(s, s, 0), P(s, s, x), P(0, s, x)], IN_FILL)
    inner_left = face([P(0, 0, 0), P(0, s, 0), P(0, s, x), P(0, 0, x)], IN_FILL)
    front = face([P(0, 0, 0), P(s, 0, 0), P(s, 0, x), P(0, 0, x)], OUT_FILL)
    right = face([P(s, 0, 0), P(s, s, 0), P(s, s, x), P(s, 0, x)], OUT_FILL)
    g = VGroup(inner_bottom, inner_back, inner_left, front, right)
    g.move_to(BOX_C)
    return g


class BoxOptimization(BuzzScene):
    def construct(self):
        head = title("最佳化：紙板摺盒子")
        xv = ValueTracker(2.0)

        sh = always_redraw(lambda: sheet(xv.get_value()))
        bx = always_redraw(lambda: box(xv.get_value()))
        side_lbl = M("12", size=32).next_to(SHEET_C + DOWN * SIDE * SHEET_SCALE / 2, DOWN, buff=0.15)

        self.play(FadeIn(head), run_time=0.6)
        self.play(FadeIn(sh), FadeIn(side_lbl), run_time=1.0)
        self.say("12 × 12 的紙板，四角各剪掉邊長 x 的正方形")
        self.wait(1.4)
        self.play(FadeIn(bx, shift=RIGHT * 0.2), run_time=1.0)
        self.say("摺起來：底邊 12 − 2x，高 x")
        self.wait(1.4)

        # 圖：V(x)
        ax = axes([0, 6, 1], [0, 140, 40], 4.9, 3.8)
        ax.move_to([4.05, 0.45, 0])
        curve = ax.plot(V, x_range=[0, 6], color=BLUE, stroke_width=4)
        vlab = M(r"V(x)=x(12-2x)^2", size=36, color=BLUE).next_to(ax, UP, buff=0.15).align_to(ax, RIGHT)
        dot = always_redraw(lambda: Dot(ax.c2p(xv.get_value(), V(xv.get_value())), radius=0.09, color=RED).set_z_index(5))
        drop = always_redraw(lambda: DashedLine(ax.c2p(xv.get_value(), 0), ax.c2p(xv.get_value(), V(xv.get_value())),
                                                color=RED, stroke_width=2, dash_length=0.07))

        rx = M(r"x=", size=38).move_to([-4.6, -2.35, 0], aligned_edge=LEFT)
        rxv = stick(live(lambda: xv.get_value(), 2, 38), rx, RIGHT)
        rV = M(r"V=", size=38, color=BLUE).move_to([-2.1, -2.35, 0], aligned_edge=LEFT)
        rVv = stick(live(lambda: V(xv.get_value()), 1, 38, BLUE), rV, RIGHT)

        self.say("體積 V = 底面積 × 高")
        self.play(Create(ax), Create(curve), FadeIn(vlab), run_time=1.2)
        self.play(FadeIn(dot), FadeIn(drop), FadeIn(rx), FadeIn(rxv), FadeIn(rV), FadeIn(rVv), run_time=0.6)
        self.wait(0.6)

        self.say("x 太小：底很大，可是盒子很扁")
        self.play(xv.animate.set_value(0.5), run_time=2.0, rate_func=smooth)
        self.wait(1.0)
        self.say("x 太大：盒子很高，可是底太小")
        self.play(xv.animate.set_value(5.4), run_time=3.2, rate_func=smooth)
        self.wait(1.0)
        self.say("中間有一個最高點")
        self.play(xv.animate.set_value(2.0), run_time=2.4, rate_func=smooth)
        self.wait(0.4)

        work = VGroup(
            M(r"V'(x)=(12-2x)(12-6x)=0", size=36),
            M(r"x=2:\ V=2\cdot 8^2=128", size=36, color=RED),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.25)
        work.move_to([4.05, -2.55, 0])
        self.say("V′(x) = 0 在 x = 2：最大體積 128 立方公分")
        self.play(FadeIn(work, shift=UP * 0.1), run_time=0.9)
        self.wait(3.0)
