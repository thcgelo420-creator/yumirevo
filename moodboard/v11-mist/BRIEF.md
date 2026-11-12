# v11-mist — brief

Workspace 2 (lessons) and workspace 3 (manual, Terminal, Files) only. The desk
(workspace 1) and settings (workspace 4) are fenced off and keep the cab look.

## What was asked

- A distinctive look with a strong, quiet personality. The previous round
  (`hoplite/miletos-*`, PR #1) was rejected: panels on backdrops, LED art that
  read as a banner, a city too dark and muddy, and too timid overall.
- Back to the **glass pane**: the city seen through a window, in fog.
- Long reading stays comfortable; everything stays keyboard reachable; lesson
  text and code meet AA in dark (Night, Late) and light (Ice).

## References (not shipped)

The reference images live in the user's earlier commit, under
`moodboard/v11-district/` at `aa4d7c8`, plus the attachments from the
conversation (a misty Shanghai skyline, Donglu Yu's *Connected*, *Misty City
Lights*, Tokyo Ghoul stills). None of them ship. The walls are generated from
the project's own city plates (`tools/mist.py`).

Crops the user picked: **a1** fog, **h3** ring roads, **i4** LED columns,
**j4** wet reflections. "Strong personality but wrong vibe" ruled out loud neon.

## Decisions the user made, in order

1. The lesson pane stays **centred**, then (stage 4) **spans the full width**
   with the scripts drawer taking the right side when it is out.
2. The etched 未明 lives on the **manual's** glass edge, not on workspace 2 (later dropped, 9).
3. **No amber or orange** on workspaces 2 and 3.
4. Of three lesson treatments, **B (shell and tree)** for the lesson and
   **C (tmux session bar)** at the bottom.
5. **Real slugs** in the outline tree (`01-a-box-with-a-name-on-it`).
6. The lesson's parts (scripts, Output, runbooks, probes, solutions) in the
   same shell voice; then workspace 3 in it too.
7. Overnight, a free hand to finish workspace 3: the manual as a man page,
   Files as `ls`.
8. Workspace 3 **opens with all three** windows: manual, Terminal, Files.
9. **Drop the etched 未明** from the manual; its strip and drops went with it.
10. The **top bar** "cleaner and minimal, just like Linux": an i3-style bar
    wherever it shows (2, 3 and 4).
