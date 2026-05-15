import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Zap } from "lucide-react";
import { Deck } from "@/types";
import { getClassInfo, getClassColor } from "@/data/classes";

function TierBadge({ tier }: { tier?: number }) {
  if (!tier) return null;
  const colors: Record<number, string> = {
    1: "text-[oklch(0.48_0.150_45)] bg-[oklch(0.58_0.160_50)_/_12%] border-[oklch(0.48_0.150_45)_/_25%]",
    2: "text-[oklch(0.42_0.160_290)] bg-[oklch(0.48_0.170_290)_/_12%] border-[oklch(0.42_0.160_290)_/_25%]",
    3: "text-[oklch(0.42_0.130_250)] bg-[oklch(0.50_0.140_250)_/_12%] border-[oklch(0.42_0.130_250)_/_25%]",
  };
  return <Badge variant="outline" className={colors[tier] || colors[3]}>T{tier}</Badge>;
}

export function DeckCard({ deck, featured }: { deck: Deck; featured?: boolean }) {
  const classInfo = getClassInfo(deck.cardClass);
  const color = getClassColor(deck.cardClass);

  return (
    <Link href={`/decks/${deck.id}`}>
      <div className="group relative rounded-lg bg-card border border-border/60 overflow-hidden transition-all duration-200 hover:border-border hover:shadow-sm active:scale-[0.99]">
        {/* Top edge — class color accent */}
        <div className="h-0.5" style={{ backgroundColor: color }} />

        <div className={`p-3 ${featured ? "flex items-center gap-5" : ""}`}>
          {featured && (
            <div
              className="hidden sm:flex items-center justify-center w-14 h-14 rounded-lg shrink-0 text-2xl"
              style={{ backgroundColor: `${color}12` }}
            >
              {classInfo.icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  {!featured && <span className="text-sm">{classInfo.icon}</span>}
                  <h3 className={`font-medium truncate ${featured ? "text-sm" : "text-xs"}`}>
                    {deck.nameZh || deck.name}
                  </h3>
                  <span className="text-[10px] text-muted-foreground shrink-0" style={{ color }}>
                    {classInfo.nameZh}
                  </span>
                </div>
                {featured && deck.description && (
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{deck.description}</p>
                )}
              </div>
              <TierBadge tier={deck.tier} />
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Zap className="h-3 w-3" />{deck.archetype}</span>
              {deck.winRate && (
                <span className="flex items-center gap-1 font-medium text-foreground tabular-nums">
                  <TrendingUp className="h-3 w-3" />{deck.winRate}%
                </span>
              )}
              {deck.gamesPlayed && (
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{(deck.gamesPlayed / 1000).toFixed(1)}k</span>
              )}
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {deck.format === "standard" ? "标准" : "狂野"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
