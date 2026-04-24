<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AstroWar</title>
  <link rel="stylesheet" href="app.css">
  <!-- Firebase -->
  <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js"></script>
  <!-- MediaPipe -->
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
</head>
<body>

  <!-- ───────────── HOME SCREEN ───────────── -->
  <div class="screen active" id="screen-home">
    <div class="home-bg"></div>
    <canvas id="homeBgCanvas"></canvas>
    <div class="home-content">
      <div class="home-logo">
        <div class="logo-glow"></div>
        <h1>AstroWar</h1>
        <p class="tagline">Dodge. Survive. Dominate.</p>
      </div>
      <div class="home-actions">
        <button class="btn-primary" id="homePlayBtn">▶ Play</button>
        <button class="btn-ghost" id="homeProfileBtn">👤 My Profile</button>
      </div>
      <div class="home-stats" id="homeStats">
        <div class="stat-pill"><span class="stat-label">Best Score</span><span class="stat-val" id="homeBest">—</span></div>
        <div class="stat-pill"><span class="stat-label">Games</span><span class="stat-val" id="homeGames">—</span></div>
        <div class="stat-pill"><span class="stat-label">Rank</span><span class="stat-val" id="homeRank">—</span></div>
      </div>
    </div>
  </div>

  <!-- ───────────── GAME SCREEN ───────────── -->
  <div class="screen" id="screen-game">
    <div class="game-header">
      <button class="back-btn" id="gameBackBtn">← Home</button>
      <div class="game-header-center">
        <div class="badge" id="headerBadge">Head-Tracked</div>
        <span class="header-sub" id="headerSub">Move your head to dodge.</span>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <div id="modeToggle">
          <button class="mode-btn active" id="btnCamera">📷 Camera</button>
          <button class="mode-btn" id="btnKeyboard">⌨️ Keyboard</button>
        </div>
        <div class="badge" id="trackStatus">Waiting...</div>
      </div>
    </div>

    <div class="board" id="gameBoard">
      <canvas id="gameCanvas"></canvas>
      <div id="hud">
        <span id="score">Score: 0</span>
        <span id="lives">Lives: 3</span>
        <span id="level">Level: 1</span>
        <span id="power">Shield: none</span>
        <span id="fire">Firing: OFF</span>
        <span id="mpTimer" style="display:none;color:#ffd700;font-weight:800;">⏱ 30s</span>
        <span id="mpOppScore" style="display:none;color:#ff80c0;">👾 Opp: 0</span>
      </div>
      <div id="statusBar">
        <div id="calibration">Center your head and press Start.</div>
        <div id="fps">FPS: --</div>
      </div>

      <div id="startOverlay">
        <div class="card">
          <h1>Ready?</h1>
          <p id="startDesc">Keep your head visible to steer. Pinch to toggle firing.</p>
          <p class="hint">Keyboard mode: Arrow / WASD · Space or Backspace to fire</p>
          <button id="startBtn">Start Game</button>
        </div>
      </div>

      <div id="gameOverOverlay" style="display:none;">
        <div class="card">
          <h1>Game Over</h1>
          <p id="finalScore">Score: 0</p>
          <p id="newBestMsg" style="display:none;color:var(--success);font-weight:700;">🏆 New Best!</p>
          <button id="restartBtn">Play Again</button>
          <button class="btn-ghost-small" id="goHomeBtn">← Home</button>
        </div>
      </div>

      <video id="videoFeed" playsinline></video>
    </div>
  </div>

  <!-- ───────────── LEADERBOARD SCREEN ───────────── -->
  <div class="screen" id="screen-leaderboard">
    <div class="screen-header">
      <h2>Leaderboard</h2>
      <div class="tab-row">
        <button class="tab active" data-tab="global">🌍 Global</button>
        <button class="tab" data-tab="friends">👥 Friends</button>
      </div>
    </div>
    <div class="screen-body">
      <div class="tab-panel active" id="tab-global">
        <div class="lb-list" id="globalList"></div>
      </div>
      <div class="tab-panel" id="tab-friends">
        <div class="lb-list" id="friendsList"></div>
        <p class="empty-hint" id="friendsEmptyHint" style="display:none;">No friends yet. Add some from your Profile!</p>
      </div>
    </div>
  </div>

  <!-- ───────────── PROFILE SCREEN ───────────── -->
  <div class="screen" id="screen-profile">
    <div class="screen-header">
      <h2>Profile</h2>
    </div>
    <div class="screen-body">
      <div class="profile-card">
        <div class="avatar" id="profileAvatar">🧑‍🚀</div>
        <div class="profile-name-row">
          <span id="profileName">Player</span>
          <button class="icon-btn" id="editNameBtn" title="Edit name">✏️</button>
        </div>
        <div class="profile-stats">
          <div class="pstat"><div class="pstat-val" id="pBest">0</div><div class="pstat-label">Best Score</div></div>
          <div class="pstat"><div class="pstat-val" id="pGames">0</div><div class="pstat-label">Games</div></div>
          <div class="pstat"><div class="pstat-val" id="pAvg">0</div><div class="pstat-label">Avg Score</div></div>
        </div>
      </div>

      <div class="section-title">Recent Scores</div>
      <div class="lb-list" id="recentList"></div>

      <div class="section-title" style="margin-top:20px;">Friends <span class="muted" id="friendCount">(0)</span></div>
      <div class="add-friend-row">
        <input id="addFriendInput" placeholder="Enter player name…" />
        <button class="btn-small" id="addFriendBtn">Add</button>
      </div>
      <div class="lb-list" id="friendsProfileList"></div>
    </div>
  </div>

  <!-- ───────────── MULTIPLAYER SCREEN ───────────── -->
  <div class="screen" id="screen-multiplayer">
    <div class="screen-header">
      <h2>⚔️ Versus</h2>
    </div>
    <div class="screen-body">

      <!-- lobby panel — shown before match starts -->
      <div id="mpLobby">
        <div class="mp-hero">
          <div class="mp-hero-icon">⚔️</div>
          <p class="mp-hero-desc">Challenge a friend to a timed duel.<br>Highest score wins.</p>
        </div>

        <!-- Duration picker — host selects, joiner sees host's choice -->
        <div class="mp-duration-row" id="mpDurationRow">
          <span class="mp-duration-label">Round duration:</span>
          <div class="mp-duration-btns">
            <button class="mp-dur-btn active" data-secs="30">30s</button>
            <button class="mp-dur-btn" data-secs="60">1 min</button>
            <button class="mp-dur-btn" data-secs="180">3 min</button>
          </div>
        </div>

        <button class="btn-primary" id="mpCreateBtn">🔗 Create Match &amp; Get Link</button>

        <div class="mp-divider"><span>or</span></div>

        <div class="add-friend-row">
          <input id="mpJoinInput" placeholder="Paste match code…" />
          <button class="btn-small" id="mpJoinBtn">Join</button>
        </div>

        <div id="mpShareBox" style="display:none;" class="invite-box">
          <div class="invite-title">📨 Share this link with your opponent</div>
          <p class="invite-desc">Waiting for opponent to join…</p>
          <div class="invite-link-row">
            <input class="invite-link-input" id="mpShareInput" readonly />
            <button class="btn-small" id="mpCopyBtn">Copy</button>
          </div>
          <div class="mp-waiting-dots">
            <span></span><span></span><span></span>
          </div>
        </div>

        <div id="mpError" class="mp-error" style="display:none;"></div>
      </div>

      <!-- countdown panel — both players ready -->
      <div id="mpCountdown" style="display:none;">
        <div class="mp-vs-card">
          <div class="mp-player-chip" id="mpP1Chip">
            <span class="mp-chip-avatar">🧑‍🚀</span>
            <span class="mp-chip-name" id="mpP1Name">You</span>
          </div>
          <div class="mp-vs-badge">VS</div>
          <div class="mp-player-chip" id="mpP2Chip">
            <span class="mp-chip-avatar">🧑‍🚀</span>
            <span class="mp-chip-name" id="mpP2Name">Opponent</span>
          </div>
        </div>
        <div class="mp-countdown-num" id="mpCountdownNum">3</div>
        <p class="mp-hint" id="mpCountdownHint">Get ready — highest score wins!</p>
      </div>

      <!-- result panel — after both finish -->
      <div id="mpResult" style="display:none;">
        <div class="mp-result-title" id="mpResultTitle">🏆 You Win!</div>
        <div class="mp-scores-row">
          <div class="mp-score-card me">
            <div class="mp-score-name" id="mpResMyName">You</div>
            <div class="mp-score-val" id="mpResMyScore">0</div>
          </div>
          <div class="mp-score-card">
            <div class="mp-score-name" id="mpResOppName">Opponent</div>
            <div class="mp-score-val" id="mpResOppScore">0</div>
          </div>
        </div>
        <button class="btn-primary" id="mpPlayAgainBtn" style="margin-top:20px;">🔄 Rematch</button>
        <button class="btn-ghost" id="mpResultHomeBtn" style="margin-top:10px;">← Home</button>
      </div>

    </div>
  </div>

  <!-- ───────────── BOTTOM NAV ───────────── -->
  <nav class="bottom-nav" id="bottomNav">
    <button class="nav-btn active" data-screen="home">🏠<span>Home</span></button>
    <button class="nav-btn" data-screen="game">🚀<span>Play</span></button>
    <button class="nav-btn" data-screen="multiplayer">⚔️<span>Versus</span></button>
    <button class="nav-btn" data-screen="leaderboard">🏆<span>Ranks</span></button>
    <button class="nav-btn" data-screen="profile">👤<span>Profile</span></button>
  </nav>

  <!-- data layer -->
  <script src="src/data/db.js"></script>
  <script src="src/data/scores.js"></script>
  <!-- game engine -->
  <script src="src/game/utils.js"></script>
  <script src="src/game/sound.js"></script>
  <script src="src/game/state.js"></script>
  <script src="src/game/entities.js"></script>
  <script src="src/game/patterns.js"></script>
  <script src="src/game/renderer.js"></script>
  <script src="src/game/input.js"></script>
  <script src="src/game/loop.js"></script>
  <script src="src/game/game.js"></script>
  <!-- ui -->
  <script src="src/ui/router.js"></script>
  <script src="src/ui/home.js"></script>
  <script src="src/ui/leaderboard.js"></script>
  <script src="src/ui/profile.js"></script>
  <script src="src/ui/multiplayer.js"></script>
  <!-- bootstrap -->
  <script src="./main.js"></script>

  <!-- Home background animation -->
  <script>
  (function() {
    const canvas = document.getElementById('homeBgCanvas');
    const ctx = canvas.getContext('2d');
    let ships = [];
    let stars = [];
    let animId;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    function createStar() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: randomBetween(1.2, 3.2),
        alpha: randomBetween(0.6, 1),
        twinkleSpeed: randomBetween(0.012, 0.035),
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
      };
    }

    function createShip() {
      const fromLeft = Math.random() > 0.5;
      const size = randomBetween(10, 22);
      return {
        x: fromLeft ? -size * 4 : canvas.width + size * 4,
        y: randomBetween(canvas.height * 0.05, canvas.height * 0.85),
        size,
        speed: randomBetween(40, 110) * (fromLeft ? 1 : -1),
        // slight vertical drift
        vy: randomBetween(-8, 8),
        // tilt angle based on direction
        angle: fromLeft ? randomBetween(-0.15, 0.15) : Math.PI + randomBetween(-0.15, 0.15),
        // color accent: cyan or green tint
        hue: Math.random() > 0.5 ? 185 : 155,
        trail: [],
      };
    }

    function initScene() {
      stars = Array.from({ length: 120 }, createStar);
      ships = Array.from({ length: 2 }, createShip);
    }

    function drawShip(s) {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);

      const sz = s.size;

      // engine glow
      const glow = ctx.createRadialGradient(-sz * 1.1, 0, 0, -sz * 1.1, 0, sz * 1.4);
      glow.addColorStop(0, `hsla(${s.hue},100%,70%,0.7)`);
      glow.addColorStop(1, `hsla(${s.hue},100%,60%,0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.ellipse(-sz * 1.1, 0, sz * 1.4, sz * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // body
      const bodyGrad = ctx.createLinearGradient(-sz, -sz * 0.4, sz, sz * 0.4);
      bodyGrad.addColorStop(0, `hsl(${s.hue}, 60%, 55%)`);
      bodyGrad.addColorStop(0.5, `hsl(${s.hue}, 40%, 75%)`);
      bodyGrad.addColorStop(1, `hsl(${s.hue}, 50%, 40%)`);
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.moveTo(sz, 0);
      ctx.lineTo(-sz * 0.6, -sz * 0.38);
      ctx.lineTo(-sz, 0);
      ctx.lineTo(-sz * 0.6, sz * 0.38);
      ctx.closePath();
      ctx.fill();

      // cockpit
      ctx.fillStyle = `hsla(${s.hue}, 80%, 85%, 0.85)`;
      ctx.beginPath();
      ctx.ellipse(sz * 0.15, 0, sz * 0.28, sz * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();

      // wing
      ctx.fillStyle = `hsla(${s.hue}, 50%, 45%, 0.8)`;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-sz * 0.5, -sz * 0.7);
      ctx.lineTo(-sz * 0.75, -sz * 0.1);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-sz * 0.5, sz * 0.7);
      ctx.lineTo(-sz * 0.75, sz * 0.1);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    function drawTrail(s) {
      if (s.trail.length < 2) return;
      ctx.save();
      for (let i = 1; i < s.trail.length; i++) {
        const alpha = (i / s.trail.length) * 0.35;
        const width = (i / s.trail.length) * s.size * 0.3;
        ctx.strokeStyle = `hsla(${s.hue},100%,70%,${alpha})`;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.trail[i - 1].x, s.trail[i - 1].y);
        ctx.lineTo(s.trail[i].x, s.trail[i].y);
        ctx.stroke();
      }
      ctx.restore();
    }

    let lastTs = 0;
    function frame(ts) {
      if (!document.getElementById('screen-home').classList.contains('active')) {
        animId = requestAnimationFrame(frame);
        return;
      }
      const dt = Math.min(ts - lastTs, 50);
      lastTs = ts;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // stars
      for (const st of stars) {
        st.alpha += st.twinkleSpeed * st.twinkleDir;
        if (st.alpha >= 1)   { st.alpha = 1;   st.twinkleDir = -1; }
        if (st.alpha <= 0.4) { st.alpha = 0.4; st.twinkleDir =  1; }
        // bright core + soft glow for each star
        ctx.shadowColor = 'rgba(255,255,255,0.9)';
        ctx.shadowBlur  = st.r * 4;
        ctx.fillStyle = `rgba(255,255,255,${st.alpha})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ships
      for (let i = ships.length - 1; i >= 0; i--) {
        const s = ships[i];
        s.x += s.speed * (dt / 1000);
        s.y += s.vy   * (dt / 1000);

        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 28) s.trail.shift();

        drawTrail(s);
        drawShip(s);

        // recycle when off screen
        const gone = s.speed > 0 ? s.x > canvas.width + s.size * 5 : s.x < -s.size * 5;
        if (gone) ships[i] = createShip();
      }

      animId = requestAnimationFrame(frame);
    }

    window.addEventListener('resize', () => {
      resize();
      stars = Array.from({ length: 120 }, createStar);
    });

    resize();
    initScene();
    requestAnimationFrame(frame);
  })();
  </script>
</body>
</html>
