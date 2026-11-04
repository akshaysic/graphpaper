# ScrollMorph

A pinned section where scrolling turns a loose node graph into a two-pane tool: the headline emphasis swaps, the toggle slides, the side nodes fade, the prompt and output dock side by side, and a Run tab appears.

**You provide** `left` and `right` headline halves, the stage `height`, the `runway` (stage heights of scroll it takes, 2.6 by default), the `prompt` text and the output's `alt`.

Scroll is the clock: every position follows progress through `ease-out-cubic`, so scrolling back reverses it exactly. Connectors and side nodes fade out by 55%; the Run tab fades in from 55% to 90%. The toggle also works as a button and scrolls to either end.

Under reduced motion the section does not pin: the toggle swaps between the two views instantly.
