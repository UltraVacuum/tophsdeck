"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CARD_INDEX } from "@/data/card-index";
import { getCardArtUrl } from "@/data/real-cards";
import { HS_CLASSES, CLASS_COLORS } from "@/data/classes";
import { cn } from "@/lib/utils";
import { LayoutGrid, List, Search } from "lucide-react";

const RARITIES = [
  { value: "ALL", label: "全部" },
  { value: "FREE", label: "免费", color: "var(--rarity-free)" },
  { value: "COMMON", label: "普通", color: "var(--rarity-common)" },
  { value: "RARE", label: "稀有", color: "var(--rarity-rare)" },
  { value: "EPIC", label: "史诗", color: "var(--rarity-epic)" },
  { value: "LEGENDARY", label: "传说", color: "var(--rarity-legendary)" },
];

const TYPES = [
  { value: "ALL", label: "全部" },
  { value: "MINION", label: "随从" },
  { value: "SPELL", label: "法术" },
  { value: "WEAPON", label: "武器" },
  { value: "HERO", label: "英雄" },
  { value: "LOCATION", label: "地标" },
];

const RARITY_DOT: Record<string, string> = {
  FREE: "bg-[var(--rarity-free)]",
  COMMON: "bg-[var(--rarity-common)]",
  RARE: "bg-[var(--rarity-rare)]",
  EPIC: "bg-[var(--rarity-epic)]",
  LEGENDARY: "bg-[var(--rarity-legendary)]",
};

const RARITY_TEXT: Record<string, string> = {
  FREE: "text-gray-400", COMMON: "text-gray-300", RARE: "text-blue-400",
  EPIC: "text-purple-400", LEGENDARY: "text-orange-400",
};

const CLASS_LETTERS: Record<string, string> = {
  WARRIOR: "战", HUNTER: "猎", ROGUE: "贼", PALADIN: "骑",
  MAGE: "法", PRIEST: "牧", WARLOCK: "术", SHAMAN: "萨",
  DRUID: "德", DEMONHUNTER: "恶", DEATHKNIGHT: "死", NEUTRAL: "中",
};

function getClassGradient(color: string): string {
  return `linear-gradient(135deg, ${color}30, ${color}10)`;
}

const ALL_CLASSES = [
  ...HS_CLASSES.map(c => ({ id: c.id, nameZh: c.nameZh, color: c.color })),
  { id: "NEUTRAL", nameZh: "中立", color: "#888888" },
];

