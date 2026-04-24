const CACHE = 'dlt-v6';

const GAME_ASSETS = [
  '/game/',
  '/game/index.html',
  '/game/main.js',
  '/game/app.css',
  '/game/Artboard 1.png',
  '/game/alien.png',
  '/game/background.png',
  '/game/asteroid1.png',
  '/game/asteroid2.png',
  '/game/asteroid3.png',
  '/game/src/data/db.js',
  '/game/src/data/scores.js',
  '/game/src/game/utils.js',
  '/game/src/game/sound.js',
  '/game/src/game/state.js',
  '/game/src/game/entities.js',
  '/game/src/game/patterns.js',
  '/game/src/game/renderer.js',
  '/game/src/game/input.js',
  '/game/src/game/loop.js',
  '/game/src/game/game.js',
  '/game/src/ui/router.js',
  '/game/src/ui/home.js',
  '/game/src/ui/leaderboard.js',
  '/game/src/ui/profile.js',
  '/game/src/ui/multiplayer.js',
];

const SITE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
];

// Install — cache everything
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([...SITE_ASSETS, ...GAME_ASSETS])
    )
  );
  self.skipWaiting();
});

// Activate — remove old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isRootPage = url.pathname === '/' || url.pathname === '/index.html';

  if (isRootPage) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          // Online — serve website, refresh cache
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => {
          // Offline — send a redirect response to /game/
          return Response.redirect('/game/', 302);
        })
    );
    return;
  }

  // Everything else — cache first, network fallback
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
