/* ─────────────────────────────────────────
   src/ui/leaderboard.js
   Global + friends leaderboard rendering
   Depends on: scores.js
───────────────────────────────────────── */

function rankLabel(i) {
  if (i === 0) return '<span class="lb-rank gold">🥇</span>';
  if (i === 1) return '<span class="lb-rank silver">🥈</span>';
  if (i === 2) return '<span class="lb-rank bronze">🥉</span>';
  return `<span class="lb-rank">${i + 1}</span>`;
}

function buildLbRow(e, i, myName) {
  const isMe = e.name === myName;
  return `<div class="lb-row${isMe ? ' me' : ''}">
    ${rankLabel(i)}
    <span class="lb-avatar">${e.avatar}</span>
    <div class="lb-info">
      <div class="lb-name">${e.name}${isMe ? ' <span style="color:var(--accent);font-size:11px;">(you)</span>' : ''}</div>
    </div>
    <span class="lb-score">${e.score.toLocaleString()}</span>
  </div>`;
}

function renderLeaderboard() {
  const profile = getProfile();
  const friends = getFriends();

  // Sync from Firebase first, then render
  syncLeaderboardFromFirebase(board => {
    board = board.slice().sort((a, b) => b.score - a.score);

    const globalEl = document.getElementById('globalList');
    globalEl.innerHTML = board.length
      ? board.map((e, i) => buildLbRow(e, i, profile.name)).join('')
      : '<div class="lb-empty">No scores yet. Play a game!</div>';

    const friendsEl   = document.getElementById('friendsList');
    const hint        = document.getElementById('friendsEmptyHint');
    const friendBoard = board
      .filter(e => friends.map(n => n.toLowerCase()).includes(e.name.toLowerCase()) || e.name === profile.name)
      .sort((a, b) => b.score - a.score);

    if (!friendBoard.length) {
      friendsEl.innerHTML = '';
      hint.style.display  = '';
    } else {
      hint.style.display  = 'none';
      friendsEl.innerHTML = friendBoard.map((e, i) => buildLbRow(e, i, profile.name)).join('');
    }
  });
}

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    playClick();
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});
