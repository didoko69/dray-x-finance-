const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+process.cwd()+'/page.html');const TL=JSON.parse(fs.readFileSync('th.json'));
await p.evaluate(s=>prepare(s),TL);
for(const [i,t] of [[0,1.5],[1,4.0]]){await p.evaluate(t=>render(t),t);await p.screenshot({path:`th${i}.png`});}
await b.close()})();
