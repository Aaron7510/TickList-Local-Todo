from pathlib import Path
import subprocess,json,hashlib,math,shutil,sys,numpy as np
from media_tools import executable, new_output
PROD=Path(__file__).resolve().parent.parent
OUT=new_output(sys.argv[1] if len(sys.argv)>1 else 'out/rebuild-sfx')
FF=executable('ffmpeg')
RATE=48000; N=35*RATE
TAKES=OUT/'takes';TAKES.mkdir(exist_ok=True)

def sha(p):return hashlib.file_digest(p.open('rb'),'sha256').hexdigest()
def read(p,filters=None,mono=False):
 args=[str(FF),'-hide_banner','-loglevel','error','-i',str(p)]
 if filters:args+=['-af',filters]
 args+=['-ar',str(RATE),'-ac','1' if mono else '2','-f','f32le','-acodec','pcm_f32le','-']
 x=np.frombuffer(subprocess.check_output(args),dtype='<f4').astype(np.float64)
 return x if mono else x.reshape(-1,2)
def write(p,x,codec='pcm_s24le'):
 if p.exists():raise FileExistsError(p)
 channels=1 if x.ndim==1 else x.shape[1]
 subprocess.run([str(FF),'-n','-hide_banner','-loglevel','error','-f','f32le','-ar',str(RATE),'-ac',str(channels),'-i','pipe:0','-c:a',codec,str(p)],input=x.astype('<f4').tobytes(),check=True)
def level(p):
 s=subprocess.run([str(FF),'-hide_banner','-i',str(p),'-af','loudnorm=I=-19.5:TP=-1.5:LRA=8:print_format=json','-f','null','-'],stderr=subprocess.PIPE,stdout=subprocess.PIPE,check=True).stderr.decode(errors='replace')
 return json.loads(s[s.rfind('{'):s.rfind('}')+1])
