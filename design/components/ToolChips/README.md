# ToolChips

Tool names around a centre image; hovering a chip highlights it, dims the rest and swaps the image to that tool's result.

**You provide** `items` (`label`, plus `src` and `alt` for its result), `layout` (`scatter` with `positions` in percent, or `row`), and a `center` with the default image.

Chips are `surface` with `radius-m` and `intro` text. On hover or focus the chip fills `action` over `dur-fast` and the others drop to `opacity-dim` over `dur-instant`; the new image fades in over `dur-fast`, the old one out over `dur-instant`. Everything resets when the cloud leaves the viewport. Under reduced motion the image swaps without a fade.
