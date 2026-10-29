import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Include the exact hashed assets emitted by Vite, so offline HTML and JS match.
export function offlineShell() {
  let config;
  return {
    name: 'notify-offline-shell',
    apply: 'build',
    configResolved(value) { config = value; },
    async writeBundle(_options, bundle) {
      const template = await readFile(resolve(config.publicDir, 'firebase-messaging-sw.js'), 'utf8');
      const favicon = await readFile(resolve(config.publicDir, 'favicon.svg'));
      const files = Object.keys(bundle).filter(name => /\.(html|js|css|svg|woff2?)$/.test(name)).sort();
      const hash = createHash('sha256').update(template).update(favicon);
      for (const name of files) {
        const item = bundle[name];
        hash.update(name).update(item.type === 'chunk' ? item.code : item.source);
      }
      const urls = [...files.map(name => config.base + name), config.base + 'favicon.svg'];
      const source = template
        .replace('const PRECACHE_URLS = [];', `const PRECACHE_URLS = ${JSON.stringify(urls)};`)
        .replace("const CACHE_NAME = 'notify-shell-development';", `const CACHE_NAME = 'notify-shell-${hash.digest('hex').slice(0, 16)}';`)
        .replace("const APP_SHELL = '/index.html';", `const APP_SHELL = ${JSON.stringify(config.base + 'index.html')};`);
      await writeFile(resolve(config.root, config.build.outDir, 'firebase-messaging-sw.js'), source);
    },
  };
}
