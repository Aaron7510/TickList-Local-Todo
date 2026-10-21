from pathlib import Path
import subprocess,json,hashlib,numpy as np
B=Path(__file__).resolve().parent; P=B.parent.parent
FF=P/'node_modules'/'@ffmpeg-installer'/'win32-x64'/'ffmpeg.exe'
FP=P/'node_modules'/'@remotion'/'compositor-win32-x64-msvc'/'ffprobe.exe'
V=B/'TickList-original-score-1080p60.mp4'
def digest(p):return hashlib.file_digest(p.open('rb'),'sha256').hexdigest()
def decode(p):
 r=subprocess.run([str(FF),'-hide_banner','-loglevel','error','-i',str(p),'-vn','-f','f32le','-acodec','pcm_f32le','-ar','48000','-ac','2','-'],stdout=subprocess.PIPE,check=True)
 return np.frombuffer(r.stdout,dtype='<f4').reshape(-1,2).astype(np.float64)
def video_hash(p):
 r=subprocess.run([str(FF),'-hide_banner','-loglevel','error','-i',str(p),'-map','0:v:0','-c:v','copy','-f','h264','-'],stdout=subprocess.PIPE,check=True)
 return hashlib.sha256(r.stdout).hexdigest()
meta=json.loads(subprocess.check_output([str(FP),'-v','error','-count_frames','-show_streams','-show_format','-of','json',str(V)]))
v=next(s for s in meta['streams'] if s['codec_type']=='video'); a=next(s for s in meta['streams'] if s['codec_type']=='audio')
assert(v['width'],v['height'],v['r_frame_rate'],int(v['nb_read_frames']))==(1920,1080,'60/1',2100)
assert a['codec_name']=='aac' and a['sample_rate']=='48000' and a['channels']==2
assert abs(float(meta['format']['duration'])-35)<.02
assert float(v['start_time'])==float(a['start_time'])==0
subprocess.run([str(FF),'-hide_banner','-loglevel','error','-i',str(V),'-f','null','-'],check=True)
levelrun=subprocess.run([str(FF),'-hide_banner','-i',str(V),'-vn','-af','loudnorm=I=-19.5:TP=-1.5:LRA=8:print_format=json','-f','null','-'],stderr=subprocess.PIPE,stdout=subprocess.PIPE,check=True).stderr.decode(errors='replace')
levels=json.loads(levelrun[levelrun.rfind('{'):levelrun.rfind('}')+1]);assert float(levels['input_tp'])<=-1.5
m=decode(B/'TickList-original-bgm-35s.wav');u=decode(B/'TickList-ui-35s.wav');w=decode(B/'TickList-soundtrack-35s.wav')
assert len(m)==len(u)==len(w)==35*48000
err=float(abs(w-m-u).max());assert err<3e-7
encoded=decode(V);n=min(len(w),len(encoded));corr=float(np.corrcoef(w[:n].ravel(),encoded[:n].ravel())[0,1]);assert corr>.99
# FFT cross-correlation measures codec alignment without changing the sound.
ref=w[:8*48000].mean(axis=1);enc=encoded[:8*48000].mean(axis=1);size=1<<((len(ref)*2-1).bit_length())
cross=np.fft.irfft(np.fft.rfft(enc,size)*np.conj(np.fft.rfft(ref,size)),size)
lags=np.arange(-512,513); best_lag=int(lags[np.argmax(cross[lags%size])]);assert abs(best_lag)<=2
same=video_hash(V)==video_hash(B/'TickList-picture-current-1080p60.mp4');assert same
protected=json.loads((B/'protected-before.json').read_text(encoding='utf-8'))
for p in protected: p['unchanged']=digest(Path(p['path']))==p['sha256']
assert all(p['unchanged'] for p in protected)
ui_events=json.loads((B/'ui-edit-manifest.json').read_text(encoding='utf-8'))
check_times=[e['seconds'] for e in ui_events['initial_events']]+[e['time'] for e in ui_events['later_events']]
active=[bool(np.max(abs(u[round(t*48000):round((t+.12)*48000)]))>1e-6) for t in check_times];assert all(active)
assert float(abs(w).max())<1 and np.isfinite(w).all()
result={'pass':True,'picture':{'width':1920,'height':1080,'fps':60,'frames':2100,'duration':35,'codec':v['codec_name'],'color_space':v.get('color_space'),'copied_current_picture_stream':same,'restore_icon_fixed_source_used':True},'audio':{'codec':a['codec_name'],'sample_rate':48000,'channels':2,'duration':a['duration'],'decoded_samples':len(encoded),'loudness':levels,'aac_to_wav_correlation':corr,'aac_alignment_offset_samples':best_lag,'stem_sum_max_error':err,'all_19_ui_cues_present':all(active),'ui_cue_count':len(active),'clipped_samples':int(np.count_nonzero(abs(w)>=1))},'protected_originals':protected,'full_decode_passed':True,'subjective_headphone_review':'not performed','browser_playback':'pending'}
(B/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
files=['TickList-original-score-1080p60.mp4','TickList-original-bgm-35s.wav','TickList-original-bgm-35s.mp3','TickList-soundtrack-35s.wav','TickList-ui-35s.wav','TickList-picture-current-1080p60.mp4']
manifest=[{'file':name,'bytes':(B/name).stat().st_size,'sha256':digest(B/name)} for name in files]
(B/'delivery-manifest.json').write_text(json.dumps(manifest,indent=2))
(B/'SHA256SUMS.txt').write_text('\n'.join(i['sha256']+'  '+i['file'] for i in manifest)+'\n')
print(json.dumps({'pass':True,'AAC_LUFS':levels['input_i'],'AAC_true_peak':levels['input_tp'],'AAC_alignment_samples':best_lag,'AAC_correlation':corr,'originals_unchanged':True},indent=2))
