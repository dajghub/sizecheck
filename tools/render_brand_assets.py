"""Génère les visuels de marque dans l'identité « mètre ruban » :
assets/og-image.png (1200×630), assets/favicon.png (96×96),
assets/apple-touch-icon.png (180×180, fond opaque pour iOS), favicon.ico (racine),
extension/icons/icon{16,48,128}.png (même dessin que le favicon),
marketing/avatars/ (photos de profil 512×512), marketing/chrome-store/promo-*.png.

Rendu par Chrome headless avec la police Archivo du site (embarquée en
base64 pour fonctionner en file://), puis réduction par `sips` (macOS).

Usage : python3 tools/render_brand_assets.py
"""
import base64
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
FONT = base64.b64encode((ROOT / 'assets/fonts/archivo-latin.woff2').read_bytes()).decode()

BASE_CSS = f"""
@font-face {{ font-family: 'Archivo'; font-weight: 400 900; font-stretch: 62% 125%;
  src: url(data:font/woff2;base64,{FONT}) format('woff2'); }}
:root {{ --alu:#E3E5E6; --paper:#FFFFFF; --ink:#202326; --muted:#575D62;
  --tape:#F6C500; --tape-edge:#DDB000; --mark:#D42A1C; }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
html, body {{ overflow:hidden; }}
body {{ font-family:'Archivo', sans-serif; color:var(--ink); -webkit-font-smoothing:antialiased; }}
"""

# Graduations : un trait par mm, plus long au demi-cm, numéroté au cm.
TICKS_JS = """
function ticks(el, from, to, pxPerCm, numbers) {
  for (let mm = from * 10; mm <= to * 10; mm++) {
    const t = document.createElement('i');
    const cm = mm % 10 === 0, half = mm % 5 === 0;
    t.className = cm ? 't cm' : half ? 't half' : 't';
    t.style.left = ((mm / 10 - from) * pxPerCm) + 'px';
    el.appendChild(t);
    if (cm && numbers) {
      const n = document.createElement('b');
      n.textContent = mm / 10;
      n.style.left = ((mm / 10 - from) * pxPerCm) + 'px';
      el.appendChild(n);
    }
  }
}
"""

OG = f"""<!doctype html><meta charset="utf-8"><style>{BASE_CSS}
body {{ width:1200px; height:630px; background:var(--alu); position:relative; }}
.mark {{ position:absolute; left:72px; top:56px; font-weight:900; font-stretch:70%; font-size:40px; letter-spacing:-0.01em; }}
h1 {{ position:absolute; left:72px; top:128px; width:1060px; font-size:108px; line-height:0.9;
  font-weight:850; font-stretch:64%; letter-spacing:-0.01em; }}
.tape {{ position:absolute; left:0; right:0; bottom:56px; height:116px; background:var(--tape);
  border-bottom:4px solid var(--tape-edge); }}
.t {{ position:absolute; top:0; width:2px; height:18px; background:var(--ink); }}
.t.half {{ height:30px; }}
.t.cm {{ height:46px; width:3px; }}
b {{ position:absolute; top:52px; transform:translateX(-50%); font-size:40px; font-weight:800; font-stretch:68%; }}
.needle {{ position:absolute; left:{{needle}}px; bottom:56px; width:5px; height:196px; background:var(--mark); transform:translateX(-50%); }}
.read {{ position:absolute; left:{{needle}}px; bottom:250px; transform:translateX(-50%); background:var(--ink); color:var(--paper);
  font-size:30px; font-weight:800; font-stretch:72%; padding:10px 16px; border-radius:4px; white-space:nowrap; }}
.url {{ position:absolute; right:72px; top:62px; font-size:28px; font-weight:600; color:var(--muted); }}
</style>
<div class="mark">SizeCheck</div><div class="url">sizecheck.fr</div>
<h1>Convertis ta pointure<br>d’une marque à l’autre</h1>
<div class="tape" id="tape"></div>
<div class="needle"></div><div class="read">Nike 43 homme = 26,7 cm</div>
<script>{TICKS_JS} ticks(document.getElementById('tape'), 21.9, 27.9, 200, true);</script>
"""
# Mètre de 21,9 à 27,9 cm sur 1200 px (200 px/cm) : l'aiguille (26,7 cm) tombe à droite, hors du titre.
OG = OG.replace('{needle}', str(round((26.7 - 21.9) * 200)))

