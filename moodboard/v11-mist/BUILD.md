# v11-mist — build notes

Branch `hoplite/mist-glass`, from `d065996` (mimei-baseline). Every rule of the
round is in `styles/44-mist.css`, loaded last; it is scoped to
`body[data-ws='2']`, `body[data-ws='3']` and `#study`, so the desk and settings
are untouched.

## The idea

The city sits behind fogged glass, and everything on the glass speaks like a
shell. There is no accent colour: white type on grey glass at night, slate
type on frosted glass in Ice. Hierarchy comes from mono against sans, bold
against regular, and shell punctuation (`$`, `#`, `›`, `[ ]`, `├──`), never
from hue.

## Workspace 2 — the lesson as a shell session

| Part | Treatment | Where |
| --- | --- | --- |
| Pane | Full width; narrows to give the scripts drawer the right side (`--pw-open`); the drawer comes over it below ~1200px | `study.js` `layout()` |
| Title | `$ cat ~/roblox-luau/unit-02-variables/2.1-your-first-variable.md` with a block cursor, then the h1 and `# 3 checkpoints · about 10 minutes` | `session.js`, `44-mist.css` |
| Step heads | `$ cd 01-a-box-with-a-name-on-it  # predict` | `session.js` |
| Outline | `tree` output: `├──`/`└──`, real step slugs, `[x]`/`[ ]` checkpoints. Glyphs are `aria-hidden`; each button keeps the full title for screen readers | `study.js` |
| Session bar | tmux status line: `[mimei] 2:lessons* "2.1 …" top 0/3` | `bar.js` |
| Scripts | Square buffer, brighter left edge, `luau › script [copy]` | `44-mist.css` |
| Output | `Studio › Output  # what you should see`, `›` per line, `!` for errors | `44-mist.css` |
| Runbook | `$ in Studio  # runbook`, `[ ]`/`[x]` checklist, no card | `44-mist.css` |
| Probe | Dashed frame, `? quick question  # predict first`, answers `a) b) c)`, `✓`/`✗` | `44-mist.css` |
| Solution | `▸ $ cat solution.lua  # Tried it yourself first?` | `44-mist.css` |
| Key idea, recap, done when, end | `# key idea`, `# recap`, `$ test -f done  # done when`, `-- … --` | `44-mist.css` |

## Workspace 3 — man, less, ls

| Part | Treatment | Where |
| --- | --- | --- |
| Manual head | `LUAU-VARIABLES(2)   MIMEI manual · variables   1/11`: the page name on the left as man prints it; the shelf count stays on the right (tests read it) | `man.js` |
| Manual body | `NAME` and section heads flush left in bold mono caps; text indented under them (7ch, 3ch under 900px, none under 560px) | `44-mist.css` |
| Manual foot | less(1)'s prompt in reverse video: `Manual page luau-variables(2)`, then `line: top` | `man.js`, `44-mist.css` |
| Opening layout | Workspace 3 opens with all three: manual left, Terminal and Files stacked right. Existing saves get the two added once (`state.mistStack`); closing them later sticks | `wm.js` |
| Tables | Column output: bold heads, dashed rule, no box | `44-mist.css` |
| Files | `▸ unit-02-variables/`, then `[ ] 2.1-your-first-variable.md`; `[x]` done, `[~]` started, `[-]` not written, `#` reference. File names are `aria-hidden`; each row reads its title and state | `files.js` |
| Inspector | `$ stat 2.1-your-first-variable.md`, title, `ready · 10 min · 3 checkpoints`, a `$ open ↵` command button | `files.js` |
| Terminal | Already a shell; labels lowercased | `44-mist.css` |

## The top bar (workspaces 2, 3 and 4) and the panel along the foot (3 and 4)

Asked for "cleaner and minimal, just like Linux": an i3bar. It is the one part
of this round that also shows on settings. Then "less dark", and the window
words out of the top bar: they moved to a panel along the foot, as on a
two-panel Linux desktop, in the lessons' session-bar voice.

| Part | Treatment | Where |
| --- | --- | --- |
| Left | `mimei` in bold mono, then `1 2 3 4`, the workspace you are on in reverse video. The logo image is hidden but kept in the DOM (the scene swap sets its source) | `bar.js`, `44-mist.css` |
| Middle | Empty. The lesson's steps were dropped from the bar (the outline and the session bar carry them); the window words moved to the panel | `bar.js`, `study.js` |
| Right | Just the clock, `15:21 │`, then search and apps. The checkpoint count and network readout were dropped at the user's request (progress lives in the lesson's session bar and the goals window) | `index.html`, `bar.js`, `44-mist.css` |
| Surface | Near-black `--mist-bar` (a lighter smoked glass was tried and the user chose to go back), no blur, no border; pale in Ice. One 12.5px mono size, lowercase, no tracking. Under 620px the name steps aside | `44-mist.css` |
| Panel | `#panel` along the foot on 3 and 4: `manual* terminal files`, the window in front in reverse video with tmux's `*` (a kept slot, so no word moves), open ones bright, put-away ones quieter. Same glass as the bar, 26px; the seat gives up that height (`--panel-h`) so nothing tiles under it. Hidden on the lessons (their own session bar) and under 620px (the apps menu, as before) | `index.html`, `bar.js`, `44-mist.css` |

## Assets and tools

- `tools/mist.py` builds the fog walls (`assets/walls/*`) from the project's
  own city plates; `tools/assets.py` runs it. The etched edge, its assets and
  `tools/glass.py` were removed when the user dropped the 未明 from the manual.

## Checked

- Chrome screenshots at 1600×1000, 1280×800, 900×800 and 390×844, Night and Ice.
- `tools/lint_css.py`, `tools/lint_lessons.py` clean. See HANDOFF for the
  Playwright run.