def cropped(x,onset,length,attack=.0025,release=.018):
 # Keep the recorded key-down / key-up or fingertip contact, including its tiny tail.
 start=max(0,round((onset-.0015)*RATE));end=start+round(length*RATE)
 clip=x[start:end].copy()
 clip-=np.mean(clip)
 a=min(round(attack*RATE),len(clip)//3);r=min(round(release*RATE),len(clip)//2)
 clip[:a]*=np.sin(np.linspace(0,np.pi/2,a))**2
 clip[-r:]*=np.cos(np.linspace(0,np.pi/2,r))**2
 return clip

def unit(x):return x/max(float(abs(x).max()),1e-12)
def spectrum(x):
 size=2048
 padded=np.pad(x,(0,(-len(x))%size)).reshape(-1,size)
 power=(abs(np.fft.rfft(padded*np.hanning(size),axis=1))**2).sum(axis=0)
 freq=np.fft.rfftfreq(size,1/RATE)
 total=max(power.sum(),1e-15)
 return {'centroid_hz':float((power*freq).sum()/total),'energy_above_4khz':float(power[freq>4000].sum()/total),'energy_above_8khz':float(power[freq>8000].sum()/total)}

keyboard=read(PROD/'media/recordings/keyboard-supersnd.mp3','highpass=f=150,lowpass=f=4700,equalizer=f=2800:t=q:w=0.9:g=-3',True)
# A consistent family made from separate real contacts, not oscillators or pitch-shifted clones.
body_open=read(PROD/'media/recordings/taps-kyles.mp3','highpass=f=155,lowpass=f=3300,equalizer=f=350:t=q:w=0.7:g=-1.8',True)
body_round=read(PROD/'media/recordings/taps-kyles.mp3','highpass=f=175,lowpass=f=2600',True)
body_light=read(PROD/'media/recordings/taps-kyles.mp3','highpass=f=220,lowpass=f=3900',True)
detail=read(PROD/'media/recordings/finger-pikachu09.mp3','highpass=f=430,lowpass=f=3500,equalizer=f=2400:t=q:w=0.8:g=-3.5',True)

# Only six of the nine visible character arrivals receive an audible key contact.
# Offsets are smaller than a single 60fps frame; intervals follow the unchanged image.
key_specs=[
 ('type-1',268,.002,1.263,.092,-30.0),
 ('type-3',281,-.003,1.971,.083,-32.6),
 ('type-4',288,.003,4.551,.098,-31.2),
 ('type-6',301,.004,5.470,.087,-32.0),
 ('type-8',315,-.002,7.189,.090,-30.8),
 ('type-9',321,.003,9.859,.078,-33.1),
 ('deadline-input',813,.002,3.778,.096,-32.4)
]
key_track=np.zeros((N,2));control_track=np.zeros((N,2));events=[]

def add(clip,id,kind,frame,offset,source,target_db,meta):
 clip=unit(clip)*10**(target_db/20)
 # A tiny real contact stays centered; no artificial stereo widening or echo.
 start=round((frame/60+offset)*RATE)
 stereo=np.repeat(clip[:,None],2,axis=1)
 track=key_track if kind=='typing' else control_track
 track[start:start+len(clip)]+=stereo
 file=TAKES/(id+'.wav');write(file,stereo)
 record={'id':id,'kind':kind,'visual_frame':frame,'visual_time':frame/60,'audio_start_sample':start,'audio_start_time':start/RATE,'offset_ms':offset*1000,'duration_ms':len(clip)/RATE*1000,'peak_dbfs':target_db,'source':source,'source_details':meta,'pitch_shift_semitones':0,'time_stretch':1,'take_file':str(file.relative_to(OUT)).replace('\\','/'),'take_sha256':sha(file),**spectrum(clip)}
 events.append(record)

for id,frame,offset,onset,dur,db in key_specs:
 clip=cropped(keyboard,onset,dur,attack=.002,release=.016)
 add(clip,id,'typing',frame,offset,'keyboard-supersnd',db,{'source_onset':onset,'source_duration':dur,'distinct_recorded_keystroke':True})

# Each primary UI action uses a different recorded contact and articulation.
control_specs=[
 ('add-press',366,.001,1.638,.090,-26.0,'open',1.917,.14),
 ('add-result',372,.003,7.799,.112,-34.2,'round',None,0),
 ('deadline-open',759,.002,4.284,.083,-27.8,'open',3.131,.11),
 ('deadline-close',864,.002,9.889,.070,-29.2,'light',4.375,.13),
 ('checkbox-press',1125,.001,12.473,.086,-26.8,'round',5.489,.13),
 ('checkbox-result',1131,.002,16.000,.118,-33.8,'round',None,0),
 ('pending-filter',1221,.001,14.822,.073,-28.2,'light',None,0),
 ('settings',1605,.002,17.110,.079,-28.8,'light',.583,.08),
 ('backup',1662,.002,19.412,.095,-27.3,'open',1.917,.09)
]
for id,frame,offset,onset,dur,db,profile,edge_onset,edge_gain in control_specs:
 src={'open':body_open,'round':body_round,'light':body_light}[profile]
 clip=unit(cropped(src,onset,dur,attack=.0035,release=.025))
 if edge_onset is not None:
  edge=unit(cropped(detail,edge_onset,dur,attack=.003,release=.022))
  clip=(1-edge_gain)*clip+edge_gain*edge
 # The result settles quietly, with a softer initial contact rather than a second alert.
 if id.endswith('result'):
  t=np.arange(len(clip))/RATE
  clip*=1-.38*np.exp(-t/.014)
 add(clip,id,'control',frame,offset,'taps-kyles + finger-pikachu09' if edge_onset is not None else 'taps-kyles',db,{'body_onset':onset,'body_duration':dur,'body_profile':profile,'detail_onset':edge_onset,'detail_weight':edge_gain,'distinct_body_recording':True})

ui=key_track+control_track
# Reuse the accepted music at exactly its existing PCM sample values and gain.
accepted_bgm=PROD/'media/music/approved-bgm.wav'
bgm_copy=OUT/'TickList-bgm-unchanged-35s.wav'
shutil.copyfile(accepted_bgm,bgm_copy)
assert sha(accepted_bgm)==sha(bgm_copy)
bgm=read(accepted_bgm)
assert bgm.shape==ui.shape
mix=bgm+ui
assert np.isfinite(mix).all() and abs(mix).max()<.85
for name,x in [('TickList-natural-ui-35s.wav',ui),('TickList-typing-35s.wav',key_track),('TickList-controls-35s.wav',control_track),('TickList-natural-ui-mix-35s.wav',mix)]:
 write(OUT/name,x)
shutil.copyfile(PROD/'media/comparison/previous-ui.wav',OUT/'TickList-ui-before-35s.wav')
for name in ['TickList-natural-ui-35s','TickList-ui-before-35s']:
 subprocess.run([str(FF),'-n','-hide_banner','-loglevel','error','-i',str(OUT/(name+'.wav')),'-c:a','libmp3lame','-b:a','192k',str(OUT/(name+'.mp3'))],check=True)

old=read(PROD/'media/comparison/previous-ui.wav')
old_controls=[6.1,12.65,18.75,20.35,26.75,27.70]
new_controls=[e for e in events if e['kind']=='control' and not e['id'].endswith('result')]
def correlations(clips):
 arrays=[np.pad(x,(0,max(0,round(.13*RATE)-len(x))))[:round(.13*RATE)] for x in clips]
 return [float(np.corrcoef(arrays[i],arrays[j])[0,1]) for i in range(len(arrays)) for j in range(i)]
old_corr=correlations([old[round(t*RATE):round((t+.13)*RATE)].mean(axis=1) for t in old_controls])
new_corr=correlations([read(OUT/e['take_file']).mean(axis=1) for e in new_controls])
manifest={'date':'2026-10-18','authorship':'Edited real recorded CC0 laptop typing and fingertip contacts. No oscillator-generated click, pitched alert or pitch-shift clone.','source_manifest':'media/recordings/source-manifest.json','sample_rate':RATE,'channels':2,'seconds':35,'events':sorted(events,key=lambda e:e['audio_start_sample']),'initial_typing_characters_shown':9,'initial_typing_contacts':6,'total_events':len(events),'music_byte_identical':True,'accepted_music_sha256':sha(accepted_bgm),'music_gain_changed':False,'music_timing_changed':False,'picture_reencoded':False,'global_master_gain_changed':False,'hover_sounds':False,'old_control_pair_correlation_max':max(old_corr),'old_identical_pairs_above_0_9999':sum(x>.9999 for x in old_corr),'new_control_pair_correlation_max':max(new_corr),'new_identical_pairs_above_0_9999':sum(x>.9999 for x in new_corr),'ui_peak_dbfs':float(20*np.log10(abs(ui).max())),'typing_peak_dbfs':float(20*np.log10(abs(key_track).max())),'control_peak_dbfs':float(20*np.log10(abs(control_track).max())),'mix_loudness':level(OUT/'TickList-natural-ui-mix-35s.wav'),'subjective_headphone_listening':'not performed; recordings, signal inspection and playback verification are distinct from subjective listening'}
(OUT/'sfx-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in manifest.items() if k in ['total_events','initial_typing_contacts','new_control_pair_correlation_max','ui_peak_dbfs','typing_peak_dbfs','control_peak_dbfs','music_byte_identical','mix_loudness']},indent=2))
