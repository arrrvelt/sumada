import { Criterion, judgeTotal } from "./weighted";

const criteria: Criterion[] = [
  { id: "talent", weight: 50, max: 10 },
  { id: "poise", weight: 30, max: 10 },
  { id: "qa", weight: 20, max: 5 },
];

test("weighted total for one judge", () => {
  expect(judgeTotal(criteria, { talent: 8, poise: 9, qa: 4 })).toBeCloseTo(
    83.0,
  );
});

const localCriteria: Criterion[] = [
  { id: "production", weight: 30, max: 30 },
  { id: "talent", weight: 30, max: 30 },
  { id: "qa", weight: 30, max: 30 },
  { id: "audienceImpact", weight: 10, max: 10 },
];

test("when max equals weight, the total is a plain sum", () => {
  expect(
    judgeTotal(localCriteria, {
      production: 20,
      talent: 25,
      qa: 30,
      audienceImpact: 10,
    }),
  ).toBeCloseTo(85);
});
