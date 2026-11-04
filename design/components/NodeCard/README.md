# NodeCard

One node of a workflow: a header naming what it is above a body that holds an image or a short text.

**You provide** `type` (Image, Text, Video), `model` (the tool it runs), `kind` (`media` or `text`), `src` and `alt` for media, text as children, and `width` and `height` for the body.

The header sets `type` in `label` and `model` in `label-wide` with `ink-muted`, `space-xs` above the body. Media bodies are `radius-m` and show their alt text on `media` until an image exists. Text bodies are `surface` with `small` text.
