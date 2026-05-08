// Reference key explaining the badges, symbols, and map colors used throughout
// the page. Always visible so voters can pattern-match without hunting.

import { LAYER_COLORS, MAP_LAYERS } from "../lib/mapLayers";

const BADGES: { label: string; classes: string; text: string }[] = [
  {
    label: "Endorsed by SFGOP",
    classes: "bg-gop-red text-white",
    text: "Officially endorsed by the San Francisco Republican County Central Committee.",
  },
  {
    label: "Recommended",
    classes: "bg-amber-500 text-white",
    text: "Recommended by SFGOP. Not a formal endorsement.",
  },
];

export default function Legend() {
  return (
    <section
      aria-labelledby="legend-heading"
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5"
    >
      <h2
        id="legend-heading"
        className="text-sm font-semibold uppercase tracking-wide text-gray-600"
      >
        Key
      </h2>

      {/* Endorsement badges. */}
      <h3 className="mt-3 text-xs font-semibold uppercase tracking-wider text-navy">
        Endorsement badges
      </h3>
      <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {BADGES.map((b) => (
          <li
            key={b.label}
            className="flex items-start gap-2 border-b border-gray-100 pb-2"
          >
            <span
              className={`shrink-0 inline-flex items-center rounded-full text-[10px] font-semibold uppercase tracking-wide px-2 py-1 ${b.classes}`}
            >
              {b.label}
            </span>
            <span className="text-gray-700">{b.text}</span>
          </li>
        ))}

        <li className="flex items-start gap-2 sm:col-span-2">
          <span className="shrink-0 text-gop-red text-base leading-none mt-0.5">
            ★
          </span>
          <span className="text-sm text-gray-700">
            <span className="font-medium text-navy">Incumbent</span> — the
            candidate currently holds this office.
          </span>
        </li>
      </ul>

      {/* Map layer colors. */}
      <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-navy">
        Map layer colors
      </h3>
      <p className="mt-1 text-xs text-gray-500">
        Toggle these on the map using the panel to the right of the map.
      </p>
      <ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
        {MAP_LAYERS.filter((l) => l.available && l.displayInUI !== false).map(
          (l) => (
            <li key={l.key} className="flex items-center gap-2">
              <span
                aria-hidden
                className="shrink-0 h-3 w-5 rounded-sm border border-black/10"
                style={{ backgroundColor: LAYER_COLORS[l.key] }}
              />
              <span className="text-navy">{l.label}</span>
            </li>
          )
        )}
        <li className="flex items-center gap-2">
          <span
            aria-hidden
            className="shrink-0 h-3 w-5 rounded-sm border border-black/10"
            style={{ backgroundColor: "#0d47a1" }}
          />
          <span className="text-navy">San Francisco Outline</span>
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden
            className="shrink-0 h-3 w-3 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: "#0d47a1" }}
          />
          <span className="text-navy">Searched location pin</span>
        </li>
      </ul>
    </section>
  );
}
