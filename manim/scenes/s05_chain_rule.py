"""連鎖律：y = sin(x²) 看成兩台機器 x →[g: 平方]→ u →[f: sin]→ y，在 x = 1。

小變化 Δx 經過 g 被放大約 g′(1) = 2 倍，經過 f 再乘約 f′(1) = cos 1 倍。
表格裡每個比值都直接從 sin、平方算出來，不用連鎖律本身。
"""

import math

from manim import *  # noqa: F401,F403

from buzz_style import (
    BLUE, GOLD, GOLD_DARK, GREEN, INK, MUTED, PANEL, RED, VIOLET,
    BuzzScene, CAP_TM, M, T, TM, title,
)

X0 = 1.0
DXS = [0.1, 0.01, 0.001]


def g(x):
    return x * x


def f(u):
    return math.sin(u)


def ratios(dx):
    u0, u1 = g(X0), g(X0 + dx)
    du = u1 - u0
    dy = f(u1) - f(u0)
    return du / dx, dy / du, dy / dx


ROWS = {dx: ratios(dx) for dx in DXS}
LIMIT = (2 * X0, math.cos(g(X0)), 2 * X0 * math.cos(g(X0)))
# 自我檢查：比值往極限靠，而且越靠越近
prev = None
for dx in DXS:
    r = ROWS[dx]
    assert abs(r[0] * r[1] - r[2]) < 1e-12           # Δy/Δx = (Δu/Δx)(Δy/Δu) 是恆等式
    gap = max(abs(a - b) for a, b in zip(r, LIMIT))
    assert prev is None or gap < prev
    prev = gap
assert abs(LIMIT[2] - 1.0806046117) < 1e-9

DX_DEMO = 0.01
DU_DEMO = g(X0 + DX_DEMO) - g(X0)                    # 0.0201
DY_DEMO = f(g(X0 + DX_DEMO)) - f(g(X0))              # 0.010689…


def s(x, p):
    return f"{x:.{p}f}"


