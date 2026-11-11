import type { Meta, StoryObj } from '@storybook/react-vite';

import { readmeDescription } from '../../../.storybook/readme';
import readme from '../../../design/components/GraphPaper/README.md?raw';
import { GraphPaper } from './GraphPaper';

const meta = {
  title: 'Canvas/GraphPaper',
  component: GraphPaper,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: {
    framed: true,
    style: { height: 150, display: 'grid', placeItems: 'end start' },
    children: <span className="body muted">paper and grid-line, 18px cells</span>,
  },
  argTypes: { children: { control: false } },
  decorators: [
    (Story) => (
      <div className="gp-stage">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GraphPaper>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Unframed: Story = { args: { framed: false } };
