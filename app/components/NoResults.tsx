// Shown when search returns zero matches.

interface Props {
  searchedLabel: string;
}

export default function NoResults({ searchedLabel }: Props) {
  return (
    <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
      <h2 className="text-lg sm:text-xl font-semibold text-navy">
        No endorsements found
      </h2>
      <p className="mt-2 text-gray-700">
        We could not find endorsements or recommendations for{" "}
        <span className="font-semibold">&ldquo;{searchedLabel}&rdquo;</span>.
        Try a full street address, ZIP code, or city name.
      </p>
    </section>
  );
}
