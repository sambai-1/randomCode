// gaming.utils.test.ts
// learn what vite is
// learn what jest is

/*
import { describe, it, expect } from "vitest";
import { resetGameUtil } from "./gaming.utils";

const R = (overrides: Partial<Row> = {} as any) => ({
  name: "P",
  position: "",
  hasAction: false,
  stillPlaying: true,
  chips: 100,
  preFlop: 0,
  flop: 0,
  turn: 0,
  river: 0,
  actions: [1, 2, 3, 4],
  message: "",
  ...overrides,
});

// If you're on JS, remove this interface and the types above.
interface Row {
  name: string;
  position: "" | "SB" | "BB";
  hasAction: boolean;
  stillPlaying: boolean;
  chips: number;
  preFlop: number;
  flop: number;
  turn: number;
  river: number;
  actions: number[];
  message: string;
}

describe("resetGameUtil (Vitest)", () => {
  it("normal rotation: winner gets pot, SB/BB posted, next to act set", () => {
    const prevRows = [
      R({ name: "A", chips: 200 }),
      R({ name: "B", chips: 150 }),
      R({ name: "C", chips: 80 }),
      R({ name: "D", chips: 300 }),
    ];

    const res = resetGameUtil(prevRows, {
      winnerIdx: 1, // B wins previous pot
      pot: 60,
      SB: 0,
      BB: 1,
      bigBlind: 20,
      smallBlind: 10,
    });

    const { rows, pot, SB, BB, hasAction } = res;

    // blinds only for new hand
    expect(pot).toBe(30); // 10 + 20

    // winner received old pot before blinds posting
    expect(rows[1].chips).toBe(150 + 60 - rows[1].preFlop);

    // rotation 0->1 (SB), 1->2 (BB)
    expect(SB).toBe(1);
    expect(BB).toBe(2);

    expect(rows[SB].position).toBe("SB");
    expect(rows[SB].preFlop).toBe(10);
    expect(rows[BB].position).toBe("BB");
    expect(rows[BB].preFlop).toBe(20);

    // first to act after BB
    expect(hasAction).toBe(3);
  });

  it("skips busted SB candidate (< bigBlind)", () => {
    const prevRows = [
      R({ name: "A", chips: 200 }),
      R({ name: "B", chips: 10 }),  // busted for >= bigBlind 20
      R({ name: "C", chips: 100 }),
      R({ name: "D", chips: 100 }),
    ];

    const { rows, SB, BB } = resetGameUtil(prevRows, {
      winnerIdx: 0,
      pot: 0,
      SB: 0, // candidate is 1 (B) → should be skipped
      BB: 1,
      bigBlind: 20,
      smallBlind: 10,
    });

    expect(rows[1].stillPlaying).toBe(false);
    expect(SB).toBe(2);
    expect(BB).toBe(3);
    expect(rows[2].position).toBe("SB");
    expect(rows[3].position).toBe("BB");
  });

  it("only one eligible player left", () => {
    const prevRows = [
      R({ name: "A", chips: 5 }),
      R({ name: "B", chips: 200 }),
      R({ name: "C", chips: 0 }),
    ];

    const { rows, pot, SB, BB, hasAction } = resetGameUtil(prevRows, {
      winnerIdx: 1,
      pot: 100,
      SB: 0,
      BB: 1,
      bigBlind: 20,
      smallBlind: 10,
    });

    expect(SB).toBe(1);
    expect(BB).toBe(1);
    expect(hasAction).toBe(1);
    expect(pot).toBe(0);
    expect(rows[1].position).toBe("SB");
    expect(rows[0].stillPlaying).toBe(false);
    expect(rows[2].stillPlaying).toBe(false);
  });

  it("nobody eligible", () => {
    const prevRows = [
      R({ name: "A", chips: 0 }),
      R({ name: "B", chips: 10 }),
    ];

    const { rows, pot, SB, BB, hasAction } = resetGameUtil(prevRows, {
      winnerIdx: -1,
      pot: 50,
      SB: 0,
      BB: 1,
      bigBlind: 20,
      smallBlind: 10,
    });

    expect(rows.every((r) => r.stillPlaying === false)).toBe(true);
    expect(pot).toBe(0);
    expect(SB).toBe(0);
    expect(BB).toBe(1);
    expect(hasAction).toBe(0);
  });

  it("does not mutate input array (purity)", () => {
    const prevRows = [R({ name: "A", chips: 100 }), R({ name: "B", chips: 100 })];
    const snapshot = structuredClone ? structuredClone(prevRows) : JSON.parse(JSON.stringify(prevRows));

    const res = resetGameUtil(prevRows, {
      winnerIdx: 0,
      pot: 40,
      SB: 0,
      BB: 1,
      bigBlind: 20,
      smallBlind: 10,
    });

    expect(prevRows).toEqual(snapshot);
    expect(res.rows).not.toBe(prevRows);
  });
});

*/