import { describe, it, expect } from "vitest";

// Pure-function tests for decks.ts logic that doesn't depend on the 9.1MB JSON.
// The hotScore function is replicated here since it's not exported.

function hotScore(deck: { tier?: number; rank?: number; dustCost?: number }): number {
  const tier = deck.tier || 3;
  const rank = deck.rank || 100;
  const dust = deck.dustCost || 0;
  const tierScore = Math.max(0, 1 - (tier - 1) / 3);
  const rankScore = Math.max(0, 1 - Math.log10(rank) / 3);
  const dustScore = Math.min(1, dust / 20000);
  return 0.4 * tierScore + 0.3 * rankScore + 0.3 * dustScore;
}

describe("hotScore", () => {
  it("ranks tier 1 decks higher than tier 2", () => {
    const t1 = hotScore({ tier: 1, rank: 1, dustCost: 10000 });
    const t2 = hotScore({ tier: 2, rank: 1, dustCost: 10000 });
    expect(t1).toBeGreaterThan(t2);
  });

  it("ranks decks with better legend rank higher", () => {
    const topRank = hotScore({ tier: 1, rank: 1, dustCost: 10000 });
    const lowRank = hotScore({ tier: 1, rank: 500, dustCost: 10000 });
    expect(topRank).toBeGreaterThan(lowRank);
  });

  it("handles missing optional fields with defaults", () => {
    const score = hotScore({});
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it("gives higher score to more expensive decks", () => {
    const cheap = hotScore({ tier: 2, rank: 10, dustCost: 2000 });
    const expensive = hotScore({ tier: 2, rank: 10, dustCost: 18000 });
    expect(expensive).toBeGreaterThan(cheap);
  });

  it("caps dustScore at 1.0", () => {
    const normal = hotScore({ tier: 1, rank: 1, dustCost: 20000 });
    const extreme = hotScore({ tier: 1, rank: 1, dustCost: 999999 });
    // dustScore component is capped, so the difference should be 0
    // but other components are the same
    expect(extreme - normal).toBeLessThan(0.01);
  });

  it("tier contributes 40%, rank 30%, dust 30% of total", () => {
    // A perfect deck: tier 1, rank 1, dust 20000+
    const perfect = hotScore({ tier: 1, rank: 1, dustCost: 20000 });
    // tierScore=1.0 (0.4), rankScore=~1.0 (0.3), dustScore=1.0 (0.3) = 1.0
    expect(perfect).toBeCloseTo(1.0, 1);
  });
});

describe("getTopDecks sorting logic", () => {
  const mockDecks = [
    { id: "a", tier: 3, name: "C" },
    { id: "b", tier: 1, name: "A" },
    { id: "c", tier: 2, name: "B" },
  ];

  it("sorts by tier ascending", () => {
    const sorted = [...mockDecks].sort((a, b) => (a.tier || 99) - (b.tier || 99));
    expect(sorted[0].id).toBe("b");
    expect(sorted[1].id).toBe("c");
    expect(sorted[2].id).toBe("a");
  });

  it("slices to limit", () => {
    const top2 = [...mockDecks]
      .sort((a, b) => (a.tier || 99) - (b.tier || 99))
      .slice(0, 2);
    expect(top2).toHaveLength(2);
  });

  it("handles decks without tier (defaults to 99)", () => {
    const noTier = { id: "d", name: "D" };
    const sorted = [...mockDecks, noTier].sort((a, b) => (a.tier || 99) - (b.tier || 99));
    expect(sorted[sorted.length - 1].id).toBe("d");
  });
});
