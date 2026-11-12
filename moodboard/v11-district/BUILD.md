# v11 · The district — workspaces 2 and 3, full neon

Agreed 11 Nov 2026 (the four answers are in `BRIEF.md`). This is why the
lessons and the manual look the way they do; what is on screen is in
`DESIGN.md`, how it is built is in `HANDOFF.md`.

## The idea

The desk (workspace 1) is the view from the crane. Enter, and you fall into
the city. Workspaces 2 and 3 are where you land: **the district**.

- Workspace 2 is **the district's big screen**: the lesson is on it.
- Workspace 3 is **the sign wall**: the cheatsheet as a board you glance at
  beside Studio.
- Workspace 4 (settings) was not redesigned. It shares the glass, so it
  gets the lit edge and the wall's signs and nothing else.

## The rule

**Light belongs to signs.** It replaces "no accent colour" on workspaces 2,
3 and 4. A colour is only on something a city would light, prose stays
white, and each colour means one thing.

| Colour | Night | Ice | Means |
| --- | --- | --- | --- |
| cyan | `#45f0ff` | `#0b62e6` | read · strings and paths · code screens |
| yellow | `#ffe94a` | `#007480` (teal) | do it in Studio · the stop's number |
| violet | `#b089ff` | `#6b3fe0` | predict |
| pink | `#ff4fc3` | `#d6006f` | build · the signs' own edge |
| mint | `#4dffb4` | `#087a4c` | reached, right |
| red | `#ff6b7d` | `#d42a3c` | wrong |
| amber | `#ffb46b` | `#c96f22` | the lamp: you. Unchanged |

The iridescent run (cyan, violet, pink, amber) is progress: the LED columns
and every bar that fills. As text on the solid pane every colour clears
4.5:1 (Night 6.7:1 or better, Ice 4.6:1 or better); ink on a lit sign is
dark at Night and white in Ice (6.8:1 and 5:1 or better).

## Decisions

- **Full neon, but the page stays a page.** Lit pane edges, saturated
  billboards, signs in the margins and scanlines on every head; the prose
  under them is the same white on quiet glass as before.
- **The lamp keeps its job.** It is no longer the edge of the window in
  front (every window has an edge of its own light now, at full brightness
  in front and 40% behind). It is the dot beside that window's name, the
  keyboard's ring, the step you are on, the bar's dot and the caret.
- **Signs carry real numbers only.** The unit and the stop, this lesson's
  checkpoints, the course's twelve units, tonight's time, the step being
  read, the lesson after this one. Nothing on a sign is made up.
- **Japanese on the street signs, real words.** Each unit's name as a sign
  would write it (`src/data/signs.js`), set top to bottom, always beside
  the English, never read out. The face is M PLUS Rounded 1c, cut down to
  the 92 glyphs the signs use, 50 of them Japanese (12KB). Dela Gothic One was tried first and
  dropped: at 30 to 40px its counters closed up under the glow.
- **Sora for signs**, Inter and IBM Plex Mono for everything you read.
- **The manual leads.** A new layout, the deck, gives the first window about
  two thirds of the width and stacks the others beside it. Workspace 3
  starts in it; `Alt+Shift+M` walks columns, rows and the deck.
- **A cheatsheet is scanned, not scrolled.** One card a heading, two columns
  from 1000px, three from 1640px, and an index of all eleven sheets.
- **Ice is daylight.** White glass, slate text, magenta and electric blue;
  blue from the sky and blossom light from the street on the wall. Light
  spills a third as far as at Night (`--nx-glow`).
- **Motion is small and only at fx 2 and 3.** The wall's screens breathe, a
  band of light crosses the billboard, a street sign flickers, the margin's
  signs power on when you arrive. Everything holds at fx 0 and 1 and under
  reduced motion.

## What shipped

- **The district's light** (`styles/44-neon.css`): the sign colours and what
  they mean, code's syntax colours, the wall's signs (nine out-of-focus
  screens and six streaks on the wet ground, on workspaces 2 to 4), the
  iridescent line under the bar, and one ring of light just inside every
  pane.
