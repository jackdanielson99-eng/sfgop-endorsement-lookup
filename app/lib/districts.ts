// =============================================================================
// District lookup — loads boundary GeoJSONs and runs point-in-polygon to
// determine which Congressional / Senate / Assembly / Supervisorial / etc.
// district a geocoded address falls inside.
// =============================================================================

import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import type { Feature, FeatureCollection, Polygon, MultiPolygon } from "geojson";

import { MAP_LAYERS } from "./mapLayers";
import type { DistrictMatches, MapLayerKey } from "./types";

type DistrictFeature = Feature<Polygon | MultiPolygon>;
export type LayerData = Partial<Record<MapLayerKey, DistrictFeature[]>>;

/** ZIP-code → [lng, lat] lookup, sourced from /public/data/zip-centroids.json. */
export type ZipLookup = Record<string, [number, number]>;

async function loadOne(path: string): Promise<DistrictFeature[] | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const fc = (await res.json()) as FeatureCollection;
    return fc.features.filter(
      (f): f is DistrictFeature =>
        f.geometry?.type === "Polygon" || f.geometry?.type === "MultiPolygon"
    );
  } catch {
    return null;
  }
}

export async function loadAllDistrictLayers(): Promise<LayerData> {
  const out: LayerData = {};
  await Promise.all(
    MAP_LAYERS.filter((l) => l.available).map(async (l) => {
      const features = await loadOne(l.geojsonPath);
      if (features) out[l.key] = features;
    })
  );
  return out;
}

export async function loadZipLookup(): Promise<ZipLookup> {
  try {
    const res = await fetch("/data/zip-centroids.json");
    if (!res.ok) return {};
    return (await res.json()) as ZipLookup;
  } catch {
    return {};
  }
}

export function extractZip(rawInput: string): string | null {
  const m = rawInput.match(/\b(\d{5})(?:-\d{4})?\b/);
  return m ? m[1] : null;
}

function findContaining(
  layer: DistrictFeature[] | undefined,
  lat: number,
  lng: number
): DistrictFeature | null {
  if (!layer) return null;
  const pt = point([lng, lat]);
  for (const f of layer) {
    if (booleanPointInPolygon(pt, f)) return f;
  }
  return null;
}

export function matchPointToDistricts(
  lat: number,
  lng: number,
  layers: LayerData
): DistrictMatches {
  const cd = findContaining(layers.congressional, lat, lng);
  const sd = findContaining(layers.stateSenate, lat, lng);
  const ad = findContaining(layers.assembly, lat, lng);
  const sup = findContaining(layers.supervisorial, lat, lng);
  const city = findContaining(layers.city, lat, lng);
  const sch = findContaining(layers.schoolDistrict, lat, lng);

  return {
    congressional: cd?.properties?.district ?? null,
    stateSenate: sd?.properties?.district ?? null,
    assembly: ad?.properties?.district ?? null,
    supervisorial: sup?.properties?.district ?? null,
    city: city?.properties?.name ?? null,
    schoolDistrict: sch?.properties?.name ?? null,
  };
}

function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function slugify(s: string | null): string | null {
  if (!s) return null;
  return stripAccents(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function findCityCentroid(
  rawInput: string,
  cityLayer: DistrictFeature[] | undefined
): {
  lat: number;
  lng: number;
  name: string;
  features: DistrictFeature[];
} | null {
  if (!cityLayer) return null;

  const wanted = stripAccents(rawInput)
    .trim()
    .toLowerCase()
    .replace(/[,.]/g, "")
    .replace(/\s+ca$/, "")
    .replace(/\s+california$/, "")
    .trim();
  if (!wanted) return null;

  const matches = cityLayer.filter(
    (f) =>
      stripAccents(String(f.properties?.name ?? "")).toLowerCase() === wanted
  );
  if (matches.length === 0) return null;

  const [minX, minY, maxX, maxY] = bboxOfFeatures(matches);
  return {
    lat: (minY + maxY) / 2,
    lng: (minX + maxX) / 2,
    name: String(matches[0].properties?.name),
    features: matches,
  };
}

function bboxOfFeatures(features: DistrictFeature[]): [number, number, number, number] {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  function walk(c: unknown): void {
    if (Array.isArray(c) && typeof c[0] === "number") {
      const [x, y] = c as [number, number];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    } else if (Array.isArray(c)) {
      for (const child of c) walk(child);
    }
  }
  for (const f of features) walk((f.geometry as Polygon | MultiPolygon).coordinates);
  return [minX, minY, maxX, maxY];
}

function sampleGridInsideFeatures(
  features: DistrictFeature[],
  gridSize: number
): [number, number][] {
  const [minX, minY, maxX, maxY] = bboxOfFeatures(features);
  const samples: [number, number][] = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const lng = minX + ((maxX - minX) * (i + 0.5)) / gridSize;
      const lat = minY + ((maxY - minY) * (j + 0.5)) / gridSize;
      const pt = point([lng, lat]);
      if (features.some((f) => booleanPointInPolygon(pt, f))) {
        samples.push([lng, lat]);
      }
    }
  }
  return samples;
}

export function expandCityToMatchTags(
  cityFeatures: DistrictFeature[],
  cityName: string,
  layers: LayerData
): string[] {
  const samples = sampleGridInsideFeatures(cityFeatures, 8);
  if (samples.length === 0) return [];

  const tags = new Set<string>();

  function overlapping(layer: DistrictFeature[] | undefined): DistrictFeature[] {
    if (!layer) return [];
    const seen = new Set<DistrictFeature>();
    for (const [lng, lat] of samples) {
      const pt = point([lng, lat]);
      for (const f of layer) {
        if (seen.has(f)) continue;
        if (booleanPointInPolygon(pt, f)) seen.add(f);
      }
    }
    return Array.from(seen);
  }

  for (const f of overlapping(layers.congressional))
    if (f.properties?.district) tags.add(`ca-cd-${f.properties.district}`);
  for (const f of overlapping(layers.stateSenate))
    if (f.properties?.district) tags.add(`ca-sd-${f.properties.district}`);
  for (const f of overlapping(layers.assembly))
    if (f.properties?.district) tags.add(`ca-ad-${f.properties.district}`);
  for (const f of overlapping(layers.supervisorial))
    if (f.properties?.district) tags.add(`sf-sup-${f.properties.district}`);
  for (const f of overlapping(layers.schoolDistrict)) {
    const slug = slugify(f.properties?.name as string | null);
    if (slug) tags.add(`school-${slug}`);
  }

  const citySlug = slugify(cityName);
  if (citySlug) tags.add(citySlug);

  return Array.from(tags);
}

export function districtsToMatchTags(d: DistrictMatches): string[] {
  const tags: string[] = [];
  if (d.congressional) tags.push(`ca-cd-${d.congressional}`);
  if (d.stateSenate) tags.push(`ca-sd-${d.stateSenate}`);
  if (d.assembly) tags.push(`ca-ad-${d.assembly}`);
  if (d.supervisorial) tags.push(`sf-sup-${d.supervisorial}`);
  const citySlug = slugify(d.city);
  if (citySlug) tags.push(citySlug);
  const schSlug = slugify(d.schoolDistrict);
  if (schSlug) tags.push(`school-${schSlug}`);
  return tags;
}
