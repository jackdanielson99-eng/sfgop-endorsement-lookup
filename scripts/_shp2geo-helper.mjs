const shp = await import('/Users/jackdanielson/lagop-endorsement-lookup/node_modules/shpjs/lib/index.js');
const fs = await import('node:fs');
const dir = '/tmp/ab604-extract/AB604';
const shpBuf = fs.readFileSync(`${dir}/AB604.shp`);
const dbfBuf = fs.readFileSync(`${dir}/AB604.dbf`);
const prj    = fs.readFileSync(`${dir}/AB604.prj`, 'utf8');

const fc = shp.combine([
  shp.parseShp(shpBuf, prj),
  shp.parseDbf(dbfBuf, 'utf8'),
]);

// Detect coord system: lat/lng range vs Web Mercator (millions of meters).
const sample = fc.features[0].geometry.coordinates;
function firstPoint(c){ if(typeof c[0]==='number') return c; return firstPoint(c[0]); }
const fp = firstPoint(sample);
console.log('first xy:', fp);
const isMercator = Math.abs(fp[0]) > 1000;
console.log('isMercator:', isMercator);

// Web Mercator → WGS84 reverse projection.
function unproject([x, y]) {
  const R = 6378137;
  const lng = (x / R) * (180 / Math.PI);
  const lat = ((Math.atan(Math.exp(y / R)) * 360) / Math.PI - 90);
  return [+lng.toFixed(5), +lat.toFixed(5)];
}
function transform(c) {
  if (typeof c[0] === 'number') return unproject(c);
  return c.map(transform);
}

if (isMercator) {
  for (const f of fc.features) f.geometry.coordinates = transform(f.geometry.coordinates);
}

// Simplify properties: keep just district number + label.
fc.features = fc.features.map(f => ({
  type: 'Feature',
  properties: {
    district: String(+f.properties.DISTRICT),
    label: `Congressional District ${+f.properties.DISTRICT}`,
  },
  geometry: f.geometry,
}));
fc.features.sort((a,b) => +a.properties.district - +b.properties.district);

fs.writeFileSync('/tmp/ab604-statewide.geojson', JSON.stringify(fc));
console.log('statewide:', fs.statSync('/tmp/ab604-statewide.geojson').size, 'bytes');
console.log('district numbers:', fc.features.map(f => f.properties.district).join(','));
