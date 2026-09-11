from pathlib import Path
import json,subprocess,wave,shutil
import numpy as np
R=Path(__file__).resolve().parents[1]; root=R.parents[1];out=R/'output';out.mkdir(exist_ok=True)
meta=json.loads((R/'source/film-narration.json').read_text());starts=[.8,5.0,9.2,15.0,19.8,24.0];ends=[5.0,9.2,15.0,19.8,24.0,30.0]
font='/System/Library/Fonts/Supplemental/Arial.ttf';bold='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
heads=['Find it again.\nWithout the hunt.','One page.\nSeveral folders.','Chrome local AI.\nYour choices.','Review.\nAdjust.\nSave.','Your bookmarks.\nStill in Chrome.','Save the next\ngood find.']
subs=['Save useful pages where you will look.','Folders work like tags.','Automatic suggestions stay on-device.','Keep control of the final destinations.','No account. No separate library.','Get TagChoose for Chrome.']
# Fixed 30-second timeline with complete natural voice performances and silence between scenes.
sr=24000;audio=np.zeros(sr*30,dtype=np.float32);cues=[]
for i,scene in enumerate(meta['scenes']):
 with wave.open(str(R/f'audio/scene-{i}.wav')) as w:
  assert w.getframerate()==sr
  a=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float32)/32768
 start=int(starts[i]*sr);assert start+len(a)<len(audio);audio[start:start+len(a)]+=a
 cues.append((starts[i],starts[i]+len(a)/sr,scene['text']))
with wave.open(str(R/'audio/timed-voice.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(audio,-1,1)*32767).astype('<i2').tobytes())
def ts(t):
 m=int(round(t*1000));return f'{m//3600000:02}:{m//60000%60:02}:{m//1000%60:02},{m%1000:03}'
srt='\n\n'.join(f'{i+1}\n{ts(a)} --> {ts(b)}\n{text}' for i,(a,b,text) in enumerate(cues))+'\n';(out/'TagChoose-English.srt').write_text(srt);(out/'TagChoose-English.vtt').write_text('WEBVTT\n\n'+srt.replace(',', '.'))
(out/'TagChoose-Transcript.txt').write_text(' '.join(s['text'] for s in meta['scenes'])+'\n')
for i in range(6):
 begin=0 if i==0 else ends[i-1];dur=ends[i]-begin
 (R/f'source/head-{i}.txt').write_text(heads[i]);(R/f'source/sub-{i}.txt').write_text(subs[i])
 asset=root/'marketing/assets'/('store-full-5.jpg' if i==1 else 'store-full-1.jpg')
 # Reframe existing screenshots in video; no synthesized product behavior.
 imagefilter='scale=1152:720' if i in [0,1,5] else 'crop=620:555:600:215,scale=804:720'
 x=688 if i in [0,1,5] else 870
 filt=f"[0:v]{imagefilter},setsar=1[shot];[1:v][shot]overlay={x}:185:shortest=1,drawtext=fontfile='{bold}':text='#TagChoose.':fontsize=52:fontcolor=0x29231d:x=80:y=65,drawtext=fontfile='{bold}':textfile='{R}/source/head-{i}.txt':fontsize=62:fontcolor=0x29231d:line_spacing=13:x=80:y=285,drawtext=fontfile='{font}':textfile='{R}/source/sub-{i}.txt':fontsize=24:fontcolor=0x66594b:x=80:y=575,drawtext=fontfile='{font}':text='Automatic tagging uses Chrome local AI. Manual saving stays available.':fontsize=21:fontcolor=0x66594b:x=80:y=910,drawtext=fontfile='{font}':text='Existing Store screenshots. Interface may differ in newer versions.':fontsize=17:fontcolor=0x756d62:x=80:y=954,fade=t=in:st=0:d=0.2,fade=t=out:st={dur-.2}:d=0.2[v]"
 subprocess.run(['ffmpeg','-y','-v','error','-loop','1','-framerate','30','-i',str(asset),'-f','lavfi','-i',f'color=c=0xfaf7ef:s=1920x1080:r=30:d={dur}','-filter_complex',filt,'-map','[v]','-t',str(dur),'-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p',str(out/f'scene-{i}.mp4')],check=True)
(R/'source/concat.txt').write_text(''.join(f"file '{out}/scene-{i}.mp4'\n" for i in range(6)))
subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',str(R/'source/concat.txt'),'-c','copy',str(out/'silent.mp4')],check=True)
music=Path('/Users/spetreikis/Desktop/apps/Tab.Show/marketing/video/tabshow-install-2026-09/audio/upbeat-ambient-v3/tabshow-upbeat-ambient-v3-48s.wav');shutil.copy(music,R/'audio/original-upbeat-score.wav')
subprocess.run(['ffmpeg','-y','-v','error','-i',str(out/'silent.mp4'),'-i',str(R/'audio/timed-voice.wav'),'-i',str(R/'audio/original-upbeat-score.wav'),'-filter_complex','[1:a]volume=1.3[v];[2:a]volume=0.12,afade=t=out:st=27:d=3[m];[v][m]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-18:TP=-1.5:LRA=9[a]','-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-t','30','-movflags','+faststart',str(out/'TagChoose-30s-1080p.mp4')],check=True)
subprocess.run(['ffmpeg','-y','-v','error','-ss','1','-i',str(out/'TagChoose-30s-1080p.mp4'),'-frames:v','1','-vf','scale=1280:720',str(out/'TagChoose-Thumbnail.jpg')],check=True)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(out/'TagChoose-30s-1080p.mp4'),'-vf','fps=1/5,scale=640:360,tile=3x2','-frames:v','1',str(R/'qa/contact-sheet.jpg')],check=True)
print('Rendered 30 seconds with original screenshot assets and 6 complete voice performances.')
