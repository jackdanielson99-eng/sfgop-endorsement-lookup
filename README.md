# LAGOP Endorsement Lookup — Prototype

A clean, mobile-friendly web app that lets Los Angeles County voters look up
LAGOP-endorsed candidates by **address, ZIP code, city, or district**, with an
interactive Los Angeles County map.

> **Prototype only.** This version ships with placeholder candidate data and a
> simplified LA County outline so LAGOP leadership can review the UX, branding,
> and structure before final endorsement and boundary data are added.

---

## What's in this prototype

- **Branded landing page** — Dark navy / white / red, conservative and clean.
- **Search bar** — Accepts address, ZIP, city, or district. Wired to mock data.
- **LA County map** — Interactive ([Leaflet] + OpenStreetMap tiles, no API key).
  Shows a placeholder county outline plus a few sample regions you can click.
- **Layer toggle panel** — Placeholders for Congressional, State Senate,
  Assembly, Supervisorial, City, School Board, and Special District layers.
  Each one activates automatically once a real GeoJSON file is dropped in.
- **Results page** — Endorsement cards grouped by office category (Federal,
  State, County, City, School Board, Special Districts, Judicial). Each card
  has a "Endorsed by LAGOP" badge plus an optional Website button.
- **Friendly empty state** — If no endorsements match, shows a fallback with a
  contact-LAGOP placeholder button.
- **Prototype watermark** — Visible disclaimer in the footer and on the map.

[Leaflet]: https://leafletjs.com/

---

## How to run it locally

