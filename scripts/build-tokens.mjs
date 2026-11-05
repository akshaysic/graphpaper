// @ts-check
// Compiles src/tokens/tokens.json into src/tokens/tokens.css. See docs/BRIEF.md, "Token compile".
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOKENS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'tokens');
const SOURCE_PATH = join(TOKENS_DIR, 'tokens.json');
const OUTPUT_PATH = join(TOKENS_DIR, 'tokens.css');
const HEADER = '/* Graphpaper: generated from tokens.json */';
const ALIAS_PATTERN = /^\{([a-z0-9-]+)\}$/;
// tokens.css sits in src/tokens/, while font paths in tokens.json are relative to src/.
const FONT_URL_PREFIX = '../';

const tokens = JSON.parse(readFileSync(SOURCE_PATH, 'utf8'));

const themedTokens = [...tokens.color.tokens, ...tokens.shadow.tokens];
const fixedTokens = [
  ...tokens.spacing.tokens,
  ...tokens.radius.tokens,
  ...tokens.duration.tokens,
  ...tokens.easing.tokens,
  ...tokens.opacity.tokens,
];
const familyEntries = Object.entries(tokens.type.families);

const knownNames = new Set([
  ...themedTokens.map((token) => token.name),
  ...fixedTokens.map((token) => token.name),
  ...familyEntries.map(([familyKey]) => `font-${familyKey}`),
]);
const missingAliases = [];

const css = [
  HEADER,
  block(':root, [data-theme="light"]', themedTokens.map((token) => declaration(token.name, lightValue(token.value)))),
  block(
    '[data-theme="dark"]',
    themedTokens.filter((token) => hasDarkValue(token.value)).map((token) => declaration(token.name, token.value.dark)),
  ),
  block(':root', [
    ...fixedTokens.map((token) => declaration(token.name, token.value)),
    ...familyEntries.map(([familyKey, stack]) => declaration(`font-${familyKey}`, stack)),
  ]),
  ...tokens.type.groups.flatMap((group) => group.styles.map((style) => typeClass(group, style))),
  ...tokens.type.fonts.map(fontFace),
].join('\n\n');

if (missingAliases.length > 0) {
  console.error(`build-tokens: ${SOURCE_PATH} aliases tokens that do not exist: ${missingAliases.join(', ')}`);
  process.exit(1);
}

writeFileSync(OUTPUT_PATH, `${css}\n`);
console.log(`build-tokens: wrote ${OUTPUT_PATH}`);

function block(selector, lines) {
  return `${selector} {\n${lines.map((line) => `  ${line}`).join('\n')}\n}`;
}

function declaration(name, value) {
  return `--${name}: ${resolve(value, name)};`;
}

function lightValue(value) {
  return typeof value === 'string' ? value : value.light;
}

function hasDarkValue(value) {
  return typeof value === 'object' && value !== null && 'dark' in value;
}

function resolve(value, usedBy) {
  const alias = ALIAS_PATTERN.exec(String(value));
  if (!alias) return value;
  if (!knownNames.has(alias[1])) missingAliases.push(`${usedBy} -> {${alias[1]}}`);
  return `var(--${alias[1]})`;
}

function typeClass(group, style) {
  const family = style.family ?? group.family;
  if (!tokens.type.families[family]) missingAliases.push(`${style.name} -> family "${family}"`);
  return block(`.${style.name}`, [
    `font-family: var(--font-${family});`,
    `font-size: ${style.fontSize};`,
    `line-height: ${style.lineHeight};`,
    `font-weight: ${style.fontWeight};`,
    // A style without tracking resets it, so a .small inside a .label-wide does not inherit 0.2em.
    `letter-spacing: ${style.letterSpacing ?? 'normal'};`,
  ]);
}

function fontFace(font) {
  return block('@font-face', [
    `font-family: "${font.family}";`,
    `src: url("${FONT_URL_PREFIX}${font.file}") format("woff2");`,
    `font-weight: ${font.weight};`,
    `font-style: ${font.style};`,
    'font-display: swap;',
  ]);
}
