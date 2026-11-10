import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { readmeDescription } from '../../../.storybook/readme';
import readme from '../../../design/components/ToolChips/README.md?raw';
import { GraphPaper } from '../GraphPaper';
import { ToolChips } from './ToolChips';

const ITEMS = ['Crop', 'Invert', 'Outpaint', 'Inpaint', 'Mask', 'Upscale', 'Relight', 'Channels', 'Describe', 'Depth'].map((label) => ({
  label,
  alt: `${label} result`,
}));
const POSITIONS = [
  { x: 14, y: 14 },
  { x: 34, y: 26 },
  { x: 26, y: 42 },
  { x: 13, y: 56 },
  { x: 33, y: 70 },
  { x: 22, y: 84 },
  { x: 84, y: 14 },
  { x: 70, y: 30 },
  { x: 74, y: 50 },
  { x: 82, y: 72 },
];

const meta = {
  title: 'Content/ToolChips',
  component: ToolChips,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: { items: ITEMS, layout: 'scatter', positions: POSITIONS, height: 400, center: { width: 280, height: 280, alt: 'Source image' } },
  argTypes: { layout: { control: 'inline-radio', options: ['scatter', 'row'] } },
  decorators: [
    (Story) => (
      <GraphPaper>
        <Story />
      </GraphPaper>
    ),
  ],
} satisfies Meta<typeof ToolChips>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  globals: { viewport: { value: 'desktop', isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chips = canvas.getAllByRole('button');
    const hovered = canvas.getByRole('button', { name: 'Upscale' });
    await userEvent.hover(hovered);
    await waitFor(() => expect(hovered).toHaveClass('is-active'));
    for (const chip of chips) {
      if (chip !== hovered) await expect(chip).toHaveClass('is-dim');
    }
    await userEvent.unhover(hovered);
    await waitFor(() => expect(canvasElement.querySelector('.gp-chip.is-dim')).toBeNull());
  },
};

export const Row: Story = { args: { layout: 'row', positions: undefined, center: undefined } };
