from pathlib import Path
import subprocess,json,math,hashlib,numpy as np
BASE=Path(__file__).resolve().parent
PROD=BASE.parent.parent
FF=PROD/'node_modules'/'@ffmpeg-installer'/'win32-x64'/'ffmpeg.exe'
RATE=48000
N=35*RATE

def decode(file):
    r=subprocess.run([str(FF),'-hide_banner','-loglevel','error','-i',str(file),'-ar',str(RATE),'-ac','2','-f','f32le','-acodec','pcm_f32le','-'],stdout=subprocess.PIPE,check=True)
    return np.frombuffer(r.stdout,dtype='<f4').reshape(-1,2).astype(np.float64)

def write(file,x,codec='pcm_s24le'):
    if file.exists(): raise FileExistsError(file)
    subprocess.run([str(FF),'-n','-hide_banner','-loglevel','error','-f','f32le','-ar',str(RATE),'-ac','2','-i','pipe:0','-c:a',codec,str(file)],input=x.astype('<f4').tobytes(),check=True)

def measure(file):
    r=subprocess.run([str(FF),'-hide_banner','-i',str(file),'-af','loudnorm=I=-19.5:TP=-1.5:LRA=8:print_format=json','-f','null','-'],stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True).stderr.decode(errors='replace')
    return json.loads(r[r.rfind('{'):r.rfind('}')+1])

def smooth_curve(points):
    result=np.zeros(N,dtype=np.float64)
    for (t0,v0),(t1,v1) in zip(points[:-1],points[1:]):
        a=round(t0*RATE);b=min(N,round(t1*RATE))
        if b<=a:continue
        q=np.arange(b-a)/(b-a)
        result[a:b]=v0+(v1-v0)*(0.5-0.5*np.cos(q*np.pi))
    return result

source=BASE/'tools'/'acestep-cpp'/'requests'/'a-clean-turbo0.wav'
music=decode(source)[:N]
# Smooth phrase-level shaping; performance timing stays intact.
arc=[(0,0),(.8,.53),(2,.62),(3.8,.68),(4.2,1),(8,1),(10,.92),(16.3,.92),(17.8,.84),(19.2,1.07),(22,1.02),(24,.85),(25.5,.78),(26.4,.92),(28.6,.92),(30.2,.82),(32,.76),(33,.62),(34.8,0),(35,0)]
envelope=smooth_curve(arc)
ducks=[(4.28,4.43,5.47,5.72,1.8),(6.00,6.08,6.30,6.52,1.2),(18.64,18.75,19.05,19.32,1.5),(27.56,27.68,27.93,28.15,1.2)]
for start,at,hold,end,db in ducks:
    amount=10**(-db/20)
    d=smooth_curve([(0,1),(start,1),(at,amount),(hold,amount),(end,1),(35,1)])
    envelope*=d
music*=envelope[:,None]
write(BASE/'music-shaped-float.wav',music,'pcm_f32le')
level=measure(BASE/'music-shaped-float.wav')
music_gain_db=-20.5-float(level['input_i'])
music*=10**(music_gain_db/20)
ui=decode(BASE/'ui-preserved-35s.wav')[:N]*1.2
mix=music+ui
write(BASE/'mix-before-master-float.wav',mix,'pcm_f32le')
mix_level=measure(BASE/'mix-before-master-float.wav')
requested_gain=-19.5-float(mix_level['input_i'])
headroom_gain=-1.7-float(mix_level['input_tp'])
master_gain_db=min(requested_gain,headroom_gain)
gain=10**(master_gain_db/20)
music*=gain;ui*=gain;mix=music+ui
for name,data in [('TickList-original-bgm-35s.wav',music),('TickList-ui-35s.wav',ui),('TickList-soundtrack-35s.wav',mix)]:
    write(BASE/name,data)
    print(name,flush=True)
# A compressed listening copy; the WAV remains the lossless master.
subprocess.run([str(FF),'-n','-hide_banner','-loglevel','error','-i',str(BASE/'TickList-original-bgm-35s.wav'),'-c:a','libmp3lame','-b:a','256k',str(BASE/'TickList-original-bgm-35s.mp3')],check=True)
report={'selected':'a-room-to-think','source':str(source.relative_to(BASE)),'sample_rate':RATE,'samples':N,'seconds':35,'source_seconds':len(decode(source))/RATE,'source_has_finite_samples':bool(np.isfinite(decode(source)).all()),'music_arc':arc,'ducking_windows':ducks,'music_gain_db':music_gain_db,'ui_gain':1.2,'master_gain_db':master_gain_db,'target_integrated_lufs':-19.5,'before_master':mix_level,'final_wav_levels':measure(BASE/'TickList-soundtrack-35s.wav'),'music_wav_levels':measure(BASE/'TickList-original-bgm-35s.wav'),'peak_dbfs':float(20*np.log10(max(abs(mix).max(),1e-10))),'clipped_samples':int(np.count_nonzero(abs(mix)>=1)),'last_0_2s_peak_dbfs':float(20*np.log10(max(abs(mix[-9600:]).max(),1e-10))),'picture_changed_for_music':False,'original_video_overwritten':False,'subjective_human_headphone_review':'not performed; assessment uses video, signal analysis and model-assisted audio descriptions'}
(BASE/'mix-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({'master_gain_db':master_gain_db,'final_lufs':report['final_wav_levels']['input_i'],'true_peak':report['final_wav_levels']['input_tp'],'clipped_samples':report['clipped_samples']},indent=2),flush=True)
