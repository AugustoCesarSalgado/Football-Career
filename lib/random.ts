export function rnd(): number {
  return Math.random();
}

export function rndInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function rndRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function chance(p: number): boolean {
  return Math.random() < p;
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickWeighted<T>(items: Array<{ item: T; weight: number }>): T {
  const total = items.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const it of items) {
    r -= it.weight;
    if (r <= 0) return it.item;
  }
  return items[items.length - 1].item;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function id(): string {
  return Math.random().toString(36).slice(2, 10);
}
