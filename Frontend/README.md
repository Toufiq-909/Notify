# Notify 2.0 frontend

## Offline caching

There are two independent stores:

- `localStorage.Monthmenu` contains the monthly API response. Both daily and calendar views read it; no separate daily-menu request is made.
- Cache Storage contains the production app shell: HTML, hashed JavaScript/CSS, and favicon. `offline-plugin.js` generates the exact file list and a content-based cache version during `npm run build`.

`src/main.jsx` registers `firebase-messaging-sw.js` automatically in production on HTTPS (or localhost), even if notifications are disabled. Installation only succeeds after every app-shell file is cached. The worker serves its matching HTML and assets from that cache, allowing an offline refresh to start React and read the stored menu. API calls and third-party URLs are not intercepted. Fonts fall back to the system fonts offline.

The same worker handles push notifications. Notification setup passes its registration to Firebase so the two features use the same worker.

Updates install into a new versioned cache. They wait for existing tabs using the old version to close before activation; activation removes only old `notify-shell-` caches. This prevents mixing an old page with a new JavaScript bundle.

### Testing

1. Run `npm run build`, then `npm run preview` (offline caching is intentionally disabled in Vite development mode).
2. Open the preview online and let the menu and service worker finish loading.
3. Switch the browser network to offline, refresh, and check meal tabs, dates, theme changes, and search.
4. Use `node --test tests/offline-worker.test.mjs` after building to test the generated worker.

After deployment, visit the same HTTPS address online once on the device. A first-ever offline visit cannot download the app or menu. Clearing site data/private browsing/storage eviction can remove the saved files. If an older tab is open during an update, close the site's tabs and reopen online to activate the new worker. New notification subscriptions still require internet.
