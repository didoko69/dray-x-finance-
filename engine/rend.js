const {chromium}=require('playwright');const fs=require('fs');
const W=+process.argv[2],N=+process.argv[3];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+process.cwd()+'/page.html');const TL=JSON.parse(fs.readFileSync('timeline.json'));
await p.evaluate(s=>prepare(s),TL);
const total=Math.ceil(TL[TL.length-1].end*30);const t0=Date.now();let c=0;
for(let i=W;i<total;i+=N){const f=`fr/${String(i).padStart(5,'0')}.jpg`;if(fs.existsSync(f)){continue;}
 await p.evaluate(t=>render(t),i/30);await p.screenshot({path:f+'.tmp',type:'jpeg',quality:90});fs.renameSync(f+'.tmp',f);c++;
 if(c%500==0)console.log(W,i,'/',total,((Date.now()-t0)/c).toFixed(0),'ms/frame');}
console.log('worker',W,'done');await b.close()})();
