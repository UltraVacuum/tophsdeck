import { Deck } from "@/types";
import rawData from "./generated/decks.json";

export const DECKS: Deck[] = rawData as Deck[];

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
  return [...DECKS].sort((a, b) => (b.winRate || 0) - (a.winRate || 0)).slice(0, limit);
}
