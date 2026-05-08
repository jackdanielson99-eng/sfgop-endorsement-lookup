import fs from 'node:fs';

// Pull district lists from the LA-County-filtered GeoJSONs we already have on disk.
const ROOT = '/Users/jackdanielson/lagop-endorsement-lookup/public/data';
const CD = JSON.parse(fs.readFileSync(`${ROOT}/congressional.geojson`,'utf8')).features
  .map(f => f.properties.district).sort((a,b) => +a - +b);
const SD = JSON.parse(fs.readFileSync(`${ROOT}/state-senate.geojson`,'utf8')).features
  .map(f => f.properties.district).sort((a,b) => +a - +b);
const AD = JSON.parse(fs.readFileSync(`${ROOT}/assembly.geojson`,'utf8')).features
  .map(f => f.properties.district).sort((a,b) => +a - +b);

const out = [];
let auto = 0;
const id = (s) => `${s}-${(++auto).toString().padStart(3,'0')}`;

const cw = (category, office, jurisdiction) => out.push({
  id: id(category.toLowerCase().replace(/\s+/g,'')),
  name: `Sample Candidate — ${office}`,
  office,
  jurisdiction,
  category,
  party: 'Republican',
  matchTags: [],
  countywide: true,
});

// ---------- FEDERAL ----------
cw('Federal', 'U.S. President', 'United States');
cw('Federal', 'U.S. Senator', 'California');
for (const d of CD) {
  out.push({
    id: id('cd'),
    name: `Sample Candidate — CD-${d}`,
    office: 'U.S. Representative',
    jurisdiction: `Congressional District ${d}`,
    category: 'Federal',
    party: 'Republican',
    matchTags: [`ca-cd-${d}`],
  });
}

// ---------- STATE (constitutional / statewide) ----------
cw('State', 'Governor', 'California');
cw('State', 'Lieutenant Governor', 'California');
cw('State', 'Attorney General', 'California');
cw('State', 'Secretary of State', 'California');
cw('State', 'State Treasurer', 'California');
cw('State', 'State Controller', 'California');
cw('State', 'Insurance Commissioner', 'California');
cw('State', 'Superintendent of Public Instruction', 'California');
cw('State', 'Board of Equalization', 'California (Member, District 4 — covers LA County)');

// State Senate per district
for (const d of SD) {
  out.push({
    id: id('sd'),
    name: `Sample Candidate — SD-${d}`,
    office: 'State Senator',
    jurisdiction: `State Senate District ${d}`,
    category: 'State',
    party: 'Republican',
    matchTags: [`ca-sd-${d}`],
  });
}
// Assembly per district
for (const d of AD) {
  out.push({
    id: id('ad'),
    name: `Sample Candidate — AD-${d}`,
    office: 'State Assembly Member',
    jurisdiction: `State Assembly District ${d}`,
    category: 'State',
    party: 'Republican',
    matchTags: [`ca-ad-${d}`],
  });
}

// ---------- COUNTY ----------
cw('County', 'District Attorney', 'Los Angeles County');
cw('County', 'Sheriff', 'Los Angeles County');
cw('County', 'Assessor', 'Los Angeles County');
for (const d of ['1','2','3','4','5']) {
  out.push({
    id: id('sup'),
    name: `Sample Candidate — Supervisor District ${d}`,
    office: 'County Supervisor',
    jurisdiction: `LA County Supervisorial District ${d}`,
    category: 'County',
    party: 'Republican',
    matchTags: [`la-sup-${d}`],
  });
}

// ---------- CITY ----------
// Citywide LA
out.push({ id: id('city'), name: 'Sample Candidate — Mayor of Los Angeles', office: 'Mayor',           jurisdiction: 'City of Los Angeles', category: 'City', party: 'Republican', matchTags: ['los-angeles'] });
out.push({ id: id('city'), name: 'Sample Candidate — LA City Attorney',     office: 'City Attorney',   jurisdiction: 'City of Los Angeles', category: 'City', party: 'Republican', matchTags: ['los-angeles'] });
out.push({ id: id('city'), name: 'Sample Candidate — LA City Controller',   office: 'City Controller', jurisdiction: 'City of Los Angeles', category: 'City', party: 'Republican', matchTags: ['los-angeles'] });

// LA City Council 1–15
for (let d = 1; d <= 15; d++) {
  out.push({
    id: id('lacc'),
    name: `Sample Candidate — LA City Council District ${d}`,
    office: 'City Council Member',
    jurisdiction: `City of Los Angeles, District ${d}`,
    category: 'City',
    party: 'Republican',
    matchTags: [`la-cc-${d}`],
  });
}

