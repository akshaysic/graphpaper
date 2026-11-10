Graphpaper is a system for showing a creative tool built from nodes: big quiet type, a graph-paper ground, flat surfaces, curved connectors, and one action colour that always means "act here". It reads as a calm workspace with one loud button.

## Voice and content

- Headlines are short claims in Title Case, two to five words, often split into two halves that face each other: "From Graph" and "to Tool".
- Intros are one or two plain sentences in sentence case. Say what the thing does.
- Everything set in `label` or `label-wide` is uppercase. Chip labels and card titles are Title Case.
- Calls to action are a verb and at most one more word: "Start now", "Try", "Run".
- No emoji, no exclamation marks, no superlatives.

## Color

- Build pages from alternating bands: `paper` with the grid for product sections, plain `ground` for reading, and dark bands (`data-theme="dark"` on the section) for card rails, scroll-spy lists and the footer surround.
- `action` is the only accent. It fills CTA tabs, the toggle, header bands that mean "act here" and a hovered chip. Text on it is `on-action`.
- `action-ink` is for links and text accents: the darker shade on ground, paper and white in light, `action` itself on dark bands. The active scroll-spy item on a dark band uses it.
- One action element per view: if two compete, remove one.
- Text is `ink`, secondary text `ink-muted`. `ink-faint` is for display sizes only.
- `action` carries `on-action` text. The other fills that stay light in both themes (`sage`, `eggshell`, `media`) always carry `on-light` text.
- `connector` is decorative. Controls without a fill are outlined in `ink`.

## Type

- One family (Geist) at one weight (400). Size, case and tracking carry the hierarchy.
- Eight styles: `display-xl` for section headlines, `display-l` for the footer name, `title` for cards, `intro` for intros and chips, `body` for anything longer than three lines and for the nav, `small` inside nodes and cards, `label` and `label-wide` for tags, eyebrows and evidence-kind labels.
- `display-xl` scales with clamp(44px, 6.53vw, 94px). Everything else stays fixed: body never goes below 16px and labels never below 12px on phones.
- Components set type by adding the style's class. Do not declare font sizes in component CSS.

### Type floor

- Anything people read is 16px or more: nav, links, body, captions, table cells, form labels.
- `label` and `label-wide` (12px, uppercase) are for tags, eyebrows and evidence-kind labels only.
- `intro` is 20/30.

## Layout and spacing

- Five steps: `space-xs` inside small things, `space-s` inside cards and canvases, `space-m` between cards and between a headline and its intro, `space-l` as the page gutter at 1440, `space-xl` between major sections and from the nav to a hero headline. On phones the gutter is `space-s`.
- Content runs the full width between gutters. Split headlines push their halves to opposite edges and keep the middle for a joiner.
- Breakpoints: 991, 767 and 479. Below 768 split headlines stack, node dragging turns off and the nav switches to its Menu sheet (see Navigation).

## Shapes

- Corners are square unless the thing is media, a node, a chip, a card or a panel (`radius-m`), a panel of cards (`radius-l`), a link hover or tag (`radius-s`), or the toggle (`radius-pill`).
- The CTA tab is an `action` block flush against an edge with one rounded corner, the one facing into the page. The footer slab is the only other one-corner shape. Both large ones use `radius-xl`.
- `GraphPaper` rules `paper` every `grid-cell` with `grid-line`. Connectors are cubic curves in `connector`, leaving outputs and entering inputs horizontally, ending in port discs.

## Motion

Motion shows structure: that nodes connect, that a list is being read, that a graph and a tool are the same thing. It never decorates a still page.

- **Two clocks, never mixed on one property.** Scroll-linked effects map scroll position straight onto the value and reverse exactly when the reader scrolls back: the nav surface, the graph-to-tool morph, scroll-spy activation. Time-based effects are short tweens after an event, using only the duration and easing tokens.
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

- Hover changes fill, never size: `action` to `ink` on CTA tabs, `surface` to `action` on chips, none to `surface` on links and arrow buttons.
- Keyboard focus on every control is `focus-ring`.
- Active states change more than hue: a fill, a lightness jump (`ink-faint` to `action-ink`), or `aria-current`.
- No shadows, gradients or blurs. Surfaces separate by value and by the grid.

## Navigation

The NavBar follows these rules.

1. Content: the wordmark "Akshay Gite" on the left (links home), at most four text links, one action on the right. No logo glyph, no icons except the phone menu control.
2. Type: wordmark and links in `body` (16/24), sentence case, weight 400, no letter-spacing.
3. Current page: `aria-current="page"`, shown as an ink pill (radius-s, 4px by 8px padding, ground-coloured text). Shape and colour together, never colour alone.
4. Hover: 1px underline, offset 4px, dur-base. Focus: `focus-ring`. Every target at least 44px tall.
5. Action: CtaTab size "s" with "Book a call". Flush to the top-right corner, one rounded corner facing into the page. It is the only action-coloured thing in the nav.
6. Layout: 64px tall, side padding equals the page gutter (space-l at 1440, space-s below 768), items on one baseline.
7. Surface: solid. At the top of the page it takes the ground of the band below it; after 150px of scroll (scroll-linked, reverses) it becomes solid `ground` with a 1px `connector` bottom border. No mix-blend modes, no blur, no transparency. This fixes links turning dark over images.
8. Behaviour: sticky and always visible. It does not hide on scroll. Over dark bands it stays light.
9. Below 768: wordmark, a text button "Menu", and the action tab. "Menu" opens a full-screen sheet on `ground` with the links at `title` size in 56px rows and a "Close" button. Focus is trapped, Esc closes, the page behind does not scroll. Under reduced motion the sheet appears without sliding.
10. First focusable element on every page: a "Skip to content" link, visible on focus.
11. Link order on akshaygite.com: Design work, How I work, About, Audio work.

## Footer

FooterSlab is frozen as it is in the current mockup. No changes in v1.1.

## Imagery and marks

- Photography and renders are the colour in this system. Keep everything around them neutral. One subject per frame, plain grounds, soft light.
- Video plays muted and inline, one at a time, and pauses out of view.
- Until an image exists, show `media` with its alt text written out.
- No icon set: arrows are text glyphs and the plus is a "+" at headline size. No logo ships with the system; set the name in `body` in the nav (see Navigation) and `display-l` in the footer until a mark is added.

## Building with it

- Components are in `components/bundle.js` as `window.Graphpaper` and need React 18. `components/bundle.css` reads only token variables and the type classes.
- Give each band its theme with `data-theme`. The footer sets its own.
- `Graphpaper.useScrollProgress(ref, { start, end })` returns 0 to 1 for scroll-linked effects; `Graphpaper.useReducedMotion()` returns the reader's preference.
