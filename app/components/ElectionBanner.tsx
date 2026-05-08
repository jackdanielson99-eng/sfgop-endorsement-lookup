"use client";

// Polished red strip just below the header. Three sections:
//   1. Date block (calendar icon + "Election Day" label + date)
//   2. Big-number countdown
//   3. Two quick-action links: polling place + sample ballot
// On mobile the three sections wrap onto multiple rows.

import { useEffect, useState } from "react";

const ELECTION_DATE = new Date("2026-06-02T00:00:00-07:00"); // PDT
const ELECTION_LABEL = "Tuesday, June 2, 2026";
const ELECTION_TYPE = "California Primary";

function daysUntil(target: Date): number {
  const ms = target.getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

const CalendarIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    className="h-7 w-7 sm:h-8 sm:w-8 text-white/95 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
    <path d="M3.5 10h17" />
    <path d="M8 3v4M16 3v4" />
    <circle cx="8.5" cy="14" r="0.6" fill="currentColor" />
    <circle cx="12" cy="14" r="0.6" fill="currentColor" />
    <circle cx="15.5" cy="14" r="0.6" fill="currentColor" />
    <circle cx="8.5" cy="17" r="0.6" fill="currentColor" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" />
  </svg>
);

const ExternalIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 16 16"
    className="h-3 w-3 opacity-80"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 3.5h6.5V10" />
    <path d="M12.5 3.5L6 10" />
    <path d="M11 9.5v3h-8v-8h3" />
  </svg>
);

export default function ElectionBanner() {
  // Hydration-safe: defer the countdown to after mount so SSR + client agree.
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    setDays(daysUntil(ELECTION_DATE));
  }, []);

  let countdown: { big: string; small: string } | null = null;
  if (days !== null) {
    if (days > 1) countdown = { big: String(days), small: "Days to vote" };
    else if (days === 1) countdown = { big: "1", small: "Day to vote" };
    else if (days === 0) countdown = { big: "Today", small: "Vote today" };
    else countdown = { big: "—", small: `${ELECTION_TYPE} ended` };
  }

  return (
    <div className="bg-gop-red text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        {/* Date block */}
        <div className="flex items-center gap-3">
          <CalendarIcon />
          <div className="leading-tight">
            <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-white/80">
              Election Day
            </div>
            <div className="text-sm sm:text-base font-semibold">
              {ELECTION_LABEL}
            </div>
          </div>
        </div>

        {/* Countdown */}
        {countdown && (
          <div className="flex items-baseline gap-2 leading-none">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums">
              {countdown.big}
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-white/85">
              {countdown.small}
            </span>
          </div>
        )}

        {/* Action links */}
        <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-xs sm:text-sm font-medium">
          <a
            href="https://sfelections.org/tools/pollsite/index.php"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/25 transition-colors print:hidden"
          >
            Find your polling place
            <ExternalIcon />
          </a>
          <a
            href="https://www.sfelections.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/25 transition-colors print:hidden"
          >
            Sample ballot
            <ExternalIcon />
          </a>
        </div>
      </div>
    </div>
  );
}
