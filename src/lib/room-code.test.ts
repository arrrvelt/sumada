import { generateRoomCode } from "./room-code";

test("default code has 6 characters", () => {
  expect(generateRoomCode()).toHaveLength(6);
});

test("custom length works", () => {
  expect(generateRoomCode(8)).toHaveLength(8);
});

test("only uses allowed characters", () => {
  const code = generateRoomCode(200);
  expect(code).toMatch(/^[A-HJ-NP-Z2-9]+$/);
});