import json,soundfile as sf,numpy as np
exec(open('shots.py').read())
t=0.3;out=[]
for i,s in enumerate(S):
    if s['text']:
        a,sr=sf.read(f'vo/{i:03d}.wav')
        # trim leading/trailing silence
        nz=np.where(np.abs(a)>0.01)[0]; a=a[max(0,nz[0]-120):nz[-1]+2400]; sf.write(f'vo/{i:03d}.wav',a,sr)
        d=len(a)/sr; s['vo']=t+0.12; s['start']=t; s['end']=t+0.12+d+s['gap']*0.55
    else:
        s['start']=t; s['end']=t+s['dur']
    t=s['end']; out.append(s)
json.dump(out,open('timeline.json','w'))
print('total',round(t,1),'s =',round(t/60,2),'min')
# subtitles: short single-line chunks timed across each voice clip
import re
def ts(x): h=int(x//3600); m=int(x%3600//60); s_=x%60; return f"{h:02d}:{m:02d}:{int(s_):02d},{int((s_-int(s_))*1000):03d}"
subs=[]
for i,s in enumerate(out):
    if not s['text']: continue
    d=sf.info(f'vo/{i:03d}.wav').duration
    words=s['text'].split(); chunks=[]; cur=''
    for w in words:
        if len(cur)+len(w)+1>46 and cur: chunks.append(cur); cur=w
        else: cur=(cur+' '+w).strip()
        if cur and cur[-1] in '.?!:' and len(cur)>18: chunks.append(cur); cur=''
    if cur: chunks.append(cur)
    while len(chunks)>1 and len(chunks[-1])<14: chunks[-2]=chunks[-2]+' '+chunks[-1]; chunks.pop()
    tot=sum(len(c) for c in chunks); t0=s['vo']
    for c in chunks:
        dd=(d-.1)*len(c)/tot; subs.append(dict(s=round(t0,3),e=round(t0+dd+.12,3),txt=c)); t0+=dd
for j in range(len(subs)-1): subs[j]['e']=min(subs[j]['e'],subs[j+1]['s'])
out[0]['subs']=subs
json.dump(out,open('timeline.json','w'))
open('captions.srt','w').write(''.join(f"{k+1}\n{ts(c['s'])} --> {ts(c['e'])}\n{c['txt']}\n\n" for k,c in enumerate(subs)))
open('narration.txt','w').write('\n\n'.join(s['text'] for s in out if s['text'])+'\n')
print(len(subs),'subtitle cues')
