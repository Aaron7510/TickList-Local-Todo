from pathlib import Path
import subprocess,json,hashlib,numpy as np,urllib.request
O=Path(__file__).resolve().parent;P=O.parent.parent;ROOT=P.parent.parent.parent;OLD=O.parent/'score-2026-10-18'
FF=P/'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe';FP=P/'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe'
V=O/'TickList-natural-ui-1080p60.mp4';RATE=48000;N=35*RATE

def sha(p):return hashlib.file_digest(p.open('rb'),'sha256').hexdigest()
def read(p):return np.frombuffer(subprocess.check_output([str(FF),'-hide_banner','-loglevel','error','-i',str(p),'-vn','-ar','48000','-ac','2','-f','f32le','-acodec','pcm_f32le','-']),dtype='<f4').reshape(-1,2).astype(np.float64)
def elementary_sha(p):
 raw=subprocess.check_output([str(FF),'-hide_banner','-loglevel','error','-i',str(p),'-map','0:v:0','-c:v','copy','-f','h264','-'])
 return hashlib.sha256(raw).hexdigest()
def loudness(p):
 s=subprocess.run([str(FF),'-hide_banner','-i',str(p),'-vn','-af','loudnorm=I=-19.5:TP=-1.5:LRA=8:print_format=json','-f','null','-'],stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True).stderr.decode(errors='replace')
 return json.loads(s[s.rfind('{'):s.rfind('}')+1])
meta=json.loads(subprocess.check_output([str(FP),'-v','error','-count_frames','-show_streams','-show_format','-of','json',str(V)]))
v=next(s for s in meta['streams'] if s['codec_type']=='video');a=next(s for s in meta['streams'] if s['codec_type']=='audio')
assert (v['codec_name'],v['width'],v['height'],v['r_frame_rate'],int(v['nb_read_frames']))==('h264',1920,1080,'60/1',2100)
assert a['codec_name']=='aac' and a['sample_rate']=='48000' and a['channels']==2
assert abs(float(meta['format']['duration'])-35)<.02
assert float(v['start_time'])==float(a['start_time'])==0
subprocess.run([str(FF),'-hide_banner','-loglevel','error','-i',str(V),'-f','null','-'],check=True)
video_same=elementary_sha(V)==elementary_sha(OLD/'TickList-original-score-1080p60.mp4');assert video_same
bgm=read(OLD/'TickList-original-bgm-35s.wav');ui=read(O/'TickList-natural-ui-35s.wav');mix=read(O/'TickList-natural-ui-mix-35s.wav');typing=read(O/'TickList-typing-35s.wav');controls=read(O/'TickList-controls-35s.wav')
assert all(len(x)==N for x in [bgm,ui,mix,typing,controls])
assert sha(O/'TickList-bgm-unchanged-35s.wav')==sha(OLD/'TickList-original-bgm-35s.wav')
residual=float(abs(mix-ui-bgm).max());assert residual<=3e-7
stem_error=float(abs(ui-typing-controls).max());assert stem_error<=3e-7
manifest=json.loads((O/'sfx-manifest.json').read_text())
assert manifest['initial_typing_contacts']==6 and manifest['total_events']==16
assert manifest['new_identical_pairs_above_0_9999']==0
assert len({e['take_sha256'] for e in manifest['events']})==16
sync=[]
occupied=np.zeros(N,dtype=bool)
for e in manifest['events']:
 take=read(O/e['take_file']);assert sha(O/e['take_file'])==e['take_sha256']
 assert e['pitch_shift_semitones']==0 and e['time_stretch']==1
 i=e['audio_start_sample'];occupied[i:i+len(take)]=True
 x=abs(take).max(axis=1);onset=int(np.where(x>x.max()*.10)[0][0]);onset_delta=((i+onset)/RATE-e['visual_time'])*1000
 assert abs(onset_delta)<=1000/60
 sync.append({'event':e['id'],'visual_frame':e['visual_frame'],'audible_onset_offset_ms':onset_delta})
