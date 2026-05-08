# Adapting this tool for another county / state party

This repo started as the **SFGOP Endorsement Lookup** for San Francisco
but the architecture is fully reusable. Most county / state party builds
should take a few hours, not weeks.

> **Quick orientation for a new Claude session.** When you (or another
> developer) starts a new chat to fork this for another county, paste this
> file's path or contents into the first message — it's the canonical
> handoff doc. It tells Claude what's reusable as-is, what needs swapping,
> where to find data, and what design decisions were already made.

---

## What's reusable as-is (no changes)

- **App code** — Next.js 14 + TypeScript + Tailwind + react-leaflet (no API
  keys, free OpenStreetMap tiles, free CartoDB Positron basemap).
- **Geocoding** — US Census Bureau Geocoder works nationwide, no key needed.
  See `app/api/geocode/route.ts`.
- **Point-in-polygon district matching** — `app/lib/districts.ts`. Generic
  for any layer; just feed it different GeoJSONs.
- **Search flow** — full address → ZIP fallback → city centroid fallback,
  with city-overview mode for city-only searches. `app/lib/search.ts`.
- **UI primitives** — Header, Election Banner, Search, Map, Layer Toggles,
  Candidate Card, Results List, Print view, Key/Legend, Your Districts.
  All driven by the data; swap data and they re-render correctly.
- **Print voter guide** — compact one-line-per-candidate output. Works for
  any size slate.
- **Vercel Analytics**, **Open Graph card**, **shareable URLs** — all
  generic, no county-specific code.

---

## What's county-specific (needs to be swapped)

### 1. Boundary GeoJSONs in `/public/data`

Every file here is LA-County-filtered. To adapt:

| File | What it is | How to replace |
|---|---|---|
| `la-county-outline.geojson` | Always-on county outline drawn on the map | Pull your county polygon from US Census or your county GIS. Save it under the same filename (or update `LA_COUNTY_OUTLINE_PATH` in `lib/mapLayers.ts`). |
| `congressional.geojson` | Districts touching the county | Re-run `scripts/import-ab604.mjs` (CA only — uses the AB 604 / Prop 50 map) **or** re-fetch from US Census TIGERweb (works everywhere). See "Data sources" below. |
| `state-senate.geojson` | State upper-house districts | TIGERweb layer 1 (current State Legislative Districts — Upper). |
| `assembly.geojson` | State lower-house districts | TIGERweb layer 2. |
| `supervisorial.geojson` | County board of supervisors | Your county GIS portal. |
| `cities.geojson` | Incorporated cities in the county | Filter your county GIS's city-boundaries layer. |
| `school-districts.geojson` | K-12 school districts | County GIS or state department of education. |
| `la-city-council.geojson` | Per-district seats in the county's largest city | Only needed if a major city has by-district seats. |
| `torrance/pasadena/covina-city-council.geojson` | Smaller cities with by-district seats | Each city's open data portal (ArcGIS Hub usually). |
| `zip-centroids.json` | Bare-ZIP fallback | Re-fetch ZCTAs from TIGERweb, filter to county bbox, write `{ zip: [lng, lat] }`. |

### 2. Code references to "LA" / San Francisco

These need a search-and-replace pass when forking:

- `app/lib/mapLayers.ts` → `LAYER_COLORS` keys + labels are generic;
  `MAP_LAYERS[].label` says "LA City Council Districts" and
  "County Supervisorial Districts" — rename for the new county.
- `app/lib/districts.ts` → `CITY_COUNCIL_FOR_MATCHING` and `CITY_COUNCIL_PATHS`
  hard-code Torrance/Pasadena/Covina. Replace with the new county's
  by-district cities (or remove if there are none).
- `app/lib/districts.ts` → `districtsToMatchTags` uses `la-cc-` prefix for
  the largest city; rename if you want a different short prefix.
- `app/components/YourDistrictsPanel.tsx` → labels say "LA County
  Supervisor", "LA City Council" — change to the new county's terminology.
- `app/components/Footer.tsx` → committee name, FEC #, FPPC ID, FEIN.
- `app/components/Header.tsx` → "SFGOP", "San Francisco Republican
  Party", LA-org URL.
- `app/components/IntroCard.tsx`, `Legend.tsx`, `ResultsList.tsx`,
  `CityOverviewNote.tsx` → "SFGOP" mentions in the user-facing copy.
