"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DECKS } from "@/data/decks";
import { HS_CLASSES, CLASS_COLORS } from "@/data/classes";
import { getRepresentativeCardId, getCardArtUrl } from "@/data/real-cards";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CLASS_LETTERS: Record<string, string> = {
  WARRIOR: "战", HUNTER: "猎", ROGUE: "贼", PALADIN: "骑",
  MAGE: "法", PRIEST: "牧", WARLOCK: "术", SHAMAN: "萨",
  DRUID: "德", DEMONHUNTER: "恶", DEATHKNIGHT: "死",
};

function getClassGradient(color: string): string {
  return `linear-gradient(135deg, ${color}40, ${color}18)`;
}

export default function DecksPage() {
  const searchParams = useSearchParams();
  const [classFilter, setClassFilter] = useState<string>(searchParams.get("class")?.toUpperCase() || "ALL");
  const [modeFilter, setModeFilter] = useState<string>("standard");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("winrate");

  const filteredDecks = useMemo(() => {
    let result = DECKS;

    if (classFilter !== "ALL") {
      result = result.filter(d => d.cardClass === classFilter);
    }
    if (modeFilter !== "ALL") {
      result = result.filter(d => d.format === modeFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        (d.nameZh && d.nameZh.includes(q)) ||
        d.archetype.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "winrate":
        return [...result].sort((a, b) => (b.winRate || 0) - (a.winRate || 0));
      case "games":
        return [...result].sort((a, b) => (b.gamesPlayed || 0) - (a.gamesPlayed || 0));
      case "tier":
        return [...result].sort((a, b) => (a.tier || 99) - (b.tier || 99));
      case "dust":
        return [...result].sort((a, b) => (a.dustCost || 0) - (b.dustCost || 0));
      default:
        return result;
    }
  }, [classFilter, modeFilter, searchQuery, sortBy]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-280 px-8 text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-primary mb-2">炉石传说 · 卡组社区</p>
          <h2 className="font-heading text-[clamp(28px,3.5vw,44px)] leading-tight tracking-tight mb-2">卡组浏览</h2>
          <p className="text-muted-foreground text-lg max-w-[60ch] mx-auto">
            共 <span className="font-mono tabular-nums">{filteredDecks.length}</span> 套卡组，标准模式天梯实时数据
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="mx-auto max-w-280 px-8 pb-8">
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
          {/* Row 1: Search + Mode */}
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="搜索卡组名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-40 px-4 py-2 rounded-full bg-background border-none font-sans text-sm text-foreground outline-none focus:bg-background/80 placeholder:text-muted-foreground transition-colors"
            />
            <div className="inline-flex bg-background rounded-full p-0.75">
              <button
                onClick={() => setModeFilter("standard")}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  modeFilter === "standard" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                标准
              </button>
              <button
                onClick={() => setModeFilter("wild")}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  modeFilter === "wild" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                狂野
              </button>
            </div>
          </div>

          {/* Row 2: Sort */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-muted-foreground min-w-10 shrink-0">排序</span>
            {[
              { key: "winrate", label: "胜率" },
              { key: "games", label: "场次" },
              { key: "tier", label: "梯队" },
              { key: "dust", label: "尘造价" },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => setSortBy(s.key)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-sm font-medium transition-all",
                  sortBy === s.key ? "bg-foreground text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Row 3: Class Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-muted-foreground min-w-10 shrink-0">职业</span>
            <button
              onClick={() => setClassFilter("ALL")}
              className={cn(
                "w-8.5 h-8.5 rounded-full border-2 grid place-items-center text-sm font-semibold transition-all shrink-0",
                classFilter === "ALL"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-foreground"
              )}
            >
              全
            </button>
            {HS_CLASSES.map(cls => (
              <button
                key={cls.id}
                onClick={() => setClassFilter(classFilter === cls.id ? "ALL" : cls.id)}
                className={cn(
                  "w-8.5 h-8.5 rounded-full border-2 grid place-items-center text-sm font-semibold transition-all shrink-0",
                  classFilter === cls.id
                    ? "border-(--cls-color) bg-(--cls-color) text-white"
                    : "border-border text-muted-foreground hover:border-(--cls-color) hover:text-(--cls-color)"
                )}
                style={{ "--cls-color": cls.color === "#ffffff" ? "#D4CFC0" : cls.color } as React.CSSProperties}
                title={cls.nameZh}
              >
                {CLASS_LETTERS[cls.id] || "?"}
              </button>
            ))}
          </div>

          {/* Active Filter Tags */}
          <div className="flex gap-2 flex-wrap">
            {classFilter !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground/5 text-sm font-medium">
                {HS_CLASSES.find(c => c.id === classFilter)?.nameZh}
                <button onClick={() => setClassFilter("ALL")} className="w-3.5 h-3.5 rounded-full bg-foreground/10 text-muted-foreground text-[10px] grid place-items-center hover:bg-primary hover:text-white transition-all">×</button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground/5 text-sm font-medium">
                搜索: {searchQuery}
                <button onClick={() => setSearchQuery("")} className="w-3.5 h-3.5 rounded-full bg-foreground/10 text-muted-foreground text-[10px] grid place-items-center hover:bg-primary hover:text-white transition-all">×</button>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Deck Grid */}
      <section className="mx-auto max-w-280 px-8 pb-16">
        {filteredDecks.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            {filteredDecks.map(deck => {
              const color = CLASS_COLORS[deck.cardClass] || "#888";
              const repCardId = getRepresentativeCardId(deck.cards.map(c => c.cardId));
              const artUrl = repCardId ? getCardArtUrl(repCardId) : undefined;
              return (
                <Link key={deck.id} href={`/decks/${deck.id}`} className="block mb-5 group">
                  <div className="bg-card rounded-xl overflow-hidden break-inside-avoid transition-all duration-150 group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                    <div
                      className="aspect-16/10 grid place-items-center relative overflow-hidden"
                      style={{
                        background: artUrl
                          ? `url('${artUrl}') center/cover no-repeat`
                          : getClassGradient(color),
                      }}
                    >
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
                      <div
                        className="relative z-10 w-10 h-10 rounded-full grid place-items-center text-lg font-bold text-white/90 backdrop-blur-sm"
                        style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                      >
                        {CLASS_LETTERS[deck.cardClass] || "?"}
                      </div>
                      <span className="absolute top-2 right-2 z-10 text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-sm">
                        {deck.format === "standard" ? "标准" : "狂野"}
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="font-semibold text-[15px] mb-1">{deck.nameZh || deck.name}</div>
                      <div className="text-[13px] text-muted-foreground flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span>{HS_CLASSES.find(c => c.id === deck.cardClass)?.nameZh || deck.cardClass}</span>
                        <span>·</span>
                        {deck.tier && (
                          <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            T{deck.tier}
                          </span>
                        )}
                        <span>·</span>
                        {deck.winRate && <span className="font-mono tabular-nums">{deck.winRate}%</span>}
                      </div>
                      {deck.winRate && (
                        <div className="h-1 rounded bg-border mt-2 overflow-hidden">
                          <div className="h-full rounded bg-primary transition-all duration-400" style={{ width: `${deck.winRate}%` }} />
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-2 font-mono text-xs text-muted-foreground">
                        {deck.gamesPlayed && <span>{(deck.gamesPlayed / 1000).toFixed(1)}k 场</span>}
                        {deck.dustCost && <span>{deck.dustCost.toLocaleString()} 尘</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg mb-2">没有找到匹配的卡组</p>
            <p className="text-sm">尝试调整筛选条件或搜索关键词</p>
          </div>
        )}
      </section>
    </div>
  );
}
