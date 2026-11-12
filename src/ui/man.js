/* ════════════════════════════════════════════════════════════════════════════
   MIMEI · UI/MAN
   Workspace 3: reference material, set the way a manual has been set for fifty
   years. Every cheatsheet in the course is a man page — `man luau-decisions` —
   with a name and section in the corner, capitalised headings and a footer that
   tells you how to leave. `q` closes it, because of course it does.

   Since the district (moodboard/v11-district) the page is a sign wall: the
   title on top, then one card per heading, so a wide pane sets the sheet in
   columns you can scan beside Studio. Down the left, when there is room, every
   sheet in the course and this sheet's headings (the index).
   ════════════════════════════════════════════════════════════════════════════ */

import { GROUPS, courseList, cheatFor, lessonById } from '../data/course.js';
import { SIGNS, unitSign } from '../data/signs.js';
import { defineWindow, closeWindow, openWindow } from '../core/wm.js';
import { state, save } from '../core/state.js';
import { log } from '../core/journal.js';
import { escapeHtml as esc, renderMarkdown } from '../core/md.js';
import { sound } from '../core/sound.js';
import { openLesson } from './session.js';

let api = null, docEl = null, bodyEl = null, headEl = null, footEl = null, indexEl = null;
let sheet = null;

const sheets = () => courseList().filter(l => l.kind === 'tool');
export const currentSheet = () => sheet;
const stillNow = () => document.documentElement.dataset.fx === '0';
const short = t => String(t).replace(/ cheatsheet$/i, '');

const sectionOf = l => {
  const g = GROUPS.find(x => x.id === l.g);
  const unit = l.g ? l.g.replace('g', '') : '1';
  const name = (g ? g.label : l.title).toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  return { unit, name: `LUAU-${name}`, label: g ? g.label.toLowerCase() : 'reference' };
};

/** Every cheatsheet the machine knows, in line order. */
export const manSheets = () => sheets().map(l => ({ id: l.id, n: l.n, title: l.title, tag: l.tag }));

/**
 * openMan(id) — `id` is either a cheatsheet lesson id or any lesson, in which
 * case the machine opens that unit's sheet.
 */
export function openMan(id) {
  const l = lessonById(id);
  let target = null;
  if (l && l.kind === 'tool') target = l;
  else if (l) target = cheatFor(l.id);
  if (!target) target = sheets()[0] || null;
  sheet = target ? target.id : null;
  state.last = sheet || state.last;
  save();
  openWindow('man');
  render();
  return sheet;
}

export function nextSheet(dir) {
  const list = sheets();
  if (!list.length) return;
  const i = list.findIndex(s => s.id === sheet);
  const next = list[(i + dir + list.length) % list.length];
  sound.open();
  sheet = next.id;
  render();
}

/** A sheet picked in the index. */
function showSheet(id) {
  if (!id || id === sheet) return;
  sound.open();
  sheet = id;
  render();
}

/* ── painting ─────────────────────────────────────────────────────────────── */
/** The sheet as a board: its title and lead on top, then one card per heading, so a wide pane can set it in columns. */
function board(frag, l) {
  const top = document.createElement('header');
  top.className = 'man-top';
  const cards = document.createElement('div');
  cards.className = 'man-cards';
  let card = null;
  for (const node of [...frag.childNodes]) {
    if (node.nodeType === 1 && node.tagName === 'H2') {
      card = document.createElement('section');
      card.className = 'man-card';
      card.dataset.i = String(cards.children.length % 4);     // the cards take the four sign colours in turn
      cards.appendChild(card);
    }
    (card || top).appendChild(node);
  }
  const ja = document.createElement('span');
  ja.className = 'man-ja';
  ja.lang = 'ja';
  ja.setAttribute('aria-hidden', 'true');
  ja.textContent = l && l.g ? unitSign(l.g) : SIGNS.manual;
  top.appendChild(ja);
  return [top, cards];
}

/** The index: every sheet, the one you are on marked; then this sheet's headings. One tab stop, the arrows walk it. */
function paintIndex() {
  if (!indexEl) return;
  const list = sheets();
  const had = indexEl.contains(document.activeElement);
  indexEl.querySelector('.mi-n').textContent = `${list.length} ${list.length === 1 ? 'sheet' : 'sheets'}`;
  indexEl.querySelector('.mi-list').innerHTML = list.map(s => {
    const sec = sectionOf(s), on = s.id === sheet;
    return `<li><button type="button" class="mi-sheet" data-id="${esc(s.id)}" tabindex="${on ? 0 : -1}"${on ? ' aria-current="page"' : ''}
      title="${esc(`${sec.name}(${sec.unit})`)}"><span class="n">${esc(String(sec.unit).padStart(2, '0'))}</span><span class="t">${esc(short(s.title))}</span></button></li>`;
  }).join('');
  const heads = docEl ? [...docEl.querySelectorAll('.man-card > h2')] : [];
  indexEl.querySelector('.mi-here').hidden = !heads.length;
  indexEl.querySelector('.mi-secs').innerHTML = heads.map((h, i) =>
    `<li><button type="button" class="mi-sec" data-i="${i}" tabindex="-1"><i aria-hidden="true"></i><span>${esc(h.textContent.trim())}</span></button></li>`).join('');
  if (had) { const on = indexEl.querySelector('.mi-sheet[aria-current]'); if (on) on.focus({ preventScroll: true }); }
}

