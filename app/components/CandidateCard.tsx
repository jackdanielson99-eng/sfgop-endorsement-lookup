// Single endorsement card. Big, readable, friendly for older voters.

import type { Candidate } from "../lib/types";

interface Props {
  candidate: Candidate;
}

/**
 * Badge text + style derived from the candidate's endorsement source.
 *
 * Language rule: SFGOP and CAGOP picks use "Endorsed by …" (red badge).
 * All other sources use "Recommended by …" so voters never mistake an
 * outside group's pick for a party endorsement.
 */
function badgeFor(source: string): { label: string; classes: string } {
  const s = source.toLowerCase();
  if (s.includes("sfgop")) {
    return {
      label: "Endorsed by SFGOP",
      classes: "bg-gop-red text-white",
    };
  }
  if (s.includes("cagop")) {
    return {
      label: "Endorsed by CAGOP",
      classes: "bg-gop-red text-white",
    };
  }
  if (s.includes("reform")) {
    return {
      label: "Recommended by Reform CA",
      classes: "bg-gray-700 text-white",
    };
  }
  if (s.includes("howard jarvis") || s.includes("hjta")) {
    return {
      label: "Recommended by HJTA",
      classes: "bg-gray-700 text-white",
    };
  }
  if (s.includes("recommend")) {
    return {
      label: "Recommended",
      classes: "bg-amber-500 text-white",
    };
  }
  if (s.includes("pick")) {
    return {
      label: source, // e.g. "Pick 1"
      classes: "bg-gray-600 text-white",
    };
  }
  return { label: source || "Listed", classes: "bg-gray-500 text-white" };
}

export default function CandidateCard({ candidate }: Props) {
  const badge = badgeFor(candidate.endorsementSource);

  return (
    <article className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-navy">
            {candidate.name}
            {candidate.incumbent && (
              <span
                title="Incumbent"
                className="ml-1 align-top text-gop-red"
              >
                ★
              </span>
            )}
          </h3>
          <p className="text-sm sm:text-base text-gray-700">
            {candidate.office}
          </p>
          <p className="text-sm text-gray-500">{candidate.jurisdiction}</p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1 rounded-full text-[11px] font-semibold uppercase tracking-wide px-2 py-1 ${badge.classes}`}
        >
          {badge.label}
        </span>
      </div>

      <p className="text-xs text-gray-600 flex flex-wrap gap-x-2">
        <span className="font-semibold text-navy">{candidate.party}</span>
        {candidate.ballotDesignation && (
          <>
            <span aria-hidden>•</span>
            <span>{candidate.ballotDesignation}</span>
          </>
        )}
      </p>

      {(candidate.website || candidate.volunteer) && (
        <div className="flex flex-wrap gap-2 pt-1">
          {candidate.website && (
            <a
              href={candidate.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-navy text-navy hover:bg-navy hover:text-white px-3 py-2 text-sm font-medium transition-colors"
            >
              Website
            </a>
          )}
          {candidate.volunteer && (
            <a
              href={candidate.volunteer}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 text-gray-800 hover:bg-gray-50 px-3 py-2 text-sm font-medium transition-colors"
            >
              Volunteer
            </a>
          )}
        </div>
      )}
    </article>
  );
}
