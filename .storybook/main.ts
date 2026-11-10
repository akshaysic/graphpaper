import { readFileSync } from 'node:fs';

import type { StorybookConfig } from '@storybook/react-vite';

const SITE_URL = 'https://graphpaper.akshaygite.com';
const SITE_TITLE = 'Graphpaper';
const READ_ME_FIRST = new URL('../src/foundations/ReadMeFirst.mdx', import.meta.url);

// The link-preview text is the first sentence of Read me first, so the two cannot drift apart.
function firstSentence(mdx: string): string {
  const paragraph = mdx
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line !== '' && !/^(import |<|#)/.test(line));
  const sentence = paragraph?.match(/^.*?\.(?=\s|$)/)?.[0];
  if (!sentence) throw new Error('Read me first has no opening sentence for the meta description.');
  return sentence;
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

const description = escapeAttribute(firstSentence(readFileSync(READ_ME_FIRST, 'utf8')));

const linkPreviewHead = `
  <meta name="description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${SITE_URL}/">
  <meta property="og:title" content="${SITE_TITLE}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${SITE_URL}/og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Graphpaper: nodes, graph paper and one action accent.">
  <meta name="twitter:card" content="summary_large_image">
`;

// Storybook reads `title` for the static page <title>, but its config type leaves the field out.
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
  title: SITE_TITLE,
  // favicon.ico and og.png live here; scripts/build-share-images.mjs writes them.
  staticDirs: ['./public'],
  managerHead: (head: string) => `${head}${linkPreviewHead}`,
} satisfies StorybookConfig & { title: string };

// Storybook reads the default export.
export default config;