export default function CardsPage() {
  const [classFilter, setClassFilter] = useState("ALL");
  const [rarityFilter, setRarityFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [costFilter, setCostFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredCards = useMemo(() => {
    let result = CARD_INDEX;
    if (classFilter !== "ALL") result = result.filter(c => c.c === classFilter);
    if (rarityFilter !== "ALL") result = result.filter(c => c.r === rarityFilter);
    if (typeFilter !== "ALL") result = result.filter(c => c.t === typeFilter);
    if (costFilter !== "ALL") {
      const cost = parseInt(costFilter);
      if (cost === 7) result = result.filter(c => c.m >= 7);
      else result = result.filter(c => c.m === cost);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => c.n.toLowerCase().includes(q));
    }
    return result.slice(0, 200);
  }, [classFilter, rarityFilter, typeFilter, costFilter, searchQuery]);

  return (
    <div>
      {/* Compact Hero */}
      <section className="py-6 md:py-10">
        <div className="mx-auto max-w-280 px-8 text-center">
          <h1 className="font-heading text-[clamp(36px,5vw,64px)] leading-[1.08] tracking-tight mb-3">卡牌数据库</h1>
          <p className="text-muted-foreground text-lg max-w-[60ch] mx-auto">
            {CARD_INDEX.length.toLocaleString()}+ 张可收集卡牌
          </p>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="mx-auto max-w-280 px-8 pb-16">
        {/* Filter Bar */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-8">
          {/* Search */}
          <div className="flex items-center gap-2 mb-3.5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索卡牌名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-background border border-border font-sans text-sm text-foreground outline-none focus:border-foreground transition-colors"
              />
            </div>
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-2 flex-wrap mb-3.5">
            <span className="font-mono text-[11px] text-muted-foreground min-w-10 shrink-0 uppercase tracking-wide">职业</span>
            <button
              onClick={() => setClassFilter("ALL")}
              className={cn(
                "w-9 h-9 rounded-full border-1.5 grid place-items-center text-sm font-semibold transition-all shrink-0",
                classFilter === "ALL"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-foreground hover:border-foreground"
              )}
            >
              全
            </button>
            {ALL_CLASSES.map(cls => (
              <button
                key={cls.id}
                onClick={() => setClassFilter(classFilter === cls.id ? "ALL" : cls.id)}
                className={cn(
                  "w-9 h-9 rounded-full border-1.5 grid place-items-center text-[13px] font-semibold transition-all shrink-0",
                  classFilter === cls.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground hover:border-foreground"
                )}
                title={cls.nameZh}
              >
                {CLASS_LETTERS[cls.id] || "?"}
              </button>
            ))}
          </div>

          {/* Cost Filter */}
          <div className="flex items-center gap-2 flex-wrap mb-3.5">
            <span className="font-mono text-[11px] text-muted-foreground min-w-10 shrink-0 uppercase tracking-wide">费用</span>
            {["ALL", "0", "1", "2", "3", "4", "5", "6", "7"].map(c => (
              <button
                key={c}
                onClick={() => setCostFilter(c)}
                className={cn(
                  "w-8 h-8 rounded-full border-1.5 grid place-items-center font-mono text-[13px] font-semibold transition-all shrink-0",
                  costFilter === c
                    ? "border-(--mana-bg) bg-(--mana-bg) text-(--mana-fg)"
                    : "border-border text-foreground hover:border-(--mana-bg) hover:text-(--mana-bg)"
                )}
              >
                {c === "ALL" ? "全" : c === "7" ? "7+" : c}
              </button>
            ))}
          </div>

          {/* Rarity Filter */}
          <div className="flex items-center gap-2 flex-wrap mb-3.5">
            <span className="font-mono text-[11px] text-muted-foreground min-w-10 shrink-0 uppercase tracking-wide">稀有度</span>
            {RARITIES.map(r => (
              <button
                key={r.value}
                onClick={() => setRarityFilter(r.value)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full border-1.5 text-[13px] transition-all shrink-0",
                  rarityFilter === r.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground hover:border-foreground"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] text-muted-foreground min-w-10 shrink-0 uppercase tracking-wide">类型</span>
            {TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => setTypeFilter(t.value)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full border-1.5 text-[13px] transition-all shrink-0",
                  typeFilter === t.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground hover:border-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Toggle + Result Count */}
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-[13px] text-muted-foreground">{filteredCards.length} 张卡牌</span>
          <div className="flex gap-1 bg-background rounded-full p-0.75 border border-border">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "w-8 h-8 rounded-full grid place-items-center transition-all",
                viewMode === "grid" ? "bg-card text-foreground border border-border" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "w-8 h-8 rounded-full grid place-items-center transition-all",
                viewMode === "list" ? "bg-card text-foreground border border-border" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredCards.map(card => {
              const cardColor = CLASS_COLORS[card.c] || "#888";
              const artUrl = getCardArtUrl(card.i);
              return (
                <Link key={card.i} href={`/cards/${card.i}`} className="group">
                  <div className="bg-card border border-border rounded-xl overflow-hidden relative cursor-pointer transition-all duration-150 group-hover:-translate-y-0.5">
                    <div
                      className="relative overflow-hidden aspect-3/4"
                      style={{
                        backgroundImage: `url('${artUrl}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundColor: cardColor + "20",
                      }}
                    >
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                      <span className="absolute top-2 left-2 w-7 h-7 rounded-full bg-(--mana-bg) text-(--mana-fg) font-mono text-sm font-bold grid place-items-center z-2 shadow-md">
                        {card.m}
                      </span>
                      <span className={cn("absolute top-2 right-2 w-2.5 h-2.5 rounded-full z-2 shadow-sm", RARITY_DOT[card.r] || "bg-gray-400")} />
                    </div>
                    <div className="px-3 py-2.5">
                      <div className="font-semibold text-sm truncate mb-0.5">{card.n}</div>
                      {(card.a != null && card.h != null) && (
                        <div className="flex justify-between font-mono text-[13px] font-bold">
                          <span>{card.a}</span>
                          <span>{card.h}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="flex flex-col gap-0.5">
            {filteredCards.map(card => {
              const cardColor = CLASS_COLORS[card.c] || "#888";
              return (
                <Link key={card.i} href={`/cards/${card.i}`}>
                  <div className="group grid grid-cols-[30px_36px_1fr_auto_auto] items-center gap-3 px-3.5 py-2 bg-card border border-border rounded-lg cursor-pointer transition-colors hover:bg-background/50 relative">
                    <span className="w-7 h-7 rounded-full bg-(--mana-bg) text-(--mana-fg) font-mono text-[13px] font-bold grid place-items-center">
                      {card.m}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cardColor }} />
                    <span className="font-semibold text-sm truncate">{card.n}</span>
                    <span className="font-mono text-[13px] text-muted-foreground">
                      {(card.a != null && card.h != null) ? `${card.a}/${card.h}` : ""}
                    </span>
                    <span className={cn("w-2 h-2 rounded-full shrink-0", RARITY_DOT[card.r] || "bg-gray-400")} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {filteredCards.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            <h3 className="text-lg mb-2 text-foreground">没有找到匹配的卡牌</h3>
            <p className="text-sm">尝试调整筛选条件</p>
          </div>
        )}
      </section>
    </div>
  );
}
