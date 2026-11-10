# ScrollSpyList

A sticky headline beside a long `display-xl` list; the name crossing the upper part of the viewport lights up as you scroll.

**You provide** `items`, the `aside` (usually a SectionIntro), and `onActiveChange` to swap a background per item. Pass `height` to make it its own scroll area; leave it out to follow the window.

An item activates when its top crosses 20% of the viewport (40% below 768px). Inactive names are `ink-faint`; the active one turns `action-ink` over `dur-instant`. Use it on dark bands: on a light band the active item falls back to `ink`. Crossfade backgrounds over `dur-instant` and pause videos that are not active. Names are buttons that scroll themselves into place.
