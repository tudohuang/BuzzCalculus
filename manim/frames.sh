#!/usr/bin/env bash
# 從一支影片均勻抽 N 格拼成一張接觸表，渲染完一定要用眼睛看過。
#   wsl -e bash manim/frames.sh manim/out/riemann-light-1080p.mp4 [N=12]
set -euo pipefail
video="$1"
n="${2:-12}"
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$here/out/frames"
base="$(basename "${video%.*}")"
dur="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$video")"
cols=3
rows=$(( (n + cols - 1) / cols ))
fps="$(awk -v n="$n" -v d="$dur" 'BEGIN{printf "%.5f", n/d}')"
ffmpeg -loglevel error -y -i "$video" -vf "fps=$fps,scale=640:-2,tile=${cols}x${rows}:padding=6:color=gray" \
  -frames:v 1 "$here/out/frames/$base-sheet.png"
echo "$here/out/frames/$base-sheet.png  (${dur}s)"
