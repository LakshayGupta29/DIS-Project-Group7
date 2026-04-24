/* ─────────────────────────────────────────
   src/game/state.js
   All mutable game state and constants.
   Everything here is global so other modules
   can read/write without passing args everywhere.
───────────────────────────────────────── */

// ── Constants ────────────────────────────
const ASTRONAUT_DRAW_SCALE  = 5.5;
const ALIEN_FIXED_SIZE      = 20;
const ALIEN_DRAW_SCALE      = 4.5;
const KEYBOARD_MOVE_SPEED   = 320;   // px/s

// ── Canvas / DOM refs ────────────────────
const canvas       = document.getElementById('gameCanvas');
const ctx          = canvas.getContext('2d');
const board        = document.getElementById('gameBoard');
const video        = document.getElementById('videoFeed');
const startOverlay = document.getElementById('startOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const hudScore     = document.getElementById('score');
const hudLives     = document.getElementById('lives');
const hudLevel     = document.getElementById('level');
const hudPower     = document.getElementById('power');
const hudFire      = document.getElementById('fire');
const fpsEl        = document.getElementById('fps');
const calibrationEl = document.getElementById('calibration');
const trackStatus  = document.getElementById('trackStatus');

// ── Images ───────────────────────────────
const astronautImg = new Image();
astronautImg.src = 'Artboard 1.png';
let astronautReady = false;
astronautImg.onload = () => { astronautReady = true; };

const alienImg = new Image();
alienImg.src = 'alien.png';
let alienReady = false;
alienImg.onload = () => { alienReady = true; };

const backgroundImg = new Image();
backgroundImg.src = 'background.png';
let backgroundReady = false;
backgroundImg.onload = () => { backgroundReady = true; };

const asteroidImages = ['asteroid1.png', 'asteroid2.png', 'asteroid3.png'].map(src => {
  const img = new Image(); img.src = src; return img;
});

// ── Player ───────────────────────────────
const player = { x: 0, y: 0, radius: 18 };

// ── Game state ───────────────────────────
let running        = false;
let controlMode    = 'camera';   // 'camera' | 'keyboard'
let lastTime       = 0;
let frameCount     = 0;
let fps            = 0;
let score          = 0;
let lives          = 3;
let level          = 1;
let levelTimer     = 0;
let hitFlash       = 0;

// ── Entities ─────────────────────────────
let asteroids    = [];
let aliens       = [];
let coins        = [];
let bullets      = [];
let powerups     = [];
let alienBullets = [];   // projectiles fired by aliens

// ── Timers / intervals ───────────────────
let asteroidTimer    = 0;
let asteroidInterval = 1500;
let alienTimer       = 0;
let alienInterval    = 3000;
let powerupTimer     = 0;
let powerupInterval  = 9000;
let bulletTimer      = 0;
const bulletInterval = 130;
let spawnPatternTimer   = 0;
const spawnPatternInterval = 10000;

// ── Shield ───────────────────────────────
let shieldActive = false;
let shieldTimer  = 0;

// ── Firing ───────────────────────────────
let firing         = false;
let gestureCooldown = 0;

// Types: 'twin_diagonal' | 'plasma_lance' | 'dual_beam'
let weaponType     = 'twin_diagonal';
let weaponPickups  = [];          // dropped orbs on alien death
const WEAPON_COLORS = {
  twin_diagonal: { h: 195, label: 'Twin Diagonal', orb: '#5cf0ff' },
  plasma_lance:  { h: 110, label: 'Plasma Lance',  orb: '#7dff44' },
  dual_beam:     { h: 155, label: 'Dual Beam',     orb: '#44ffb0' },
};

// ── Screen shake ─────────────────────────
let blastShake     = 0;   // current shake magnitude (px), decays each frame
let blastShakeX    = 0;   // current frame offset x
let blastShakeY    = 0;   // current frame offset y

// ── Pattern system ───────────────────────
let nextPatternGroupId = 1;
const activePatternGroups = {};
let patternWarning      = false;
let patternWarningTimer = 0;
const patternWarningDelay = 900;
// Initial grace period before first pattern spawns (ms)
const patternGracePeriod = 5000;
let gameTimer = 0; // total ms elapsed since game start

// ── Camera / face tracking ───────────────
let facePos         = { x: 0.5, y: 0.5 };
let filteredFacePos = { x: 0.5, y: 0.5 };
let prevFace        = { x: 0.5, y: 0.5 };
const smoothing     = 0.15;
let faceVisible     = true;
let handPinch       = false;
let cameraInitialized = false;

// ── Keyboard ─────────────────────────────
const moveKeys   = new Set(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright']);
const pressedKeys = new Set();
let keyboardActive = false;
let keyboardAnchor = { x: 0, y: 0 };
