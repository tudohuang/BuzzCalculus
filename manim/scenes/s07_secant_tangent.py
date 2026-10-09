"""割線到切線：y = x²，P(1, 1)，Q(1 + h, (1 + h)²)，課 secant-to-tangent 觀念 ②。

Q 從右邊、再從左邊滑向 P，割線斜率 ((1 + h)² − 1)/h 往 2 擠；h = 0 時是 0/0。
讀數直接拿兩點算斜率（不用 2 + h 那個化簡後的式子），再跟課文的 2.1、2.01、1.99、1.9 對。
"""

from fractions import Fraction

from manim import *  # noqa: F401,F403

from buzz_style import (
    BLUE, GOLD, GOLD_DARK, GREEN, INK, MUTED, PAPER, RED, VIOLET,
    BuzzScene, CAP_TM, M, T, TM, axes, live, stick, title,
)

X_MIN, X_MAX, Y_MIN, Y_MAX = -1.0, 2.5, -1.0, 5.0


def f(x):
    return x * x


def secant_slope(h):
    return (f(1 + h) - f(1)) / h


STOPS_RIGHT = [Fraction(1, 10), Fraction(1, 100)]
STOPS_LEFT = [Fraction(-1, 10), Fraction(-1, 100)]
# 自我檢查：課文的四個數字，用兩點斜率精確算
assert [secant_slope(h) for h in STOPS_RIGHT] == [Fraction(21, 10), Fraction(201, 100)]
assert [secant_slope(h) for h in STOPS_LEFT] == [Fraction(19, 10), Fraction(199, 100)]
assert secant_slope(Fraction(1)) == 3 and secant_slope(Fraction(-1)) == 1
# 切線 y = 2x − 1：過 P，而且跟曲線只在 x = 1 相碰（x² − 2x + 1 = (x − 1)² ≥ 0）
assert 2 * 1 - 1 == f(1)
assert all(f(Fraction(k, 10)) - (2 * Fraction(k, 10) - 1) >= 0 for k in range(-10, 26))


def clipped_line(ax, x0, y0, m, color, width):
    """過 (x0, y0)、斜率 m 的直線，裁在視窗裡。"""
    xs = [X_MIN, X_MAX]
    if m != 0:
        xs += [x0 + (Y_MIN - y0) / m, x0 + (Y_MAX - y0) / m]
    xs = sorted(x for x in xs if X_MIN - 1e-9 <= x <= X_MAX + 1e-9
                and Y_MIN - 1e-9 <= y0 + m * (x - x0) <= Y_MAX + 1e-9)
    a, b = xs[0], xs[-1]
    return Line(ax.c2p(a, y0 + m * (a - x0)), ax.c2p(b, y0 + m * (b - x0)), color=color, stroke_width=width)


