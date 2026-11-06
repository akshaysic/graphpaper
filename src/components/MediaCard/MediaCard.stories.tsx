import type { Meta, StoryObj } from '@storybook/react-vite';

import { readmeDescription } from '../../../.storybook/readme';
import readme from '../../../design/components/MediaCard/README.md?raw';
import { MediaCard } from './MediaCard';

const meta = {
  title: 'Content/MediaCard',
  component: MediaCard,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: { title: 'Rotate a Product', alt: 'Chair turning on a plinth', tags: ['Prompt', 'Image', 'Rotate'], href: '#' },
  // MediaCard is built for dark bands, so its stories sit on one whatever the toolbar says.
  decorators: [
    (Story) => (
      <div data-theme="dark" className="gp-row" style={{ background: 'var(--ground)', padding: 'var(--space-m)', gap: 'var(--space-m)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MediaCard>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = { args: { title: 'Relight a Scene', alt: 'Room in evening light', tags: [], active: true } };
