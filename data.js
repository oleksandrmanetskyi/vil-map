const CSV_DATA_URL = 'data.csv';

function parseCsvRow(line) {
  const cells = [];
  let cur = '';
  let inQuotes = false;
  let i = 0;
  while (i < line.length) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      cells.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
    i += 1;
  }

  cells.push(cur.trim());
  return cells;
}

function normalizeHeader(header) {
  return String(header || '').trim().toLowerCase();
}

function extractYearFromRenameDate(renameDateRaw) {
  const raw = String(renameDateRaw || '').trim();
  if (!raw) return NaN;

  const directYearMatch = raw.match(/\b(\d{4})\b/);
  if (directYearMatch) return parseInt(directYearMatch[1], 10);

  const asDate = new Date(raw);
  if (!Number.isNaN(asDate.getTime())) return asDate.getFullYear();

  return parseInt(raw, 10);
}

function splitCategories(rawCategory) {
  const cats = String(rawCategory || '')
    .split(';')
    .map(item => item.trim())
    .filter(Boolean);
  if (cats.length === 0) return '';
  if (cats.length === 1) return cats[0];
  return cats;
}

function deriveAllYears(villages) {
  if (!villages.length) {
    const fallbackYear = 2000;
    return { min: fallbackYear - 1, max: fallbackYear + 1 };
  }
  const min = Math.min(...villages.map(v => v.year)) - 1;
  const max = Math.max(...villages.map(v => v.year)) + 1;
  return { min, max };
}

function deriveCategories(villages) {
  return [...new Set(
    villages
      .flatMap(v => Array.isArray(v.category) ? v.category : [v.category])
      .filter(Boolean)
  )].sort();
}

function parseVillageCsv(csvText) {
  const lines = String(csvText || '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  if (!lines.length) return [];

  const headers = parseCsvRow(lines[0]).map(normalizeHeader);
  const rows = lines.slice(1);

  const villages = rows.map(line => parseCsvRow(line)).map(cells => {
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = cells[idx] || '';
    });

    const oldName = row['old name'] || row.old_name || row.oldname || '';
    const newName = row['new name'] || row.new_name || row.newname || '';
    const renameDate = row['rename date'] || row.rename_date || row.year || '';
    const year = extractYearFromRenameDate(renameDate);
    const lat = parseFloat(row.lat);
    const lng = parseFloat(row.lng);
    const act = row.act || '';
    const type = row.type || '';
    const category = splitCategories(row.category);

    if (!oldName || !newName || Number.isNaN(year) || Number.isNaN(lat) || Number.isNaN(lng)) {
      return null;
    }

    return {
      oldName,
      newName,
      renameDate,
      year,
      lat,
      lng,
      act,
      type,
      category,
    };
  }).filter(Boolean);

  return villages;
}

async function loadVillageDataset(url = CSV_DATA_URL) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load CSV data from "${url}" (${response.status} ${response.statusText})`);
  }

  const csvText = await response.text();
  const villages = parseVillageCsv(csvText);
  const allYears = deriveAllYears(villages);
  const categories = deriveCategories(villages);

  return { villages, allYears, categories };
}

window.loadVillageDataset = loadVillageDataset;
