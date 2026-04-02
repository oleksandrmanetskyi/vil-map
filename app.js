/* ──────────────────────────────────────────────
   VILLAGE RENAME MAP  –  app.js
────────────────────────────────────────────── */

'use strict';

if (typeof window.loadVillageDataset !== 'function') {
  throw new Error('Village dataset loader is not available.');
}

// ── Category colours ─────────────────────────────────────────────────────────
const CAT_COLORS = {
  'деетнізація':     '#8b2e1a',   // deep red
  'натуралізація':   '#7c5e2e',   // brown
  'village':  '#2e6b3e',   // forest green
  'district': '#2a5f8f',   // steel blue
};

function catColor(cat) {
  return CAT_COLORS[cat] || '#555';
}

function categoriesOf(v) {
  return Array.isArray(v.category) ? v.category.filter(Boolean) : [v.category].filter(Boolean);
}

function primaryCategoryOf(v) {
  const cats = categoriesOf(v);
  return cats[0] || '';
}

function matchesActiveCategories(v) {
  const cats = categoriesOf(v);
  return cats.some(cat => state.activeCategories.has(cat));
}

// ── SVG pin factory ──────────────────────────────────────────────────────────
function makePinSVG(color, size = 30) {
  const s = size;
  const h = Math.round(s * 1.3);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${h}" viewBox="0 0 30 39">
    <path d="M15 1 C8.373 1 3 6.373 3 13 C3 21 15 37 15 37 C15 37 27 21 27 13 C27 6.373 21.627 1 15 1 Z"
          fill="${color}" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>
    <circle cx="15" cy="13" r="5.5" fill="rgba(255,255,255,.55)" stroke="rgba(0,0,0,.2)" stroke-width="1"/>
  </svg>`;
}

function makeIcon(cat, renamed = false) {
  const color = catColor(cat);
  const size  = renamed ? 34 : 28;
  const height = Math.round(size * 1.3);
  return L.divIcon({
    className: 'village-marker' + (renamed ? ' marker-renamed' : ''),
    html: makePinSVG(color, size),
    iconSize:   [size, height],
    iconAnchor: [size / 2, height],
    popupAnchor: [0, -height + 4],
    tooltipAnchor: [size / 2 + 2, -height / 2],
  });
}

// ── Popup HTML ───────────────────────────────────────────────────────────────
function buildPopup(v, currentYear) {
  const isRenamed = currentYear >= v.year;
  const shownName = isRenamed ? v.newName : v.oldName;
  const otherName = isRenamed ? v.oldName : v.newName;
  const otherLabel = isRenamed ? 'Попередня назва' : 'Майбутня назва';
  const yearLabel  = isRenamed ? 'Перейменовано в' : 'Буде перейменовано в';

  return `<div class="popup-inner">
    <div class="popup-name">${esc(shownName)}</div>
    ${isRenamed && v.oldName !== v.newName
      ? `<div class="popup-old">formerly: ${esc(v.oldName)}</div>`
      : (!isRenamed && v.oldName !== v.newName
        ? `<div class="popup-old" style="color:var(--accent-blue)">will become: ${esc(v.newName)}</div>`
        : '')
    }
    <div class="popup-divider"></div>
    <div class="popup-row">
      <span class="popup-row-label">Region</span>
      <span class="popup-row-value">${esc(v.type || '-')}</span>
    </div>
    <div class="popup-row">
      <span class="popup-row-label">Category</span>
      <span class="popup-row-value" style="text-transform:capitalize">${esc(categoriesOf(v).join(', '))}</span>
    </div>
    <div class="popup-row">
      <span class="popup-row-label">${yearLabel}</span>
      <span class="popup-row-value">
        <span class="popup-year-tag">${v.year}</span>
      </span>
    </div>
    ${v.renameDate ? `<div class="popup-row">
      <span class="popup-row-label">Rename date</span>
      <span class="popup-row-value">${esc(v.renameDate)}</span>
    </div>` : ''}
    ${v.act ? `<div class="popup-row">
      <span class="popup-row-label">Act</span>
      <span class="popup-row-value">${esc(v.act)}</span>
    </div>` : ''}
    ${v.note ? `<div class="popup-note">${esc(v.note)}</div>` : ''}
  </div>`;
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── App state ────────────────────────────────────────────────────────────────
const state = {
  villages: [],
  allYears: { min: 0, max: 0 },
  categories: [],
  year: 0,
  activeCategories: new Set(),
  markers: new Map(),   // village index → L.marker
  playTimer: null,
};

// ── Map init ─────────────────────────────────────────────────────────────────
const map = L.map('map', {
  center: [45.2, 34.0],
  zoom: 9,
  zoomControl: true,
});

// CartoDB Voyager – clean, warm, not too heavy
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19,
}).addTo(map);

// ── DOM refs ─────────────────────────────────────────────────────────────────
const sliderEl      = document.getElementById('year-slider');
const yearValueEl   = document.getElementById('year-value');
const yearEraEl     = document.getElementById('year-era');
const badgeYearEl   = document.getElementById('badge-year');
const playBtnEl     = document.getElementById('play-btn');
const catFiltersEl  = document.getElementById('cat-filters');
const villageListEl = document.getElementById('village-list');
const statTotalEl   = document.getElementById('stat-total');
const statRenamedEl = document.getElementById('stat-renamed');
const legendBodyEl  = document.getElementById('legend-body');

// ── Slider range ─────────────────────────────────────────────────────────────
// ── Category buttons ─────────────────────────────────────────────────────────
function buildCategoryButtons() {
  catFiltersEl.innerHTML = '';

  // "All" toggle
  const allBtn = document.createElement('button');
  allBtn.className = 'cat-btn' + (state.activeCategories.size === state.categories.length ? ' active' : '');
  allBtn.dataset.cat = '__all__';
  allBtn.innerHTML = `
    <span class="cat-dot" style="background:linear-gradient(135deg,${Object.values(CAT_COLORS).join(',')})"></span>
    <span class="cat-label">Усі категорії</span>
    <span class="cat-count">${state.villages.length}</span>
    <span class="cat-check">✓</span>`;
  allBtn.addEventListener('click', () => {
    if (state.activeCategories.size === state.categories.length) {
      state.activeCategories.clear();
    } else {
      state.categories.forEach(c => state.activeCategories.add(c));
    }
    buildCategoryButtons();
    renderMarkers();
    renderVillageList();
  });
  catFiltersEl.appendChild(allBtn);

  state.categories.forEach(cat => {
    const count = state.villages.filter(v => categoriesOf(v).includes(cat)).length;
    const active = state.activeCategories.has(cat);
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (active ? ' active' : '');
    btn.dataset.cat = cat;
    btn.innerHTML = `
      <span class="cat-dot" style="background:${catColor(cat)}"></span>
      <span class="cat-label">${esc(cat)}</span>
      <span class="cat-count">${count}</span>
      <span class="cat-check">✓</span>`;
    btn.addEventListener('click', () => {
      if (state.activeCategories.has(cat)) {
        state.activeCategories.delete(cat);
      } else {
        state.activeCategories.add(cat);
      }
      buildCategoryButtons();
      renderMarkers();
      renderVillageList();
    });
    catFiltersEl.appendChild(btn);
  });
}

// ── Legend ────────────────────────────────────────────────────────────────────
function buildLegend() {
  legendBodyEl.innerHTML = '';
  state.categories.forEach(cat => {
    const row = document.createElement('div');
    row.className = 'legend-row';
    row.innerHTML = `<span class="legend-dot" style="background:${catColor(cat)}"></span>${esc(cat)}`;
    legendBodyEl.appendChild(row);
  });
}

// ── Markers ───────────────────────────────────────────────────────────────────
function renderMarkers() {
  const year = state.year;

  state.villages.forEach((v, i) => {
    const visible = matchesActiveCategories(v);
    const primaryCat = primaryCategoryOf(v);

    if (state.markers.has(i)) {
      const m = state.markers.get(i);
      if (!visible) {
        map.removeLayer(m);
        return;
      }
      // Update icon & tooltip
      const renamed = year >= v.year;
      m.setIcon(makeIcon(primaryCat, renamed));
      const label = renamed ? v.newName : v.oldName;
      m.setTooltipContent(label);
      m.setPopupContent(buildPopup(v, year));
    } else {
      if (!visible) return;

      const renamed = year >= v.year;
      const label = renamed ? v.newName : v.oldName;

      const marker = L.marker([v.lat, v.lng], {
        icon: makeIcon(primaryCat, renamed),
        title: label,
      })
        .bindTooltip(label, { direction: 'right', offset: [6, 0], permanent: true })
        .bindPopup(buildPopup(v, year), { maxWidth: 300 });

      marker.addTo(map);
      state.markers.set(i, marker);
    }
  });

  // Remove markers for hidden villages that may have been cached
  state.markers.forEach((m, i) => {
    if (!matchesActiveCategories(state.villages[i])) {
      map.removeLayer(m);
      state.markers.delete(i);
    }
  });

  updateStats();
}

// ── Village list ──────────────────────────────────────────────────────────────
function renderVillageList() {
  const year = state.year;
  villageListEl.innerHTML = '';

  const visible = state.villages
    .map((v, i) => ({ v, i }))
    .filter(({ v }) => matchesActiveCategories(v))
    .sort((a, b) => {
      // Renamed ones (current year ≥ rename year) first, then alpha
      const rA = year >= a.v.year;
      const rB = year >= b.v.year;
      if (rA !== rB) return rA ? -1 : 1;
      const nameA = (year >= a.v.year ? a.v.newName : a.v.oldName).toLowerCase();
      const nameB = (year >= b.v.year ? b.v.newName : b.v.oldName).toLowerCase();
      return nameA.localeCompare(nameB);
    });

  visible.forEach(({ v, i }) => {
    const renamed = year >= v.year;
    const curName = renamed ? v.newName : v.oldName;
    const item = document.createElement('div');
    item.className = 'vl-item' + (renamed ? ' renamed' : '');
    item.innerHTML = `
      <div class="vl-name-cur">${esc(curName)}</div>
      ${renamed && v.oldName !== v.newName ? `<div class="vl-name-old">← ${esc(v.oldName)}</div>` : ''}
      <div class="vl-meta">${esc(v.region)} · ${esc(categoriesOf(v).join(', '))}</div>`;
    item.addEventListener('click', () => {
      const m = state.markers.get(i);
      if (m) {
        map.setView([v.lat, v.lng], Math.max(map.getZoom(), 9), { animate: true });
        setTimeout(() => m.openPopup(), 350);
      }
    });
    villageListEl.appendChild(item);
  });
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function updateStats() {
  const year = state.year;
  const visible = state.villages.filter(v => matchesActiveCategories(v));
  const renamed  = visible.filter(v => year >= v.year && v.oldName !== v.newName);
  statTotalEl.textContent   = visible.length;
  statRenamedEl.textContent = renamed.length;
}

// ── Year display ──────────────────────────────────────────────────────────────
function updateYearDisplay(year) {
  if (yearValueEl) yearValueEl.textContent = year;
  if (badgeYearEl) badgeYearEl.textContent = year;

  // Era label
  let era = '';
  if (year < 1917)        era = 'Imperial Era';
  else if (year < 1922)   era = 'Revolutionary Period';
  else if (year < 1941)   era = 'Soviet Era';
  else if (year < 1945)   era = 'World War II';
  else if (year < 1991)   era = 'Late Soviet Era';
  else if (year < 2014)   era = 'Independent Ukraine';
  else                    era = 'Modern Ukraine';
  if (yearEraEl) yearEraEl.textContent = era;

  // Slider fill % via CSS custom property
  const range = state.allYears.max - state.allYears.min;
  const pct = range > 0
    ? ((year - state.allYears.min) / range * 100).toFixed(1)
    : '0.0';
  sliderEl.style.setProperty('--pct', pct + '%');
}

// ── Slider interaction ────────────────────────────────────────────────────────
sliderEl.addEventListener('input', () => {
  const y = parseInt(sliderEl.value, 10);
  state.year = y;
  updateYearDisplay(y);
  renderMarkers();
  renderVillageList();
});

// ── Play / pause ──────────────────────────────────────────────────────────────
function setPlaying(playing) {
  if (playing) {
    playBtnEl.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 12 12">
        <rect x="1" y="1" width="4" height="10" rx="1" fill="currentColor"/>
        <rect x="7" y="1" width="4" height="10" rx="1" fill="currentColor"/>
      </svg> Пауза`;
    state.playTimer = setInterval(() => {
      let y = state.year + 1;
      if (y > state.allYears.max) y = state.allYears.min;
      state.year = y;
      sliderEl.value = y;
      updateYearDisplay(y);
      renderMarkers();
      renderVillageList();
    }, 600);
  } else {
    clearInterval(state.playTimer);
    state.playTimer = null;
    playBtnEl.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 12 12">
        <polygon points="1,1 11,6 1,11" fill="currentColor"/>
      </svg> Анімувати`;
  }
}

playBtnEl.addEventListener('click', () => {
  if (state.playTimer) {
    setPlaying(false);
  } else {
    setPlaying(true);
  }
});

function initializeApp(dataset) {
  state.villages = dataset.villages;
  state.allYears = dataset.allYears;
  state.categories = dataset.categories;
  state.year = dataset.allYears.min;
  state.activeCategories = new Set(dataset.categories);

  sliderEl.min = dataset.allYears.min;
  sliderEl.max = dataset.allYears.max;
  sliderEl.value = dataset.allYears.min;
  document.getElementById('year-min').textContent = dataset.allYears.min;
  document.getElementById('year-max').textContent = dataset.allYears.max;

  buildCategoryButtons();
  buildLegend();
  updateYearDisplay(state.year);
  renderMarkers();
  renderVillageList();
}

window.loadVillageDataset()
  .then(initializeApp)
  .catch((error) => {
    console.error(error);
    alert(`Failed to load dataset: ${error.message}`);
  });
