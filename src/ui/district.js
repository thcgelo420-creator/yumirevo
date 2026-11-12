/* ════════════════════════════════════════════════════════════════════════════
   MIMEI · UI/DISTRICT
   Workspaces 2 and 3 are down in the city the desk looks over (moodboard/
   v11-district/BUILD.md). This file lights it:

   · the wall's signs: out-of-focus screens and their reflections on the wet
     ground, behind every pane on workspaces 2, 3 and 4. CSS draws them
     (styles/44-neon.css); this only puts the layer in #wall.
   · the lesson's margins on workspace 2: a stack of signs either side of the
     reading pane. Every number on them is real: the unit and the step you are
     reading, this lesson's checkpoints as an LED column, the course's twelve
     units as another, tonight's study time, the lesson after this one.

   Nothing here takes the keyboard or is read out: the outline, the pane's
   head and the bar already say all of it. The stacks stand down when the
   scripts drawer is out or the margins are too narrow to hold them (CSS).
   ════════════════════════════════════════════════════════════════════════════ */

import { GOALS, GROUPS, lessonById, writtenLessons } from '../data/course.js';
import { SIGNS, unitSign } from '../data/signs.js';
import { goalsOf } from '../core/state.js';
import { activeWs, onWM } from '../core/wm.js';
import { goalSeconds, hm, isNight, onNights, tonight } from '../core/nights.js';
import { escAttr as esc, onPaint } from './window.js';
import { checkpoints, currentLessonId, onLesson, onQuest, stepHere } from './session.js';
import { deskNow } from './desktop.js';

const p2 = n => String(n).padStart(2, '0');
const WALL_SIGNS = 9, WALL_STREAKS = 6;

let host = null, els = {};
let shown = '', raf = 0;
let litFor = '', lit = 0;          // the lesson whose column is up, and how many of its segments were lit

/** Each unit's checkpoints: reached and in all, in course order. */
function unitsNow() {
  const lessons = writtenLessons();
  return GROUPS.map((g, i) => {
    let have = 0, total = 0;
    for (const l of lessons) {
      if (l.g !== g.id) continue;
      const n = (GOALS[l.id] || []).length;
      total += n;
      have += Math.min(n, goalsOf(l.id).length);
    }
    return { n: i + 1, id: g.id, label: g.label, have, total };
  });
}

/** The step being read: its number, its title and what it asks, from the page. */
function stepNow() {
  const here = stepHere();
  const doc = document.querySelector('#st-scroll .doc');
  if (!doc) return null;
  const steps = [...doc.querySelectorAll('.step[data-step]')].filter(s => +s.dataset.step > 0);
  if (!steps.length) return null;
  const s = steps.find(x => +x.dataset.step === here);
  const h2 = s && s.querySelector(':scope > h2');
  return { n: s ? +s.dataset.step : 0, of: steps.length, kind: s ? (s.dataset.kind || 'read') : 'read', title: h2 ? h2.textContent.trim() : '' };
}

function skeleton() {
  return `
  <div class="dc-side dc-l"><div class="dc-in">
    <div class="dc-plate dc-unit"><span class="dc-k">unit</span><b class="dc-num"></b><span class="dc-name"></span></div>
    <div class="dc-row">
      <div class="dc-vsign dc-ja" lang="ja"></div>
      <div class="dc-col dc-lesson">
        <div class="dc-cap"><span>stop</span><b></b></div>
        <div class="dc-segs"></div>
        <div class="dc-foot"><b></b><span></span></div>
      </div>
    </div>
    <div class="dc-plate dc-step"><span class="dc-k"></span><b class="dc-num"></b><span class="dc-name"></span></div>
  </div></div>
  <div class="dc-side dc-r"><div class="dc-in">
    <div class="dc-plate dc-night"><span class="dc-k"></span><b class="dc-num"></b><span class="dc-name"></span><i class="dc-bar"><i></i></i></div>
    <div class="dc-row">
      <div class="dc-col dc-course">
        <div class="dc-cap"><span>course</span><b></b></div>
        <div class="dc-segs"></div>
        <div class="dc-foot"><b></b><span>checkpoints</span></div>
      </div>
      <div class="dc-vsign dc-ja dc-brand" lang="ja">${SIGNS.brand}</div>
    </div>
    <div class="dc-plate dc-next"><span class="dc-k"></span><b class="dc-num"></b><span class="dc-name"></span></div>
  </div></div>`;
}

