import soundfile as sf, re, os
from kokoro_onnx import Kokoro
exec(open('shots.py').read())
k=Kokoro('../tts/kokoro.onnx','../tts/voices.bin')
V_={'nar':('am_michael',.95,'en-us'),'walt':('bm_george',.9,'en-gb'),'radio':('am_onyx',.95,'en-us'),'nora':('af_sarah',.95,'en-us')}
def prep(t):
    return t.replace('’',"'").replace('‘',"'").replace('“','').replace('”','').replace('…','...').replace('J. U. M. P.','J... U... M... P.')
os.makedirs('vo',exist_ok=True)
for i,s in enumerate(S):
    if not s['text'] or os.path.exists(f'vo/{i:03d}.wav'): continue
    v,sp,lg=V_[s.get('voice','nar')]
    a,sr=k.create(prep(s['text']),voice=v,speed=sp,lang=lg); sf.write(f'vo/{i:03d}.wav',a,sr)
print('done',len(S))
