"""幾何級數：首項 1，公比 r（課 geometric-series），觀念 ③ 收斂的條件。

一、r = 1/2：每一塊都是剩下那塊的一半，一塊塊填進 2 × 1 的長方形，部分和往 2 擠，差距正好是最後一塊。
二、r = −1/2：部分和在數線上左右跳，夾向 2/3。
三、r = 3/2：部分和衝出去；硬代公式 1/(1 − r) 會得到 −2（課文觀念 ④ 的陷阱）。
部分和全部用 Fraction 一項一項加（不用公式）。
"""

from fractions import Fraction

from manim import *  # noqa: F401,F403

from buzz_style import (
    BLUE, GOLD, GOLD_DARK, GREEN, INK, LINE, MUTED, PANEL, PAPER, RED, VIOLET,
    BuzzScene, CAP_TM, M, T, TM, title,
)


def partial_sums(r, n):
    out, s, term = [], Fraction(0), Fraction(1)
    for _ in range(n):
        s += term
        out.append(s)
        term *= r
    return out


HALF = partial_sums(Fraction(1, 2), 8)
NEG = partial_sums(Fraction(-1, 2), 8)
BIG = partial_sums(Fraction(3, 2), 3)

# 自我檢查
for n, s in enumerate(HALF, start=1):
    assert 2 - s == Fraction(1, 2 ** (n - 1))                 # 差距 = 最後加進去的那一塊
for a, b in zip(NEG, NEG[1:]):
    assert (a - Fraction(2, 3)) * (b - Fraction(2, 3)) < 0   # 在 2/3 兩側來回跳
assert abs(NEG[-1] - Fraction(2, 3)) < Fraction(1, 300)
assert BIG == [1, Fraction(5, 2), Fraction(19, 4)]
assert 1 / (1 - Fraction(3, 2)) == -2
assert 1 / (1 - Fraction(1, 2)) == 2 and 1 / (1 - Fraction(-1, 2)) == Fraction(2, 3)

K = 2.9
RECT_LL = np.array([-6.6, -1.4, 0])
FILLS = [interpolate_color(ManimColor(c), ManimColor(PAPER), 0.45) for c in (BLUE, GOLD, GREEN, VIOLET)]


def pieces(n):
    """前 n 塊：每一塊是剩下長方形沿長邊切一半。回傳 (x, y, w, h)（資料單位）。"""
    out = []
    rx, ry, rw, rh = 0.0, 0.0, 2.0, 1.0
    for _ in range(n):
        if rw >= rh:
            out.append((rx, ry, rw / 2, rh))
            rx, rw = rx + rw / 2, rw / 2
        else:
            out.append((rx, ry, rw, rh / 2))
            ry, rh = ry + rh / 2, rh / 2
    return out


def frac_tex(q):
    q = Fraction(q)
    if q.denominator == 1:
        return str(q.numerator)
    sign = "-" if q < 0 else ""
    return rf"{sign}\tfrac{{{abs(q.numerator)}}}{{{q.denominator}}}"


