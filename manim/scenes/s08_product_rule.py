"""乘法法則：長方形寬 f(x)、高 g(x)，x 走 h，多出三塊面積。課 product-rule 觀念 ②。

例子用課文範例 1 的 f(x) = x、g(x) = eˣ，在 x = 1。
三塊各除以 h 的讀數直接從 e^(1+h) − e 算；極限值 e、e、0 與總和 2e 用中央差分獨立驗算，
不拿乘法法則本身去證乘法法則。
"""

import math

from manim import *  # noqa: F401,F403

from buzz_style import (
    BLUE, GOLD, GOLD_DARK, GREEN, INK, LINE, MUTED, PANEL, PAPER, RED,
    BuzzScene, CAP_TM, M, T, TM, live, title,
)

X0 = 1.0
E = math.e


def f(x):
    return x


def g(x):
    return math.exp(x)


def pieces(h):
    """三塊面積各除以 h：(Δf·g, f·Δg, Δf·Δg) / h。"""
    df = f(X0 + h) - f(X0)
    dg = g(X0 + h) - g(X0)
    return df * g(X0) / h, f(X0) * dg / h, df * dg / h


def cdiff(fn, x, h=1e-5):
    return (fn(x + h) - fn(x - h)) / (2 * h)


STOPS = [0.3, 0.1, 0.02]
H_MAX = STOPS[0]
ROWS = {h: pieces(h) for h in STOPS}
# 自我檢查
for h, (a, b, c) in ROWS.items():
    total = f(X0 + h) * g(X0 + h) - f(X0) * g(X0)
    assert abs((a + b + c) - total / h) < 1e-12          # 三塊剛好是多出來的面積
assert abs(cdiff(f, X0) - 1) < 1e-8                       # f' = 1
assert abs(cdiff(g, X0) - E) < 1e-8                       # g'(1) = e（數值微分，不靠公式）
assert abs(cdiff(lambda x: f(x) * g(x), X0) - 2 * E) < 1e-8   # (x eˣ)' 在 1 = 2e，課文答案 (x+1)eˣ
gaps = [abs(ROWS[h][1] - E) for h in STOPS]
assert gaps[0] > gaps[1] > gaps[2]                        # f·Δg/h 越來越靠近 e
assert ROWS[STOPS[0]][2] > ROWS[STOPS[1]][2] > ROWS[STOPS[2]][2]   # 角落那塊越來越小

K = 1.3                       # 一單位長 = 1.3 個畫面單位
ORIGIN_PT = np.array([-4.6, -2.4, 0])
BASE_FILL = interpolate_color(ManimColor(GOLD), ManimColor(PAPER), 0.72)
FILL_FG = interpolate_color(ManimColor(BLUE), ManimColor(PAPER), 0.45)
FILL_GF = interpolate_color(ManimColor(GREEN), ManimColor(PAPER), 0.45)
FILL_C = interpolate_color(ManimColor(RED), ManimColor(PAPER), 0.25)


def box(x0, y0, x1, y1, fill, stroke=INK, sw=2):
    return Polygon(
        ORIGIN_PT + K * np.array([x0, y0, 0]), ORIGIN_PT + K * np.array([x1, y0, 0]),
        ORIGIN_PT + K * np.array([x1, y1, 0]), ORIGIN_PT + K * np.array([x0, y1, 0]),
        stroke_color=stroke, stroke_width=sw, fill_color=fill, fill_opacity=1,
    )


