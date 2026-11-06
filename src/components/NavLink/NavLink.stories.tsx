import type { Meta, StoryObj } from '@storybook/react-vite';

import { readmeDescription } from '../../../.storybook/readme';
import readme from '../../../design/components/NavLink/README.md?raw';
import { GraphPaper } from '../GraphPaper';
import { NavLink } from './NavLink';

const meta = {
  title: 'Actions/NavLink',
  component: NavLink,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: { children: 'Pricing', href: '#', current: true },
} satisfies Meta<typeof NavLink>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

// The controls drive the second link; the others show the resting state around it.
export const Default: Story = {
  render: (args) => (
    <GraphPaper className="gp-stage">
      <div className="gp-row" style={{ gap: 2 }}>
        <NavLink href="#">Work</NavLink>
        <NavLink {...args} />
        <NavLink href="#">Docs</NavLink>
        <NavLink href="#">Sign in</NavLink>
      </div>
    </GraphPaper>
  ),
};