function paint() {
  raf = 0;
  if (!host) return;
  const id = currentLessonId(), l = id ? lessonById(id) : null;
  const gi = l ? GROUPS.findIndex(g => g.id === l.g) : -1;
  const g = gi >= 0 ? GROUPS[gi] : null;
  const cps = l && !l.soon ? checkpoints() : [];
  const have = cps.filter(c => c.done).length;
  const units = unitsNow();
  const allHave = units.reduce((a, u) => a + u.have, 0), all = units.reduce((a, u) => a + u.total, 0);
  const step = l ? stepNow() : null;
  const seq = writtenLessons(), at = l ? seq.findIndex(x => x.id === id) : -1, next = at >= 0 ? seq[at + 1] : null;
  const d = deskNow(), night = isNight(d), secs = tonight(d), goal = goalSeconds();

  const key = [
    id, gi, cps.map(c => (c.done ? 1 : 0)).join(''), units.map(u => u.have).join('.'),
    step ? `${step.n}/${step.of}/${step.kind}/${step.title}` : '', next ? next.id : '', night ? 'n' : 'd', hm(secs), hm(goal),
  ].join('|');
  if (key === shown) return;
  shown = key;
  host.classList.toggle('dc-empty', !l);

  /* left: the unit, its sign, this lesson's checkpoints, the step being read */
  els.unitNum.textContent = g ? p2(gi + 1) : '';
  els.unitName.textContent = g ? g.label : '';
  const ja = g ? unitSign(g.id) : SIGNS.brand;
  els.ja.textContent = ja;
  els.ja.style.setProperty('--len', String(ja.length));
  els.stop.textContent = l ? l.n : '';
  const grew = litFor === id ? lit : have;        // only a checkpoint reached while you watch flashes
  els.lessonSegs.style.setProperty('--n', String(Math.max(1, cps.length)));
  els.lessonSegs.innerHTML = cps.length
    ? cps.map((c, i) => `<i class="${c.done ? 'on' : ''}${c.done && have > grew && i >= grew ? ' just' : ''}" style="--i:${i}" title="${esc(c.title)}"></i>`).join('')
    : '<i class="none" style="--i:0"></i>';
  litFor = id; lit = have;
  els.lessonHave.textContent = cps.length ? `${have}/${cps.length}` : '0';
  els.lessonWord.textContent = cps.length === 1 ? 'checkpoint' : 'checkpoints';
  els.col.classList.toggle('full', cps.length > 0 && have === cps.length);
  els.stepK.textContent = step && step.n ? step.kind : 'intro';
  els.stepNum.textContent = step ? `${p2(step.n)}/${p2(step.of)}` : '';
  els.stepName.textContent = step && step.n ? step.title : l ? l.title : '';
  els.step.dataset.kind = step && step.n ? step.kind : 'read';

  /* right: tonight, the course's twelve units, the lesson after this one */
  els.nightK.textContent = night ? 'tonight' : 'today';
  els.nightNum.textContent = hm(secs);
  els.nightOf.textContent = `of ${hm(goal)}`;
  els.nightBar.style.width = `${(Math.min(1, secs / Math.max(1, goal)) * 100).toFixed(1)}%`;
  els.courseSegs.style.setProperty('--n', String(units.length));
  els.courseSegs.innerHTML = units.map((u, i) => {
    const f = u.total ? u.have / u.total : 0;
    return `<i class="${f >= 1 ? 'on' : f > 0 ? 'part' : ''}${i === gi ? ' here' : ''}" style="--i:${i};--f:${f.toFixed(3)}" title="${esc(`${p2(u.n)} ${u.label}: ${u.have} of ${u.total}`)}"></i>`;
  }).join('');
  els.courseUnit.textContent = g ? `${p2(gi + 1)}/${p2(units.length)}` : '';
  els.courseHave.textContent = `${allHave}/${all}`;
  els.nextK.textContent = next ? 'next' : 'last stop';
  els.nextNum.textContent = next ? next.n : l ? l.n : '';
  els.nextName.textContent = next ? next.title : l ? l.title : '';
}

