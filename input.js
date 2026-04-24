# Multiplayer Setup — Firebase RTDB

The multiplayer feature uses Firebase Realtime Database for real-time match sync.
It's free for this use case (Spark plan covers it easily).

## Steps

### 1. Create a Firebase project
1. Go to https://console.firebase.google.com
2. Click **Add project** → name it `astrowar-mp` → Continue
3. Disable Google Analytics (not needed) → Create project

### 2. Enable Realtime Database
1. In the left sidebar → **Build → Realtime Database**
2. Click **Create Database**
3. Choose a region (pick closest to your users)
4. Start in **test mode** (allows read/write for 30 days — fine for dev)

### 3. Get your config
1. Go to **Project Settings** (gear icon top-left)
2. Scroll to **Your apps** → click **</>** (Web)
3. Register app name → you'll see a `firebaseConfig` object

### 4. Paste config into the game
Open `src/ui/multiplayer.js` and replace the `_FB_CONFIG` object at the top:

```js
const _FB_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId:         "YOUR_PROJECT",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};
```

### 5. Set Database Rules (for production)
In Firebase Console → Realtime Database → Rules, paste:

```json
{
  "rules": {
    "matches": {
      "$matchId": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['p1', 'state', 'createdAt'])"
      }
    }
  }
}
```

### 6. Auto-cleanup old rooms (optional but recommended)
Old match rooms accumulate. Add a Cloud Function or use Firebase TTL rules to
delete rooms where `expiresAt < now`. Alternatively, rooms are tiny (~1KB each)
and the free tier handles thousands of them.

---

That's it. Once the config is in place, multiplayer works instantly — no server to deploy.
