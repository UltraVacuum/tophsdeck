import rawData from "./generated/cards-full.json";

export type CardType = "MINION" | "SPELL" | "WEAPON" | "LOCATION" | "HERO";

export interface RealCard {
  id: string;
  dbfId: number;
  name: string;
  nameZh: string;
  cardClass: string;
  rarity: string;
  type: CardType;
  cost: number;
  attack?: number;
  health?: number;
  durability?: number;
  armor?: number;
  text: string;
  textZh: string;
  flavor: string;
  flavorZh: string;
  artist?: string;
  race?: string | null;
  spellSchool?: string | null;
  mechanics: string[];
  set: string;
}

// Card image URL helpers — HearthstoneJSON CDN

/** Card Render (full card with frame/text/stats, zhCN) */
export function getCardRenderUrl(cardId: string, size: "256" | "512" = "512"): string {
  return `https://art.hearthstonejson.com/v1/render/latest/zhCN/${size}x/${cardId}.png`;
}

/** Card Art (just the illustration, square) */
export function getCardArtUrl(cardId: string, size: "256" | "512" = "256"): string {
  return `https://art.hearthstonejson.com/v1/${size}x/${cardId}.jpg`;
}

/** Card Tile (rectangular strip for deck lists) */
export function getCardTileUrl(cardId: string): string {
  return `https://art.hearthstonejson.com/v1/tiles/${cardId}.jpg`;
}

/** @deprecated Use getCardArtUrl or getCardRenderUrl */
export function getCardImageUrl(cardId: string, size: "256" | "512" = "256"): string {
  return getCardArtUrl(cardId, size);
}

const VALID_CLASSES = new Set([
  "DEMONHUNTER", "DEATHKNIGHT", "DRUID", "HUNTER", "MAGE",
  "PALADIN", "PRIEST", "ROGUE", "SHAMAN", "WARLOCK", "WARRIOR", "NEUTRAL",
]);

export const ALL_CARDS: RealCard[] = (rawData as RealCard[]).filter(
  c => VALID_CLASSES.has(c.cardClass)
);

const cardById = new Map<string, RealCard>();
const cardsByClass = new Map<string, RealCard[]>();

for (const card of ALL_CARDS) {
  cardById.set(card.id, card);
  if (!cardsByClass.has(card.cardClass)) cardsByClass.set(card.cardClass, []);
  cardsByClass.get(card.cardClass)!.push(card);
}

for (const [, cards] of cardsByClass) {
  cards.sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));
}

export function getRealCardById(id: string): RealCard | undefined {
  return cardById.get(id);
}

export function getRealCardsByClass(cardClass: string): RealCard[] {
  return cardsByClass.get(cardClass) || [];
}

const RARITY_ORDER: Record<string, number> = {
  LEGENDARY: 4, EPIC: 3, RARE: 2, COMMON: 1, FREE: 0,
};

/** Pick the best representative card for a deck (highest rarity, then highest cost) */
export function getRepresentativeCardId(cardIds: string[]): string | undefined {
  let best: { id: string; rarity: number; cost: number } | undefined;
  for (const id of cardIds) {
    const card = cardById.get(id);
    if (!card) continue;
    const r = RARITY_ORDER[card.rarity] ?? 0;
    if (!best || r > best.rarity || (r === best.rarity && card.cost > best.cost)) {
      best = { id: card.id, rarity: r, cost: card.cost };
    }
  }
  return best?.id;
}
