// @ts-check
// Renders the link-preview image and favicon from design/components/Cover/preview.html.
// The output is committed: the Vercel build has no browser to run this, so rerun it by hand when the cover changes.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const COVER_PATH = join(ROOT, 'design', 'components', 'Cover', 'preview.html');
const TOKENS_CSS_PATH = join(ROOT, 'src', 'tokens', 'tokens.css');
const FONT_PATH = join(ROOT, 'src', 'fonts', 'Geist-Variable.woff2');
const OUTPUT_DIR = join(ROOT, '.storybook', 'public');

// The cover is 960x288. Open Graph wants 1200x630, the same ratio as 960x504 drawn at 1.25x,
// so the cover keeps its own sizes and only grows taller.
const COVER_WIDTH = 960;
const COVER_HEIGHT = 288;
const SHARE_HEIGHT = 504;
const SHARE_SCALE = 1.25;
// The art is a 480-wide SVG. Extra rows of graph paper go above the nodes, so the lemon tab
// still bleeds off the bottom-right corner as it does on the cover.
const ART_WIDTH = 480;
const EXTRA_PAPER = SHARE_HEIGHT - COVER_HEIGHT;

// The favicon is the lemon tab's rounded corner with the wire and port that reach it, cropped from the same art.
const FAVICON_SIZE = 64;
const FAVICON_VIEWBOX = '274 180 64 64';

const fontDataUrl = `data:font/woff2;base64,${readFileSync(FONT_PATH).toString('base64')}`;
const tokensCss = readFileSync(TOKENS_CSS_PATH, 'utf8').replace(/url\("[^"]*Geist-Variable\.woff2"\)/, `url("${fontDataUrl}")`);
const coverHtml = readFileSync(COVER_PATH, 'utf8');

const browser = await chromium.launch();
try {
  writeFileSync(join(OUTPUT_DIR, 'og.png'), await renderShareImage());
  writeFileSync(join(OUTPUT_DIR, 'favicon.ico'), pngToIco(await renderFavicon(), FAVICON_SIZE));
} finally {
  await browser.close();
}
console.log('Wrote .storybook/public/og.png and .storybook/public/favicon.ico');

async function renderShareImage() {
  const page = await openCover({ width: COVER_WIDTH, height: SHARE_HEIGHT }, SHARE_SCALE);
  await page.addStyleTag({ content: `.cover, .art, .art svg { height: ${SHARE_HEIGHT}px; }` });
  await page.evaluate(
    ({ artWidth, extraPaper, shareHeight }) => {
      const svg = document.querySelector('.art svg');
      if (!svg) throw new Error('Cover art not found');
      svg.setAttribute('viewBox', `0 ${-extraPaper} ${artWidth} ${shareHeight}`);
      svg.setAttribute('height', String(shareHeight));
      // The paper and its grid are the two full-width rects; stretch them over the new rows.
      for (const rect of svg.querySelectorAll(`rect[width="${artWidth}"]`)) {
        rect.setAttribute('y', String(-extraPaper));
        rect.setAttribute('height', String(shareHeight));
      }
    },
    { artWidth: ART_WIDTH, extraPaper: EXTRA_PAPER, shareHeight: SHARE_HEIGHT },
  );
  const image = await page.screenshot({ type: 'png' });
  await page.close();
  return image;
}

async function renderFavicon() {
  const page = await openCover({ width: FAVICON_SIZE, height: FAVICON_SIZE }, 1);
  await page.addStyleTag({
    content: `.words { display: none; } .cover, .art, .art svg { width: ${FAVICON_SIZE}px; height: ${FAVICON_SIZE}px; } .art { left: 0; }`,
  });
  await page.evaluate((viewBox) => document.querySelector('.art svg')?.setAttribute('viewBox', viewBox), FAVICON_VIEWBOX);
  const image = await page.screenshot({ type: 'png' });
  await page.close();
  return image;
}

/**
 * @param {{ width: number; height: number }} viewport
 * @param {number} deviceScaleFactor
 */
async function openCover(viewport, deviceScaleFactor) {
  const page = await browser.newPage({ viewport, deviceScaleFactor, colorScheme: 'light', reducedMotion: 'reduce' });
  await page.setContent(coverHtml);
  await page.addStyleTag({ content: tokensCss });
  await page.evaluate(() => document.fonts.ready);
  return page;
}

// An .ico file can hold a PNG as-is: a 6-byte header, one 16-byte directory entry, then the PNG.
/**
 * @param {Buffer} png
 * @param {number} size
 */
function pngToIco(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(header.length, 18);
  return Buffer.concat([header, png]);
}
