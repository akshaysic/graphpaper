import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';

import { readmeDescription } from '../../../.storybook/readme';
import readme from '../../../design/components/Toggle/README.md?raw';
import { Toggle, type ToggleProps } from './Toggle';

const meta = {
  title: 'Actions/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: { checked: false, label: 'Show the tool view' },
  argTypes: { progress: { control: { type: 'range', min: 0, max: 1, step: 0.01 } } },
  render: function Render(args) {
    // Clicking writes back to the checked arg, so the switch and its control stay in step.
    const [, updateArgs] = useArgs<ToggleProps>();
    const isOn = args.progress != null ? args.progress >= 0.5 : args.checked;
    return (
      <div className="gp-stage gp-row" style={{ alignItems: 'center', gap: 'var(--space-m)' }}>
        <Toggle {...args} onChange={(next) => updateArgs({ checked: next })} />
        <span className="label muted">{isOn ? 'Tool view' : 'Graph view'}</span>
      </div>
    );
  },
} satisfies Meta<typeof Toggle>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { checked: true } };

// Scroll drives the knob through progress; drag the control to see it follow with no easing.
export const ScrollDriven: Story = { name: 'Scroll driven', args: { progress: 0.3 } };