class ChainRule(BuzzScene):
    def construct(self):
        head = title("連鎖律：兩台機器，倍數相乘")

        def machine(name, rule, color):
            box = RoundedRectangle(width=3.0, height=1.45, corner_radius=0.18,
                                   stroke_color=color, stroke_width=3, fill_color=PANEL, fill_opacity=1)
            lbl = VGroup(T(name, size=28, color=color), M(rule, size=36)).arrange(DOWN, buff=0.12)
            lbl.move_to(box)
            return VGroup(box, lbl)

        mg = machine("機器 g", r"u = x^2", GREEN)
        mf = machine("機器 f", r"y = \sin u", VIOLET)
        vx, vu, vy = M("x", size=46), M("u", size=46), M("y", size=46)
        row = VGroup(vx, mg, vu, mf, vy).arrange(RIGHT, buff=0.95).move_to([0, 1.4, 0])
        arrows = VGroup(*[
            Arrow(a.get_right(), b.get_left(), buff=0.15, color=MUTED, stroke_width=4,
                  max_tip_length_to_length_ratio=0.3)
            for a, b in ((vx, mg), (mg, vu), (vu, mf), (mf, vy))
        ])

        self.play(FadeIn(head), run_time=0.6)
        self.play(LaggedStart(FadeIn(vx), GrowArrow(arrows[0]), FadeIn(mg), GrowArrow(arrows[1]),
                              FadeIn(vu), GrowArrow(arrows[2]), FadeIn(mf), GrowArrow(arrows[3]),
                              FadeIn(vy), lag_ratio=0.25), run_time=2.0)
        self.say(TM(r"$y=\sin(x^2)$：先平方，再取 $\sin$", size=CAP_TM))
        self.wait(0.8)

        # 在 x = 1 的值
        def under(mob, tex, color=INK, size=38):
            return M(tex, size=size, color=color).next_to(mob, DOWN, buff=0.45)

        v0 = VGroup(
            under(vx, r"1"),
            under(vu, r"1"),
            under(vy, rf"\sin 1 \approx {s(math.sin(1), 4)}", size=34),
        )
        self.play(FadeIn(v0), run_time=0.8)
        self.wait(0.8)

        # 推一下 Δx
        dvals = VGroup(
            under(v0[0], rf"\Delta x = {DX_DEMO}", BLUE, 34).next_to(v0[0], DOWN, buff=0.3),
            under(v0[1], rf"\Delta u = {s(DU_DEMO, 4)}", GREEN, 34).next_to(v0[1], DOWN, buff=0.3),
            under(v0[2], rf"\Delta y = {s(DY_DEMO, 6)}", VIOLET, 34).next_to(v0[2], DOWN, buff=0.3),
        )
        for mob in (v0[2], dvals[2]):   # 右邊不要貼出畫面
            mob.shift(LEFT * max(0, mob.get_right()[0] - 6.7))
        gain_g = M(rf"\times g'(1) = \times 2", size=32, color=GREEN).next_to(mg, UP, buff=0.22)
        gain_f = M(rf"\times f'(1) = \times\cos 1 \approx \times {s(math.cos(1), 4)}", size=30,
                   color=VIOLET).next_to(mf, UP, buff=0.22)

        self.say(TM(r"把 $x$ 推一點點：$1 \to 1.01$，看小變化怎麼一路傳下去", size=CAP_TM))
        self.play(FadeIn(dvals[0]), Indicate(vx, color=BLUE), run_time=0.9)
        self.play(FadeIn(gain_g), Indicate(mg[0], color=GREEN, scale_factor=1.05), run_time=0.8)
        self.play(FadeIn(dvals[1]), run_time=0.7)
        self.say(TM(r"經過 $g$：$\Delta u \approx g'(1)\,\Delta x = 2\times 0.01 = 0.02$（實際 $0.0201$）", size=CAP_TM))
        self.wait(1.6)
        self.play(FadeIn(gain_f), Indicate(mf[0], color=VIOLET, scale_factor=1.05), run_time=0.8)
        self.play(FadeIn(dvals[2]), run_time=0.7)
        self.say(TM(
            rf"經過 $f$：$\Delta y \approx \cos 1 \times 0.0201 \approx {s(math.cos(1) * DU_DEMO, 5)}$"
            rf"（實際 ${s(DY_DEMO, 5)}$）", size=CAP_TM))
        self.wait(1.8)

        # 表格：Δx 變小，三個比值收斂
        self.say("Δx 越小，每台機器的倍數越接近它的導數，總倍數＝兩個倍數相乘")
        header = [M(r"\Delta x", size=32), M(r"\dfrac{\Delta u}{\Delta x}", size=32, color=GREEN),
                  M(r"\dfrac{\Delta y}{\Delta u}", size=32, color=VIOLET),
                  M(r"\dfrac{\Delta y}{\Delta x}", size=32, color=RED)]
        body = []
        for dx in DXS:
            a, b, c = ROWS[dx]
            body.append([M(f"{dx}", size=32), M(s(a, 4), size=32), M(s(b, 5), size=32), M(s(c, 5), size=32)])
        lim = [M(r"\to 0", size=32), M(r"\to 2", size=32, color=GREEN),
               M(rf"\to \cos 1 \approx {s(LIMIT[1], 5)}", size=30, color=VIOLET),
               M(rf"\to {s(LIMIT[2], 5)}", size=32, color=RED)]
        table = MobjectTable(
            [header] + body + [lim], include_outer_lines=False,
            line_config=dict(stroke_width=1.5, color=MUTED), v_buff=0.16, h_buff=0.55,
        )
        table.scale_to_fit_height(3.0).move_to([0, -1.05, 0])
        self.play(FadeOut(dvals), FadeOut(v0), FadeIn(table), run_time=1.0)
        self.wait(2.6)

        final = M(r"\frac{dy}{dx}", r"=", r"f'(u)", r"\cdot", r"g'(x)", r"=", r"\cos(x^2)\cdot 2x",
                  size=40)
        final[2].set_color(VIOLET)
        final[4].set_color(GREEN)
        at1 = M(rf"\left.\frac{{dy}}{{dx}}\right|_{{x=1}} = 2\cos 1 \approx {s(LIMIT[2], 4)}", size=36, color=RED)
        fin = VGroup(final, at1).arrange(RIGHT, buff=0.8)
        if fin.width > 13.2:
            fin.scale_to_fit_width(13.2)
        fin.move_to([0, 1.55, 0])
        self.say("連鎖律：外層的導數（在 u 算）乘上內層的導數")
        self.play(FadeOut(VGroup(row, arrows, gain_g, gain_f)), FadeIn(fin, shift=UP * 0.15), run_time=1.0)
        self.wait(3.0)
