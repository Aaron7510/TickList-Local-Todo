"""Check a future score rebuild without changing historical acceptance records."""
from pathlib import Path
import argparse, subprocess, json, numpy as np
from media_tools import ROOT, executable
p=argparse.ArgumentParser();p.add_argument('directory');a=p.parse_args()
b=(ROOT/a.directory).resolve()
if not b.is_relative_to((ROOT/'out').resolve()):raise ValueError('Expected a rebuild directory under out')
def read(name):
    raw=subprocess.check_output([str(executable('ffmpeg')),'-v','error','-i',str(b/name),'-ar','48000','-ac','2','-f','f64le','-'])
    return np.frombuffer(raw,dtype='<f8').reshape(-1,2)
m=read('TickList-original-bgm-35s.wav');u=read('TickList-ui-35s.wav');mix=read('TickList-soundtrack-35s.wav')
assert m.shape==u.shape==mix.shape==(1680000,2)
error=float(abs(mix-m-u).max());assert error<3e-7
assert np.isfinite(mix).all() and abs(mix).max()<1
print(json.dumps({'rebuiltScoreStemSumPassed':True,'maxError':error,'historicalAcceptanceRewritten':False}))
