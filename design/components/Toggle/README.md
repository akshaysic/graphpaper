# Toggle

A lemon pill switch with a dark knob, placed between the two halves of a SplitHeadline to switch between two views of the same thing.

**You provide** `checked` and `onChange` for a normal switch, or `progress` from 0 to 1 when scroll drives it, plus a `label`.

Track `lemon`, 114 by 60, inset `space-xs`; knob `on-light`. Clicked, the knob travels over `dur-slow` with `ease-out-cubic`. Driven by scroll, it follows the scroll with no easing of its own. Under reduced motion it jumps.
