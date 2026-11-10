import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { readmeDescription } from '../../../.storybook/readme';
import { emulateReducedMotion } from '../../../.storybook/test-helpers';
import readme from '../../../design/components/ScrollMorph/README.md?raw';
import { ScrollMorph } from './ScrollMorph';

const meta = {
  title: 'Motion/ScrollMorph',
  component: ScrollMorph,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: { left: 'From Graph', right: 'to Tool', height: 620 },
  argTypes: { size: { control: 'inline-radio', options: ['l', 'xl'] } },
} satisfies Meta<typeof ScrollMorph>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const scroller = canvasElement.querySelector<HTMLElement>('.gp-morph');
    const run = await canvas.findByText('Run', { selector: '.gp-tab' });
    if (!scroller) throw new Error('ScrollMorph did not render');
    const max = () => scroller.scrollHeight - scroller.clientHeight;
    // Tabs from the scroll area through everything after it and returns each element that took focus.
    const tabStops = async () => {
      scroller.focus();
      const stops: Element[] = [];
      for (let i = 0; i < 6; i += 1) {
        await userEvent.tab();
        if (document.activeElement) stops.push(document.activeElement);
      }
      return stops;
    };
    const scrollTo = async (progress: number) => {
      scroller.scrollTop = Math.round(max() * progress);
      await waitFor(() => expect(Math.abs(scroller.scrollTop - Math.round(max() * progress))).toBeLessThanOrEqual(1));
      await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
    };

    // The Run tab is revealed past 72.5% of the scroll: halfway through its 55% to 90% fade-in.
    await step('Tab never lands on the Run tab below the reveal point', async () => {
      for (const progress of [0, 0.4, 0.7]) {
        await scrollTo(progress);
        await expect(await tabStops()).not.toContain(run);
      }
    });

    await step('Past the reveal point the Run tab takes focus again', async () => {
      await scrollTo(1);
      await expect(await tabStops()).toContain(run);
      await scrollTo(0);
    });
  },
};

// Answers the reduced-motion query with "reduce" for this story, as DevTools emulation would.
export const ReducedMotion: Story = {
  name: 'Reduced motion',
  beforeEach: emulateReducedMotion,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const scroller = canvasElement.querySelector<HTMLElement>('.gp-morph');
    const toggle = canvas.getByRole('switch', { name: 'Show the simplified tool' });
    if (!scroller) throw new Error('ScrollMorph did not render');
    await expect(getComputedStyle(scroller).overflowY).toBe('hidden');
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    // The tool view: the "to Tool" half carries the emphasis and nothing scrolled.
    await expect(canvas.getByText('From Graph')).toHaveClass('is-rest');
    await expect(scroller.scrollTop).toBe(0);
  },
};