# Icône dessinée à 720 px puis réduite (180 et 96) : un bout de mètre jaune,
# graduations en haut, un S étroit et gras.
ICON = f"""<!doctype html><meta charset="utf-8"><style>{BASE_CSS}
body {{ width:720px; height:720px; background:var(--tape); position:relative; }}
#tape {{ position:absolute; left:0; right:0; top:0; height:200px; }}
.t {{ position:absolute; top:0; width:14px; height:70px; background:var(--ink); transform:translateX(-50%); }}
.t.half {{ height:110px; }}
.t.cm {{ height:170px; width:20px; }}
.s {{ position:absolute; left:0; right:0; bottom:20px; text-align:center; font-size:600px; line-height:0.8;
  font-weight:900; font-stretch:62%; letter-spacing:-0.02em; }}
</style>
<div id="tape"></div><div class="s">S</div>
<script>{TICKS_JS} ticks(document.getElementById('tape'), 0, 1.2, 600, false);</script>
"""


def shoot(html, w, h, out, transparent=False):
    with tempfile.TemporaryDirectory() as d:
        page = Path(d) / 'page.html'
        page.write_text(html)
        extra = ['--default-background-color=00000000'] if transparent else []
        subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars',
                        '--force-device-scale-factor=1', f'--window-size={w},{h}', *extra,
                        '--virtual-time-budget=2000', f'--screenshot={out}', page.as_uri()],
                       check=True, capture_output=True)


def write_ico(pngs, out):
    """favicon.ico contenant des PNG (format admis par tous les navigateurs actuels)."""
    import struct
    data = [Path(p).read_bytes() for _, p in pngs]
    header = struct.pack('<HHH', 0, 1, len(data))
    offset = 6 + 16 * len(data)
    entries = b''
    for (size, _), blob in zip(pngs, data):
        entries += struct.pack('<BBBBHHII', size % 256, size % 256, 0, 0, 1, 32, len(blob), offset)
        offset += len(blob)
    Path(out).write_bytes(header + entries + b''.join(data))


# Avatars (photos de profil Awin / réseaux, marketing/avatars/, non versionnés) :
# l'icône pleine, ou posée au centre d'un fond blanc / transparent. Le motif reste
# dans le cercle central, car la plupart des plateformes recadrent en rond.
def avatar_html(icon_png, background):
    b64 = base64.b64encode(Path(icon_png).read_bytes()).decode()
    return f"""<!doctype html><meta charset="utf-8"><style>
html, body {{ margin:0; width:512px; height:512px; background:{background}; overflow:hidden; }}
img {{ position:absolute; left:106px; top:106px; width:300px; height:300px; border-radius:6px; }}
</style><img src="data:image/png;base64,{b64}">"""


# ── Bannières Chrome Web Store (marketing/chrome-store/) ──
# Le widget y est rendu avec le vrai code de l'extension (sizes.js + ui.js),
# pour que la bannière montre exactement ce que l'utilisateur verra.
EXT_JS = (ROOT / 'extension/sizes.js').read_text() + '\n' + (ROOT / 'extension/ui.js').read_text()
STORE_BASE = f"""<!doctype html><meta charset="utf-8"><style>{BASE_CSS}
@font-face {{ font-family: 'SizeCheck Archivo'; font-weight: 400 900; font-stretch: 62% 125%;
  src: url(data:font/woff2;base64,{FONT}) format('woff2'); }}
body {{ background:var(--alu); position:relative; }}
.mark {{ position:absolute; font-weight:900; font-stretch:70%; letter-spacing:-0.01em; }}
h1 {{ position:absolute; font-weight:850; font-stretch:64%; line-height:.92; letter-spacing:-0.01em; }}
.tape {{ position:absolute; left:0; right:0; background:var(--tape); border-bottom:4px solid var(--tape-edge); }}
.t {{ position:absolute; top:0; width:2px; height:16px; background:var(--ink); }}
.t.half {{ height:26px; }} .t.cm {{ height:40px; width:3px; }}
b {{ position:absolute; transform:translateX(-50%); font-weight:800; font-stretch:68%; }}
</style><script>{EXT_JS}</script>
<script>document.head.insertAdjacentHTML('beforeend', '<style>' + SC_UI_CSS + '</style>');</script>
"""

