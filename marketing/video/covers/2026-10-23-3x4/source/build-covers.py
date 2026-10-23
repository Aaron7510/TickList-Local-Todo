from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
from PIL import Image, ImageDraw, ImageFont
import hashlib, json, subprocess, os, shutil, sys

ROOT=next(p for p in Path(__file__).resolve().parents if (p/'assets/brand/logo-light.svg').exists())
OUT=Path(__file__).resolve().parents[1]
PUBLIC=OUT/'public'
QA=OUT/'qa'
PUBLIC.mkdir(exist_ok=True)
QA.mkdir(exist_ok=True)
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
locked=[ROOT/'marketing/video/release/2026-10-19/public/TickList-Promo-35s-1080p60.mp4',ROOT/'marketing/video/release/2026-10-19/public/TickList-Promo-Cover-1920x1080.jpg']
locked += list((ROOT/'marketing/video/covers/2026-10-23/public').glob('*.*'))
protected={p.relative_to(ROOT).as_posix():digest(p) for p in locked}
logo_file=ROOT/'assets/brand/logo-light.svg'
logo=logo_file.read_text(encoding='utf-8').strip().split('>',1)[1].rsplit('</svg>',1)[0]
chinese=TTFont('C:/Windows/Fonts/msyhbd.ttc',fontNumber=0)
english=TTFont('C:/Windows/Fonts/segoeui.ttf')
layouts=[]

def outline(text,font,size,cx,top,color,tracking=0):
    cmap=font.getBestCmap(); gs=font.getGlyphSet()
    pen=SVGPathPen(gs); bp=BoundsPen(gs); cursor=0
    for i,ch in enumerate(text):
        assert ord(ch) in cmap, 'Missing glyph: '+ch
        name=cmap[ord(ch)]
        transform=(1,0,0,1,cursor,0)
        gs[name].draw(TransformPen(pen,transform))
        gs[name].draw(TransformPen(bp,transform))
        cursor+=font['hmtx'].metrics[name][0]+tracking*font['head'].unitsPerEm/size
    scale=size/font['head'].unitsPerEm
    x0,y0,x1,y1=bp.bounds
    x=cx-(x0+x1)*scale/2
    y=top+y1*scale
    bounds=[cx-(x1-x0)*scale/2,top,(x1-x0)*scale,(y1-y0)*scale]
    return f'<path fill="{color}" d="{pen.getCommands()}" transform="translate({x:.5f} {y:.5f}) scale({scale:.8f} {-scale:.8f})"/>',bounds

def background(w,h):
    return f'''<defs>
    <linearGradient id="paper" x1="0.12" y1="0" x2="0.88" y2="1">
      <stop stop-color="#ffffff"/><stop offset=".49" stop-color="#f5f6f8"/><stop offset="1" stop-color="#edf0ff"/>
    </linearGradient>
    <radialGradient id="blue" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="translate({w*.83} {h*.22}) scale({w*1.30} {h*1.30})">
      <stop stop-color="#4f6ef7" stop-opacity=".19"/><stop offset=".63" stop-color="#4f6ef7" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="violet" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="translate({w*.15} {h*.88}) scale({w*1.30} {h*1.30})">
      <stop stop-color="#8473f5" stop-opacity=".10"/><stop offset=".54" stop-color="#8473f5" stop-opacity="0"/>
    </radialGradient></defs>
    <rect width="{w}" height="{h}" fill="url(#paper)"/>
    <rect width="{w}" height="{h}" fill="url(#violet)"/>
    <rect width="{w}" height="{h}" fill="url(#blue)"/>'''

def build(ratio,w,h,logo_width,logo_y,lines,credit_y):
    stem=f'TickList-Promo-Cover-{ratio}-{w}x{h}'
    svgpath=OUT/'source'/f'{stem}.svg'
    assert not svgpath.exists(), 'Refusing to overwrite existing design'
    elements=[]
    lw=logo_width;lh=lw*64/278;lx=(w-lw)/2
    content=[background(w,h),f'<g transform="translate({lx} {logo_y}) scale({lw/278})">{logo}</g>']
    elements.append({'name':'Official logo','bounds':[lx,logo_y,lw,lh]})
    for text,size,y in lines:
        path,box=outline(text,chinese,size,w/2,y,'#1a1d26',1 if ratio=='4x3' else .5)
        content.append(path);elements.append({'name':text,'bounds':box})
    path,box=outline('Developed by Soren',english,34,w/2,credit_y,'#747c8b')
    content.append(path);elements.append({'name':'Developed by Soren','bounds':box})
    for item in elements:
        x,y,bw,bh=item['bounds']
        assert x>=w*.08 and x+bw<=w*.92 and y>=h*.08 and y+bh<=h*.88,item
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img"><title>TickList promotional cover {ratio}</title><desc>把今天，一件件做好。Developed by Soren.</desc>'+''.join(content)+'</svg>'
    svgpath.write_text(svg,encoding='utf-8')
    layouts.append({'aspect_ratio':ratio.replace('x',':'),'width':w,'height':h,'stem':stem,'source':svgpath.relative_to(OUT).as_posix(),'elements':elements})
    return svgpath

build('3x4',1200,1600,420,435,[('把今天，',114,652),('一件件做好。',122,804)],1044)
node=os.environ.get('NODE_BINARY') or shutil.which('node')
assert node
subprocess.run([node,str(OUT/'source/render-covers.cjs'),str(OUT)],check=True)
files=[]
for item in layouts:
    for ext in ['png','jpg']:
        p=PUBLIC/(item['stem']+'.'+ext)
        with Image.open(p) as im:
            im.load()
            assert im.size==(1200,1600) and im.mode=='RGB'
        files.append({'file':p.relative_to(OUT).as_posix(),'width':1200,'height':1600,'format':ext,'bytes':p.stat().st_size,'sha256':digest(p)})
assert all(digest(ROOT/p)==sha for p,sha in protected.items())
manifest={'date':'2026-10-23','status':'authorized_for_github_publication','authorization':'再生成一个3：4的封面，并且同步到GitHub','scope':'Additional 3:4 cover only; previous movie and cover media preserved.','brand_logo_source':'assets/brand/logo-light.svg','brand_logo_sha256':digest(logo_file),'slogan':'把今天，一件件做好。','credit':'Developed by Soren','design':{'background':'Same white/light-gray/blue-purple gradient family as existing covers.','layout':'Recomposed centered logo, two-line slogan and credit for 1200x1600.','text':'Outlined glyphs; no font files bundled.'},'layouts':layouts,'outputs':files,'protected_approved_files':protected,'protected_files_unchanged':True,'technical_checks':{'exact_dimensions':True,'rgb_images_decoded':True,'content_inside_8_percent_horizontal_safe_margin':True},'visual_review':'pending'}
(OUT/'cover-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(OUT/'SHA256SUMS.txt').write_text(''.join(f"{x['sha256']}  {x['file']}\n" for x in files),encoding='ascii')
print(json.dumps({'outputs':files,'previous_media_unchanged':True},ensure_ascii=True,indent=2))
