import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDeckById, DECKS } from "@/data/decks";
import { generateDeckMetadata } from "@/lib/seo";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DeckCodeCopy } from "@/components/decks/deck-code-copy";
import { FavoriteButton } from "@/components/decks/favorite-button";

import { ALL_CARDS, type RealCard } from "@/data/real-cards";
import { HS_CLASSES, CLASS_COLORS, CLASS_ZH } from "@/data/classes";
import { DeckCardEntry } from "@/types";
import { CardImage } from "@/components/cards/card-image";
import {
  ArrowLeft, TrendingUp, Users, Zap, Gem, Gauge, Gamepad2,
  BookOpen, Swords, Target, Lightbulb, Coins, ChevronRight,
  Shield, Flame,
} from "lucide-react";

const TIER_STYLES: Record<number, string> = {
  1: "text-[oklch(0.48_0.150_45)] bg-[oklch(0.58_0.160_50)_/_12%] border-[oklch(0.48_0.150_45)_/_25%]",
  2: "text-[oklch(0.42_0.160_290)] bg-[oklch(0.48_0.170_290)_/_12%] border-[oklch(0.42_0.160_290)_/_25%]",
  3: "text-[oklch(0.42_0.130_250)] bg-[oklch(0.50_0.140_250)_/_12%] border-[oklch(0.42_0.130_250)_/_25%]",
};

function getCard(id: string): RealCard | undefined {
  return ALL_CARDS.find(c => c.id === id);
}

function groupCardsByCost(entries: DeckCardEntry[]) {
  const groups = new Map<number, { card: RealCard; quantity: number }[]>();
  for (const entry of entries) {
    const card = getCard(entry.cardId);
    if (!card) continue;
    const cost = card.cost;
    if (!groups.has(cost)) groups.set(cost, []);
    groups.get(cost)!.push({ card, quantity: entry.quantity });
  }
  for (const [, cards] of groups) cards.sort((a, b) => a.card.name.localeCompare(b.card.name));
  return groups;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const deck = getDeckById(id);
  if (!deck) return {};
  return generateDeckMetadata({
    nameZh: deck.nameZh || deck.name, cardClass: deck.cardClass,
    archetype: deck.archetype, format: deck.format,
    winRate: deck.winRate, tier: deck.tier, id: deck.id,
  });
}

export function generateStaticParams() {
  return DECKS.map(d => ({ id: d.id }));
}

