import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile, access } from 'node:fs/promises';

const source = await readFile(new URL('../dist/firebase-messaging-sw.js', import.meta.url), 'utf8');
function worker() {
  const events = new Map();
  const stores = new Map();
  let offline = false;
  let requests = 0;
  let claimed = false;
  const notifications = [];
  const fetch = async request => {
    requests++;
    if (offline) throw new TypeError('Offline');
    return new Response(typeof request === 'string' ? request : request.url);
  };
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return {
        async addAll(urls) {
          const responses = await Promise.all(urls.map(url => fetch(url)));
          urls.forEach((url, index) => store.set(url, responses[index]));
        },
        async match(key) { return store.get(key)?.clone(); },
      };
    },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
  };
  vm.runInNewContext(source, {
    caches, fetch, URL,
    self: {
      location: { origin: 'https://notify.example' },
      addEventListener: (type, handler) => events.set(type, handler),
      clients: { async claim() { claimed = true; } },
      registration: { async showNotification(...args) { notifications.push(args); } },
    },
  });
  return {
    stores, notifications, events,
    offline() { offline = true; },
    get requests() { return requests; },
    get claimed() { return claimed; },
    async lifecycle(type) {
      let work;
      events.get(type)({ waitUntil(promise) { work = promise; } });
      await work;
    },
    request(path, mode = 'cors', method = 'GET') {
      let work;
      events.get('fetch')({ request: { url: new URL(path, 'https://notify.example').href, mode, method }, respondWith(promise) { work = promise; } });
      return work;
    },
  };
}

test('production build precaches real HTML, JS, CSS and favicon', async () => {
  const w = worker();
  await w.lifecycle('install');
  const paths = [...w.stores.values()][0];
  for (const path of paths.keys()) await access(new URL('../dist' + path, import.meta.url));
  for (const extension of ['.html', '.js', '.css', '.svg']) assert.ok([...paths.keys()].some(path => path.endsWith(extension)));
});

test('offline refresh and its JS/CSS are served without network requests', async () => {
  const w = worker();
  await w.lifecycle('install');
  const before = w.requests;
  w.offline();
  assert.equal(await (await w.request('/', 'navigate')).text(), '/index.html');
  for (const path of [...w.stores.values()][0].keys()) assert.equal(await (await w.request(path)).text(), path);
  assert.equal(w.requests, before);
});

test('API requests, external origins, and writes are not intercepted', () => {
  const w = worker();
  assert.equal(w.request('/monthmenu'), undefined);
  assert.equal(w.request('https://api.example/monthmenu'), undefined);
  assert.equal(w.request('/user', 'cors', 'POST'), undefined);
});

test('activation removes only old Notify app caches and controls the page', async () => {
  const w = worker();
  w.stores.set('notify-shell-old', new Map());
  w.stores.set('unrelated-cache', new Map());
  await w.lifecycle('install');
  await w.lifecycle('activate');
  assert.equal(w.stores.has('notify-shell-old'), false);
  assert.equal(w.stores.has('unrelated-cache'), true);
  assert.equal(w.claimed, true);
});

test('push handling keeps the notification promise alive', async () => {
  const w = worker();
  let promise;
  w.events.get('push')({ data: { json: () => ({ notification: { title: 'Lunch', body: 'Rice' } }) }, waitUntil(work) { promise = work; } });
  assert.ok(promise);
  await promise;
  assert.equal(w.notifications[0][0], 'Lunch');
});
