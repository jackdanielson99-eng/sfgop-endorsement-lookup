"use client";

// Sidebar-style controls for toggling each map layer.

import { LAYER_COLORS, MAP_LAYERS } from "../lib/mapLayers";
import type { MapLayerKey } from "../lib/types";

interface Props {
  visibleLayers: Record<MapLayerKey, boolean>;
  onToggle: (key: MapLayerKey) => void;
}

export default function LayerToggles({ visibleLayers, onToggle }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-semibold text-navy uppercase tracking-wide">
        Map Layers
      </h3>
      <p className="text-xs text-gray-500 mt-1">
        Toggle district lines on the map.
      </p>
      <ul className="mt-3 space-y-2">
        {MAP_LAYERS.map((layer) => {
          const disabled = !layer.available;
          return (
            <li key={layer.key} className="flex items-start gap-2">
              <input
                id={`toggle-${layer.key}`}
                type="checkbox"
                disabled={disabled}
                checked={!!visibleLayers[layer.key]}
                onChange={() => onToggle(layer.key)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-gop-red focus:ring-gop-red disabled:opacity-50"
              />
              <span
                aria-hidden
                className="mt-1.5 h-3 w-3 rounded-sm shrink-0 border border-black/10"
                style={{
                  backgroundColor: disabled ? "transparent" : LAYER_COLORS[layer.key],
                }}
              />
              <label
                htmlFor={`toggle-${layer.key}`}
                className={`text-sm leading-tight ${
                  disabled ? "text-gray-400" : "text-navy"
                }`}
              >
                {layer.label}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
