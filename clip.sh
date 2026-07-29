#!/bin/sh
# Save the image currently on the macOS clipboard to images/<id>.<ext>
#   ./clip.sh havena
# Pasting a screenshot into a chat does not clear the clipboard, so this still
# works right after you hand the image to an agent.
#
# Retina screenshots run 3-4 MB each. Capped at 2000px wide and written as webp
# (~15x smaller) so a few hundred references stay a repo you can clone.
set -e
[ -n "$1" ] || { echo "usage: ./clip.sh <entry-id>" >&2; exit 1; }

dir="$(cd "$(dirname "$0")" && pwd)"
tmp="${TMPDIR:-/tmp}/clip-$$.png"
MAX=2000

# Read the clipboard BEFORE opening the file, so a clipboard holding text
# fails without leaving an empty png behind.
osascript \
  -e 'set d to (the clipboard as «class PNGf»)' \
  -e "set f to open for access POSIX file \"$tmp\" with write permission" \
  -e 'write d to f' \
  -e 'close access f' >/dev/null 2>&1 \
  || { rm -f "$tmp"; echo "No image on the clipboard." >&2; exit 1; }

w=$(sips -g pixelWidth "$tmp" | awk '/pixelWidth/{print $2}')
if [ "$w" -gt "$MAX" ]; then width=$MAX; else width=$w; fi   # never upscale

if command -v cwebp >/dev/null 2>&1; then
  rel="images/$1.webp"
  cwebp -quiet -resize "$width" 0 -q 92 "$tmp" -o "$dir/$rel"
else
  rel="images/$1.png"                                        # no cwebp: still downscale
  sips -Z "$width" "$tmp" --out "$dir/$rel" >/dev/null
fi
rm -f "$tmp"

echo "$rel  ($(du -h "$dir/$rel" | cut -f1 | tr -d ' '), ${width}px wide)"
