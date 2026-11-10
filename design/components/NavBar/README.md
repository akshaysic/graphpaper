# NavBar

The top bar: a brand at the left, `label` links at the right, and a CtaTab flush in the top-right corner that compresses as the page scrolls.

**You provide** `brand` (text or your mark), `links`, `cta`, and `progress` from 0 to 1. Feed it from `useScrollProgress(null, { start: 0, end: 150 })`, or pass a ref for a scroll container.

Over the first 150px of scroll the CTA goes from `display-l` to `label` size and from `space-s` to `space-xs` padding, eased with `ease-out-cubic`, and turns uppercase halfway. On phones render it compact from the start.

`position="sticky"` or `"fixed"` renders two zero-height layers so the links can `blend`: white text with `mix-blend-mode: difference` that reads dark on light bands and light on dark ones, while the CTA keeps its action fill. Place the NavBar as a direct child of the scrolling element; any ancestor with a z-index, transform or opacity below 1 cuts the blend off from the page.
