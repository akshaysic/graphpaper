import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useArgs } from 'storybook/preview-api';
import { expect, userEvent, within } from 'storybook/test';

import { readmeDescription } from '../../../.storybook/readme';
import readme from '../../../design/components/Toggle/README.md?raw';
import { Toggle, type ToggleProps } from './Toggle';

// The switch keeps its own state and writes it back to the checked arg, so clicking works
// whether or not the arg update reaches the story (it does not under npm test).
function Demo({ checked, onChange, ...props }: ToggleProps) {
  const [isChecked, setChecked] = useState(Boolean(checked));
  const isOn = props.progress != null ? props.progress >= 0.5 : isChecked;
  return (
    <div className="gp-stage gp-row" style={{ alignItems: 'center', gap: 'var(--space-m)' }}>
      <Toggle
        {...props}
        checked={isChecked}
        onChange={(next) => {
          setChecked(next);
          onChange?.(next);
        }}
      />
      <span className="body muted">{isOn ? 'Tool view' : 'Graph view'}</span>
    </div>
  );
}

const meta = {
  title: 'Actions/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: { checked: false, label: 'Show the tool view' },
  argTypes: { progress: { control: { type: 'range', min: 0, max: 1, step: 0.01 } } },
  render: function Render(args) {
    const [, updateArgs] = useArgs<ToggleProps>();
    // Remounts when the checked control changes, so the control can still set the switch.
    return <Demo key={String(args.checked)} {...args} onChange={(next) => updateArgs({ checked: next })} />;
  },
} satisfies Meta<typeof Toggle>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const toggle = within(canvasElement).getByRole('switch', { name: 'Show the tool view' });
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-checked', 'true');
  },
};

export const Checked: Story = { args: { checked: true } };

// Scroll drives the knob through progress; drag the control to see it follow with no easing.
export const ScrollDriven: Story = { name: 'Scroll driven', args: { progress: 0.3 } };