class GeometricSeries(BuzzScene):
    def construct(self):
        head = title("幾何級數：什麼時候加得完")

        # 一、r = 1/2 填長方形
        outline = Rectangle(width=2 * K, height=K, color=INK, stroke_width=3)
        outline.move_to(RECT_LL + np.array([K, K / 2, 0]))
        two = TM(r"面積 $2$", size=34, color=MUTED).next_to(outline, UP, buff=0.15).align_to(outline, LEFT)
        self.play(FadeIn(head), Create(outline), FadeIn(two), run_time=1.0)
        self.say(TM(r"$1+1/2+1/4+\cdots$：每一項乘上公比 $r=1/2$", size=CAP_TM))

        px = 0.35
        rows = VGroup()
        shown = VGroup()
        for i, (x, y, w, h) in enumerate(pieces(8)):
            rect = Rectangle(width=w * K, height=h * K, stroke_color=INK, stroke_width=2,
                             fill_color=FILLS[i % 4], fill_opacity=1)
            rect.move_to(RECT_LL + K * np.array([x + w / 2, y + h / 2, 0]))
            grp = VGroup(rect)
            if i < 3:
                grp.add(M(frac_tex(Fraction(1, 2 ** i)), size=44 if i == 0 else 40).move_to(rect))
            n = i + 1
            s = HALF[i]
            row = VGroup(M(rf"s_{{{n}}}={frac_tex(s)}", size=44),
                         M(rf"2-s_{{{n}}}={frac_tex(2 - s)}", size=44, color=RED))
            row.arrange(DOWN, aligned_edge=LEFT, buff=0.35).move_to([px, 1.1, 0], aligned_edge=LEFT)
            run = 0.7 if i < 4 else 0.35
            if not rows:
                self.play(FadeIn(grp, scale=0.9), FadeIn(row), run_time=run)
            else:
                self.play(FadeIn(grp, scale=0.9), FadeOut(rows[-1]), FadeIn(row), run_time=run)
            rows.add(row)
            shown.add(grp)
            if i == 2:
                self.say("每一塊都是剩下那塊的一半：永遠填不滿")
            self.wait(0.6 if i < 4 else 0.15)
        self.wait(0.6)

        lim = M(r"s_n\to 2=\frac{1}{1-\frac12}", size=44, color=GREEN).move_to([px, -1.0, 0], aligned_edge=LEFT)
        self.say("差距正好是最後一塊，越來越小：部分和往 2 擠")
        self.play(FadeIn(lim, shift=UP * 0.1), run_time=0.8)
        self.wait(1.8)

        # 二、三：數線（兩條各自的範圍，跳動才看得清楚）
        self.play(FadeOut(VGroup(outline, two, shown, rows[-1], lim)), run_time=0.7)
        nl_neg = NumberLine(x_range=[-0.1, 1.2, 0.1], length=10.0, color=MUTED, stroke_width=2,
                            include_numbers=False).move_to([0.9, 0.35, 0])
        nl_big = NumberLine(x_range=[-2.5, 5.5, 0.5], length=10.0, color=MUTED, stroke_width=2,
                            include_numbers=False).move_to([0.9, -1.85, 0])

        def ints(nl, ks):
            return VGroup(*[M(str(k), size=32, color=MUTED).next_to(nl.n2p(k), DOWN, buff=0.15) for k in ks])

        tag_neg = M(r"r=-\tfrac12", size=40, color=BLUE).next_to(nl_neg, LEFT, buff=0.4)
        tag_big = M(r"r=\tfrac32", size=40, color=RED).next_to(nl_big, LEFT, buff=0.4)
        tag_big.align_to(tag_neg, LEFT)

        def hops(nl, sums, color):
            arcs, dots = VGroup(), VGroup()
            prev = Fraction(0)
            for s in sums:
                a, b = nl.n2p(float(prev)), nl.n2p(float(s))
                ang = -PI / 4 if b[0] > a[0] else PI / 4     # 一律往上彎
                arcs.add(ArcBetweenPoints(a, b, angle=ang, color=color, stroke_width=3))
                dots.add(Dot(b, radius=0.07, color=color).set_z_index(3))
                prev = s
            return arcs, dots

        self.play(Create(nl_neg), FadeIn(ints(nl_neg, (0, 1))), FadeIn(tag_neg), run_time=0.8)
        self.say(TM(r"公比 $r=-1/2$：部分和左右跳，夾向 $2/3$", size=CAP_TM))
        arcs, dots = hops(nl_neg, NEG, BLUE)
        for k in range(len(NEG)):
            self.play(Create(arcs[k]), FadeIn(dots[k]), run_time=0.55 if k < 3 else 0.3)
        target = Line(nl_neg.n2p(2 / 3) + DOWN * 0.2, nl_neg.n2p(2 / 3) + UP * 0.2, color=GREEN, stroke_width=5)
        tlab = M(r"\tfrac23", size=36, color=GREEN).next_to(nl_neg.n2p(2 / 3), DOWN, buff=0.38)
        self.play(Create(target), FadeIn(tlab), run_time=0.5)
        self.wait(1.2)

        self.play(Create(nl_big), FadeIn(ints(nl_big, (-2, -1, 0, 1, 2, 3, 4, 5))), FadeIn(tag_big), run_time=0.8)
        self.say(TM(r"公比 $r=3/2$：部分和一路衝出去，發散", size=CAP_TM))
        arcs2, dots2 = hops(nl_big, BIG, RED)
        for k in range(len(BIG)):
            self.play(Create(arcs2[k]), FadeIn(dots2[k]), run_time=0.55)
        off = Arrow(nl_big.n2p(4.75) + UP * 0.3, nl_big.get_right() + UP * 0.3 + RIGHT * 0.45, buff=0,
                    color=RED, stroke_width=5, max_tip_length_to_length_ratio=0.3)
        inf = M(r"\infty", size=40, color=RED).next_to(off, UP, buff=0.1)
        self.play(GrowArrow(off), FadeIn(inf), run_time=0.6)
        self.wait(0.6)

        wrong = VGroup(
            Line(nl_big.n2p(-2) + UL * 0.2, nl_big.n2p(-2) + DR * 0.2, color=RED, stroke_width=5),
            Line(nl_big.n2p(-2) + UR * 0.2, nl_big.n2p(-2) + DL * 0.2, color=RED, stroke_width=5),
        )
        wlab = M(r"\frac{1}{1-\frac32}=-2", size=36, color=RED).next_to(nl_big.n2p(-2), UP, buff=0.35)
        self.say("硬代公式得到 −2：正數加起來不可能是負的")
        self.play(Create(wrong), FadeIn(wlab), run_time=0.8)
        self.wait(1.8)

        final = M(r"\sum_{n=0}^{\infty} a r^n=\frac{a}{1-r}\quad(|r|<1)", size=40)
        box = SurroundingRectangle(final, color=GOLD, buff=0.18, corner_radius=0.12, stroke_width=3)
        grp = VGroup(box, final).move_to([0, 2.2, 0])
        assert grp.get_top()[1] < 3.0
        self.say("只有 |r| < 1，和才是 首項 /（1 − 公比）")
        self.play(FadeIn(grp, shift=DOWN * 0.1), run_time=0.9)
        self.wait(2.4)