export default async function DeckDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deck = getDeckById(id);
  if (!deck) notFound();

  const classInfo = HS_CLASSES.find(c => c.id === deck.cardClass) || { nameZh: "中立", icon: "🎯" };
  const classColor = CLASS_COLORS[deck.cardClass] || "#888";
  const grouped = groupCardsByCost(deck.cards);
  const totalCards = deck.cards.reduce((s, e) => s + e.quantity, 0);
  const sortedCosts = [...grouped.keys()].sort((a, b) => a - b);

  const manaCurve = sortedCosts.map(cost => ({
    cost, count: grouped.get(cost)!.reduce((s, e) => s + e.quantity, 0),
  }));
  const maxCount = Math.max(...manaCurve.map(m => m.count));
  const guide = deck.guide;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/decks" className="hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> 卡组列表
        </Link>
        <span>/</span>
        <span className="text-foreground">{deck.nameZh || deck.name}</span>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-xl overflow-hidden mb-8"
        style={{ background: `linear-gradient(135deg, ${classColor}22, ${classColor}08, transparent)` }}>
        <div className="absolute inset-0 border border-border/50 rounded-xl" />
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row gap-6">
          {/* Left: Title + Stats */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{classInfo.icon}</span>
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold">{deck.nameZh || deck.name}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {deck.archetype} · {deck.format === "standard" ? "标准模式" : "狂野模式"}
                </p>
              </div>
              {deck.tier && (
                <Badge variant="outline" className={
                  TIER_STYLES[deck.tier] || TIER_STYLES[3]
                }>Tier {deck.tier}</Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm max-w-xl mb-4">{deck.description}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {deck.winRate && (
                <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <TrendingUp className="h-3 w-3" /> 胜率
                  </div>
                  <div className="text-lg font-bold" style={{ color: deck.winRate >= 54 ? "#34d399" : deck.winRate >= 50 ? "#60a5fa" : "#fbbf24" }}>
                    {deck.winRate}%
                  </div>
                </div>
              )}
              {deck.gamesPlayed && (
                <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Users className="h-3 w-3" /> 对战场次
                  </div>
                  <div className="text-lg font-bold">{deck.gamesPlayed.toLocaleString()}</div>
                </div>
              )}
              {deck.dustCost && (
                <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Gem className="h-3 w-3" /> 合成粉尘
                  </div>
                  <div className="text-lg font-bold">{deck.dustCost.toLocaleString()}</div>
                </div>
              )}
              {deck.difficulty && (
                <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Gauge className="h-3 w-3" /> 操作难度
                  </div>
                  <div className="text-lg font-bold">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < deck.difficulty! ? "text-yellow-400" : "text-gray-600"}>★</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <DeckCodeCopy code={deck.deckCode} name={deck.nameZh || deck.name} />
              <FavoriteButton deckId={deck.id} deckName={deck.nameZh || deck.name} />
            </div>
          </div>

          {/* Right: Mana Curve */}
          <Card className="w-full md:w-56 border-border/30 bg-background/50 shrink-0">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" /> 法力曲线
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-end gap-0.5 h-24">
                {manaCurve.map(({ cost, count }) => (
                  <div key={cost} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[9px] text-muted-foreground">{count}</div>
                    <div className="w-full rounded-t-sm transition-all" style={{
                      height: `${(count / maxCount) * 100}%`,
                      backgroundColor: classColor,
                      opacity: 0.5 + (count / maxCount) * 0.5,
                      minHeight: "4px",
                    }} />
                    <span className="text-[9px] text-muted-foreground">{cost}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tags */}
      {deck.tags && deck.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {deck.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      )}

      {/* Main Content: 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Guide Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Strategy Section */}
          {guide && (
            <>
              {/* Strategy */}
              <Card className="border-border/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-400" /> 核心策略
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{guide.strategy}</p>
                </CardContent>
              </Card>

              {/* Key Decisions */}
              {guide.keyDecisions.length > 0 && (
                <Card className="border-border/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-400" /> 关键决策点
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {guide.keyDecisions.map((decision, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <span className="text-muted-foreground leading-relaxed">{decision}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Matchups */}
              {guide.matchups.length > 0 && (
                <Card className="border-border/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Swords className="h-4 w-4 text-red-400" /> 对阵攻略
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {guide.matchups.map((mu, i) => (
                        <div key={i} className="flex gap-4 items-start p-3 rounded-lg bg-background/50 border border-border/20">
                          <div className="shrink-0 text-center">
                            <span className="text-2xl">{HS_CLASSES.find(c => c.id === mu.opponent)?.icon || "🎮"}</span>
                            <div className="text-xs text-muted-foreground mt-0.5">{mu.opponentZh}</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-sm font-bold ${mu.winRate >= 55 ? "text-emerald-400" : mu.winRate >= 50 ? "text-blue-400" : "text-red-400"}`}>
                                {mu.winRate}%
                              </span>
                              <div className="flex gap-0.5">
                                {Array.from({ length: 5 }, (_, j) => (
                                  <span key={j} className={`text-xs ${j < mu.difficulty ? "text-yellow-400" : "text-gray-600"}`}>★</span>
                                ))}
                              </div>
                              <Badge variant="outline" className={`text-[10px] ${
                                mu.winRate >= 55 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : mu.winRate >= 48 ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                              }`}>
                                {mu.winRate >= 55 ? "优势" : mu.winRate >= 48 ? "均势" : "劣势"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{mu.tips}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Substitutions */}
              {guide.substitutions.length > 0 && (
                <Card className="border-border/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Coins className="h-4 w-4 text-green-400" /> 替换建议
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {guide.budgetNote && (
                      <div className="text-xs text-muted-foreground mb-4 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                        💰 {guide.budgetNote}
                      </div>
                    )}
                    <div className="space-y-3">
                      {guide.substitutions.map((sub, i) => {
                        const origCard = getCard(sub.cardId);
                        const replCard = getCard(sub.replacement);
                        return (
                          <div key={i} className="flex items-center gap-3 text-sm p-3 rounded-lg bg-background/50 border border-border/20">
                            <span className="text-red-400 text-xs">移除</span>
                            <span className="font-medium truncate max-w-30">
                              {origCard?.nameZh || sub.cardId}
                            </span>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-emerald-400 text-xs">加入</span>
                            <span className="font-medium truncate max-w-30">
                              {replCard?.nameZh || sub.replacement}
                            </span>
                            {sub.dustSaved && (
                              <Badge variant="secondary" className="text-[10px] shrink-0">
                                省 {sub.dustSaved} 尘
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground ml-auto hidden md:block">{sub.reason}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Card List */}
          <Card className="border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" /> 卡牌列表 ({totalCards})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedCosts.map(cost => (
                <div key={cost} className="mb-4">
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    {cost} 费 ({grouped.get(cost)!.reduce((s, e) => s + e.quantity, 0)} 张)
                  </div>
                  <div className="space-y-1">
                    {grouped.get(cost)!.map(({ card, quantity }) => (
                      <Link key={card.id} href={`/cards/${card.id}`}>
                        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent/50 transition-colors group">
                          <div className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-white"
                            style={{ backgroundColor: classColor }}>{card.cost}</div>
                          <CardImage
                            cardId={card.id}
                            nameZh={card.nameZh}
                            rarity={card.rarity}
                            cardClass={card.cardClass}
                            size="tile"
                            className="opacity-60 group-hover:opacity-100 transition-opacity"
                          />
                          <span className="flex-1 truncate">{card.nameZh}</span>
                          <span className="text-xs text-muted-foreground">
                            {card.attack != null ? `${card.attack}/${card.health}` : card.type}
                          </span>
                          <Badge variant="outline" className="text-[10px]"
                            style={card.cardClass !== "NEUTRAL"
                              ? { color: classColor, borderColor: `${classColor}44` }
                              : { color: "#888" }}>
                            {card.cardClass === "NEUTRAL" ? "中立" : classInfo.nameZh}
                          </Badge>
                          {quantity === 2 && <Badge variant="secondary" className="text-[10px]">×2</Badge>}
                          {card.rarity === "LEGENDARY" && <span className="text-orange-400 text-xs">★</span>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Mulligan Guide */}
          {guide?.mulligan && (
            <Card className="border-border/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-orange-400" /> 留牌指南
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {guide.mulligan.always.length > 0 && (
                  <div>
                    <div className="text-[10px] font-medium text-emerald-400 mb-1.5">✅ 必留</div>
                    {guide.mulligan.always.map(cardId => {
                      const c = getCard(cardId);
                      return c ? (
                        <Link key={cardId} href={`/cards/${cardId}`}
                          className="flex items-center gap-1.5 text-xs py-1 hover:text-foreground transition-colors text-muted-foreground">
                          <span className="font-bold text-emerald-400">{c.cost}</span>
                          {c.nameZh}
                        </Link>
                      ) : null;
                    })}
                  </div>
                )}
                {guide.mulligan.situational.length > 0 && (
                  <div>
                    <div className="text-[10px] font-medium text-yellow-400 mb-1.5">⚠️ 视情况</div>
                    {guide.mulligan.situational.map((s, i) => {
                      const c = getCard(s.cardId);
                      return c ? (
                        <div key={i} className="mb-1.5">
                          <Link href={`/cards/${s.cardId}`}
                            className="flex items-center gap-1.5 text-xs py-0.5 hover:text-foreground transition-colors text-muted-foreground">
                            <span className="font-bold text-yellow-400">{c.cost}</span>
                            {c.nameZh}
                          </Link>
                          <p className="text-[10px] text-muted-foreground/60 ml-4">{s.reason}</p>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
                {guide.mulligan.never.length > 0 && (
                  <div>
                    <div className="text-[10px] font-medium text-red-400 mb-1.5">❌ 必换</div>
                    {guide.mulligan.never.map(cardId => {
                      const c = getCard(cardId);
                      return c ? (
                        <Link key={cardId} href={`/cards/${cardId}`}
                          className="flex items-center gap-1.5 text-xs py-1 hover:text-foreground transition-colors text-muted-foreground/60">
                          <span className="font-bold text-red-400">{c.cost}</span>
                          <span className="line-through">{c.nameZh}</span>
                        </Link>
                      ) : null;
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Related Decks */}
          <Card className="border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-orange-400" /> 同职业卡组
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {DECKS.filter(d => d.cardClass === deck.cardClass && d.id !== deck.id)
                .slice(0, 4)
                .map(d => (
                  <Link key={d.id} href={`/decks/${d.id}`}
                    className="flex items-center gap-2 text-xs py-1.5 px-2 rounded-md hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground">
                    <span>{d.nameZh || d.name}</span>
                    {d.winRate && <span className="ml-auto text-[10px]">{d.winRate}%</span>}
                    {d.tier && (
                      <Badge variant="outline" className={`text-[9px] px-1 py-0 ${
                        d.tier === 1 ? "bg-emerald-500/10 text-emerald-400"
                        : d.tier === 2 ? "bg-blue-500/10 text-blue-400"
                        : "bg-yellow-500/10 text-yellow-400"
                      }`}>T{d.tier}</Badge>
                    )}
                  </Link>
                ))}
            </CardContent>
          </Card>

          {/* Data Source */}
          <Card className="border-border/30">
            <CardContent className="p-4">
              <h3 className="text-xs font-medium mb-2">数据来源</h3>
              <div className="space-y-1 text-[10px] text-muted-foreground">
                <a href="https://hearthstonejson.com/" target="_blank" rel="noopener noreferrer" className="block hover:text-foreground transition-colors">→ HearthstoneJSON</a>
                <a href="https://hsreplay.net/" target="_blank" rel="noopener noreferrer" className="block hover:text-foreground transition-colors">→ HSReplay</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
