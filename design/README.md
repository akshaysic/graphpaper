Graphpaper is a system for showing a creative tool built from nodes: big quiet type, a graph-paper ground, flat surfaces, curved connectors, and one lemon accent that always means "act here". It reads as a calm workspace with one loud button.

## Voice and content

- Headlines are short claims in Title Case, two to five words, often split into two halves that face each other: "From Graph" and "to Tool".
- Intros are one or two plain sentences in sentence case. Say what the thing does.
- Everything set in `label` or `label-wide` is uppercase. Chip labels and card titles are Title Case.
- Calls to action are a verb and at most one more word: "Start now", "Try", "Run".
- No emoji, no exclamation marks, no superlatives.

## Color

- Build pages from alternating bands: `paper` with the grid for product sections, plain `ground` for reading, and dark bands (`data-theme="dark"` on the section) for card rails, scroll-spy lists and the footer surround.
- `lemon` is the only accent: CTA tabs, the toggle, header bands, a hovered chip, the active scroll-spy item. If two lemon things compete in one view, remove one.
- Text is `ink`, secondary text `ink-muted`. `ink-faint` is for display sizes only.
- Fills that stay light in both themes (`lemon`, `sage`, `eggshell`, `media`) always carry `on-light` text.
- `connector` is decorative. Controls without a fill are outlined in `ink`.

## Type

- One family (Geist) at one weight (400). Size, case and tracking carry the hierarchy.
- Eight styles: `display-xl` for section headlines, `display-l` for the nav CTA and the footer name, `title` for cards, `intro` for intros and chips, `body` for anything longer than three lines, `small` inside nodes and cards, `label` for links, bands, tags and hints, `label-wide` for node model names and the copyright line.
- `display-xl` scales with clamp(44px, 6.53vw, 94px). Everything else stays fixed: body never goes below 16px and labels never below 12px on phones.
- Components set type by adding the style's class. Do not declare font sizes in component CSS.

## Layout and spacing

- Five steps: `space-xs` inside small things, `space-s` inside cards and canvases, `space-m` between cards and between a headline and its intro, `space-l` as the page gutter at 1440, `space-xl` between major sections and from the nav to a hero headline. On phones the gutter is `space-s`.
- Content runs the full width between gutters. Split headlines push their halves to opposite edges and keep the middle for a joiner.
- Breakpoints: 991, 767 and 479. Below 768 split headlines stack, node dragging turns off and the nav CTA renders compact.

## Shapes

- Corners are square unless the thing is media, a node, a chip, a card or a panel (`radius-m`), a panel of cards (`radius-l`), a link hover or tag (`radius-s`), or the toggle (`radius-pill`).
- The CTA tab is a lemon block flush against an edge with one rounded corner, the one facing into the page. The footer slab is the only other one-corner shape. Both large ones use `radius-xl`.
- `GraphPaper` rules `paper` every `grid-cell` with `grid-line`. Connectors are cubic curves in `connector`, leaving outputs and entering inputs horizontally, ending in port discs.

## Motion

Motion shows structure: that nodes connect, that a list is being read, that a graph and a tool are the same thing. It never decorates a still page.

- **Two clocks, never mixed on one property.** Scroll-linked effects map scroll position straight onto the value and reverse exactly when the reader scrolls back: the nav compress, the graph-to-tool morph, scroll-spy activation. Time-based effects are short tweens after an event, using only the duration and easing tokens.
- **Durations.** `dur-instant` dims and fades out, `dur-fast` fills and fades in, `dur-base` covers every other hover, `dur-slow` covers everything that moves.
- **Easing.** `ease-out-quad` for colour, fill and opacity; `ease-out-cubic` for movement.
- **Smooth scroll.** Lenis 1.2.3 with `lerp: 0.1` and `wheelMultiplier: 0.9`, touch left native, run from the same frame loop as the scroll-linked effects.
- **Hover focus.** Hovering one item can dim its siblings to `opacity-dim` and swap a related image. Leaving restores everything.
- **Reduced motion.** Keep every colour and fill change and drop all movement: no smooth scroll, reveals, press scales or slide transitions; the morph stops pinning and its toggle swaps views instantly; videos stay paused. Dragging stays, because the reader drives it.

```js
// Pin lenis@1.2.3. Skip it entirely under reduced motion.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9, smoothTouch: false });
  (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
}
```

## States and focus

- Hover changes fill, never size: lemon to `ink` on CTA tabs, `surface` to `lemon` on chips, none to `surface` on links and arrow buttons.
- Keyboard focus on every control is `focus-ring`.
- Active states change more than hue: a fill, a lightness jump (`ink-faint` to `lemon`), or `aria-current`.
- No shadows, gradients or blurs. Surfaces separate by value and by the grid.

## Imagery and marks

- Photography and renders are the colour in this system. Keep everything around them neutral. One subject per frame, plain grounds, soft light.
- Video plays muted and inline, one at a time, and pauses out of view.
- Until an image exists, show `media` with its alt text written out.
- No icon set: arrows are text glyphs and the plus is a "+" at headline size. No logo ships with the system; set the name in `label` in the nav and `display-l` in the footer until a mark is added.

## Building with it

- Components are in `components/bundle.js` as `window.Graphpaper` and need React 18. `components/bundle.css` reads only token variables and the type classes.
- Give each band its theme with `data-theme`. The footer sets its own.
- `Graphpaper.useScrollProgress(ref, { start, end })` returns 0 to 1 for scroll-linked effects; `Graphpaper.useReducedMotion()` returns the reader's preference.
