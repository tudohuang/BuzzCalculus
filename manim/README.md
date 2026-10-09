# BuzzCalculus 概念動畫（Manim）

自成一包的 Manim Community Edition 專案，用來做「最核心概念」的短動畫（大多數概念用站內的互動圖，這裡只做 15–20 支影片）。
**整個 `manim/` 刪掉不影響網站**：網站只認 `media/manifest.json` 與課程資料裡的 `video` 欄位（怎麼接見 [INTEGRATION.md](INTEGRATION.md)）。

## 目前 15 支

| 短名 | 檔案 | 概念 | 對應課 |
|---|---|---|---|
| `riemann` | `scenes/s01_riemann.py` | 黎曼和 → 定積分：x²+1 在 [0,2]，n = 4 → 8 → 16 → 32 → 64（每次對半切），左右和夾向 14/3 | `riemann-sum-intuition` |
| `ftc` | `scenes/s02_ftc.py` | 微積分基本定理：累積面積 A(x) 的斜率＝f(x) 的高度 | `ftc-part1` |
| `taylor` | `scenes/s03_taylor.py` | eˣ 的 Taylor 多項式 T₁…T₇，誤差 < 0.1 的範圍越來越寬 | `taylor-polynomial` |
| `epsilon-delta` | `scenes/s04_epsilon_delta.py` | x² 在 2：δ = min(1, ε/5)，為什麼要和 1 取 min | `epsilon-delta-quadratic` |
| `chain-rule` | `scenes/s05_chain_rule.py` | sin(x²) 兩台機器，小變化的倍數相乘 | `chain-rule` |
| `one-sided-limit` | `scenes/s06_one_sided_limit.py` | 分段函數在 x = 2 斷開：左右兩點各自滑過去，讀數往 2 與 4 擠 | `limit-one-sided` |
| `secant-tangent` | `scenes/s07_secant_tangent.py` | y = x²，Q 從兩邊滑向 P(1, 1)，割線斜率 2.1、2.01、1.99、1.9 → 2 | `secant-to-tangent` |
| `product-rule` | `scenes/s08_product_rule.py` | x·eˣ 的長方形長大：三塊多出來的面積各除以 h | `product-rule` |
| `linear-approx` | `scenes/s09_linear_approx.py` | 往 (4, 2) 放大，√x 和切線分不開；h ÷ 10 時差距 ÷ 100 | `linear-approximation` |
| `mean-value` | `scenes/s10_mean_value.py` | x³ 在 [0, 3]：割線平行往下推，切到的地方 c = √3 | `mean-value-theorem` |
| `related-rates` | `scenes/s11_related_rates.py` | 5 公尺梯子，梯腳每秒 1 公尺（畫面上真的 1 秒 1 公尺），dy/dt 越來越大 | `related-rates` |
| `box-optimization` | `scenes/s12_box_optimization.py` | 12 × 12 紙板摺盒子，紙板、盒子、V(x) 一起動，x = 2 時 V = 128 | `optimization-geometry` |
| `volume-disk` | `scenes/s13_volume_disk.py` | √x 繞 x 軸：圓盤滑過去，再一片片疊起來，7π → 31π/4 → 8π | `volume-disk` |
| `geometric-series` | `scenes/s14_geometric_series.py` | r = 1/2 填長方形；r = −1/2 左右跳到 2/3；r = 3/2 發散、公式給 −2 | `geometric-series` |
| `polar-area` | `scenes/s15_polar_area.py` | 心臟線：射線轉一圈，24 片扇形加起來＝3π/2 | `polar-area` |

每支 20–35 秒、無聲、字幕燒在畫面上（繁中）。淺色（網站紙色）與深色兩版。對應的觀念段落、片長、說明見 [INTEGRATION.md](INTEGRATION.md) 的表。

## 環境（WSL Ubuntu 22.04）