const later = () => { if (!raf) raf = requestAnimationFrame(paint); };

/** The wall's signs: nine soft screens and their streaks on the ground. One layer, drawn by CSS. */
function mountWallSigns() {
  const wall = document.getElementById('wall');
  if (!wall || wall.querySelector('.wall-signs')) return;
  const layer = document.createElement('div');
  layer.className = 'wall-signs';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = Array.from({ length: WALL_SIGNS }, (_, i) => `<i class="wsn s${i + 1}"></i>`).join('')
    + Array.from({ length: WALL_STREAKS }, (_, i) => `<i class="wst r${i + 1}"></i>`).join('');
  wall.insertBefore(layer, wall.querySelector('.wall-noise'));
}

export function mountDistrict() {
  mountWallSigns();
  const study = document.getElementById('study');
  const stage = study && study.querySelector('.rd-stage');
  if (!stage) return null;
  host = document.createElement('div');
  host.className = 'dc-signs';
  host.setAttribute('aria-hidden', 'true');
  host.innerHTML = skeleton();
  study.insertBefore(host, stage);
  const q = sel => host.querySelector(sel);
  els = {
    unitNum: q('.dc-unit .dc-num'), unitName: q('.dc-unit .dc-name'), ja: q('.dc-l .dc-vsign'),
    col: q('.dc-lesson'), stop: q('.dc-lesson .dc-cap b'), lessonSegs: q('.dc-lesson .dc-segs'),
    lessonHave: q('.dc-lesson .dc-foot b'), lessonWord: q('.dc-lesson .dc-foot span'),
    step: q('.dc-step'), stepK: q('.dc-step .dc-k'), stepNum: q('.dc-step .dc-num'), stepName: q('.dc-step .dc-name'),
    nightK: q('.dc-night .dc-k'), nightNum: q('.dc-night .dc-num'), nightOf: q('.dc-night .dc-name'), nightBar: q('.dc-night .dc-bar i'),
    courseSegs: q('.dc-course .dc-segs'), courseUnit: q('.dc-course .dc-cap b'), courseHave: q('.dc-course .dc-foot b'),
    nextK: q('.dc-next .dc-k'), nextNum: q('.dc-next .dc-num'), nextName: q('.dc-next .dc-name'),
  };
  onLesson(later);
  onQuest(later);
  onPaint(later);
  onNights(later);
  onWM(() => { if (activeWs() === 2) later(); });
  paint();
  return host;
}

/** What the tests read: the lesson's column, the course's, and whether the stacks are standing. */
export const districtReport = () => {
  if (!host) return { mounted: false };
  const inner = host.querySelector('.dc-in');
  const standing = !!inner && activeWs() === 2 && getComputedStyle(inner).display !== 'none' && +getComputedStyle(host).opacity > .5;
  return {
    mounted: true,
    standing,
    lesson: { id: litFor, lit: host.querySelectorAll('.dc-lesson .dc-segs i.on').length, of: host.querySelectorAll('.dc-lesson .dc-segs i:not(.none)').length },
    course: { units: host.querySelectorAll('.dc-course .dc-segs i').length, full: host.querySelectorAll('.dc-course .dc-segs i.on').length, text: els.courseHave.textContent },
    wall: document.querySelectorAll('#wall .wall-signs .wsn').length,
  };
};
