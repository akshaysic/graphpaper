# CtaTab

The only call to action: a flat action-coloured block pushed flush against an edge, with one rounded corner facing into the page.

**You provide** a label (a verb, two words at most), `href` or `onClick`, a `size` and the `corner` that rounds.

- `s`: `label` type. Cards, panels, and the nav once compressed.
- `l`: `display-l` type. The nav at the top of a page.
- `xl`: `display-xl` type, fluid, corner `radius-xl`. The footer only.

Round the corner that faces into the page: `bl` for the nav tab in the top-right corner, `tr` for a tab at the bottom-left of an image, `tl` for the footer tab. The other three corners stay square and flush.

Fill `action`, label `on-action`. Hover flips to an `ink` fill with a `ground` label over `dur-base`. That colour change is its only motion.

One per viewport, plus the action tab on each card. No icons, outlines or four rounded corners.
