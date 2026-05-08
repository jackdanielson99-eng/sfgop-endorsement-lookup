// Shared types used across the app.
// Keep this file as the single source of truth for the shape of endorsement
// data so swapping in real data later is straightforward.

export type OfficeCategory =
  | "Federal"
  | "State"
  | "County"
  | "City"
  | "School Board"
  | "Special Districts"
  | "Judicial";

export interface Candidate {
  id: string;
  name: string;
  /** Title of the office sought, e.g. "Member, Board of Supervisors". */
  office: string;
  /** Geographic scope of the office, e.g. "District 1" or "Citywide". */
  jurisdiction: string;
  category: OfficeCategory;
  /** Party label shown on the card, e.g. "Republican" or "Nonpartisan". */
  party: string;
  /** Ballot designation from the candidate's filing (e.g. "Small Business Owner"). */
  ballotDesignation?: string;
  /**
   * Endorsement-source label as it appears in the source document.
   * Drives the badge text/color on the candidate card. Examples:
   *   "SFGOP" / "CAGOP/SFGOP"   → red "Endorsed by SFGOP" badge
   *   "CAGOP"                   → red "Endorsed by CAGOP" badge
   *   "Reform CA"               → neutral "Recommended by Reform CA" badge
   *   "Recommended"             → amber "Recommended" badge
   *   "HJTA"                    → neutral "Recommended by HJTA" badge
   */
  endorsementSource: string;
  /** Whether the candidate is the incumbent (drawn as a small "★" suffix). */
  incumbent?: boolean;
  /** Optional candidate links. */
  website?: string;
  volunteer?: string;
  /**
   * Tags used to match a voter's geocoded location to candidates. The
   * point-in-polygon lookup derives tags like "ca-cd-11", "ca-sd-11",
   * "ca-ad-17", "sf-sup-3", "san-francisco" — see app/lib/districts.ts.
   * You can also include raw ZIPs or slugs here as fallbacks.
   */
  matchTags: string[];
  /**
   * Optional: when true, this candidate is shown to every San Francisco
   * voter regardless of district (e.g. citywide Mayor, DA, Sheriff races,
   * statewide constitutional offices, judicial).
   */
  countywide?: boolean;
}

/** Toggleable map layer types — backed by GeoJSON files in /public/data. */
export type MapLayerKey =
  | "congressional"
  | "stateSenate"
  | "assembly"
  | "supervisorial"
  | "city"
  | "schoolDistrict";

export interface MapLayerDef {
  key: MapLayerKey;
  label: string;
  geojsonPath: string;
  available: boolean;
}

/** A ballot measure (proposition / charter amendment / ordinance) on the
 *  primary ballot, with the party's position on it. Distinct from candidates. */
export interface BallotMeasure {
  id: string;
  /** Single letter / number identifier on the ballot, e.g. "A", "B", "1". */
  letter: string;
  /** Measure type, e.g. "Bond Measure", "Charter Amendment", "Ordinance". */
  type: string;
  /** Short, voter-facing description of what the measure does. */
  title: string;
  /** Party / committee position on the measure. */
  position: "Yes" | "No";
  /** Optional supporting note (one or two sentences). */
  rationale?: string;
}

/** The set of districts a single point falls inside, after point-in-polygon. */
export interface DistrictMatches {
  congressional: string | null;   // e.g. "11"
  stateSenate: string | null;     // e.g. "11"
  assembly: string | null;        // e.g. "17"
  /**
   * SF Board of Supervisors district (1–11). Doubles as the city-council
   * district since SF is a consolidated city-county.
   */
  supervisorial: string | null;
  city: string | null;            // "San Francisco"
  schoolDistrict: string | null;  // e.g. "SAN FRANCISCO USD"
}
