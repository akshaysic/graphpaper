# NodeCanvas

A graph-paper canvas of NodeCards joined by curved connectors; every node can be dragged.

**You provide** `nodes` (`id`, `x`, `y`, `w`, `h` plus NodeCard fields), `links` as pairs of ids from output to input, a `height`, and for phones `nodesMobile` and `linksMobile`.

Connectors are cubic curves in `connector` at 1.4px with 4.5px port discs ringed in `surface`, redrawn on every drag frame. Nodes clamp to the canvas. Below 768px of canvas width dragging is off and the nodes stack in one column in pipeline order: connectors leave the bottom of a node and enter the top of the next, a link that skips nodes runs down a lane to the right of the column, and the canvas grows to fit. `nodesMobile` and `linksMobile` choose which nodes and links the stack shows. A focused node moves with the arrow keys (8px, Shift for 32px). Dragging is the user's own movement, so it stays on under reduced motion.

Six to eight nodes, one pipeline per canvas.
