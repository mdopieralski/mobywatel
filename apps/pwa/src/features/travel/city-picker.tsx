import type { City } from '@mobywatel/content/cities';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslations } from 'use-intl';

import { DEMO_PREFIX } from '../../platform/demo-state.ts';
import styles from './city-picker.module.css';
import { TicketShop } from './ticket-list.tsx';

type CitiesModule = typeof import('@mobywatel/content/cities');

/** The chosen town: demo state, so "Zresetuj demo" clears it. */
const CITY_KEY = `${DEMO_PREFIX}city`;
const SHOWN = 8;

function readCityId(): string | null {
  try {
    return localStorage.getItem(CITY_KEY);
  } catch {
    return null;
  }
}

function saveCityId(id: string): void {
  try {
    localStorage.setItem(CITY_KEY, id);
  } catch {
    // storage blocked: the choice lasts until the page closes
  }
}

/**
 * Bilet miejski: pick your town from every Polish town. The list ships with the app (loaded when this
 * screen opens), so search works offline and nothing typed leaves the phone. Then the tickets for that
 * town (ticket-list.tsx).
 */
export function CityPicker() {
  const t = useTranslations('categories.cityPicker');
  const [cities, setCities] = useState<CitiesModule | null>(null);
  const [cityId, setCityId] = useState(readCityId);
  const [changing, setChanging] = useState(false);
  const [query, setQuery] = useState('');
  const chosenHeading = useRef<HTMLHeadingElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const moveFocus = useRef<'chosen' | 'input' | null>(null);
  const hintId = useId();
  const inputId = useId();

  useEffect(() => {
    let live = true;
    void import('@mobywatel/content/cities').then((module) => {
      if (live) {
        setCities(module);
      }
    });
    return () => {
      live = false;
    };
  }, []);

  const chosen = cities?.cityById(cityId);
  const picking = !chosen || changing;

  // After a choice, focus the result; after "Zmień miasto", the search field.
  useEffect(() => {
    if (moveFocus.current === 'chosen') {
      chosenHeading.current?.focus();
    } else if (moveFocus.current === 'input') {
      input.current?.focus();
    }
    moveFocus.current = null;
  }, [picking]);

  if (!cities) {
    return <p className={styles.note}>{t('loading')}</p>;
  }

  const choose = (city: City) => {
    saveCityId(city.id);
    setCityId(city.id);
    setChanging(false);
    setQuery('');
    moveFocus.current = 'chosen';
  };

  if (!picking && chosen) {
    return (
      <div className={styles.flow}>
        <section className={styles.chosen} aria-labelledby="city-chosen">
          <p className={styles.label}>{t('chosen')}</p>
          <h2 id="city-chosen" ref={chosenHeading} tabIndex={-1} className={styles.cityName}>
            {chosen.name}
          </h2>
          <p className={styles.voivodeship}>{t('voivodeship', { name: chosen.voivodeship })}</p>
          <button
            type="button"
            className={styles.change}
            onClick={() => {
              setChanging(true);
              moveFocus.current = 'input';
            }}
          >
            {t('change')}
          </button>
        </section>
        <TicketShop cityId={chosen.id} cityName={chosen.name} nameOf={(id) => cities.cityById(id)?.name} />
      </div>
    );
  }

  const all = cities.searchCities(query, Number.POSITIVE_INFINITY);
  const shown = all.slice(0, SHOWN);
  const searching = query.trim() !== '';

  return (
    <section className={styles.picker} aria-labelledby="city-picker">
      <h2 id="city-picker" className={styles.title}>
        {t('title')}
      </h2>
      <label className={styles.label} htmlFor={inputId}>
        {t('label')}
      </label>
      <p id={hintId} className={styles.hint}>
        {t('hint')}
      </p>
      <input
        ref={input}
        id={inputId}
        className={styles.input}
        type="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="search"
        aria-describedby={hintId}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {/* Announced as the list changes: how many towns match. */}
      <p role="status" className={styles.count}>
        {searching
          ? all.length === 0
            ? t('none')
            : `${t('results', { count: all.length })}${all.length > SHOWN ? ` ${t('more', { shown: SHOWN })}` : ''}`
          : t('biggest')}
      </p>
      {shown.length > 0 ? (
        <ul className={styles.list}>
          {shown.map((city) => (
            <li key={city.id}>
              <button type="button" className={styles.option} onClick={() => choose(city)}>
                <span className={styles.optionName}>{city.name}</span>
                <span className={styles.optionVoivodeship}>{city.voivodeship}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