# Exemple vérifié sur les tables : Nike 43 homme = 26,7 cm -> Vans 41 (26,5 cm).
STORE_EXAMPLE = """
<div class="sc-root widget">
  <div class="sc-label">
    <div class="sc-label-head"><h2>Ta pointure Vans</h2><p>Nike 43 homme, soit 26,7 cm de pied.</p></div>
    <div class="sc-focus"><span class="sc-focus-unit">EU</span><span class="sc-focus-size">41</span></div>
  </div>
</div>"""

PROMO_LARGE = STORE_BASE + f"""<style>
body {{ width:1400px; height:560px; }}
.mark {{ left:80px; top:64px; font-size:44px; }}
h1 {{ left:80px; top:150px; width:680px; font-size:88px; }}
.sub {{ position:absolute; left:82px; top:430px; font-size:24px; font-weight:600; color:var(--muted); }}
.widget {{ position:absolute; right:100px; top:110px; width:360px; background:transparent; zoom:1.3; }}
.fab {{ position:absolute; right:100px; top:290px; zoom:1.3; display:flex; align-items:center; gap:10px;
  border:2px solid var(--ink); border-radius:4px; padding:13px 16px 9px 14px; background-color:var(--tape);
  background-image: repeating-linear-gradient(90deg, var(--ink) 0 1.5px, transparent 1.5px 30px),
    repeating-linear-gradient(90deg, var(--ink) 0 1px, transparent 1px 6px);
  background-size:100% 7px, 100% 4px; background-repeat:no-repeat;
  font-family:'SizeCheck Archivo'; font-weight:800; font-stretch:74%; font-size:17px; line-height:1; }}
</style>
<div class="mark">SizeCheck</div>
<h1>Ta pointure dans<br>chaque marque,<br>sur la page produit</h1>
<p class="sub">Extension Chrome gratuite, 8 marques.</p>
{STORE_EXAMPLE}
<div class="fab">Ta taille ici : EU 41</div>
"""

PROMO_SMALL = STORE_BASE + """<style>
body { width:440px; height:280px; }
.mark { left:28px; top:26px; font-size:30px; }
h1 { left:28px; top:76px; width:390px; font-size:52px; }
.tape { bottom:22px; height:62px; }
.t { height:12px; } .t.half { height:20px; } .t.cm { height:30px; }
b { top:30px; font-size:24px; }
</style>
<div class="mark">SizeCheck</div>
<h1>Ta pointure dans chaque marque</h1>
<div class="tape" id="tape"></div>
<script>""" + TICKS_JS + """ ticks(document.getElementById('tape'), 24.2, 28.6, 100, true);</script>
"""


def main():
    shoot(OG, 1200, 630, ROOT / 'assets/og-image.png')
    shoot(PROMO_LARGE, 1400, 560, ROOT / 'marketing/chrome-store/promo-large.png')
    shoot(PROMO_SMALL, 440, 280, ROOT / 'marketing/chrome-store/promo-small.png')
    with tempfile.TemporaryDirectory() as d:
        big = Path(d) / 'icon.png'
        shoot(ICON, 720, 720, big)
        targets = [(180, ROOT / 'assets/apple-touch-icon.png'), (96, ROOT / 'assets/favicon.png')]
        # Icônes de l'extension Chrome : même dessin que le favicon du site
        targets += [(n, ROOT / f'extension/icons/icon{n}.png') for n in (128, 48, 16)]
        # favicon.ico à la racine : demandé par défaut par les navigateurs et de nombreux services
        targets += [(n, Path(d) / f'ico{n}.png') for n in (16, 32, 48)]
        for size, out in targets:
            subprocess.run(['sips', '-z', str(size), str(size), str(big), '--out', str(out)],
                           check=True, capture_output=True)
        write_ico([(n, Path(d) / f'ico{n}.png') for n in (16, 32, 48)], ROOT / 'favicon.ico')

        avatars = ROOT / 'marketing/avatars'
        avatars.mkdir(parents=True, exist_ok=True)
        subprocess.run(['sips', '-z', '512', '512', str(big), '--out', str(avatars / 'sizecheck-avatar-jaune.png')],
                       check=True, capture_output=True)
        shoot(avatar_html(big, '#FFFFFF'), 512, 512, avatars / 'sizecheck-avatar-blanc.png')
        shoot(avatar_html(big, 'transparent'), 512, 512, avatars / 'sizecheck-avatar-transparent.png', transparent=True)
    print('og-image, favicon (.png + .ico), apple-touch-icon, icônes et bannières de l\'extension, avatars régénérés')


if __name__ == '__main__':
    main()
