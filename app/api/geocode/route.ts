// =============================================================================
// /api/geocode — server-side proxy to the US Census Bureau geocoder.
// =============================================================================
// Why a server proxy?
//   - The Census API is free, no API key, no signup.
//   - Routing through our server avoids any CORS/throttling surprises and
//     gives us a single place to swap providers later (Google, Mapbox, etc.).
//
// Response shape (simplified):
//   { ok: true,  match: { lat, lng, zip, city, displayLabel } }
//   { ok: false, reason: "no_match" | "bad_request" | "upstream_error" }
//
// LATER (Phase 2):
//   - Take the match's lat/lng and run point-in-polygon against district
//     GeoJSONs to determine which CD/SD/AD/Supervisor/etc. it falls in.
//   - Return those district codes alongside `match` so the matcher can use
//     them directly instead of relying on ZIP-based fallback tags.
// =============================================================================

import { NextResponse } from "next/server";

interface CensusAddressMatch {
  matchedAddress?: string;
  coordinates?: { x: number; y: number };
  addressComponents?: {
    zip?: string;
    city?: string;
    state?: string;
  };
}

interface CensusResponse {
  result?: { addressMatches?: CensusAddressMatch[] };
}

const CENSUS_BASE =
  "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const address = (url.searchParams.get("address") ?? "").trim();

  if (!address) {
    return NextResponse.json(
      { ok: false, reason: "bad_request" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    address,
    benchmark: "Public_AR_Current",
    format: "json",
  });

  try {
    const res = await fetch(`${CENSUS_BASE}?${params.toString()}`, {
      // Census responses change daily at most; cache briefly.
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, reason: "upstream_error" },
        { status: 502 }
      );
    }

    const data = (await res.json()) as CensusResponse;
    const first = data.result?.addressMatches?.[0];

    if (!first || !first.coordinates) {
      return NextResponse.json({ ok: false, reason: "no_match" });
    }

    return NextResponse.json({
      ok: true,
      match: {
        lat: first.coordinates.y,
        lng: first.coordinates.x,
        zip: first.addressComponents?.zip ?? null,
        city: first.addressComponents?.city ?? null,
        displayLabel: first.matchedAddress ?? address,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, reason: "upstream_error" },
      { status: 502 }
    );
  }
}
