import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { readmeDescription } from '../../../.storybook/readme';
import readme from '../../../design/components/ArrowButton/README.md?raw';
import { ArrowButton } from './ArrowButton';

const meta = {
  title: 'Actions/ArrowButton',
  component: ArrowButton,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: { onClick: fn() },
  argTypes: { direction: { control: 'inline-radio', options: ['prev', 'next'] } },
} satisfies Meta<typeof ArrowButton>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

// Arrow buttons always come as a pair; the controls apply to both.
export const Default: Story = {
  render: (args) => (
    <div className="gp-stage gp-row" style={{ gap: 'var(--space-xs)' }}>
      <ArrowButton {...args} direction="prev" />
      <ArrowButton {...args} direction="next" />
    </div>
  ),
};
