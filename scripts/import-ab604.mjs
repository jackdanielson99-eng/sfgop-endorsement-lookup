import fs from 'node:fs';
import simplify from '/Users/jackdanielson/lagop-endorsement-lookup/node_modules/@turf/simplify/dist/esm/index.js';

const fc = JSON.parse(fs.readFileSync('/tmp/ab604-statewide.geojson','utf8'));
const ROOT = '/Users/jackdanielson/lagop-endorsement-lookup/public/data';
const la  = JSON.parse(fs.readFileSync(`${ROOT}/la-county-outline.geojson`,'utf8')).features[0];

function bbox(g){
  let mx=Infinity,my=Infinity,Mx=-Infinity,My=-Infinity;
  function w(c){ if(Array.isArray(c)&&typeof c[0]==='number'){const[x,y]=c;if(x<mx)mx=x;if(x>Mx)Mx=x;if(y<my)my=y;if(y>My)My=y;}else if(Array.isArray(c)){for(const ch of c)w(ch);} }
  w(g.coordinates); return [mx,my,Mx,My];
}
const laBbox = bbox(la.geometry);
function bboxIntersects(a,b){return a[0]<=b[2]&&a[2]>=b[0]&&a[1]<=b[3]&&a[3]>=b[1];}

const filtered = fc.features.filter(f => bboxIntersects(bbox(f.geometry), laBbox));

// Turf simplify with tolerance=0.001 deg (~100m) — preserves district shape
// well enough for visual display while shrinking files by 5-10x.
const simplified = filtered.map(f => simplify(f, { tolerance: 0.001, highQuality: false }));

// Round to 5 decimals (≈1.1m precision — way more than needed).
function round(c){ if(typeof c[0]==='number') return [+c[0].toFixed(5), +c[1].toFixed(5)]; return c.map(round); }
for (const f of simplified) f.geometry.coordinates = round(f.geometry.coordinates);

const out = { type: 'FeatureCollection', features: simplified };
fs.writeFileSync(`${ROOT}/congressional.geojson`, JSON.stringify(out));
console.error('Wrote', fs.statSync(`${ROOT}/congressional.geojson`).size, 'bytes');
console.error('Districts:', simplified.map(f=>f.properties.district).sort((a,b)=>+a-+b).join(','));
