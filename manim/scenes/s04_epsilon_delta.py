"""ε-δ：f(x) = x²，x₀ = 2，L = 4。δ = min(1, ε/5)，因為 |x − 2| < 1 ⇒ |x + 2| < 5。

每個 ε 都用分數精確驗證：x ∈ (2 − δ, 2 + δ) 時 x² ∈ ((2−δ)², (2+δ)²) ⊂ (4 − ε, 4 + ε)。
"""

from fractions import Fraction as Fr

from manim import *  # noqa: F401,F403

from buzz_style import (
    BLUE, GOLD, GOLD_DARK, GREEN, INK, MUTED, PAPER, RED,
    BuzzScene, CAP_TM, M, T, TM, axes, title,
)

X0, L = 2, 4
EPSILONS = [Fr(3), Fr(3, 2), Fr(3, 4)]


def delta(eps):
    return min(Fr(1), eps / 5)


def nice(q):
    """分數 → 最短的有限小數字串（本場景的數都是有限小數）。"""
    s = f"{float(q):.6f}".rstrip("0").rstrip(".")
    assert Fr(s) == q, (q, s)   # 確保沒有四捨五入
    return s


# 自我檢查：x² 在 (2−δ, 2+δ) 上單調，所以像就是兩端點的平方；要落在帶子裡
for e in EPSILONS + [Fr(10), Fr(1, 100)]:
    d = delta(e)
    lo, hi = (X0 - d) ** 2, (X0 + d) ** 2
    assert L - e <= lo and hi <= L + e, e
# 反例：只取 ε/5、不和 1 取 min 時，ε = 10 會失敗
CE_EPS, CE_X = Fr(10), Fr(39, 10)
assert abs(CE_X - X0) < CE_EPS / 5 and abs(CE_X ** 2 - L) > CE_EPS
CE_GAP = CE_X ** 2 - L   # 11.21


