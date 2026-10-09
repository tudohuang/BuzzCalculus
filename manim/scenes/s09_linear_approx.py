"""線性近似：y = √x 與它在 x = 4 的切線 L(x) = 2 + (x − 4)/4，課 linear-approximation 觀念 ①。

一個方形視窗往 (4, 2) 放大（視窗寬 8 → 0.08），曲線和切線越來越分不開；
旁邊的表是 x = 4 + h 時兩者的高度與差距，h 縮成十分之一、差距約縮成百分之一。
√ 直接用 math.sqrt 算，切線斜率用中央差分驗算 1/4，不拿公式套公式。
"""

import math

from manim import *  # noqa: F401,F403

from buzz_style import (
    BLUE, GOLD, GOLD_DARK, GREEN, INK, LINE, MUTED, PANEL, PAPER, RED,
    BuzzScene, CAP_TM, M, T, TM, live, stick, title,
)

A = 4.0


def f(x):
    return math.sqrt(x)


def L(x):
    return 2 + (x - A) / 4


HS = [1.0, 0.1, 0.01]
ROWS = {h: (f(A + h), L(A + h), L(A + h) - f(A + h)) for h in HS}

# 自我檢查
assert abs((f(A + 1e-6) - f(A - 1e-6)) / 2e-6 - 0.25) < 1e-8      # f'(4) = 1/4
assert f(A) == 2 and L(A) == 2
assert f"{ROWS[0.1][0]:.6f}" == "2.024846" and f"{ROWS[0.1][1]:.3f}" == "2.025"   # 課文的數字
assert f"{ROWS[0.1][2]:.5f}" == "0.00015"
for h in HS:
    assert ROWS[h][2] > 0                       # 凹向下：切線在曲線上方，估計偏高
for h1, h2 in zip(HS, HS[1:]):
    ratio = ROWS[h1][2] / ROWS[h2][2]
    assert 80 < ratio < 110                     # h 縮成 1/10，差距縮成約 1/100

W0 = 4.0                    # 一開始視窗半寬（資料單位）：x ∈ [0, 8]
SIZE = 5.4                  # 視窗在畫面上的邊長
CENTER = np.array([-3.75, -0.15, 0])


def sig(x, n=2):
    """有效數字 n 位的小數字串（不用科學記號，手機上比較好讀）。"""
    places = max(0, n - 1 - int(math.floor(math.log10(abs(x)))))
    return f"{x:.{places}f}"


assert sig(ROWS[1.0][2]) == "0.014" and sig(ROWS[0.1][2]) == "0.00015" and sig(ROWS[0.01][2]) == "0.0000016"


