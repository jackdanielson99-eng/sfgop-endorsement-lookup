"use client";

import { useState, FormEvent, useEffect } from "react";

interface Props {
  onSearch: (input: string) => void;
  initialValue?: string;
  loading?: boolean;
}

export default function SearchBar({
  onSearch,
  initialValue = "",
  loading = false,
}: Props) {
  const [value, setValue] = useState(initialValue);

  // Keep the field in sync if the parent updates the initial value
  // (e.g. after a successful geocode resets the displayed query).
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  function submit(e: FormEvent) {
    e.preventDefault();
    onSearch(value);
  }

  return (
    <section className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
      <p className="text-sm sm:text-base text-gray-700 mb-3">
        Enter your address or ZIP code to view endorsed and recommended
        candidates for your area in the June 2026 primary.
      </p>
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="lookup" className="sr-only">
          Address, ZIP code, city, or district
        </label>
        <input
          id="lookup"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Address, ZIP code, city, or district"
          autoComplete="off"
          disabled={loading}
          className="flex-1 rounded-md border border-gray-300 px-4 py-3 text-base text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy disabled:bg-gray-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-gop-red hover:bg-gop-redDark active:bg-gop-redDark disabled:bg-gop-red/60 disabled:cursor-wait text-white font-semibold px-5 py-3 text-base transition-colors"
        >
          {loading ? "Searching…" : "Find My Endorsements"}
        </button>
      </form>
      <p className="mt-3 text-xs text-gray-500">
        Try a real address (e.g. <span className="font-medium">1 Dr Carlton B Goodlett Pl, San Francisco, CA</span>),
        a ZIP (<span className="font-medium">94102</span>), or a city
        (<span className="font-medium">San Francisco</span>).
      </p>
    </section>
  );
}
