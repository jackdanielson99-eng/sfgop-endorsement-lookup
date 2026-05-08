// Shown in place of the YourDistrictsPanel when a voter searched by city
// name only. Tells them the results cover every endorsement in that city,
// not just their specific district, and nudges them to enter a full address
// for precision.

interface Props {
  cityName: string;
}

export default function CityOverviewNote({ cityName }: Props) {
  return (
    <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
        City Overview
      </h2>
      <p className="mt-2 text-sm text-gray-700">
        Showing endorsements and recommendations for the entire{" "}
        <span className="font-semibold text-navy">City of {cityName}</span>.
        Some races shown may belong to a district you don&apos;t live in.
      </p>
      <p className="mt-2 text-sm text-gray-600">
        For your specific districts, search by your full street address (e.g.{" "}
        <span className="font-medium">123 Main St, {cityName}, CA</span>).
      </p>
    </section>
  );
}
