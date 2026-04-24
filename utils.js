/* ─────────────────────────────────────────
   src/game/entities.js
   Spawn / update / draw for all game entities:
   asteroids, aliens, bullets, coins, powerups
   Depends on: state.js, utils.js
───────────────────────────────────────── */

// ── Helpers ──────────────────────────────

function pickRandomLoadedAsteroidImage() {
  const ready = asteroidImages.filter(img => img.complete && img.naturalWidth > 0);
  return ready.length ? ready[Math.floor(Math.random() * ready.length)] : null;
}

function createRock(size) {
  const sides = 6 + Math.floor(Math.random() * 5);
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
    const radius = size * (0.7 + Math.random() * 0.4);
    points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
  }
  const craters = Array.from({ length: 2 + Math.floor(Math.random() * 3) }, () => {
    const r = size * 0.12 + Math.random() * size * 0.12;
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * size * 0.4;
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, r };
  });
  return { points, craters, rotation: Math.random() * Math.PI * 2, rotationSpeed: (Math.random() * 0.6 - 0.3) * 0.6, hue: 18 + Math.random() * 12 };
}

// ── Asteroids ────────────────────────────

function spawnAsteroidAt(x, options = {}) {
  const speed  = 40 + level * 12 + Math.random() * 25;
  const size   = 24 + Math.random() * 36;
  const image  = options.image || pickRandomLoadedAsteroidImage();
  const shape  = createRock(size);
  const targetX = options.targetX !== undefined ? options.targetX * canvas.width  : x;
  const targetY = options.targetY !== undefined ? options.targetY * canvas.height : -size;
  // Always spawn from top; for pattern entries slide down from above
  const startX  = options.side ? targetX : x;
  const startY  = options.side ? -size * 1.5 : targetY;
  const vy      = options.side ? 220 + Math.random() * 40 : 0;
  const health  = Math.max(2, Math.ceil((size - 20) / 16)) + Math.floor(level / 2);
  asteroids.push({ x: startX, y: startY, speed, size, image, targetX, targetY, vx: 0, vy,
    health, maxHealth: health, damageTaken: 1,
    state: options.side ? 'forming' : 'moving', holdTimer: 0,
    groupId: options.groupId, readyReported: false, ...shape });
}

function updateAsteroids(dt) {
  asteroidTimer = 0;
  for (let i = asteroids.length - 1; i >= 0; i--) {
    const a = asteroids[i];
    const group = a.groupId ? activePatternGroups[a.groupId] : null;

    if (a.state === 'forming' && a.targetY !== undefined) {
      const dy = a.targetY - a.y;
      a.y += Math.sign(dy) * Math.min(Math.abs(a.vy) * (dt / 1000), Math.abs(dy));
      if (Math.abs(dy) < 4) {
        a.state = 'ready'; a.vy = 0;
        if (group && !a.readyReported) { a.readyReported = true; group.readyCount += 1; }
      }
    } else if (a.state === 'ready') {
      if (group && group.state === 'released') a.state = 'formed';
    } else {
      a.x += (player.x - a.x) * 0.0025;
      a.y += a.speed * (dt / 1000);
    }

    if (a.state === 'forming' || a.state === 'ready') {
      // hold X at target while forming
      a.x = a.targetX;
    }
    a.rotation += a.rotationSpeed * (dt / 1000);

    const distSq = (a.x - player.x) ** 2 + (a.y - player.y) ** 2;
    if (distSq < (a.size + player.radius) ** 2) {
      spawnExplosion(a.x, a.y, a.size);
      if (group) { group.total = Math.max(0, group.total - 1); }
      asteroids.splice(i, 1);
      if (!shieldActive) { lives -= 1; hitFlash = 320; playPlayerHit(); if (lives <= 0) { running = false; showGameOver(); } }
      continue;
    }
    if (a.y - a.size > canvas.height) {
      asteroids.splice(i, 1);
      score += 1;
      // notify group so it can clean up
      if (group) { group.total = Math.max(0, group.total - 1); }
    }
  }
}

