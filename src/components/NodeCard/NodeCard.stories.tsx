import type { Meta, StoryObj } from '@storybook/react-vite';

import { readmeDescription } from '../../../.storybook/readme';
import readme from '../../../design/components/NodeCard/README.md?raw';
import { GraphPaper } from '../GraphPaper';
import { NodeCard } from './NodeCard';

const meta = {
  title: 'Canvas/NodeCard',
  component: NodeCard,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: { type: 'Image', model: 'Diffusion 3', alt: 'Generated product shot', width: 180, height: 220 },
  argTypes: { kind: { control: 'inline-radio', options: ['media', 'text'] } },
  decorators: [
    (Story) => (
      <GraphPaper className="gp-stage gp-row" style={{ gap: 'var(--space-m)', padding: 'var(--space-m)' }}>
        <Story />
      </GraphPaper>
    ),
  ],
} satisfies Meta<typeof NodeCard>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Text: Story = {
  args: {
    type: 'Text',
    model: undefined,
    kind: 'text',
    alt: undefined,
    width: 200,
    height: 120,
    children: 'A ceramic vase on a plinth, late sun from the right, soft shadow.',
  },
};
