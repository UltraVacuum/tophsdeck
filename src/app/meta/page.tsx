import type { Metadata } from "next";
import { PAGE_SEO } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TavernDivider } from "@/components/ui/tavern-divider";
import Link from "next/link";
import { DECKS } from "@/data/decks";
import { getClassInfo, getClassColor } from "@/data/classes";
import { CardClass } from "@/types";
import { TrendingUp, Trophy, BarChart3, Users } from "lucide-react";

const TIER_COLORS: Record<number, { bg: string; text: string; border: string; label: string }> = {
  1: { bg: "bg-[oklch(0.58_0.160_50)_/_12%]", text: "text-[oklch(0.48_0.150_45)]", border: "border-[oklch(0.48_0.150_45)_/_25%]", label: "Tier S" },
  2: { bg: "bg-[oklch(0.48_0.170_290)_/_12%]", text: "text-[oklch(0.42_0.160_290)]", border: "border-[oklch(0.42_0.160_290)_/_25%]", label: "Tier A" },
  3: { bg: "bg-[oklch(0.50_0.140_250)_/_12%]", text: "text-[oklch(0.42_0.130_250)]", border: "border-[oklch(0.42_0.130_250)_/_25%]", label: "Tier B" },
  4: { bg: "bg-[oklch(0.55_0.140_340)_/_12%]", text: "text-[oklch(0.45_0.130_340)]", border: "border-[oklch(0.45_0.130_340)_/_25%]", label: "Tier C" },
};

export const metadata: Metadata = PAGE_SEO.meta;
export default function MetaPage() {
  const sortedDecks = [...DECKS].sort((a, b) => (b.winRate || 0) - (a.winRate || 0));
  const totalGames = DECKS.reduce((sum, d) => sum + (d.gamesPlayed || 0), 0);
  const avgWinRate = sortedDecks.length > 0
    ? sortedDecks.reduce((sum, d) => sum + (d.winRate || 0), 0) / sortedDecks.length
    : 0;

  const tierGroups = new Map<number, typeof sortedDecks>();
  for (const deck of sortedDecks) {
    const tier = deck.tier || 4;
    if (!tierGroups.has(tier)) tierGroups.set(tier, []);
    tierGroups.get(tier)!.push(deck);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold mb-1">环境分析</h1>
        <p className="text-sm text-muted-foreground">
          基于大量对局数据的卡组梯队排行和胜率统计
        </p>
      </div>

      {/* Overview Stats — gold top border */}
      <div className="grid grid-cols-2 gap-4 mb-10 sm:grid-cols-4">
        <div className="rounded-lg border border-border/30 bg-card/30 pt-4 pb-4 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30" />
          <Trophy className="h-5 w-5 mx-auto mb-1 text-primary/70" />
          <div className="text-2xl font-bold">{sortedDecks.length}</div>
          <div className="text-xs text-muted-foreground">收录卡组</div>
        </div>
        <div className="rounded-lg border border-border/30 bg-card/30 pt-4 pb-4 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30" />
          <BarChart3 className="h-5 w-5 mx-auto mb-1 text-primary/70" />
          <div className="text-2xl font-bold">{avgWinRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">平均胜率</div>
        </div>
        <div className="rounded-lg border border-border/30 bg-card/30 pt-4 pb-4 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30" />
          <Users className="h-5 w-5 mx-auto mb-1 text-primary/70" />
          <div className="text-2xl font-bold">{(totalGames / 1000).toFixed(0)}k</div>
          <div className="text-xs text-muted-foreground">总对局数</div>
        </div>
        <div className="rounded-lg border border-border/30 bg-card/30 pt-4 pb-4 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30" />
          <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary/70" />
          <div className="text-2xl font-bold">{sortedDecks[0]?.winRate?.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">最高胜率</div>
        </div>
      </div>

      {/* Tier List */}
      {[1, 2, 3, 4].map((tier) => {
        const decks = tierGroups.get(tier);
        if (!decks || decks.length === 0) return null;
        const tierStyle = TIER_COLORS[tier];

        return (
          <div key={tier} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge
                variant="outline"
                className={`${tierStyle.bg} ${tierStyle.text} ${tierStyle.border} px-3 py-1 text-sm font-semibold`}
              >
                {tierStyle.label}
              </Badge>
              <div className="flex-1 h-px bg-border/30" />
            </div>
            <div className="space-y-2">
              {decks.map((deck) => {
                const classInfo = getClassInfo(deck.cardClass);
                const color = getClassColor(deck.cardClass);
                return (
                  <Link key={deck.id} href={`/decks/${deck.id}`}>
                    <div className="flex items-center gap-4 py-3 px-4 rounded-lg border border-border/20 bg-card/20 hover:bg-accent/30 transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-xl">{classInfo.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">
                              {deck.nameZh || deck.name}
                            </span>
                            <Badge variant="secondary" className="text-[11px] shrink-0">
                              {deck.format === "standard" ? "标准" : "狂野"}
                            </Badge>
                            <Badge variant="outline" className="text-[11px] shrink-0">
                              {deck.archetype}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Win Rate Bar — wider, with gradient + texture */}
                      <div className="hidden sm:flex items-center gap-2 shrink-0">
                        <div className="w-32 h-4 rounded bg-muted/40 overflow-hidden">
                          <div
                            className="h-full rounded transition-all relative animate-tier-grow"
                            style={{
                              width: `${((deck.winRate || 0) / 60) * 100}%`,
                              background: `linear-gradient(to right, ${color}60, ${color})`,
                            }}
                          >
                            <div className="absolute inset-0 opacity-15"
                              style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.15) 4px, rgba(0,0,0,0.15) 6px)' }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium w-14 text-right">
                          {deck.winRate?.toFixed(1)}%
                        </span>
                      </div>

                      <span className="text-xs text-muted-foreground shrink-0 w-16 text-right">
                        {deck.gamesPlayed ? `${(deck.gamesPlayed / 1000).toFixed(1)}k` : "—"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Class Distribution — horizontal bars */}
      <TavernDivider />
      <div className="mt-6">
        <h2 className="font-heading text-lg font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          职业分布
        </h2>
        <div className="space-y-3">
          {(() => {
            const classCount = new Map<string, number>();
            for (const deck of DECKS) {
              classCount.set(deck.cardClass, (classCount.get(deck.cardClass) || 0) + 1);
            }
            const maxCount = Math.max(...classCount.values());
            return [...classCount.entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([classId, count]) => {
                const info = getClassInfo(classId as CardClass);
                const color = getClassColor(classId as CardClass);
                return (
                  <div key={classId} className="flex items-center gap-3">
                    <span className="text-lg w-6 text-center">{info.icon}</span>
                    <span className="text-sm font-medium w-20">{info.nameZh}</span>
                    <div className="flex-1 h-6 rounded bg-muted/30 overflow-hidden">
                      <div
                        className="h-full rounded transition-all relative"
                        style={{
                          width: `${(count / maxCount) * 100}%`,
                          background: `linear-gradient(to right, ${color}50, ${color}80)`,
                          minWidth: "8px",
                        }}
                      >
                        <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-bold text-white/90">
                          {count}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              });
          })()}
        </div>
      </div>
    </div>
  );
}
