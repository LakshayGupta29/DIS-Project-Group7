/* ─────────────────────────────────────────
   src/ui/home.js
   Home screen rendering + button wiring
   Depends on: router.js, scores.js
───────────────────────────────────────── */

function renderHome() {
  const best    = getBest();
  const games   = getScores().length;
  const board   = getGlobalBoard();
  const profile = getProfile();
  const myEntry = board.find(e => e.name === profile.name);
  const rank    = myEntry ? board.indexOf(myEntry) + 1 : '—';

  document.getElementById('homeBest').textContent  = best  || '—';
  document.getElementById('homeGames').textContent = games || '—';
  document.getElementById('homeRank').textContent  = rank;
}

document.getElementById('homePlayBtn').addEventListener('click',    () => { initAudio(); playConfirm(); showScreen('game'); });
document.getElementById('homeProfileBtn').addEventListener('click', () => { initAudio(); playClick();   showScreen('profile'); });
