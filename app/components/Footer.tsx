// Site footer with the FEC / FPPC / FEIN disclosure.
// TODO: replace [TBD] placeholders with the San Francisco Republican Party's
// actual registration numbers before public launch.

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-white/80 mt-10">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs sm:text-sm space-y-1">
        <p className="font-semibold text-white">
          Paid for by the San Francisco Republican Party
        </p>
        <p>
          FEC # [TBD] &bull; FPPC ID [TBD] &bull; FEIN [TBD]
        </p>
        <p className="pt-1 text-white/60">
          &copy; {new Date().getFullYear()} San Francisco Republican Party
        </p>
      </div>
    </footer>
  );
}
