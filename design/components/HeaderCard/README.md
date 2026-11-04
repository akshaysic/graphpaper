# HeaderCard

A card with a lemon header band above its body, used for the prompt and output panes of a tool.

**You provide** `label` (one word, set in `label`), `tone` (`text` by default on `eggshell`, or `media`), the body or `src` and `alt`, and an optional `action` that puts a small CtaTab flush in the bottom-left corner.

Group cards in `Graphpaper.Panel`: a grid with `space-xs` gaps and inset and `radius-l` corners. The band and the action are the only lemon in a panel.