Windows 的 `python` 是 Store 的空殼，一律在 WSL 裡跑。系統已有 `libcairo2-dev`、`libpango1.0-dev`、`pkg-config`、`ffmpeg`、TeX Live（含 `xelatex`、`xeCJK`）、`dvisvgm`、Noto Sans CJK TC 字型。

```bash
# python3-venv 沒裝、apt 又壞掉時（BADSIG），用 virtualenv 代替：
pip3 install --user virtualenv
python3 -m virtualenv ~/manim-venv
~/manim-venv/bin/pip install manim        # 會編 pycairo / manimpango，要幾分鐘
~/manim-venv/bin/manim --version          # Manim Community v0.19.1
```

（裝得了 `python3.10-venv` 的話，`python3 -m venv ~/manim-venv` 也一樣。venv 放在家目錄，不在 repo 裡。）

## 渲染

從 Windows：

```bash
wsl -e bash manim/render.sh                   # 全部、淺色＋深色
wsl -e bash manim/render.sh riemann ftc       # 指定幾支
THEMES=light wsl -e bash manim/render.sh      # 只要淺色（WSL 裡跑時才吃得到環境變數）
QUICK=1 wsl -e bash manim/render.sh taylor    # 480p15 草稿，看排版用，幾秒鐘
```

產出在 `manim/out/`（不進版控）：

- `<name>-<theme>-1080p.mp4`：1920×1080、30 fps、H.264（CRF 28，`-tune animation`，faststart）、無音軌
- `<name>-<theme>-720p.mp4`：1280×720
- `<name>-<theme>-poster.jpg`：最後一格，給 `<video poster>`
- `_media/`：Manim 的中間檔與快取，可以整個刪掉

**渲染完一定要看過**：`wsl -e bash manim/frames.sh manim/out/riemann-light-1080p.mp4 12` 會抽 12 格拼成 `out/frames/*-sheet.png`。

## 寫新場景的規則

- 先讀目標課的 JSON（`tools/content/course_v2/lessons/<id>.json`）：函數、記號、例子的數字照課文（課文的範例就是最好的素材）。
- 字幕一行、左右各留 0.6（`caption()` 會 assert，太長直接失敗）；字幕約 26 個中文字以內。分數在字幕裡寫 `1/2`，不要 `\tfrac`（手機上太小）。
- 標籤一律放在圖形外面、離線條至少 0.15；會動的標籤用 `always_redraw` 或 `stick()`，而且等圖形長好才 FadeIn（FadeIn 期間 updater 不跑，標籤會停在舊位置）。
- 不要瞬移：要換位置就淡出、改值、淡入，或另外用一個 ValueTracker。

- 色票、字型、字幕都從 `scenes/buzz_style.py` 拿，不要在場景裡寫死顏色（深色版才會對）。
- 字幕用 `self.say("…")`；字幕裡有數學就用 `self.say(TM(r"… $x^2$ …", size=CAP_TM))`。
  純 `Text` 裡別放 Unicode 上下標（ₙ、ᵏ）——字型沒有那些字，會變豆腐。
- `M()`（MathTex，走 latex）裡不能有中文或 Unicode 減號；中文夾數學用 `TM()`（xelatex + xeCJK）。
- **畫面上每一個數字都要從定義算出來**，並在檔案開頭用 `assert` 自我檢查（Fraction 能精確就用 Fraction）。
  例如 FTC 那支的 A(x) 是 Simpson 數值積分、斜率是中央差分，刻意不拿定理本身去證定理。
- 1080p 下字幕中文字高約 40px；標籤不要小於 `size=30`。
- 含 LaTeX 的 .py 用編輯器寫，**不要用 heredoc／sed 改**——反斜線會被吃掉（`\to` 變成 tab + `o`）。

## 檔案大小

試做 5 支（23–29 秒）：1080p 每支 570–710 KB，720p 330–400 KB（render.sh 每支會印出大小）。目標是 1080p ≤ 2 MB。
