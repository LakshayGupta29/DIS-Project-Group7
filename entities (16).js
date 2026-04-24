:root {
  --bg: #070b1a;
  --panel: #0f162e;
  --accent: #5cf0ff;
  --accent2: #7dffb3;
  --accent-2: #ff6f61;
  --text: #e6f1ff;
  --muted: #7f8aa9;
  --success: #7dffb3;
  --nav-h: 64px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--text);
  height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── SCREENS ── */
.screen {
  display: none;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.screen.active { display: flex; }

/* ── BOTTOM NAV ── */
.bottom-nav {
  display: flex;
  height: var(--nav-h);
  background: rgba(10,15,35,0.97);
  border-top: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
}
.nav-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: none;
  border: none;
  color: var(--muted);
  font-size: 20px;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0;
  width: auto;
  margin: 0;
  box-shadow: none;
  border-radius: 0;
}
.nav-btn span { font-size: 10px; font-weight: 600; letter-spacing: 0.4px; }
.nav-btn.active { color: var(--accent); }
.nav-btn:hover:not(.active) { color: var(--text); transform: none; box-shadow: none; }

/* ── HOME SCREEN ── */
.home-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 20%, #0d2a4a 0%, #070b1a 60%);
  z-index: 0;
}
#homeBgCanvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  filter: blur(2.5px);
  opacity: 0.45;
  pointer-events: none;
}
#screen-home { position: relative; }
.home-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 32px;
  padding: 24px;
}
.home-logo { text-align: center; position: relative; }
.logo-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 260px; height: 260px;
  background: radial-gradient(circle, rgba(92,240,255,0.12) 0%, transparent 70%);
  pointer-events: none;
}
.home-logo h1 {
  font-size: clamp(36px, 8vw, 64px);
  font-weight: 800;
  letter-spacing: 2px;
  background: linear-gradient(120deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.tagline { color: var(--muted); font-size: 15px; margin-top: 6px; letter-spacing: 1px; }

.home-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 280px; }

.btn-primary {
  background: linear-gradient(120deg, var(--accent), var(--accent2));
  border: none;
  color: #0b0f1f;
  padding: 14px 20px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0 10px 28px rgba(92,240,255,0.35);
  transition: transform 0.15s, box-shadow 0.15s;
  width: 100%;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(92,240,255,0.45); }
.btn-primary:active { transform: translateY(0); }

.btn-ghost {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  color: var(--text);
  padding: 12px 20px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.15s;
  width: 100%;
  box-shadow: none;
  margin: 0;
}
.btn-ghost:hover {
  background: rgba(255,255,255,0.09);
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(255,255,255,0.08);
}
.btn-ghost:active { transform: translateY(0); box-shadow: none; }

.btn-ghost-small {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.15);
  color: var(--muted);
  padding: 9px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 6px;
  box-shadow: none;
  transition: color 0.2s, border-color 0.2s;
}
.btn-ghost-small:hover { color: var(--text); border-color: rgba(255,255,255,0.3); transform: none; box-shadow: none; }

.home-stats {
  display: flex;
  gap: 10px;
}
.stat-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 10px 18px;
  min-width: 80px;
}
.stat-label { font-size: 10px; color: var(--muted); letter-spacing: 0.5px; margin-bottom: 4px; }
.stat-val { font-size: 18px; font-weight: 700; color: var(--accent); }

/* ── GAME SCREEN ── */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
  gap: 10px;
}
.game-header-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
}
.header-sub { color: var(--muted); font-size: 11px; }
.back-btn {
  background: none;
  border: 1px solid rgba(255,255,255,0.12);
  color: var(--muted);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  width: auto;
  margin: 0;
  box-shadow: none;
  transition: color 0.2s, border-color 0.2s;
}
.back-btn:hover { color: var(--text); border-color: rgba(255,255,255,0.3); transform: none; box-shadow: none; }

.board {
  position: relative;
  flex: 1;
  min-height: 0;
  background: #030712;
  overflow: hidden;
}
canvas { display: block; width: 100%; height: 100%; background: transparent; }

#hud {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
  font-weight: 600;
  text-shadow: 0 2px 6px rgba(0,0,0,0.5);
  flex-wrap: wrap;
}
#hud span {
  padding: 6px 10px;
  border-radius: 10px;
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(255,255,255,0.1);
  font-size: 13px;
}
#statusBar {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 13px;
  color: var(--muted);
}

