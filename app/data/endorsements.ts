// =============================================================================
// SFGOP ENDORSEMENTS — June 2026 Primary Election
// =============================================================================
// Sourced from the San Francisco Republican County Central Committee's
// official endorsement & recommendation list. Default = endorsed by SFGOP
// (red badge); items explicitly marked "(recommended, not endorsed)" use
// the amber Recommended badge.
//
// Two named exports below:
//   - `endorsements`  — array of Candidate
//   - `ballotMeasures` — array of BallotMeasure (props / charter / ordinance)
// =============================================================================

import type { BallotMeasure, Candidate } from "../lib/types";

export const endorsements: Candidate[] = [
  // ---------------------------------------------------------------------------
  // FEDERAL — U.S. House
  // ---------------------------------------------------------------------------
  {
    id: "cd-11",
    name: "Marie Hurabiell",
    office: "U.S. Representative",
    jurisdiction: "Congressional District 11",
    category: "Federal",
    party: "Republican",
    endorsementSource: "Recommended",
    matchTags: ["ca-cd-11"],
  },
  {
    id: "cd-15",
    name: "Charles Hoelter",
    office: "U.S. Representative",
    jurisdiction: "Congressional District 15",
    category: "Federal",
    party: "Republican",
    endorsementSource: "SFGOP",
    matchTags: ["ca-cd-15"],
  },

  // ---------------------------------------------------------------------------
  // STATE — Statewide constitutional offices
  // ---------------------------------------------------------------------------
  {
    id: "ltgov",
    name: "Gloria Romero",
    office: "Lieutenant Governor",
    jurisdiction: "California",
    category: "State",
    party: "Republican",
    endorsementSource: "SFGOP",
    matchTags: [],
    countywide: true,
  },
  {
    id: "ag",
    name: "Michael E. Gates",
    office: "Attorney General",
    jurisdiction: "California",
    category: "State",
    party: "Republican",
    endorsementSource: "SFGOP",
    matchTags: [],
    countywide: true,
  },
  {
    id: "sos",
    name: "Donald P. (Don) Wagner",
    office: "Secretary of State",
    jurisdiction: "California",
    category: "State",
    party: "Republican",
    endorsementSource: "SFGOP",
    matchTags: [],
    countywide: true,
  },
  {
    id: "controller",
    name: "Herb W. Morgan",
    office: "Controller",
    jurisdiction: "California",
    category: "State",
    party: "Republican",
    endorsementSource: "SFGOP",
    matchTags: [],
    countywide: true,
  },
  {
    id: "supt",
    name: "Sonja Shaw",
    office: "Superintendent of Public Instruction",
    jurisdiction: "California (Nonpartisan)",
    category: "State",
    party: "Nonpartisan",
    endorsementSource: "SFGOP",
    matchTags: [],
    countywide: true,
  },
  {
    id: "boe-2",
    name: "Bill Shireman",
    office: "Member, State Board of Equalization",
    jurisdiction: "Board of Equalization, 2nd District",
    category: "State",
    party: "Republican",
    endorsementSource: "SFGOP",
    matchTags: [],
    countywide: true,
  },

  // ---------------------------------------------------------------------------
  // STATE — California State Assembly
  // ---------------------------------------------------------------------------
  {
    id: "ad-17",
    name: "Manuel Noris-Barrera",
    office: "State Assembly Member",
    jurisdiction: "Assembly District 17",
    category: "State",
    party: "Republican",
    ballotDesignation: "Write-in candidate",
    endorsementSource: "SFGOP",
    matchTags: ["ca-ad-17"],
  },
  {
    id: "ad-19",
    name: "Phillip Wing",
    office: "State Assembly Member",
    jurisdiction: "Assembly District 19",
    category: "State",
    party: "Republican",
    endorsementSource: "SFGOP",
    matchTags: ["ca-ad-19"],
  },

  // ---------------------------------------------------------------------------
  // COUNTY — San Francisco Board of Supervisors (also serves as City Council)
  // SFGOP made no formal endorsement in District 4; Albert Chow is recommended.
  // ---------------------------------------------------------------------------
  {
    id: "sup-4-chow",
    name: "Albert Chow",
    office: "Member, Board of Supervisors",
    jurisdiction: "Supervisor District 4",
    category: "County",
    party: "Nonpartisan",
    endorsementSource: "Recommended",
    matchTags: ["sf-sup-4"],
  },

  // ---------------------------------------------------------------------------
  // SCHOOL BOARD — SFUSD
  // ---------------------------------------------------------------------------
  {
    id: "sfusd-1",
    name: "Phillip Kim",
    office: "Member, Board of Education",
    jurisdiction: "San Francisco Unified School District",
    category: "School Board",
    party: "Nonpartisan",
    endorsementSource: "SFGOP",
    matchTags: [],
    countywide: true,
  },

  // ---------------------------------------------------------------------------
  // JUDICIAL — Superior Court
  // ---------------------------------------------------------------------------
  {
    id: "sc-16",
    name: "Phoebe Maffei",
    office: "Superior Court Judge — Seat 16",
    jurisdiction: "San Francisco County",
    category: "Judicial",
    party: "Nonpartisan",
    endorsementSource: "SFGOP",
    matchTags: [],
    countywide: true,
  },
];

// =============================================================================
// BALLOT MEASURES — June 2026 Primary
// =============================================================================
export const ballotMeasures: BallotMeasure[] = [
  {
    id: "measure-a",
    letter: "A",
    type: "Bond Measure",
    title: "Earthquake Safety and Emergency Response Bond",
    position: "No",
  },
  {
    id: "measure-b",
    letter: "B",
    type: "Charter Amendment",
    title:
      "Lifetime Term Limits for Mayor and Members of the Board of Supervisors",
    position: "Yes",
  },
  {
    id: "measure-c",
    letter: "C",
    type: "Ordinance",
    title: "Decrease to Business Taxes",
    position: "Yes",
  },
  {
    id: "measure-d",
    letter: "D",
    type: "Ordinance",
    title:
      "Increase to Business Tax Based on Comparison of Top Executive's Pay to Employee's Pay",
    position: "No",
  },
];
