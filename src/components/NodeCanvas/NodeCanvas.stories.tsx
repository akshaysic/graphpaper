import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { readmeDescription } from '../../../.storybook/readme';
import readme from '../../../design/components/NodeCanvas/README.md?raw';
import { NodeCanvas, type CanvasNode } from './NodeCanvas';

const NODES: CanvasNode[] = [
  { id: 'sketch', type: 'Image', model: 'Upload', x: 24, y: 40, w: 160, h: 180, alt: 'Pencil sketch of a chair' },
  { id: 'brief', type: 'Text', kind: 'text', x: 24, y: 300, w: 200, h: 110, text: 'Oak chair, studio light, plain grey backdrop, three-quarter view.' },
  { id: 'gen', type: 'Image', model: 'Diffusion 3', x: 330, y: 30, w: 260, h: 340, alt: 'Generated chair render' },
  { id: 'up', type: 'Image', model: 'Upscale 4x', x: 690, y: 40, w: 160, h: 170, alt: 'Upscaled detail' },
  { id: 'mask', type: 'Mask', model: 'Extract', x: 690, y: 280, w: 160, h: 130, alt: 'Chair cut-out mask' },
  { id: 'vid', type: 'Video', model: 'Motion 2', x: 930, y: 60, w: 170, h: 340, alt: 'Turntable clip' },
];
const LINKS: [string, string][] = [
  ['sketch', 'gen'],
  ['brief', 'gen'],
  ['gen', 'up'],
  ['gen', 'mask'],
  ['up', 'vid'],
  ['mask', 'vid'],
];

const meta = {
  title: 'Canvas/NodeCanvas',
  component: NodeCanvas,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: { nodes: NODES, links: LINKS, height: 490, hint: 'Drag nodes' },
  decorators: [
    (Story) => (
      <div className="gp-stage">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NodeCanvas>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  globals: { viewport: { value: 'desktop', isRotated: false } },
  play: async ({ canvasElement }) => {
    const node = await within(canvasElement).findByRole('group', { name: 'Image Diffusion 3. Arrow keys move it.' });
    const left = parseFloat(node.style.left);
    node.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(parseFloat(node.style.left)).toBe(left + 8));
  },
};
