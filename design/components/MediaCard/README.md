# MediaCard

A card for one example: a `title` above a 5:3 image, an optional chain of step tags across the image, and a small CtaTab in its bottom-left corner.

**You provide** `title`, `src` and `alt`, up to four `tags`, `href` or `onAction`, and `actionLabel` (Try by default). Set `active` for the centred card in a rail.

Built for dark bands. The image box is `radius-m`; tags are `label` text outlined in `on-light` with `radius-s`. The active card's image scales to 1.05 inside its frame over `dur-slow`, so the card itself never grows.
