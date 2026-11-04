# CardRail

A centred carousel of MediaCards with a pair of ArrowButtons and a position count.

**You provide** `items` (MediaCard props), a `label`, and optionally `start`, `cardWidth` (420) and `gap` (28.8, `space-m`).

The active card sits in the centre. Moves take `dur-slow` with `ease-out-cubic` and wrap from the last card to the first; under reduced motion they jump. The count is announced politely. Five to eight cards, never autoplay.
