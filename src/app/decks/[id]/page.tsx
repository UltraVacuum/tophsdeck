import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDeckById, DECKS } from "@/data/decks";
import { generateDeckMetadata } from "@/lib/seo";
import Link from "next/link";
import { ALL_CARDS, type RealCard, getRepresentativeCardId, getCardArtUrl } from "@/data/real-cards";
import { HS_CLASSES, CLASS_COLORS } from "@/data/classes";
import { DeckCardEntry, Deck } from "@/types";
import { DeckCodeCopy } from "@/components/decks/deck-code-copy";
import { CopyDeckCodeClient } from "@/components/decks/copy-deck-code-client";

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

const CLASS_LETTERS: Record<string, string> = {
  WARRIOR: "战", HUNTER: "猎", ROGUE: "贼", PALADIN: "骑",
  MAGE: "法", PRIEST: "牧", WARLOCK: "术", SHAMAN: "萨",
  DRUID: "德", DEMONHUNTER: "恶", DEATHKNIGHT: "死",
};

const RARITY_COLORS: Record<string, string> = {
  FREE: "var(--rarity-free)",
  COMMON: "var(--rarity-common)",
  RARE: "var(--rarity-rare)",
  EPIC: "var(--rarity-epic)",
  LEGENDARY: "var(--rarity-legendary)",
};

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
  const classLetter = CLASS_LETTERS[deck.cardClass] || "?";
  const grouped = groupCardsByCost(deck.cards);
  const totalCards = deck.cards.reduce((s, e) => s + e.quantity, 0);
  const sortedCosts = [...grouped.keys()].sort((a, b) => a - b);

  const manaCurve = sortedCosts.map(cost => ({
    cost, count: grouped.get(cost)!.reduce((s, e) => s + e.quantity, 0),
  }));
  const maxCount = Math.max(...manaCurve.map(m => m.count));

  const guide = deck.guide;
  const extDeck = deck as typeof deck & { sourceUrl?: string; player?: string; rank?: number };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-280 px-8">
        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground py-3 flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">首页</Link>
          <span className="text-border">/</span>
          <Link href="/decks" className="hover:text-foreground transition-colors">卡组</Link>
          <span className="text-border">/</span>
          <span className="text-foreground font-medium">{deck.nameZh || deck.name}</span>
        </div>
      </div>

      {/* Hero Banner */}
      {(() => {
        const repCardId = getRepresentativeCardId(deck.cards.map(c => c.cardId));
        const artUrl = repCardId ? getCardArtUrl(repCardId, "512") : undefined;
        return (
          <section
            className="relative overflow-hidden"
            style={{
              background: artUrl
                ? `url('${artUrl}') center/cover no-repeat`
                : `linear-gradient(135deg, ${classColor}60, ${classColor}30)`,
            }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/40" />
            <div className="mx-auto max-w-280 px-8 py-12 md:py-20 relative z-10">
              <h1 className="font-heading text-[clamp(32px,5vw,56px)] leading-[1.1] tracking-tight text-white mb-3">
                {deck.nameZh || deck.name}
              </h1>
          <div className="text-lg text-white/75 flex items-center gap-2.5 flex-wrap">
            <span className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm grid place-items-center text-[13px] font-bold">
              {classLetter}
            </span>
            <span>{classInfo.nameZh}</span>
            <span className="opacity-40">&middot;</span>
            <span>{deck.format === "standard" ? "标准模式" : "狂野模式"}</span>
            {deck.tier && (
              <>
                <span className="opacity-40">&middot;</span>
                <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white">T{deck.tier}</span>
              </>
            )}
          </div>
        </div>
      </section>
      );
      })()}

      {/* Stats Row */}
      <section className="py-6 md:py-8">
        <div className="mx-auto max-w-280 px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {deck.winRate && (
              <div className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="font-mono text-[clamp(24px,3vw,36px)] font-bold text-primary tabular-nums">{deck.winRate}%</div>
                <div className="text-[13px] text-muted-foreground mt-1.5">胜率</div>
              </div>
            )}
            {deck.gamesPlayed && (
              <div className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="font-mono text-[clamp(24px,3vw,36px)] font-bold tabular-nums">{(deck.gamesPlayed / 1000).toFixed(1)}k</div>
                <div className="text-[13px] text-muted-foreground mt-1.5">场次</div>
              </div>
            )}
            {deck.dustCost && (
              <div className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="font-mono text-[clamp(24px,3vw,36px)] font-bold tabular-nums">{deck.dustCost.toLocaleString()}</div>
                <div className="text-[13px] text-muted-foreground mt-1.5">尘造价</div>
              </div>
            )}
            {deck.difficulty && (
              <div className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="flex justify-center gap-0.5 mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg key={i} viewBox="0 0 20 20" className="w-4.5 h-4.5">
                      <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27 5.23 15.71l.91-5.32L2.27 6.62l5.34-.78z" fill={i < deck.difficulty! ? "#FFD700" : "#D9D9D9"} />
                    </svg>
                  ))}
                </div>
                <div className="text-[13px] text-muted-foreground mt-1.5">难度</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Copy Deck Code */}
      {deck.deckCode && (
        <section className="pb-6 md:pb-8">
          <div className="mx-auto max-w-280 px-8 flex items-center justify-center gap-5 flex-wrap">
            <div className="font-mono text-[13px] text-muted-foreground bg-card border border-border rounded-xl px-4 py-2.5 max-w-80 truncate">
              {deck.deckCode}
            </div>
            <CopyDeckCodeClient code={deck.deckCode} />
          </div>
        </section>
      )}

      {/* Card List + Sidebar */}
      <section className="border-t border-border py-8">
        <div className="mx-auto max-w-280 px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-14 items-start">
            {/* Card List */}
            <div>
              <h3 className="text-xl font-semibold mb-5">
                卡牌列表 <span className="font-mono text-[13px] text-muted-foreground font-normal">({totalCards}张)</span>
              </h3>
              <div className="flex flex-col gap-1">
                {sortedCosts.map(cost => (
                  <div key={cost}>
                    <div className="font-mono text-xs font-semibold text-muted-foreground tracking-wide py-3 border-b border-border mb-1">
                      {cost}费
                    </div>
                    {grouped.get(cost)!.map(({ card, quantity }) => (
                      <Link key={card.id} href={`/cards/${card.id}`}>
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-card border border-border hover:bg-background/50 transition-colors">
                          <span className="w-7 h-7 rounded-full bg-(--mana-bg) text-(--mana-fg) font-mono text-[13px] font-bold grid place-items-center shrink-0">
                            {card.cost}
                          </span>
                          <span className="flex-1 text-[15px] font-medium truncate">{card.nameZh || card.name}</span>
                          {quantity === 2 && <span className="font-mono text-[13px] text-muted-foreground shrink-0">&times;2</span>}
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: RARITY_COLORS[card.rarity] || RARITY_COLORS.COMMON }}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar: Mana Curve */}
            <aside>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-5">费用曲线</h3>
                <div className="flex items-end gap-1.5 h-40 pb-7 relative">
                  {manaCurve.map(({ cost, count }) => (
                    <div key={cost} className="flex-1 flex flex-col items-center h-full justify-end relative">
                      <span className="font-mono text-[11px] text-muted-foreground mb-1">{count}</span>
                      <div
                        className="w-full rounded-t bg-(--mana-bg) min-h-1 transition-all duration-400"
                        style={{ height: `${(count / maxCount) * 100}%` }}
                      />
                      <span className="font-mono text-[11px] text-muted-foreground mt-1.5 absolute bottom-0">{cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Strategy Section */}
      {guide && (
        <section className="border-t border-border py-8">
          <div className="mx-auto max-w-280 px-8">
            <h2 className="font-heading text-[clamp(28px,3.5vw,44px)] leading-tight tracking-tight mb-6">攻略指南</h2>
            <div className="bg-card border border-border rounded-2xl p-7">
              {/* Strategy */}
              {guide.strategy && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">核心策略</h3>
                  <p className="text-muted-foreground leading-relaxed">{guide.strategy}</p>
                </div>
              )}

              {/* Key Decisions */}
              {guide.keyDecisions.length > 0 && (
                <div className="mb-6 border-t border-border pt-6">
                  <h3 className="text-xl font-semibold mb-3">关键决策点</h3>
                  <ul className="space-y-3">
                    {guide.keyDecisions.map((decision, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{decision}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mulligan Guide */}
              {guide.mulligan && (
                <div className="mb-6 border-t border-border pt-6">
                  <h3 className="text-xl font-semibold mb-3">起手留牌</h3>
                  <div className="space-y-3">
                    {guide.mulligan.always.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-emerald-500 mb-1.5">必留</div>
                        {guide.mulligan.always.map(cardId => {
                          const c = getCard(cardId);
                          return c ? (
                            <Link key={cardId} href={`/cards/${cardId}`}
                              className="flex items-center gap-1.5 text-sm py-1 text-muted-foreground hover:text-foreground transition-colors">
                              <span className="font-bold text-emerald-500">{c.cost}</span>
                              {c.nameZh}
                            </Link>
                          ) : null;
                        })}
                      </div>
                    )}
                    {guide.mulligan.situational.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-yellow-500 mb-1.5">视情况</div>
                        {guide.mulligan.situational.map((s, i) => {
                          const c = getCard(s.cardId);
                          return c ? (
                            <div key={i} className="mb-1.5">
                              <Link href={`/cards/${s.cardId}`}
                                className="flex items-center gap-1.5 text-sm py-0.5 text-muted-foreground hover:text-foreground transition-colors">
                                <span className="font-bold text-yellow-500">{c.cost}</span>
                                {c.nameZh}
                              </Link>
                              <p className="text-xs text-muted-foreground/60 ml-5">{s.reason}</p>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Substitutions */}
              {guide.substitutions.length > 0 && (
                <div className="border-t border-border pt-6">
                  <h3 className="text-xl font-semibold mb-3">替换建议</h3>
                  <div className="space-y-2">
                    {guide.substitutions.map((sub, i) => {
                      const origCard = getCard(sub.cardId);
                      const replCard = getCard(sub.replacement);
                      return (
                        <div key={i} className="flex items-center gap-2 text-sm p-3 rounded-lg bg-background border border-border">
                          <span className="text-red-400 text-xs">移除</span>
                          <span className="font-medium truncate max-w-30">{origCard?.nameZh || sub.cardId}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-emerald-400 text-xs">加入</span>
                          <span className="font-medium truncate max-w-30">{replCard?.nameZh || sub.replacement}</span>
                          {sub.reason && <span className="text-xs text-muted-foreground ml-auto hidden md:block">{sub.reason}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Matchup Table */}
      {guide && guide.matchups.length > 0 && (
        <section className="border-t border-border py-8">
          <div className="mx-auto max-w-280 px-8">
            <h2 className="font-heading text-[clamp(28px,3.5vw,44px)] leading-tight tracking-tight mb-6">对阵胜率</h2>
            <div className="bg-card border border-border rounded-2xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-2.5 px-3 border-b-2 border-border font-mono tracking-wide uppercase">职业</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-2.5 px-3 border-b-2 border-border font-mono tracking-wide uppercase">胜率</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-2.5 px-3 border-b-2 border-border font-mono tracking-wide uppercase">攻略</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground py-2.5 px-3 border-b-2 border-border font-mono tracking-wide uppercase">趋势</th>
                  </tr>
                </thead>
                <tbody>
                  {guide.matchups.map((mu, i) => {
                    const muColor = CLASS_COLORS[mu.opponent] || "#888";
                    const wrClass = mu.winRate >= 55 ? "text-emerald-600" : mu.winRate >= 50 ? "text-muted-foreground" : "text-primary";
                    const barClass = mu.winRate >= 55 ? "bg-emerald-600" : mu.winRate >= 50 ? "bg-muted-foreground/30" : "bg-primary";
                    return (
                      <tr key={i} className="border-b border-border last:border-b-0">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: muColor }} />
                            {mu.opponentZh}
                          </div>
                        </td>
                        <td className={`py-2.5 px-3 font-mono font-semibold tabular-nums ${wrClass}`}>{mu.winRate}%</td>
                        <td className="py-2.5 px-3 text-xs text-muted-foreground max-w-48 truncate">{mu.tips}</td>
                        <td className="py-2.5 px-3">
                          <div className="h-1.5 rounded bg-border w-20 overflow-hidden inline-block align-middle">
                            <div className={`h-full rounded ${barClass}`} style={{ width: `${mu.winRate}%` }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Related Decks */}
      <section className="border-t border-border py-8">
        <div className="mx-auto max-w-280 px-8">
          <h2 className="font-heading text-[clamp(28px,3.5vw,44px)] leading-tight tracking-tight mb-6">同职业卡组</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DECKS.filter(d => d.cardClass === deck.cardClass && d.id !== deck.id).slice(0, 4).map(d => {
              const dColor = CLASS_COLORS[d.cardClass] || "#888";
              return (
                <Link key={d.id} href={`/decks/${d.id}`} className="group">
                  <div className="bg-card border border-border rounded-xl p-4 transition-all duration-150 group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <div className="font-semibold text-sm mb-1">{d.nameZh || d.name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {d.winRate && <span className="font-mono tabular-nums">{d.winRate}%</span>}
                      {d.tier && (
                        <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                          T{d.tier}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
