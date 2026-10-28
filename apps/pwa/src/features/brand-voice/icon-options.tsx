import { COLORS } from '@mobywatel/brand';
import { useEffect, useState, type CSSProperties } from 'react';

// App icon candidates drawn by the brand-designer agent (apps/pwa/public/icons/options/).
// Temporary: remove this section once an icon is chosen.
interface IconOption {
  id: string;
  name: string;
  idea: string;
  pros: string;
  cons: string;
}

const BASE = '/icons/options';
const SIZES = [96, 48, 32] as const;

// The light and dark theme backgrounds, fixed whatever the page theme.
const PREVIEW_BG = {
  '--icon-preview-light': COLORS.light.bg,
  '--icon-preview-dark': COLORS.dark.bg,
} as CSSProperties;

// Fixed light and dark backgrounds, whatever the page theme, to judge the icon on both.
const SWATCH_BG = {
  light: 'bg-(--icon-preview-light) border border-border',
  dark: 'bg-(--icon-preview-dark)',
} as const;

export function IconOptions() {
  const [options, setOptions] = useState<IconOption[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    fetch(`${BASE}/options.json`)
      .then((r) => (r.ok ? (r.json() as Promise<IconOption[]>) : Promise.reject(new Error(String(r.status)))))
      .then((data) => live && setOptions(data))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, []);

  return (
    <section
      className="mb-12 pb-6 border-b border-border"
      style={PREVIEW_BG}
      aria-labelledby="icon-options-heading"
    >
      <h2 id="icon-options-heading">App icon: pick one</h2>
      <p>
        Four candidates for our app icon, shown at home-screen size (96 px), app size (48 px) and favicon size
        (32 px), on a light and a dark background. None uses state symbols: the &ldquo;public service&rdquo;
        feel comes from calm colour, simple shapes and the name.
      </p>
      {failed && <p role="alert">The icon options could not be loaded.</p>}
      {!options && !failed && <p>Loading the options…</p>}
      {options && (
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-4 mx-0 mt-4 mb-0 p-0 list-none">
          {options.map((o, i) => (
            <li
              key={o.id}
              className="p-4 border border-border rounded-lg bg-surface [&_h3]:m-0 [&_h3]:mb-3 [&_h3]:text-lg"
            >
              <h3>
                {i + 1}. {o.name}
              </h3>
              <div className="grid gap-2 mb-3">
                {(['light', 'dark'] as const).map((bg) => (
                  <div
                    key={bg}
                    className={`flex items-end gap-4 p-3 rounded-md [&_img]:block [&_img]:flex-none ${SWATCH_BG[bg]}`}
                  >
                    {SIZES.map((s) => (
                      <img key={s} src={`${BASE}/${o.id}.svg`} alt="" width={s} height={s} />
                    ))}
                  </div>
                ))}
              </div>
              <p>{o.idea}</p>
              <dl className="grid grid-cols-[auto_1fr] gap-y-1 gap-x-3 m-0 mb-3 text-sm [&_dt]:font-semibold [&_dd]:m-0">
                <dt>Pros</dt>
                <dd>{o.pros}</dd>
                <dt>Cons</dt>
                <dd>{o.cons}</dd>
              </dl>
              <p className="m-0 text-text-muted text-sm">
                <code>
                  {BASE}/{o.id}.svg
                </code>
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
