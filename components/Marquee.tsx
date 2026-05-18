export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-line bg-ink-2">
      <div className="anim-ticker flex w-max gap-10 px-4 py-2 whitespace-nowrap">
        {doubled.map((it, i) => (
          <span
            key={i}
            className="text-[10px] uppercase tracking-[0.35em] text-bone-3 font-mono"
          >
            <span className="text-pitch mr-3">●</span>
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
