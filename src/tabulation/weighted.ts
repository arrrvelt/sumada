export type Criterion = { id: string; weight: number; max: number };
export type Contestant = { id: string; sheets: Record<string, number>[] }; //array of score sheets from judges
export type Ranked = { id: string; score: number; rank: number };

// Total score for one judge, based on the criteria and their weights
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

// Average score for a contestant across all judges, based on the criteria and their weights
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

// Rank contestants based on their average scores, from highest to lowest, skipping unscored contestants
export function rankContestants(
  criteria: Criterion[],
  contestants: Contestant[],
): Ranked[] {
  const ranked: Ranked[] = [];

  for (const c of contestants) {
    const score = contestantScore(criteria, c.sheets);
    if (score !== null) {
      ranked.push({ id: c.id, score: score, rank: 0 });
    }
  }

  ranked.sort((a, b) => b.score - a.score);

  for (let i = 0; i < ranked.length; i++) {
    ranked[i].rank = i + 1;
  }

  return ranked;
}
