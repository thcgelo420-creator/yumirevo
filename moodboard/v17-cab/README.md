# v17 · The cab — workspace 2, saved

14 Nov 2026. The design the owner liked ("this is really nice actually"), kept
as a working prototype. It is not wired into the app yet.

## The idea

On the desk you look out from the crane. On workspace 2 you are inside it: in
the operator's cab, the glass box at the top of the crane, high above the city
at night.

- **The glass covers the city.** The cab's windows are the panes: rain beaded
  on them, the steel frame around them, the crane's own painted city sharp
  outside, traffic moving on its roads.
- **The lesson is a heads-up display on the windshield**, in the desk's voice
  (Inter, thin and large; IBM Plex Mono small capitals). The steps are on the
  left side window, with a lamp for each checkpoint.
- **The hook still hangs out in the rain.** Its LED sign is the desk's own
  (`src/desk/led.js`, `Sign` and `LedRenderer`) and follows you: the step you
  are reading, and when you reach a checkpoint.
- **The console is the little Linux the crane runs on**: a tty logging what
  you do, this step's script, the checkpoint lamps and tonight, the clock and
  the weather.
- **S** brings the script up onto the glass under the hook; the lesson pane
  narrows to make room.
- **Opening it, the cab powers on**: the console boots, the sign lights, the
  glass fills in. Then only rain, a slow sway of the hook and the traffic move.
- **Scenes**: Night (dark smoked glass), Late (the 3 a.m. low cloud), Ice
  (light frosted glass and the frosted hook over the snow).

## Open it

Serve the repo (`./serve.sh`) and open
`http://localhost:8925/prototypes/cab/cab.html`. Add `?scene=late` or
`?scene=ice`. The pill bottom right stands in for real progress (0–3
checkpoints); it is a demo control only.

Files: `prototypes/cab/cab.html` (everything), `lesson.js` (loads lesson 2.1
and fakes progress for the demo), `doc.html` (lesson 2.1 as the app renders
it). Stills and a 20-second film (`cab-film.mp4`) are in this folder.

## Not done

Only lesson 2.1, no real progress, no keyboard focus work, no tests. Building
it into `src/ui/study.js` is the next step if it is chosen.
