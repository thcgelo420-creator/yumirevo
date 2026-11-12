"""The etched glass on workspaces 2 and 3: the 未明 mark frosted into the pane's edge, and drops on it.

    python3 tools/glass.py     writes assets/glass/etch.webp and assets/glass/drops.webp

Both are alpha masks in white; CSS colours them per scene (styles/44-mist.css), so one file serves
Night, Late and Ice. The glyphs are Noto Serif CJK JP (SIL OFL), rendered here once so the mark looks
the same on every machine whatever fonts it has. Needs Pillow and the font: on Debian/Ubuntu it is
fonts-noto-cjk; elsewhere pass its path as the first argument.
"""
from __future__ import annotations

import pathlib
import random
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "glass"
FONT = sys.argv[1] if len(sys.argv) > 1 else "/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc"
FONT_INDEX = 0          # the .ttc's first face is JP

S = 2                   # rendered at twice the CSS size
GLYPH = 132             # CSS px per glyph
W, H = 150 * S, 330 * S


def etch() -> Image.Image:
    """Frosted glyphs: a faint fill, a brighter cut edge, a soft bloom of frost round it."""
    font = ImageFont.truetype(FONT, GLYPH * S, index=FONT_INDEX)
    fill = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(fill)
    for i, ch in enumerate("未明"):
        box = d.textbbox((0, 0), ch, font=font)
        x = (W - (box[2] - box[0])) / 2 - box[0]
        y = 12 * S + i * (H / 2) - box[1]
        d.text((x, y), ch, fill=255, font=font)
    inner = fill.filter(ImageFilter.MinFilter(5))
    edge = ImageChops.subtract(fill, inner)                  # the cut: a thin rim where glass meets frost
    frost = fill.filter(ImageFilter.GaussianBlur(6 * S))     # frost creeping just past the cut
    a = ImageChops.add(fill.point(lambda v: v * .34), edge.point(lambda v: v * .9))
    a = ImageChops.lighter(a, frost.point(lambda v: v * .16))
    out = Image.new("RGBA", (W, H), (255, 255, 255, 0))
    out.putalpha(a)
    return out


def drops(w: int = 150 * S, h: int = 640 * S, n: int = 70, seed: int = 7) -> Image.Image:
    """Rain on the outside of the glass: lit at the top, a dark lip below, a few small trails."""
    rnd = random.Random(seed)
    out = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    hi = Image.new("L", (w, h), 0)
    lo = Image.new("L", (w, h), 0)
    dh, dl = ImageDraw.Draw(hi), ImageDraw.Draw(lo)
    for _ in range(n):
        r = rnd.choice([1.4, 1.8, 2.2, 2.8, 3.6, 4.8, 6.2]) * S
        x, y = rnd.uniform(r, w - r), rnd.uniform(r, h - r)
        ry = r * rnd.uniform(1.0, 1.25)
        dl.ellipse((x - r, y - ry + r * .25, x + r, y + ry + r * .25), fill=110)
        dh.ellipse((x - r * .55, y - ry * .7, x + r * .15, y - ry * .05), fill=230)
        dh.ellipse((x - r, y - ry, x + r, y + ry), outline=70, width=max(1, S))
        if r > 4 * S and rnd.random() < .5:                  # a trail where a big drop ran
            t = rnd.uniform(18, 60) * S
            dl.line((x, y - ry - t, x, y - ry), fill=40, width=max(1, int(r * .5)))
    hi = hi.filter(ImageFilter.GaussianBlur(.6 * S))
    lo = lo.filter(ImageFilter.GaussianBlur(1.2 * S))
    # white where lit, and the lip as a darker alpha on a separate channel: CSS uses one colour,
    # so the lip is folded in as a weaker, softer white that reads as the drop's body
    a = ImageChops.lighter(hi, lo.point(lambda v: v * .45))
    out.putalpha(a)
    return out


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    e, r = etch(), drops()
    e.save(OUT / "etch.webp", "WEBP", quality=82, method=6)
    r.save(OUT / "drops.webp", "WEBP", quality=80, method=6)
    for p in ("etch.webp", "drops.webp"):
        print(f"{p:11} {(OUT / p).stat().st_size // 1024}KB")
