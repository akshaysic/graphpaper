import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';

import { readmeDescription } from '../../../.storybook/readme';
import readme from '../../../design/components/SplitHeadline/README.md?raw';
import { GraphPaper } from '../GraphPaper';
import { Toggle } from '../Toggle';
import { SplitHeadline, type SplitHeadlineProps } from './SplitHeadline';

const meta = {
  title: 'Type/SplitHeadline',
  component: SplitHeadline,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: { left: 'From Graph', right: 'to Tool', emphasis: 'left' },
  argTypes: {
    emphasis: { control: 'inline-radio', options: ['left', 'right', 'both'] },
    size: { control: 'inline-radio', options: ['xl', 'l'] },
    joiner: { control: false },
  },
  decorators: [
    (Story) => (
      <GraphPaper className="gp-stage" style={{ padding: 'var(--space-m) var(--space-l)' }}>
        <Story />
      </GraphPaper>
    ),
  ],
} satisfies Meta<typeof SplitHeadline>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

// The toggle moves the emphasis to the half it points at.
export const Default: Story = {
  render: function Render(args) {
    const [, updateArgs] = useArgs<SplitHeadlineProps>();
    const isRight = args.emphasis === 'right';
    return (
      <SplitHeadline
        {...args}
        joiner={<Toggle checked={isRight} onChange={(next) => updateArgs({ emphasis: next ? 'right' : 'left' })} label="Show the tool view" />}
      />
    );
  },
};

export const PlusJoiner: Story = {
  name: 'Plus joiner',
  args: {
    left: 'Human Judgement',
    right: 'Machine Speed',
    emphasis: 'both',
    joiner: '+',
    style: { justifyContent: 'flex-start', gap: 'var(--space-m)' },
  },
};
