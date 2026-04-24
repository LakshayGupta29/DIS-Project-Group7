/* ─────────────────────────────────────────
   src/game/input.js
   Keyboard input + MediaPipe camera/hand tracking
   Depends on: state.js, utils.js
───────────────────────────────────────── */

function toggleFiring() { firing = !firing; }

// ── Keyboard ─────────────────────────────

function onKeyStateChange(event, isDown) {
  if ([' ', 'Backspace', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
  }

  const key = event.key;

  // Backspace — toggle once per press (no repeat, no hold)
  if (key === 'Backspace') {
    if (isDown && !event.repeat && running) toggleFiring();
    return;
  }

  // Space — hold to fire continuously, release to stop
  if (key === ' ') {
    if (!running) return;
    firing = isDown;   // true while held, false on release
    return;
  }

  const lkey = key.toLowerCase();
  if (!moveKeys.has(lkey)) return;
  if (isDown) pressedKeys.add(lkey); else pressedKeys.delete(lkey);
}

// ── Camera / MediaPipe ───────────────────

async function setupFaceMesh() {
  const faceMesh = new FaceMesh({
    locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
  });
  faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: false, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
  faceMesh.onResults(onFaceResults);

  const hands = new Hands({
    locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
  });
  hands.setOptions({ maxNumHands: 1, modelComplexity: 0, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
  hands.onResults(onHandResults);

  const camera = new Camera(video, {
    onFrame: async () => { await faceMesh.send({ image: video }); await hands.send({ image: video }); },
    width: 640, height: 480,
  });

  try {
    await camera.start();
    trackStatus.textContent = 'Tracking: OK';
    trackStatus.style.color = '#7dffb3';
    calibrationEl.textContent = 'Center your head, press Start, and pinch to toggle firing.';
  } catch (err) {
    console.error(err);
    trackStatus.textContent = 'Camera blocked';
    calibrationEl.textContent = 'Camera unavailable. Allow permission and reload.';
  }
}

function onFaceResults(results) {
  if (!results.multiFaceLandmarks || !results.multiFaceLandmarks.length) {
    if (faceVisible) { keyboardAnchor.x = player.x; keyboardAnchor.y = player.y; }
    faceVisible = false;
    trackStatus.textContent = 'Face lost';
    trackStatus.style.color = '#ff6f61';
    calibrationEl.textContent = 'Face lost. Use arrow keys or WASD to move.';
    return;
  }
  faceVisible = true;
  const nose = results.multiFaceLandmarks[0][1];
  facePos.x = 1 - (nose ? nose.x : 0.5);
  facePos.y = nose ? nose.y : 0.5;
  filteredFacePos.x = lerp(filteredFacePos.x, facePos.x, smoothing);
  filteredFacePos.y = lerp(filteredFacePos.y, facePos.y, smoothing);
  trackStatus.textContent = 'Tracking: OK';
  trackStatus.style.color = '#7dffb3';
  calibrationEl.textContent = 'Center your head and press Start.';
}

function onHandResults(results) {
  if (controlMode !== 'camera') return;
  if (!results.multiHandLandmarks || !results.multiHandLandmarks.length) { handPinch = false; return; }
  const lm = results.multiHandLandmarks[0];
  const pinchDist = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y);
  if (pinchDist < 0.05) { if (!handPinch) { handPinch = true; toggleFiring(); } }
  else { handPinch = false; }
}

window.addEventListener('keydown', (e) => onKeyStateChange(e, true));
window.addEventListener('keyup',   (e) => onKeyStateChange(e, false));
window.addEventListener('blur',    ()  => { pressedKeys.clear(); firing = false; });
