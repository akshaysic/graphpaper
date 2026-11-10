import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';

import { readmeDescription } from '../../../.storybook/readme';
import readme from '../../../design/components/Reveal/README.md?raw';
import { Reveal, type RevealProps } from './Reveal';

const BLOCKS = [1, 2, 3, 4, 5, 6];

// Reveal watches its own scroll container here, as in the preview, so root is that container.
function Demo(args: RevealProps) {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div ref={scroller} className="gp-paper" tabIndex={0} role="region" aria-label="Reveal demo. Scroll inside." style={{ height: 340, overflowY: 'auto', padding: 'var(--space-s) var(--space-m)' }}>
      <p className="intro" style={{ marginBottom: 360 }}>
        Scroll this frame. Blocks below the fold rise 24px and fade in over 500ms. Blocks already on screen never hide.
      </p>
      {BLOCKS.map((block) => (
        <Reveal key={block} {...args} root={scroller} style={{ marginBottom: 'var(--space-m)' }}>
          <div style={{ height: 120, borderRadius: 'var(--radius-m)', background: 'var(--surface)', display: 'grid', placeItems: 'center', color: 'var(--ink)' }}>
            Block {block}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

const meta = {
  title: 'Motion/Reveal',
  component: Reveal,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  render: (args) => <Demo {...args} />,
} satisfies Meta<typeof Reveal>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
