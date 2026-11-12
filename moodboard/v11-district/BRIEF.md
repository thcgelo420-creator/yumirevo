# v11 · The district — brief for workspaces 2 and 3

11 Nov 2026. What the owner asked for, what the pictures say, what was wrong
with the two workspaces, and the four answers that set the direction. What
shipped is in `BUILD.md`; what is on screen is in `DESIGN.md`.

## The ask

> "lets redesign the 2nd and 3rd workspace accordingly, we can improve them
> alot, i just feel that way. … GO ALL OUT."

No list of complaints came with it: a feeling, seven pictures, and an
invitation to ask questions.

## The pictures

Seven images, in this folder. Four of them are byte-for-byte the ones in
`v6-lunar/` (one of those was in `v5-chrome-soft-club/` before that). They
keep coming back, so they count more than once.

| File | Seen before | What to take from it |
| --- | --- | --- |
| `01-foggy-harbour-holo-billboards` | new | Quiet teal fog, and all the colour held on a few tall screens: the air is calm, the signs are not |
| `02-hologram-dancer-billboard-city` | v5, v6 | A hologram made of upright lines; white brand signs with a ghost of themselves under them |
| `03-aerial-city-ring-roads-blue-red` | v6 | Deep blue with one hot tower: a single warm light against the cool (the lamp) |
| `04-iridescent-led-columns-rain` | v6 | Tall LED columns with rounded tops, cyan through pink to orange, and their light on the wet ground |
| `05-mirrors-edge-catalyst-daylight` | new | Daylight: white glass, blue sky, magenta signs, blossom |
| `06-transcendo-chrome-hud` | new | Chrome, thin frames, registration marks: a screen can be a material |
| `07-neo-akiba-anime-billboards` | v6 | A wall of signs: yellow, magenta and cyan, vertical Japanese, density |

What they share: **the screen is the hero.** Colour is never in the air or on
the ground; it is on something that emits it. That is the rule the build
took: light belongs to signs.

## What was wrong (looked at live, 1440×900 and 1920×1080, Night)

The desk has all the character: a crane, a sign on a hook, a city. Then you
press Enter, fall into that city, and land in fog.

**Workspace 2, the study**

1. **You land in fog.** After the leap, the city is a grey-blue smear with a
   few red dots, and the dots show through the outline's text. None of the
   pictures' light survived the trip down.
2. **A docs page on a wallpaper.** One voice for everything: the kicker, the
   step heads, the code heads, the runbook, the probe and the key idea were
   all 11px grey capitals. Nothing told a runbook from a probe at a glance.
3. **No syntax colour** in a course that teaches a programming language.
4. **The checkpoint, the only progress the course has, was eight grey
   words** in the corner (`CHECKPOINT 1 OF 3`).
5. **Dead margins.** 223px of nothing either side at 1440, 440px at 1920.
6. **A bug:** when the bar lent its middle to the lesson, the step names ran
   over the workspaces on the left and the readouts on the right. The fit was
   measured while the names were hidden, so every other paint read "it all
   fits".

**Workspace 3, the manual**

1. **The tiling gave the least useful window the most room.** With all three
   open at 1440 the terminal took 637px and sat almost empty, and the manual,
   the reason the workspace exists, took 411px, where its code notes wrapped.
2. **A cheatsheet set as an essay.** One 625px column in a 1410px window:
   nine lines of code a screen, eleven sheets you could only page through
   with ◀ ▶, and no way to see what the eleven were.
3. **The lamp framed the whole screen.** Alone, the manual wore a 2px amber
   border round the entire viewport, the loudest thing there, marking the
   only window as the window in front.
4. **A bug:** the bar's gliding lamp dot was placed from the wrong corner on
   workspaces 3 and 4 and sat beside the wrong word.

The structural weakness, in one sentence: **the two workspaces were built on
"no accent colour", and every picture the owner has sent since v5 is about
coloured light.**

## The four questions, and the answers

1. *Colour: the pictures are loud, the rule is quiet. Which wins?*
   **Full neon**: glowing coloured pane edges, saturated headers, more signs
   in the margins, visible scanlines. (Offered: signs glow and the air stays
   calm; full neon; keep it quiet.)
2. *What should the lesson feel like after the leap?*
   **The district's big screen**: one large pane, the margins become LED
   columns lit by real checkpoints, the title a billboard, a colour for each
   kind of step. (Offered: the big screen; a chrome HUD; a street of signs.)
3. *What is workspace 3 for?*
   **A cheatsheet wall beside Studio**: a dense board in columns, every sheet
   listed, the terminal and files as small panels stacked to one side.
   (Offered: the wall; a desktop to tinker in; the manual only.)
4. *Where should Ice go?*
   **Mirror's Edge daylight**: white glass, slate text, magenta and
   electric-blue signs, blossom light. (Offered: daylight; keep the snow;
   Night only.)

## The thesis

You leapt off the crane into the city, so workspaces 2 and 3 are **in** it.
The lesson is on the district's big screen; the manual is its wall of signs.
Full neon, with one discipline that keeps a long lesson readable: **light
belongs to signs.** Prose stays white on quiet glass; colour is on signs,
edges, status lamps and code, and each colour means one thing.

## What had to survive

- The desk (workspace 1), untouched.
- Real numbers only: every figure on a sign comes from the course, the clock
  or the learner.
- The lamp means *you*, and nothing else is amber.
- Plain English copy; the Japanese on the street signs is ornament with a
  real meaning, always beside the English.
- Every action by keyboard; nothing decorative takes a key or is read out.
- `content/*.md` is not edited to fit.
