/* ════════════════════════════════════════════════════════════════════════════
   MIMEI · DATA/SIGNS
   The district's signs (workspaces 2 and 3, moodboard/v11-district). Each unit's
   name as a street sign in the city would write it, set top to bottom beside
   the English. They are ornament with a real meaning: the plain-English name
   is always on screen next to them, and a screen reader never hears them.

   The sign face (assets/fonts/mplus-rounded-1c-signs.woff2) holds only the
   glyphs in this file. After changing a word here, rebuild it:
       python3 tools/signfont.py --src MPLUSRounded1c-ExtraBold.ttf
   ════════════════════════════════════════════════════════════════════════════ */

/** A unit (GROUPS id) to its sign. */
export const UNIT_SIGNS = {
  g1: '準備',                    // set up: getting ready
  g2: '変数',                    // variables
  g3: '条件分岐',                // decisions: branching on a condition
  g4: '繰り返し',                // loops: repeating
  g5: '関数',                    // functions
  g6: 'テーブル',                // tables
  g7: '世界',                    // the world
  g8: 'イベント',                // events
  g9: 'プレイヤー',              // players
  g10: 'クライアントとサーバー',  // client and server
  g11: '整理と保存',             // organising and saving
  g12: '最終制作',               // the hero project: the final build
};

/** The fixed signs. */
export const SIGNS = {
  brand: '未明',       // mimei: the hour before dawn
  lesson: '授業',      // a lesson
  manual: '説明書',    // the manual
  course: '進捗',      // progress through the course
  done: '完了',        // complete
};

export const unitSign = g => UNIT_SIGNS[g] || SIGNS.brand;
