import Link from "next/link";

export function SiteHeader({
  rightSlot,
}: {
  rightSlot?: React.ReactNode;
}) {
  return (
    <header className="border-b border-line bg-ink-2/60 backdrop-blur-sm">
      <div className="max-w-[1500px] mx-auto px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="inline-block size-3 rotate-45 bg-pitch anim-flicker" />
          <span className="font-display text-2xl tracking-[0.05em] leading-none group-hover:text-pitch transition-colors">
            CAREER<span className="text-bone-3">·</span>SIM
          </span>
          <span className="text-[10px] uppercase tracking-[0.35em] text-bone-3 font-mono">
            18 → 40
          </span>
        </Link>
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-bone-3 font-mono">
          {rightSlot}
        </div>
      </div>
    </header>
  );
}
