export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden bg-pitch/10 border-y border-pitch/20">
      <div className="anim-ticker flex w-max gap-8 px-4 py-2.5 whitespace-nowrap">
        {doubled.map((it, i) => (
          <span
            key={i}
            className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-pitch/70 font-mono"
          >
            <span className="w-1 h-1 rounded-full bg-pitch/50 shrink-0" />
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
