/* ─────────────────────────────────────────
   src/ui/multiplayer.js
   Multiplayer: create/join match, 30-sec timed
   duel, real-time score sync via Firebase RTDB.
   Depends on: scores.js, router.js, game.js
───────────────────────────────────────── */

// ── Firebase config ───────────────────────
// Uses a public anonymous-access RTDB for match rooms.
// Rooms auto-delete after 10 minutes via TTL written on creation.
const _FB_CONFIG = {
  apiKey:            "AIzaSyDJ3d0RjbX-V_yrUg65BYmvgoXmpIwnvrA",
  authDomain:        "astrowar-mp.firebaseapp.com",
  databaseURL:       "https://astrowar-mp-default-rtdb.firebaseio.com",
  projectId:         "astrowar-mp",
  storageBucket:     "astrowar-mp.firebasestorage.app",
  messagingSenderId: "453338557961",
  appId:             "1:453338557961:web:0032f3ee9752d82ce9d2d8",
};

let _fbApp = null;
let _db    = null;

function _initFirebase() {
  if (_fbApp) return true;
  try {
    if (!firebase || !firebase.initializeApp) return false;
    // avoid re-initialising if already done
    if (firebase.apps && firebase.apps.length) {
      _fbApp = firebase.apps[0];
    } else {
      _fbApp = firebase.initializeApp(_FB_CONFIG);
    }
    _db = firebase.database(_fbApp);
    return true;
  } catch (e) {
    console.warn('Firebase init failed:', e);
    return false;
  }
}

// ── Match state ───────────────────────────
let _matchId    = null;   // current room key
let _mySlot     = null;   // 'p1' | 'p2'
let _oppSlot    = null;
let _roomRef    = null;
let _listeners  = [];     // { ref, type, fn } — cleaned up on leave

// Multiplayer game mode flag (read by game loop)
let mpActive       = false;
let mpTimeLeft     = 30;   // seconds remaining
let mpOppScore     = 0;
let _mpTimerHandle = null;
let _mpDuration    = 30;   // selected round duration in seconds

// ── Helpers ───────────────────────────────

function _uid() {
  return Math.random().toString(36).slice(2, 9) +
         Math.random().toString(36).slice(2, 9);
}

function _on(ref, type, fn) {
  ref.on(type, fn);
  _listeners.push({ ref, type, fn });
}

function _cleanupListeners() {
  for (const l of _listeners) l.ref.off(l.type, l.fn);
  _listeners = [];
}

