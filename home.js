/* ─────────────────────────────────────────
   src/game/game.js
   Game lifecycle: reset, game-over, resize,
   control-mode toggle, button wiring
   Depends on: state.js, input.js, loop.js
───────────────────────────────────────── */

function resizeCanvas() {
  const prevW = canvas.width  || 1;
  const prevH = canvas.height || 1;
  canvas.width  = Math.max(320, Math.floor(board.clientWidth));
  canvas.height = Math.max(200, Math.floor(board.clientHeight));
  player.x = clamp((player.x / prevW) * canvas.width,  player.radius, canvas.width  - player.radius);
  player.y = clamp((player.y / prevH) * canvas.height, player.radius, canvas.height - player.radius);
}

function resetGame() {
  asteroids = []; aliens = []; coins = []; powerups = []; bullets = []; alienBullets = []; weaponPickups = []; explosions = [];
  score = 0; lives = 1; level = 1;
  asteroidInterval = 1500; levelTimer = 0; asteroidTimer = 0;
  alienTimer = 0; powerupTimer = 0; spawnPatternTimer = 0;
  patternWarning = false; patternWarningTimer = 0;
  gameTimer = 0;
  shieldActive = false; shieldTimer = 0;
  gestureCooldown = 0; hitFlash = 0; firing = false;
  weaponType = 'twin_diagonal';
  blastShake = 0; blastShakeX = 0; blastShakeY = 0;
  nextPatternGroupId = 1;
  for (const k in activePatternGroups) delete activePatternGroups[k];

  player.x = canvas.width  * 0.5;
  player.y = canvas.height * 0.75;
  keyboardAnchor.x = player.x;
  keyboardAnchor.y = player.y;
  keyboardActive = false;
  faceVisible = true;

  running = true;
  lastTime = performance.now();
  frameCount = 0;

  gameOverOverlay.style.display = 'none';
  startOverlay.style.display    = 'none';
  calibrationEl.textContent = controlMode === 'camera'
    ? 'Tracking... keep your head visible.'
    : 'Keyboard mode — Arrow keys / WASD to move, Space to fire.';

  if (controlMode === 'camera' && !cameraInitialized) {
    cameraInitialized = true;
    setupFaceMesh();
  }

  initAudio();
  playGameStart();
  startBgMusic();
  requestAnimationFrame(loop);
}

function showGameOver() {
  document.getElementById('finalScore').textContent = `Score: ${score}`;
  gameOverOverlay.style.display = 'grid';
  calibrationEl.textContent = 'Game over. Restart to try again.';
  stopBgMusic();
  stopWindSound();
  playGameOver();
  if (typeof onGameOver === 'function') onGameOver(score);
}

// ── Control mode toggle ──────────────────

function setControlMode(mode) {
  controlMode = mode;
  document.getElementById('btnCamera').classList.toggle('active',   mode === 'camera');
  document.getElementById('btnKeyboard').classList.toggle('active', mode === 'keyboard');

  const badge = document.getElementById('headerBadge');
  const sub   = document.getElementById('headerSub');
  const desc  = document.getElementById('startDesc');

  if (mode === 'camera') {
    badge.textContent = 'Head-Tracked';
    sub.textContent   = 'Move your head to dodge.';
    if (desc) desc.textContent = 'Keep your head visible to steer. Pinch fingers to toggle firing.';
    trackStatus.style.display = '';
    if (!cameraInitialized) { cameraInitialized = true; setupFaceMesh(); }
  } else {
    badge.textContent = 'Keyboard Mode';
    sub.textContent   = 'Arrow / WASD · Space to fire.';
    if (desc) desc.textContent = 'Arrow keys or WASD to move. Space or Backspace to toggle firing.';
    trackStatus.style.display = 'none';
    faceVisible = false;
    handPinch   = false;
  }
}

// ── Button wiring ────────────────────────

document.getElementById('startBtn').addEventListener('click',   resetGame);
document.getElementById('restartBtn').addEventListener('click', resetGame);
document.getElementById('btnCamera').addEventListener('click',   () => setControlMode('camera'));
document.getElementById('btnKeyboard').addEventListener('click', () => setControlMode('keyboard'));

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
