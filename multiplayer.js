/* ─────────────────────────────────────────
   src/game/loop.js
   Main game loop + player movement
   Depends on: state.js, utils.js, entities.js,
               patterns.js, renderer.js
───────────────────────────────────────── */

function loop(ts) {
  if (!running) return;
  const dt = ts - lastTime;
  lastTime = ts;
  frameCount++;

  gestureCooldown = Math.max(0, gestureCooldown - dt);
  hitFlash        = Math.max(0, hitFlash - dt);
  if (frameCount % 10 === 0) fps = 1000 / dt;

  // level up every 15 s (solo only)
  if (!mpActive) {
    levelTimer += dt;
    if (levelTimer > 15000) { levelTimer = 0; level += 1; playLevelUp(); }
  }

  // ── Player movement ──────────────────
  let moveX = 0, moveY = 0;
  if (pressedKeys.has('a') || pressedKeys.has('arrowleft'))  moveX -= 1;
  if (pressedKeys.has('d') || pressedKeys.has('arrowright')) moveX += 1;
  if (pressedKeys.has('w') || pressedKeys.has('arrowup'))    moveY -= 1;
  if (pressedKeys.has('s') || pressedKeys.has('arrowdown'))  moveY += 1;
  keyboardActive = moveX !== 0 || moveY !== 0;

  const _prevPlayerX = player.x;
  const _prevPlayerY = player.y;

  if (controlMode === 'keyboard') {
    if (keyboardActive) {
      const len = Math.hypot(moveX, moveY) || 1;
      player.x += (moveX / len) * KEYBOARD_MOVE_SPEED * (dt / 1000);
      player.y += (moveY / len) * KEYBOARD_MOVE_SPEED * (dt / 1000);
    }
    keyboardAnchor.x = player.x;
    keyboardAnchor.y = player.y;
  } else {
    if (keyboardActive) {
      const len = Math.hypot(moveX, moveY) || 1;
      player.x += (moveX / len) * KEYBOARD_MOVE_SPEED * (dt / 1000);
      player.y += (moveY / len) * KEYBOARD_MOVE_SPEED * (dt / 1000);
      keyboardAnchor.x = player.x;
      keyboardAnchor.y = player.y;
    } else if (faceVisible) {
      player.x = lerp(player.x, filteredFacePos.x * canvas.width,  0.25);
      player.y = lerp(player.y, filteredFacePos.y * canvas.height, 0.25);
      keyboardAnchor.x = player.x;
      keyboardAnchor.y = player.y;
    }
  }

  player.x = clamp(player.x, player.radius, canvas.width  - player.radius);
  player.y = clamp(player.y, player.radius, canvas.height - player.radius);

  // wind sound — only during gameplay, based on actual pixel displacement this frame
  if (running) {
    const _moved = Math.hypot(player.x - _prevPlayerX, player.y - _prevPlayerY);
    const _maxMove = KEYBOARD_MOVE_SPEED * (dt / 1000);
    updateWindSound(_maxMove > 0 ? Math.min(1, _moved / _maxMove) : 0);
  }

  prevFace.x = filteredFacePos.x;
  prevFace.y = filteredFacePos.y;

  // ── Shield countdown ─────────────────
  if (shieldActive) {
    shieldTimer -= dt / 1000;
    if (shieldTimer <= 0) { shieldActive = false; shieldTimer = 0; playShieldExpire(); }
  }

  // ── Update entities ──────────────────
  updatePattern(dt);
  updatePatternGroups(dt);
  updateAsteroids(dt);
  updateAliens(dt);
  updatePowerups(dt);
  updateCoins(dt);
  updateWeaponPickups(dt);
  updateBullets(dt);
  updateAlienBullets(dt);
  updateExplosions(dt);

  // ── Draw ─────────────────────────────
  ctx.save();
  // combine hit-flash shake and blast shake
  const shakeX = (hitFlash > 0 ? (Math.random() - 0.5) * (hitFlash / 320) * 4 : 0) + blastShakeX;
  const shakeY = (hitFlash > 0 ? (Math.random() - 0.5) * (hitFlash / 320) * 4 : 0) + blastShakeY;
  if (shakeX !== 0 || shakeY !== 0) ctx.translate(shakeX, shakeY);
  drawStarfield();
  drawPatternWarning();
  drawPowerups();
  drawWeaponPickups();
  drawCoins();
  drawAsteroids();
  drawAliens();
  drawExplosions();
  drawBullets();
  drawAlienBullets();
  drawAstronaut();
  ctx.restore();

  if (hitFlash > 0) {
    ctx.fillStyle = `rgba(255,80,80,${0.35 * (hitFlash / 320)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  updateHUD();
  requestAnimationFrame(loop);
}