assert float(abs(ui[~occupied]).max())==0
encoded=read(V);n=min(len(encoded),len(mix));corr=float(np.corrcoef(encoded[:n].ravel(),mix[:n].ravel())[0,1]);assert corr>.995
ref=mix[:8*RATE].mean(axis=1);enc=encoded[:8*RATE].mean(axis=1);size=1<<((2*len(ref)-1).bit_length());cross=np.fft.irfft(np.fft.rfft(enc,size)*np.conj(np.fft.rfft(ref,size)),size);lags=np.arange(-512,513);lag=int(lags[np.argmax(cross[lags%size])]);assert abs(lag)<=2
levels=loudness(V);assert float(levels['input_tp'])<=-1.5
old_levels=json.loads((OLD/'verification.json').read_text())['audio']['loudness'];lufs_change=float(levels['input_i'])-float(old_levels['input_i']);assert abs(lufs_change)<.15
protected=json.loads((O/'protected-before.json').read_text())
for p in protected:p['unchanged']=sha(ROOT/p['file'])==p['sha256']
assert all(p['unchanged'] for p in protected)
sources=json.loads((O/'sources/source-manifest.json').read_text())
assert len(sources)==3 and all(s['license']=='CC0 1.0' and s['cc0_link_present'] and sha(O/'sources'/s['downloaded_file'])==s['sha256'] for s in sources)
assert np.isfinite(mix).all() and abs(mix).max()<1
# Check private player delivery and byte-range seeking against the actual local files.
request=urllib.request.Request('http://localhost:3012/video-new.mp4',headers={'Range':'bytes=100-199'})
with urllib.request.urlopen(request,timeout=20) as r:
 partial=r.read();range_ok=r.status==206 and r.headers['Content-Range'].startswith('bytes 100-199/')
with V.open('rb') as f:f.seek(100);assert partial==f.read(100)
assert range_ok
report={'pass':True,'scope':'Only interaction SFX replaced; music and picture preserved','picture':{'codec':'h264','width':1920,'height':1080,'fps':60,'frames':2100,'duration':35,'color_space':v.get('color_space'),'elementary_stream_byte_identical_to_accepted_video':video_same},'music':{'file_byte_identical':True,'sha256':sha(O/'TickList-bgm-unchanged-35s.wav'),'pcm_gain_changed':False,'pcm_timing_changed':False,'mix_minus_sfx_minus_accepted_bgm_max_error':residual},'audio':{'codec':'aac','rate':48000,'channels':2,'decoded_aac_samples':len(encoded),'levels':levels,'lufs_change_from_before':lufs_change,'clipped_samples':int(np.count_nonzero(abs(mix)>=1)),'aac_to_master_correlation':corr,'aac_offset_samples':lag,'stem_sum_max_error':stem_error},'sfx':{'total_events':16,'initial_typing_contacts':6,'distinct_final_takes':16,'pitch_shifts':0,'new_exact_control_duplicates':0,'maximum_acoustic_onset_offset_ms':max(abs(e['audible_onset_offset_ms']) for e in sync),'onset_checks':sync,'silence_outside_declared_events':True},'source_licenses_checked':True,'protected_files':protected,'whole_file_decode':True,'http_range_seek_verified':True,'browser_playback':'pending','listening_limit':'This environment cannot ingest audio. Browser playback and measured signal checks do not establish subjective headphone acceptance.'}
(O/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
files=['TickList-natural-ui-1080p60.mp4','TickList-natural-ui-35s.wav','TickList-natural-ui-35s.mp3','TickList-typing-35s.wav','TickList-controls-35s.wav','TickList-natural-ui-mix-35s.wav','TickList-bgm-unchanged-35s.wav','TickList-ui-before-35s.wav']
records=[{'file':n,'bytes':(O/n).stat().st_size,'sha256':sha(O/n)} for n in files]
(O/'delivery-manifest.json').write_text(json.dumps(records,indent=2))
(O/'SHA256SUMS.txt').write_text('\n'.join(r['sha256']+'  '+r['file'] for r in records)+'\n')
print(json.dumps({'pass':True,'picture_and_bgm_identical':True,'events':16,'max_onset_offset_ms':report['sfx']['maximum_acoustic_onset_offset_ms'],'AAC_LUFS':levels['input_i'],'AAC_true_peak':levels['input_tp'],'AAC_offset_samples':lag,'lufs_change':lufs_change,'originals_unchanged':True},indent=2))
