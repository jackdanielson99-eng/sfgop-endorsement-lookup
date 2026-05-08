# Map data

This folder is where LAGOP staff drop **real** GeoJSON boundary files for the
map layers. The prototype ships with a single placeholder file:

- `la-county-outline.geojson` — simplified LA County outline. Replace with the
  official county boundary before launch.

## Recommended files to add later

The map layer toggles in `app/lib/mapLayers.ts` reference these filenames:

| Toggle               | Expected file                       |
| -------------------- | ----------------------------------- |
| Congressional        | `congressional.geojson`             |
| State Senate         | `state-senate.geojson`              |
| Assembly             | `assembly.geojson`                  |
| Supervisorial        | `supervisorial.geojson`             |
| City boundaries      | `cities.geojson`                    |
| School board         | `school-board.geojson`              |
| Special districts    | `special-districts.geojson`         |

After you drop a file in this folder, open `app/lib/mapLayers.ts` and set that
layer's `available: true`. The toggle in the UI will activate automatically.

## Where to find official boundaries

- **California redistricting (Congress / State Senate / Assembly):**
  https://wedrawthelinesca.org/final_maps
- **LA County GIS open data portal:**
  https://egis-lacounty.hub.arcgis.com/
- **City of Los Angeles GeoHub:**
  https://geohub.lacity.org/

Please use **WGS84 (EPSG:4326)** coordinates and prefer files under ~5 MB for
fast load on mobile. Run any large file through https://mapshaper.org/ to
simplify before committing.
