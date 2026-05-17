import { Deck, CardClass } from "@/types";
import mergedRaw from "./generated/decks-merged.json";

interface MergedCard {
  dbfId?: number;
  name: string;
  cardId?: string;
  quantity: number;
  cost?: number;
}

interface MergedArchetype {
  archetypeName?: string;
  cardClass?: string;
  tier?: number;
  tierName?: string;
  deckCode?: string;
  dustCost?: number;
  sourceUrl?: string;
  player?: string;
  rank?: number;
  cards?: MergedCard[];
  cardCount?: number;
  firstSeen?: string;
  lastSeen?: string;
}

interface MergedData {
  lastMerge: string;
  latestSnapshot: string;
  snapshotCount: number;
  totalArchetypes: number;
  totalDeckCodes: number;
  archetypes: Record<string, MergedArchetype>;
}

const merged = mergedRaw as unknown as MergedData;

// 中文职业名映射
export const CLASS_ZH: Record<string, string> = {
  DEMONHUNTER: "恶魔猎手",
  DEATHKNIGHT: "死亡骑士",
  DRUID: "德鲁伊",
  HUNTER: "猎人",
  MAGE: "法师",
  PALADIN: "圣骑士",
  PRIEST: "牧师",
  ROGUE: "潜行者",
  SHAMAN: "萨满",
  WARLOCK: "术士",
  WARRIOR: "战士",
};

// Archetype 中文名映射
const ARCHETYPE_ZH: Record<string, string> = {
  // Demon Hunter
  "deck-dh-peddler": "小贩恶魔猎手",
  "deck-dh-broxigar": "布洛克斯恶魔猎手",
  "deck-dh-aggro": "快攻恶魔猎手",
  "deck-dh-cliff-dive": "悬崖俯冲恶魔猎手",
  "deck-dh-aggro-crewmate": "船员快攻恶魔猎手",
  "deck-dh-pirate-aggro": "海盗快攻恶魔猎手",
  "deck-dh-no-minion": "无随从恶魔猎手",
  "deck-dh-octosari": "章鱼恶魔猎手",
  // Death Knight
  "deck-dk-corpse": "尸体死亡骑士",
  "deck-dk-leech": "水蛭死亡骑士",
  "deck-dk-stegodon": "剑龙死亡骑士",
  "deck-dk-deathrattle": "亡语死亡骑士",
  "deck-dk-blood-control": "鲜血控制死亡骑士",
  "deck-dk-frost-aggro": "冰霜快攻死亡骑士",
  "deck-dk-unholy-midrange": "邪恶中速死亡骑士",
  "deck-dk-rainbow-handbuff": "彩虹手牌buff死亡骑士",
  // Druid
  "deck-druid-owlonius": "奥洛尼乌斯德鲁伊",
  "deck-druid-aviana": "艾维娜德鲁伊",
  "deck-druid-ramp": "跳费德鲁伊",
  "deck-druid-token-wild": "铺场德鲁伊",
  "deck-druid-treant": "树人德鲁伊",
  "deck-druid-xl-malygos-ysiel": "玛里苟斯伊希埃尔德鲁伊",
  "deck-druid-xl-reno-dragon": "雷诺龙德鲁伊",
  // Hunter
  "deck-hunter-discover": "发现猎人",
  "deck-hunter-discover-briarspawn": "荆刺发现猎人",
  "deck-hunter-face": "打脸猎人",
  "deck-hunter-midrange": "中速猎人",
  "deck-hunter-sandwich": "三明治猎人",
  "deck-hunter-xl-reno": "雷诺猎人",
  "deck-hunter-xl-leoroxx-reno": "雷克萨雷诺猎人",
  // Mage
  "deck-mage-protoss": "星灵法师",
  "deck-mage-elemental": "元素法师",
  "deck-mage-quest": "任务法师",
  "deck-mage-arkwing": "方舟法师",
  "deck-mage-arkwing-quest": "方舟任务法师",
  "deck-mage-toki": "托奇法师",
  "deck-mage-arcane": "奥术法师",
  "deck-mage-imbue": "灌注法师",
  "deck-mage-spell-quest": "法术任务法师",
  "deck-mage-xl-quest": "任务法师XL",
  "deck-mage-xl-reno-big-spell": "雷诺大法术法师",
  // Paladin
  "deck-paladin-aura": "光环圣骑士",
  "deck-paladin-aggro": "快攻圣骑士",
  "deck-paladin-handbuff": "手牌buff圣骑士",
  "deck-paladin-libram": "圣契圣骑士",
  "deck-paladin-imbue-dragon": "灌注龙圣骑士",
  "deck-paladin-umbra": "暗影圣骑士",
  // Priest
  "deck-priest-protoss": "星灵牧师",
  "deck-priest-zarimi": "扎里米牧师",
  "deck-priest-control": "控制牧师",
  "deck-priest-burn": "烧牌牧师",
  "deck-priest-xl-questline-reno": "任务线雷诺牧师",
  "deck-priest-xl-reno-shadow": "雷诺暗影牧师",
  // Rogue
  "deck-rogue-imbue": "灌注潜行者",
  "deck-rogue-ashamane": "阿莎曼潜行者",
  "deck-rogue-protoss": "星灵活潜行者",
  "deck-rogue-cycle": "轮转潜行者",
  "deck-rogue-quasar": "类星体潜行者",
  "deck-rogue-miracle": "奇迹潜行者",
  "deck-rogue-tess": "苔丝潜行者",
  // Shaman
  "deck-shaman-midrange": "中速萨满",
  "deck-shaman-aggro-totem": "快攻图腾萨满",
  "deck-shaman-spell-damage": "法术伤害萨满",
  "deck-shaman-xl-reno-shudderwock": "雷诺战吼萨满",
  // Warlock
  "deck-warlock-egg": "蛋术",
  "deck-warlock-rafaam": "拉法姆术士",
  "deck-warlock-zoo": "动物园术士",
  "deck-warlock-demon": "恶魔术士",
  "deck-warlock-wallow-demon": "深渊恶魔术士",
  "deck-warlock-xl-quest-reno": "任务雷诺术士",
  // Warrior
  "deck-warrior-dragon": "龙战",
  "deck-warrior-quest-control": "任务控制战",
  "deck-warrior-quest": "任务战",
  "deck-warrior-control": "防战",
  "deck-warrior-xl-reno": "雷诺战",
};

