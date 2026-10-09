"""相關變率：5 公尺的梯子，梯腳每秒往外 1 公尺（課 related-rates 範例 1），觀念 ④。

梯腳的速度固定（畫面上真的是 1 秒走 1 公尺），頂端下滑的速度越來越快。
dy/dt 的讀數用 −(x/y)·dx/dt；另外用 y(t) = √(25 − x(t)²) 的數值微分獨立驗算。
"""

import math
from fractions import Fraction

from manim import *  # noqa: F401,F403

from buzz_style import (
    BLUE, GOLD, GOLD_DARK, GREEN, INK, LINE, MUTED, PAPER, RED, VIOLET,
    BuzzScene, CAP_TM, M, T, TM, live, stick, title,
)

LEN = 5
X_START, X_STOP, X_END = 1.0, 3.0, 4.6
DXDT = 1


def y_of(x):
    return math.sqrt(LEN ** 2 - x * x)


def dydt(x):
    return -x / y_of(x) * DXDT


def dydt_numeric(x, h=1e-6):
    """x(t) = x + t（每秒 1 公尺），y(t) = √(25 − x(t)²)，直接對 t 數值微分。"""
    return (y_of(x + h * DXDT) - y_of(x - h * DXDT)) / (2 * h)


# 自我檢查
assert y_of(3) == 4 and y_of(4) == 3
assert Fraction(-3, 4) == Fraction(-3, 4 * DXDT) and abs(dydt(3) + 0.75) < 1e-12   # 課文答案 −3/4
for x in (X_START, X_STOP, 4.0, X_END):
    assert abs(dydt(x) - dydt_numeric(x)) < 1e-6
assert abs(dydt(X_START)) < abs(dydt(X_STOP)) < abs(dydt(X_END))   # 越接近地面下滑越快

U = 0.85                          # 1 公尺 = 0.85 個畫面單位
ARROW = 0.55                      # 1 公尺／秒 = 0.55 個畫面單位
WALL_X, GROUND_Y = -4.6, -2.15


def foot(x):
    return np.array([WALL_X + U * x, GROUND_Y, 0])


def top(x):
    return np.array([WALL_X, GROUND_Y + U * y_of(x), 0])


