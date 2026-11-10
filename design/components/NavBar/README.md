# NavBar

The top bar: the wordmark at the left, at most four text links, and one CtaTab flush in the top-right corner. It follows the Navigation rules in the system README.

**You provide** `brand` (the wordmark), `brandHref` (home), `links` (mark the current page with `current`), `cta` and `progress` from 0 to 1. Feed it from `useScrollProgress(null, { start: 0, end: 150 })`, or pass a ref for a scroll container. Set `band` to the ground of the band below the bar (`ground` or `paper`) and `skipTo` to the main content (`#content` by default).

The bar is 64px tall and solid. At the top of the page it takes the ground of the band below; over the first 150px of scroll it turns `ground` with a 1px `connector` border, and scrolling back reverses it. It is sticky, never hides, and stays light over dark bands. Wordmark and links are `body`. The current page is an ink pill. Hover draws a 1px underline over `dur-base`. The tab is size "s" with a `body` label.

Below 768px the links fold into a "Menu" button. It opens a full-screen sheet on `ground`. The top row keeps the wordmark and the action tab, with "Close" where "Menu" was; below it the links sit at `title` size in 56px rows. Focus stays in the sheet, Esc closes it, and the page behind does not scroll. Under reduced motion the sheet appears without sliding.

A "Skip to content" link comes before the bar. Place the NavBar first on the page so that link is the first focusable element.
