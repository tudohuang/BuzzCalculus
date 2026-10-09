"""BuzzCalculus 動畫的共用樣式。

色票照網站 styles.css 的 :root 與 [data-theme="dark"]。
主題由環境變數 BUZZ_THEME=light|dark 決定（render.sh 會設），預設 light。

規則：
- 字幕一律用 caption()，字級固定，1080p 下中文字高約 40px，手機看得清楚。
- 數學一律用 M()（MathTex），中文混數學用 TM()（xelatex + xeCJK）。
- 畫面上出現的每一個數字都要從定義算出來，不要手打。
"""

import os

from manim import (
    DOWN,
    UP,
    Axes,
    FadeIn,
    FadeOut,
    MathTex,
    Scene,
    Rectangle,
    Tex,
    TexTemplate,
    Text,
    VGroup,
    config,
)

THEME = os.environ.get("BUZZ_THEME", "light").strip().lower()
if THEME not in ("light", "dark"):
    THEME = "light"

_PALETTES = {
    "light": dict(
        paper="#f6f7f4", panel="#ffffff", ink="#252923", muted="#6b7168",
        line="#c8cfc0", gold="#dca72d", gold_dark="#8b650c", green="#21835b",
        red="#c94b43", blue="#2767a8", violet="#6952a9",
    ),
    "dark": dict(
        paper="#151614", panel="#22231f", ink="#f0eee6", muted="#b9b5aa",
        line="#565750", gold="#e4b447", gold_dark="#ffd77a", green="#62c991",
        red="#ef786e", blue="#78b7ee", violet="#a997ee",
    ),
}
P = _PALETTES[THEME]

PAPER = P["paper"]
PANEL = P["panel"]
INK = P["ink"]
MUTED = P["muted"]
LINE = P["line"]
GOLD = P["gold"]
GOLD_DARK = P["gold_dark"]
GREEN = P["green"]
RED = P["red"]
BLUE = P["blue"]
VIOLET = P["violet"]

FONT = "Noto Sans CJK TC"

config.background_color = PAPER

# 中文混數學：xelatex + xeCJK，字型跟 Text 用同一套
CJK_TEMPLATE = TexTemplate(
    tex_compiler="xelatex",
    output_format=".xdv",
    preamble=(
        "\\usepackage{amsmath}\n"
        "\\usepackage{amssymb}\n"
        "\\usepackage{xeCJK}\n"
        "\\setCJKmainfont{Noto Sans CJK TC}\n"
    ),
)

CAPTION_SIZE = 34   # Manim font_size；1080p 下中文字高約 40px
CAP_TM = 38         # 字幕若夾數學改用 TM()，這個字級跟 CAPTION_SIZE 的中文等高
LABEL_SIZE = 30
TITLE_SIZE = 44


def T(text, size=LABEL_SIZE, color=None, weight="NORMAL"):
    """純中文／英文字。"""
    return Text(text, font=FONT, font_size=size, color=color or INK, weight=weight)


def M(*tex, size=40, color=None):
    """純數學。"""
    return MathTex(*tex, font_size=size, color=color or INK)


def TM(*tex, size=36, color=None):
    """中文夾數學，用 $…$ 寫數學。"""
    return Tex(*tex, font_size=size, color=color or INK, tex_template=CJK_TEMPLATE)


def caption(text, size=CAPTION_SIZE):
    """畫面最下方的字幕，帶一條淡底，避免壓在圖上看不清楚。"""
    if isinstance(text, str):
        body = T(text, size=size)
    else:
        body = text
    bg = Rectangle(
        width=config.frame_width,
        height=body.height + 0.42,
        fill_color=PAPER,
        fill_opacity=0.92,
        stroke_width=0,
    )
    group = VGroup(bg, body)
    group.to_edge(DOWN, buff=0)
    body.move_to(bg)
    return group


def title(text):
    t = T(text, size=TITLE_SIZE, weight="BOLD")
    t.to_edge(UP, buff=0.35)
    return t


def axes(x_range, y_range, x_length, y_length, **kw):
    """教科書樣式的座標軸：細線、墨色、刻度數字用 MathTex。"""
    ax = Axes(
        x_range=x_range,
        y_range=y_range,
        x_length=x_length,
        y_length=y_length,
        tips=False,
        axis_config=dict(
            color=MUTED,
            stroke_width=2,
            include_numbers=kw.pop("numbers", True),
            font_size=30,
            decimal_number_config=dict(num_decimal_places=0, color=MUTED),
        ),
        **kw,
    )
    return ax


class BuzzScene(Scene):
    """字幕切換的小幫手：self.say("…") 會淡出舊字幕、淡入新字幕。"""

    def setup(self):
        self._cap = None

    def say(self, text, run_time=0.6):
        new = caption(text)
        new.set_z_index(20)
        # 先淡出再淡入：兩行字幕疊在一起的那幾格很難看
        if self._cap is not None:
            self.play(FadeOut(self._cap), run_time=run_time * 0.4)
        self.play(FadeIn(new), run_time=run_time * 0.6)
        self._cap = new


def fmt(x, places=4):
    """給 MathTex 用的數字格式：固定小數位（TeX 的 - 本來就排成減號）。"""
    s = f"{x:.{places}f}"
    if s.startswith("-") and float(s) == 0:
        s = s[1:]
    return s
