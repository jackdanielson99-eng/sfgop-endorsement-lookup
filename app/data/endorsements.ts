// =============================================================================
// SFGOP ENDORSEMENTS — June 2026 Primary Election
// =============================================================================
// Empty starter array. Add the San Francisco Republican Party's endorsements
// here as the slate is finalized.
//
// CANDIDATE FIELDS:
//   id (string, unique) — anything stable, e.g. "sup-3" or "mayor"
//   name              — candidate's full name
//   office            — title of the office sought
//   jurisdiction      — geographic scope (e.g. "Citywide" or "District 3")
//   category          — Federal | State | County | City | School Board | Special Districts | Judicial
//   party             — "Republican" | "Nonpartisan" | etc.
//   ballotDesignation — optional, e.g. "Small Business Owner"
//   incumbent         — optional, true for incumbents (renders ★)
//   endorsementSource — drives badge color/text:
//                         "SFGOP" / "CAGOP/SFGOP"  → red "Endorsed by SFGOP"
//                         "CAGOP"                  → red "Endorsed by CAGOP"
//                         "Reform CA"              → gray "Recommended by Reform CA"
//                         "HJTA"                   → gray "Recommended by HJTA"
//                         "Recommended"            → amber "Recommended"
//   matchTags         — array of district codes the candidate runs in:
//                         "ca-cd-N"   for U.S. House
//                         "ca-sd-N"   for State Senate
//                         "ca-ad-N"   for State Assembly
//                         "sf-sup-N"  for SF Board of Supervisors / city council
//                         "san-francisco" for any citywide office
//   countywide        — optional, true for races every SF voter sees
//                         (statewide constitutional, judicial, citywide)
//
// EXAMPLE:
//
//   {
//     id: "sup-3",
//     name: "Jane Doe",
//     office: "Member, Board of Supervisors",
//     jurisdiction: "District 3",
//     category: "County",
//     party: "Republican",
//     ballotDesignation: "Small Business Owner",
//     endorsementSource: "SFGOP",
//     matchTags: ["sf-sup-3"],
//   },
//
//   {
//     id: "mayor",
//     name: "John Smith",
//     office: "Mayor",
//     jurisdiction: "City and County of San Francisco",
//     category: "City",
//     party: "Republican",
//     endorsementSource: "SFGOP",
//     matchTags: [],
//     countywide: true,
//   },
// =============================================================================

import type { Candidate } from "../lib/types";

export const endorsements: Candidate[] = [];