function _showMpError(msg) {
  const el = document.getElementById('mpError');
  el.textContent = msg;
  el.style.display = '';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function _setLobbyPanel(show) {
  document.getElementById('mpLobby').style.display      = show ? '' : 'none';
  document.getElementById('mpCountdown').style.display  = 'none';
  document.getElementById('mpResult').style.display     = 'none';
}

function _setCountdownPanel() {
  document.getElementById('mpLobby').style.display      = 'none';
  document.getElementById('mpCountdown').style.display  = '';
  document.getElementById('mpResult').style.display     = 'none';
}

function _setResultPanel() {
  document.getElementById('mpLobby').style.display      = 'none';
  document.getElementById('mpCountdown').style.display  = 'none';
  document.getElementById('mpResult').style.display     = '';
}

// ── Create match ──────────────────────────

function mpCreateMatch() {
  if (!_initFirebase()) {
    _showMpError('⚠️ Multiplayer unavailable — Firebase not configured. See setup instructions.');
    return;
  }

  const profile = getProfile();
  _matchId = _uid();
  _mySlot  = 'p1';
  _oppSlot = 'p2';

  _roomRef = _db.ref('matches/' + _matchId);

  const room = {
    p1: { name: profile.name, avatar: profile.avatar, score: null, ready: false },
    p2: null,
    state: 'waiting',
    duration: _mpDuration,   // store chosen duration for joiner
    createdAt: Date.now(),
    expiresAt:  Date.now() + 10 * 60 * 1000,
  };

  _roomRef.set(room).then(() => {
    const link = `${location.origin}${location.pathname}?mp=${_matchId}`;
    document.getElementById('mpShareInput').value = link;
    document.getElementById('mpShareBox').style.display = '';
    document.getElementById('mpError').style.display = 'none';

    _on(_roomRef.child('p2'), 'value', snap => {
      if (!snap.exists()) return;
      const p2 = snap.val();
      if (p2 && p2.name) _onBothJoined(profile, p2);
    });
  }).catch(e => _showMpError('Could not create match: ' + e.message));
}

// ── Join match ────────────────────────────

function mpJoinMatch(matchId) {
  if (!_initFirebase()) {
    _showMpError('⚠️ Multiplayer unavailable — Firebase not configured.');
    return;
  }

  const profile = getProfile();
  _matchId = matchId.trim();
  _mySlot  = 'p2';
  _oppSlot = 'p1';
  _roomRef = _db.ref('matches/' + _matchId);

  _roomRef.once('value').then(snap => {
    if (!snap.exists()) { _showMpError('Match not found. Check the code and try again.'); return; }
    const room = snap.val();
    if (room.state !== 'waiting') { _showMpError('This match has already started.'); return; }
    if (room.p2) { _showMpError('Match is full.'); return; }

    // read host's chosen duration
    _mpDuration = room.duration || 30;
    _setActiveDurationBtn(_mpDuration);

    _roomRef.child('p2').set({
      name: profile.name, avatar: profile.avatar, score: null, ready: false,
    }).then(() => {
      const p1 = room.p1;
      _onBothJoined(profile, p1);
    }).catch(e => _showMpError('Could not join: ' + e.message));
  }).catch(e => _showMpError('Could not reach server: ' + e.message));
}

// ── Both players present → countdown ─────

function _onBothJoined(me, opp) {
  document.getElementById('mpShareBox').style.display = 'none';

  const myName  = me.name;
  const oppName = opp.name;

  document.getElementById('mpP1Name').textContent = _mySlot === 'p1' ? myName  : oppName;
  document.getElementById('mpP2Name').textContent = _mySlot === 'p2' ? myName  : oppName;

  _setCountdownPanel();

  // update hint with actual duration
  const durLabel = _mpDuration >= 60 ? (_mpDuration / 60) + ' min' : _mpDuration + ' sec';
  document.getElementById('mpCountdownHint').textContent = `Get ready — ${durLabel}, highest score wins!`;

  // host (p1) writes state = countdown; both watch it
  if (_mySlot === 'p1') {
    _roomRef.child('state').set('countdown');
  }

  let count = 3;
  const numEl = document.getElementById('mpCountdownNum');
  numEl.textContent = count;

  const tick = setInterval(() => {
    count--;
    if (count > 0) {
      numEl.textContent = count;
      playClick();
    } else {
      clearInterval(tick);
      playConfirm();
      _startMpGame(myName, oppName);
    }
  }, 1000);
}

// ── Start the timed game ──────────────────

function _startMpGame(myName, oppName) {
  mpActive   = true;
  mpTimeLeft = _mpDuration;
  mpOppScore = 0;

  // show timer + opp score in HUD
  document.getElementById('mpTimer').style.display    = '';
  document.getElementById('mpOppScore').style.display = '';

  // watch opponent's live score
  _on(_roomRef.child(_oppSlot + '/score'), 'value', snap => {
    if (snap.val() !== null) {
      mpOppScore = snap.val();
      const el = document.getElementById('mpOppScore');
      if (el) el.textContent = `👾 ${oppName}: ${mpOppScore}`;
    }
  });

  // switch to game screen and start
  showScreen('game');
  resetGame();

  // 30-second countdown
  _mpTimerHandle = setInterval(() => {
    mpTimeLeft--;
    const el = document.getElementById('mpTimer');
    if (el) el.textContent = `⏱ ${mpTimeLeft}s`;

    // push live score every second
    _roomRef.child(_mySlot + '/score').set(score);

    if (mpTimeLeft <= 0) {
      clearInterval(_mpTimerHandle);
      _mpTimerHandle = null;
      _endMpGame(myName, oppName);
    }
  }, 1000);
}

// ── End timed game ────────────────────────

function _endMpGame(myName, oppName) {
  mpActive = false;
  running  = false;

  // hide mp HUD
  document.getElementById('mpTimer').style.display    = 'none';
  document.getElementById('mpOppScore').style.display = 'none';

  const myFinalScore = score;

  // push final score + mark done
  _roomRef.child(_mySlot).update({ score: myFinalScore, ready: true });

  // save to local scores
  addScore(myFinalScore);
  updateGlobalBoard(myName, getProfile().avatar, myFinalScore);

  // wait for opponent's final score (or timeout after 8s)
  let resolved = false;

  const resolve = (oppFinal) => {
    if (resolved) return;
    resolved = true;
    _cleanupListeners();
    _showMpResult(myName, oppName, myFinalScore, oppFinal);
  };

  _on(_roomRef.child(_oppSlot + '/ready'), 'value', snap => {
    if (snap.val() === true) {
      _roomRef.child(_oppSlot + '/score').once('value').then(s => resolve(s.val() || 0));
    }
  });

  // fallback timeout
  setTimeout(() => resolve(mpOppScore), 8000);
}

// ── Show result ───────────────────────────

function _showMpResult(myName, oppName, myScore, oppScore) {
  showScreen('multiplayer');
  _setResultPanel();

  const won  = myScore > oppScore;
  const tied = myScore === oppScore;

  document.getElementById('mpResultTitle').textContent =
    tied ? "🤝 It's a Tie!" : won ? '🏆 You Win!' : '💀 You Lose!';
  document.getElementById('mpResultTitle').style.color =
    tied ? 'var(--accent)' : won ? 'var(--success)' : 'var(--accent-2)';

  document.getElementById('mpResMyName').textContent  = myName;
  document.getElementById('mpResOppName').textContent = oppName;
  document.getElementById('mpResMyScore').textContent  = myScore.toLocaleString();
  document.getElementById('mpResOppScore').textContent = oppScore.toLocaleString();

  if (won) playNewBest();
  else     playGameOver();
}

// ── Leave / cleanup ───────────────────────

function mpLeave() {
  if (_mpTimerHandle) { clearInterval(_mpTimerHandle); _mpTimerHandle = null; }
  _cleanupListeners();
  mpActive   = false;
  mpTimeLeft = _mpDuration;
  _matchId   = null;
  _mySlot    = null;
  _oppSlot   = null;
  _roomRef   = null;
  document.getElementById('mpTimer').style.display    = 'none';
  document.getElementById('mpOppScore').style.display = 'none';
  document.getElementById('mpShareBox').style.display = 'none';
  document.getElementById('mpJoinInput').value = '';
}

// ── Render (called by router on screen switch) ──

function renderMultiplayer() {
  _setLobbyPanel(true);
  document.getElementById('mpError').style.display = 'none';
}

// ── Duration picker wiring ────────────────

function _setActiveDurationBtn(secs) {
  document.querySelectorAll('.mp-dur-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.secs) === secs);
  });
}

