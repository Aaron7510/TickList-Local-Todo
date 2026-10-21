from pathlib import Path
import os, shutil
ROOT = Path(__file__).resolve().parent.parent

def executable(kind):
    explicit = os.environ.get(kind.upper())
    candidate = explicit or shutil.which(kind)
    if candidate:
        return Path(candidate)
    package = '@ffmpeg-installer/win32-x64/ffmpeg.exe' if kind == 'ffmpeg' else '@remotion/compositor-win32-x64-msvc/ffprobe.exe'
    candidate = ROOT / 'node_modules' / package
    if candidate.is_file():
        return candidate
    raise RuntimeError('Install locked video dependencies with npm ci, or set ' + kind.upper())

def new_output(value):
    target = (ROOT / value).resolve()
    scratch = (ROOT / 'out').resolve()
    if not target.is_relative_to(scratch) or target == scratch or target.exists():
        raise ValueError('Output must be a NEW subdirectory of production/out; approved files are protected')
    target.mkdir(parents=True)
    return target