class ProductRule(BuzzScene):
    def construct(self):
        head = title("乘法法則：長方形長大")
        F, G = f(X0), g(X0)
        base = box(0, 0, F, G, BASE_FILL)
        area = M(r"f\,g", size=40).move_to(base)
        flab = M(r"f(x)=x", size=34, color=INK).next_to(base, DOWN, buff=0.2)
        glab = M(r"g(x)=e^x", size=34, color=INK).next_to(base, LEFT, buff=0.2)

        self.play(FadeIn(head), run_time=0.6)
        self.play(GrowFromEdge(base, DOWN), FadeIn(area), FadeIn(flab), FadeIn(glab), run_time=1.2)
        self.say("把 f(x)·g(x) 看成長方形：寬 f、高 g")
        self.wait(1.0)
        self.say(TM(r"例：$f(x)=x$，$g(x)=e^x$，看 $x=1$ 這一刻", size=CAP_TM))
        self.wait(1.2)

        h = ValueTracker(0.0001)

        def dfv():
            return f(X0 + h.get_value()) - F

        def dgv():
            return g(X0 + h.get_value()) - G

        right = always_redraw(lambda: box(F, 0, F + dfv(), G, FILL_FG, BLUE, 1.5))
        top = always_redraw(lambda: box(0, G, F, G + dgv(), FILL_GF, GREEN, 1.5))
        corner = always_redraw(lambda: box(F, G, F + dfv(), G + dgv(), FILL_C, RED, 1.5))

        # 三塊的名字一律放在外面，離開色塊至少 0.25
        lab_r = always_redraw(lambda: M(r"\Delta f\cdot g", size=34, color=BLUE).next_to(
            ORIGIN_PT + K * np.array([F + dfv(), G * 0.5, 0]), RIGHT, buff=0.25))
        lab_t = always_redraw(lambda: M(r"f\cdot\Delta g", size=34, color=GREEN).next_to(
            ORIGIN_PT + K * np.array([F * 0.5, G + dgv(), 0]), UP, buff=0.22))
        lab_c = always_redraw(lambda: M(r"\Delta f\cdot\Delta g", size=34, color=RED).next_to(
            ORIGIN_PT + K * np.array([F + dfv(), G + dgv(), 0]), UR, buff=0.18))

        self.add(right, top, corner)
        self.say("x 走到 x + h：寬多 Δf、高多 Δg，多出三塊")
        self.play(h.animate.set_value(H_MAX), run_time=1.8, rate_func=smooth)
        # 名字等色塊長好才出來（FadeIn 期間 updater 不跑，會停在舊位置）
        self.play(FadeIn(lab_r), FadeIn(lab_t), FadeIn(lab_c), run_time=0.6)
        self.wait(1.0)

        # 右邊的表：三塊各除以 h
        cols = [0.75, 2.45, 4.15, 5.85]
        header = VGroup(
            M(r"h", size=36),
            M(r"\frac{\Delta f\cdot g}{h}", size=36, color=BLUE),
            M(r"\frac{f\cdot\Delta g}{h}", size=36, color=GREEN),
            M(r"\frac{\Delta f\cdot\Delta g}{h}", size=36, color=RED),
        )
        for mob, cx in zip(header, cols):
            mob.move_to([cx, 2.3, 0])
        rule = Line([0.1, 1.75, 0], [6.75, 1.75, 0], color=MUTED, stroke_width=1.5)

        def cell(val, places, color, cx, y):
            return DecimalNumber(val, num_decimal_places=places, font_size=34, color=color).move_to([cx, y, 0])

        def row_at(hv, y):
            a, b, c = pieces(hv)
            return VGroup(
                M(f"{hv:g}", size=34).move_to([cols[0], y, 0]),
                cell(a, 4, BLUE, cols[1], y), cell(b, 4, GREEN, cols[2], y), cell(c, 4, RED, cols[3], y),
            )

        self.say("三塊都除以 h，再讓 h 變小")
        self.play(FadeIn(header), Create(rule), run_time=0.8)
        rows = VGroup()
        ys = [1.3, 0.65, 0.0]
        for i, stop in enumerate(STOPS):
            if i > 0:
                self.play(h.animate.set_value(stop), run_time=1.6, rate_func=smooth)
            r = row_at(stop, ys[i])
            rows.add(r)
            self.play(FadeIn(r, shift=UP * 0.1), run_time=0.5)
            self.wait(0.7)

        lim = VGroup(
            M(r"\downarrow", size=34).move_to([cols[0], -0.7, 0]),
            M(r"f'g=e", size=34, color=BLUE).move_to([cols[1], -0.7, 0]),
            M(r"fg'=e", size=34, color=GREEN).move_to([cols[2], -0.7, 0]),
            M(r"0", size=34, color=RED).move_to([cols[3], -0.7, 0]),
        )
        self.say("兩條長條趨近 f′g 與 fg′，角落那塊趨近 0")
        self.play(FadeIn(lim, shift=DOWN * 0.1), run_time=0.8)
        self.wait(1.8)

        final = M(r"(fg)'", r"=", r"f'g", r"+", r"fg'", size=44)
        final[2].set_color(BLUE)
        final[4].set_color(GREEN)
        check = M(rf"(x e^x)'\big|_{{x=1}} = e + e = 2e \approx {2 * E:.4f}", size=34, color=INK)
        res = VGroup(final, check).arrange(DOWN, buff=0.3).move_to([3.45, -2.0, 0])
        frame = SurroundingRectangle(final, color=GOLD, buff=0.2, corner_radius=0.12, stroke_width=3)
        self.say("前微後不微，加上前不微後微")
        self.play(FadeIn(res, shift=UP * 0.15), Create(frame), run_time=1.0)
        self.wait(2.8)
