// @ts-check
// Runs after build-storybook. Storybook writes "<title> - Storybook" into the static index.html and has
// no option for it; link previews and search results read that title before any script runs.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const INDEX_PATH = join(dirname(fileURLToPath(import.meta.url)), '..', 'storybook-static', 'index.html');

const html = readFileSync(INDEX_PATH, 'utf8');
const branded = html.replace(/<title>(.*?) - Storybook<\/title>/, '<title>$1</title>');
if (branded === html) {
  throw new Error('storybook-static/index.html has no "<title> - Storybook" to rewrite. Check the Storybook manager template.');
}
writeFileSync(INDEX_PATH, branded);
console.log(`Static title: ${branded.match(/<title>(.*?)<\/title>/)?.[1]}`);
