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
    oldName: "Aqmeçit",
    newName: "Чорноморське",
    year: 1944,
    lat: 45.5075,
    lng: 32.6942,
    category: "деетнізація",
    region: "Donetsk Oblast",
    note: "Renamed under Ukraine's decommunisation law."
  },
  {
    oldName: "Ablaq Acı",
    newName: "Калинівка",
    year: 1948,
    lat: 45.4866,
    lng: 32.6855,
    category: "натуралізація",
    region: "Donetsk Oblast",
    note: "Renamed under Ukraine's decommunisation law."
  },
];

/** Derive the full sorted list of unique years for the slider */
const ALL_YEARS = (() => {
  const min = Math.min(...VILLAGES.map(v => v.year)) - 1;
  const max = Math.max(...VILLAGES.map(v => v.year)) + 1;
  return { min, max };
})();

/** Derive unique categories */
const CATEGORIES = [...new Set(VILLAGES.map(v => v.category))].sort();
