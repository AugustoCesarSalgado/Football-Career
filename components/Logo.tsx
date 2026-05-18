"use client";

import Image from "next/image";
import { useState } from "react";
import { Crest } from "./Crest";
import { flagIso } from "@/lib/countries";

export function ClubLogo({
  name,
  url,
  size = 48,
  className = "",
}: {
  name: string;
  url: string | null;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(!url);
  if (failed || !url) {
    return <Crest name={name} size={size} className={className} />;
  }
  return (
    <Image
      src={url}
      alt={name}
      width={size}
      height={size}
      className={className}
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}

export function Flag({
  code,
  className = "",
  width = 28,
  height = 20,
}: {
  code: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  const src = `https://flagcdn.com/w160/${flagIso(code)}.png`;
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={`inline-flex items-center justify-center bg-ink-3 border border-line ${className}`}
        style={{ width, height }}
      >
        <span className="text-[10px] font-mono text-bone-3">{code}</span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={code}
      width={width}
      height={height}
      className={className}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
