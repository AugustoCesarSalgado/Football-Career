import { clubColors, clubInitials } from "@/lib/logos";

export function Crest({
  name,
  size = 64,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const colors = clubColors(name);
  const initials = clubInitials(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-label={name}
    >
      <defs>
        <linearGradient id={`g-${initials}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.secondary} />
          <stop offset="100%" stopColor={colors.primary} />
        </linearGradient>
      </defs>
      <path
        d="M32 2 L60 12 L58 38 C58 50 32 62 32 62 C32 62 6 50 6 38 L4 12 Z"
        fill={`url(#g-${initials})`}
        stroke="rgba(0,0,0,0.45)"
        strokeWidth="1.5"
      />
      <path
        d="M32 6 L56 14 L54 36 C54 46 32 56 32 56 C32 56 10 46 10 36 L8 14 Z"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="0.8"
      />
      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        fontFamily="var(--font-display), Impact, sans-serif"
        fontSize="20"
        fill="white"
        stroke="rgba(0,0,0,0.5)"
        strokeWidth="0.6"
      >
        {initials}
      </text>
    </svg>
  );
}
