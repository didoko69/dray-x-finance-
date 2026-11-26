// Thumbnail v2: renders every shot of th.json (one frame each at shot.start+tt, default 1.5 s) to th<i>.png
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+process.cwd()+'/page.html');const TL=JSON.parse(fs.readFileSync('th.json'));
await p.evaluate(s=>prepare(s),TL);
for(let i=0;i<TL.length;i++){await p.evaluate(t=>render(t),TL[i].start+(TL[i].tt||1.5));await p.screenshot({path:`th${i}.png`});}
await b.close()})();
