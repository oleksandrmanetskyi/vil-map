function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  values.push(current);

  return values;
}

function loadVillagesFromCsv(path) {
  const req = new XMLHttpRequest();
  req.open('GET', path, false);
  req.send();

  if (req.status !== 200 && req.status !== 0) {
    throw new Error(`Failed to load CSV from ${path}: ${req.status}`);
  }

  const lines = req.responseText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map(h => h.trim().toLowerCase());
  const idx = {
    oldName: headers.indexOf('old name'),
    newName: headers.indexOf('new name'),
    year: headers.indexOf('rename date'),
    act: headers.indexOf('act'),
    type: headers.indexOf('type'),
    lat: headers.indexOf('lat'),
    lng: headers.indexOf('lng'),
    category: headers.indexOf('category'),
  };

  return lines.slice(1).map(line => {
    const cols = parseCsvLine(line);
    const categories = (cols[idx.category] || '')
      .split(';')
      .map(cat => cat.trim().toLowerCase())
      .filter(Boolean);

    return {
      oldName: (cols[idx.oldName] || '').trim(),
      newName: (cols[idx.newName] || '').trim(),
      year: parseInt((cols[idx.year] || '').trim(), 10),
      lat: parseFloat((cols[idx.lat] || '').trim()),
      lng: parseFloat((cols[idx.lng] || '').trim()),
      category: categories.length <= 1 ? (categories[0] || '') : categories,
      region: (cols[idx.type] || '').trim(),
      note: (cols[idx.act] || '').trim(),
    };
  }).filter(v =>
    v.oldName &&
    v.newName &&
    Number.isFinite(v.year) &&
    Number.isFinite(v.lat) &&
    Number.isFinite(v.lng) &&
    (Array.isArray(v.category) ? v.category.length > 0 : Boolean(v.category))
  );
}

const VILLAGES = loadVillagesFromCsv('data.csv');

/** Derive the full sorted list of unique years for the slider */
const ALL_YEARS = (() => {
  if (!VILLAGES.length) return { min: 0, max: 0 };
  const min = Math.min(...VILLAGES.map(v => v.year)) - 1;
  const max = Math.max(...VILLAGES.map(v => v.year)) + 1;
  return { min, max };
})();

/** Derive unique categories (supports string or array category values) */
const CATEGORIES = [...new Set(
  VILLAGES.flatMap(v => Array.isArray(v.category) ? v.category : [v.category])
    .filter(Boolean)
)].sort();
