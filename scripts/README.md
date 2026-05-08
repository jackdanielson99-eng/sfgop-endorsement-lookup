# Scripts

These are helper scripts used to generate the prototype's data. You don't need
to run them in normal use — `app/data/endorsements.ts` and the GeoJSON files in
`/public/data` are already populated.

## `gen-endorsements.mjs`

Regenerates `app/data/endorsements.ts` with one placeholder candidate per
office per district covering Los Angeles County. Useful if the boundary files
are updated and the placeholder set should be refreshed.

```bash
node scripts/gen-endorsements.mjs
```

It reads district numbers from `/public/data/{congressional,state-senate,assembly}.geojson`
and writes the full TypeScript file. Edit the script to change office types
or extend coverage.

## `process-la.mjs`

Filters the raw LA County GIS exports (Supervisorial, Cities, LA City Council,
School Districts) to the LA County bounding box and normalizes their property
names. The raw files are temporary downloads under `/tmp/*-raw.geojson` and are
not committed.