- **Workspace 2** (`styles/45-screen.css`, `src/ui/district.js`):
  - the title as a billboard across the top of the page, with one light for
    each checkpoint and the unit's street sign down its edge;
  - the same lights in the pane's head beside `checkpoint 2 of 3`;
  - step heads that wear their kind: read cyan, do yellow, predict violet,
    build pink;
  - code on a screen, Studio's output in phosphor mint, probes violet,
    runbooks yellow turning mint, the key idea a line of cyan;
  - the margins' signs: left, the unit, its street sign, an LED column of
    this lesson's checkpoints and the step you are reading; right, tonight,
    a column of the course's twelve units, the 未明 sign and the next lesson.
- **Workspace 3** (`styles/46-signwall.css`, `src/ui/man.js`,
  `src/core/wm.js`):
  - the manual as a board: a billboard, cards in the four sign colours, an
    index of every sheet and of this sheet's headings;
  - the deck layout, and a one-time move to it for a workspace 3 nobody has
    rearranged (`state.deckMig`);
  - an edge of light for each window: the manual pink into violet, the
    terminal mint into cyan, the files cyan into violet.
- **Two fixes found on the way** (`src/ui/bar.js`, `44-neon.css`): the bar's
  lent step names no longer run over the workspaces and the readouts (the
  fit is measured on the full words every time), and its lamp dot lands on
  the right word on workspaces 3 and 4.

## Geometry

- **Workspace 2 at 1440×900:** the pane is unchanged (995×840 at x 223). Each
  margin is 195px between the gaps: a 60px street sign and a 98px column,
  with a plate above and below. At 1920×1080 the margins are 412px, the
  columns 150px and the plates 290px. The signs stand down when the drawer
  is out or a margin is under 150px (below about 1160px wide).
- **Workspace 3 at 1440×900:** alone, the manual is 1412 wide: a 216px index
  and two columns of cards. With the terminal and the files open the manual
  is 908 wide (one column, the index still there) and the other two stack
  in a 490px column, the files above at 504px and the terminal below at
  322px. Before, the three stood side by side at 411, 637 and 337px.
- **Below 1000px** the windows stack as before; the manual drops its index
  under 880px.

## Budget

- No new pictures and no new canvas. The wall's signs are fifteen small
  elements blurred once; four of them fade at fx 2 and 3.
- `district.js` paints the margins only when a number changes.
- Fonts: Sora 34KB (it was already in `assets/fonts/`), the sign face 12KB,
  both fetched only when a sign is on screen.
- Three stylesheets, about 57KB before compression.

## Stills (1440×900, fx 3, a save with 5 of 210 checkpoints)

- `screen-night`, `screen-night-step`, `screen-night-drawer`: workspace 2 at
  the top of a lesson, at a *do* step, and with the scripts out.
- `screen-ice`: the same lesson in Ice.
- `screen-night-1920`: workspace 2 at 1920×1080.
- `wall-night`: the manual alone, two columns.
- `wall-night-deck`, `wall-ice-deck`: the manual leading, the files and the
  terminal stacked beside it.

## Not done, on purpose

- **The specs.** This round landed ahead of its tests, at the owner's word.
  `HANDOFF.md` §9 lists what to move.
- **Workspace 4.** Settings has the lit edge and nothing else.
- **The launcher** still has its own glass, as after v10.

## Open for the next round

- The kicker still says `STOP 2.1` (the climb's word). `LESSON 2.1`?
- Should the margin's columns be buttons (the lesson's to the next open
  checkpoint, the course's to the course overlay)? Today they are only signs.
- A real street-level picture for the wall. The signs are drawn over the
  crane's city, which is still seen from above.
- The terminal is still mostly empty. More commands, or leave it small?
- Ice's wall is the snowy plate with blue and blossom laid over it; a
  daylight plate of its own would finish it.
