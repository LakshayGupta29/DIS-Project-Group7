/* ─────────────────────────────────────────
   src/game/sound.js
   Procedural audio via Web Audio API.
   No external files — all sounds synthesised.
   Call initAudio() once on first user gesture.
───────────────────────────────────────── */

let _ac = null;          // AudioContext (created on first interaction)
let _masterGain = null;
let _muted = false;

// ── Background music state ───────────────
let _bgGain       = null;   // gain node for the whole music bus
let _bgRunning    = false;
let _bgScheduleId = null;   // setTimeout handle
let _bgBeat       = 0;      // current beat index (0-based, wraps)

// Musical constants — space minor pentatonic feel
const _BPM        = 72;
const _BEAT       = 60 / _BPM;          // seconds per beat
const _BAR        = _BEAT * 4;

// Bass notes (Hz) — slow 8-bar cycle, deep and brooding
const _BASS_SEQ = [55, 55, 49, 49, 52, 52, 46, 46];   // A1 A1 G1 G1 Ab1 Ab1 Bb0 Bb0

// Pad chord roots (Hz) — whole notes, one per bar
const _PAD_ROOTS = [110, 98, 104, 92];  // A2 G2 Ab2 Bb1

// Arp notes over each root (ratio offsets — minor pentatonic)
const _ARP_RATIOS = [1, 1.189, 1.498, 1.782, 2];

function initAudio() {
  if (_ac) return;
  _ac = new (window.AudioContext || window.webkitAudioContext)();
  _masterGain = _ac.createGain();
  _masterGain.gain.value = 0.55;
  _masterGain.connect(_ac.destination);

  // music bus — quieter than SFX so it sits behind action
  _bgGain = _ac.createGain();
  _bgGain.gain.value = 0;   // starts silent; faded in by startBgMusic()
  _bgGain.connect(_ac.destination);
}

function _ctx() {
  if (!_ac) initAudio();
  if (_ac.state === 'suspended') _ac.resume();
  return _ac;
}

function setMuted(val) { _muted = val; }
function isMuted()     { return _muted; }

// ── Background music ─────────────────────

function startBgMusic() {
  if (_bgRunning) return;
  if (!_ac) initAudio();
  _bgRunning = true;
  _bgBeat    = 0;

  // fade music in over 2 s
  const now = _ac.currentTime;
  _bgGain.gain.cancelScheduledValues(now);
  _bgGain.gain.setValueAtTime(_bgGain.gain.value, now);
  _bgGain.gain.linearRampToValueAtTime(0.18, now + 2.0);

  _scheduleBgBeat();
}

function stopBgMusic(fadeSecs = 1.5) {
  if (!_bgRunning) return;
  _bgRunning = false;
  clearTimeout(_bgScheduleId);

  const now = _ac.currentTime;
  _bgGain.gain.cancelScheduledValues(now);
  _bgGain.gain.setValueAtTime(_bgGain.gain.value, now);
  _bgGain.gain.linearRampToValueAtTime(0, now + fadeSecs);
}

function _scheduleBgBeat() {
  if (!_bgRunning) return;
  _playBgBeat(_bgBeat);
  _bgBeat = (_bgBeat + 1) % (_BASS_SEQ.length * 4);   // 8 bass notes × 4 beats each = 32 beats per cycle
  _bgScheduleId = setTimeout(_scheduleBgBeat, _BEAT * 1000);
}

