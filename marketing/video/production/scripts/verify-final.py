"""Verify retained approved assets; never render, mix, or rewrite original acceptance."""
from pathlib import Path
import argparse,json,hashlib,wave,subprocess,numpy as np
from media_tools import ROOT, executable
p=argparse.ArgumentParser();p.add_argument('--decode',action='store_true');a=p.parse_args()
manifest=json.loads((ROOT/'media/asset-manifest.json').read_text(encoding='utf-8'))
def sha(file):
    with file.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()
for item in manifest['assets']:
    f=ROOT/item['path'];assert f.is_file() and f.stat().st_size==item['bytes'] and sha(f)==item['sha256'],str(f)
for item in manifest['approvedMedia']:
    f=ROOT/item['path'];assert sha(f)==item['sha256'],str(f)
for item in manifest['unchangedVisualSources']:
    assert sha(ROOT/item['path'])==item['sha256'],item['path']
assert sha(ROOT/'package-lock.json')==manifest['lockSha256']
def pcm(file):
    with wave.open(str(file),'rb') as w:
        assert w.getframerate()==48000 and w.getnchannels()==2
        width=w.getsampwidth();raw=w.readframes(w.getnframes())
    if width==3:
        x=np.frombuffer(raw,dtype=np.uint8).reshape(-1,3).astype(np.int32)
        y=x[:,0]|(x[:,1]<<8)|(x[:,2]<<16);y=(y^0x800000)-0x800000
        return (y.astype(np.float64)/8388608).reshape(-1,2)
    if width==2:return (np.frombuffer(raw,dtype='<i2').astype(np.float64)/32768).reshape(-1,2)
    raise ValueError('Unsupported PCM width')
bgm=pcm(ROOT/'media/music/approved-bgm.wav');ui=pcm(ROOT/'media/stems/final-ui.wav');mix=pcm(ROOT/'public/audio/final-mix.wav')
typing=pcm(ROOT/'media/stems/typing.wav');controls=pcm(ROOT/'media/stems/controls.wav')
assert all(x.shape==(1680000,2) for x in [bgm,ui,mix,typing,controls])
error=float(abs(mix-bgm-ui).max());stem=float(abs(ui-typing-controls).max());assert error<3e-7 and stem<3e-7
assert np.isfinite(mix).all() and abs(mix).max()<1
sfx=json.loads((ROOT/'evidence/2026-10-19/sfx/sfx-manifest.json').read_text(encoding='utf-8'))
assert len(sfx['events'])==16
occupied=np.zeros(1680000,dtype=bool);maximum=0
for e in sfx['events']:
    f=ROOT/'media/takes'/Path(e['take_file']).name;assert sha(f)==e['take_sha256']
    take=pcm(f);start=e['audio_start_sample'];occupied[start:start+len(take)]=True
    power=abs(take).max(axis=1);onset=int(np.flatnonzero(power>power.max()*.1)[0])
    delta=((start+onset)/48000-e['visual_time'])*1000;maximum=max(maximum,abs(delta));assert abs(delta)<1000/60
assert float(abs(ui[~occupied]).max())==0
sources=json.loads((ROOT/'media/recordings/source-manifest.json').read_text(encoding='utf-8'))
for item in sources:assert sha(ROOT/'media/recordings'/item['downloaded_file'])==item['sha256']
report={'assetHashesPassed':len(manifest['assets']),'approvedMediaHashesUnchanged':True,'unchangedVisualSources':len(manifest['unchangedVisualSources']),'lockfileUnchanged':True,'mixStemSumMaxError':error,'uiStemSumMaxError':stem,'events':16,'maxAcousticOffsetMs':maximum,'mediaFullDecode':False,'historicalAcceptanceRewritten':False,'fullVideoReproduced':False}
if a.decode:
    ff=str(executable('ffmpeg'));fp=str(executable('ffprobe'))
    for item in manifest['approvedMedia']:
        subprocess.run([ff,'-v','error','-i',str(ROOT/item['path']),'-f','null','-'],check=True)
    video=ROOT/manifest['approvedMedia'][0]['path']
    meta=json.loads(subprocess.check_output([fp,'-v','error','-count_frames','-show_streams','-show_format','-of','json',str(video)]))
    v=next(s for s in meta['streams'] if s['codec_type']=='video');s=next(s for s in meta['streams'] if s['codec_type']=='audio')
    assert(v['width'],v['height'],v['r_frame_rate'],int(v['nb_read_frames']))==(1920,1080,'60/1',2100)
    assert s['sample_rate']=='48000' and s['channels']==2 and abs(float(meta['format']['duration'])-35)<.02
    report['mediaFullDecode']=True;report['format']={'seconds':35,'frames':2100,'fps':60,'width':1920,'height':1080}
print(json.dumps(report,indent=2))
