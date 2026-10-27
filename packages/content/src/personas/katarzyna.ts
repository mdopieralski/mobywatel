// FICTIONAL persona for the demo (prototype-guardrails skill). Invented person; the PESEL has a valid
// checksum but an invented serial; document numbers use the PRO prefix; plate and policy are obviously fake;
// the street does not exist.
import { fictionalPesel, type Persona } from '@mobywatel/core';

const pesel = fictionalPesel({ year: 1990, month: 5, day: 14 }, 'K', 123);

export const KATARZYNA: Persona = {
  id: 'katarzyna',
  firstName: 'Katarzyna',
  lastName: 'Lipska',
  sex: 'K',
  summary: 'Kraków, 36 lat, mama dwójki dzieci',
  pesel,
  documents: [
    {
      kind: 'vehicle',
      statusDate: '2026-11-05',
      fields: [
        ['model', { text: 'Toyota Yaris 1.5 Hybrid' }],
        ['plate', { text: 'KR PROTO1' }],
        ['insuranceUntil', { date: '2026-11-05' }],
        ['inspectionUntil', { date: '2027-04-12' }],
      ],
    },
    {
      kind: 'driving-licence',
      statusDate: '2035-06-30',
      fields: [
        ['firstName', { text: 'Katarzyna' }],
        ['lastName', { text: 'Lipska' }],
        ['documentNumber', { text: 'PRO/0001/26' }],
        ['categories', { text: 'B' }],
        ['penaltyPoints', { text: '0' }],
        ['validUntil', { date: '2035-06-30' }],
      ],
    },
    {
      kind: 'family-card',
      fields: [
        ['firstName', { text: 'Katarzyna' }],
        ['lastName', { text: 'Lipska' }],
        ['cardNumber', { text: 'KDR PROTO 0001' }],
        ['pesel', { text: pesel }],
      ],
    },
    {
      kind: 'id-card',
      statusDate: '2031-05-20',
      fields: [
        ['firstName', { text: 'Katarzyna' }],
        ['lastName', { text: 'Lipska' }],
        ['pesel', { text: pesel }],
        ['birthDate', { date: '1990-05-14' }],
        ['documentNumber', { text: 'PRO 123456' }],
        ['validUntil', { date: '2031-05-20' }],
      ],
    },
  ],
  reminders: [
    { id: 'tax-letter', kind: 'tax-letter', due: { days: 3 }, urgent: true },
    { id: 'insurance', kind: 'insurance-ends', due: { days: 11 } },
    { id: 'property-tax', kind: 'property-tax', due: { days: 22 } },
  ],
};
