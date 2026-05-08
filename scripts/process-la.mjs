import fs from 'node:fs';

const ROOT = '/Users/jackdanielson/lagop-endorsement-lookup/public/data';

const la = JSON.parse(fs.readFileSync(`${ROOT}/la-county-outline.geojson`, 'utf8'));

function bboxOfGeometry(g) {
  let minX=Infinity, minY=Infinity, maxX=-Infinity, maxY=-Infinity;
  function walk(c){ if(typeof c[0]==='number'){if(c[0]<minX)minX=c[0];if(c[0]>maxX)maxX=c[0];if(c[1]<minY)minY=c[1];if(c[1]>maxY)maxY=c[1];}else for(const x of c)walk(x); }
  walk(g.coordinates);
  return [minX,minY,maxX,maxY];
}
const laBbox = bboxOfGeometry(la.features[0].geometry);

function bboxIntersects(a,b){return a[0]<=b[2]&&a[2]>=b[0]&&a[1]<=b[3]&&a[3]>=b[1];}

function clean(input, output, label, mapProps, filter) {
  const fc = JSON.parse(fs.readFileSync(input, 'utf8'));
  const features = fc.features
    .filter(f => filter ? filter(f) : true)
    .filter(f => bboxIntersects(bboxOfGeometry(f.geometry), laBbox))
    .map(f => ({ type: 'Feature', properties: mapProps(f.properties), geometry: f.geometry }));
  fs.writeFileSync(output, JSON.stringify({ type: 'FeatureCollection', features }));
  console.error(`${label}: ${features.length} features, ${fs.statSync(output).size} bytes`);
}

// Supervisorial — just keep DISTRICT.
clean('/tmp/supervisorial-raw.geojson', `${ROOT}/supervisorial.geojson`, 'Supervisorial',
  p => ({ district: String(p.DISTRICT), label: `Supervisorial District ${p.DISTRICT}` })
);

// LA City Council — keep DISTRICT and member name (member name is a placeholder anyway).
clean('/tmp/lacc-raw.geojson', `${ROOT}/la-city-council.geojson`, 'LA City Council',
  p => ({ district: String(p.DISTRICT), label: `LA City Council District ${p.DISTRICT}`, member: p.MEMBER ?? null })
);

// Cities — keep just CITY_TYPE === 'City' (drop unincorporated communities).
clean('/tmp/cities-raw.geojson', `${ROOT}/cities.geojson`, 'Cities',
  p => ({ name: p.CITY_NAME, label: p.CITY_LABEL ?? p.CITY_NAME, abbr: p.ABBR ?? null }),
  f => f.properties.CITY_TYPE === 'City'
);

// School districts — keep LABEL + DISTRICT_TYPE.
clean('/tmp/school-raw.geojson', `${ROOT}/school-districts.geojson`, 'School Districts',
  p => ({ name: p.LABEL, type: p.DISTRICT_TYPE })
);
