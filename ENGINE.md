# How episodes are built

Everything is code-drawn 2D (SVG in a headless browser). One episode = `episodes/<ep>/shots.py` (+ optional `ep.js`, `thumb.json`, `thumb_shots.json`, `package.json`).
`tools/make.sh <ep>` → `out/<ep>/video.mp4` (720p), `thumbnail.jpg`, `captions.srt` (subtitles are burned in).

Survival-series example lives in didoko69/divinesurvival. The canonical example here is `episodes/wirecard/shots.py` — copy its helpers block (A/Y/W/Z/fc/V/CUT/CARD/C/TW/SUP…) verbatim.

## shots.py DSL
- `V(text, env, light, cam, actors, fx=[], au={}, voice='nar', card=None, gap=.3, fc_=None, cuts=[...], day=N, slam='TEXT', hl='TEXT', flash='white'|'red', tilt=±deg, hand=amp)`
  One narration line = one shot. `cam=(x, y, zoomStart, zoomEnd, panX, panY[, shake])`. `fc_=fc(actor, z, z1)` = face close-up.
  `cuts=[CUT(...)]` splits a long line into extra camera angles. `card=` shows a full-screen card instead of a scene.
- `CARD(C(t='day', n=5), 1.6)` silent cards (day, title a='TEXT', blackend).
- Voices: 'nar' (am_michael), 'walt' (bm_george), 'radio' (am_onyx). Add more in engine/tts.py V_ dict.
- Actors: `Y(x,y,s,pose,flip,expr)`, `W(...)`, `Z(x,y,s,pose,flip,v=variant)`, `A('pax', x, y, s, pose, f, v=i)` civilians.
  Poses used successfully: stand sit sleep walk run crouch crouchwalk peek push pull point hold lift lookup radio shh still scared sofa shamble turn.
  Expressions: det fear sad soft. `mv=px` slides an actor during the shot.
- Lights: brday brdusk brnight bred (bridge world) + many older ones (day night dawn sunset storm red …).
- Envs (bridge world, engine/env10.js): brdeck brwide busroof busin brend brdown charge home; older worlds in env*.js (street, roof, aisle, stairwell, hospital wards, ship, desert …).
- Cards: sup (supplies counters), prob (PROBLEM #N), rule (RULE N), loot (found items), rain (math), tower (water-tower light, n= counts flashes, morse=1), bmap (map), news, dradio (radio), title, day, blackend, bnote, plus many older (map, morse, timer, notice, phone, cctv…).
- fx: tlight carlights charges fast horde hordemove carwall smoke newsTV tarp rainfx pulse + older ones (rain, storm, flashlight, candle…).
- au (sound, 0–1): tension wind rain cityamb engine mystery groan growl run scream crowdpanic hit sting riser silence drop_after hb tick pops static beep alarm water thunder steps stepssoft stepsmany slam doorslide brake strain drag tarp warm endtail5 …

## New locations
Put new `ENV.name = L => svgString` functions and new card types in `episodes/<ep>/ep.js` (loaded last; may override cardSVG/fxSVG the same way engine/main10.js does). Follow env10.js drawing helpers (brSky, skyline, waterTower, car, bus, crowd, towerLegs). Thick #262326 outlines, muted palette.

## Checking before the full render (mandatory)
```
cd work/<ep> && python3 -c "import json;exec(open('shots.py').read());t=0
for s in S: s['start']=t;s['end']=t+3;t+=3;s['vo']=None
json.dump(S,open('fake.json','w'))" && node chk.js fake.json 0 5 12 20 ...   # writes chk/s<i>.jpg
```
Look at the frames: characters visible and not cut off, eyes visible, nothing overlapping text, night scenes not too dark.

---
## Finance additions (engine/fin.js) — use these for Dray x finance
- Characters: `SU(x,y,s,pose,flip,expr,v=0..4)` suit (v: 0 black hair, 1 grey, 2 bald, 3 glasses+brown hair, 4 woman), `WK(...)` office worker/journalist (v 0..2), `PX(...)` civilians.
- Envs: office wallst tradefloor boardroom court bankext vault tvstudio skyline yacht prison desk (+ engine 'home').
  Lights: day dim night red warm (+ older ones).
- Cards: chapter(n,a) · bignum(v,cur,label,sub[,fmt='raw',suf]) · headline(paper,date,h,sub) · timeline(title,items=[[year,label]...],hi) ·
  quote(q,who) · chart(title,pts=[[label,value]...],color='up'|'down',cur|fmt='raw',unit,note) · compare(title,a=[l,v],b=[l,v],note) ·
  facts(title,rows=[[big,small]...]) · flow(title,nodes=[...],endRed,note) · sources(lines=[...]) · title(a) · blackend.
- fx: moneyrain crowdq redtick greentick flashbulbs (+ older ones).
- Thumbnail: tools/fthumb.py with episodes/<slug>/thumb.json {"shot":{env,light,cam,actors}, "big","line","line_size","dim","sat","arrow"}.
- Canonical example: episodes/wirecard/shots.py.