class LinearApprox(BuzzScene):
    def construct(self):
        head = title("線性近似：放大就是直線")
        z = ValueTracker(0.0)               # 視窗半寬 w = 4·10^(−z)

        def w():
            return W0 * 10 ** (-z.get_value())

        def to_screen(x, y):
            s = SIZE / 2 / w()
            return CENTER + np.array([(x - A) * s, (y - 2) * s, 0])

        frame = Square(side_length=SIZE, color=LINE, stroke_width=2).move_to(CENTER)
        frame.set_fill(PANEL, 1).set_z_index(0)

        def graph(fn, color, width):
            def make():
                lo = max(0.0, A - w())
                xs = np.linspace(lo, A + w(), 240)
                pts = [to_screen(x, fn(x)) for x in xs]
                return VMobject(stroke_color=color, stroke_width=width).set_points_as_corners(pts).set_z_index(2)
            return always_redraw(make)

        curve = graph(f, BLUE, 6)
        tline = graph(L, GOLD_DARK, 4)
        dot = Dot(CENTER, radius=0.08, color=INK).set_z_index(4)
        dlab = M(r"(4,\,2)", size=32).next_to(dot, UL, buff=0.2).set_z_index(4)

        px = -0.3
        leg = VGroup(
            M(r"y=\sqrt{x}", size=38, color=BLUE),
            M(r"L(x)=2+\tfrac14(x-4)", size=38, color=GOLD_DARK),
        ).arrange(RIGHT, buff=0.6).move_to([px, 2.55, 0], aligned_edge=LEFT)
        wl = TM(r"視窗寬", size=32, color=MUTED).move_to([px, 1.75, 0], aligned_edge=LEFT)
        wv = stick(live(lambda: 2 * w(), 2, 36, MUTED), wl, RIGHT)

        self.play(FadeIn(head), FadeIn(frame), run_time=0.8)
        self.add(curve, tline)
        self.play(FadeIn(leg), FadeIn(dot), FadeIn(dlab), FadeIn(wl), FadeIn(wv), run_time=1.0)
        self.say(TM(r"$\sqrt{x}$ 和它在 $x=4$ 的切線：離 4 越遠，差得越多", size=CAP_TM))
        self.wait(1.8)

        self.say("往 (4, 2) 放大：曲線越來越像那條直線")
        self.play(z.animate.set_value(1.0), run_time=2.6, rate_func=smooth)
        self.wait(0.6)
        self.play(z.animate.set_value(2.0), run_time=2.6, rate_func=smooth)
        self.wait(1.0)
        self.say("放大到最後分不開：在 4 附近，切線的高度可以代替曲線")
        self.wait(1.8)

        # 表：x = 4 + h
        cols = [px + 0.35, px + 2.15, px + 4.05, px + 5.95]
        hdr = VGroup(M(r"h", size=36), M(r"\sqrt{4+h}", size=36, color=BLUE),
                     M(r"L(4+h)", size=36, color=GOLD_DARK), TM(r"差距", size=32, color=RED))
        for mob, cx in zip(hdr, cols):
            mob.move_to([cx, 0.85, 0])
        rule = Line([px - 0.1, 0.4, 0], [px + 6.95, 0.4, 0], color=MUTED, stroke_width=1.5)
        rows = VGroup()
        for i, h in enumerate(HS):
            y = -0.05 - 0.62 * i
            sq, lin, gap = ROWS[h]
            rows.add(VGroup(
                M(f"{h:g}", size=34).move_to([cols[0], y, 0]),
                M(f"{sq:.6f}", size=34, color=BLUE).move_to([cols[1], y, 0]),
                M(f"{lin:g}", size=34, color=GOLD_DARK).move_to([cols[2], y, 0]),
                M(sig(gap), size=34, color=RED).move_to([cols[3], y, 0]),
            ))
        self.say(TM(r"估 $\sqrt{4.1}$：切線給 $2.025$，真值 $2.024846\ldots$", size=CAP_TM))
        self.play(FadeIn(hdr), Create(rule), run_time=0.6)
        self.play(LaggedStart(*[FadeIn(r, shift=UP * 0.1) for r in rows], lag_ratio=0.5), run_time=1.8)
        self.play(Indicate(rows[1], color=GOLD, scale_factor=1.04), run_time=1.0)
        self.wait(1.2)

        gaps = VGroup(*[r[3] for r in rows])
        mark = SurroundingRectangle(VGroup(gaps, hdr[3]), color=RED, buff=0.15, corner_radius=0.1, stroke_width=3)
        self.say("h 縮成十分之一，差距約縮成百分之一")
        self.play(Create(mark), run_time=0.8)
        self.wait(1.8)

        final = M(r"f(a+h)\approx f(a)+f'(a)\,h", size=42)
        box = SurroundingRectangle(final, color=GOLD, buff=0.2, corner_radius=0.12, stroke_width=3)
        grp = VGroup(final, box).move_to([px + 3.4, -2.35, 0])
        self.say("從已知的 f(a) 出發，走 h，高度大約變 f′(a)h")
        self.play(FadeIn(grp, shift=UP * 0.15), run_time=0.9)
        self.wait(2.6)
