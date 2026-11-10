# CardRail

A centred carousel of MediaCards with a pair of ArrowButtons and a position count.

**You provide** `items` (MediaCard props), a `label`, and optionally `start`, `cardWidth` (420) and `gap` (28.8, `space-m`).

The active card sits in the centre. Moves take `dur-slow` with `ease-out-cubic` and wrap from the last card to the first; under reduced motion they jump. The count is announced politely. Card tabs are neutral, `surface` with `ink` text, and take `action` only on hover and focus, so the rail never shows a row of action tabs. Five to eight cards, never autoplay.
