from pathlib import Path
import json,hashlib,wave,time
import numpy as np
import mlx.core as mx
from mlx_audio.tts.utils import load_model
R=Path(__file__).resolve().parents[1];REF=Path.home()/'.cache/historyout-media-source/chatterbox-reference.wav'
lines=['Save a page where you will actually find it again.', 'Tag Choose puts one bookmark in all the folders that fit.', 'Choose your folders, or ask private, on-device AI for suggestions.', 'Edit the title. Review your choices. Save.', 'No account. Your bookmarks stay in Chrome.', 'Tag Choose. One page. All the right folders.']
model=load_model('mlx-community/chatterbox-multilingual-v3');parts=[];meta=[];offset=0
for i,text in enumerate(lines):
 p=R/f'audio/scene-{i}.wav'
 if p.exists():
  with wave.open(str(p)) as w:sr=w.getframerate();arr=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(float)/32767
 else:
  mx.random.seed(73+i)
  result=list(model.generate(text=text,ref_audio=str(REF),lang_code='en',exaggeration=.35,cfg_weight=.5,temperature=.8,repetition_penalty=1.2,min_p=.05,top_p=1.,max_new_tokens=2200,verbose=False));sr=result[0].sample_rate;arr=np.concatenate([np.asarray(x.audio).reshape(-1) for x in result]);np.save(p.with_suffix('.npy'),arr)
  with wave.open(str(p),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(arr,-1,1)*32767).astype('<i2').tobytes())
 duration=len(arr)/sr;parts.append(arr);meta.append({'scene':i,'text':text,'start':offset,'end':offset+duration,'duration':duration});offset+=duration;print(meta[-1],flush=True)
arr=np.concatenate(parts)
with wave.open(str(R/'audio/film-voice.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(arr,-1,1)*32767).astype('<i2').tobytes())
(R/'source/film-narration.json').write_text(json.dumps({'text':' '.join(lines),'scenes':meta,'duration':offset,'reference_sha256':hashlib.sha256(REF.read_bytes()).hexdigest(),'model':'mlx-community/chatterbox-multilingual-v3','exaggeration':.35,'cfg_weight':.5,'processing':'Six new natural scene performances joined in order. No tempo, pitch, waveform trimming or inserted pauses.'},indent=2))
