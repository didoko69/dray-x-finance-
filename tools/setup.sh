#!/bin/bash
# One-time per fresh container: TTS models + python deps. Run from repo root.
set -e
pip install --break-system-packages -q kokoro-onnx soundfile numpy pillow >/dev/null
mkdir -p tts
[ -f tts/kokoro.onnx ] || curl -sSL -o tts/kokoro.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
[ -f tts/voices.bin ] || curl -sSL -o tts/voices.bin https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
mkdir -p work && ln -sfn ../tts work/tts   # engine/tts.py loads ../tts from work/<ep>
node -e "require('playwright')" && echo "setup ok"
