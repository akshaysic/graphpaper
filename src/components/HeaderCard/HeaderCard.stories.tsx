import type { Meta, StoryObj } from '@storybook/react-vite';

import { readmeDescription } from '../../../.storybook/readme';
import readme from '../../../design/components/HeaderCard/README.md?raw';
import { GraphPaper } from '../GraphPaper';
import { HeaderCard } from './HeaderCard';
import { Panel } from './Panel';

const meta = {
  title: 'Content/HeaderCard',
  component: HeaderCard,
  subcomponents: { Panel },
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: {
    label: 'Prompt',
    children: 'A ceramic vase on a plinth, late sun from the right, a soft shadow falling left. Muted sand and teal.',
  },
  argTypes: { tone: { control: 'inline-radio', options: ['text', 'media'] } },
  decorators: [
    (Story) => (
      <GraphPaper style={{ padding: 'var(--space-m)' }}>
        <Story />
      </GraphPaper>
    ),
  ],
} satisfies Meta<typeof HeaderCard>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

// A prompt and an output grouped in a Panel; the controls drive the prompt card.
export const Default: Story = {
  render: (args) => (
    <Panel style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2.2fr)', height: 320 }}>
      <HeaderCard {...args} />
      <HeaderCard label="Output" tone="media" alt="Final render" action={{ label: 'Run' }} />
    </Panel>
  ),
};

export const Media: Story = {
  args: { label: 'Output', tone: 'media', alt: 'Final render', action: { label: 'Run' }, children: undefined },
  render: (args) => (
    <div style={{ display: 'grid', height: 320 }}>
      <HeaderCard {...args} />
    </div>
  ),
};
