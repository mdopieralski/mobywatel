import { Button } from '@mobywatel/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Komponenty/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Dalej', variant: 'primary', fullWidth: false, disabled: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', children: 'Wróć' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Pomiń' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Usuń dane' } };
export const FullWidth: Story = { args: { fullWidth: true, children: 'Potwierdzam' } };
