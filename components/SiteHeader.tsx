import Link from "next/link";

export function SiteHeader({
  rightSlot,
}: {
  rightSlot?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-50 bg-ink/80 backdrop-blur-xl border-b border-line/60">
      <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-pitch text-ink">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform">
              <path d="M8 2l1.5 3.5L13 6.5l-2.5 2.5.5 3.5L8 11 5 12.5l.5-3.5L3 6.5l3.5-.5z"/>
            </svg>
          </span>
          <span className="font-display font-bold text-lg tracking-tight text-bone group-hover:text-pitch transition-colors">
            Career<span className="text-pitch">Sim</span>
          </span>
          <span className="hidden sm:inline text-[10px] text-bone-3 font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border border-line bg-ink-3">
            18 → 40
          </span>
        </Link>

        <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-bone-3">
          {rightSlot}
        </div>
      </div>
    </header>
  );
}
