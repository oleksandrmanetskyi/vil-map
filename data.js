/**
 * Village rename data.
 * Each entry: { oldName, newName, year, lat, lng, category, region }
 *
 * Categories:
 *   "city"      – cities / large towns
 *   "town"      – smaller towns / settlements
 *   "village"   – rural villages
 *   "district"  – district centres
 *
 * Replace or extend this array with your own data.
 */
const VILLAGES = [
  // ── Decommunisation renames (2016) ──────────────────────────────────────
  {
    oldName: "Artyomivsk",
    newName: "Bakhmut",
    year: 2016,
    lat: 48.5958,
    lng: 38.0,
    category: "city",
    region: "Donetsk Oblast",
    note: "Renamed under Ukraine's decommunisation law."
  },
  {
    oldName: "Dzerzhinsk",
    newName: "Toretsk",
    year: 2016,
    lat: 48.4082,
    lng: 37.8486,
    category: "city",
    region: "Donetsk Oblast",
    note: "Named after Felix Dzerzhinsky; renamed 2016."
  },
  {
    oldName: "Kommunarsk",
    newName: "Alchevsk",
    year: 1992,
    lat: 48.4719,
    lng: 38.8047,
    category: "city",
    region: "Luhansk Oblast",
    note: "Reverted to the historic name after independence."
  },
  {
    oldName: "Voroshilovhrad",
    newName: "Luhansk",
    year: 1990,
    lat: 48.5740,
    lng: 39.3078,
    category: "city",
    region: "Luhansk Oblast",
    note: "Named after Marshal Voroshilov; renamed back."
  },
  {
    oldName: "Zhdanov",
    newName: "Mariupol",
    year: 1989,
    lat: 47.1035,
    lng: 37.5434,
    category: "city",
    region: "Donetsk Oblast",
    note: "Named after Andrei Zhdanov; original name restored."
  },
  {
    oldName: "Shcherbynivka",
    newName: "Dzerzhynsk",
    year: 1938,
    lat: 48.3777,
    lng: 37.8488,
    category: "town",
    region: "Donetsk Oblast",
    note: "Renamed to Dzerzhynsk in Soviet era (different from Toretsk)."
  },
  {
    oldName: "Zapovitne",
    newName: "Komsomolske",
    year: 1960,
    lat: 47.9833,
    lng: 38.0167,
    category: "town",
    region: "Donetsk Oblast",
    note: "Example Soviet-era renaming."
  },
  {
    oldName: "Krasnyi Lyman",
    newName: "Lyman",
    year: 2016,
    lat: 48.9888,
    lng: 37.7972,
    category: "city",
    region: "Donetsk Oblast",
    note: "Decommunisation: 'Krasnyi' (Red) removed."
  },
  {
    oldName: "Krasnoarmiisk",
    newName: "Pokrovsk",
    year: 2016,
    lat: 48.2768,
    lng: 37.1769,
    category: "city",
    region: "Donetsk Oblast",
    note: "Decommunisation rename."
  },
  {
    oldName: "Krasnodon",
    newName: "Sorokyne",
    year: 2016,
    lat: 48.2912,
    lng: 39.7372,
    category: "city",
    region: "Luhansk Oblast",
    note: "Decommunisation rename."
  },
  {
    oldName: "Stakhanov",
    newName: "Kadiivka",
    year: 2016,
    lat: 48.5601,
    lng: 38.6508,
    category: "city",
    region: "Luhansk Oblast",
    note: "Named after Aleksei Stakhanov, Soviet miner hero."
  },
  {
    oldName: "Voroshilovsk",
    newName: "Almazna",
    year: 1992,
    lat: 48.5244,
    lng: 38.7181,
    category: "town",
    region: "Luhansk Oblast",
    note: "Post-independence rename."
  },
  // ── Kharkiv Oblast ──────────────────────────────────────────────────────
  {
    oldName: "Zmiyiv",
    newName: "Haidamats'ke",
    year: 2016,
    lat: 49.6765,
    lng: 36.3618,
    category: "city",
    region: "Kharkiv Oblast",
    note: "Decommunisation; reverted to Cossack heritage name."
  },
  // ── Kyiv & central Ukraine ──────────────────────────────────────────────
  {
    oldName: "Dniprodzerzhynsk",
    newName: "Kamianske",
    year: 2016,
    lat: 48.5079,
    lng: 34.6221,
    category: "city",
    region: "Dnipropetrovsk Oblast",
    note: "Named after Dzerzhinsky; decommunisation rename."
  },
  // ── Western Ukraine ─────────────────────────────────────────────────────
  {
    oldName: "Stanislaviv",
    newName: "Ivano-Frankivsk",
    year: 1962,
    lat: 48.9226,
    lng: 24.7111,
    category: "city",
    region: "Ivano-Frankivsk Oblast",
    note: "Renamed in honour of Ivan Franko, Ukrainian poet."
  },
  {
    oldName: "Voroshilov",
    newName: "Ternopil",
    year: 1944,
    lat: 49.5535,
    lng: 25.5948,
    category: "city",
    region: "Ternopil Oblast",
    note: "Historic name restored after WWII liberation."
  },
  // ── Odesa Oblast ───────────────────────────────────────────────────────
  {
    oldName: "Kotovsk",
    newName: "Podilsk",
    year: 2016,
    lat: 47.7558,
    lng: 29.5203,
    category: "city",
    region: "Odesa Oblast",
    note: "Named after Soviet military commander Kotovsky."
  },
  {
    oldName: "Ilyichivsk",
    newName: "Chornomorsk",
    year: 2016,
    lat: 46.2988,
    lng: 30.6573,
    category: "city",
    region: "Odesa Oblast",
    note: "Decommunisation; 'Ilyich' refers to Lenin's patronymic."
  },
  // ── Zaporizhzhia Oblast ─────────────────────────────────────────────────
  {
    oldName: "Kominternivske",
    newName: "Voskresenka",
    year: 2016,
    lat: 47.3167,
    lng: 34.6333,
    category: "village",
    region: "Zaporizhzhia Oblast",
    note: "Decommunisation; Komintern = Communist International."
  },
  {
    oldName: "Ordzhonikidze",
    newName: "Pokrov",
    year: 2016,
    lat: 47.6333,
    lng: 34.1833,
    category: "city",
    region: "Dnipropetrovsk Oblast",
    note: "Named after Soviet politician Ordzhonikidze."
  },
  // ── Volyn & Polissia ────────────────────────────────────────────────────
  {
    oldName: "Lutsk Rayon",
    newName: "Lutsk District",
    year: 2020,
    lat: 50.7597,
    lng: 25.3411,
    category: "district",
    region: "Volyn Oblast",
    note: "Administrative reform – rayons merged into districts."
  },
  {
    oldName: "Kovel Rayon",
    newName: "Kovel District",
    year: 2020,
    lat: 51.2167,
    lng: 24.7167,
    category: "district",
    region: "Volyn Oblast",
    note: "Administrative reform 2020."
  },
  // ── Crimea (pre-annexation renames) ─────────────────────────────────────
  {
    oldName: "Simferopol Rayon",
    newName: "Simferopol District",
    year: 2020,
    lat: 44.9521,
    lng: 34.1024,
    category: "district",
    region: "Crimea (Ukraine)",
    note: "Ukrainian administrative reform; Crimea occupied since 2014."
  },
  // ── Poltava Oblast ──────────────────────────────────────────────────────
  {
    oldName: "Komsomolsk",
    newName: "Horishni Plavni",
    year: 2016,
    lat: 49.0112,
    lng: 33.6497,
    category: "city",
    region: "Poltava Oblast",
    note: "Decommunisation; 'Komsomolsk' honours the Soviet youth org."
  },
  // ── Cherkasy Oblast ─────────────────────────────────────────────────────
  {
    oldName: "Kirovograd",
    newName: "Kropyvnytskyi",
    year: 2016,
    lat: 48.5079,
    lng: 32.2623,
    category: "city",
    region: "Kirovohrad Oblast",
    note: "Named after Ukrainian playwright Marko Kropyvnytskyi."
  },
];

/** Derive the full sorted list of unique years for the slider */
const ALL_YEARS = (() => {
  const min = Math.min(...VILLAGES.map(v => v.year));
  const max = Math.max(...VILLAGES.map(v => v.year));
  return { min, max };
})();

/** Derive unique categories */
const CATEGORIES = [...new Set(VILLAGES.map(v => v.category))].sort();
