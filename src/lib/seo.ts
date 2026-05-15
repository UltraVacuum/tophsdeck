import type { Metadata } from "next";

const SITE_URL = "https://hstopdecks.com";
const SITE_NAME = "TopHSDeck";

// Core keywords organized by category
export const SEO_KEYWORDS = {
  // Brand & generic
  brand: ["TopHSDeck", "炉石传说卡组", "炉石传说攻略", "炉石传说", "Hearthstone"],
  // Cards
  cards: [
    "炉石传说卡牌数据库", "炉石卡牌图鉴", "炉石卡牌查询", "Hearthstone card database",
    "炉石传说全卡牌", "炉石新卡", "炉石卡牌属性", "炉石传说卡牌大全",
  ],
  // Decks
  decks: [
    "炉石传说卡组推荐", "炉石卡组代码", "炉石卡组搭配", "Hearthstone decks",
    "炉石传说最强卡组", "炉石卡组攻略", "炉石传说组卡", "炉石标准卡组",
    "炉石传说卡组构建", "炉石T1卡组",
  ],
  // Meta/Environment
  meta: [
    "炉石传说环境分析", "炉石环境报告", "炉石天梯排行", "Hearthstone meta",
    "炉石传说Tier列表", "炉石胜率统计", "炉石热门卡组", "炉石天梯环境",
  ],
  // Mechanics
  mechanics: [
    "炉石传说机制", "炉石关键词", "炉石战吼", "炉石亡语", "炉石奥秘",
    "炉石连击", "炉石过载", "炉石抉择", "Hearthstone mechanics",
  ],
  // Classes
  classes: [
    "炉石战士卡组", "炉石法师卡组", "炉石猎人卡组", "炉石术士卡组",
    "炉石潜行者卡组", "炉石圣骑士卡组", "炉石萨满卡组", "炉石牧师卡组",
    "炉石德鲁伊卡组", "炉石恶魔猎手卡组",
  ],
  // General long-tail
  longTail: [
    "炉石传说怎么组卡组", "炉石传说什么卡组厉害", "炉石传说新手卡组推荐",
    "炉石传说标准模式卡组", "炉石传说狂野模式卡组", "Hearthstone best decks 2026",
    "炉石传说最新版本卡组", "炉石传说上分卡组",
  ],
};

function keywords(...groups: (keyof typeof SEO_KEYWORDS)[]): string[] {
  return groups.flatMap(g => SEO_KEYWORDS[g]);
}

