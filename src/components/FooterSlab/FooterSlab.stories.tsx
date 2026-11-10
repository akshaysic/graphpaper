import type { Meta, StoryObj } from '@storybook/react-vite';

import { readmeDescription } from '../../../.storybook/readme';
import readme from '../../../design/components/FooterSlab/README.md?raw';
import { FooterSlab } from './FooterSlab';

const meta = {
  title: 'Sections/FooterSlab',
  component: FooterSlab,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: readmeDescription(readme) } } },
  args: {
    statement: ['Human Judgement', 'Machine Speed'],
    name: 'Studio',
    about: 'Studio is a workspace for building image and video pipelines out of nodes, then handing them to a team as a simple tool.',
    columns: [
      { title: 'Get started', links: [{ label: 'Book a demo' }, { label: 'Pricing' }] },
      { title: 'Company', links: [{ label: 'About' }, { label: 'Careers' }, { label: 'Privacy' }] },
      { title: 'Resources', links: [{ label: 'Docs' }, { label: 'Changelog' }] },
    ],
    legal: 'Studio 2026. All rights reserved.',
    cta: { label: 'Start now', href: '#' },
  },
  argTypes: { theme: { control: 'inline-radio', options: ['dark', 'light'] } },
} satisfies Meta<typeof FooterSlab>;

// Storybook reads the default export.
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
