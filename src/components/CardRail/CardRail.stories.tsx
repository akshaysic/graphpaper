import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { readmeDescription } from '../../../.storybook/readme';
import readme from '../../../design/components/CardRail/README.md?raw';
import { CardRail } from './CardRail';

const ITEMS = [
  { title: 'Rotate a Product', alt: 'Chair turning on a plinth', tags: ['Prompt', 'Image', 'Rotate'] },
  { title: 'Compare Models', alt: 'Same prompt, four models', tags: ['Prompt', 'Model A', 'Model B'] },
  { title: 'Relight a Scene', alt: 'Room in evening light', tags: ['Image', 'Relight'] },
  { title: 'Matte and Composite', alt: 'Figure cut out and placed on a beach', tags: ['Mask', 'Composite'] },
  { title: 'Upscale for Print', alt: 'Detail at four times the size', tags: ['Image', 'Upscale'] },
].map((item) => ({ href: '#', ...item }));

const meta = {
  title: 'Content/CardRail',
  component: CardRail,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: { items: ITEMS, start: 1, label: 'Workflows' },
  // CardRail is built for dark bands, so its stories sit on one whatever the toolbar says.
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ background: 'var(--ground)', padding: 'var(--space-s) 0' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CardRail>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('2 / 5')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Next card' }));
    await expect(canvas.getByText('3 / 5')).toBeInTheDocument();
  },
};

/** On a phone the active card shrinks to the rail minus a gutter each side, so nothing of it is cut. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone', isRotated: false } },
  play: async ({ canvasElement }) => {
    const rail = canvasElement.querySelector<HTMLElement>('.gp-rail');
    const active = canvasElement.querySelector<HTMLElement>('.gp-card.is-active');
    await expect(rail).not.toBeNull();
    await expect(active).not.toBeNull();
    const railBox = (rail as HTMLElement).getBoundingClientRect();
    // The track slides into place once the rail is measured, so wait for it to settle.
    await waitFor(() => {
      const cardBox = (active as HTMLElement).getBoundingClientRect();
      expect(cardBox.left).toBeGreaterThanOrEqual(railBox.left);
      expect(cardBox.right).toBeLessThanOrEqual(railBox.right);
    });
  },
};
