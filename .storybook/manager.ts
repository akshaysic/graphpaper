import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const BRAND = 'Graphpaper';
// "Storybook", "<page> ⋅ Storybook" once a page loads, or "<title> - Storybook" from the static HTML.
const STORYBOOK_TITLE = /^(?:(.*) [⋅-] )?Storybook$/;

// Keep Storybook's own behaviour of following the system colour scheme for the chrome.
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

addons.setConfig({
  theme: create({ base: prefersDark ? 'dark' : 'light', brandTitle: BRAND, brandUrl: './', brandTarget: '_self' }),
});

// Storybook 10 writes "Storybook" into every tab title and has no option for it,
// so the title is rewritten each time the manager sets it. A branded title no longer matches, so this cannot loop.
function brandDocumentTitle() {
  const match = document.title.match(STORYBOOK_TITLE);
  if (!match) return;
  const page = match[1];
  document.title = !page || page === BRAND ? BRAND : `${page} ⋅ ${BRAND}`;
}

new MutationObserver(brandDocumentTitle).observe(document.head, { childList: true, subtree: true, characterData: true });
brandDocumentTitle();
