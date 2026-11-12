/* ════════════════════════════════════════════════════════════════════════════
   MIMEI · UI/BAR
   The top bar (workspaces 2, 3 and 4; the desk has its own menu), drawn as a
   plain Linux bar in 44-mist.css: the name and the four workspaces as bare
   numbers on the left, the clock and the two global controls on the right.

   This workspace's windows are words on the panel along the foot (#panel,
   workspaces 3 and 4; the lessons have their own session bar). The one in
   front is in reverse video; clicking it puts it away, clicking any other
   brings it forward.
   ════════════════════════════════════════════════════════════════════════════ */

import {
  activeWs, focusedId, goWorkspace, hideWindow, isFocused, onWM, windowDef, windowsHere, windowsOn,
} from '../core/wm.js';
import { summon } from '../core/keys.js';
import { sound } from '../core/sound.js';
import { onPaint, escAttr } from './window.js';
import { openLauncher } from './launcher.js';

const WS = [
  { n: 1, name: 'desk', title: 'The desk' },
  { n: 2, name: 'lessons', title: 'Lessons: the study' },
  { n: 3, name: 'manual', title: 'The manual, the terminal and the files' },
  { n: 4, name: 'settings', title: 'Settings' },
];

/* the windows each workspace keeps, in the bar's order; anything else moved here joins after them */
const HOME = { 3: ['man', 'tty', 'files'], 4: ['settings'] };
const WORD = { man: 'manual', tty: 'terminal', files: 'files', settings: 'settings', system: 'goals', course: 'course', session: 'lesson' };
const word = id => WORD[id] || (windowDef(id) ? windowDef(id).title.toLowerCase() : id);

let els = {};
let clockTimer = 0;

function clockText() {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function paintClock() {
  if (!els.clock) return;
  const now = new Date();
  els.clock.textContent = clockText();
  els.clock.dateTime = now.toISOString();
  els.clock.title = now.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

/** The panel: this workspace's windows, the one in front in reverse video. */
function paintWins() {
  if (!els.task) return;
  const n = activeWs();
  const shown = windowsOn(n);
  const ids = [...new Set([...(HOME[n] || []), ...windowsHere(n)])].filter(id => windowDef(id));
  const key = `${n}|${ids.join(',')}|${shown.join(',')}|${focusedId()}`;
  if (els.task.dataset.key === key) return;
  els.task.dataset.key = key;
  const had = els.task.contains(document.activeElement) ? document.activeElement.dataset.win : null;
  els.task.innerHTML = ids.map(id => {
    const def = windowDef(id), f = isFocused(id), on = shown.includes(id);
    const tip = f ? `${def.title}: in front, click to put it away (Alt+Z)` : on ? `${def.title}: bring it forward` : `${def.title}: open it`;
    return `<button type="button" class="bw${f ? ' focus' : ''}${on ? ' open' : ''}" data-win="${id}"
        aria-pressed="${f}" title="${escAttr(tip)}"><span class="bt-name">${escAttr(word(id))}</span></button>`;
  }).join('');
  els.task.querySelectorAll('.bw').forEach(b => b.onclick = () => {
    sound.click();
    const id = b.dataset.win;
    // the dock behaviour everyone already knows: the window in front goes away, any other comes forward
    if (isFocused(id)) { hideWindow(id); return; }
    summon(id);
  });
  /* a repaint under the keyboard keeps the cursor on the same word */
  if (had) { const b = els.task.querySelector(`.bw[data-win="${had}"]`); if (b) b.focus({ preventScroll: true }); }
}

export function paintBar() {
  if (!els.ws) return;
  const now = activeWs();
  const key = String(now);
  if (els.ws.dataset.key !== key) {
    els.ws.dataset.key = key;
    els.ws.innerHTML = WS.map(w => {
      const here = now === w.n;
      return `<button class="ws" data-ws="${w.n}" title="${w.title} (Alt+${w.n})"
          ${here ? 'aria-current="page"' : ''}><span class="num" aria-hidden="true">${w.n}</span><small class="ws-name sr-only">${w.name}</small></button>`;
    }).join('');
    els.ws.querySelectorAll('.ws').forEach(b => b.onclick = () => {
      sound.click();
      goWorkspace(+b.dataset.ws);
    });
  }
  const active = WS.find(w => w.n === now);
  els.ws.dataset.active = active ? active.name : 'desk';
  paintWins();
  paintClock();
}

export function initBar() {
  els = {
    ws: document.getElementById('workspaces'),
    task: document.getElementById('bar-task'),
    clock: document.getElementById('bar-clock'),
  };
  if (!els.ws) return;

  document.getElementById('brand').onclick = () => { sound.click(); goWorkspace(1); };
  document.getElementById('mod-launch').onclick = () => openLauncher();
  document.getElementById('mod-apps').onclick = () => openLauncher('windows');

  clockTimer = setInterval(paintClock, 10000);

  onWM(paintBar);
  onPaint(paintBar);
  paintBar();
  paintClock();
}

export function stopBarClock() {
  if (clockTimer) clearInterval(clockTimer);
  clockTimer = 0;
}
