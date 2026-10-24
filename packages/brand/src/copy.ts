// Product copy constants. UI copy lives in apps/pwa/messages; this file holds what must be identical
// everywhere (name, disclaimer) and what the build reads (manifest).

/** Working name, TBD by product-manager + brand-designer. Never the mObywatel name or marks alone. */
export const WORKING_NAME = 'Sprawnie';

export const TAGLINE = 'Sprawy urzędowe prościej';

/** Required on the start screen and every document view (prototype-guardrails skill). */
export const UNOFFICIAL_DISCLAIMER =
  'Nieoficjalny prototyp na konkurs mobywatel.ai. To nie jest aplikacja mObywatel. Wszystkie osoby i dane są fikcyjne.';

/** Watermark on every document view. */
export const DOCUMENT_WATERMARK = 'PROTOTYP – nie jest dokumentem';

export const MANIFEST_DESCRIPTION =
  'Nieoficjalny prototyp aplikacji do spraw urzędowych, przygotowany na konkurs mobywatel.ai. Dane są fikcyjne.';
