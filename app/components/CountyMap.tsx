"use client";

// =============================================================================
// CountyMap — interactive San Francisco map.
// =============================================================================
// Built with react-leaflet (no API key needed). Renders:
//   1. CartoDB Positron tile layer — clean, light, minimal labels.
//   2. The SF county outline (consolidated city-county).
//   3. A marker pin at the geocoded address (when search returns a location).
//   4. A registry of toggleable layers (congressional, assembly, etc.) — each
//      becomes active automatically once its GeoJSON file is added to
//      /public/data and `available: true` in app/lib/mapLayers.ts.
// =============================================================================

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { FeatureCollection } from "geojson";

import { LA_COUNTY_OUTLINE_PATH, LAYER_COLORS, MAP_LAYERS } from "../lib/mapLayers";
import type { MapLayerKey } from "../lib/types";

// SF rough center.
const LA_CENTER: [number, number] = [37.7749, -122.4194];
const LA_ZOOM = 12;

// Branded pin — small navy circle with red dot.
const sfgopPin = L.divIcon({
  className: "sfgop-pin",
  html: `
    <div style="
      width: 22px; height: 22px;
      border-radius: 50%;
      background: #0a2240;
      border: 3px solid #ffffff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
      display: flex; align-items: center; justify-content: center;
    ">
      <div style="width: 8px; height: 8px; border-radius: 50%; background: #b91c1c;"></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

interface PinLocation {
  lat: number;
  lng: number;
  label: string;
}

interface Props {
  visibleLayers: Record<MapLayerKey, boolean>;
  pin: PinLocation | null;
}

// Helper component: smoothly recenters the map whenever `pin` changes.
function FlyToPin({ pin }: { pin: PinLocation | null }) {
  const map = useMap();
  useEffect(() => {
    if (pin) {
      map.flyTo([pin.lat, pin.lng], 12, { duration: 0.8 });
    }
  }, [pin, map]);
  return null;
}

export default function CountyMap({ visibleLayers, pin }: Props) {
  const [outline, setOutline] = useState<FeatureCollection | null>(null);
  const [layerData, setLayerData] = useState<
    Partial<Record<MapLayerKey, FeatureCollection>>
  >({});

  useEffect(() => {
    fetch(LA_COUNTY_OUTLINE_PATH)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setOutline(d))
      .catch(() => {
        /* outline file missing — safe to ignore */
      });
  }, []);

  useEffect(() => {
    MAP_LAYERS.forEach((layer) => {
      if (!layer.available) return;
      if (!visibleLayers[layer.key]) return;
      if (layerData[layer.key]) return;

      fetch(layer.geojsonPath)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d) setLayerData((prev) => ({ ...prev, [layer.key]: d }));
        })
        .catch(() => {
          /* layer not yet provided — UI shows "pending" */
        });
    });
  }, [visibleLayers, layerData]);

  return (
    <div className="relative h-[420px] sm:h-[480px] w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={LA_CENTER}
        zoom={LA_ZOOM}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        {/* Clean light basemap — CartoDB Positron, no API key required. */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        {outline && (
          <GeoJSON
            data={outline}
            style={{
              color: "#0a2240",
              weight: 2,
              fillColor: "#0a2240",
              fillOpacity: 0.05,
            }}
          />
        )}

        {/* Toggleable real-data layers — render only when the file is present
            and the user has the layer turned on. Each layer uses its own
            distinct color from LAYER_COLORS so multiple toggled-on layers
            stay readable. */}
        {MAP_LAYERS.filter(
          (l) => l.available && visibleLayers[l.key] && layerData[l.key]
        ).map((l) => {
          const color = LAYER_COLORS[l.key];
          return (
            <GeoJSON
              key={l.key}
              data={layerData[l.key] as FeatureCollection}
              style={{
                color,
                weight: 1.5,
                fillColor: color,
                fillOpacity: 0.06,
              }}
            />
          );
        })}

        {pin && (
          <Marker position={[pin.lat, pin.lng]} icon={sfgopPin}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold text-navy">Searched location</div>
                <div className="text-gray-700">{pin.label}</div>
              </div>
            </Popup>
          </Marker>
        )}

        <FlyToPin pin={pin} />
      </MapContainer>
    </div>
  );
}