// Every other LA County city, pulled directly from the city-boundaries GeoJSON
// so we automatically cover all 88 incorporated cities — minus Los Angeles
// itself (already handled above with citywide + 15 council districts).
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-');
const cityNames = Array.from(new Set(
  JSON.parse(fs.readFileSync(`${ROOT}/cities.geojson`,'utf8'))
    .features.map(f => f.properties.name)
)).filter(n => n && n.toLowerCase() !== 'los angeles').sort();

console.error(`Generating Mayor + Council placeholders for ${cityNames.length} cities`);

for (const name of cityNames) {
  const slug = slugify(name);
  out.push({
    id: id('city'),
    name: `Sample Candidate — Mayor of ${name}`,
    office: 'Mayor',
    jurisdiction: `City of ${name}`,
    category: 'City',
    party: 'Republican',
    matchTags: [slug],
  });
  out.push({
    id: id('city'),
    name: `Sample Candidate — ${name} City Council`,
    office: 'City Council Member',
    jurisdiction: `City of ${name}`,
    category: 'City',
    party: 'Republican',
    matchTags: [slug],
  });
}

// ---------- SCHOOL BOARD ----------
// LAUSD board districts 1–7 (LAUSD covers most of LA city + several other cities).
for (let d = 1; d <= 7; d++) {
  out.push({
    id: id('lausd'),
    name: `Sample Candidate — LAUSD Board District ${d}`,
    office: 'School Board Member',
    jurisdiction: `Los Angeles Unified School District, Board District ${d}`,
    category: 'School Board',
    party: 'Republican',
    matchTags: ['school-los-angeles-unified'],
  });
}
// Generic placeholders for a handful of other big LA County school districts
for (const sd of [
  ['Long Beach Unified', 'school-long-beach-unified'],
  ['Pasadena Unified',   'school-pasadena-unified'],
  ['Glendale Unified',   'school-glendale-unified'],
  ['Burbank Unified',    'school-burbank-unified'],
  ['ABC Unified',        'school-abc-unified'],
]) {
  out.push({
    id: id('sch'),
    name: `Sample Candidate — ${sd[0]} School Board`,
    office: 'School Board Member',
    jurisdiction: sd[0],
    category: 'School Board',
    party: 'Republican',
    matchTags: [sd[1]],
  });
}

// ---------- COMMUNITY COLLEGE (under Special Districts in this prototype) ----------
for (let d = 1; d <= 7; d++) {
  out.push({
    id: id('laccd'),
    name: `Sample Candidate — LACCD Trustee Seat ${d}`,
    office: 'Community College Trustee',
    jurisdiction: 'Los Angeles Community College District',
    category: 'Special Districts',
    party: 'Republican',
    matchTags: [],
    countywide: true,
  });
}
cw('Special Districts', 'Water District Board Member', 'Sample Water District (placeholder)');

// ---------- JUDICIAL ----------
cw('Judicial', 'Superior Court Judge — Office 1',  'Los Angeles County (countywide)');
cw('Judicial', 'Superior Court Judge — Office 2',  'Los Angeles County (countywide)');
cw('Judicial', 'Superior Court Judge — Office 3',  'Los Angeles County (countywide)');

console.error(`Generated ${out.length} placeholder candidates.`);

// Write the TS file with a friendly header.
const header = `// =============================================================================
// SAMPLE ENDORSEMENT DATA — replace with real LAGOP endorsements before launch.
// =============================================================================
// This file was generated programmatically (see scripts/gen-endorsements.mjs)
// to provide one placeholder candidate per office type per district covering
// Los Angeles County, so you can preview the full results UX immediately.
//
// HOW TO REPLACE A PLACEHOLDER:
//   1. Find the candidate object below (search by office name or district).
//   2. Replace name / office / jurisdiction with the real values.
//   3. Optionally add a website or volunteer URL.
//   4. Leave \`matchTags\` and \`countywide\` alone unless the district changes.
//
// HOW MATCHING WORKS:
//   Each candidate has \`matchTags\` like "ca-cd-30", "la-sup-3", "los-angeles".
//   When a voter geocodes their address, the app point-in-polygons their lat/lng
//   against the boundary GeoJSONs in /public/data and produces the same set of
//   tags. Any candidate whose tags intersect is shown.
//
//   Candidates marked \`countywide: true\` always appear once we've located the
//   voter inside LA County (used for President, U.S. Senate, statewide offices,
//   countywide offices, judicial races, etc.).
// =============================================================================

import type { Candidate } from "../lib/types";

export const endorsements: Candidate[] = `;

const body = JSON.stringify(out, null, 2)
  // Drop quotes around keys for a cleaner TS look.
  .replace(/"(id|name|office|jurisdiction|category|party|matchTags|countywide|website|volunteer)":/g, '$1:');

fs.writeFileSync(
  '/Users/jackdanielson/lagop-endorsement-lookup/app/data/endorsements.ts',
  header + body + ';\n'
);
console.error('Wrote endorsements.ts');
