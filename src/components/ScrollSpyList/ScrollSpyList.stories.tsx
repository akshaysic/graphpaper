import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, waitFor, within } from 'storybook/test';

import { readmeDescription } from '../../../.storybook/readme';
import { paint, tokenPaint } from '../../../.storybook/test-helpers';
import readme from '../../../design/components/ScrollSpyList/README.md?raw';
import { SectionIntro } from '../SectionIntro';
import { ScrollSpyList, type ScrollSpyListProps } from './ScrollSpyList';

const MODELS = ['Diffusion', 'Motion', 'Depth', 'Relight', 'Upscale', 'Matte', 'Voice', 'Mesh', 'Vector'];

// The aside names the active item, as the preview does, so onActiveChange is visible.
function Demo(args: ScrollSpyListProps) {
  const [active, setActive] = useState(0);
  return (
    <ScrollSpyList
      {...args}
      onActiveChange={(index) => {
        setActive(index);
        args.onActiveChange?.(index);
      }}
      aside={
        <div style={{ paddingTop: 'var(--space-l)' }}>
          <SectionIntro title="Every Model, One Graph">
            Each model is a node. Swap one without rebuilding the rest. Active: {args.items[active]}.
          </SectionIntro>
        </div>
      }
    />
  );
}

const meta = {
  title: 'Sections/ScrollSpyList',
  component: ScrollSpyList,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: { items: MODELS, height: 520 },
  render: (args) => <Demo {...args} />,
  // ScrollSpyList is built for dark bands, so its stories sit on one whatever the toolbar says.
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ background: 'var(--ground)', color: 'var(--ink)', padding: '0 var(--space-m)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScrollSpyList>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  globals: { viewport: { value: 'desktop', isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [first, second] = canvas.getAllByRole('button');
    const scroller = canvasElement.querySelector('.gp-spy')?.parentElement;
    if (!first || !second || !scroller) throw new Error('ScrollSpyList did not render');
    await expect(first).toHaveAttribute('aria-current', 'true');
    // Bring the second name's top just past the activation line, 20% down the scroll area.
    const line = scroller.getBoundingClientRect().top + scroller.clientHeight * 0.2;
    scroller.scrollTop += second.getBoundingClientRect().top - line + 4;
    await waitFor(() => expect(second).toHaveAttribute('aria-current', 'true'));
    await expect(first).not.toHaveAttribute('aria-current');
    // On the dark band the active name is action-ink and the rest stay ink-faint.
    // Read the token first: waitFor reruns on every DOM change, and the probe is one.
    const actionInk = tokenPaint(second, '--action-ink');
    await waitFor(() => expect(paint(getComputedStyle(second).color)).toEqual(actionInk));
    await expect(paint(getComputedStyle(first).color)).toEqual(tokenPaint(first, '--ink-faint'));
  },
};
