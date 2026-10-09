"""左極限與右極限：f(x) = x（x < 2）、x + 2（x ≥ 2），課 limit-one-sided 觀念 ②。

左右各一個點沿曲線滑向 x = 2，讀數一個往 2 擠、一個往 4 擠；f(2) = 4 是另外一件事。
畫面上的讀數都用 Fraction 從分段定義直接算（不用「極限」去算極限）。
"""

from fractions import Fraction

from manim import *  # noqa: F401,F403

from buzz_style import (
    BLUE, GOLD_DARK, INK, LINE, MUTED, PAPER, VIOLET,
    BuzzScene, CAP_TM, M, T, TM, axes, live, stick, title,
)

A = 2


def f(x):
    return x if x < A else x + 2


STEPS = [Fraction(1, 10), Fraction(1, 100), Fraction(1, 1000)]
LEFT_ROWS = [(A - d, f(A - d)) for d in STEPS]
RIGHT_ROWS = [(A + d, f(A + d)) for d in STEPS]
# 自我檢查：課文的數字
assert [y for _, y in LEFT_ROWS] == [Fraction(19, 10), Fraction(199, 100), Fraction(1999, 1000)]
assert [y for _, y in RIGHT_ROWS] == [Fraction(41, 10), Fraction(401, 100), Fraction(4001, 1000)]
assert f(A) == 4
# 越靠近，離 2（左）與 4（右）越近，而且差距正好是 d
for d, (_, yl), (_, yr) in zip(STEPS, LEFT_ROWS, RIGHT_ROWS):
    assert 2 - yl == d and yr - 4 == d


