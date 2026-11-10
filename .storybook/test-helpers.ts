// Helpers for play functions. They run in the Storybook UI and under npm test alike.

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Answers the reduced-motion query with "reduce" for one story, so useReducedMotion behaves as it does
 * with the setting on. A play function cannot change the browser's media settings, so tests use this.
 * Use it as a story's beforeEach; it returns the cleanup that restores matchMedia.
 */
export function emulateReducedMotion(): () => void {
  const original = window.matchMedia;
  // "all" always matches, so the result is a real MediaQueryList with matches set to true.
  window.matchMedia = (query: string) => original.call(window, query === REDUCED_MOTION_QUERY ? 'all' : query);
  return () => {
    window.matchMedia = original;
  };
}

/** The RGBA bytes a colour paints, so rgb(), color(srgb ...) and color-mix() results compare equal. */
export function paint(color: string): number[] {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('No 2D canvas context');
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  return Array.from(context.getImageData(0, 0, 1, 1).data);
}

/** What a colour token paints inside an element, in that element's theme. */
export function tokenPaint(inside: Element, token: string): number[] {
  const probe = document.createElement('span');
  probe.style.color = `var(${token})`;
  inside.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return paint(color);
}
