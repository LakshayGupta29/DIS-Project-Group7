/* ─────────────────────────────────────────
   src/data/scores.js
   Profile, scores, friends, global leaderboard
   Firebase is used for: unique name registry,
   friends (bidirectional), global leaderboard.
   Depends on: db.js (DB)
───────────────────────────────────────── */

// ── Firebase ref (reuses multiplayer's _db if ready) ──
function _fdb() {
  if (typeof _db !== 'undefined' && _db) return _db;
  // try to init via multiplayer's _initFirebase
  if (typeof _initFirebase === 'function') _initFirebase();
  return (typeof _db !== 'undefined') ? _db : null;
}

// ── Profile (localStorage) ────────────────

function getProfile() {
  if (!DB.get('sd_profile', null)) {
    const count = (DB.get('sd_player_count', 0)) + 1;
    DB.set('sd_player_count', count);
    DB.set('sd_profile', { name: 'Player' + count, avatar: '🧑‍🚀' });
  }
  return DB.get('sd_profile', { name: 'Player1', avatar: '🧑‍🚀' });
}
function saveProfile(p) { DB.set('sd_profile', p); }

// ── Unique name check + claim via Firebase ─

/**
 * Check if a name is already taken in Firebase.
 * Returns a Promise<boolean> — true = taken.
 */
function isNameTaken(name) {
  const db = _fdb();
  if (!db) return Promise.resolve(false); // offline: skip check
  const key = name.trim().toLowerCase();
  return db.ref('players/' + key).once('value').then(snap => snap.exists());
}

/**
 * Claim a name in Firebase under players/<lowercase_name>.
 * Stores { name, avatar } so others can look up the player.
 */
function claimName(name, avatar) {
  const db = _fdb();
  if (!db) return Promise.resolve();
  const key = name.trim().toLowerCase();
  return db.ref('players/' + key).set({ name, avatar, updatedAt: Date.now() });
}

/**
 * Release old name from Firebase registry.
 */
function releaseName(name) {
  const db = _fdb();
  if (!db) return Promise.resolve();
  const key = name.trim().toLowerCase();
  return db.ref('players/' + key).remove();
}

// ── Scores (localStorage) ─────────────────

function getScores() { return DB.get('sd_scores', []); }

function addScore(s) {
  const scores = getScores();
  scores.unshift({ score: s, date: Date.now() });
  if (scores.length > 50) scores.length = 50;
  DB.set('sd_scores', scores);
}

function getBest() {
  const s = getScores();
  return s.length ? Math.max(...s.map(x => x.score)) : 0;
}

// ── Friends (Firebase-backed) ─────────────

function getFriends() { return DB.get('sd_friends', []); }
function saveFriends(f) { DB.set('sd_friends', f); }

/**
 * Add a friend by name (both locally and in Firebase).
 * Also writes a reverse entry so the other player sees you too.
 */
function addFriendByName(friendName) {
  const profile = getProfile();
  const myKey   = profile.name.trim().toLowerCase();
  const theirKey = friendName.trim().toLowerCase();

  // local
  const friends = getFriends();
  if (!friends.map(n => n.toLowerCase()).includes(theirKey)) {
    friends.push(friendName);
    saveFriends(friends);
  }

  // Firebase: write both directions
  const db = _fdb();
  if (db) {
    db.ref(`friends/${myKey}/${theirKey}`).set({ name: friendName, addedAt: Date.now() });
    db.ref(`friends/${theirKey}/${myKey}`).set({ name: profile.name, addedAt: Date.now() });
  }
}

/**
 * Remove a friend locally and from Firebase.
 */
function removeFriendByName(friendName) {
  const profile  = getProfile();
  const myKey    = profile.name.trim().toLowerCase();
  const theirKey = friendName.trim().toLowerCase();

  saveFriends(getFriends().filter(n => n.toLowerCase() !== theirKey));

  const db = _fdb();
  if (db) {
    db.ref(`friends/${myKey}/${theirKey}`).remove();
  }
}

/**
 * Sync friends list from Firebase into localStorage.
 * Call on profile screen open.
 */
function syncFriendsFromFirebase(callback) {
  const db = _fdb();
  if (!db) { if (callback) callback(getFriends()); return; }
  const myKey = getProfile().name.trim().toLowerCase();
  db.ref(`friends/${myKey}`).once('value').then(snap => {
    if (snap.exists()) {
      const data = snap.val();
      const names = Object.values(data).map(v => v.name);
      saveFriends(names);
    }
    if (callback) callback(getFriends());
  }).catch(() => { if (callback) callback(getFriends()); });
}

// ── Global leaderboard (Firebase-backed) ──

function getGlobalBoard() { return DB.get('sd_global', []); }

function updateGlobalBoard(name, avatar, score) {
  // local cache
  const board    = getGlobalBoard();
  const existing = board.find(e => e.name === name);
  if (existing) {
    if (score > existing.score) existing.score = score;
  } else {
    board.push({ name, avatar, score });
  }
  board.sort((a, b) => b.score - a.score);
  if (board.length > 100) board.length = 100;
  DB.set('sd_global', board);

  // Firebase
  const db = _fdb();
  if (db) {
    const key = name.trim().toLowerCase();
    db.ref('leaderboard/' + key).transaction(current => {
      if (!current || score > (current.score || 0)) {
        return { name, avatar, score, updatedAt: Date.now() };
      }
      return; // abort — existing score is higher
    });
  }
}

/**
 * Fetch global leaderboard from Firebase and cache locally.
 */
function syncLeaderboardFromFirebase(callback) {
  const db = _fdb();
  if (!db) { if (callback) callback(getGlobalBoard()); return; }
  db.ref('leaderboard').orderByChild('score').limitToLast(50).once('value').then(snap => {
    if (snap.exists()) {
      const entries = [];
      snap.forEach(child => entries.push(child.val()));
      entries.sort((a, b) => b.score - a.score);
      DB.set('sd_global', entries);
    }
    if (callback) callback(getGlobalBoard());
  }).catch(() => { if (callback) callback(getGlobalBoard()); });
}
