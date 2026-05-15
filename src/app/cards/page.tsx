"use client";

// Note: metadata export is not supported in client components
// SEO is handled by the parent layout and individual card detail pages
import Link from "next/link";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_CARDS, type RealCard } from "@/data/real-cards";
import { HS_CLASSES, CLASS_COLORS } from "@/data/classes";
import { Search, LayoutGrid, List, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const RARITIES = [
  { value: "ALL", label: "全部" },
  { value: "FREE", label: "基础", color: "#9ca3af" },
  { value: "COMMON", label: "普通", color: "#d1d5db" },
  { value: "RARE", label: "稀有", color: "#60a5fa" },
  { value: "EPIC", label: "史诗", color: "#c084fc" },
  { value: "LEGENDARY", label: "传说", color: "#fb923c" },
];
const TYPES = [
  { value: "ALL", label: "全部" },
  { value: "MINION", label: "随从", icon: "👤" },
  { value: "SPELL", label: "法术", icon: "📜" },
  { value: "WEAPON", label: "武器", icon: "⚔️" },
  { value: "LOCATION", label: "地标", icon: "📍" },
  { value: "HERO", label: "英雄", icon: "🦸" },
];

const RARITY_TEXT_COLORS: Record<string, string> = {
  FREE: "text-gray-400", COMMON: "text-gray-300", RARE: "text-blue-400",
  EPIC: "text-purple-400", LEGENDARY: "text-orange-400",
};

const ALL_CLASSES = [
  ...HS_CLASSES.map(c => ({ id: c.id, nameZh: c.nameZh, icon: c.icon, color: c.color })),
  { id: "NEUTRAL", nameZh: "中立", icon: "🎯", color: "#888888" },
];

export default function CardsPage() {
  const [classFilter, setClassFilter] = useState("ALL");
  const [rarityFilter, setRarityFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [costFilter, setCostFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredCards = useMemo(() => {
    let result = ALL_CARDS;
    if (classFilter !== "ALL") result = result.filter(c => c.cardClass === classFilter);
    if (rarityFilter !== "ALL") result = result.filter(c => c.rarity === rarityFilter);
    if (typeFilter !== "ALL") result = result.filter(c => c.type === typeFilter);
    if (costFilter !== "ALL") {
      const cost = parseInt(costFilter);
      if (cost === 7) result = result.filter(c => c.cost >= 7);
      else result = result.filter(c => c.cost === cost);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) || c.nameZh.includes(q) ||
        c.text.toLowerCase().includes(q) || c.textZh.includes(q)
      );
    }
    return result.slice(0, 200);
  }, [classFilter, rarityFilter, typeFilter, costFilter, searchQuery]);

  const activeClassColor = classFilter !== "ALL" ? (CLASS_COLORS[classFilter] || "#888") : "#fb923c";

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Left sidebar - Class filter */}
      <aside className="hidden lg:flex flex-col w-16 border-r border-border/40 py-4 items-center gap-1 sticky top-12 h-[calc(100vh-3rem)] bg-secondary/40">
        <button
          onClick={() => setClassFilter("ALL")}
          className={cn(
            "flex flex-col items-center justify-center w-12 h-12 rounded-lg text-xs transition-all",
            classFilter === "ALL"
              ? "bg-primary/20 text-primary ring-1 ring-primary/40"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <span className="text-lg">🎴</span>
          <span className="text-[9px] mt-0.5">全部</span>
        </button>
        <div className="w-8 h-px bg-border/40 my-1" />
        {ALL_CLASSES.map(cls => (
          <button
            key={cls.id}
            onClick={() => setClassFilter(classFilter === cls.id ? "ALL" : cls.id)}
            className={cn(
              "flex flex-col items-center justify-center w-12 h-12 rounded-lg text-xs transition-all",
              classFilter === cls.id
                ? "ring-1"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
            style={classFilter === cls.id ? {
              backgroundColor: `${cls.color}20`,
              color: cls.color,
              borderColor: `${cls.color}60`,
              "--tw-ring-color": `${cls.color}60`,
            } as React.CSSProperties : undefined}
            title={cls.nameZh}
          >
            <span className="text-lg">{cls.icon}</span>
            <span className="text-[9px] mt-0.5 truncate w-full text-center">{cls.nameZh.length > 2 ? cls.nameZh.slice(0, 2) : cls.nameZh}</span>
          </button>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Header with search */}
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h1 className="text-xl font-bold">卡牌浏览</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {ALL_CARDS.length} 张卡牌 · 显示 {filteredCards.length} 张
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-56">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="搜索卡牌名称或描述..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
              <div className="flex items-center border border-border/50 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn("p-1.5 transition-colors", viewMode === "grid" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn("p-1.5 transition-colors", viewMode === "list" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-5 p-3 rounded-lg bg-card/50 border border-border/30">
            {/* Cost gems */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground mr-1 font-medium">费用</span>
              {["ALL","0","1","2","3","4","5","6","7+"].map(c => (
                <button
                  key={c}
                  onClick={() => setCostFilter(c)}
                  className={cn(
                    "flex items-center justify-center rounded-md text-[11px] font-bold transition-all h-7 min-w-[28px]",
                    costFilter === c
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                      : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {c === "ALL" ? "全" : c}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-border/40" />

            {/* Rarity pills */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground mr-1 font-medium">品质</span>
              {RARITIES.map(r => (
                <button
                  key={r.value}
                  onClick={() => setRarityFilter(r.value)}
                  className={cn(
                    "px-2 py-1 rounded-md text-[11px] font-medium transition-all",
                    rarityFilter === r.value
                      ? "text-white shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                  style={rarityFilter === r.value ? {
                    backgroundColor: r.color || "#666",
                    boxShadow: `0 1px 3px ${r.color || "#666"}40`,
                  } : undefined}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-border/40" />

            {/* Type buttons */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground mr-1 font-medium">类型</span>
              {TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setTypeFilter(t.value)}
                  className={cn(
                    "px-2 py-1 rounded-md text-[11px] font-medium transition-all",
                    typeFilter === t.value
                      ? "bg-accent text-foreground"
                      : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {t.icon && `${t.icon} `}{t.label}
                </button>
              ))}
            </div>

            {/* Mobile class selector */}
            <div className="lg:hidden">
              <Select value={classFilter} onValueChange={(v) => v !== null && setClassFilter(v)}>
                <SelectTrigger className="w-[100px] h-7 text-xs">
                  <SelectValue placeholder="职业" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部职业</SelectItem>
                  {ALL_CLASSES.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.icon} {cls.nameZh}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Card Grid */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
              {filteredCards.map(card => {
                const cardColor = CLASS_COLORS[card.cardClass] || "#888";
                return (
                  <Link key={card.id} href={`/cards/${card.id}`} className="group">
                    <div className="relative overflow-hidden rounded-lg border border-border/30 bg-card/40 transition-all duration-200 hover:border-primary/30 hover:-translate-y-1 hover:shadow-xl">
                      {/* Card image as background */}
                      <div
                        className="relative aspect-3/4 overflow-hidden bg-muted/30"
                        style={{
                          backgroundImage: `url(https://art.hearthstonejson.com/v1/256x/${card.id}.jpg)`,
                          backgroundSize: "auto",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        {/* Cost gem overlay */}
                        <div
                          className="absolute top-1.5 left-1.5 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white shadow-md"
                          style={{ backgroundColor: cardColor }}
                        >
                          {card.cost}
                        </div>
                        {/* Hover info overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2">
                          <p className="text-xs text-white font-semibold truncate">{card.nameZh}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {card.attack != null && (
                              <span className="text-[10px] text-yellow-300">⚔{card.attack}</span>
                            )}
                            {card.health != null && (
                              <span className="text-[10px] text-red-300">❤{card.health}</span>
                            )}
                            <span className={cn("text-[10px]", RARITY_TEXT_COLORS[card.rarity])}>
                              {card.rarity === "LEGENDARY" && "★"}
                            </span>
                          </div>
                          {card.textZh && (
                            <p className="text-[10px] text-white/70 line-clamp-2 mt-0.5 leading-tight">
                              {card.textZh.replace(/\$|\n/g, " ")}
                            </p>
                          )}
                        </div>
                        {/* Rarity bottom border accent */}
                        <div
                          className="absolute bottom-0 inset-x-0 h-0.5 opacity-60"
                          style={{
                            backgroundColor: card.rarity === "LEGENDARY" ? "#fb923c"
                              : card.rarity === "EPIC" ? "#c084fc"
                              : card.rarity === "RARE" ? "#60a5fa"
                              : "transparent",
                          }}
                        />
                      </div>
                      {/* Card name below image */}
                      <div className="px-1.5 py-1.5">
                        <p className={cn("text-[11px] font-medium truncate", RARITY_TEXT_COLORS[card.rarity])}>
                          {card.rarity === "LEGENDARY" && "★ "}{card.nameZh}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* List view */
            <div className="space-y-1">
              {filteredCards.map(card => {
                const cardColor = CLASS_COLORS[card.cardClass] || "#888";
                return (
                  <Link key={card.id} href={`/cards/${card.id}`}>
                    <div className="group flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-accent/50 hover:shadow-sm">
                      {/* Cost gem */}
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold text-white shrink-0"
                        style={{ backgroundColor: cardColor }}
                      >
                        {card.cost}
                      </div>
                      {/* Card thumbnail */}
                      <div
                        className="w-10 h-14 rounded overflow-hidden shrink-0 bg-muted/30"
                        style={{
                          backgroundImage: `url(https://art.hearthstonejson.com/v1/256x/${card.id}.jpg)`,
                          backgroundSize: "auto",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                      {/* Card info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-sm font-semibold", RARITY_TEXT_COLORS[card.rarity])}>
                            {card.nameZh}
                          </span>
                          {card.rarity === "LEGENDARY" && <span className="text-orange-400 text-xs">★</span>}
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                            {card.cardClass === "NEUTRAL" ? "中立" : HS_CLASSES.find(c => c.id === card.cardClass)?.nameZh || card.cardClass}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {card.textZh?.replace(/\$|\n/g, " ")}
                        </p>
                      </div>
                      {/* Stats */}
                      <div className="flex items-center gap-3 text-xs shrink-0">
                        {card.attack != null && (
                          <div className="flex items-center gap-1 text-yellow-400">
                            <span>⚔</span><span className="font-bold">{card.attack}</span>
                          </div>
                        )}
                        {card.health != null && (
                          <div className="flex items-center gap-1 text-red-400">
                            <span>❤</span><span className="font-bold">{card.health}</span>
                          </div>
                        )}
                        {card.durability != null && (
                          <div className="flex items-center gap-1 text-blue-400">
                            <span>🛡</span><span className="font-bold">{card.durability}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {filteredCards.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-sm">没有找到匹配的卡牌</p>
              <p className="text-xs mt-1">尝试调整筛选条件</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
