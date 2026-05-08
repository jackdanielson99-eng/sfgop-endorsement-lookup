"use client";

import { useCallback, useEffect, useState } from "react";

import Header from "./components/Header";
import ElectionBanner from "./components/ElectionBanner";
import IntroCard from "./components/IntroCard";
import SearchBar from "./components/SearchBar";
import MapSection from "./components/MapSection";
import Legend from "./components/Legend";
import YourDistrictsPanel from "./components/YourDistrictsPanel";
import CityOverviewNote from "./components/CityOverviewNote";
import ResultsList from "./components/ResultsList";
import NoResults from "./components/NoResults";
import BallotMeasures from "./components/BallotMeasures";
import PrintableResults from "./components/PrintableResults";
import Footer from "./components/Footer";

import { endorsements, ballotMeasures } from "./data/endorsements";
import { runSearch, type SearchResult } from "./lib/search";
import {
  loadAllDistrictLayers,
  loadZipLookup,
  type LayerData,
  type ZipLookup,
} from "./lib/districts";

export default function HomePage() {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const [layers, setLayers] = useState<LayerData>({});
  const [zipLookup, setZipLookup] = useState<ZipLookup>({});
  const layersReady = Object.keys(layers).length > 0;

  useEffect(() => {
    loadAllDistrictLayers().then(setLayers);
    loadZipLookup().then(setZipLookup);
  }, []);

  // Sync the URL ?q= param with the current search so results are shareable
  // and survive a refresh.
  const handleSearch = useCallback(
    async (input: string, opts?: { skipUrlUpdate?: boolean }) => {
      const trimmed = input.trim();
      if (!trimmed) {
        setResult(null);
        if (!opts?.skipUrlUpdate && typeof window !== "undefined") {
          window.history.replaceState(null, "", window.location.pathname);
        }
        return;
      }
      setLoading(true);
      try {
        const r = await runSearch(trimmed, endorsements, layers, zipLookup);
        setResult(r);
        if (!opts?.skipUrlUpdate && typeof window !== "undefined") {
          const params = new URLSearchParams();
          params.set("q", trimmed);
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}?${params.toString()}`
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [layers, zipLookup]
  );

  // Auto-run a search if the page was loaded with ?q=… (e.g. shared link).
  // Wait until layers are loaded so the matching is correct.
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setPendingQuery(q);
  }, []);
  useEffect(() => {
    if (pendingQuery && layersReady) {
      handleSearch(pendingQuery, { skipUrlUpdate: true });
      setPendingQuery(null);
    }
  }, [pendingQuery, layersReady, handleSearch]);

  return (
    <>
      <Header />
      <ElectionBanner />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 space-y-6">
          <div className="print:hidden">
            <IntroCard />
          </div>

          <div className="print:hidden">
            <SearchBar
              onSearch={handleSearch}
              initialValue={result?.query ?? ""}
              loading={loading}
            />
          </div>

          <div className="print:hidden">
            <MapSection pin={result?.pin ?? null} />
          </div>

          <div className="print:hidden">
            <Legend />
          </div>

          {result && !loading && result.mode === "address" && result.districts && (
            <div className="print:hidden">
              <YourDistrictsPanel
                districts={result.districts}
                addressLabel={result.label}
              />
            </div>
          )}

          {result && !loading && result.mode === "city-overview" && result.pin?.city && (
            <div className="print:hidden">
              <CityOverviewNote cityName={result.pin.city} />
            </div>
          )}

          {result && !loading && result.candidates.length > 0 && (
            <div className="flex justify-end print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-md border border-navy/30 bg-white hover:bg-navy hover:text-white px-3 py-1.5 text-xs sm:text-sm font-medium text-navy transition-colors"
                title="Print this voter guide"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 5V2h8v3" />
                  <rect x="2.5" y="5" width="11" height="6.5" rx="1" />
                  <path d="M4 11.5v3h8v-3" />
                  <circle cx="11.5" cy="7" r="0.5" fill="currentColor" />
                </svg>
                Print voter guide
              </button>
            </div>
          )}

          {result && !loading && (
            <div className="print:hidden">
              {result.candidates.length > 0 ? (
                <ResultsList
                  candidates={result.candidates}
                  searchedLabel={result.label}
                />
              ) : (
                <NoResults searchedLabel={result.label} />
              )}
            </div>
          )}

          {/* Ballot measures: countywide. Always shown after a search runs
              (since every SF voter sees the same measures), even when no
              candidates matched. */}
          {result && !loading && ballotMeasures.length > 0 && (
            <div className="print:hidden">
              <BallotMeasures measures={ballotMeasures} />
            </div>
          )}

          {/* Print-only voter guide. Hidden on screen, shown on print
              with its own compact one-line-per-candidate layout. Includes
              ballot measures alongside the candidates. */}
          {result && !loading && (result.candidates.length > 0 || ballotMeasures.length > 0) && (
            <PrintableResults
              candidates={result.candidates}
              measures={ballotMeasures}
              searchedLabel={result.label}
              districts={result.districts}
              mode={result.mode}
            />
          )}

          {!result && !loading && (
            <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 text-sm text-gray-700 print:hidden">
              <p>
                Enter an address, ZIP code, city, or district above to find
                endorsed and recommended candidates for your area.
              </p>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
