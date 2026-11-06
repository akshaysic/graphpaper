# Graphpaper: phase prompts

Each phase is one Claude Code run. Read docs/BRIEF.md first. Stop at every gate: Akshay reviews and commits before the next phase starts.

| Phase | Status |
|---|---|
| 1 Foundations | Done, 1586db8 |
| 2a Static components | Next |
| 2b Behaviour components | To do |
| 3 QA | To do |
| 4 Publish | To do |
| 5 Portfolio link | Runs in the akshaygite.com repo |
| 6 Sync back | Only when Akshay asks |

When a phase passes its checks, set its row to "Ready to commit" in this table.

## Phase 1: Foundations

Done in commit 1586db8, including the heading-weight and grid-line swatch fixes.

## Phase 2a: Static components (one run)

```
Read docs/BRIEF.md first.

If the Playwright Chromium browser is not installed, run npx playwright install chromium first.

Task: port CtaTab, NavLink, ArrowButton, Toggle, SplitHeadline, SectionIntro, GraphPaper, NodeCard, HeaderCard (with Panel) and MediaCard from design/components/bundle.js, each with stories, following BRIEF Porting rules and Stories. Export them from src/index.ts.

Then:
- Run lint, typecheck, build-storybook and the accessibility check on every story in both themes. Fix violations in the component, not the story.
- Screenshot each component's first story at 1440 in light and dark next to its design/components/<Name>/preview.html and list every difference you could not fix.

Do not commit.
```

**Gate (Akshay):** click through the ten components in both themes. Fix anything that looks off now, before the behaviour components build on them.

## Phase 2b: Behaviour components (one run)

```
Read docs/BRIEF.md first.

Task: port NavBar, NodeCanvas, ToolChips, CardRail, ScrollSpyList, FooterSlab, ScrollMorph and Reveal from design/components/bundle.js, each with stories, following BRIEF Porting rules and Stories. Export them from src/index.ts.

Add one interaction test each:
- Toggle: a click flips aria-checked.
- CardRail: Next moves the count from 2 / 5 to 3 / 5.
- ToolChips: hovering a chip dims every other chip.
- NodeCanvas: a focused node moves 8px on ArrowRight.
- ScrollSpyList: scrolling its container activates the next item.
- ScrollMorph: with reduced motion emulated, the toggle swaps to the tool view without scrolling.
- NavBar: scrolling its container 150px adds the compact state to the CTA.

Then run lint, typecheck, tests, build-storybook and the accessibility check in both themes. Report results per component. Do not commit.
```

**Gate (Akshay):** in the browser, drag the canvas, scroll the NavBar, ScrollSpyList and ScrollMorph stories, and page the rail. Then turn on reduced motion in DevTools and repeat: colour changes stay, movement stops.

## Phase 3: QA (one run)

```
Read docs/BRIEF.md first.

Task: check the library against the BRIEF before it becomes the source of truth.

1. Every story at 390, 768 and 1440: no horizontal scroll. Below 768: split headlines stack, NodeCanvas dragging is off, the NavBar CTA is compact.
2. With reduced motion emulated, nothing transitions on transform, ScrollMorph does not pin, CardRail moves without a transition. Colour changes still run.
3. Greps, fix every hit: font-size outside the four in components.css; hex colours outside tokens.json and the nav blend; any var(--name) that tokens.css does not define; em or en dashes and the banned words in docs and story copy.
4. Inventory: exactly what BRIEF Inventory lists. Name anything extra.
5. Run lint, typecheck, tests and build-storybook.

Report: fixes made, anything left open, and a table of components with story and test counts. Do not commit.
```

**Gate (Akshay):** read the report, then commit.

## Phase 4: Publish (one run, then you)

```
Read docs/BRIEF.md first.

Task: make the Storybook ready to host publicly on Vercel at graphpaper.akshaygite.com.

1. build-storybook runs build-tokens first and writes storybook-static/. Confirm it works from a clean clone (npm ci, then the build).
2. Storybook UI: title "Graphpaper", Read me first opens by default, no Storybook branding in the browser tab.
3. Link previews: a meta description taken from the first sentence of Read me first, and a 1200x630 Open Graph PNG built from the cover composition in design/components/Cover/preview.html.
4. Write docs/DEPLOY.md with numbered steps for me: import the repo in Vercel, framework preset, build command, output directory, then add graphpaper.akshaygite.com under the project's Domains and create the DNS record Vercel shows.
5. Run lint, typecheck, tests and build-storybook.

Do not commit or deploy.
```

**Gate (Akshay):** commit, follow docs/DEPLOY.md, and open graphpaper.akshaygite.com on your phone. If you want to link the code from Read me first, make the GitHub repo public and fill in its TODO.

## Phase 5: Portfolio link (not in this repo)

Runs in the akshaygite.com repo. Do not run it here.

```
Read docs/homepage/BRIEF.md first.

Task: add one link to the Graphpaper Storybook in the homepage AI section. Change nothing else.

1. Below the AI section's existing text, add a compact block with existing components and tokens:
   - Label: "Example"
   - Title: "Graphpaper"
   - One line: "A design-system study of Figma Weave's marketing site, rebuilt with Claude Code as tokens, 18 React components and motion rules, with its contrast and reduced-motion gaps fixed."
   - Link: "Open the Storybook →" to https://graphpaper.akshaygite.com, opening in a new tab with rel="noopener".
2. No image, no new card style, no gradient background. It must read as supporting evidence and never compete with the six case study cards.
3. Check the copy against the BRIEF writing rules. Screenshot / at 390 and 1440, review the screenshots, fix layout problems. Run lint, typecheck and build.

Do not commit.
```

**Gate (Akshay):** review a preview deploy on your phone, then commit.

## Phase 6: Sync back to Claude Design (only when Akshay asks)

Do this only once Phase 3 is committed. After the sync, the Graphpaper page in Claude Design becomes read-only: changes happen in this repo and get synced again.

```
/design-sync

Read docs/BRIEF.md first.
Target: the existing Graphpaper design system in Claude Design (https://claude.ai/artifact/NHhsUBRrSUrBqT6fLQKkP6). Source: this repo (src/components, src/tokens/tokens.json, src/fonts).
Sync incrementally. Show me the plan, with every file to write and delete, before writing anything. Keep the cover and the README wording unless the plan says why they change.
If Graphpaper is not offered as a target, or /design-sync is not available, stop and tell me.
```