class LadderRates(BuzzScene):
    def construct(self):
        head = title("相關變率：梯子下滑")
        xv = ValueTracker(X_START)

        wall = Line([WALL_X, GROUND_Y, 0], [WALL_X, GROUND_Y + U * 5.3, 0], color=INK, stroke_width=6)
        ground = Line([WALL_X, GROUND_Y, 0], [WALL_X + U * 5.6, GROUND_Y, 0], color=INK, stroke_width=6)
        ladder = always_redraw(lambda: Line(foot(xv.get_value()), top(xv.get_value()),
                                            color=GOLD_DARK, stroke_width=8).set_z_index(3))

        def len_label():
            x = xv.get_value()
            mid = (foot(x) + top(x)) / 2
            n = np.array([y_of(x), x, 0]) / LEN          # 垂直梯子、朝右上
            return M("5", size=34, color=GOLD_DARK).move_to(mid + n * 0.38)

        lab5 = always_redraw(len_label)

        def x_dim():
            x = xv.get_value()
            y0 = GROUND_Y - 0.32
            line = Line([WALL_X, y0, 0], [WALL_X + U * x, y0, 0], color=GREEN, stroke_width=3)
            ticks = VGroup(*[Line([px, y0 - 0.1, 0], [px, y0 + 0.1, 0], color=GREEN, stroke_width=3)
                             for px in (WALL_X, WALL_X + U * x)])
            lbl = M("x", size=34, color=GREEN).next_to(line, DOWN, buff=0.12)
            return VGroup(line, ticks, lbl)

        def y_dim():
            x = xv.get_value()
            x0 = WALL_X - 0.32
            line = Line([x0, GROUND_Y, 0], [x0, GROUND_Y + U * y_of(x), 0], color=RED, stroke_width=3)
            ticks = VGroup(*[Line([x0 - 0.1, py, 0], [x0 + 0.1, py, 0], color=RED, stroke_width=3)
                             for py in (GROUND_Y, GROUND_Y + U * y_of(x))])
            lbl = M("y", size=34, color=RED).next_to(line, LEFT, buff=0.12)
            return VGroup(line, ticks, lbl)

        def dx_arrow():
            p = foot(xv.get_value()) + np.array([0.15, 0.28, 0])
            arr = Arrow(p, p + RIGHT * ARROW * DXDT, buff=0, color=GREEN, stroke_width=6,
                        max_tip_length_to_length_ratio=0.45, max_stroke_width_to_length_ratio=12)
            # 名字放在地面下、梯腳右邊：梯子從梯腳往左上，上面會碰到梯子
            lbl = M(r"dx/dt=1", size=32, color=GREEN)
            lbl.move_to([0, GROUND_Y - 0.38, 0]).align_to(arr, LEFT)
            return VGroup(arr, lbl)

        def dy_arrow():
            x = xv.get_value()
            p = top(x) + np.array([-1.05, 0, 0])
            arr = Arrow(p, p + DOWN * ARROW * abs(dydt(x)), buff=0, color=RED, stroke_width=6,
                        max_tip_length_to_length_ratio=0.45, max_stroke_width_to_length_ratio=12)
            lbl = M(r"\frac{dy}{dt}", size=32, color=RED).next_to(arr, LEFT, buff=0.15)
            lbl.align_to(arr, UP)
            return VGroup(arr, lbl)

        xd, yd = always_redraw(x_dim), always_redraw(y_dim)
        dxa, dya = always_redraw(dx_arrow), always_redraw(dy_arrow)

        self.play(FadeIn(head), Create(wall), Create(ground), run_time=0.9)
        self.play(FadeIn(ladder), FadeIn(lab5), FadeIn(xd), FadeIn(yd), run_time=0.9)
        self.say("5 公尺的梯子靠牆，梯腳每秒往外拉 1 公尺")
        self.play(FadeIn(dxa), FadeIn(dya), run_time=0.6)
        self.wait(1.0)

        # 右邊：關係式與讀數
        px = 1.4
        eqs = VGroup(
            M(r"x^2+y^2=25", size=40),
            M(r"2x\,\frac{dx}{dt}+2y\,\frac{dy}{dt}=0", size=40),
            M(r"\frac{dy}{dt}=-\frac{x}{y}\cdot\frac{dx}{dt}", size=40, color=RED),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.32)
        eqs.move_to([px, 0, 0], aligned_edge=LEFT).align_to([0, 2.75, 0], UP)

        def reading(tex, getter, places, color, y):
            lbl = M(tex, size=38, color=color).move_to([px, y, 0], aligned_edge=LEFT)
            val = stick(live(getter, places, 38, color), lbl, RIGHT)
            return VGroup(lbl, val)

        r_x = reading(r"x=", lambda: xv.get_value(), 2, GREEN, -0.7)
        r_y = reading(r"y=", lambda: y_of(xv.get_value()), 2, RED, -1.3)
        r_v = reading(r"\frac{dy}{dt}=", lambda: dydt(xv.get_value()), 3, RED, -2.25)
        for r in (r_x, r_y):
            r[0].align_to(r_v[0], RIGHT)       # 等號對齊

        self.say(TM(r"$x$、$y$ 都隨時間變，但永遠滿足 $x^2+y^2=25$", size=CAP_TM))
        self.play(FadeIn(eqs[0]), run_time=0.7)
        self.wait(1.0)
        self.say("整條式子對 t 微分，再解出 dy/dt")
        self.play(FadeIn(eqs[1], shift=DOWN * 0.1), run_time=0.7)
        self.play(FadeIn(eqs[2], shift=DOWN * 0.1), run_time=0.7)
        self.wait(1.0)

        self.play(FadeIn(r_x), FadeIn(r_y), FadeIn(r_v), run_time=0.6)
        self.say("梯腳等速往外，頂端往下滑")
        self.play(xv.animate.set_value(X_STOP), run_time=(X_STOP - X_START) / DXDT, rate_func=linear)
        self.wait(0.3)
        frame3 = SurroundingRectangle(r_v, color=GOLD, buff=0.1, corner_radius=0.1, stroke_width=3)
        self.say(TM(r"梯腳離牆 3 公尺時：每秒下降 $3/4$ 公尺", size=CAP_TM))
        self.play(Create(frame3), run_time=0.6)
        self.wait(2.0)
        self.play(FadeOut(frame3), run_time=0.4)

        self.say("dx/dt 一直是 1，頂端越接近地面，dy/dt 越大")
        self.play(xv.animate.set_value(X_END), run_time=(X_END - X_STOP) / DXDT, rate_func=linear)
        self.wait(1.8)

        for r in (r_x, r_y, r_v):
            r[1].clear_updaters()
        self.say("先對 t 微分，再代入「此刻」的數字")
        self.play(Indicate(eqs[1], color=GOLD, scale_factor=1.05), run_time=1.0)
        self.wait(2.2)
