/* ─────────────────────────────────────────
   src/ui/router.js
   Screen switching + bottom nav
───────────────────────────────────────── */

const screens = document.querySelectorAll('.screen');
const navBtns = document.querySelectorAll('.nav-btn');
const bottomNav = document.getElementById('bottomNav');

function showScreen(id) {
  screens.forEach(s => s.classList.toggle('active', s.id === 'screen-' + id));
  navBtns.forEach(b => b.classList.toggle('active', b.dataset.screen === id));

  // hide nav while playing so it doesn't eat game space
  bottomNav.style.display = id === 'game' ? 'none' : 'flex';

  if (id === 'home')        renderHome();
  if (id === 'leaderboard') renderLeaderboard();
  if (id === 'profile')     renderProfile();
  if (id === 'multiplayer') renderMultiplayer();
  if (id === 'game') {
    // if no game is running, show the start prompt so canvas isn't black
    if (typeof running !== 'undefined' && !running) {
      const so = document.getElementById('startOverlay');
      const go = document.getElementById('gameOverOverlay');
      if (so && go && go.style.display === 'none') so.style.display = 'grid';
    }
    setTimeout(() => { if (typeof resizeCanvas === 'function') resizeCanvas(); }, 50);
  }
}

navBtns.forEach(btn => btn.addEventListener('click', () => { initAudio(); playClick(); showScreen(btn.dataset.screen); }));
