import { describe, expect, it } from 'vitest';

import { CITIES, cityById, foldCity, searchCities } from './cities.ts';

describe('cities', () => {
  it('has about every Polish town, each once', () => {
    expect(CITIES.length).toBeGreaterThan(900);
    expect(new Set(CITIES.map((c) => c.id)).size).toBe(CITIES.length);
  });

  it('finds a town without Polish letters', () => {
    expect(foldCity('Łódź')).toBe('lodz');
    expect(searchCities('lodz')[0]?.name).toBe('Łódź');
    expect(searchCities('krakow')[0]?.name).toBe('Kraków');
  });

  it('puts bigger towns first among names that start the same way', () => {
    const names = searchCities('war').map((c) => c.name);
    expect(names[0]).toBe('Warszawa');
  });

  it('tells apart towns with the same name by voivodeship', () => {
    const olsztyn = searchCities('olsztyn').filter((c) => c.name === 'Olsztyn');
    expect(olsztyn.map((c) => c.voivodeship).sort()).toEqual(['warmińsko-mazurskie', 'śląskie'].sort());
  });

  it('matches a later word in the name', () => {
    expect(searchCities('odra').map((c) => c.name)).toContain('Kostrzyn nad Odrą');
  });

  it('shows the biggest towns for an empty search, and finds a town by id', () => {
    expect(searchCities('', 3).map((c) => c.name)).toEqual(['Warszawa', 'Kraków', 'Wrocław']);
    const krakow = searchCities('kraków')[0];
    expect(cityById(krakow?.id)).toEqual(krakow);
    expect(cityById('Atlantyda|mazowieckie')).toBeUndefined();
  });
});
