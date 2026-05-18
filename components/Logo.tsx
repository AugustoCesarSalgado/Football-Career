import React, { useState } from "react";
import Image from "next/image";
import { Crest } from "./Crest";
import { flagIso } from "@/lib/countries";

interface LogoProps {
  /** Tamaño del logo, usando clases de Tailwind (ej. 'w-10 h-10') */
  className?: string;
  /** Si debe mostrarse o no el texto al lado del escudo */
  showText?: boolean;
}

export function Logo({ className = "w-10 h-10", showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Icono del Escudo */}
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} drop-shadow-lg`}
      >
        <defs>
          {/* Gradiente Verde Césped */}
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" /> {/* emerald-500 */}
            <stop offset="100%" stopColor="#047857" /> {/* emerald-700 */}
          </linearGradient>
          {/* Gradiente Dorado Premium */}
          <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" /> {/* amber-400 */}
            <stop offset="100%" stopColor="#b45309" /> {/* amber-700 */}
          </linearGradient>
        </defs>

        {/* Fondo y borde del Escudo */}
        <path
          d="M50 5 L90 20 L90 55 C90 80 50 95 50 95 C50 95 10 80 10 55 L10 20 Z"
          fill="#0f172a" /* slate-900 */
          stroke="url(#shieldGrad)"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Flecha de Trayectoria ascendente */}
        <path
          d="M30 65 L45 45 L55 55 L70 30"
          fill="none"
          stroke="url(#shieldGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Estrella de Éxito / Logros */}
        <path
          d="M75 15 L78 22 L85 23 L80 28 L81 35 L75 32 L69 35 L70 28 L65 23 L72 22 Z"
          fill="url(#starGrad)"
        />
      </svg>

      {/* Tipografía del Logo */}
      {showText && (
        <span className="font-black text-2xl tracking-tighter text-white uppercase font-display">
          Career<span className="text-emerald-500">Sim</span>
        </span>
      )}
    </div>
  );
}

export function ClubLogo({
  name,
  url,
  size = 64,
  className = "",
}: {
  name: string;
  url?: string | null;
  size?: number;
  className?: string;
}) {
  const [error, setError] = useState(false);

  if (!url || error) {
    return <Crest name={name} size={size} className={className} />;
  }

  return (
    <Image
      src={url}
      alt={name}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      onError={() => setError(true)}
      unoptimized
    />
  );
}

export function Flag({
  code,
  width = 24,
  height = 16,
  className = "",
}: {
  code: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  if (!code) return null;
  const src = `https://flagcdn.com/w40/${flagIso(code)}.png`;

  return (
    <Image
      src={src}
      alt={code}
      width={width}
      height={height}
      className={`object-cover block border border-white/10 shrink-0 ${className}`}
      unoptimized
    />
  );
}