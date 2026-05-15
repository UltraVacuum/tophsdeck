export type CardClass =
  | "DEMONHUNTER"
  | "DEATHKNIGHT"
  | "DRUID"
  | "HUNTER"
  | "MAGE"
  | "PALADIN"
  | "PRIEST"
  | "ROGUE"
  | "SHAMAN"
  | "WARLOCK"
  | "WARRIOR"
  | "NEUTRAL";

export type CardRarity = "FREE" | "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
export type CardType = "MINION" | "SPELL" | "WEAPON" | "HERO" | "LOCATION";
export type GameFormat = "standard" | "wild";
export type DeckArchetype = string;
export type MinionRace = 
  | "BEAST" | "DEMON" | "DRAGON" | "ELEMENTAL" | "MECH" 
  | "MURLOC" | "PIRATE" | "TOTEM" | "UNDEAD" | "NAGA"
  | "NONE";
export type SpellSchool = 
  | "ARCANE" | "FIRE" | "FROST" | "NATURE" | "HOLY" 
  | "SHADOW" | "FEL" | "NONE";

export interface HearthstoneCard {
  id: string;
  dbfId?: number;
  name: string;
  nameZh?: string;
  cardClass: CardClass;
  rarity: CardRarity;
  type: CardType;
  cost: number;
  attack?: number;
  health?: number;
  durability?: number;
  text?: string;
  flavor?: string;
  lore?: string;
  artist?: string;
  mechanics?: string[];
  race?: MinionRace;
  spellSchool?: SpellSchool;
  set?: string;
  image?: string;
  cropImage?: string;
}

export interface MulliganGuide {
  always: string[];    // cardIds to always keep
  situational: { cardId: string; reason: string }[];
  never: string[];     // cardIds to always mulligan
}

export interface MatchupInfo {
  opponent: string;     // opponent class
  opponentZh: string;
  winRate: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  tips: string;
}

export interface Substitution {
  cardId: string;       // original card
  replacement: string;  // replacement cardId
  reason: string;
  dustSaved?: number;
}

export interface DeckGuide {
  /** 核心策略 - 2-3句话概述打法思路 */
  strategy: string;
  /** 留牌指南 */
  mulligan: MulliganGuide;
  /** 对阵各职业的攻略 */
  matchups: MatchupInfo[];
  /** 关键决策点 */
  keyDecisions: string[];
  /** 替换卡牌建议 */
  substitutions: Substitution[];
  /** 预算版粉尘上限 */
  budgetDust?: number;
  /** 预算版替换说明 */
  budgetNote?: string;
}

export interface Deck {
  id: string;
  name: string;
  nameZh?: string;
  description?: string;
  cardClass: CardClass;
  format: GameFormat;
  archetype: DeckArchetype;
  cards: DeckCardEntry[];
  dustCost?: number;
  winRate?: number;
  gamesPlayed?: number;
  tier?: number;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  playStyle?: string;
  dateCreated: string;
  dateUpdated: string;
  deckCode?: string;
  /** 完整攻略内容 */
  guide?: DeckGuide;
  /** 标签（用于搜索和筛选） */
  tags?: string[];
}

export interface DeckCardEntry {
  cardId: string;
  quantity: number;
}

export interface ClassInfo {
  id: CardClass;
  name: string;
  nameZh: string;
  icon: string;
  color: string;
  hero: string;
  heroTitle?: string;
  description?: string;
  playStyle?: string;
}

export interface TierInfo {
  deckId: string;
  tier: number;
  winRate: number;
  gamesPlayed: number;
  frequency: number;
}

export interface Mechanic {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  icon: string;
  tips?: string[];
}

export interface Synergy {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  cardIds: string[];
  tags: string[];
  difficulty: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: "patch" | "event" | "esports" | "guide";
  date: string;
  imageUrl?: string;
  link?: string;
}
