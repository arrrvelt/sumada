export type Criterion = { id: string; weight: number; max: number };

export function judgeTotal(
  criteria: Criterion[],
  scores: Record<string, number>, //one judge's scores, keyed by criterion id
): number {
  let total = 0;
  for (const c of criteria) {
    const score = scores[c.id] ?? 0;
    total += (score / c.max) * c.weight;
  }
  return total;
}

export function contestantScore(
  criteria: Criterion[],
  sheets: Record<string, number>[], //array of score sheets from judges
): number | null {
  if (sheets.length === 0) {
    return null;
  }
  let total = 0;
  for (const sheet of sheets) {
    total += judgeTotal(criteria, sheet);
  }
  return total / sheets.length;
}
