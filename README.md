# vil-map

Interactive historical map of village/settlement renames.

## Data source (CSV)

The app now loads data from `data.csv`.

Expected columns:
- `old name`
- `new name`
- `rename date`
- `act`
- `type`
- `lat`
- `lng`
- `category` (use `;` to separate multiple categories, e.g. `деетнізація;натуралізація`)

Notes:
- `rename date` can be a year (`1948`) or a parseable date (`1948-06-10`); the timeline uses the extracted year.
- `lat` and `lng` must be valid numbers.
- Rows missing required fields (`old name`, `new name`, `rename date`, `lat`, `lng`) are skipped.
- The current UI surfaces `type`, `category`, `rename date`, and `act` from CSV; `region` is not used in this version.

## Run locally

Do **not** open `index.html` directly via `file://`.
Start a local HTTP server from the project folder and open the served URL:

```bash
cd vil-map
python -m http.server 8000
```

Then open:

`http://localhost:8000/index.html`
