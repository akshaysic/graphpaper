import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { readmeDescription } from '../../../.storybook/readme';
import { paint, tokenPaint } from '../../../.storybook/test-helpers';
import readme from '../../../design/components/NavBar/README.md?raw';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { cx } from '../../utils/cx';
import { NavBar, type NavBarProps } from './NavBar';

// Link order on akshaygite.com, Navigation rule 11.
const LINKS = [
  { label: 'Design work', href: '#', current: true },
  { label: 'How I work', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Audio work', href: '#' },
];

// The page gutter the bar lines up with: space-s below 768, space-l from 768 (Navigation rule 6).
const GUTTER = 'clamp(var(--space-s), (100vw - 767px) * 100, var(--space-l))';

// The NavBar sits first in its own scroll container, as the BRIEF asks of scroll-driven components:
// a light hero band, then a dark band the bar scrolls over.
function Page(args: NavBarProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(scroller, { start: 0, end: 150 });
  const onPaper = args.band === 'paper';
  return (
    <div ref={scroller} data-testid="scroller" style={{ height: 480, overflowY: 'auto' }}>
      <NavBar {...args} progress={progress} />
      <main id="content" tabIndex={-1}>
        <section
          data-theme="light"
          className={cx(onPaper && 'gp-paper')}
          style={{ background: onPaper ? undefined : 'var(--ground)', color: 'var(--ink)', padding: `var(--space-l) ${GUTTER}` }}
        >
          <h1 className="display-xl gp-fluid-xl">Scroll this frame</h1>
          <p className="intro" style={{ maxWidth: '46ch', marginTop: 'var(--space-m)' }}>
            After 150px of scroll the bar turns solid ground with a connector rule. Progress {Math.round(progress * 100)}%.
          </p>
        </section>
        <section data-theme="dark" style={{ background: 'var(--ground)', color: 'var(--ink)', height: 900, padding: `var(--space-l) ${GUTTER}` }}>
          <p className="intro">A dark band. The bar stays light over it.</p>
        </section>
      </main>
    </div>
  );
}

const meta = {
  title: 'Navigation/NavBar',
  component: NavBar,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: { brand: 'Akshay Gite', brandHref: '#', links: LINKS, cta: { label: 'Book a call', href: '#' }, band: 'ground' },
  argTypes: {
    band: { control: 'inline-radio', options: ['ground', 'paper'] },
    position: { control: 'inline-radio', options: ['sticky', 'static', 'fixed'] },
    progress: { control: false },
  },
  render: (args) => <Page {...args} />,
} satisfies Meta<typeof NavBar>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  globals: { viewport: { value: 'desktop', isRotated: false } },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const bar = canvasElement.querySelector('.gp-navbar');
    if (!bar) throw new Error('NavBar did not render');

    await step('aria-current renders the pill', async () => {
      const current = canvas.getByRole('link', { name: 'Design work' });
      await expect(current).toHaveAttribute('aria-current', 'page');
      const pill = getComputedStyle(current.querySelector('.gp-nav__text') as Element);
      await expect(paint(pill.backgroundColor)).toEqual(tokenPaint(bar, '--ink'));
      await expect(paint(pill.color)).toEqual(tokenPaint(bar, '--ground'));
      await expect(pill.borderTopLeftRadius).toBe('4px');
      await expect([pill.paddingTop, pill.paddingLeft]).toEqual(['4px', '8px']);
      const other = canvas.getByRole('link', { name: 'About' });
      await expect(other).not.toHaveAttribute('aria-current');
      await expect(getComputedStyle(other.querySelector('.gp-nav__text') as Element).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    });

    await step('After 150px of scroll the bar gets its border', async () => {
      const scroller = canvas.getByTestId('scroller');
      // A late font swap reflows the hero, and scroll anchoring would then pull the scroll back a few pixels.
      await document.fonts.ready;
      const border = () => paint(getComputedStyle(bar).borderBottomColor);
      // At the top the border is the bar's own colour, so it does not show.
      await expect(border()).toEqual(paint(getComputedStyle(bar).backgroundColor));
      scroller.scrollTop = 150;
      await waitFor(() => expect(bar).toHaveClass('is-solid'));
      await expect(border()).toEqual(tokenPaint(bar, '--connector'));
      await expect(paint(getComputedStyle(bar).backgroundColor)).toEqual(tokenPaint(bar, '--ground'));
      // Scroll-linked: scrolling back takes the border away again.
      scroller.scrollTop = 0;
      await waitFor(() => expect(bar).not.toHaveClass('is-solid'));
      await expect(border()).toEqual(paint(getComputedStyle(bar).backgroundColor));
    });
  },
};

export const OnPaper: Story = {
  name: 'On paper',
  args: { band: 'paper' },
  globals: { viewport: { value: 'desktop', isRotated: false } },
};

export const Phone: Story = {
  globals: { viewport: { value: 'phone', isRotated: false } },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const menu = canvas.getByRole('button', { name: 'Menu' });

    await step('Menu opens the sheet and traps focus', async () => {
      await userEvent.click(menu);
      const sheet = await canvas.findByRole('dialog', { name: 'Menu' });
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      await expect(document.documentElement.style.overflow).toBe('hidden');
      const inSheet = within(sheet);
      const wordmark = inSheet.getByRole('link', { name: 'Akshay Gite' });
      const close = inSheet.getByRole('button', { name: 'Close' });
      const action = inSheet.getByRole('link', { name: 'Book a call' });
      const last = inSheet.getByRole('link', { name: 'Audio work' });
      // The top row keeps the wordmark and the action tab, with Close where Menu was.
      await expect(wordmark).toBeVisible();
      await expect(action).toBeVisible();
      await expect(close).toHaveFocus();
      // Measure once the sheet has finished sliding in.
      await Promise.all(sheet.getAnimations().map((animation) => animation.finished));
      const closeBox = close.getBoundingClientRect();
      const menuBox = menu.getBoundingClientRect();
      await expect(Math.abs(closeBox.right - menuBox.right)).toBeLessThanOrEqual(1);
      await expect(Math.abs(closeBox.top - menuBox.top)).toBeLessThanOrEqual(1);
      // Tab reaches the action tab and Shift+Tab the wordmark, both inside the trap.
      await userEvent.tab();
      await expect(action).toHaveFocus();
      await userEvent.tab({ shift: true });
      await userEvent.tab({ shift: true });
      await expect(wordmark).toHaveFocus();
      // Shift+Tab from the first control wraps to the last, and Tab from the last wraps back.
      await userEvent.tab({ shift: true });
      await expect(last).toHaveFocus();
      await userEvent.tab();
      await expect(wordmark).toHaveFocus();
    });

    await step('Esc closes the sheet', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
      await expect(menu).toHaveFocus();
      await expect(document.documentElement.style.overflow).toBe('');
    });
  },
};