function render() {
  if (!docEl) return;
  const l = sheet ? lessonById(sheet) : null;
  const list = sheets();
  const i = Math.max(0, list.findIndex(s => s.id === sheet));
  const sec = l ? sectionOf(l) : { name: 'LUAU', unit: '1', label: '' };

  if (headEl) {
    headEl.innerHTML = `<span class="l">${sec.name}(${sec.unit})</span>
      <span class="m">MIMEI manual · ${sec.label}</span>
      <span class="r">${i + 1}/${list.length}</span>`;
  }
  if (api) {
    api.setTitle(l ? l.title : 'Manual');

  }

  const src = l && l.md ? document.getElementById(l.md) : null;
  if (!l || !src) {
    docEl.innerHTML = `<div class="unbuilt"><p class="big">[ no manual page ]</p>
      <h2>The reference shelf is empty</h2>
      <p>Cheatsheets are written alongside the unit they belong to.</p></div>`;
  } else {
    docEl.innerHTML = '';
    docEl.append(...board(renderMarkdown(src.textContent, { plain: true }), l));
    const back = document.createElement('p');
    back.className = 'hint';
    back.innerHTML = `want the lesson itself? <button class="btn ghost" id="man-open">open ${short(l.title)}</button>`;
    docEl.appendChild(back);
    const open = docEl.querySelector('#man-open');
    if (open) open.onclick = () => {
      const lesson = courseList().find(x => x.kind === 'lesson' && (x.g || '') === (l.g || ''));
      openLesson(lesson ? lesson.id : '1.0');
    };
  }
  bodyEl.scrollTop = 0;
  paintIndex();
  paintFoot();
}

function paintFoot() {
  if (!footEl) return;
  const list = sheets();
  const i = Math.max(0, list.findIndex(s => s.id === sheet));
  footEl.innerHTML = `
    <button class="btn ghost" id="man-prev" title="Previous sheet">◀</button>
    <button class="btn ghost" id="man-next" title="Next sheet">▶</button>
    <span class="seg">man ${i + 1}/${list.length}</span>
    <span class="fill"></span>
    <span class="seg" id="man-pos">top</span>
    <span class="seg"><kbd>q</kbd> close</span>`;
  footEl.querySelector('#man-prev').onclick = () => nextSheet(-1);
  footEl.querySelector('#man-next').onclick = () => nextSheet(1);
}

/* ── the window ───────────────────────────────────────────────────────────── */
export const manWindow = defineWindow({
  id: 'man',
  title: 'Manual',
  tag: 'man',
  icon: 'man',
  ws: 3,
  weight: 1,
  build(body, winApi) {
    api = winApi;
    const root = document.createElement('div');
    root.className = 'man';
    headEl = document.createElement('div');
    headEl.className = 'man-head';
    bodyEl = document.createElement('div');
    bodyEl.className = 'man-body';
    bodyEl.tabIndex = 0;
    bodyEl.setAttribute('role', 'document');
    bodyEl.setAttribute('aria-label', 'Manual page');
    docEl = document.createElement('div');
    docEl.className = 'man-doc';
    bodyEl.appendChild(docEl);

    /* the index: every sheet and this sheet's headings, down the left when the pane is wide enough (CSS) */
    indexEl = document.createElement('nav');
    indexEl.className = 'man-index';
    indexEl.setAttribute('aria-label', 'Manual pages');
    indexEl.innerHTML = `
      <p class="mi-h"><span class="mi-ja" lang="ja" aria-hidden="true">${SIGNS.manual}</span><b>the manual</b><span class="mi-n"></span></p>
      <ol class="mi-list"></ol>
      <p class="mi-h mi-here" hidden><b>on this sheet</b></p>
      <ol class="mi-secs"></ol>`;
    indexEl.addEventListener('click', e => {
      const s = e.target.closest('.mi-sheet');
      if (s) { showSheet(s.dataset.id); return; }
      const c = e.target.closest('.mi-sec');
      const card = c ? docEl.querySelectorAll('.man-card')[+c.dataset.i] : null;
      if (!card) return;
      sound.click();
      card.scrollIntoView({ block: 'start', behavior: stillNow() ? 'auto' : 'smooth' });
      card.classList.remove('hit');
      card.getBoundingClientRect();
      card.classList.add('hit');
    });
    indexEl.addEventListener('keydown', e => {
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
      const items = [...indexEl.querySelectorAll('.mi-sheet, .mi-sec')];
      const i = items.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      const j = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : Math.max(0, Math.min(items.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)));
      items[j].focus();
    });

    const main = document.createElement('div');
    main.className = 'man-main';
    main.append(indexEl, bodyEl);
    root.append(headEl, main);
    body.appendChild(root);

    footEl = winApi.foot;
    winApi.showFoot(true);

    bodyEl.addEventListener('scroll', () => {
      const p = Math.round(bodyEl.scrollTop / Math.max(1, bodyEl.scrollHeight - bodyEl.clientHeight) * 100);
      const pos = footEl.querySelector('#man-pos');
      if (pos) pos.textContent = isNaN(p) ? 'top' : (p >= 99 ? 'end' : p + '%');
    }, { passive: true });

    if (!sheet) sheet = sheets()[0] ? sheets()[0].id : null;
    render();

    return {
      focus() { paintFoot(); },
      onKey(e) {
        if (e.altKey || e.ctrlKey || e.metaKey) return false;
        if (/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '')) return false;
        if (e.key === 'q') { e.preventDefault(); closeWindow('man'); log('dim', '[ q ] man page closed'); return true; }
        return false;
      },
    };
  },
});

/** Open the sheet that belongs to whatever is being read. */
export function openManForLesson(id) {
  const l = lessonById(id);
  return openMan(l ? l.id : 'cheat');
}