function _playBgBeat(beat) {
  if (!_ac || _muted) return;
  const ac  = _ctx();
  const now = ac.currentTime + 0.02;   // tiny lookahead

  const barBeat  = beat % 4;           // beat within current bar (0-3)
  const barIndex = Math.floor(beat / 4) % _PAD_ROOTS.length;
  const bassIdx  = Math.floor(beat / 4) % _BASS_SEQ.length;

  // ── 1. Deep bass pulse — every beat, accented on beat 0 ──
  _bgOsc({
    freq:    _BASS_SEQ[bassIdx],
    freqEnd: _BASS_SEQ[bassIdx] * 0.88,
    type:    'sine',
    gain:    barBeat === 0 ? 0.38 : 0.22,
    attack:  0.01,
    decay:   _BEAT * 0.72,
    now,
  });

  // sub-bass click on beat 0 for punch
  if (barBeat === 0) {
    _bgOsc({ freq: 60, freqEnd: 28, type: 'sine', gain: 0.28, attack: 0.005, decay: 0.18, now });
  }

  // ── 2. Pad chord — attack on beat 0 of each bar ──
  if (barBeat === 0) {
    const root = _PAD_ROOTS[barIndex];
    // minor triad: root, minor-third (×1.189), fifth (×1.498)
    [1, 1.189, 1.498].forEach((ratio, i) => {
      _bgOsc({
        freq:    root * ratio,
        freqEnd: root * ratio * 0.998,
        type:    'triangle',
        gain:    0.055 - i * 0.01,
        attack:  0.35,
        decay:   _BAR * 0.88,
        now:     now + i * 0.015,   // slight stagger for warmth
      });
    });

    // shimmer octave above
    _bgOsc({
      freq: root * 2, freqEnd: root * 2 * 0.997,
      type: 'sine', gain: 0.025, attack: 0.5, decay: _BAR * 0.75, now,
    });
  }

  // ── 3. Arpeggio — 16th-note pattern, sparse (beats 1 & 3 only) ──
  if (barBeat === 1 || barBeat === 3) {
    const root     = _PAD_ROOTS[barIndex] * 2;   // one octave up
    const arpNote  = _ARP_RATIOS[(beat * 3) % _ARP_RATIOS.length];
    _bgOsc({
      freq:    root * arpNote,
      freqEnd: root * arpNote * 1.004,
      type:    'sine',
      gain:    0.045,
      attack:  0.008,
      decay:   _BEAT * 0.38,
      now,
    });
  }

  // ── 4. Soft hi-hat texture — every beat, quieter on off-beats ──
  _bgNoise({
    gain:    barBeat % 2 === 0 ? 0.028 : 0.014,
    attack:  0.002,
    decay:   0.055,
    lpFreq:  7000,
    now,
  });

  // ── 5. Kick-like thud on beat 0 ──
  if (barBeat === 0) {
    _bgOsc({ freq: 80, freqEnd: 22, type: 'sine', gain: 0.32, attack: 0.004, decay: 0.22, now });
  }

  // ── 6. Snare-ish noise on beat 2 ──
  if (barBeat === 2) {
    _bgNoise({ gain: 0.055, attack: 0.003, decay: 0.11, lpFreq: 3500, now });
    _bgOsc({ freq: 200, freqEnd: 120, type: 'triangle', gain: 0.06, attack: 0.003, decay: 0.10, now });
  }
}

// ── Music-bus oscillator (routes to _bgGain, not _masterGain) ──
function _bgOsc({ type = 'sine', freq = 220, freqEnd = null,
                  gain = 0.1, attack = 0.01, decay = 0.3, now = 0 } = {}) {
  const ac = _ac;
  const g  = ac.createGain();
  g.connect(_bgGain);
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);

  const o = ac.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, now);
  if (freqEnd !== null) o.frequency.exponentialRampToValueAtTime(freqEnd, now + attack + decay);
  o.connect(g);
  o.start(now);
  o.stop(now + attack + decay + 0.05);
}

function _bgNoise({ gain = 0.1, attack = 0.003, decay = 0.1, lpFreq = 4000, now = 0 } = {}) {
  const ac     = _ac;
  const bufLen = Math.ceil(ac.sampleRate * (attack + decay + 0.05));
  const buf    = ac.createBuffer(1, bufLen, ac.sampleRate);
  const data   = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  const src = ac.createBufferSource();
  src.buffer = buf;

  const lp = ac.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = lpFreq;

  const g = ac.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);

  src.connect(lp); lp.connect(g); g.connect(_bgGain);
  src.start(now);
  src.stop(now + attack + decay + 0.1);
}


/** Play a simple oscillator burst */
function _osc({ type = 'sine', freq = 440, freqEnd = null, gain = 0.4,
                 attack = 0.005, decay = 0.12, start = 0 } = {}) {
  if (_muted) return;
  const ac = _ctx(), now = ac.currentTime + start;
  const g  = ac.createGain();
  g.connect(_masterGain);
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);

  const o = ac.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, now);
  if (freqEnd !== null) o.frequency.exponentialRampToValueAtTime(freqEnd, now + attack + decay);
  o.connect(g);
  o.start(now);
  o.stop(now + attack + decay + 0.05);
}

/** White-noise burst (for explosions / impacts) */
function _noise({ gain = 0.5, attack = 0.003, decay = 0.18,
                  lpFreq = 2200, start = 0 } = {}) {
  if (_muted) return;
  const ac = _ctx(), now = ac.currentTime + start;
  const bufLen = ac.sampleRate * (attack + decay + 0.05);
  const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  const src = ac.createBufferSource();
  src.buffer = buf;

  const lp = ac.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = lpFreq;

  const g = ac.createGain();
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);

  src.connect(lp); lp.connect(g); g.connect(_masterGain);
  src.start(now);
  src.stop(now + attack + decay + 0.1);
}

// ── UI sounds ────────────────────────────

/** Generic click / nav tap */
function playClick() {
  _osc({ type: 'sine', freq: 880, freqEnd: 660, gain: 0.18, attack: 0.004, decay: 0.07 });
}

