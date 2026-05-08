// Shows the districts a geocoded address falls inside.

import type { DistrictMatches } from "../lib/types";

interface Props {
  districts: DistrictMatches;
  addressLabel: string;
}

export default function YourDistrictsPanel({ districts, addressLabel }: Props) {
  const rows: { label: string; value: string | null }[] = [
    { label: "Address", value: addressLabel },
    { label: "City", value: districts.city },
    {
      label: "U.S. Congressional District",
      value: districts.congressional ? `District ${districts.congressional}` : null,
    },
    {
      label: "California State Senate",
      value: districts.stateSenate ? `District ${districts.stateSenate}` : null,
    },
    {
      label: "California State Assembly",
      value: districts.assembly ? `District ${districts.assembly}` : null,
    },
    {
      // In SF the Board of Supervisors district is also the city-council
      // district (consolidated city-county).
      label: "SF Supervisor / Council",
      value: districts.supervisorial ? `District ${districts.supervisorial}` : null,
    },
    { label: "School District", value: districts.schoolDistrict },
  ];

  return (
    <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
        Your Districts
      </h2>
      <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {rows
          .filter((r) => r.value)
          .map((r) => (
            <div
              key={r.label}
              className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 border-b border-gray-100 pb-1.5"
            >
              <dt className="text-xs uppercase tracking-wide text-gray-500 sm:w-44 sm:shrink-0">
                {r.label}
              </dt>
              <dd className="text-navy font-medium">{r.value}</dd>
            </div>
          ))}
      </dl>
    </section>
  );
}
