/* proto/v14 · the real lesson 2.1, and a demo stand-in for its progress */
export async function loadLesson(doc) {
  doc.innerHTML = await (await fetch('doc.html')).text();
  const k = doc.querySelector('.kicker');
  if (k) k.innerHTML = '<span>Lesson 2.1</span><span class="s">·</span><span class="p">Variables</span>';
  const steps = [...doc.querySelectorAll('.step[data-step]')].map(s => ({ n: +s.dataset.step, el: s, title: (s.querySelector(':scope > h2') || {}).textContent || 'Introduction' }));
  const cps = [...doc.querySelectorAll('.runbook[data-cp]')].map(el => ({ goal: +el.dataset.cp, el, step: +el.closest('.step').dataset.step }));
  return { steps, cps };
}
/** Mark the first n checkpoints reached (runbooks ticked), the rest open. */
export function setReached(cps, n) {
  cps.forEach((c, i) => {
    const on = i < n;
    c.el.classList.toggle('done', on);
    c.el.querySelectorAll('.checks li').forEach(li => li.setAttribute('aria-checked', on ? 'true' : 'false'));
    const m = c.el.querySelector('.meter i'); if (m) m.style.width = on ? '100%' : '0%';
    const h = c.el.querySelector('.hint'); if (h) h.textContent = on ? 'Checkpoint reached' : `0 of ${c.el.querySelectorAll('.checks li').length} done`;
  });
}
/** The demo panel: "checkpoints reached: 0 1 2 3". */
export function demoPanel(total, start, onPick) {
  const d = document.createElement('div');
  d.className = 'demo';
  d.innerHTML = `<span>Demo · checkpoints</span>${Array.from({ length: total + 1 }, (_, i) => `<button type="button" data-n="${i}">${i}</button>`).join('')}`;
  const paint = n => d.querySelectorAll('button').forEach(b => b.classList.toggle('on', +b.dataset.n === n));
  d.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { paint(+b.dataset.n); onPick(+b.dataset.n); } });
  paint(start);
  document.body.appendChild(d);
  return d;
}
/** The step at the reading line (a fraction of the viewport height). */
export function stepAt(steps, line) {
  let here = steps[0];
  for (const s of steps) if (s.el.getBoundingClientRect().top <= line) here = s;
  return here;
}