/** Positive confirm (start game, add friend) */
function playConfirm() {
  _osc({ type: 'triangle', freq: 520, gain: 0.22, attack: 0.005, decay: 0.09 });
  _osc({ type: 'triangle', freq: 780, gain: 0.18, attack: 0.005, decay: 0.09, start: 0.07 });
}

/** Back / cancel */
function playBack() {
  _osc({ type: 'sine', freq: 440, freqEnd: 280, gain: 0.16, attack: 0.004, decay: 0.09 });
}

/** New best score fanfare */
function playNewBest() {
  [0, 0.10, 0.20, 0.32].forEach((t, i) => {
    const freqs = [523, 659, 784, 1047];
    _osc({ type: 'triangle', freq: freqs[i], gain: 0.22, attack: 0.01, decay: 0.18, start: t });
  });
}

// ── Weapon fire sounds ───────────────────

function playFireTwinDiagonal() {
  // Two quick high-pitched zaps
  _osc({ type: 'sawtooth', freq: 1200, freqEnd: 600, gain: 0.14, attack: 0.003, decay: 0.07 });
  _osc({ type: 'sawtooth', freq: 1400, freqEnd: 700, gain: 0.12, attack: 0.003, decay: 0.07, start: 0.02 });
}

function playFirePlasmaLance() {
  // Deep fat green needle — low thump + rising whine
  _osc({ type: 'sawtooth', freq: 80,  freqEnd: 40,  gain: 0.28, attack: 0.004, decay: 0.10 });
  _osc({ type: 'square',   freq: 320, freqEnd: 900, gain: 0.16, attack: 0.003, decay: 0.09 });
}

function playFireDualBeam() {
  // Two parallel beams — clean sci-fi pew pew
  _osc({ type: 'square', freq: 600, freqEnd: 300, gain: 0.13, attack: 0.003, decay: 0.08 });
  _osc({ type: 'square', freq: 650, freqEnd: 320, gain: 0.11, attack: 0.003, decay: 0.08, start: 0.015 });
}

// ── Wind / movement sound ────────────────
let _windNode   = null;   // running noise source
let _windGain   = null;   // gain node for wind volume
let _windLpNode = null;   // lowpass filter

