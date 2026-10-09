"""黎曼和 → 定積分：f(x) = x² + 1 在 [0, 2]，n = 4, 8, 16, 64，左右和夾向 14/3。"""

from fractions import Fraction

from manim import *  # noqa: F401,F403

from buzz_style import (
    BLUE, GOLD, GOLD_DARK, GREEN, INK, LINE, MUTED, PAPER,
    BuzzScene, M, T, TM, axes, fmt, title,
)

A, B = 0, 2
# 不透明的淡色填色：藍疊在金上不會混成灰色
LEFT_FILL = interpolate_color(ManimColor(BLUE), ManimColor(PAPER), 0.55)
RIGHT_FILL = interpolate_color(ManimColor(GOLD), ManimColor(PAPER), 0.55)
NS = [4, 8, 16, 64]
EXACT = Fraction(14, 3)


def f(x):
    return x * x + 1


def riemann(n, side):
    """用分數精確計算左和／右和。"""
    h = Fraction(B - A, n)
    start = 0 if side == "left" else 1
    return sum(f(A + (i + start) * h) * h for i in range(n))


# 畫面上的數字都從這裡來；也順便自我檢查
SUMS = {n: (riemann(n, "left"), riemann(n, "right")) for n in NS}
for n, (lo, hi) in SUMS.items():
    assert lo < EXACT < hi
    assert hi - lo == Fraction(8, n)          # R − L = (f(2) − f(0))·h = 4·(2/n)
    # 封閉式：L_n = 2 + 4(n−1)(2n−1)/(3n²)
    assert lo == 2 + Fraction(4 * (n - 1) * (2 * n - 1), 3 * n * n)


class RiemannToIntegral(BuzzScene):
    def construct(self):
        head = title("黎曼和 → 定積分")
        ax = axes([0, 2.25, 0.5], [0, 5.5, 1], 6.6, 5.0)
        ax.x_axis.numbers.set_opacity(0)  # 0.5 的刻度不印數字，只印 0, 1, 2
        xlabels = VGroup(*[
            M(str(k), size=30, color=MUTED).next_to(ax.c2p(k, 0), DOWN, buff=0.18)
            for k in (0, 1, 2)
        ])
        ax_group = VGroup(ax, xlabels).to_edge(LEFT, buff=0.7).shift(DOWN * 0.15)
        curve = ax.plot(f, x_range=[0, 2.12], color=BLUE, stroke_width=5).set_z_index(3)
        flabel = M(r"f(x)=x^2+1", size=34, color=BLUE).next_to(ax.c2p(1.15, 4.6), LEFT, buff=0.1)

        self.play(FadeIn(head), Create(ax), FadeIn(xlabels), run_time=1.0)
        self.play(Create(curve), FadeIn(flabel), run_time=1.2)
        self.say("把 [0, 2] 切成 n 段，每段畫一個長方形")

        # 右邊的數字看板
        panel_x = 3.7
        num_line = NumberLine(
            x_range=[3.5, 6.0, 0.5], length=4.6, color=MUTED, stroke_width=2,
            include_numbers=True, font_size=28,
            decimal_number_config=dict(num_decimal_places=1, color=MUTED),
        ).move_to([panel_x, -1.35, 0])
        exact_tick = Line(
            num_line.n2p(float(EXACT)) + DOWN * 0.22, num_line.n2p(float(EXACT)) + UP * 0.22,
            color=GREEN, stroke_width=5,
        )
        exact_lbl = M(r"\frac{14}{3}", size=32, color=GREEN).next_to(exact_tick, UP, buff=0.08)

        def readout(n):
            lo, hi = SUMS[n]
            g = VGroup(
                M(rf"n = {n}", size=40),
                M(rf"L_{{{n}}} = {fmt(float(lo))}", size=38, color=BLUE),
                M(rf"R_{{{n}}} = {fmt(float(hi))}", size=38, color=GOLD_DARK),
                M(rf"R_{{{n}}} - L_{{{n}}} = \tfrac{{8}}{{{n}}} = {fmt(float(hi - lo))}", size=32, color=MUTED),
            ).arrange(DOWN, aligned_edge=LEFT, buff=0.26)
            g.move_to([panel_x, 1.25, 0])
            return g

        def bracket(n):
            lo, hi = SUMS[n]
            p, q = num_line.n2p(float(lo)), num_line.n2p(float(hi))
            bar = Line(p, q, color=GOLD, stroke_width=10).set_opacity(0.85)
            lo_dot = Dot(p, radius=0.07, color=BLUE)
            hi_dot = Dot(q, radius=0.07, color=GOLD_DARK)
            return VGroup(bar, lo_dot, hi_dot)

        def rects(n, side):
            h = (B - A) / n
            out = VGroup()
            sw = 2 if n <= 16 else 0.8
            for i in range(n):
                x0, x1 = A + i * h, A + (i + 1) * h
                y = f(x0) if side == "left" else f(x1)
                r = Polygon(
                    ax.c2p(x0, 0), ax.c2p(x1, 0), ax.c2p(x1, y), ax.c2p(x0, y),
                    stroke_color=INK if side == "left" else GOLD_DARK,
                    stroke_width=sw,
                    stroke_opacity=0.55,
                    fill_color=LEFT_FILL if side == "left" else RIGHT_FILL,
                    fill_opacity=1,
                )
                out.add(r)
            out.set_z_index(2 if side == "left" else 1)
            return out

        n = NS[0]
        left = rects(n, "left")
        self.play(LaggedStart(*[GrowFromEdge(r, DOWN) for r in left], lag_ratio=0.15), run_time=1.4)
        board = readout(n)
        self.play(FadeIn(board[0]), FadeIn(board[1]))
        self.say("左端點的高度：長方形都在曲線下面，左和 L 偏小")
        self.wait(1.2)

        right = rects(n, "right")
        self.play(FadeIn(right), FadeIn(board[2]), run_time=1.0)
        self.say("右端點的高度：長方形都蓋過曲線，右和 R 偏大")
        self.wait(1.2)

        br = bracket(n)
        self.play(Create(num_line), FadeIn(br), FadeIn(board[3]), run_time=1.0)
        self.play(Create(exact_tick), FadeIn(exact_lbl), run_time=0.6)
        self.say("真正的面積一定夾在 L 與 R 之間")
        self.wait(1.4)

        self.say("n 加倍：兩者的差 R − L = 8 / n 一路變小")
        for n in NS[1:]:
            new_left, new_right = rects(n, "left"), rects(n, "right")
            new_board, new_br = readout(n), bracket(n)
            self.play(
                Transform(left, new_left), Transform(right, new_right),
                FadeOut(board), FadeIn(new_board), Transform(br, new_br),
                run_time=1.4,
            )
            board = new_board
            self.wait(1.3 if n < 64 else 1.8)

        self.say("n → ∞ 時兩邊夾到同一個數，這個數就是定積分")
        line1 = M(r"\int_0^2 (x^2+1)\,dx", r"=", r"\lim_{n\to\infty} L_n", size=42)
        line2 = M(r"=", r"\frac{14}{3}", r"\approx", fmt(float(EXACT)), size=42)
        line2[1].set_color(GREEN)
        final = VGroup(line1, line2).arrange(DOWN, buff=0.35)
        line2.align_to(line1[1], LEFT)
        final.move_to([panel_x, 1.2, 0])
        self.play(FadeOut(board), FadeIn(final, shift=UP * 0.2), run_time=1.0)
        self.play(Indicate(exact_lbl, color=GREEN), run_time=1.0)
        self.wait(2.5)
