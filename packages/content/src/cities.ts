// Polish towns for the city picker (Bilet miejski). Real public place names, not personal data. The list
// ships with the app (scripts/build-cities.mjs, from Wikidata), so searching works offline and nothing
// typed leaves the phone. Import it from '@mobywatel/content/cities', so it loads only when needed.
import { CITY_ROWS, VOIVODESHIPS } from './cities-data.ts';

export type Voivodeship = (typeof VOIVODESHIPS)[number];

export interface City {
  /** Stable key: name and voivodeship (some names repeat, e.g. two towns called Olsztyn). */
  id: string;
  name: string;
  voivodeship: Voivodeship;
  /** 0 when unknown. */
  population: number;
}

export const CITIES: readonly City[] = CITY_ROWS.map(([name, v, population]) => {
  const voivodeship = VOIVODESHIPS[v] as Voivodeship;
  return { id: `${name}|${voivodeship}`, name, voivodeship, population };
});

/** Lower case, without Polish letters' marks: "Łódź" and "lodz" match. */
export function foldCity(text: string): string {
  return text
    .toLocaleLowerCase('pl')
    .replaceAll('ł', 'l')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[\s-]+/g, ' ')
    .trim();
}

const FOLDED = CITIES.map((city) => ({ city, folded: foldCity(city.name) }));

/**
 * Towns matching what was typed: names that start with it first, then names with a word that starts with
 * it ("odra" finds Kostrzyn nad Odrą), then any other match; bigger towns first within each group.
 * An empty query gives the biggest towns.
 */
export function searchCities(query: string, limit = 8): City[] {
  const q = foldCity(query);
  const byPopulation = (a: City, b: City) => b.population - a.population;
  if (q === '') {
    return [...CITIES].sort(byPopulation).slice(0, limit);
  }
  const ranked: City[][] = [[], [], []];
  for (const { city, folded } of FOLDED) {
    if (folded.startsWith(q)) {
      ranked[0]?.push(city);
    } else if (folded.includes(` ${q}`)) {
      ranked[1]?.push(city);
    } else if (folded.includes(q)) {
      ranked[2]?.push(city);
    }
  }
  return ranked.flatMap((group) => group.sort(byPopulation)).slice(0, limit);
}

export function cityById(id: string | null | undefined): City | undefined {
  return id ? CITIES.find((city) => city.id === id) : undefined;
}
