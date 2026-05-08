// =============================================================================
// Map layer registry.
// =============================================================================
// SF is a consolidated city-county. The Board of Supervisors (11 members)
// also serves as the city council, so we have a single supervisorial layer
// instead of separate county-supervisor + city-council layers.
// =============================================================================

import type { MapLayerDef, MapLayerKey } from "./types";

export const LAYER_COLORS: Record<MapLayerKey, string> = {
  congressional: "#7f1d1d", // dark red wine
  stateSenate:   "#b45309", // amber
  assembly:      "#15803d", // green
  supervisorial: "#6b21a8", // purple
  city:          "#0f766e", // teal
  schoolDistrict:"#334155", // slate
};

export const MAP_LAYERS: MapLayerDef[] = [
  {
    key: "congressional",
    label: "Congressional Districts",
    geojsonPath: "/data/congressional.geojson",
    available: true,
  },
  {
    key: "stateSenate",
    label: "State Senate Districts",
    geojsonPath: "/data/state-senate.geojson",
    available: true,
  },
  {
    key: "assembly",
    label: "State Assembly Districts",
    geojsonPath: "/data/assembly.geojson",
    available: true,
  },
  {
    key: "supervisorial",
    label: "Supervisor / Council Districts",
    geojsonPath: "/data/supervisorial.geojson",
    available: true,
  },
  {
    key: "city",
    label: "City Boundary",
    geojsonPath: "/data/cities.geojson",
    available: true,
  },
  {
    key: "schoolDistrict",
    label: "School District (SFUSD)",
    geojsonPath: "/data/school-districts.geojson",
    available: true,
  },
];

/** Always-on background layer: the SF county outline. (Filename retained from
 *  the LA template — we keep `la-county-outline.geojson` here too so the
 *  rest of the code can stay generic.) */
export const LA_COUNTY_OUTLINE_PATH = "/data/la-county-outline.geojson";