class OneSidedLimit(BuzzScene):
    def construct(self):
        head = title("左極限與右極限")
        ax = axes([0, 4, 1], [0, 6.5, 1], 6.4, 5.0)
        ax.move_to([-3.2, -0.1, 0])

        left_piece = ax.plot(lambda x: x, x_range=[0, 2], color=BLUE, stroke_width=5)
        right_piece = ax.plot(lambda x: x + 2, x_range=[2, 4], color=VIOLET, stroke_width=5)
        hole = Circle(radius=0.09, color=BLUE, stroke_width=4).set_fill(PAPER, 1).move_to(ax.c2p(2, 2))
        solid = Dot(ax.c2p(2, 4), radius=0.1, color=VIOLET)
        hole.set_z_index(4)
        solid.set_z_index(4)
        lab_l = TM(r"$x<2$：$f(x)=x$", size=30, color=BLUE).next_to(ax.c2p(0.15, 2.9), RIGHT, buff=0)
        lab_r = TM(r"$x\ge 2$：$f(x)=x+2$", size=30, color=VIOLET).next_to(ax.c2p(2.3, 3.2), RIGHT, buff=0)
        guide2 = DashedLine(ax.c2p(0, 2), ax.c2p(2, 2), color=BLUE, stroke_width=2, dash_length=0.08).set_opacity(0.6)
        guide4 = DashedLine(ax.c2p(0, 4), ax.c2p(2, 4), color=VIOLET, stroke_width=2, dash_length=0.08).set_opacity(0.6)

        self.play(FadeIn(head), Create(ax), run_time=1.0)
        self.play(Create(left_piece), Create(right_piece), FadeIn(hole), FadeIn(solid),
                  FadeIn(lab_l), FadeIn(lab_r), run_time=1.4)
        self.say("在 x = 2 斷開：左段停在高度 2，右段從 4 開始")
        self.wait(1.0)

        # 讀數看板（右半邊）
        # 距離 d = 10^(−u)：u 從 0 走到 3，d 從 1 縮到 0.001；左右各一個，互不影響
        uL, uR = ValueTracker(0.0), ValueTracker(0.0)

        def dL():
            return 10 ** (-uL.get_value())

        def dR():
            return 10 ** (-uR.get_value())

        px = 2.6
        lx_lbl = M(r"x =", size=38, color=BLUE)
        lx_val = live(lambda: 2 - dL(), 3, 38, BLUE)
        lf_lbl = M(r"f(x) =", size=38, color=BLUE)
        lf_val = live(lambda: 2 - dL(), 3, 38, BLUE)
        rx_lbl = M(r"x =", size=38, color=VIOLET)
        rx_val = live(lambda: 2 + dR(), 3, 38, VIOLET)
        rf_lbl = M(r"f(x) =", size=38, color=VIOLET)
        rf_val = live(lambda: 4 + dR(), 3, 38, VIOLET)

        left_head = T("從左邊靠近", size=30, color=BLUE)
        right_head = T("從右邊靠近", size=30, color=VIOLET)
        left_head.move_to([px + 1.1, 2.55, 0])
        lx_lbl.move_to([px, 1.85, 0], aligned_edge=LEFT)
        lf_lbl.move_to([px, 1.2, 0], aligned_edge=LEFT)
        right_head.move_to([px + 1.1, 0.15, 0])
        rx_lbl.move_to([px, -0.55, 0], aligned_edge=LEFT)
        rf_lbl.move_to([px, -1.2, 0], aligned_edge=LEFT)
        for lbl, val in ((lx_lbl, lx_val), (lf_lbl, lf_val), (rx_lbl, rx_val), (rf_lbl, rf_val)):
            stick(val, lbl, RIGHT)

        pl = always_redraw(lambda: Dot(ax.c2p(2 - dL(), 2 - dL()), radius=0.1, color=BLUE).set_z_index(3))
        pr = always_redraw(lambda: Dot(ax.c2p(2 + dR(), 4 + dR()), radius=0.1, color=VIOLET).set_z_index(3))

        def drop(color, side):
            """點到 x 軸的虛線，讓人看到 x 在 2 的哪一側。"""
            def make():
                x = 2 - dL() if side < 0 else 2 + dR()
                y = x if side < 0 else x + 2
                return DashedLine(ax.c2p(x, 0), ax.c2p(x, y), color=color,
                                  stroke_width=2, dash_length=0.07).set_opacity(0.7)
            return always_redraw(make)

        dl, dr = drop(BLUE, -1), drop(VIOLET, +1)

        # 左邊
        self.say("x 從左邊（x < 2）靠近 2，用左段 f(x) = x")
        self.play(FadeIn(pl), FadeIn(dl), FadeIn(left_head), FadeIn(lx_lbl), FadeIn(lx_val),
                  FadeIn(lf_lbl), FadeIn(lf_val), run_time=0.9)
        self.wait(0.3)
        for k in (1, 2, 3):
            self.play(uL.animate.set_value(k), run_time=1.2, rate_func=smooth)
            self.wait(0.4)
        self.play(Create(guide2), run_time=0.6)
        self.say(TM(r"左邊的高度往 2 擠：$\lim_{x\to 2^-} f(x)=2$", size=CAP_TM))
        self.wait(1.6)

        # 右邊
        self.say("x 從右邊（x > 2）靠近 2，用右段 f(x) = x + 2")
        self.play(FadeIn(pr), FadeIn(dr), FadeIn(right_head), FadeIn(rx_lbl), FadeIn(rx_val),
                  FadeIn(rf_lbl), FadeIn(rf_val), run_time=0.9)
        self.wait(0.3)
        for k in (1, 2, 3):
            self.play(uR.animate.set_value(k), run_time=1.2, rate_func=smooth)
            self.wait(0.4)
        self.play(Create(guide4), run_time=0.6)
        self.say(TM(r"右邊的高度往 4 擠：$\lim_{x\to 2^+} f(x)=4$", size=CAP_TM))
        self.wait(1.6)

        # 總結：三件事分開看
        board = VGroup(
            M(r"\lim_{x\to 2^-} f(x) = 2", size=40, color=BLUE),
            M(r"\lim_{x\to 2^+} f(x) = 4", size=40, color=VIOLET),
            M(r"f(2) = 4", size=40, color=INK),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.4).move_to([px + 1.35, 0.6, 0])
        readouts = VGroup(left_head, right_head, lx_lbl, lx_val, lf_lbl, lf_val,
                          rx_lbl, rx_val, rf_lbl, rf_val)
        for mob in readouts:
            mob.clear_updaters()
        self.say("f(2) = 4 是實心點，是第三件事，跟左極限無關")
        self.play(FadeOut(readouts), FadeOut(dl), FadeOut(dr), FadeOut(pl), FadeOut(pr), FadeIn(board[:2]), run_time=0.9)
        self.play(FadeIn(board[2]), Indicate(solid, color=VIOLET, scale_factor=1.6), run_time=1.0)
        self.wait(1.6)
        self.say("兩邊去的地方不同，所以要拆成左、右各自說")
        self.play(Indicate(board[0], color=BLUE, scale_factor=1.06), run_time=0.8)
        self.play(Indicate(board[1], color=VIOLET, scale_factor=1.06), run_time=0.8)
        self.wait(1.8)
