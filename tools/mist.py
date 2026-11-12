"""The mist: the cab's walls for workspaces 2 and 3 (and 4), made from the desk's own plates.

Called by tools/assets.py for picks flagged `mist=<recipe>`. The city stays sharp (it is the view,
not a blur): the plate is resized to MIST_W, graded, and fog is laid through the towers in two
bands, lit from below. Night and Late are the Late plate (the 3 a.m. city in low cloud) in teal;
Ice is the snow plate as a fog day, pale grey-green. Deterministic: same plate, same wall.
"""
from __future__ import annotations

import numpy as np
from PIL import Image, ImageFilter

MIST_W = 1600   # with the per-recipe quality below, a wall stays inside the 64 KB budget (tests/perf.spec.js)

RECIPES = {
    #        tint dark → light (duotone)          keep of the plate's own colour, brightness, fog colour, fog alpha, glows
    "night": dict(dark=(4, 12, 16), light=(196, 226, 224), keep=.42, gain=1.06, fog=(168, 204, 205), fog_a=.56, glows=True, vignette=.58, q=50),
    "late": dict(dark=(2, 8, 11), light=(150, 188, 190), keep=.38, gain=.86, fog=(132, 170, 174), fog_a=.6, glows=True, vignette=.66, q=50),
    "ice": dict(dark=(78, 92, 94), light=(236, 240, 238), keep=.3, gain=1.0, fog=(222, 228, 226), fog_a=.62, glows=False, vignette=0, q=40),
}


def _noise(w: int, h: int, seed: int, octaves: int = 5) -> np.ndarray:
    """Fractal value noise in 0..1, built from upsampled random grids."""
    rng = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    for o in range(octaves):
        gw, gh = 3 * 2 ** o + 1, max(2, round((3 * 2 ** o + 1) * h / w))
        grid = Image.fromarray((rng.random((gh, gw)) * 255).astype(np.uint8), "L")
        out += amp * np.asarray(grid.resize((w, h), Image.Resampling.BICUBIC), np.float32) / 255
        total += amp
        amp *= .5
    return out / total


def _band(h: int, w: int, centre: float, spread: float) -> np.ndarray:
    y = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    return np.repeat(np.exp(-((y - centre) ** 2) / (2 * spread ** 2)), w, axis=1)


def mist(raw: Image.Image, recipe: str) -> Image.Image:
    r = RECIPES[recipe]
    img = raw.convert("RGB")
    img = img.resize((MIST_W, round(img.height * MIST_W / img.width)), Image.Resampling.LANCZOS)
    w, h = img.size
    a = np.asarray(img, np.float32) / 255

    lum = a @ np.array([.3, .59, .11], np.float32)
    lum = np.clip(lum * r["gain"], 0, 1)
    dark, light = np.array(r["dark"], np.float32) / 255, np.array(r["light"], np.float32) / 255
    duo = dark + (light - dark) * lum[..., None]
    a = duo * (1 - r["keep"]) + np.clip(a * r["gain"], 0, 1) * r["keep"]

    # fog through the towers: a broad band low in the frame and a thinner one higher up
    fog = np.array(r["fog"], np.float32) / 255
    n1 = np.clip((_noise(w, h, 3) - .4) * 2.4, 0, 1) * _band(h, w, .6, .16)
    n2 = np.clip((_noise(w, h, 8, 6) - .42) * 2.6, 0, 1) * _band(h, w, .84, .12)
    n3 = np.clip((_noise(w, h, 21, 4) - .45) * 2.0, 0, 1) * _band(h, w, .3, .14) * .6
    k = np.clip((n1 + n2 * .8 + n3) * r["fog_a"], 0, .92)
    kimg = Image.fromarray((k * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(14))
    k = np.asarray(kimg, np.float32)[..., None] / 255
    a = a * (1 - k) + fog * k

    if r["glows"]:                                   # a few red lights deep in the fog
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
        for fx, fy, rad, col, al in [(.62, .34, 70, (255, 60, 80), .32), (.27, .63, 110, (255, 70, 120), .24),
                                     (.83, .29, 46, (255, 60, 80), .28), (.46, .56, 60, (255, 90, 110), .16)]:
            d = np.exp(-(((xx - fx * w) ** 2 + (yy - fy * h) ** 2) / (2 * rad ** 2)))[..., None] * al
            a = 1 - (1 - a) * (1 - np.array(col, np.float32) / 255 * d)   # screen
    if r["vignette"]:
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
        d = np.sqrt(((xx / w - .5) / .75) ** 2 + ((yy / h - .55) / .75) ** 2)
        v = np.clip((d - .45) / .6, 0, 1)[..., None] * r["vignette"]
        a = a * (1 - v) + np.array(r["dark"], np.float32) / 255 * v

    return Image.fromarray((np.clip(a, 0, 1) * 255 + .5).astype(np.uint8), "RGB")
