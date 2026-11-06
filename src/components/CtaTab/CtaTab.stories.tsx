import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';

import { readmeDescription } from '../../../.storybook/readme';
import readme from '../../../design/components/CtaTab/README.md?raw';
import { CtaTab } from './CtaTab';

const onStage: Decorator = (Story) => (
  <div className="gp-stage gp-row">
    <Story />
  </div>
);

const meta = {
  title: 'Actions/CtaTab',
  component: CtaTab,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: { children: 'Start now', href: '#', size: 's', corner: 'bl' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'l', 'xl'] },
    corner: { control: 'inline-radio', options: ['bl', 'br', 'tl', 'tr'] },
  },
} satisfies Meta<typeof CtaTab>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { decorators: [onStage] };

export const Large: Story = { args: { size: 'l' }, decorators: [onStage] };

// The xl tab belongs to the footer, which sits on a dark band.
export const Footer: Story = {
  args: { size: 'xl', corner: 'tl' },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ background: 'var(--ground)', display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-s)' }}>
        <Story />
      </div>
    ),
  ],
};