export function generatePageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords?.join(", "),
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      locale: "zh_CN",
      type: "website",
      ...(opts.ogImage ? { images: [{ url: opts.ogImage, width: 1200, height: 630, alt: opts.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      ...(opts.ogImage ? { images: [opts.ogImage] } : {}),
    },
    robots: opts.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  };
}

// Pre-built metadata for each page route
export const PAGE_SEO = {
  home: generatePageMetadata({
    title: "TopHSDeck - 炉石传说卡组推荐 | 最新卡组搭配与环境分析",
    description:
      "TopHSDeck 是专业的炉石传说攻略平台，提供最新卡组推荐、环境分析、卡牌数据库、Tier排行。涵盖标准/狂野模式全职业卡组搭配，助你轻松上分。",
    path: "/",
    keywords: keywords("brand", "decks", "meta", "longTail"),
  }),
  cards: generatePageMetadata({
    title: "炉石传说卡牌数据库 - 全卡牌图鉴查询 | TopHSDeck",
    description:
      "浏览炉石传说全部可收集卡牌，支持按职业、费用、品质、类型筛选。查看卡牌属性、技能描述、风味文字、相关机制等详细信息。",
    path: "/cards",
    keywords: keywords("cards", "brand"),
  }),
  decks: generatePageMetadata({
    title: "炉石传说卡组推荐 - 热门卡组代码与攻略 | TopHSDeck",
    description:
      "发现炉石传说最新热门卡组，包含T1/T2卡组推荐、胜率数据、卡组代码一键复制。覆盖标准模式和狂野模式全职业。",
    path: "/decks",
    keywords: keywords("decks", "brand"),
  }),
  meta: generatePageMetadata({
    title: "炉石传说环境分析 - 天梯排行与胜率统计 | TopHSDeck",
    description:
      "查看炉石传说当前环境分析报告，包含职业胜率、热门卡组排行、Tier列表、天梯趋势。实时追踪标准与狂野模式环境变化。",
    path: "/meta",
    keywords: keywords("meta", "brand"),
  }),
  mechanics: generatePageMetadata({
    title: "炉石传说机制说明 - 卡牌关键词与技能详解 | TopHSDeck",
    description:
      "了解炉石传说全部卡牌机制与关键词，包括战吼、亡语、奥秘、连击、过载等。详细说明触发条件与相关卡牌推荐。",
    path: "/mechanics",
    keywords: keywords("mechanics", "brand"),
  }),
  synergies: generatePageMetadata({
    title: "炉石传说卡牌配合 - 最佳组合与连招推荐 | TopHSDeck",
    description:
      "探索炉石传说卡牌间的强力配合与连招组合，发现最佳卡牌搭配。包含职业配合、中立配合和跨职业组合推荐。",
    path: "/synergies",
    keywords: keywords("decks", "mechanics", "brand"),
  }),
  news: generatePageMetadata({
    title: "炉石传说资讯 - 最新版本更新与活动公告 | TopHSDeck",
    description:
      "获取炉石传说最新资讯，包括版本更新、平衡调整、活动公告、赛事新闻。第一时间了解游戏动态。",
    path: "/news",
    keywords: keywords("brand", "meta"),
  }),
  deckImport: generatePageMetadata({
    title: "炉石传说卡组代码导入 - 粘贴代码查看完整卡组 | TopHSDeck",
    description:
      "粘贴炉石传说卡组代码，自动解析并展示完整卡牌列表、法力曲线、粉尘成本。支持标准和狂野模式所有卡组代码。",
    path: "/decks/import",
    keywords: ["炉石卡组代码", "炉石卡组导入", "炉石卡组解析", "Hearthstone deck code", ...keywords("decks", "brand")],
  }),
};

// Card detail page SEO
export function generateCardMetadata(opts: {
  nameZh: string;
  name: string;
  cardClass: string;
  rarity: string;
  type: string;
  cost: number;
  text: string;
  id: string;
}): Metadata {
  const CLASS_ZH: Record<string, string> = {
    DEMONHUNTER: "恶魔猎手", DRUID: "德鲁伊", HUNTER: "猎人", MAGE: "法师",
    PALADIN: "圣骑士", PRIEST: "牧师", ROGUE: "潜行者", SHAMAN: "萨满祭司",
    WARLOCK: "术士", WARRIOR: "战士", NEUTRAL: "中立",
  };
  const TYPE_ZH: Record<string, string> = { MINION: "随从", SPELL: "法术", WEAPON: "武器", HERO: "英雄", LOCATION: "地标" };
  const RARITY_ZH: Record<string, string> = { FREE: "基础", COMMON: "普通", RARE: "稀有", EPIC: "史诗", LEGENDARY: "传说" };

  const title = `${opts.nameZh} - ${CLASS_ZH[opts.cardClass] || opts.cardClass}${TYPE_ZH[opts.type] || opts.type} | 炉石卡牌 | TopHSDeck`;
  const description = `${opts.nameZh}（${opts.name}）是炉石传说${CLASS_ZH[opts.cardClass] || opts.cardClass}的${RARITY_ZH[opts.rarity] || opts.rarity}${TYPE_ZH[opts.type] || opts.type}，费用${opts.cost}。${opts.text ? opts.text.replace(/\$/g, "").replace(/\n/g, " ").slice(0, 100) : ""}`;

  return generatePageMetadata({
    title,
    description: description.slice(0, 160),
    path: `/cards/${opts.id}`,
    keywords: [
      opts.nameZh, opts.name, `${CLASS_ZH[opts.cardClass]}卡牌`,
      `炉石${RARITY_ZH[opts.rarity]}`, `炉石${TYPE_ZH[opts.type]}`,
      ...SEO_KEYWORDS.cards.slice(0, 3),
    ],
    ogImage: `https://art.hearthstonejson.com/v1/512x/${opts.id}.jpg`,
  });
}

// Deck detail page SEO
export function generateDeckMetadata(opts: {
  nameZh: string;
  cardClass: string;
  archetype: string;
  format: string;
  winRate?: number;
  tier?: number;
  id: string;
}): Metadata {
  const CLASS_ZH: Record<string, string> = {
    DEMONHUNTER: "恶魔猎手", DRUID: "德鲁伊", HUNTER: "猎人", MAGE: "法师",
    PALADIN: "圣骑士", PRIEST: "牧师", ROGUE: "潜行者", SHAMAN: "萨满祭司",
    WARLOCK: "术士", WARRIOR: "战士", NEUTRAL: "中立",
  };

  const classZh = CLASS_ZH[opts.cardClass] || opts.cardClass;
  const formatZh = opts.format === "standard" ? "标准" : "狂野";
  const tierStr = opts.tier ? `Tier ${opts.tier}` : "";
  const winStr = opts.winRate ? `胜率${opts.winRate}%` : "";

  const title = `${opts.nameZh} - ${classZh}${opts.archetype} ${formatZh}模式${tierStr ? ` ${tierStr}` : ""} | TopHSDeck`;
  const description = `${opts.nameZh}是炉石传说${classZh}${opts.archetype}卡组，${formatZh}模式${tierStr ? `，${tierStr}` : ""}${winStr ? `，${winStr}` : ""}。查看完整卡组列表、法力曲线、卡组代码。`;

  return generatePageMetadata({
    title,
    description: description.slice(0, 160),
    path: `/decks/${opts.id}`,
    keywords: [
      opts.nameZh, `${classZh}卡组`, `${opts.archetype}卡组`,
      `炉石${formatZh}卡组`, `炉石${classZh}`,
      ...SEO_KEYWORDS.decks.slice(0, 3),
    ],
  });
}

// Class detail page SEO
export function generateClassMetadata(opts: {
  nameZh: string;
  name: string;
  id: string;
}): Metadata {
  const title = `炉石传说${opts.nameZh}卡组与卡牌 | ${opts.name}攻略 | TopHSDeck`;
  const description = `查看炉石传说${opts.nameZh}（${opts.name}）的热门卡组推荐、核心卡牌、职业机制和攻略。发现最强${opts.nameZh}卡组搭配。`;

  return generatePageMetadata({
    title,
    description,
    path: `/classes/${opts.id}`,
    keywords: [
      `炉石${opts.nameZh}卡组`, `炉石${opts.nameZh}攻略`,
      `炉石${opts.name}`, `${opts.nameZh}最强卡组`,
      ...SEO_KEYWORDS.decks.slice(0, 3),
    ],
  });
}