You need [Node.js](https://nodejs.org/) **18 or newer** (which comes with `npm`).

```bash
cd lagop-endorsement-lookup
npm install
npm run dev
```

Then open <http://localhost:3000> in your browser.

To create a production build:

```bash
npm run build
npm start
```

---

## Project structure

```
lagop-endorsement-lookup/
├── app/
│   ├── components/         ← React UI components
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CountyMap.tsx       ← Leaflet map (client only)
│   │   ├── MapSection.tsx      ← Map + layer toggles wrapper
│   │   ├── LayerToggles.tsx
│   │   ├── CandidateCard.tsx
│   │   ├── ResultsList.tsx
│   │   ├── NoResults.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   ├── endorsements.ts     ← ⭐ EDIT THIS to update candidates
│   │   └── sampleRegions.ts    ← Placeholder map polygons
│   ├── lib/
│   │   ├── types.ts            ← Shared TypeScript types
│   │   ├── search.ts           ← Mock search/match logic
│   │   └── mapLayers.ts        ← ⭐ EDIT THIS to enable map layers
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                ← Top-level page wiring
├── public/
│   └── data/                   ← ⭐ Drop real GeoJSON files here
│       ├── la-county-outline.geojson  (placeholder)
│       └── README.md
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

---

## Replacing the placeholder data

### 1. Endorsements (candidate cards)

Edit [`app/data/endorsements.ts`](app/data/endorsements.ts). Each candidate is
a single object in the `endorsements` array. The header comment in that file
documents every field, but in short:

```ts
{
  id: "city-001",
  name: "Jane Smith",
  office: "City Council Member",
  jurisdiction: "Los Angeles, District 1",
  category: "City",   // Federal | State | County | City | School Board | Special Districts | Judicial
  party: "Republican",
  website:   "https://example.com",   // optional
  volunteer: "https://example.com",   // optional
  matchTags: ["90012", "los-angeles", "la-cc-1"],
}
```

`matchTags` is what connects a voter's input to a candidate. Use any mix of:

- **ZIP codes** (`"90012"`)
- **City slugs** (`"los-angeles"`, `"long-beach"`, `"pasadena"`)
- **District codes** — `"ca-cd-30"` (Congressional), `"ca-sd-22"` (State
  Senate), `"ca-ad-51"` (Assembly), `"la-sup-3"` (Supervisor), `"la-cc-1"`
  (City Council), `"lausd-bd-2"` (LAUSD board)

### 2. Map boundaries (district layers)

Edit [`app/lib/mapLayers.ts`](app/lib/mapLayers.ts).

1. Drop the real GeoJSON file in `public/data/` using the filename listed for
   that layer (e.g. `congressional.geojson`, `state-senate.geojson`).
2. In `mapLayers.ts`, set that layer's `available: true`.
3. Reload — the toggle activates.

The placeholder LA County outline lives at
`public/data/la-county-outline.geojson` — replace it with the official LA
County boundary at the same path.

Use **WGS84 / EPSG:4326** coordinates and keep files reasonably small
(< ~5 MB). [mapshaper.org](https://mapshaper.org/) is a quick, free way to
simplify large boundary files for web use.

### 3. Sample map polygons (the red boxes)

The clickable red regions on the prototype map are mock placeholders defined in
[`app/data/sampleRegions.ts`](app/data/sampleRegions.ts). Once real district
GeoJSONs are in place you can delete this file and remove the `sampleRegions`
rendering block in `app/components/CountyMap.tsx`.

---

## Connecting real data later

The prototype reads endorsements from a static TypeScript file. Several easy
upgrade paths from here, in increasing order of effort:

### Option A — Static JSON in `/public`

Move endorsements to `public/data/endorsements.json` and change the import in
`app/page.tsx` to a `fetch("/data/endorsements.json")`. Easiest to update from
non-developers (just edit a JSON file).

### Option B — Google Sheet → JSON

1. Publish a Google Sheet as CSV.
2. Add a small build script (`scripts/import-sheet.ts`) that downloads the CSV
   and writes `app/data/endorsements.ts`.
3. Run on every deploy. Staff edit the sheet, push triggers a rebuild.

### Option C — API route

Add `app/api/endorsements/route.ts` that reads from a database or third-party
service (Airtable, Supabase, Google Sheets API). The page already separates
data loading from rendering, so this is a small change.

### Option D — Real geocoding + point-in-polygon

For real address-to-district matching, use a geocoder (Google Maps, Mapbox,
US Census) to convert the address to lat/lng, then point-in-polygon test
against the loaded district GeoJSONs (the previous district-lookup tool used
`@turf/boolean-point-in-polygon` for this). Replace the body of
`findEndorsements` in `app/lib/search.ts`.

---

## Future expansion (already structured for)

The code is intentionally simple, but the structure leaves room for:

- Real address lookup and ZIP-to-district matching
- City-based endorsement filtering
- CSV / Google Sheets imports
- Per-candidate profile pages (`app/candidate/[id]/page.tsx`)
- Print-friendly voter guide (CSS print stylesheet)
- Shareable result links (encode the search query in the URL)
- Spanish-language version (Next.js i18n)
- Election date reminders (banner component)
- Layered, official GeoJSON for every district / jurisdiction type

---

## Notes for LAGOP leadership review

Please review:

1. **Branding** — Does the navy / white / red palette and the "Los Angeles
   County Republican Party" lockup match the official style? Replace the
   small "LA" tile in the header with the official LAGOP logo when ready.
2. **Disclaimer language** — The search section, map watermark, and footer
   each carry "Prototype only" / "Final … pending LAGOP approval" language.
   Confirm wording is acceptable.
3. **Office categories** — Federal, State, County, City, School Board,
   Special Districts, Judicial. Add or remove categories in
   `app/lib/types.ts` (`OfficeCategory`) and `app/components/ResultsList.tsx`
   (`CATEGORY_ORDER`).
4. **Candidate card buttons** — Website and Volunteer are optional per
   candidate. Confirm whether Volunteer should be visible in the
   public-facing version.
5. **"Contact LAGOP" button** — Replace the placeholder `href="#"` in
   `app/components/NoResults.tsx` with the real contact URL or email.
6. **Map placeholders** — The simplified county outline and sample red
   regions are clearly labeled as placeholders. Confirm the rough shape is
   acceptable as the temporary visual until official boundaries are loaded.
7. **Footer attribution** — Update the "Paid for by …" line in
   `app/components/Footer.tsx` to match LAGOP's required disclosure language.

Once approved, the substantive work to launch is:

- Drop in the official LA County GeoJSON outline.
- Drop in district GeoJSONs and flip `available: true` for each layer.
- Replace the contents of `app/data/endorsements.ts` with the real slate.
- Plug in real Website / Volunteer URLs and the LAGOP logo.