class EpsilonDelta(BuzzScene):
    def construct(self):
        head = title("ε-δ：x 靠近 2 時，x² 靠近 4")
        ax = axes([0, 3.5, 1], [0, 10, 2], 5.6, 5.3)
        ax.move_to([-3.9, -0.25, 0])
        graph = ax.plot(lambda x: x * x, x_range=[0, 10 ** 0.5], color=BLUE, stroke_width=5)
        glbl = M(r"y=x^2", size=34, color=BLUE).next_to(ax.c2p(3.1, 9.6), LEFT, buff=0.2)
        pt = Dot(ax.c2p(2, 4), radius=0.08, color=INK)
        guides = VGroup(
            DashedLine(ax.c2p(2, 0), ax.c2p(2, 4), color=MUTED, stroke_width=2),
            DashedLine(ax.c2p(0, 4), ax.c2p(2, 4), color=MUTED, stroke_width=2),
        )

        self.play(FadeIn(head), Create(ax), run_time=1.0)
        self.play(Create(graph), FadeIn(glbl), FadeIn(pt), Create(guides), run_time=1.2)
        self.say(TM(r"要說清楚「$x\to 2$ 時 $x^2\to 4$」：先讓對手出一個誤差 $\varepsilon$", size=CAP_TM))

        eps = ValueTracker(float(EPSILONS[0]))

        def d_of():
            return min(1.0, eps.get_value() / 5)

        def eps_band():
            e = eps.get_value()
            return Polygon(
                ax.c2p(0, 4 - e), ax.c2p(3.5, 4 - e), ax.c2p(3.5, 4 + e), ax.c2p(0, 4 + e),
                stroke_width=0, fill_color=GOLD, fill_opacity=0.28,
            )

        def delta_band():
            d = d_of()
            return Polygon(
                ax.c2p(2 - d, 0), ax.c2p(2 + d, 0), ax.c2p(2 + d, 10), ax.c2p(2 - d, 10),
                stroke_width=0, fill_color=BLUE, fill_opacity=0.16,
            )

        def good_piece():
            d = d_of()
            return ax.plot(lambda x: x * x, x_range=[2 - d, 2 + d, d / 40], color=GREEN, stroke_width=9)

        eb = always_redraw(eps_band)
        eb.set_z_index(-1)
        self.play(FadeIn(eb), run_time=0.8)
        self.say(TM(r"$\varepsilon$ 給定：$x^2$ 必須落在金色帶子 $(4-\varepsilon,\ 4+\varepsilon)$ 裡", size=CAP_TM))
        self.wait(0.8)

        # 右邊推導
        rx = 3.35
        lines = VGroup(
            TM(r"目標：$|x^2-4|<\varepsilon$", size=34),
            M(r"|x^2-4| = |x-2|\,|x+2|", size=36),
            TM(r"先要 $\delta\le 1$：$1<x<3$，所以 $|x+2|<5$", size=34),
            M(r"|x^2-4| < 5\,|x-2| < 5\delta \le \varepsilon", size=36),
            TM(r"取 $\delta=\min\!\left(1,\ \tfrac{\varepsilon}{5}\right)$", size=36, color=BLUE),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        lines.move_to([rx, 1.05, 0])
        lines.align_to(np.array([-0.1, 0, 0]), LEFT)   # 靠左對齊在座標圖右邊
        pick_box = SurroundingRectangle(lines[4], color=BLUE, buff=0.12, corner_radius=0.1, stroke_width=2.5)

        self.say("找 δ：讓 x 離 2 不到 δ，就保證 x² 在帶子裡")
        self.play(FadeIn(lines[0]), run_time=0.6)
        self.play(FadeIn(lines[1]), run_time=0.6)
        self.wait(0.6)
        self.say(TM(r"$|x-2|$ 可以控制；$|x+2|$ 先用 $\delta\le 1$ 把它壓在 5 以下", size=CAP_TM))
        self.play(FadeIn(lines[2]), run_time=0.6)
        self.wait(1.0)
        self.play(FadeIn(lines[3]), run_time=0.6)
        self.play(FadeIn(lines[4]), Create(pick_box), run_time=0.8)
        self.wait(0.8)

        db = always_redraw(delta_band)
        db.set_z_index(-1)
        gp = always_redraw(good_piece)
        self.play(FadeIn(db), FadeIn(gp), run_time=0.8)

        def check(e):
            d = delta(e)
            lo, hi = (X0 - d) ** 2, (X0 + d) ** 2
            g = VGroup(
                M(rf"\varepsilon = {nice(e)}", r"\;\Rightarrow\;", rf"\delta = {nice(d)}", size=36),
                M(rf"x\in({nice(X0 - d)},\ {nice(X0 + d)})", size=34),
                M(rf"\Rightarrow\ x^2\in({nice(lo)},\ {nice(hi)})", size=34, color=GREEN),
                M(rf"\subset({nice(L - e)},\ {nice(L + e)})", size=34, color=GOLD_DARK),
            ).arrange(DOWN, aligned_edge=LEFT, buff=0.16)
            g[0][0].set_color(GOLD_DARK)
            g[0][2].set_color(BLUE)
            g.next_to(lines, DOWN, buff=0.4).align_to(lines, LEFT)
            return g

        chk = check(EPSILONS[0])
        self.say("x 在藍色範圍內，整段曲線（綠色）都在金色帶子裡")
        self.play(FadeIn(chk), run_time=0.8)
        self.wait(2.0)

        self.say("ε 變小，δ 跟著變小——但不管 ε 多小，δ 都找得到")
        for e in EPSILONS[1:]:
            new_chk = check(e)
            self.play(eps.animate.set_value(float(e)), FadeOut(chk), FadeIn(new_chk), run_time=1.8)
            chk = new_chk
            self.wait(1.6)

        # 為什麼要和 1 取 min
        ce = TM(
            rf"只取 $\delta=\varepsilon/5$ 會出事：$\varepsilon=10$ 時 $\delta=2$，"
            rf"$x={nice(CE_X)}$ 卻有 $|x^2-4|={nice(CE_GAP)}>10$",
            size=CAP_TM,
        )
        if ce.width > 13.4:
            ce.scale_to_fit_width(13.4)
        self.say(ce)
        self.play(Indicate(lines[2], color=RED, scale_factor=1.05), run_time=1.2)
        self.wait(2.6)
