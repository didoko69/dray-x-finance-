# Professional thumbnails — tools/pro_thumb.py (free, no AI service)

Daniel rejected the old code-drawn thumbnails. Every video uses tools/pro_thumb.py with episodes/<ep>/pro_thumb.json
(see the header of tools/pro_thumb.py for every option). Approved examples: divinesurvival episodes/s1e3/pro_thumb.json, dray-x-finance- episodes/wirecard/pro_thumb.json.

Run: copy the engine into work/<ep> (make.sh does it), then `python3 tools/pro_thumb.py <ep>` → out/<ep>/thumbnail.jpg + work/<ep>/thumb_320.jpg.

Recipe (what makes it look pro):
1. bg: the episode's scene, zoomed in (cam zoom 1.3–1.7) on the key place/object; grade it darker and slightly desaturated (bright .75–.9, sat .7–.9),
   tint with the episode's accent colour (red #ff3a20 for danger, gold for money), blur 1–3 so the cut-outs pop.
2. burst: soft warm light rays centred behind the main character's head.
3. layers: the MAIN CHARACTER big (s 3.0–3.6 with its own cam [960,540,1,1,0,0], head ≈ 35–45% of frame height), expression 'fear'/'shock',
   white sticker outline (outline_px ~11), rim light, drop shadow. Optional 2nd layer = the threat/prop (zombie with red "glow", stack of cash, etc.),
   partly cut off by the frame for curiosity. Characters render on a green screen; blinks are avoided automatically.
4. glows: small red glowing eyes on a threat, or a light source.
5. text: 2 lines max. Line 1 = 1–3 words / a big number, Anton 240–300px, yellow→orange gradient (#fff200 → #ffa400), extrude 14–16, tilt -3/-4°.
   Line 2 = 1–2 words, 130–150px, white on a red block (box "#e0201a"). Never repeat the title. Put text on the side opposite the character.
6. Keep the bottom-right corner (YouTube timestamp) free of text and faces. Optional red arrow/circle on the key detail.
7. CHECK: open out/<ep>/thumbnail.jpg and work/<ep>/thumb_320.jpg. At 320x180 the face, threat and text must still read instantly.
   If anything is cut off, overlapping or muddy (too dark), adjust and re-run. Save design notes in episodes/<ep>/thumbnail.md.
8. Keep the channel look consistent from video to video (same fonts, colours, sticker outline, character size).
