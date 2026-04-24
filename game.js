/*
  main.js — Entry point
  Loads all modules in dependency order via index.html <script> tags.
  This file intentionally contains no logic — see src/ for all modules.

  Load order (defined in index.html):
    src/data/db.js
    src/data/scores.js
    src/game/utils.js
    src/game/state.js
    src/game/entities.js
    src/game/patterns.js
    src/game/renderer.js
    src/game/input.js
    src/game/loop.js
    src/game/game.js
    src/ui/router.js
    src/ui/home.js
    src/ui/leaderboard.js
    src/ui/profile.js
    main.js  ← app bootstrap (below)
*/

// ── App bootstrap ────────────────────────────────────────────────────────────

// Called by game/game.js (showGameOver) after each game ends
function onGameOver(finalScore) {
  const profile = getProfile();
  const prevBest = getBest();

  addScore(finalScore);
  updateGlobalBoard(profile.name, profile.avatar, finalScore);

  const newBestMsg = document.getElementById('newBestMsg');
  if (newBestMsg) {
    const isNewBest = finalScore > prevBest;
    newBestMsg.style.display = isNewBest ? '' : 'none';
    if (isNewBest) playNewBest();
  }
}

// Game-screen back button
document.getElementById('gameBackBtn').addEventListener('click', () => {
  running = false;
  firing = false;
  pressedKeys.clear();
  playBack();
  // reset overlays so the screen isn't black next time Play is clicked
  gameOverOverlay.style.display = 'none';
  startOverlay.style.display    = 'grid';
  showScreen('home');
});

// Game-over "Home" button
document.getElementById('goHomeBtn').addEventListener('click', () => {
  playClick();
  showScreen('home');
});

// Start on home screen
showScreen('home');

// Claim name in Firebase on load (so others can find/verify this player)
// Small delay to let Firebase init via multiplayer.js
setTimeout(() => {
  const profile = getProfile();
  claimName(profile.name, profile.avatar);
}, 1500);

// If opened via an invite link, auto-add as friend (bidirectional via Firebase)
const inviteParam = new URLSearchParams(location.search).get('invite');
if (inviteParam) {
  const inviterName = decodeURIComponent(inviteParam);
  showScreen('profile');
  // Wait for Firebase to be ready before processing
  setTimeout(() => handleInviteParam(inviterName), 1800);
}

// If opened via a multiplayer match link, auto-join
const mpParam = new URLSearchParams(location.search).get('mp');
if (mpParam) {
  showScreen('multiplayer');
  setTimeout(() => {
    if (typeof mpJoinMatch === 'function') mpJoinMatch(mpParam);
  }, 300);
}
