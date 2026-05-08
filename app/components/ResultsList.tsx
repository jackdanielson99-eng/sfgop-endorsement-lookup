// Groups endorsement cards by office category.

import type { Candidate, OfficeCategory } from "../lib/types";
import CandidateCard from "./CandidateCard";

const CATEGORY_ORDER: OfficeCategory[] = [
  "Federal",
  "State",
  "County",
  "City",
  "School Board",
  "Special Districts",
  "Judicial",
];

interface Props {
  candidates: Candidate[];
  searchedLabel: string;
}

export default function ResultsList({ candidates, searchedLabel }: Props) {
  // Group by category, preserving the canonical order above.
  const grouped: Partial<Record<OfficeCategory, Candidate[]>> = {};
  for (const c of candidates) {
    (grouped[c.category] ||= []).push(c);
  }

  return (
    <section aria-labelledby="results-heading">
      <div className="flex items-baseline justify-between gap-3">
        <h2
          id="results-heading"
          className="text-xl sm:text-2xl font-semibold text-navy"
        >
          Endorsements for{" "}
          <span className="text-gop-red">{searchedLabel}</span>
        </h2>
        <span className="text-xs text-gray-500">
          {candidates.length} result{candidates.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Disclaimer above results — not every card is a formal SFGOP
          endorsement; some are recommendations. */}
      <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <p>
          <span className="font-semibold">Note:</span> The red{" "}
          <span className="font-semibold">Endorsed</span> badge marks a
          formal SFGOP endorsement; the amber{" "}
          <span className="font-semibold">Recommended</span> badge marks a
          candidate SFGOP recommends without a formal endorsement. Only
          races with at least one endorsement or recommendation are shown.
          For your full ballot, see your official sample ballot from the{" "}
          <a
            href="https://www.sfelections.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-amber-700 underline-offset-2"
          >
            San Francisco Department of Elections
          </a>
          .
        </p>
      </div>

      <div className="mt-4 space-y-6">
        {CATEGORY_ORDER.filter((cat) => grouped[cat]?.length).map((cat) => (
          <div key={cat}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-2">
              {cat}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {grouped[cat]!.map((c) => (
                <CandidateCard key={c.id} candidate={c} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
