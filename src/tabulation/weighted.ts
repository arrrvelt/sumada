export type Criterion = { id: string; weight: number; max: number };

export function judgeTotal(
  criteria: Criterion[],
  scores: Record<string, number>,
): number {
  let total = 0;
  for (const c of criteria) {
    const score = scores[c.id] ?? 0;
    total += score / c.max * c.weight;
  }
  return total;
}
