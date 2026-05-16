import { Deck } from "@/types";
import rawData from "./generated/decks.json";
import metaRaw from "./generated/meta-overlay.json";
import topdecksRaw from "./generated/topdecks-overlay.json";

interface ArchetypeMeta {
  winRate?: number;
  gamesPlayed?: number;
  tier?: number;
  lastUpdated?: string;
  source?: string;
}

interface TopDecksMeta {
  tier?: number;
  tierName?: string;
  cardClass?: string;
  archetypeName?: string;
  deckCode?: string;
  dustCost?: number;
  sourceUrl?: string;
  rank?: number;
  player?: string;
}

interface MetaOverlay {
  lastFetch: string;
  source: string;
  fetchSuccess: boolean;
  archetypes: Record<string, ArchetypeMeta>;
}

interface TopDecksOverlay {
  lastFetch: string;
  source: string;
  fetchSuccess: boolean;
  tierListCount: number;
  featuredDeckCount: number;
  deckCodeCount: number;
  archetypes: Record<string, TopDecksMeta>;
}

const meta = metaRaw as MetaOverlay;
const topdecks = topdecksRaw as unknown as TopDecksOverlay;

// Merge base deck data with meta overlay + topdecks overlay
export const DECKS: Deck[] = (rawData as Deck[]).map((deck) => {
  const m = meta.archetypes[deck.id];
  const td = topdecks.archetypes[deck.id];
  let merged = { ...deck };

  if (m) {
    merged = {
      ...merged,
      winRate: m.winRate ?? merged.winRate,
      gamesPlayed: m.gamesPlayed ?? merged.gamesPlayed,
      tier: m.tier ?? merged.tier,
      lastUpdated: m.lastUpdated ?? merged.lastUpdated,
      source: m.source ?? merged.source,
    };
  }

  if (td) {
    merged = {
      ...merged,
      tier: td.tier ?? merged.tier,
      deckCode: td.deckCode ?? merged.deckCode,
      dustCost: td.dustCost ?? merged.dustCost,
      source: td.deckCode ? 'hearthstonetopdecks' : merged.source,
    };
  }

  return merged;
});

export function getDeckById(id: string): Deck | undefined {
  return DECKS.find((d) => d.id === id);
}

export function getDecksByClass(cardClass: string): Deck[] {
  return DECKS.filter((d) => d.cardClass === cardClass);
}

export function getDecksByFormat(format: string): Deck[] {
  return DECKS.filter((d) => d.format === format);
}

export function getTopDecks(limit: number = 5): Deck[] {
  return [...DECKS]
    .sort((a, b) => (b.winRate || 0) - (a.winRate || 0))
    .slice(0, limit);
}

// Hot deck scoring: winRate (50%) + volume (30%) + recency (20%)
function hotScore(deck: Deck): number {
  const now = Date.now();
  const winRate = deck.winRate || 50;
  const games = deck.gamesPlayed || 0;
  const updated = deck.lastUpdated || deck.dateUpdated || "";

  const normalizedWinRate = Math.max(0, Math.min(1, (winRate - 45) / 15));
  const normalizedVolume =
    games > 0 ? Math.min(1, Math.log10(games) / 6) : 0;
  const ageMs = now - new Date(updated).getTime();
  const recencyScore = Math.max(0, 1 - ageMs / (1000 * 60 * 60 * 24 * 14));

  return 0.5 * normalizedWinRate + 0.3 * normalizedVolume + 0.2 * recencyScore;
}

export function getHotDecks(limit: number = 6): Deck[] {
  return [...DECKS].sort((a, b) => hotScore(b) - hotScore(a)).slice(0, limit);
}

export function getDataFreshness(): {
  lastUpdate: string;
  ageHours: number;
  label: string;
  color: string;
} {
  const latestUpdate = DECKS.reduce(
    (latest, d) => {
      const dDate = d.lastUpdated || d.dateUpdated;
      return dDate > latest ? dDate : latest;
    },
    ""
  );

  if (!latestUpdate) {
    return {
      lastUpdate: "",
      ageHours: Infinity,
      label: "无数据",
      color: "text-muted-foreground",
    };
  }

  const ageMs = Date.now() - new Date(latestUpdate).getTime();
  const ageHours = ageMs / (1000 * 60 * 60);

  if (ageHours < 24) {
    return {
      lastUpdate: latestUpdate,
      ageHours,
      label: `${Math.round(ageHours)} 小时前更新`,
      color: "text-emerald-500",
    };
  } else if (ageHours < 72) {
    return {
      lastUpdate: latestUpdate,
      ageHours,
      label: `${Math.round(ageHours / 24)} 天前更新`,
      color: "text-yellow-500",
    };
  } else {
    return {
      lastUpdate: latestUpdate,
      ageHours,
      label: "数据可能已过期",
      color: "text-muted-foreground",
    };
  }
}
