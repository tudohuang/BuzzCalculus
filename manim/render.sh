#!/usr/bin/env bash
# 在 WSL 裡渲染 BuzzCalculus 的 Manim 動畫。
#
#   wsl -e bash manim/render.sh                 # 全部場景、淺色＋深色
#   wsl -e bash manim/render.sh riemann         # 只渲染一支（用短名）
#   THEMES=light wsl -e bash manim/render.sh    # 只要淺色
#   QUICK=1 wsl -e bash manim/render.sh ftc     # 480p15 草稿，看排版用
#
# 產出（manim/out/，不進版控）：
#   <name>-<theme>-1080p.mp4   1920×1080 30fps H.264，無聲
#   <name>-<theme>-720p.mp4    1280×720
#   <name>-<theme>-poster.jpg  最後一格，當 <video poster>
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV="${MANIM_VENV:-$HOME/manim-venv}"
MANIM="$VENV/bin/manim"
OUT="$HERE/out"
MEDIA="$OUT/_media"
THEMES="${THEMES:-light dark}"
CRF_1080="${CRF_1080:-28}"
CRF_720="${CRF_720:-29}"

# 短名 → 檔案:類別
declare -A SCENES=(
  [riemann]="s01_riemann.py:RiemannToIntegral"
  [ftc]="s02_ftc.py:FundamentalTheorem"
  [taylor]="s03_taylor.py:TaylorExp"
  [epsilon-delta]="s04_epsilon_delta.py:EpsilonDelta"
  [chain-rule]="s05_chain_rule.py:ChainRule"
)
ORDER=(riemann ftc taylor epsilon-delta chain-rule)

if [[ ! -x "$MANIM" ]]; then
  echo "找不到 $MANIM；先照 manim/README.md 建 venv。" >&2
  exit 1
fi

names=("$@")
[[ ${#names[@]} -eq 0 ]] && names=("${ORDER[@]}")

mkdir -p "$OUT" "$MEDIA"
cd "$HERE/scenes"

for name in "${names[@]}"; do
  spec="${SCENES[$name]:-}"
  if [[ -z "$spec" ]]; then
    echo "不認得的場景：$name（可用：${ORDER[*]}）" >&2
    exit 1
  fi
  file="${spec%%:*}"
  cls="${spec##*:}"
  for theme in $THEMES; do
    tag="$name-$theme"
    if [[ -n "${QUICK:-}" ]]; then
      BUZZ_THEME="$theme" "$MANIM" render -ql --media_dir "$MEDIA" -o "$tag-draft" "$file" "$cls"
      continue
    fi
    BUZZ_THEME="$theme" "$MANIM" render --resolution 1920,1080 --frame_rate 30 \
      --media_dir "$MEDIA" -o "$tag-raw" "$file" "$cls"
    raw="$(find "$MEDIA/videos" -name "$tag-raw.mp4" -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)"
    ffmpeg -loglevel error -y -i "$raw" -an -c:v libx264 -preset slow -crf "$CRF_1080" \
      -pix_fmt yuv420p -tune animation -movflags +faststart "$OUT/$tag-1080p.mp4"
    ffmpeg -loglevel error -y -i "$raw" -an -vf scale=1280:720:flags=lanczos -c:v libx264 \
      -preset slow -crf "$CRF_720" -pix_fmt yuv420p -tune animation -movflags +faststart "$OUT/$tag-720p.mp4"
    ffmpeg -loglevel error -y -sseof -0.2 -i "$raw" -frames:v 1 -vf scale=1280:-2 -q:v 4 "$OUT/$tag-poster.jpg"
    printf '%-28s %s\n' "$tag" "$(du -h "$OUT/$tag-1080p.mp4" "$OUT/$tag-720p.mp4" | awk '{printf "%s ", $1}')"
  done
done