function startWindSound() {
  if (!_ac || _muted || _windNode) return;
  const ac  = _ac;
  const bufLen = ac.sampleRate * 2;
  const buf  = ac.createBuffer(1, bufLen, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

  _windNode = ac.createBufferSource();
  _windNode.buffer = buf;
  _windNode.loop   = true;

  _windLpNode = ac.createBiquadFilter();
  _windLpNode.type            = 'lowpass';
  _windLpNode.frequency.value = 180;
  _windLpNode.Q.value         = 0.3;

  _windGain = ac.createGain();
  _windGain.gain.value = 0;

  _windNode.connect(_windLpNode);
  _windLpNode.connect(_windGain);
  _windGain.connect(_masterGain);
  _windNode.start();
}

function stopWindSound() {
  if (!_windNode) return;
  try { _windNode.stop(); } catch(e) {}
  _windNode   = null;
  _windGain   = null;
  _windLpNode = null;
}

/** Call every frame with normalised speed 0-1 */
function updateWindSound(speed) {
  if (_muted || !_ac) return;
  if (!_windNode) startWindSound();
  if (!_windGain) return;
  // target gain: very subtle breeze, only audible when moving fast
  const target = speed * 0.08;
  const now    = _ac.currentTime;
  _windGain.gain.cancelScheduledValues(now);
  _windGain.gain.setTargetAtTime(target, now, 0.15);
  // subtle filter shift for a gentle whoosh
  if (_windLpNode) _windLpNode.frequency.setTargetAtTime(120 + speed * 200, now, 0.2);
}

/** Dispatch to the right fire sound based on current weapon */
function playFire() {
  if (typeof weaponType === 'undefined') return;
  switch (weaponType) {
    case 'twin_diagonal': playFireTwinDiagonal(); break;
    case 'plasma_lance':  playFirePlasmaLance();  break;
    case 'dual_beam':     playFireDualBeam();     break;
  }
}

// ── Hit / damage sounds ──────────────────

/** Bullet hits an enemy (not yet destroyed) */
function playHit() {
  _noise({ gain: 0.18, attack: 0.002, decay: 0.07, lpFreq: 1800 });
  _osc({ type: 'sine', freq: 220, freqEnd: 110, gain: 0.10, attack: 0.002, decay: 0.06 });
}

/** Player takes a hit */
function playPlayerHit() {
  _noise({ gain: 0.35, attack: 0.003, decay: 0.22, lpFreq: 900 });
  _osc({ type: 'sawtooth', freq: 160, freqEnd: 60, gain: 0.22, attack: 0.004, decay: 0.20 });
}

// ── Explosion sounds ─────────────────────

/** Small explosion (asteroid destroyed) */
function playExplosionSmall() {
  // deep thud + crack + rumble
  _osc({ type: 'sine',     freq: 140, freqEnd: 28,  gain: 0.55, attack: 0.003, decay: 0.45 });
  _osc({ type: 'sawtooth', freq: 220, freqEnd: 55,  gain: 0.30, attack: 0.002, decay: 0.30 });
  _noise({ gain: 0.65, attack: 0.002, decay: 0.35, lpFreq: 1800 });
  _noise({ gain: 0.30, attack: 0.001, decay: 0.12, lpFreq: 5000, start: 0.01 });
}

/** Bigger explosion (alien destroyed) */
function playExplosionLarge() {
  // massive bomb blast — sub-bass boom + crack + long rumble
  _osc({ type: 'sine',     freq: 80,  freqEnd: 18,  gain: 0.75, attack: 0.002, decay: 0.80 });
  _osc({ type: 'sine',     freq: 55,  freqEnd: 12,  gain: 0.55, attack: 0.005, decay: 1.00, start: 0.02 });
  _osc({ type: 'sawtooth', freq: 160, freqEnd: 35,  gain: 0.40, attack: 0.002, decay: 0.55 });
  _noise({ gain: 0.85, attack: 0.001, decay: 0.60, lpFreq: 900 });
  _noise({ gain: 0.50, attack: 0.001, decay: 0.25, lpFreq: 4500, start: 0.005 });
  _noise({ gain: 0.25, attack: 0.05,  decay: 0.80, lpFreq: 400,  start: 0.08 });
}

// ── Pickup / powerup sounds ──────────────

/** Coin collected */
function playCoinPickup() {
  _osc({ type: 'sine', freq: 1046, freqEnd: 1568, gain: 0.20, attack: 0.004, decay: 0.10 });
}

/** Weapon pickup collected */
function playWeaponPickup() {
  _osc({ type: 'triangle', freq: 440, gain: 0.18, attack: 0.005, decay: 0.08 });
  _osc({ type: 'triangle', freq: 660, gain: 0.20, attack: 0.005, decay: 0.10, start: 0.06 });
  _osc({ type: 'triangle', freq: 880, gain: 0.18, attack: 0.005, decay: 0.12, start: 0.12 });
}

/** Shield powerup collected */
function playShieldPickup() {
  _osc({ type: 'sine', freq: 600, freqEnd: 1200, gain: 0.22, attack: 0.008, decay: 0.20 });
  _osc({ type: 'sine', freq: 800, freqEnd: 1600, gain: 0.16, attack: 0.008, decay: 0.20, start: 0.05 });
}

// ── Game state sounds ────────────────────

/** Game start */
function playGameStart() {
  [0, 0.12, 0.24].forEach((t, i) => {
    const freqs = [330, 440, 660];
    _osc({ type: 'triangle', freq: freqs[i], gain: 0.20, attack: 0.01, decay: 0.15, start: t });
  });
}

/** Level up */
function playLevelUp() {
  [0, 0.09, 0.18, 0.27].forEach((t, i) => {
    const freqs = [392, 523, 659, 784];
    _osc({ type: 'triangle', freq: freqs[i], gain: 0.18, attack: 0.008, decay: 0.14, start: t });
  });
}

/** Game over */
function playGameOver() {
  _osc({ type: 'sawtooth', freq: 440, freqEnd: 110, gain: 0.28, attack: 0.01, decay: 0.60 });
  _osc({ type: 'sawtooth', freq: 330, freqEnd: 80,  gain: 0.22, attack: 0.01, decay: 0.80, start: 0.15 });
  _noise({ gain: 0.20, attack: 0.01, decay: 0.50, lpFreq: 600, start: 0.10 });
}

/** Shield expired */
function playShieldExpire() {
  _osc({ type: 'sine', freq: 800, freqEnd: 200, gain: 0.18, attack: 0.004, decay: 0.25 });
}

/** Pattern warning pulse (called periodically while warning is active) */
function playPatternWarning() {
  _osc({ type: 'square', freq: 260, freqEnd: 200, gain: 0.12, attack: 0.005, decay: 0.12 });
}

/** Alien fires a bullet at the player */
function playFireAlienBullet() {
  _osc({ type: 'sawtooth', freq: 520, freqEnd: 260, gain: 0.10, attack: 0.003, decay: 0.09 });
  _noise({ gain: 0.08, attack: 0.002, decay: 0.06, lpFreq: 3000 });
}
