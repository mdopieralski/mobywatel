import { Disclaimer } from '@mobywatel/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Komponenty/Disclaimer',
  component: Disclaimer,
  tags: ['autodocs'],
  args: { variant: 'banner' },
} satisfies Meta<typeof Disclaimer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Banner: Story = {};
export const Inline: Story = { args: { variant: 'inline' } };
