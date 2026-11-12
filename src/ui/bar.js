/* ════════════════════════════════════════════════════════════════════════════
   MIMEI · UI/BAR
   The top bar (workspaces 2, 3 and 4; the desk has its own menu), drawn as a
   plain Linux bar in 44-mist.css: the name and the four workspaces as bare
   numbers on the left, this workspace's words in the middle, the readouts and
   the two global controls on the right.

   The middle does what the rail used to: every window that lives here is a
   word. The one in front is underlined; clicking it puts it away, clicking
   any other brings it forward. A workspace can lend the middle its own words
   instead (lendBarMiddle): the study shows the open lesson's steps there, the
   one you are reading underlined. When the words do not all fit, only the
   current one keeps its name.
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
const lent = {};            // workspace -> { label, key(), items(), go(id) }: words lent to the middle

/** A workspace lends the middle its own words (the study: the lesson's steps). items() gives
 *  [{ id, num, name, title, here, done }]; go(id) is what a click on one does. */
export function lendBarMiddle(ws, words) {
  lent[ws] = words;
  if (els.task) { els.task.dataset.key = ''; paintWins(); }
}
/** The lender's words changed (the step being read, a step cleared). */
export function repaintBarMiddle() { if (els.task) paintWins(); }


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

/** The middle: this workspace's windows, the one in front underlined (or the words a workspace lent it). */
function paintWins() {
  if (!els.task) return;
  const n = activeWs();
  if (lent[n]) { paintLent(n, lent[n]); return; }
  if (els.task.classList.contains('lent')) {
    els.task.classList.remove('lent', 'fit-1', 'fit-2');
    els.task.setAttribute('aria-label', 'Windows on this workspace');
  }
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

/** Draw lent words afresh for a new lesson; otherwise mark the current one in place. */
function paintLent(n, own) {
  const t = els.task;
  const key = `${n}|lent|${own.key()}`;
  if (t.dataset.key === key) return;
  t.dataset.key = key;
  const items = own.items();
  const struct = items.map(it => `${it.id}:${it.name}`).join('|');
  if (!t.classList.contains('lent')) { t.classList.add('lent'); t.dataset.struct = '-'; }
  t.setAttribute('aria-label', own.label);
  if (t.dataset.struct !== struct) {
    t.dataset.struct = struct;
    const had = t.contains(document.activeElement) ? document.activeElement.dataset.id : null;
    t.innerHTML = items.map(it => `<button type="button" class="bw bs" data-id="${escAttr(it.id)}"><span class="bt-num">${escAttr(it.num)}</span><span class="bt-name">${escAttr(it.name)}</span></button>`).join('');
    t.querySelectorAll('.bs').forEach(b => b.onclick = () => { sound.click(); own.go(b.dataset.id); });
    if (had) { const b = t.querySelector(`.bs[data-id="${had}"]`); if (b) b.focus({ preventScroll: true }); }
  }
  const byId = new Map(items.map(it => [it.id, it]));
  t.querySelectorAll('.bs').forEach(b => {
    const it = byId.get(b.dataset.id);
    if (!it) return;
    b.classList.toggle('focus', !!it.here);
    b.classList.toggle('done', !!it.done);
    if (it.here) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    if (b.title !== it.title) b.title = it.title;
  });
  fitLent();
}

/** Fit full names, then only the current name, then compact words. */
function fitLent() {
  const t = els.task, bs = [...t.querySelectorAll('.bs')];
  if (!bs.length) { t.classList.remove('fit-1', 'fit-2'); return; }
  const room = t.clientWidth;
  if (!room) return;
  /* measure with every name shown: a name an earlier fit hid measures 0, and would pass for room to spare */
  t.classList.remove('fit-1', 'fit-2');
  const parts = bs.map(b => ({ here: b.classList.contains('focus'), num: b.querySelector('.bt-num').scrollWidth, name: b.querySelector('.bt-name').scrollWidth }));
  const GAP = 4, NAME = 8;
  const need = (pad, named, cap) => parts.reduce((a, p) => a + pad + p.num + (named(p) ? NAME + Math.min(cap, p.name) : 0), 0) + GAP * (parts.length - 1);
  const fit = need(24, () => true, 1e4) <= room ? '' : need(24, p => p.here, 220) <= room ? 'fit-1' : 'fit-2';
  t.classList.toggle('fit-1', fit === 'fit-1');
  t.classList.toggle('fit-2', fit === 'fit-2');
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

  /* A new width changes what fits. */
  addEventListener('resize', () => { if (els.task && els.task.classList.contains('lent')) fitLent(); }, { passive: true });
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
