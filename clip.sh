#!/bin/sh
# Save the image currently on the macOS clipboard to images/<id>.png
#   ./clip.sh havena
# Pasting a screenshot into a chat does not clear the clipboard, so this still
# works right after you hand the image to an agent.
set -e
[ -n "$1" ] || { echo "usage: ./clip.sh <entry-id>" >&2; exit 1; }

out="$(cd "$(dirname "$0")" && pwd)/images/$1.png"

# Read the clipboard BEFORE opening the file, so a clipboard holding text
# fails without leaving an empty png behind.
osascript \
  -e 'set d to (the clipboard as «class PNGf»)' \
  -e "set f to open for access POSIX file \"$out\" with write permission" \
  -e 'write d to f' \
  -e 'close access f' >/dev/null 2>&1 \
  || { echo "No image on the clipboard." >&2; exit 1; }

echo "images/$1.png"
