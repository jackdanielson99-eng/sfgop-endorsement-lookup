"use client";

// Wraps CountyMap so it can be `dynamic`-imported with ssr: false from page.tsx.
// Leaflet touches `window` on import, so it can't be rendered on the server.

import { useState } from "react";
import dynamic from "next/dynamic";
import LayerToggles from "./LayerToggles";
import { MAP_LAYERS } from "../lib/mapLayers";
import type { MapLayerKey } from "../lib/types";
import type { GeocodeMatch } from "../lib/search";

const CountyMap = dynamic(() => import("./CountyMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] sm:h-[480px] w-full rounded-lg border border-gray-200 bg-white flex items-center justify-center text-sm text-gray-500">
      Loading map…
    </div>
  ),
});

interface Props {
  /** Geocoded location to pin on the map (or null when no search has matched). */
  pin: GeocodeMatch | null;
}

export default function MapSection({ pin }: Props) {
  const [visibleLayers, setVisibleLayers] = useState<
    Record<MapLayerKey, boolean>
  >(() =>
    Object.fromEntries(MAP_LAYERS.map((l) => [l.key, false])) as Record<
      MapLayerKey,
      boolean
    >
  );

  const toggle = (key: MapLayerKey) =>
    setVisibleLayers((v) => ({ ...v, [key]: !v[key] }));

  // Translate the GeocodeMatch into the slim shape CountyMap wants.
  const mapPin = pin
    ? { lat: pin.lat, lng: pin.lng, label: pin.displayLabel }
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <CountyMap visibleLayers={visibleLayers} pin={mapPin} />
      </div>
      <aside className="lg:col-span-1">
        <LayerToggles visibleLayers={visibleLayers} onToggle={toggle} />
      </aside>
    </div>
  );
}
