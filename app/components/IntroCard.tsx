// Friendly intro / "how to use" card shown at the top of the page.

export default function IntroCard() {
  return (
    <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-navy">
        About this tool
      </h2>

      <p className="mt-2 text-sm sm:text-base text-gray-700">
        The SFGOP Endorsement Lookup helps San Francisco voters find
        endorsed and recommended candidates for the June 2026 primary. The
        red <span className="font-semibold">Endorsed</span> badges mark
        Republican Party endorsements (SFGOP and CAGOP). Other badges are
        recommendations from allied groups — Reform CA, the Howard Jarvis
        Taxpayers Association, or general recommendations.
      </p>

      <ol className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <li className="rounded-md border border-gray-200 p-3 bg-gray-50/60">
          <div className="font-semibold text-navy">1. Search your area</div>
          <p className="text-gray-600 mt-1">
            Type a real address, ZIP code, or city name and press{" "}
            <span className="font-medium text-navy">Find My Endorsements</span>.
          </p>
        </li>
        <li className="rounded-md border border-gray-200 p-3 bg-gray-50/60">
          <div className="font-semibold text-navy">2. See your location</div>
          <p className="text-gray-600 mt-1">
            The map drops a pin on the address and zooms to San Francisco.
          </p>
        </li>
        <li className="rounded-md border border-gray-200 p-3 bg-gray-50/60">
          <div className="font-semibold text-navy">3. View endorsements</div>
          <p className="text-gray-600 mt-1">
            Endorsed and recommended candidates appear below, grouped by
            office — Federal, State, County, and Judicial.
          </p>
        </li>
      </ol>
    </section>
  );
}