function formatDeckName(id: string): string {
  const parts = id.replace(/^deck-/, "").split("-");
  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

// 从合并数据构建 DECKS
export const DECKS: Deck[] = Object.entries(merged.archetypes).map(([id, td]) => {
  const cards = td.cards?.map(c => ({
    cardId: c.cardId || (c.dbfId ? String(c.dbfId) : ""),
    quantity: c.quantity,
  })).filter(c => c.cardId) || [];

  const archetypeName = td.archetypeName || formatDeckName(id);
  const nameZh = ARCHETYPE_ZH[id] || archetypeName;

  return {
    id,
    name: archetypeName,
    nameZh,
    description: td.tierName === "Best Decks"
      ? `${nameZh}，当前环境顶级卡组${td.player ? `，由玩家 ${td.player} 打到 #${td.rank || "?"} 传说` : ""}。`
      : td.tierName === "Great Decks"
        ? `${nameZh}，当前环境强力卡组，胜率稳定。`
        : `${nameZh}，环境可用卡组。`,
    cardClass: (td.cardClass as CardClass) || "WARRIOR",
    format: "standard",
    archetype: td.tierName || "Meta",
    cards,
    dustCost: td.dustCost ?? undefined,
    tier: td.tier,
    difficulty: td.tier === 1 ? 3 : td.tier === 2 ? 2 : 1,
    playStyle: td.tierName === "Best Decks" ? "主流" : td.tierName === "Great Decks" ? "强力" : "趣味",
    dateCreated: td.firstSeen || merged.latestSnapshot,
    dateUpdated: td.lastSeen || merged.latestSnapshot,
    lastUpdated: merged.lastMerge,
    deckCode: td.deckCode,
    decodedCards: td.cards?.length ? td.cards as Deck["decodedCards"] : undefined,
    source: "hearthstonetopdecks",
    tags: [td.tierName || "Meta", td.cardClass || ""].filter(Boolean),
    sourceUrl: td.sourceUrl,
    player: td.player,
    rank: td.rank,
  } as Deck & { sourceUrl?: string; player?: string; rank?: number };
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
    .sort((a, b) => (a.tier || 99) - (b.tier || 99))
    .slice(0, limit);
}

function hotScore(deck: Deck & { rank?: number }): number {
  const tier = deck.tier || 3;
  const rank = deck.rank || 100;
  const dust = deck.dustCost || 0;
  const tierScore = Math.max(0, 1 - (tier - 1) / 3);
  const rankScore = Math.max(0, 1 - Math.log10(rank) / 3);
  const dustScore = Math.min(1, dust / 20000);
  return 0.4 * tierScore + 0.3 * rankScore + 0.3 * dustScore;
}

export function getHotDecks(limit: number = 6): Deck[] {
  return [...DECKS].sort((a, b) => hotScore(b as any) - hotScore(a as any)).slice(0, limit);
}

export function getDataFreshness(): {
  lastUpdate: string;
  ageHours: number;
  label: string;
  color: string;
} {
  const latestUpdate = merged.lastMerge;
  if (!latestUpdate) {
    return { lastUpdate: "", ageHours: Infinity, label: "无数据", color: "text-muted-foreground" };
  }

  const ageMs = Date.now() - new Date(latestUpdate).getTime();
  const ageHours = ageMs / (1000 * 60 * 60);

  if (ageHours < 24) {
    return { lastUpdate: latestUpdate, ageHours, label: `${Math.round(ageHours)} 小时前更新`, color: "text-emerald-500" };
  } else if (ageHours < 72) {
    return { lastUpdate: latestUpdate, ageHours, label: `${Math.round(ageHours / 24)} 天前更新`, color: "text-yellow-500" };
  } else {
    return { lastUpdate: latestUpdate, ageHours, label: "数据可能已过期", color: "text-muted-foreground" };
  }
}