- `app/components/ElectionBanner.tsx` → date constant + polling-place URL +
  sample-ballot URL (your state's voter info site).
- `app/api/geocode/route.ts` → no changes needed (Census API is national).
- `app/icon.svg` → favicon.
- `app/opengraph-image.tsx` → social card colors + wordmark.
- `app/layout.tsx` → `metadata.title`, `description`, `siteUrl`.
- `tailwind.config.ts` → `navy` and `gop` palette if you want different
  brand colors.

### 3. Data files

- `app/data/endorsements.ts` — entirely replace with the new county's
  slate. The `Candidate` type stays the same.
- `app/lib/types.ts` `OfficeCategory` — only touch if your slate has a
  category not already covered (Federal, State, County, City, School Board,
  Special Districts, Judicial).

---

## Data sources playbook

### National / state-wide (works for any state)

- **US Census TIGERweb REST** — `https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Legislative/MapServer`
  - Layer 0: Current Congressional Districts
  - Layer 1: State Senate (Upper)
  - Layer 2: State Assembly (Lower)
  - Query with `?where=STATE='XX'&outFields=GEOID,BASENAME&returnGeometry=true&f=geojson&outSR=4326&maxAllowableOffset=0.001`
- **US Census ZCTAs** — `TIGERweb/PUMA_TAD_TAZ_UGA_ZCTA/MapServer/1` for ZIP
  Code Tabulation Areas. Filter by bbox to your county.
- **US Census Geocoder** — `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress`
  is the proxied call in `app/api/geocode/route.ts`. Already national.

### California-specific

- **AB 604 / Proposition 50 Congressional districts (post-2025)** —
  `https://aelc.assembly.ca.gov/proposed-congressional-map` ships shapefiles.
  See `scripts/import-ab604.mjs`. Other states won't have this — TIGERweb
  is the right source.

### County / city portals

- **LA County GIS** — `public.gis.lacounty.gov/public/rest/services/LACounty_Dynamic/Political_Boundaries/MapServer`
- **City open-data portals** — typically ArcGIS Hub. Pattern:
  `https://open-data-CITYNAME.hub.arcgis.com/api/feed/dcat-us/1.1.json`
  has machine-readable dataset listings.
- **ArcGIS Online search** — `https://www.arcgis.com/sharing/rest/search?q=CITY+council+districts&f=json`
  is how I found Torrance / Pasadena / Covina council district services.

### Click-That-Hood (community-maintained boundaries)

- `https://github.com/codeforgermany/click_that_hood` — California counties,
  US states, dozens of city neighborhood files. Easy starting point for
  county outlines.

---

## Suggested fork workflow

1. **Create the new repo** — clone or fork this one as
   `[abbreviation]-endorsement-lookup` (e.g. `ocgop-endorsement-lookup`).
2. **Open Claude Code in the new repo's directory.**
3. **Paste this file's content** (or just `cat FORK_GUIDE.md`) into your
   first message so Claude has full context.
4. **Tell Claude what to do**, e.g.:
   > "I'm forking this for the Orange County Republican Party. Help me:
   > (a) swap in OC's county outline, supervisorial districts, cities, and
   > school districts; (b) re-fetch CD/SD/AD filtered to OC; (c) replace
   > the SFGOP branding with OCGOP branding; (d) update the FEC/FPPC IDs
   > in the footer."
5. **Provide endorsement data** when ready — paste the official voter-guide
   document and Claude will convert it to `endorsements.ts` in the right
   format.
6. **Deploy** — same Vercel + GitHub flow as the original.

---

## Design decisions worth preserving

These came out of SFGOP feedback and are worth keeping (or knowing about
when explaining to a new client):

- **"Endorsed" language is reserved for SFGOP and CAGOP** — the two
  Republican Party endorsements. Every other source uses "Recommended by
  [Group]". Red badge for party endorsements, neutral colors for
  recommendations. (See `badgeFor` in `app/components/CandidateCard.tsx`.)
- **Disclaimer banner** above results is mandatory — voters need to know
  not every card is a direct party endorsement. (See `ResultsList.tsx`.)
- **Print version is one line per candidate** — voters print and bring to
  the polling place. Don't ship a print view that bloats to 5+ pages.
- **City-only searches use overview mode** — show every endorsement in the
  city, not just the centroid spot. Tells voters when this happened.
- **Donate buttons are not in the UI** — the type allows `website` and
  `volunteer` URLs only. SFGOP didn't want donation prompts in the tool.
- **Disclosure footer is required** — FEC #, FPPC ID, FEIN. Each county /
  state party has their own — get them before launch.

---

## Files you'll touch most often after launch

- **`app/data/endorsements.ts`** — every endorsement update. Format is
  documented at the top of the file.
- **`app/components/ElectionBanner.tsx`** — date constant for next election.
- **`/public/data/*.geojson`** — when boundaries change (redistricting,
  city annexations, school district consolidations).

Everything else is structural and rarely needs touching.
