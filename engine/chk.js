const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+process.cwd()+'/page.html');let TL=JSON.parse(fs.readFileSync(process.argv[2]));
const ids=process.argv.slice(3).map(Number);
await p.evaluate(s=>prepare(s),TL);fs.mkdirSync('chk',{recursive:true});
for(const i of ids){const s=TL[i];await p.evaluate(t=>render(t),s.start+1.4);await p.screenshot({path:`chk/s${i}.jpg`,type:'jpeg',quality:60});}
await b.close()})();