document.querySelectorAll('.mp-dur-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    _mpDuration = parseInt(btn.dataset.secs);
    _setActiveDurationBtn(_mpDuration);
    playClick();
  });
});

// ── Button wiring ─────────────────────────

document.getElementById('mpCreateBtn').addEventListener('click', () => {
  initAudio(); playConfirm();
  mpLeave();
  mpCreateMatch();
});

document.getElementById('mpJoinBtn').addEventListener('click', () => {
  const val = document.getElementById('mpJoinInput').value.trim();
  if (!val) { _showMpError('Paste a match code or link first.'); return; }
  initAudio(); playConfirm();
  // accept full URL or bare code
  const code = val.includes('mp=') ? new URL(val).searchParams.get('mp') : val;
  mpLeave();
  mpJoinMatch(code);
});

document.getElementById('mpJoinInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('mpJoinBtn').click();
});

document.getElementById('mpCopyBtn').addEventListener('click', () => {
  const val = document.getElementById('mpShareInput').value;
  navigator.clipboard.writeText(val).then(() => {
    const btn = document.getElementById('mpCopyBtn');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
  }).catch(() => {
    document.getElementById('mpShareInput').select();
    document.execCommand('copy');
  });
});

document.getElementById('mpPlayAgainBtn').addEventListener('click', () => {
  playClick();
  mpLeave();
  renderMultiplayer();
});

document.getElementById('mpResultHomeBtn').addEventListener('click', () => {
  playClick();
  mpLeave();
  showScreen('home');
});

// ── Auto-join from URL param ──────────────
// Handled in main.js after DOM ready