function drawAsteroids() {
  for (const a of asteroids) {
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.rotate(a.rotation);

    if (a.image && a.image.complete && a.image.naturalWidth > 0) {
      const maxD = a.size * 3;
      const aspect = a.image.naturalWidth / a.image.naturalHeight;
      const dW = aspect > 1 ? maxD : maxD * aspect;
      const dH = aspect > 1 ? maxD / aspect : maxD;
      ctx.drawImage(a.image, -dW * 0.5, -dH * 0.5, dW, dH);
      ctx.restore();
      _drawHealthBar(a.x, a.y - a.size - 10, a.size * 1.6, a.health, a.maxHealth);
      continue;
    }

    const grad = ctx.createLinearGradient(-a.size, -a.size, a.size, a.size);
    grad.addColorStop(0,    `hsl(${a.hue},40%,22%)`);
    grad.addColorStop(0.55, `hsl(${a.hue},50%,35%)`);
    grad.addColorStop(1,    `hsl(${a.hue},55%,48%)`);
    ctx.fillStyle = grad;
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(a.points[0].x, a.points[0].y);
    for (let i = 1; i < a.points.length; i++) ctx.lineTo(a.points[i].x, a.points[i].y);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    ctx.strokeStyle = `hsla(${a.hue},70%,75%,0.65)`;
    ctx.beginPath();
    ctx.moveTo(a.points[0].x, a.points[0].y);
    for (let i = 1; i < a.points.length; i++) ctx.lineTo(a.points[i].x, a.points[i].y);
    ctx.closePath(); ctx.stroke();

    for (const c of a.craters) {
      ctx.fillStyle = `hsla(${a.hue},30%,18%,0.55)`;
      ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `hsla(${a.hue},40%,55%,0.6)`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(c.x - c.r * 0.25, c.y - c.r * 0.25, c.r * 0.6, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
    _drawHealthBar(a.x, a.y - a.size - 10, a.size * 1.6, a.health, a.maxHealth);
  }
}

// ── Aliens ───────────────────────────────

function spawnAlienAt(x, options = {}) {
  const speed   = 30 + level * 10 + Math.random() * 18;
  const size    = ALIEN_FIXED_SIZE;
  const targetX = options.targetX !== undefined ? options.targetX * canvas.width  : x;
  const targetY = options.targetY !== undefined ? options.targetY * canvas.height : -size;
  // Always spawn from top; for pattern entries slide down from above
  const startX  = options.side ? targetX : x;
  const startY  = options.side ? -size * 1.5 : targetY;
  const vy      = options.side ? 180 + Math.random() * 40 : 0;
  const health  = 2 + Math.floor(level / 2);
  aliens.push({ x: startX, y: startY, speed, size, phase: Math.random() * Math.PI * 2,
    wobble: 30 + Math.random() * 25, targetX, targetY, vx: 0, vy,
    health, maxHealth: health, damageTaken: 0.75,
    state: options.side ? 'forming' : 'moving', holdTimer: 0,
    groupId: options.groupId, readyReported: false });
}

function updateAliens(dt) {
  alienTimer = 0;
  for (let i = aliens.length - 1; i >= 0; i--) {
    const a = aliens[i];
    const group = a.groupId ? activePatternGroups[a.groupId] : null;
    a.phase += dt * 0.005;

    if (a.state === 'forming' && a.targetY !== undefined) {
      const dy = a.targetY - a.y;
      a.y += Math.sign(dy) * Math.min(Math.abs(a.vy) * (dt / 1000), Math.abs(dy));
      if (Math.abs(dy) < 4) {
        a.state = 'ready'; a.vy = 0;
        if (group && !a.readyReported) { a.readyReported = true; group.readyCount += 1; }
      }
    } else if (a.state === 'ready') {
      if (group && group.state === 'released') a.state = 'formed';
    } else {
      a.x += Math.sin(a.phase) * (a.wobble * dt / 1000) + (player.x - a.x) * 0.0045;
      a.y += a.speed * (dt / 1000);
    }

    if (a.state === 'forming' || a.state === 'ready') {
      // hold X at target while forming
      a.x = a.targetX;
    }

    // occasionally fire at player
    if (a.state === 'formed' || (a.state !== 'forming' && a.state !== 'ready')) {
      maybeFireAlienBullet(a);
    }

    const distSq = (a.x - player.x) ** 2 + (a.y - player.y) ** 2;
    if (distSq < (a.size + player.radius * 0.85) ** 2) {
      spawnExplosion(a.x, a.y, a.size * 2.2);
      if (group) { group.total = Math.max(0, group.total - 1); }
      aliens.splice(i, 1);
      if (!shieldActive) { lives -= 1; hitFlash = 320; playPlayerHit(); if (lives <= 0) { running = false; showGameOver(); } }
      continue;
    }
    if (a.y - a.size > canvas.height) {
      // notify group so it can clean up
      if (group) { group.total = Math.max(0, group.total - 1); }
      aliens.splice(i, 1);
    }
  }
}

// ── Alien Bullets ────────────────────────

function maybeFireAlienBullet(alien) {
  // Only fire when player is ahead (below) the alien — not after it has passed
  if (player.y < alien.y) return;
  // ~0.4% chance per frame per alien — very occasional
  if (Math.random() > 0.004) return;
  const angle = Math.atan2(player.y - alien.y, player.x - alien.x);
  alienBullets.push({
    x: alien.x,
    y: alien.y + alien.size,
    vx: Math.cos(angle) * 180,
    vy: Math.sin(angle) * 180,
    radius: 10,
    life: 3.5,
  });
  playFireAlienBullet();
}

function updateAlienBullets(dt) {
  for (let i = alienBullets.length - 1; i >= 0; i--) {
    const b = alienBullets[i];
    b.x += b.vx * (dt / 1000);
    b.y += b.vy * (dt / 1000);
    b.life -= dt / 1000;
    if (b.life <= 0 || b.y > canvas.height + 20 || b.x < -20 || b.x > canvas.width + 20) {
      alienBullets.splice(i, 1); continue;
    }
    // hit player
    if (!shieldActive && (b.x - player.x) ** 2 + (b.y - player.y) ** 2 < (b.radius + player.radius) ** 2) {
      alienBullets.splice(i, 1);
      lives -= 1; hitFlash = 320; playPlayerHit();
      if (lives <= 0) { running = false; showGameOver(); }
    }
  }
}

function drawAlienBullets() {
  for (const b of alienBullets) {
    ctx.save();
    ctx.translate(b.x, b.y);

    // outer glow
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, b.radius * 3);
    glow.addColorStop(0, 'rgba(255,80,180,0.7)');
    glow.addColorStop(1, 'rgba(255,80,180,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, b.radius * 3, 0, Math.PI * 2); ctx.fill();

    // core
    ctx.fillStyle = '#ff50b4';
    ctx.beginPath(); ctx.arc(0, 0, b.radius, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, b.radius * 0.45, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  }
}

function drawAliens() {
  for (const a of aliens) {
    ctx.save();
    ctx.translate(a.x, a.y);
    const maxD = a.size * ALIEN_DRAW_SCALE;
    let w = maxD, h = maxD;
    if (alienReady && alienImg.naturalWidth > 0) {
      const asp = alienImg.naturalWidth / alienImg.naturalHeight;
      if (asp > 1) h = maxD / asp; else w = maxD * asp;
    }
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(0, h * 0.35, w * 0.45, h * 0.18, 0, 0, Math.PI * 2); ctx.fill();
    if (alienReady) {
      ctx.drawImage(alienImg, -w * 0.5, -h * 0.55, w, h);
    } else {
      const g = ctx.createLinearGradient(-a.size, -a.size, a.size, a.size);
      g.addColorStop(0, '#4ff1a0'); g.addColorStop(1, '#2fb4ff');
      ctx.fillStyle = g; ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(0, 0, a.size * 1.1, a.size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
    _drawHealthBar(a.x, a.y - a.size * 0.75 - 10, a.size * 1.4, a.health, a.maxHealth, 5);
  }
}

// ── Bullets / Weapons ────────────────────

function spawnBullet() {
  const px = player.x, py = player.y - player.radius - 6;

  if (weaponType === 'twin_diagonal') {
    // Two bullets spreading diagonally outward
    bullets.push({ x: px - 8, y: py, vx: -160, vy: -520, type: 'twin_diagonal', radius: 7, life: 1.4, age: 0 });
    bullets.push({ x: px + 8, y: py, vx:  160, vy: -520, type: 'twin_diagonal', radius: 7, life: 1.4, age: 0 });

  } else if (weaponType === 'plasma_lance') {
    // Single fat green needle
    bullets.push({ x: px, y: py, vx: 0, vy: -620, type: 'plasma_lance', radius: 5, length: 28, life: 1.2, age: 0 });

  } else if (weaponType === 'dual_beam') {
    // Two parallel straight beams
    bullets.push({ x: px - 10, y: py, vx: 0, vy: -560, type: 'dual_beam', radius: 5, life: 1.3, age: 0 });
    bullets.push({ x: px + 10, y: py, vx: 0, vy: -560, type: 'dual_beam', radius: 5, life: 1.3, age: 0 });
  }
}

function _bulletHitCheck(b) {
  for (let j = asteroids.length - 1; j >= 0; j--) {
    const a = asteroids[j];
    if ((b.x - a.x) ** 2 + (b.y - a.y) ** 2 < (b.radius + a.size) ** 2) {
      a.health -= a.damageTaken || 1;
      if (a.health <= 0) {
        const grp = a.groupId ? activePatternGroups[a.groupId] : null;
        if (grp) grp.total = Math.max(0, grp.total - 1);
        spawnExplosion(a.x, a.y, a.size); spawnCoin(a.x, a.y, 3); spawnWeaponPickup(a.x, a.y); playExplosionSmall(); asteroids.splice(j, 1);
      } else { playHit(); }
      return true;
    }
  }
  for (let j = aliens.length - 1; j >= 0; j--) {
    const a = aliens[j];
    if ((b.x - a.x) ** 2 + (b.y - a.y) ** 2 < (b.radius + a.size * 0.75) ** 2) {
      a.health -= a.damageTaken || 1;
      if (a.health <= 0) {
        const grp = a.groupId ? activePatternGroups[a.groupId] : null;
        if (grp) grp.total = Math.max(0, grp.total - 1);
        spawnExplosion(a.x, a.y, a.size * 2.2); spawnCoin(a.x, a.y, 6); spawnWeaponPickup(a.x, a.y); playExplosionLarge(); aliens.splice(j, 1);
      } else { playHit(); }
      return true;
    }
  }
  return false;
}

function updateBullets(dt) {
  bulletTimer += dt;
  if (firing && bulletTimer >= bulletInterval) {
    bulletTimer = 0; spawnBullet(); playFire();
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx * (dt / 1000);
    b.y += b.vy * (dt / 1000);
    b.age += dt / 1000;
    if (b.age >= b.life || b.y + b.radius < 0 || b.x < -20 || b.x > canvas.width + 20) {
      bullets.splice(i, 1); continue;
    }
    if (_bulletHitCheck(b)) { bullets.splice(i, 1); }
  }
}

function drawBullets() {
  for (const b of bullets) {
    ctx.save();
    if (b.type === 'twin_diagonal') {
      _drawTwinDiagonalBullet(b);
    } else if (b.type === 'plasma_lance') {
      _drawPlasmaLanceBullet(b);
    } else if (b.type === 'dual_beam') {
      _drawDualBeamBullet(b);
    }
    ctx.restore();
  }
}

// ── Bullet draw helpers ──────────────────

function _drawTwinDiagonalBullet(b) {
  // Teardrop shape pointing in direction of travel
  const angle = Math.atan2(b.vy, b.vx) + Math.PI / 2;
  ctx.translate(b.x, b.y);
  ctx.rotate(angle);

  // outer glow
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, b.radius * 3);
  glow.addColorStop(0, 'rgba(92,240,255,0.7)');
  glow.addColorStop(1, 'rgba(92,240,255,0)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(0, 0, b.radius * 3, 0, Math.PI * 2); ctx.fill();

  // teardrop body
  ctx.beginPath();
  ctx.moveTo(0, -b.radius * 2.2);
  ctx.bezierCurveTo(b.radius * 1.1, -b.radius * 0.8, b.radius * 1.1, b.radius * 0.6, 0, b.radius * 1.0);
  ctx.bezierCurveTo(-b.radius * 1.1, b.radius * 0.6, -b.radius * 1.1, -b.radius * 0.8, 0, -b.radius * 2.2);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, -b.radius * 2.2, 0, b.radius);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.3, '#9ef1ff');
  grad.addColorStop(1, 'rgba(92,240,255,0.3)');
  ctx.fillStyle = grad;
  ctx.fill();

  // inner lightning lines
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-b.radius * 0.3, -b.radius * 1.5);
  ctx.lineTo(b.radius * 0.1, -b.radius * 0.5);
  ctx.lineTo(-b.radius * 0.2, b.radius * 0.3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(b.radius * 0.3, -b.radius * 1.2);
  ctx.lineTo(-b.radius * 0.1, -b.radius * 0.3);
  ctx.lineTo(b.radius * 0.2, b.radius * 0.5);
  ctx.stroke();
}

function _drawPlasmaLanceBullet(b) {
  ctx.translate(b.x, b.y);
  const len = b.length || 28;

  // outer glow
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, b.radius * 3.5);
  glow.addColorStop(0, 'rgba(100,255,50,0.65)');
  glow.addColorStop(1, 'rgba(100,255,50,0)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(0, 0, b.radius * 3.5, 0, Math.PI * 2); ctx.fill();

  // needle trail
  const trail = ctx.createLinearGradient(0, 0, 0, len);
  trail.addColorStop(0, 'rgba(180,255,80,0.9)');
  trail.addColorStop(0.4, 'rgba(60,220,20,0.7)');
  trail.addColorStop(1, 'rgba(60,220,20,0)');
  ctx.fillStyle = trail;
  ctx.beginPath();
  ctx.moveTo(-b.radius * 0.6, 0);
  ctx.lineTo(b.radius * 0.6, 0);
  ctx.lineTo(0, len);
  ctx.closePath();
  ctx.fill();

  // bright head
  const head = ctx.createRadialGradient(0, 0, 0, 0, 0, b.radius * 1.4);
  head.addColorStop(0, '#ffffff');
  head.addColorStop(0.4, '#aaff44');
  head.addColorStop(1, 'rgba(80,220,0,0)');
  ctx.fillStyle = head;
  ctx.beginPath(); ctx.arc(0, 0, b.radius * 1.4, 0, Math.PI * 2); ctx.fill();
}

function _drawDualBeamBullet(b) {
  ctx.translate(b.x, b.y);
  const trailLen = 38;

  // beam trail
  const trail = ctx.createLinearGradient(0, 0, 0, trailLen);
  trail.addColorStop(0, 'rgba(92,200,255,0.85)');
  trail.addColorStop(1, 'rgba(92,200,255,0)');
  ctx.strokeStyle = trail;
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, trailLen); ctx.stroke();

  // glowing green head orb
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, b.radius * 2.8);
  glow.addColorStop(0, 'rgba(180,255,120,0.8)');
  glow.addColorStop(1, 'rgba(60,220,120,0)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(0, 0, b.radius * 2.8, 0, Math.PI * 2); ctx.fill();

  // bright core
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(0, 0, b.radius * 0.55, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#7dffb3';
  ctx.beginPath(); ctx.arc(0, 0, b.radius, 0, Math.PI * 2); ctx.fill();
}

// ── Weapon Pickups ───────────────────────

const WEAPON_TYPES_LIST = ['twin_diagonal', 'plasma_lance', 'dual_beam'];

function spawnWeaponPickup(x, y) {
  // 35% chance to drop a weapon pickup on enemy death
  if (Math.random() > 0.35) return;
  const type = WEAPON_TYPES_LIST[Math.floor(Math.random() * WEAPON_TYPES_LIST.length)];
  weaponPickups.push({ x, y, type, vy: 55, pulse: 0, life: 8, radius: 13 });
}

function updateWeaponPickups(dt) {
  for (let i = weaponPickups.length - 1; i >= 0; i--) {
    const p = weaponPickups[i];
    p.y += p.vy * (dt / 1000);
    p.pulse += dt * 0.006;
    p.life -= dt / 1000;
    if (p.life <= 0 || p.y - p.radius > canvas.height) { weaponPickups.splice(i, 1); continue; }
    if ((p.x - player.x) ** 2 + (p.y - player.y) ** 2 < (p.radius + player.radius) ** 2) {
      weaponType = p.type;
      bullets = [];
      playWeaponPickup();
      weaponPickups.splice(i, 1);
    }
  }
}

function drawWeaponPickups() {
  for (const p of weaponPickups) {
    const col = WEAPON_COLORS[p.type];
    ctx.save();
    ctx.translate(p.x, p.y);

    // outer pulse ring
    ctx.strokeStyle = `hsla(${col.h},100%,70%,${0.3 + Math.abs(Math.sin(p.pulse)) * 0.4})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, p.radius * (1.6 + Math.sin(p.pulse) * 0.25), 0, Math.PI * 2);
    ctx.stroke();

    // glow
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, p.radius * 2.2);
    glow.addColorStop(0, `hsla(${col.h},100%,70%,0.55)`);
    glow.addColorStop(1, `hsla(${col.h},100%,60%,0)`);
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, p.radius * 2.2, 0, Math.PI * 2); ctx.fill();

    // dark ring
    ctx.fillStyle = '#0b1228';
    ctx.beginPath(); ctx.arc(0, 0, p.radius * 1.15, 0, Math.PI * 2); ctx.fill();

    // core
    const core = ctx.createRadialGradient(0, 0, 0, 0, 0, p.radius);
    core.addColorStop(0, '#ffffff');
    core.addColorStop(0.4, col.orb);
    core.addColorStop(1, `hsla(${col.h},80%,40%,0.8)`);
    ctx.fillStyle = core;
    ctx.beginPath(); ctx.arc(0, 0, p.radius, 0, Math.PI * 2); ctx.fill();

    // icon letter
    ctx.fillStyle = '#0b1228';
    ctx.font = `bold ${p.radius * 0.9}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const icons = { twin_diagonal: 'T', plasma_lance: 'P', dual_beam: 'D', lightning: '⚡' };
    ctx.fillText(icons[p.type], 0, 0);

    ctx.restore();
  }
}

// ── Coins ────────────────────────────────

function spawnCoin(x, y, value) {
  const pieceCount = 4 + Math.floor(Math.random() * 3);
  const pieces = Array.from({ length: pieceCount }, (_, i) => {
    const angle = (i / pieceCount) * Math.PI * 2;
    const offset = 14 + Math.random() * 6;
    return { x: Math.cos(angle) * offset + (Math.random() * 8 - 4), y: Math.sin(angle) * offset + (Math.random() * 8 - 4), radius: 5 + Math.random() * 3 };
  });
  coins.push({ x, y, radius: 10, value, vy: 90 + Math.random() * 40, life: 6, pieces });
}

function updateCoins(dt) {
  for (let i = coins.length - 1; i >= 0; i--) {
    const c = coins[i];
    c.y += c.vy * (dt / 1000);
    c.life -= dt / 1000;
    if ((c.x - player.x) ** 2 + (c.y - player.y) ** 2 < (player.radius + c.radius * 1.5) ** 2) {
      score += c.value; playCoinPickup(); coins.splice(i, 1); continue;
    }
    if (c.y - c.radius > canvas.height || c.life <= 0) coins.splice(i, 1);
  }
}

function drawCoins() {
  for (const c of coins) {
    ctx.save(); ctx.translate(c.x, c.y);
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, c.radius * 3);
    glow.addColorStop(0, 'rgba(255,215,80,0.9)'); glow.addColorStop(1, 'rgba(255,215,80,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 0, c.radius * 3, 0, Math.PI * 2); ctx.fill();
    for (const p of c.pieces) {
      ctx.save(); ctx.translate(p.x, p.y);
      ctx.fillStyle = '#ffd966'; ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(0, 0, p.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = '#333'; ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(c.value, 0, 0); ctx.restore();
  }
}

// ── Powerups ─────────────────────────────

function spawnPowerup() {
  powerups.push({ x: Math.random() * canvas.width, y: -12, size: 12, speed: 70, type: 'shield', pulse: 0 });
}

function updatePowerups(dt) {
  powerupTimer += dt;
  const interval = Math.max(6000, powerupInterval - level * 120);
  if (powerupTimer > interval) { spawnPowerup(); powerupTimer = 0; }

  for (let i = powerups.length - 1; i >= 0; i--) {
    const p = powerups[i];
    p.pulse += dt * 0.005;
    p.y += p.speed * (dt / 1000);
    if (p.y - p.size > canvas.height) { powerups.splice(i, 1); continue; }
    if ((p.x - player.x) ** 2 + (p.y - player.y) ** 2 < (p.size + player.radius) ** 2) {
      powerups.splice(i, 1); activatePowerup(); playShieldPickup(); gestureCooldown = 0;
    }
  }
}

function activatePowerup() {
  if (shieldActive) { shieldTimer = Math.min(shieldTimer + 1.0, 3.5); return; }
  shieldActive = true; shieldTimer = 4.0;
}

function drawPowerups() {
  for (const p of powerups) {
    ctx.save(); ctx.translate(p.x, p.y);
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2.2);
    glow.addColorStop(0, 'rgba(92,240,255,0.6)'); glow.addColorStop(1, 'rgba(92,240,255,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 0, p.size * 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0b1228'; ctx.beginPath(); ctx.arc(0, 0, p.size * 1.25, 0, Math.PI * 2); ctx.fill();
    const core = ctx.createLinearGradient(-p.size, -p.size, p.size, p.size);
    core.addColorStop(0, '#5cf0ff'); core.addColorStop(1, '#7dffb3');
    ctx.fillStyle = core; ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, p.size * (1.25 + Math.sin(p.pulse) * 0.2), 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
}

// ── Shared health bar helper ─────────────

function _drawHealthBar(cx, cy, barWidth, health, maxHealth, barHeight = 4) {
  if (health === undefined || maxHealth === undefined) return;
  const pct = Math.max(0, health / maxHealth);
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(cx - barWidth * 0.5, cy, barWidth, barHeight);
  ctx.fillStyle = `rgba(${Math.round((1 - pct) * 220)},${Math.round(180 * pct)},110,0.9)`;
  ctx.fillRect(cx - barWidth * 0.5 + 1, cy + 1, (barWidth - 2) * pct, barHeight - 2);
}

// ── Explosions ───────────────────────────

let explosions = [];

function spawnExplosion(x, y, size) {
  const r = Math.max(18, size);

  // screen shake — much stronger, feels like a bomb blast
  blastShake = Math.min(blastShake + r * 0.55, 28);

  const particles = [];

  // embers — fly outward fast, pulled down by gravity
  const emberCount = Math.floor(18 + r * 1.1);
  for (let i = 0; i < emberCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = r * (2.0 + Math.random() * 4.5);
    particles.push({
      x: x + (Math.random() - 0.5) * r * 0.3,
      y: y + (Math.random() - 0.5) * r * 0.3,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: r * (0.12 + Math.random() * 0.28),
      hue: 15 + Math.random() * 35,
      life: 1, maxLife: 0.8 + Math.random() * 0.9,
      type: 'ember',
    });
  }

  // fireball blobs — large, bright, rise and expand like a real fireball
  const fireCount = Math.floor(14 + r * 0.7);
  for (let i = 0; i < fireCount; i++) {
    const spread = r * 0.9;
    const angle  = Math.random() * Math.PI * 2;
    const dist   = Math.random() * r * 0.5;
    particles.push({
      x: x + Math.cos(angle) * dist,
      y: y + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * r * 0.9,
      vy: -(r * 0.6 + Math.random() * r * 1.1),
      radius: r * (0.35 + Math.random() * 0.55),
      hue: 10 + Math.random() * 40,
      life: 1, maxLife: 0.9 + Math.random() * 0.9,
      type: 'fire',
    });
  }

  // smoke wisps — grey, rise slowly, expand, fade last
  const smokeCount = Math.floor(6 + r * 0.25);
  for (let i = 0; i < smokeCount; i++) {
    const spread = r * 1.1;
    particles.push({
      x: x + (Math.random() - 0.5) * spread,
      y: y + (Math.random() - 0.5) * spread * 0.4,
      vx: (Math.random() - 0.5) * r * 0.3,
      vy: -(r * 0.2 + Math.random() * r * 0.35),
      radius: r * (0.3 + Math.random() * 0.5),
      hue: 0,
      life: 1, maxLife: 1.4 + Math.random() * 1.2,
      type: 'smoke',
    });
  }

  explosions.push({
    x, y, baseR: r, particles,
    shockR: 0, shockMax: r * 5.0,
    age: 0,
    duration: 1.8 + r * 0.025,
  });
}

function updateExplosions(dt) {
  const s = dt / 1000;

  // smooth shake decay — frame-rate independent
  blastShake *= Math.pow(0.88, dt / 16.67);
  if (blastShake < 0.15) blastShake = 0;
  blastShakeX = blastShake > 0 ? (Math.random() - 0.5) * blastShake * 2 : 0;
  blastShakeY = blastShake > 0 ? (Math.random() - 0.5) * blastShake * 2 : 0;

  for (let i = explosions.length - 1; i >= 0; i--) {
    const e = explosions[i];
    e.age += s;
    if (e.shockR < e.shockMax) e.shockR += (e.shockMax / 0.18) * s;

    for (const p of e.particles) {
      p.x += p.vx * s;
      p.y += p.vy * s;

      if (p.type === 'ember') {
        p.vy += 24 * s;      // gravity
        p.vx *= 0.96; p.vy *= 0.96;
      } else if (p.type === 'fire') {
        p.vy -= 10 * s;      // fire rises
        p.vx *= 0.97;
        p.radius *= (1 - s * 0.5);   // shrinks as it burns
      } else if (p.type === 'smoke') {
        p.vy -= 5 * s;       // drifts up
        p.vx += (Math.random() - 0.5) * 7 * s;  // turbulence
        p.radius *= (1 + s * 0.2);   // expands
      }

      p.life -= s / p.maxLife;
    }

    if (e.age >= e.duration) explosions.splice(i, 1);
  }
}

function drawExplosions() {
  for (const e of explosions) {
    const progress = e.age / e.duration;
    ctx.save();

    // ── double shockwave rings ──
    if (e.shockR < e.shockMax) {
      const t = e.shockR / e.shockMax;
      ctx.strokeStyle = `rgba(255,220,100,${(1 - t) * 0.85})`;
      ctx.lineWidth   = Math.max(1, (1 - t) * e.baseR * 0.6);
      ctx.beginPath(); ctx.arc(e.x, e.y, e.shockR, 0, Math.PI * 2); ctx.stroke();

      if (e.shockR > e.shockMax * 0.12) {
        const t2 = Math.max(0, (e.shockR - e.shockMax * 0.12) / (e.shockMax * 0.88));
        ctx.strokeStyle = `rgba(255,140,30,${(1 - t2) * 0.55})`;
        ctx.lineWidth   = Math.max(1, (1 - t2) * e.baseR * 0.35);
        ctx.beginPath(); ctx.arc(e.x, e.y, e.shockR * 0.58, 0, Math.PI * 2); ctx.stroke();
      }
    }

    // ── central flash (first 25%) ──
    if (progress < 0.25) {
      const f = 1 - progress / 0.25;
      const flashR = e.baseR * (1.2 + f * 2.2);
      const flash = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, flashR);
      flash.addColorStop(0,    `rgba(255,255,255,${f * 1.0})`);
      flash.addColorStop(0.15, `rgba(255,255,200,${f * 0.95})`);
      flash.addColorStop(0.35, `rgba(255,200,60,${f * 0.85})`);
      flash.addColorStop(0.65, `rgba(255,80,20,${f * 0.55})`);
      flash.addColorStop(1,    `rgba(255,40,0,0)`);
      ctx.fillStyle = flash;
      ctx.beginPath(); ctx.arc(e.x, e.y, flashR, 0, Math.PI * 2); ctx.fill();
    }

    // ── fireball core glow (persists through most of animation) ──
    if (progress < 0.7) {
      const f = 1 - progress / 0.7;
      const coreR = e.baseR * (0.6 + f * 1.0);
      const core = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, coreR);
      core.addColorStop(0,   `rgba(255,240,180,${f * 0.85})`);
      core.addColorStop(0.3, `rgba(255,140,20,${f * 0.75})`);
      core.addColorStop(0.7, `rgba(200,50,10,${f * 0.45})`);
      core.addColorStop(1,   `rgba(100,20,0,0)`);
      ctx.fillStyle = core;
      ctx.beginPath(); ctx.arc(e.x, e.y, coreR, 0, Math.PI * 2); ctx.fill();
    }

    // ── smoke (drawn first, behind fire) ──
    for (const p of e.particles) {
      if (p.type !== 'smoke' || p.life <= 0) continue;
      const alpha = Math.max(0, p.life) * 0.3;
      const rad   = Math.max(0.5, p.radius);
      const smoke = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
      smoke.addColorStop(0, `rgba(160,140,120,${alpha})`);
      smoke.addColorStop(1, `rgba(80,70,60,0)`);
      ctx.fillStyle = smoke;
      ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2); ctx.fill();
    }

    // ── fire linger ──
    for (const p of e.particles) {
      if (p.type !== 'fire' || p.life <= 0) continue;
      const alpha = Math.max(0, p.life);
      const rad   = Math.max(0.5, p.radius);

      // soft halo
      const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 2.8);
      halo.addColorStop(0, `hsla(${p.hue},100%,65%,${alpha * 0.5})`);
      halo.addColorStop(1, `hsla(${p.hue},100%,40%,0)`);
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(p.x, p.y, rad * 2.8, 0, Math.PI * 2); ctx.fill();

      // fire core — white-hot center → orange → red edge
      const fire = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
      fire.addColorStop(0,    `rgba(255,255,200,${alpha})`);
      fire.addColorStop(0.3,  `hsla(${p.hue + 20},100%,72%,${alpha})`);
      fire.addColorStop(0.65, `hsla(${p.hue},100%,52%,${alpha * 0.85})`);
      fire.addColorStop(1,    `hsla(${p.hue - 5},90%,28%,0)`);
      ctx.fillStyle = fire;
      ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2); ctx.fill();
    }

    // ── embers (on top) ──
    for (const p of e.particles) {
      if (p.type !== 'ember' || p.life <= 0) continue;
      const alpha = Math.max(0, p.life);
      const rad   = Math.max(0.5, p.radius * Math.max(0.15, p.life));

      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 3.5);
      glow.addColorStop(0, `hsla(${p.hue},100%,78%,${alpha * 0.55})`);
      glow.addColorStop(1, `hsla(${p.hue},100%,50%,0)`);
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(p.x, p.y, rad * 3.5, 0, Math.PI * 2); ctx.fill();

      const core = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
      core.addColorStop(0,   `rgba(255,255,210,${alpha})`);
      core.addColorStop(0.4, `hsla(${p.hue},100%,65%,${alpha})`);
      core.addColorStop(1,   `hsla(${p.hue + 10},80%,30%,${alpha * 0.5})`);
      ctx.fillStyle = core;
      ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();
  }
}