#startOverlay, #gameOverOverlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(3,7,18,0.78);
  backdrop-filter: blur(5px);
}
.card {
  background: rgba(15,22,46,0.95);
  border: 1px solid rgba(92,240,255,0.2);
  border-radius: 16px;
  padding: 26px 24px;
  text-align: center;
  max-width: 320px;
  width: 90%;
  box-shadow: 0 16px 42px rgba(0,0,0,0.5);
}
.card h1 { font-size: 22px; margin-bottom: 10px; }
.card p { color: var(--muted); font-size: 14px; margin: 6px 0; }
.hint { font-size: 11px !important; color: rgba(127,138,169,0.7) !important; }
.card button {
  background: linear-gradient(120deg, var(--accent), var(--accent2));
  border: none;
  color: #0b0f1f;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(92,240,255,0.3);
  transition: transform 0.15s, box-shadow 0.15s;
  width: 100%;
  margin-top: 12px;
}
.card button:hover { transform: translateY(-1px); box-shadow: 0 12px 28px rgba(92,240,255,0.4); }
.card button:active { transform: translateY(0); }

#videoFeed { display: none; }

/* mode toggle */
#modeToggle {
  display: flex;
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 999px;
  padding: 3px;
}
.mode-btn {
  all: unset;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
}
.mode-btn.active {
  background: linear-gradient(120deg, var(--accent), var(--accent2));
  color: #0b0f1f;
  box-shadow: 0 3px 10px rgba(92,240,255,0.3);
}
.mode-btn:hover:not(.active) { color: var(--text); }

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(92,240,255,0.1);
  color: var(--accent);
  border: 1px solid rgba(92,240,255,0.25);
  font-size: 11px;
  letter-spacing: 0.4px;
  white-space: nowrap;
}

/* ── SHARED SCREEN LAYOUT ── */
.screen-header {
  padding: 20px 20px 0;
  flex-shrink: 0;
}
.screen-header h2 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 14px;
}
.screen-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 20px;
}
.screen-body::-webkit-scrollbar { width: 4px; }
.screen-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

/* ── TABS ── */
.tab-row {
  display: flex;
  gap: 6px;
  margin-bottom: 4px;
}
.tab {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--muted);
  padding: 7px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: auto;
  margin: 0;
  box-shadow: none;
}
.tab.active {
  background: linear-gradient(120deg, var(--accent), var(--accent2));
  color: #0b0f1f;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(92,240,255,0.3);
}
.tab:hover:not(.active) { color: var(--text); transform: none; box-shadow: none; }
.tab-panel { display: none; }
.tab-panel.active { display: block; }

/* ── LEADERBOARD LIST ── */
.lb-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
.lb-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 12px 14px;
  transition: background 0.2s;
}
.lb-row.me { border-color: rgba(92,240,255,0.3); background: rgba(92,240,255,0.06); }
.lb-rank {
  font-size: 15px;
  font-weight: 800;
  min-width: 28px;
  text-align: center;
  color: var(--muted);
}
.lb-rank.gold { color: #ffd700; }
.lb-rank.silver { color: #c0c0c0; }
.lb-rank.bronze { color: #cd7f32; }
.lb-avatar { font-size: 22px; }
.lb-info { flex: 1; }
.lb-name { font-weight: 600; font-size: 14px; }
.lb-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }
.lb-score { font-size: 18px; font-weight: 800; color: var(--accent); }
.lb-empty { text-align: center; color: var(--muted); font-size: 14px; padding: 32px 0; }
.empty-hint { text-align: center; color: var(--muted); font-size: 13px; margin-top: 20px; }

/* ── PROFILE ── */
.profile-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  margin-bottom: 20px;
}
.avatar { font-size: 52px; margin-bottom: 10px; }
.profile-name-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}
.profile-name-row span { font-size: 20px; font-weight: 700; }
.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  width: auto;
  margin: 0;
  box-shadow: none;
  opacity: 0.6;
  transition: opacity 0.2s;
}
.icon-btn:hover { opacity: 1; transform: none; box-shadow: none; }
.profile-stats { display: flex; justify-content: center; gap: 16px; }
.pstat { text-align: center; }
.pstat-val { font-size: 22px; font-weight: 800; color: var(--accent); }
.pstat-label { font-size: 11px; color: var(--muted); margin-top: 2px; }

.section-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 4px;
}
.muted { color: var(--muted); }

