"""Mux an explicitly supplied new silent render; never overwrite the approved release."""
from pathlib import Path
import argparse, subprocess
from media_tools import ROOT, executable, new_output
p=argparse.ArgumentParser()
p.add_argument('--silent',required=True)
p.add_argument('--mix',default='public/audio/final-mix.wav')
p.add_argument('--output',required=True)
a=p.parse_args()
video=(ROOT/a.silent).resolve();mix=(ROOT/a.mix).resolve()
if not video.is_file() or not mix.is_file():raise FileNotFoundError('Silent render or selected mix is missing')
out=new_output(a.output)
subprocess.run([str(executable('ffmpeg')),'-n','-hide_banner','-loglevel','error','-i',str(video),'-i',str(mix),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-t','35','-movflags','+faststart',str(out/'TickList-edited-35s.mp4')],check=True)
print(out/'TickList-edited-35s.mp4')
