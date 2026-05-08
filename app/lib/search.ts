// =============================================================================
// Search logic.
// =============================================================================
// Two-stage flow:
//
//   1. GEOCODE the user's input via /api/geocode (US Census Bureau, free).
//   2. POINT-IN-POLYGON the geocoded lat/lng against loaded district GeoJSONs
//      to determine the voter's exact CD / SD / AD / Supervisorial / City /
//      LA City Council / School district.
//   3. TAG MATCH every candidate whose `matchTags` intersects the derived
//      district tags + raw input keys, plus countywide candidates.
// =============================================================================

import type { Candidate, DistrictMatches } from "./types";
import {
  matchPointToDistricts,
  districtsToMatchTags,
  findCityCentroid,
  expandCityToMatchTags,
  extractZip,
  type LayerData,
  type ZipLookup,
} from "./districts";

export interface GeocodeMatch {
  lat: number;
  lng: number;
  zip: string | null;
  city: string | null;
  displayLabel: string;
}

export interface SearchResult {
  query: string;
  pin: GeocodeMatch | null;
  /** District codes matched by point-in-polygon (null when no geocode/layers). */
  districts: DistrictMatches | null;
  /** Friendly label to display above the results section. */
  label: string;
  candidates: Candidate[];
  /**
   * "address" — voter geocoded to a specific lat/lng (full address or ZIP);
   *   results are precise to their districts.
   * "city-overview" — voter typed only a city name; results include every
   *   endorsement that overlaps any part of that city.
   */
  mode: "address" | "city-overview";
}

export function buildLookupKeys(rawInput: string): string[] {
  const trimmed = rawInput.trim().toLowerCase();
  if (!trimmed) return [];

  const keys = new Set<string>();
  keys.add(trimmed);

  const zipMatch = trimmed.match(/\b\d{5}\b/);
  if (zipMatch) keys.add(zipMatch[0]);

  const slug = trimmed
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  if (slug) keys.add(slug);

  const adNum = trimmed.match(/\b(?:assembly|ad)\D*(\d{1,2})\b/);
  if (adNum) keys.add(`ca-ad-${adNum[1]}`);
  const sdNum = trimmed.match(/\b(?:state senate|sd)\D*(\d{1,2})\b/);
  if (sdNum) keys.add(`ca-sd-${sdNum[1]}`);
  const cdNum = trimmed.match(/\b(?:congress|cd)\D*(\d{1,2})\b/);
  if (cdNum) keys.add(`ca-cd-${cdNum[1]}`);

  return Array.from(keys);
}

/** Calls our /api/geocode proxy. Returns null on no-match or any error. */
export async function geocodeAddress(
  rawInput: string
): Promise<GeocodeMatch | null> {
  const trimmed = rawInput.trim();
  if (!trimmed) return null;

  try {
    const res = await fetch(
      `/api/geocode?address=${encodeURIComponent(trimmed)}`
    );
    if (!res.ok) return null;
    const data = (await res.json()) as
      | { ok: true; match: GeocodeMatch }
      | { ok: false; reason: string };
    return data.ok ? data.match : null;
  } catch {
    return null;
  }
}

/** Top-level search: geocodes, runs point-in-polygon, returns matched candidates. */
export async function runSearch(
  rawInput: string,
  endorsements: Candidate[],
  layers: LayerData,
  zipLookup: ZipLookup
): Promise<SearchResult> {
  let mode: "address" | "city-overview" = "address";

  // 1. Try the Census geocoder (best path — needs a full street address).
  let pin: GeocodeMatch | null = await geocodeAddress(rawInput);

  // 2. Fallback: bare ZIP. Treat as a precise location.
  if (!pin) {
    const zip = extractZip(rawInput);
    if (zip && zipLookup[zip]) {
      const [lng, lat] = zipLookup[zip];
      pin = { lat, lng, zip, city: null, displayLabel: `ZIP ${zip}` };
    }
  }

  // 3. Fallback: bare city name. Switches to "city-overview" mode where we
  //    return every endorsement that overlaps any part of that city.
  let cityFallbackFeatures: Parameters<typeof expandCityToMatchTags>[0] | null = null;
  let cityFallbackName: string | null = null;
  if (!pin) {
    const centroid = findCityCentroid(rawInput, layers.city);
    if (centroid) {
      pin = {
        lat: centroid.lat,
        lng: centroid.lng,
        zip: null,
        city: centroid.name,
        displayLabel: `${centroid.name}, CA`,
      };
      mode = "city-overview";
      cityFallbackFeatures = centroid.features;
      cityFallbackName = centroid.name;
    }
  }

  let districts: DistrictMatches | null = null;
  const allKeys = new Set(buildLookupKeys(rawInput).map((k) => k.toLowerCase()));

  if (pin) {
    if (pin.zip) allKeys.add(pin.zip);
    if (pin.city) {
      const citySlug = pin.city.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
      if (citySlug) allKeys.add(citySlug);
    }

    if (mode === "city-overview" && cityFallbackFeatures && cityFallbackName) {
      // Expand to every district that overlaps the city. Skip
      // matchPointToDistricts (its single-point result would be misleading).
      for (const tag of expandCityToMatchTags(
        cityFallbackFeatures,
        cityFallbackName,
        layers
      )) {
        allKeys.add(tag.toLowerCase());
      }
    } else {
      districts = matchPointToDistricts(pin.lat, pin.lng, layers);
      for (const tag of districtsToMatchTags(districts)) {
        allKeys.add(tag.toLowerCase());
      }
    }
  }

  const keys = Array.from(allKeys);
  const candidates = endorsements.filter((c) => {
    if (c.countywide && pin) return true; // countywide races show whenever we located the voter
    return c.matchTags.some((tag) => keys.includes(tag.toLowerCase()));
  });

  const label = pin?.displayLabel ?? rawInput.trim();

  return { query: rawInput.trim(), pin, districts, label, candidates, mode };
}
