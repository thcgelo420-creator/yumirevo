/* ════════════════════════════════════════════════════════════════════════════
   MIMEI · UI/DISTRICT
   Workspaces 2 and 3 are down in the city the desk looks over (moodboard/
   v11-district/BUILD.md). This file puts the wall's signs there: out-of-focus
   screens and their reflections on the wet ground, behind every pane on
   workspaces 2, 3 and 4. CSS draws them (styles/44-neon.css); this only puts
   the layer in #wall.

   The lesson's margins held two stacks of signs for one round. The owner took
   them out: the margins belong to the city.
   ════════════════════════════════════════════════════════════════════════════ */

const WALL_SIGNS = 9, WALL_STREAKS = 6;

/** The wall's signs: nine soft screens and their streaks on the ground. One layer, drawn by CSS. */
export function mountDistrict() {
  const wall = document.getElementById('wall');
  if (!wall || wall.querySelector('.wall-signs')) return;
  const layer = document.createElement('div');
  layer.className = 'wall-signs';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = Array.from({ length: WALL_SIGNS }, (_, i) => `<i class="wsn s${i + 1}"></i>`).join('')
    + Array.from({ length: WALL_STREAKS }, (_, i) => `<i class="wst r${i + 1}"></i>`).join('');
  wall.insertBefore(layer, wall.querySelector('.wall-noise'));
}

/** What the tests read: how many signs are on the wall. */
export const districtReport = () => ({ wall: document.querySelectorAll('#wall .wall-signs .wsn').length });
