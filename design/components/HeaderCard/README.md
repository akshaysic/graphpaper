# HeaderCard

A card with a header band above its body, used for the prompt and output panes of a tool.

**You provide** `label` (one word, set in `label`), `tone` (`text` by default on `eggshell`, `media`, or `action`), the body or `src` and `alt`, and an optional `action` that puts a small CtaTab flush in the bottom-left corner.

The band is neutral, `eggshell` with `on-light` text. `tone="action"` fills it with `action` for the rare band that means "act here"; nothing uses it by default.

Group cards in `Graphpaper.Panel`: a grid with `space-xs` gaps and inset and `radius-l` corners. The action tab is the only action colour in a panel.
