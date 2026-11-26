#!/bin/bash
# Build one episode end to end.  Usage: tools/make.sh s1e2   (run from repo root)
# Produces out/<ep>/video.mp4 (720p lite), thumbnail.jpg, captions.srt
set -e
EP=$1; ROOT=$(pwd); W=$ROOT/work/$EP; O=$ROOT/out/$EP
mkdir -p $W $O
cp -n engine/* $W/ 2>/dev/null || true
cp engine/page.html engine/tl.py engine/tts.py $W/
cp episodes/$EP/shots.py $W/
[ -f episodes/$EP/ep.js ] && cp episodes/$EP/ep.js $W/ep.js
cd $W
python3 tts.py
python3 tl.py
mkdir -p fr
for w in 0 1 2 3; do node rend.js $w 4 > rlog$w.txt 2>&1 & done; wait
grep -h ERR rlog*.txt && { echo "RENDER ERRORS"; exit 1; } || true
python3 sound.py
ffmpeg -y -loglevel error -framerate 30 -i fr/%05d.jpg -i mix.wav -vf scale=1280:720 -c:v libx264 -preset veryfast -crf 27 -pix_fmt yuv420p \
  -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 128k -ar 48000 -shortest -movflags +faststart $O/video.mp4
cp captions.srt $O/captions.srt
cd $ROOT && python3 tools/fthumb.py $EP
ls -la $O
