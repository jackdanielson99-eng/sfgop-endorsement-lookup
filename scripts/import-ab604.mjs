// =============================================================================
// import-ab604.mjs — refresh /public/data/congressional.geojson with the
// post-Prop 50 (AB 604) Congressional district map adopted by California in
// August 2025 and used starting with the 2026 elections.
// =============================================================================
// USAGE:
//   1. Download the official shapefile bundle from
//        https://aelc.assembly.ca.gov/proposed-congressional-map → ab604.zip
//      Save to /tmp/ab604.zip and unzip to /tmp/ab604-extract/AB604/.
//      (Example one-liners:
//        curl -sL -o /tmp/ab604.zip \
//          https://aelc.assembly.ca.gov/system/files/2025-08/ab604.zip
//        unzip -o /tmp/ab604.zip -d /tmp/ab604-extract )
//   2. Run this script:
//        node scripts/import-ab604.mjs
//
// What it does:
//   - Parses the shapefile via shpjs.
//   - Filters to districts whose bbox intersects this county's outline
//     (la-county-outline.geojson — name retained from the LAGOP fork).
//   - Simplifies via @turf/simplify and rounds coordinates to 5 decimals.
//   - Writes /public/data/congressional.geojson.
// =============================================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(HERE, "..");

const shp = await import(`${PROJECT}/node_modules/shpjs/lib/index.js`);
const simplify = (await import(`${PROJECT}/node_modules/@turf/simplify/dist/esm/index.js`)).default;

const SHP_DIR = "/tmp/ab604-extract/AB604";
for (const ext of ["shp", "dbf", "prj"]) {
  if (!fs.existsSync(`${SHP_DIR}/AB604.${ext}`)) {
    console.error(
      `Missing /tmp/ab604-extract/AB604/AB604.${ext}. Download ab604.zip and unzip first — see header comment.`
    );
    process.exit(1);
  }
}

console.error("Parsing AB604 shapefile…");
const fc = shp.combine([
  shp.parseShp(
    fs.readFileSync(`${SHP_DIR}/AB604.shp`),
    fs.readFileSync(`${SHP_DIR}/AB604.prj`, "utf8")
  ),
  shp.parseDbf(fs.readFileSync(`${SHP_DIR}/AB604.dbf`), "utf8"),
]);

// Coords come out of shpjs in lat/lng (WGS84) for this dataset, even though
// the .prj declares Web Mercator — the source provider stored coords as
// degrees with a mismatched projection tag.
const ROOT = `${PROJECT}/public/data`;
const county = JSON.parse(
  fs.readFileSync(`${ROOT}/la-county-outline.geojson`, "utf8")
).features[0];

function bbox(g) {
  let mx = Infinity, my = Infinity, Mx = -Infinity, My = -Infinity;
  function w(c) {
    if (Array.isArray(c) && typeof c[0] === "number") {
      const [x, y] = c;
      if (x < mx) mx = x; if (x > Mx) Mx = x;
      if (y < my) my = y; if (y > My) My = y;
    } else if (Array.isArray(c)) for (const ch of c) w(ch);
  }
  w(g.coordinates);
  return [mx, my, Mx, My];
}
const countyBbox = bbox(county.geometry);
const intersects = (a, b) =>
  a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];

const filtered = fc.features.filter((f) =>
  intersects(bbox(f.geometry), countyBbox)
);

const simplified = filtered.map((f) =>
  simplify(
    {
      type: "Feature",
      properties: {
        district: String(+f.properties.DISTRICT),
        label: `Congressional District ${+f.properties.DISTRICT}`,
      },
      geometry: f.geometry,
    },
    { tolerance: 0.001, highQuality: false }
  )
);

function round(c) {
  if (typeof c[0] === "number") return [+c[0].toFixed(5), +c[1].toFixed(5)];
  return c.map(round);
}
for (const f of simplified) f.geometry.coordinates = round(f.geometry.coordinates);
simplified.sort((a, b) => +a.properties.district - +b.properties.district);

const out = { type: "FeatureCollection", features: simplified };
fs.writeFileSync(
  `${ROOT}/congressional.geojson`,
  JSON.stringify(out)
);
console.error(`Wrote ${ROOT}/congressional.geojson`);
console.error(
  `${simplified.length} districts: ${simplified.map((f) => f.properties.district).join(", ")}`
);
console.error(`File size: ${fs.statSync(`${ROOT}/congressional.geojson`).size} bytes`);
