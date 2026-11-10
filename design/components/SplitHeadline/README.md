# SplitHeadline

A display headline split into two halves at opposite ends of the row, with an optional joiner in the gap.

**You provide** `left`, `right`, an optional `joiner` (`"+"` or a Toggle) and `emphasis`: the half in `ink`, the other resting in `ink-faint`. Leave it at `both` for a static statement. `size="l"` uses `display-l` inside a pinned section.

Emphasis swaps over `dur-base`. The plus turns `action-ink` and rotates 45 degrees on hover (colour only under reduced motion). Below 768px the halves stack, the second right-aligned. Two or three words a half.
