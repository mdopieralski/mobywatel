import { ConfirmCard } from '@mobywatel/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Komponenty/ConfirmCard',
  component: ConfirmCard,
  tags: ['autodocs'],
  args: {
    title: 'Kupujesz bilet w mieście Łódź',
    rows: [
      { label: 'Miasto', value: 'Łódź' },
      { label: 'Bilet', value: 'Bilet 20-minutowy' },
      { label: 'Ważny', value: '20 minut od zakupu' },
      { label: 'Cena', value: '3,40 zł' },
    ],
    source: { name: 'Źródło: przykładowy cennik, ceny zmyślone.', checkedOn: 'Sprawdzone 28.10.2026.' },
    actionLabel: 'Kup bilet',
    cancelLabel: 'Anuluj',
    onConfirm: () => {},
    onCancel: () => {},
  },
} satisfies Meta<typeof ConfirmCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ticket: Story = {};
export const ZusVisit: Story = {
  args: {
    title: 'Umawiasz wizytę w ZUS',
    rows: [
      { label: 'Placówka', value: 'Przykładowa placówka „Pod Zegarem”, Kalisz' },
      { label: 'Dzień', value: 'czwartek, 5.11.2026' },
      { label: 'Godzina', value: '10:00' },
      { label: 'Sprawa', value: 'Emerytura' },
    ],
    source: { name: 'Źródło: przykładowy grafik, placówki zmyślone.', checkedOn: 'Sprawdzone 28.10.2026.' },
    actionLabel: 'Umów wizytę',
  },
};
