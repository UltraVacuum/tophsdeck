import type { Metadata } from "next";
import { PAGE_SEO } from "@/lib/seo";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeckCard } from "@/components/decks/deck-card";
import { HS_CLASSES } from "@/data/classes";
import { getTopDecks, DECKS } from "@/data/decks";
import { ALL_CARDS } from "@/data/real-cards";
import { SYNERGIES } from "@/data/synergies";
import { NEWS } from "@/data/news";
import { Swords, TrendingUp, ArrowRight, Flame, Shield, Zap, Sparkles, Newspaper, BookOpen, ChevronRight, BarChart3 } from "lucide-react";

export const metadata: Metadata = PAGE_SEO.home;

export default function HomePage() {
  const topDecks = getTopDecks(6);
  const totalCards = ALL_CARDS.length;
  const totalDecks = DECKS.length;
  const latestNews = NEWS.slice(0, 3);
  const featuredSynergies = SYNERGIES.slice(0, 3);
  const [featured, ...rest] = topDecks;

  // Compute meta stats for the hero
  const topWinRate = topDecks.length > 0 ? Math.max(...topDecks.map(d => d.winRate || 0)) : 0;
  const avgWinRate = topDecks.length > 0
    ? topDecks.reduce((s, d) => s + (d.winRate || 0), 0) / topDecks.length
    : 0;

  return (
    <div>
      {/* Hero — Data-forward, warm parchment */}
      <section className="relative border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          {/* Compact header row */}
          <div className="flex items-center gap-3 mb-6">
            <Swords className="h-5 w-5 text-primary" />
            <h1 className="font-heading text-xl md:text-2xl font-bold tracking-tight">
              TopHSDeck
            </h1>
            <Badge variant="outline" className="text-[11px] text-primary border-primary/20 bg-primary/5">
              环境快照
            </Badge>
          </div>

          {/* Meta stats row — the actual hero content */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-secondary/60 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">最高胜率</div>
              <div className="text-2xl font-semibold tabular-nums tracking-tight text-primary">
                {topWinRate > 0 ? `${topWinRate}%` : "N/A"}
              </div>
            </div>
            <div className="bg-secondary/60 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">头部均值</div>
              <div className="text-2xl font-semibold tabular-nums tracking-tight">
                {avgWinRate > 0 ? `${avgWinRate.toFixed(1)}%` : "N/A"}
              </div>
            </div>
            <div className="bg-secondary/60 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">精选卡组</div>
              <div className="text-2xl font-semibold tabular-nums tracking-tight">{totalDecks}</div>
            </div>
            <div className="bg-secondary/60 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">卡牌数据</div>
              <div className="text-2xl font-semibold tabular-nums tracking-tight">{totalCards.toLocaleString()}</div>
            </div>
          </div>

          {/* Quick nav row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/decks">
              <Button size="sm" className="gap-1.5">
                <Swords className="h-3.5 w-3.5" /> 浏览卡组
              </Button>
            </Link>
            <Link href="/meta">
              <Button variant="outline" size="sm" className="gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" /> 环境分析
              </Button>
            </Link>
            <Link href="/cards">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                卡牌数据库 <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">

        {/* Top Decks — Featured + Grid */}
        <section className="mb-12 mt-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              <h2 className="font-heading text-lg font-bold">热门卡组</h2>
              <span className="text-xs text-muted-foreground">胜率排序</span>
            </div>
            <Link href="/decks">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                查看全部 <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {featured && (
              <div className="lg:col-span-2">
                <DeckCard deck={featured} featured />
              </div>
            )}
            {rest.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        </section>

        {/* Class Grid — class color is the primary visual */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-lg font-bold">职业卡组</h2>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {HS_CLASSES.map((cls) => {
              const deckCount = DECKS.filter(d => d.cardClass === cls.id).length;
              return (
                <Link key={cls.id} href={`/classes/${cls.id}`}>
                  <div className="group flex flex-col items-center gap-1 rounded-lg p-3 bg-secondary/40 border border-border/30 transition-all duration-200 hover:border-border active:scale-[0.97]">
                    <span className="text-xl">{cls.icon}</span>
                    <span className="text-xs font-medium">{cls.nameZh}</span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {deckCount} 套
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Bottom sections — asymmetric 2-column */}
        <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Synergies — wider */}
          <div className="md:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="font-heading text-base font-bold">经典配合</h2>
              </div>
              <Link href="/synergies">
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
                  全部 <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              {featuredSynergies.map((syn) => (
                <div key={syn.id} className="rounded-lg p-3 bg-secondary/40 border border-border/20">
                  <h3 className="font-medium text-sm mb-1">{syn.nameZh}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{syn.description}</p>
                  <div className="flex items-center gap-1 flex-wrap">
                    {syn.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* News + Quick Links */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-primary" />
                <h2 className="font-heading text-base font-bold">最新资讯</h2>
              </div>
              <Link href="/news">
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
                  更多 <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            {latestNews.map((item) => {
              const catLabel = item.category === "patch" ? "补丁"
                : item.category === "event" ? "活动"
                : item.category === "esports" ? "电竞"
                : item.category === "expansion" ? "扩展" : "攻略";
              const srcLabel = item.source === "hearthstone" ? "官方"
                : item.source === "hearthstonetopdecks" ? "HSTD"
                : item.source === "reddit" ? "Reddit" : item.source;
              const inner = (
                <div className="rounded-lg p-3 bg-secondary/40 border border-border/20 hover:border-border transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/15">
                      {catLabel}
                    </Badge>
                    {srcLabel && (
                      <Badge variant="secondary" className="text-[9px]">{srcLabel}</Badge>
                    )}
                    <span className="text-[10px] text-muted-foreground">{item.date}</span>
                  </div>
                  <p className="text-sm font-medium leading-snug line-clamp-2">{item.title}</p>
                </div>
              );
              return item.link ? (
                <Link key={item.id} href={item.link} target="_blank" rel="noopener noreferrer">{inner}</Link>
              ) : (
                <div key={item.id}>{inner}</div>
              );
            })}

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link href="/decks?format=standard">
                <div className="rounded-lg p-3 bg-secondary/40 border border-border/20 text-center hover:border-border transition-colors">
                  <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/15 mb-1.5">标准</Badge>
                  <p className="text-xs font-medium">标准模式</p>
                </div>
              </Link>
              <Link href="/decks?format=wild">
                <div className="rounded-lg p-3 bg-secondary/40 border border-border/20 text-center hover:border-border transition-colors">
                  <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/15 mb-1.5">狂野</Badge>
                  <p className="text-xs font-medium">狂野模式</p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