class SecantToTangent(BuzzScene):
    def construct(self):
        head = title("割線到切線")
        ax = axes([X_MIN, X_MAX, 1], [Y_MIN, Y_MAX, 1], 5.6, 5.4)
        ax.move_to([-3.5, -0.15, 0])
        curve = ax.plot(f, x_range=[-1, 2.236], color=BLUE, stroke_width=5)
        clab = M(r"y=x^2", size=34, color=BLUE).next_to(ax.c2p(2.236, 5.0), RIGHT, buff=0.15)   # 曲線尾端右邊，離 y 軸刻度遠
        P = Dot(ax.c2p(1, 1), radius=0.09, color=INK).set_z_index(6)
        Plab = M(r"P(1,\,1)", size=32).next_to(P, DR, buff=0.12)

        self.play(FadeIn(head), Create(ax), run_time=1.0)
        self.play(Create(curve), FadeIn(clab), FadeIn(P), FadeIn(Plab), run_time=1.2)
        self.say("一個點算不出斜率：先借第二個點 Q")

        h = ValueTracker(1.0)
        Q = always_redraw(lambda: Dot(ax.c2p(1 + h.get_value(), f(1 + h.get_value())),
                                      radius=0.09, color=RED).set_z_index(6))

        def qlabel():
            hv = h.get_value()
            lbl = M("Q", size=34, color=RED).next_to(ax.c2p(1 + hv, f(1 + hv)), DR, buff=0.12)
            return lbl.set_opacity(min(1, max(0, (abs(hv) - 0.25) / 0.25)))
        Qlab = always_redraw(qlabel)
        sec = always_redraw(lambda: clipped_line(ax, 1, 1, secant_slope(h.get_value()), RED, 4).set_z_index(4))

        # 讀數
        px = 1.2
        formula = VGroup(TM(r"割線斜率 $=$", size=34, color=RED),
                         M(r"\frac{(1+h)^2-1}{h}", size=40, color=RED)).arrange(RIGHT, buff=0.15)
        formula.move_to([px, 2.45, 0], aligned_edge=LEFT)
        hl = M(r"h =", size=40)
        hl.move_to([px, 1.35, 0], aligned_edge=LEFT)
        hv = stick(live(lambda: h.get_value(), 3, 40), hl, RIGHT)
        sl = TM(r"斜率 $=$", size=34, color=RED)
        sl.move_to([px + 2.9, 1.35, 0], aligned_edge=LEFT)
        sv = stick(live(lambda: float(secant_slope(h.get_value())), 3, 40, RED), sl, RIGHT)

        self.play(FadeIn(Q), FadeIn(Qlab), Create(sec), FadeIn(formula), FadeIn(hl), FadeIn(hv),
                  FadeIn(sl), FadeIn(sv), run_time=1.0)
        self.say(TM(r"$Q=(1+h,\,(1+h)^2)$，割線 $PQ$ 的斜率", size=CAP_TM))
        self.wait(1.2)

        # 表格：停下來的地方記一筆
        rows = VGroup()

        def row(hval):
            return VGroup(M(rf"h={float(hval):g}", size=36),
                          M(rf"\to {float(secant_slope(hval)):g}", size=36, color=RED))

        def place(r, i):
            # 一列一筆、兩欄對齊：h 在左，斜率在右
            y = 0.35 - i * 0.62
            r[0].move_to([px, y, 0], aligned_edge=LEFT)
            r[1].move_to([px + 2.6, y, 0], aligned_edge=LEFT)
            return r

        self.say("Q 從右邊滑向 P")
        for i, stop in enumerate(STOPS_RIGHT):
            self.play(h.animate.set_value(float(stop)), run_time=1.6, rate_func=smooth)
            r = place(row(stop), i)
            rows.add(r)
            self.play(FadeIn(r, shift=UP * 0.1), run_time=0.5)
            self.wait(0.5)

        # 換到左邊：淡出、換位置、淡入（不讓點瞬間跳過去）
        self.play(FadeOut(Q), FadeOut(Qlab), FadeOut(sec), run_time=0.5)
        h.set_value(-1.0)
        self.say("再從左邊（h < 0）滑過來")
        self.play(FadeIn(Q), FadeIn(Qlab), FadeIn(sec), run_time=0.5)
        for i, stop in enumerate(STOPS_LEFT):
            self.play(h.animate.set_value(float(stop)), run_time=1.6, rate_func=smooth)
            r = place(row(stop), 2 + i)
            rows.add(r)
            self.play(FadeIn(r, shift=UP * 0.1), run_time=0.5)
            self.wait(0.5)
        self.say("兩邊的割線斜率都往 2 擠")
        self.wait(1.4)

        # h 不能是 0
        zero = TM(r"$h=0$：$\dfrac{0}{0}$，只剩一個點", size=34, color=MUTED)
        zero.move_to([px, -2.35, 0], aligned_edge=LEFT)
        self.say("h 不能直接代 0：Q 跟 P 重合，只剩一個點")
        self.play(FadeIn(zero), run_time=0.6)
        self.wait(1.4)

        # 切線
        tangent = clipped_line(ax, 1, 1, 2, GOLD_DARK, 6).set_z_index(5)
        result = VGroup(
            M(r"m=\lim_{h\to 0}\frac{(1+h)^2-1}{h}=2", size=40, color=GOLD_DARK),
            M(r"y=2x-1", size=40, color=GOLD_DARK),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.35)
        result.move_to([px, 0.0, 0], aligned_edge=LEFT)
        for mob in (hv, sv):
            mob.clear_updaters()
        self.say("極限 2 就是切線斜率：切線 y = 2x − 1")
        self.play(FadeOut(VGroup(rows, zero, hl, hv, sl, sv)), FadeOut(sec), FadeOut(Q), FadeOut(Qlab),
                  run_time=0.6)
        self.play(Create(tangent), FadeIn(result, shift=UP * 0.15), run_time=1.2)
        self.wait(2.6)
