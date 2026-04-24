/* ─────────────────────────────────────────
   src/game/patterns.js
   Spawn pattern definitions + group lifecycle
   Depends on: state.js, entities.js
───────────────────────────────────────── */

const spawnPatterns = [
  { name: 'Core wedge', minLevel: 1, rows: [
    { type: 'alien',    entries: [{ side:'top', targetX:0.32, targetY:0.22 }, { side:'top', targetX:0.68, targetY:0.22 }] },
    { type: 'alien',    entries: [{ side:'top', targetX:0.38, targetY:0.30 }, { side:'top', targetX:0.62, targetY:0.30 }] },
    { type: 'asteroid', entries: [{ side:'top', targetX:0.44, targetY:0.38 }, { side:'top', targetX:0.56, targetY:0.38 }] },
    { type: 'asteroid', entries: [{ side:'top', targetX:0.46, targetY:0.46 }, { side:'top', targetX:0.54, targetY:0.46 }] },
  ]},
  { name: 'Diamond shield', minLevel: 1, rows: [
    { type: 'asteroid', entries: [{ side:'top', targetX:0.30, targetY:0.22 }, { side:'top', targetX:0.70, targetY:0.22 }] },
    { type: 'alien',    entries: [{ side:'top', targetX:0.34, targetY:0.30 }, { side:'top', targetX:0.66, targetY:0.30 }] },
    { type: 'alien',    entries: [{ side:'top', targetX:0.40, targetY:0.38 }, { side:'top', targetX:0.60, targetY:0.38 }] },
    { type: 'asteroid', entries: [{ side:'top', targetX:0.44, targetY:0.46 }, { side:'top', targetX:0.56, targetY:0.46 }] },
  ]},
  { name: 'Twin wings', minLevel: 1, rows: [
    { type: 'alien',    entries: [{ side:'top', targetX:0.26, targetY:0.20 }, { side:'top', targetX:0.74, targetY:0.20 }] },
    { type: 'alien',    entries: [{ side:'top', targetX:0.32, targetY:0.28 }, { side:'top', targetX:0.68, targetY:0.28 }] },
    { type: 'alien',    entries: [{ side:'top', targetX:0.38, targetY:0.36 }, { side:'top', targetX:0.62, targetY:0.36 }] },
    { type: 'asteroid', entries: [{ side:'top', targetX:0.45, targetY:0.44 }, { side:'top', targetX:0.55, targetY:0.44 }] },
  ]},
  { name: 'Center spike', minLevel: 1, rows: [
    { type: 'asteroid', entries: [{ side:'top', targetX:0.28, targetY:0.22 }, { side:'top', targetX:0.72, targetY:0.22 }] },
    { type: 'alien',    entries: [{ side:'top', targetX:0.36, targetY:0.30 }, { side:'top', targetX:0.64, targetY:0.30 }] },
    { type: 'asteroid', entries: [{ side:'top', targetX:0.42, targetY:0.38 }, { side:'top', targetX:0.58, targetY:0.38 }] },
    { type: 'alien',    entries: [{ side:'top', targetX:0.48, targetY:0.46 }, { side:'top', targetX:0.52, targetY:0.46 }] },
  ]},
  { name: 'Tight arrow', minLevel: 1, rows: [
    { type: 'alien',    entries: [{ side:'top', targetX:0.34, targetY:0.20 }, { side:'top', targetX:0.66, targetY:0.20 }] },
    { type: 'asteroid', entries: [{ side:'top', targetX:0.40, targetY:0.28 }, { side:'top', targetX:0.60, targetY:0.28 }] },
    { type: 'asteroid', entries: [{ side:'top', targetX:0.44, targetY:0.36 }, { side:'top', targetX:0.56, targetY:0.36 }] },
    { type: 'alien',    entries: [{ side:'top', targetX:0.48, targetY:0.44 }, { side:'top', targetX:0.52, targetY:0.44 }] },
  ]},

  // ── Level 3+ patterns ────────────────────
  { name: 'Wide wall', minLevel: 3, rows: [
    { type: 'asteroid', entries: [{ side:'top', targetX:0.18, targetY:0.20 }, { side:'top', targetX:0.38, targetY:0.20 }, { side:'top', targetX:0.62, targetY:0.20 }, { side:'top', targetX:0.82, targetY:0.20 }] },
    { type: 'alien',    entries: [{ side:'top', targetX:0.28, targetY:0.32 }, { side:'top', targetX:0.50, targetY:0.32 }, { side:'top', targetX:0.72, targetY:0.32 }] },
  ]},
  { name: 'Pincer', minLevel: 3, rows: [
    { type: 'alien',    entries: [{ side:'top', targetX:0.20, targetY:0.20 }, { side:'top', targetX:0.80, targetY:0.20 }] },
    { type: 'asteroid', entries: [{ side:'top', targetX:0.25, targetY:0.30 }, { side:'top', targetX:0.75, targetY:0.30 }] },
    { type: 'alien',    entries: [{ side:'top', targetX:0.30, targetY:0.40 }, { side:'top', targetX:0.70, targetY:0.40 }] },
    { type: 'asteroid', entries: [{ side:'top', targetX:0.35, targetY:0.50 }, { side:'top', targetX:0.65, targetY:0.50 }] },
  ]},

  // ── Level 5+ patterns ────────────────────
  { name: 'Cross', minLevel: 5, rows: [
    { type: 'alien',    entries: [{ side:'top', targetX:0.50, targetY:0.18 }] },
    { type: 'asteroid', entries: [{ side:'top', targetX:0.30, targetY:0.28 }, { side:'top', targetX:0.50, targetY:0.28 }, { side:'top', targetX:0.70, targetY:0.28 }] },
    { type: 'alien',    entries: [{ side:'top', targetX:0.50, targetY:0.38 }] },
    { type: 'asteroid', entries: [{ side:'top', targetX:0.30, targetY:0.48 }, { side:'top', targetX:0.50, targetY:0.48 }, { side:'top', targetX:0.70, targetY:0.48 }] },
  ]},
  { name: 'Triple threat', minLevel: 5, rows: [
    { type: 'alien',    entries: [{ side:'top', targetX:0.25, targetY:0.20 }, { side:'top', targetX:0.50, targetY:0.20 }, { side:'top', targetX:0.75, targetY:0.20 }] },
    { type: 'asteroid', entries: [{ side:'top', targetX:0.25, targetY:0.30 }, { side:'top', targetX:0.50, targetY:0.30 }, { side:'top', targetX:0.75, targetY:0.30 }] },
    { type: 'alien',    entries: [{ side:'top', targetX:0.25, targetY:0.40 }, { side:'top', targetX:0.50, targetY:0.40 }, { side:'top', targetX:0.75, targetY:0.40 }] },
  ]},

  // ── Level 8+ patterns ────────────────────
  { name: 'Fortress', minLevel: 8, rows: [
    { type: 'asteroid', entries: [{ side:'top', targetX:0.20, targetY:0.18 }, { side:'top', targetX:0.35, targetY:0.18 }, { side:'top', targetX:0.50, targetY:0.18 }, { side:'top', targetX:0.65, targetY:0.18 }, { side:'top', targetX:0.80, targetY:0.18 }] },
    { type: 'alien',    entries: [{ side:'top', targetX:0.28, targetY:0.28 }, { side:'top', targetX:0.50, targetY:0.28 }, { side:'top', targetX:0.72, targetY:0.28 }] },
    { type: 'asteroid', entries: [{ side:'top', targetX:0.20, targetY:0.38 }, { side:'top', targetX:0.80, targetY:0.38 }] },
    { type: 'alien',    entries: [{ side:'top', targetX:0.35, targetY:0.48 }, { side:'top', targetX:0.50, targetY:0.48 }, { side:'top', targetX:0.65, targetY:0.48 }] },
  ]},
  { name: 'Swarm', minLevel: 8, rows: [
    { type: 'alien',    entries: [{ side:'top', targetX:0.22, targetY:0.20 }, { side:'top', targetX:0.38, targetY:0.20 }, { side:'top', targetX:0.54, targetY:0.20 }, { side:'top', targetX:0.70, targetY:0.20 }] },
    { type: 'alien',    entries: [{ side:'top', targetX:0.30, targetY:0.30 }, { side:'top', targetX:0.46, targetY:0.30 }, { side:'top', targetX:0.62, targetY:0.30 }] },
    { type: 'asteroid', entries: [{ side:'top', targetX:0.22, targetY:0.40 }, { side:'top', targetX:0.50, targetY:0.40 }, { side:'top', targetX:0.78, targetY:0.40 }] },
    { type: 'alien',    entries: [{ side:'top', targetX:0.38, targetY:0.50 }, { side:'top', targetX:0.54, targetY:0.50 }] },
  ]},
];

