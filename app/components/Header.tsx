// Top branding strip. Conservative, patriotic, not flashy.

export default function Header() {
  return (
    <header className="bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:py-6">
        <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <div
              aria-hidden
              className="h-9 w-9 rounded-sm bg-gop-red flex items-center justify-center font-bold tracking-tight shrink-0"
            >
              SF
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-[11px] sm:text-xs uppercase tracking-widest text-white/70 truncate">
                San Francisco Republican Party
              </p>
              <h1 className="text-lg sm:text-2xl font-semibold truncate">
                SFGOP Endorsement Lookup
              </h1>
            </div>
          </div>

          {/* External link to the main SFGOP website. Subtle bordered pill so
              it reads as a link without competing with the title. */}
          <a
            href="https://www.sfgop.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-white/30 bg-white/5 hover:bg-white/15 active:bg-white/20 px-3 py-1.5 text-xs sm:text-sm font-medium text-white transition-colors print:hidden"
          >
            <span className="hidden sm:inline">Visit&nbsp;</span>SFGOP.org
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
          </a>
        </div>

        <p className="mt-3 text-sm sm:text-base text-white/85 max-w-2xl">
          Find Republican-endorsed candidates in your area.
        </p>
      </div>
      <div className="h-1 bg-gop-red" aria-hidden />
    </header>
  );
}
