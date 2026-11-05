import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { addons } from 'storybook/preview-api';

export type Theme = 'light' | 'dark';

type GlobalsEvent = { globals: { theme?: unknown } };

// Docs pages are not stories, so decorators never see their globals. This mirrors the Theme
// toolbar value from the preview channel so the docs container can follow it too.
let currentTheme: Theme = 'light';
const listeners = new Set<() => void>();

export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getTheme(): Theme {
  return currentTheme;
}

function handleGlobals({ globals }: GlobalsEvent) {
  const nextTheme: Theme = globals.theme === 'dark' ? 'dark' : 'light';
  if (nextTheme === currentTheme) return;
  currentTheme = nextTheme;
  listeners.forEach((listener) => listener());
}

const channel = addons.getChannel();
channel.on(SET_GLOBALS, handleGlobals);
channel.on(GLOBALS_UPDATED, handleGlobals);