.add-friend-row {
  display: flex;
  gap: 8px;
  margin: 10px 0 4px;
}
.add-friend-row input {
  flex: 1;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: 9px 12px;
  color: var(--text);
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}
.add-friend-row input:focus { border-color: rgba(92,240,255,0.4); }
.add-friend-row input::placeholder { color: var(--muted); }
.btn-small {
  background: linear-gradient(120deg, var(--accent), var(--accent2));
  border: none;
  color: #0b0f1f;
  padding: 9px 16px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  width: auto;
  margin: 0;
  box-shadow: 0 4px 14px rgba(92,240,255,0.25);
  transition: transform 0.15s;
}
.btn-small:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(92,240,255,0.35); }
.btn-small:active { transform: translateY(0); }

.friend-row {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 10px 14px;
  margin-top: 8px;
}
.friend-row .lb-info { flex: 1; }
.remove-btn {
  background: none;
  border: 1px solid rgba(255,100,100,0.3);
  color: rgba(255,100,100,0.7);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 11px;
  cursor: pointer;
  width: auto;
  margin: 0;
  box-shadow: none;
  transition: all 0.2s;
}
.remove-btn:hover { background: rgba(255,100,100,0.1); color: #ff6464; transform: none; box-shadow: none; }

/* ── Invite box ── */
.invite-box {
  background: rgba(92,240,255,0.05);
  border: 1px solid rgba(92,240,255,0.18);
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 14px;
}
.invite-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 5px;
}
.invite-desc {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 10px;
  line-height: 1.5;
}
.invite-link-row {
  display: flex;
  gap: 8px;
}
.invite-link-input {
  flex: 1;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 7px 10px;
  color: var(--muted);
  font-size: 11px;
  outline: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.invite-link-input:focus { border-color: rgba(92,240,255,0.35); color: var(--text); }

/* ── MULTIPLAYER ── */
.mp-hero {
  text-align: center;
  padding: 32px 20px;
  background: rgba(255,255,255,0.03);
  border-radius: 16px;
  margin-bottom: 20px;
}
.mp-hero-icon {
  font-size: 52px;
  margin-bottom: 12px;
}
.mp-hero-desc {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

.mp-duration-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}
.mp-duration-label {
  color: var(--muted);
  font-size: 13px;
}
.mp-duration-btns {
  display: flex;
  gap: 8px;
}
.mp-dur-btn {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1.5px solid rgba(255,255,255,0.15);
  background: transparent;
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
}
.mp-dur-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.mp-dur-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #000;
}

.mp-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
.mp-divider::before,
.mp-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.1);
}

.mp-error {
  background: rgba(255,100,100,0.1);
  border: 1px solid rgba(255,100,100,0.3);
  border-radius: 12px;
  padding: 12px 14px;
  color: #ff6464;
  font-size: 13px;
  margin-top: 14px;
  text-align: center;
}

.mp-waiting-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
}
.mp-waiting-dots span {
  width: 8px;
  height: 8px;
  background: var(--accent);
  border-radius: 50%;
  animation: mpPulse 1.2s ease-in-out infinite;
}
.mp-waiting-dots span:nth-child(2) { animation-delay: 0.2s; }
.mp-waiting-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes mpPulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50%      { opacity: 1;   transform: scale(1.2); }
}

.mp-vs-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 32px;
}
.mp-player-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  padding: 16px 20px;
  min-width: 100px;
}
.mp-chip-avatar {
  font-size: 32px;
}
.mp-chip-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}
.mp-vs-badge {
  font-size: 18px;
  font-weight: 800;
  color: var(--accent);
  background: rgba(92,240,255,0.1);
  border: 2px solid rgba(92,240,255,0.3);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
}

.mp-countdown-num {
  font-size: 72px;
  font-weight: 900;
  text-align: center;
  background: linear-gradient(120deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  animation: mpCountPulse 1s ease-in-out infinite;
}
@keyframes mpCountPulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.15); }
}

.mp-hint {
  text-align: center;
  color: var(--muted);
  font-size: 13px;
}

.mp-result-title {
  font-size: 28px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 24px;
}

.mp-scores-row {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.mp-score-card {
  flex: 1;
  max-width: 140px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 18px 14px;
  text-align: center;
}
.mp-score-card.me {
  border-color: rgba(92,240,255,0.3);
  background: rgba(92,240,255,0.06);
}
.mp-score-name {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 8px;
}
.mp-score-val {
  font-size: 26px;
  font-weight: 800;
  color: var(--accent);
}
