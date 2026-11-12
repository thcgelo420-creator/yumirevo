#!/usr/bin/env python3
"""Build the district's sign face.

The Japanese on the signs of workspaces 2 and 3 (src/data/signs.js) is set in
M PLUS Rounded 1c. This cuts the face down to the glyphs those signs use, so the
signs look the same on every machine and nothing is fetched from a third party.

    python3 tools/signfont.py --src MPLUSRounded1c-ExtraBold.ttf
    python3 tools/signfont.py --list          # the glyphs, nothing written

Needs fontTools and brotli (pip install fonttools brotli). The source face is
under the SIL Open Font License 1.1 (assets/fonts/LICENSE-MPLUSRounded1c.txt):
https://github.com/google/fonts/tree/main/ofl/mplusrounded1c
"""
import argparse
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SIGNS = ROOT / 'src' / 'data' / 'signs.js'
OUT = ROOT / 'assets' / 'fonts' / 'mplus-rounded-1c-signs.woff2'

# the Latin the signs set in the same face: unit numbers and short capitals
LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .·/-:'
# kana, kanji and their punctuation start here; the file's box-drawing banner sits below it
CJK_FROM = 0x2E80


def glyphs():
    text = SIGNS.read_text(encoding='utf-8')
    signs = {c for c in text if ord(c) >= CJK_FROM}
    return ''.join(sorted(signs | set(LATIN)))


def main():
    ap = argparse.ArgumentParser(description='Build the sign face from src/data/signs.js.')
    ap.add_argument('--src', help='path to MPLUSRounded1c-ExtraBold.ttf')
    ap.add_argument('--list', action='store_true', help='print the glyphs and stop')
    args = ap.parse_args()

    text = glyphs()
    if args.list:
        print(text)
        return 0
    if not args.src:
        ap.error('--src is required (the full M PLUS Rounded 1c face)')
    try:
        from fontTools import subset
    except ImportError:
        sys.exit('fontTools is missing: pip install fonttools brotli')

    subset.main([
        args.src,
        f'--text={text}',
        f'--output-file={OUT}',
        '--flavor=woff2',
        '--layout-features=*',          # keeps vert/vrt2: the signs are set top to bottom
        '--name-IDs=0,1,2,3,4,5,6,13,14',  # the copyright and licence names stay in the file
        '--no-hinting',
        '--desubroutinize',
    ])
    size = OUT.stat().st_size
    print(f'{OUT.relative_to(ROOT)}: {len(text)} glyphs asked for, {size / 1024:.1f} KB')
    return 0


if __name__ == '__main__':
    sys.exit(main())
