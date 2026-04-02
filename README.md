# vil-map

Interactive historical map of village/settlement renames.

## Data source

The app loads settlements from `data.csv` (UTF-8 CSV).
Expected columns:

`old name,new name,rename date,act,type,lat,lng,category`

If a point has multiple categories, separate them with `;` in the `category` column.

## Run locally

Do **not** open `index.html` directly via `file://`.
Start a local HTTP server from the project folder and open the served URL:

```bash
cd vil-map
python -m http.server 8000
```

Then open:

`http://localhost:8000/index.html`
