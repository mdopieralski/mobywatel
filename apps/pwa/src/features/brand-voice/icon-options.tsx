import { COLORS } from '@mobywatel/brand';
import { useEffect, useState, type CSSProperties } from 'react';

import styles from './icon-options.module.css';

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
    <section className={styles.section} style={PREVIEW_BG} aria-labelledby="icon-options-heading">
      <h2 id="icon-options-heading">App icon: pick one</h2>
      <p>
        Four candidates for our app icon, shown at home-screen size (96 px), app size (48 px) and favicon size
        (32 px), on a light and a dark background. None uses state symbols: the &ldquo;public service&rdquo;
        feel comes from calm colour, simple shapes and the name.
      </p>
      {failed && <p role="alert">The icon options could not be loaded.</p>}
      {!options && !failed && <p>Loading the options…</p>}
      {options && (
        <ol className={styles.grid}>
          {options.map((o, i) => (
            <li key={o.id} className={styles.card}>
              <h3>
                {i + 1}. {o.name}
              </h3>
              <div className={styles.previews}>
                {(['light', 'dark'] as const).map((bg) => (
                  <div key={bg} className={`${styles.swatch} ${styles[bg]}`}>
                    {SIZES.map((s) => (
                      <img key={s} src={`${BASE}/${o.id}.svg`} alt="" width={s} height={s} />
                    ))}
                  </div>
                ))}
              </div>
              <p>{o.idea}</p>
              <dl className={styles.facts}>
                <dt>Pros</dt>
                <dd>{o.pros}</dd>
                <dt>Cons</dt>
                <dd>{o.cons}</dd>
              </dl>
              <p className={styles.file}>
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
