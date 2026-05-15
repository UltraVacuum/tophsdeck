import { ALL_CARDS, type RealCard } from "@/data/real-cards";

const dbfMap = new Map<number, RealCard>();
for (const c of ALL_CARDS) {
  if (c.dbfId) dbfMap.set(c.dbfId, c);
}

export interface DecodedDeck {
  cards: { card: RealCard; quantity: number }[];
  heroCard?: RealCard;
  format: "standard" | "wild" | "classic" | "unknown";
  classCards: RealCard[];
  neutralCards: RealCard[];
  totalCards: number;
  manaCurve: { cost: number; count: number }[];
  dustCost: number;
}

function readVarint(buf: Uint8Array, offset: { val: number }): number {
  let result = 0;
  let shift = 0;
  while (offset.val < buf.length) {
    const b = buf[offset.val++];
    result |= (b & 0x7f) << shift;
    if ((b & 0x80) === 0) break;
    shift += 7;
  }
  return result;
}

export function decodeDeckCode(code: string): DecodedDeck | null {
  try {
    const trimmed = code.trim();
    const buf = Uint8Array.from(atob(trimmed), c => c.charCodeAt(0));

    let offset = { val: 0 };

    const header = readVarint(buf, offset);
    if (header !== 0) return null;

    const version = readVarint(buf, offset);
    if (version !== 1) return null;

    const formatNum = readVarint(buf, offset);
    const format: DecodedDeck["format"] =
      formatNum === 1 ? "wild" :
      formatNum === 2 ? "standard" :
      formatNum === 3 ? "classic" : "unknown";

    const numHeroes = readVarint(buf, offset);
    let heroCard: RealCard | undefined;
    for (let i = 0; i < numHeroes; i++) {
      const dbfId = readVarint(buf, offset);
      const card = dbfMap.get(dbfId);
      if (card) heroCard = card;
    }

    const cards: { card: RealCard; quantity: number }[] = [];

    // Single-copy cards
    const numSingle = readVarint(buf, offset);
    for (let i = 0; i < numSingle; i++) {
      const dbfId = readVarint(buf, offset);
      const card = dbfMap.get(dbfId);
      if (card) cards.push({ card, quantity: 1 });
    }

    // Double-copy cards
    const numDouble = readVarint(buf, offset);
    for (let i = 0; i < numDouble; i++) {
      const dbfId = readVarint(buf, offset);
      const card = dbfMap.get(dbfId);
      if (card) cards.push({ card, quantity: 2 });
    }

    // Multi-copy cards
    const numMulti = readVarint(buf, offset);
    for (let i = 0; i < numMulti; i++) {
      const dbfId = readVarint(buf, offset);
      const count = readVarint(buf, offset);
      const card = dbfMap.get(dbfId);
      if (card) cards.push({ card, quantity: count });
    }

    if (cards.length === 0) return null;

    const classCards = cards.filter(c => c.card.cardClass !== "NEUTRAL").map(c => c.card);
    const neutralCards = cards.filter(c => c.card.cardClass === "NEUTRAL").map(c => c.card);

    const totalCards = cards.reduce((s, c) => s + c.quantity, 0);

    const costMap = new Map<number, number>();
    for (const { card, quantity } of cards) {
      costMap.set(card.cost, (costMap.get(card.cost) || 0) + quantity);
    }
    const manaCurve = [...costMap.entries()]
      .map(([cost, count]) => ({ cost, count }))
      .sort((a, b) => a.cost - b.cost);

    const RARITY_DUST = { FREE: 0, COMMON: 40, RARE: 100, EPIC: 400, LEGENDARY: 1600 };
    const dustCost = cards.reduce((s, { card, quantity }) => {
      const perCard = RARITY_DUST[card.rarity as keyof typeof RARITY_DUST] || 0;
      return s + perCard * quantity;
    }, 0);

    return { cards, heroCard, format, classCards, neutralCards, totalCards, manaCurve, dustCost };
  } catch {
    return null;
  }
}
