import type { Meta, StoryObj } from '@storybook/react-vite';

import { readmeDescription } from '../../../.storybook/readme';
import readme from '../../../design/components/SectionIntro/README.md?raw';
import { GraphPaper } from '../GraphPaper';
import { SectionIntro } from './SectionIntro';

const meta = {
  title: 'Type/SectionIntro',
  component: SectionIntro,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: {
    title: 'Control Every Layer',
    align: 'center',
    children: 'Layers, type and blend modes sit in one panel, so a finished frame never leaves the graph.',
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['left', 'center'] },
    introPosition: { control: 'inline-radio', options: ['above', 'below'] },
  },
  decorators: [
    (Story) => (
      <GraphPaper style={{ padding: 'var(--space-l)' }}>
        <Story />
      </GraphPaper>
    ),
  ],
} satisfies Meta<typeof SectionIntro>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Left: Story = { args: { align: 'left' } };

export const IntroAbove: Story = { name: 'Intro above', args: { align: 'left', introPosition: 'above' } };