function pickSpawnPattern() {
  const available = spawnPatterns.filter(p => level >= (p.minLevel || 1));
  const pattern = available[Math.floor(Math.random() * available.length)];
  const groupId = nextPatternGroupId++;

  // Hold time: starts at 15s, shrinks by 0.5s per level, minimum 1.5s
  const holdTime = Math.max(1.5, 15.0 - (level - 1) * 0.5);
  const group = { total: 0, readyCount: 0, state: 'waiting', holdTimer: holdTime };
  activePatternGroups[groupId] = group;
  const patternAsteroidImage = pickRandomLoadedAsteroidImage();

  for (const row of pattern.rows) {
    for (const entry of row.entries) {
      group.total += 1;
      const options = { ...entry, groupId };
      if (row.type === 'alien') {
        spawnAlienAt(undefined, options);
      } else {
        options.image = patternAsteroidImage;
        spawnAsteroidAt(undefined, options);
      }
    }
  }
}

function updatePatternGroups(dt) {
  for (const groupId in activePatternGroups) {
    const group = activePatternGroups[groupId];
    if (group.state === 'waiting' && group.readyCount >= group.total) {
      group.state = 'holding';
      // holdTimer was already set in pickSpawnPattern — don't reset it here
    }
    if (group.state === 'holding') {
      group.holdTimer -= dt / 1000;
      if (group.holdTimer <= 0) group.state = 'released';
    }
    if (group.total <= 0) {
      delete activePatternGroups[groupId];
    }
  }
}

function updatePattern(dt) {
  gameTimer += dt;

  // Don't spawn anything during the initial grace period
  if (gameTimer < patternGracePeriod) {
    patternWarning = false;
    patternWarningTimer = 0;
    return;
  }

  // Don't spawn a new pattern while any group is still active
  const anyGroupAlive = Object.keys(activePatternGroups).length > 0;
  if (anyGroupAlive) {
    patternWarning = false;
    patternWarningTimer = 0;
    return;
  }

  const targets = asteroids.length + aliens.length;
  if (targets < 4) {
    const wasWarning = patternWarning;
    patternWarning = true;
    patternWarningTimer += dt;
    if (!wasWarning || patternWarningTimer % 1200 < dt) playPatternWarning();
    if (patternWarningTimer >= patternWarningDelay) {
      pickSpawnPattern();
      patternWarning = false;
      patternWarningTimer = 0;
    }
  } else {
    patternWarning = false;
    patternWarningTimer = 0;
  }
}
