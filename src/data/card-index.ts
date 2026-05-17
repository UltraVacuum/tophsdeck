import indexData from "./generated/cards-index.json";

export interface CardIndex {
  i: string;   // id
  d: number;   // dbfId
  n: string;   // nameZh
  c: string;   // cardClass
  r: string;   // rarity
  t: string;   // type
  m: number;   // mana cost
  a?: number;  // attack
  h?: number;  // health
}

export const CARD_INDEX: CardIndex[] = indexData as CardIndex[];
