/* ─────────────────────────────────────────
   src/ui/profile.js
   Profile screen: stats, recent scores, friends
   Depends on: scores.js, multiplayer.js (Firebase)
───────────────────────────────────────── */

function renderProfile() {
  const profile = getProfile();
  const scores  = getScores();
  const best    = getBest();
  const avg     = scores.length ? Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length) : 0;

  document.getElementById('profileAvatar').textContent = profile.avatar;
  document.getElementById('profileName').textContent   = profile.name;
  document.getElementById('pBest').textContent         = best.toLocaleString();
  document.getElementById('pGames').textContent        = scores.length;
  document.getElementById('pAvg').textContent          = avg.toLocaleString();

  // Recent scores
  const recentEl = document.getElementById('recentList');
  recentEl.innerHTML = scores.length
    ? scores.slice(0, 10).map((s, i) => {
        const d = new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        return `<div class="lb-row">
          <span class="lb-rank">${i + 1}</span>
          <div class="lb-info">
            <div class="lb-name">Game #${scores.length - i}</div>
            <div class="lb-sub">${d}</div>
          </div>
          <span class="lb-score">${s.score.toLocaleString()}</span>
        </div>`;
      }).join('')
    : '<div class="lb-empty">No games played yet.</div>';

  // Sync friends from Firebase then render
  syncFriendsFromFirebase(() => renderFriendsProfile());
}

function renderFriendsProfile() {
  const friends = getFriends();
  const board   = getGlobalBoard();
  const profile = getProfile();
  const el      = document.getElementById('friendsProfileList');
  document.getElementById('friendCount').textContent = `(${friends.length})`;

  const inviteUrl = `${location.origin}${location.pathname}?invite=${encodeURIComponent(profile.name)}`;

  const inviteHtml = `
    <div class="invite-box">
      <div class="invite-title">📨 Invite a friend</div>
      <p class="invite-desc">Share this link — when they open it you both become friends automatically.</p>
      <div class="invite-link-row">
        <input class="invite-link-input" id="inviteLinkInput" readonly value="${inviteUrl}" />
        <button class="btn-small" id="copyInviteBtn">Copy</button>
      </div>
    </div>`;

  if (!friends.length) {
    el.innerHTML = inviteHtml + '<div class="lb-empty" style="padding:16px 0;">No friends yet.</div>';
  } else {
    el.innerHTML = inviteHtml + friends.map(name => {
      const entry  = board.find(e => e.name.toLowerCase() === name.toLowerCase());
      const avatar = entry ? entry.avatar : '👤';
      const score  = entry ? entry.score.toLocaleString() : '—';
      return `<div class="friend-row">
        <span class="lb-avatar">${avatar}</span>
        <div class="lb-info">
          <div class="lb-name">${name}</div>
          <div class="lb-sub">Best: ${score}</div>
        </div>
        <button class="remove-btn" data-name="${name}">Remove</button>
      </div>`;
    }).join('');
  }

  document.getElementById('copyInviteBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      const btn = document.getElementById('copyInviteBtn');
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    }).catch(() => {
      document.getElementById('inviteLinkInput').select();
      document.execCommand('copy');
    });
  });

  el.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFriendByName(btn.dataset.name);
      renderFriendsProfile();
    });
  });
}

// ── Edit / claim unique name ──────────────

document.getElementById('editNameBtn').addEventListener('click', () => {
  playClick();
  const profile = getProfile();
  const newName = prompt('Enter your player name (must be unique):', profile.name);
  if (!newName || !newName.trim()) return;

  const trimmed = newName.trim().slice(0, 20);
  if (trimmed.toLowerCase() === profile.name.toLowerCase()) return; // no change

  // Check uniqueness in Firebase
  isNameTaken(trimmed).then(taken => {
    if (taken) {
      alert(`"${trimmed}" is already taken. Please choose a different name.`);
      return;
    }
    const oldName = profile.name;
    profile.name  = trimmed;
    saveProfile(profile);

    // Release old name, claim new one
    releaseName(oldName);
    claimName(trimmed, profile.avatar);

    // Update leaderboard entry
    const best = getBest();
    if (best > 0) updateGlobalBoard(trimmed, profile.avatar, best);

    renderProfile();
  });
});

// ── Add friend by name ────────────────────

function addFriend() {
  const input      = document.getElementById('addFriendInput');
  const name       = input.value.trim();
  if (!name) return;

  const profile = getProfile();
  if (name.toLowerCase() === profile.name.toLowerCase()) {
    alert("That's you! You can't add yourself."); return;
  }

  const friends = getFriends();
  if (friends.map(n => n.toLowerCase()).includes(name.toLowerCase())) {
    alert(`${name} is already your friend.`); input.value = ''; return;
  }

  // Verify the name exists in Firebase before adding
  isNameTaken(name).then(exists => {
    if (!exists) {
      alert(`Player "${name}" not found. Make sure the name is spelled correctly.`);
      return;
    }
    addFriendByName(name);
    playConfirm();
    input.value = '';
    renderFriendsProfile();
  });
}

document.getElementById('addFriendBtn').addEventListener('click', addFriend);
document.getElementById('addFriendInput').addEventListener('keydown', e => { if (e.key === 'Enter') addFriend(); });

// ── Auto-accept invite link ───────────────
// When someone opens ?invite=PlayerName, add them as a friend automatically.
// This runs once on page load (handled in main.js), but we also expose a helper:

function handleInviteParam(inviterName) {
  if (!inviterName) return;
  const profile = getProfile();
  if (inviterName.toLowerCase() === profile.name.toLowerCase()) return;

  const friends = getFriends();
  if (friends.map(n => n.toLowerCase()).includes(inviterName.toLowerCase())) return;

  // Verify inviter exists then add bidirectionally
  isNameTaken(inviterName).then(exists => {
    if (!exists) return;
    addFriendByName(inviterName);
  });
}
