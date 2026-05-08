// Site footer with the FPPC disclosure.

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-white/80 mt-10">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs sm:text-sm space-y-1">
        <p className="font-semibold text-white">
          Paid for by the San Francisco Republican County Central Committee
        </p>
        <p>FPPC #890605</p>
        <p className="pt-1 text-white/60">
          &copy; {new Date().getFullYear()} San Francisco Republican County
          Central Committee
        </p>
      </div>
    </footer>
  );
}
