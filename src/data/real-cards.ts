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

export const ALL_CARDS: RealCard[] = rawData as RealCard[];

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
