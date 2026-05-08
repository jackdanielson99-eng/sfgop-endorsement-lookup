// Ballot measures section. Distinct from the candidate list because measures
// are vote-yes/vote-no questions, not candidates. Always shown to any voter
// who has run a search (measures are countywide).

import type { BallotMeasure } from "../lib/types";

interface Props {
  measures: BallotMeasure[];
}

export default function BallotMeasures({ measures }: Props) {
  if (!measures.length) return null;

  return (
    <section aria-labelledby="measures-heading" className="mt-2">
      <h2
        id="measures-heading"
        className="text-xl sm:text-2xl font-semibold text-navy"
      >
        Ballot Measures
      </h2>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        {measures.map((m) => {
          const yes = m.position === "Yes";
          return (
            <article
              key={m.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-navy">
                    Measure {m.letter}
                  </h3>
                  <p className="text-sm text-gray-500">{m.type}</p>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center gap-1 rounded-full text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 ${
                    yes ? "bg-green-700 text-white" : "bg-gop-red text-white"
                  }`}
                >
                  Vote {m.position}
                </span>
              </div>

              <p className="text-sm sm:text-base text-gray-700">{m.title}</p>

              {m.rationale && (
                <p className="text-xs text-gray-500">{m.rationale}</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
