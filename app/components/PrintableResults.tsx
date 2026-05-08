// Print-only voter guide. Renders nothing on screen (display:none) and only
// becomes visible inside @media print, where it replaces the regular bloated
// card UI with a tight one-line-per-candidate format that fits on 1–2 pages.

import type { Candidate, DistrictMatches, OfficeCategory } from "../lib/types";

const CATEGORY_ORDER: OfficeCategory[] = [
  "Federal",
  "State",
  "County",
  "City",
  "School Board",
  "Special Districts",
  "Judicial",
];

/** Short ALL-CAPS label for the source column. */
function sourceLabel(source: string): string {
  const s = source.toLowerCase();
  if (s.includes("sfgop/cagop") || s.includes("cagop/sfgop"))
    return "SFGOP / CAGOP";
  if (s.includes("sfgop")) return "SFGOP";
  if (s.includes("cagop")) return "CAGOP";
  if (s.includes("reform")) return "Reform CA";
  if (s.includes("howard jarvis") || s.includes("hjta")) return "HJTA";
  if (s.includes("recommend")) return "Recommended";
  if (s.includes("pick")) return source;
  return source || "—";
}

/** Compact one-line summary of the voter's matched districts. */
function summarizeDistricts(d: DistrictMatches): string {
  const parts: string[] = [];
  if (d.congressional) parts.push(`CD ${d.congressional}`);
  if (d.stateSenate) parts.push(`SD ${d.stateSenate}`);
  if (d.assembly) parts.push(`AD ${d.assembly}`);
  if (d.supervisorial) parts.push(`Sup/Council ${d.supervisorial}`);
  if (d.schoolDistrict) parts.push(d.schoolDistrict);
  return parts.join(" · ");
}

interface Props {
  candidates: Candidate[];
  searchedLabel: string;
  districts: DistrictMatches | null;
  mode: "address" | "city-overview";
}

export default function PrintableResults({
  candidates,
  searchedLabel,
  districts,
  mode,
}: Props) {
  const grouped: Partial<Record<OfficeCategory, Candidate[]>> = {};
  for (const c of candidates) {
    (grouped[c.category] ||= []).push(c);
  }

  return (
    <div className="hidden print:block print-guide">
      {/* Header */}
      <div className="print-header">
        <div className="print-title">SFGOP Voter Guide</div>
        <div className="print-subtitle">
          California Primary Election — Tuesday, June 2, 2026
        </div>
        <div className="print-context">
          {mode === "address" ? "Your address: " : "Search: "}
          <strong>{searchedLabel}</strong>
          {districts && (
            <>
              <br />
              Your districts: {summarizeDistricts(districts)}
            </>
          )}
          {mode === "city-overview" && (
            <>
              <br />
              <em>
                Showing all endorsements and recommendations for the city. Some
                races may belong to a district you don&apos;t live in.
              </em>
            </>
          )}
        </div>
      </div>

      {/* Categories */}
      {CATEGORY_ORDER.filter((cat) => grouped[cat]?.length).map((cat) => (
        <section key={cat} className="print-category">
          <h3 className="print-cat-heading">{cat}</h3>
          <ul className="print-list">
            {grouped[cat]!.map((c) => (
              <li key={c.id} className="print-row">
                <span className="print-box" aria-hidden>
                  ☐
                </span>
                <span className="print-name">
                  {c.name}
                  {c.incumbent && <span className="print-star"> ★</span>}
                </span>
                <span className="print-office">
                  {c.office}
                  {c.jurisdiction && c.jurisdiction !== c.office && (
                    <> — {c.jurisdiction}</>
                  )}
                  {c.ballotDesignation && (
                    <span className="print-bd"> · {c.ballotDesignation}</span>
                  )}
                </span>
                <span className="print-source">
                  {sourceLabel(c.endorsementSource)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* Print disclosure */}
      <div className="print-disclosure">
        Paid for by the San Francisco Republican County Central Committee ·
        FPPC #890605 · sfgop.org
      </div>
    </div>
  );
}
