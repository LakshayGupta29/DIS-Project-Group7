/* ─────────────────────────────────────────
   src/game/renderer.js
   Background, player, HUD, pattern warning
   Depends on: state.js, utils.js
───────────────────────────────────────── */

function drawStarfield() {
  if (backgroundReady) {
    const maxX = 24, maxY = 14;
    const normX = (filteredFacePos.x - 0.5) * 2;
    const normY = (filteredFacePos.y - 0.5) * 2;
    ctx.drawImage(backgroundImg,
      -maxX + (-normX * maxX), -maxY + (-normY * maxY),
      canvas.width + maxX * 2, canvas.height + maxY * 2);
    return;
  }
  ctx.fillStyle = '#050915';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  for (let i = 0; i < 40; i++) {
    ctx.fillRect((i * 53 + frameCount * 0.7) % canvas.width, (i * 97 + frameCount * 1.3) % canvas.height, 2, 2);
  }
}

function drawAstronaut() {
  const r = player.radius;
  const w = r * ASTRONAUT_DRAW_SCALE;
  const h = r * ASTRONAUT_DRAW_SCALE;
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(0, r * 1.2, r * 1.25, r * 0.5, 0, 0, Math.PI * 2); ctx.fill();
  if (astronautReady) {
    ctx.drawImage(astronautImg, -w * 0.5, -h * 0.7, w, h);
  } else {
    ctx.fillStyle = '#5cf0ff'; ctx.shadowColor = '#5cf0ff'; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawPatternWarning() {
  if (!patternWarning) return;
  const pulse = 0.25 + Math.abs(Math.sin(patternWarningTimer * 0.012));
  ctx.save();
  ctx.strokeStyle = `rgba(255,130,70,${0.25 + pulse * 0.15})`;
  ctx.lineWidth = 12;
  ctx.setLineDash([24, 18]);
  ctx.lineDashOffset = (frameCount * 2) % 42;
  ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
  ctx.restore();
}

function updateHUD() {
  hudScore.textContent = `Score: ${score}`;
  hudLives.textContent = `Lives: ${lives}`;
  hudLevel.textContent = `Level: ${level}`;
  fpsEl.textContent    = `FPS: ${fps.toFixed(0)}`;
  hudPower.textContent = shieldActive ? `Shield: ${shieldTimer.toFixed(1)}s` : 'Power: collect orbs';
  hudFire.textContent  = firing ? `🔥 ${WEAPON_COLORS[weaponType].label}` : `Weapon: ${WEAPON_COLORS[weaponType].label}`;
}
