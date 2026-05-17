import type { Metadata } from "next";
import { PAGE_SEO } from "@/lib/seo";
import Link from "next/link";
import { HS_CLASSES, CLASS_COLORS } from "@/data/classes";
import { getHotDecks, DECKS, getDataFreshness } from "@/data/decks";
import { ALL_CARDS, getRepresentativeCardId, getCardArtUrl } from "@/data/real-cards";
import { SYNERGIES } from "@/data/synergies";
import { NEWS } from "@/data/news";

export const metadata: Metadata = PAGE_SEO.home;

function getClassLetter(id: string): string {
  const m: Record<string, string> = {
    WARRIOR: "战", HUNTER: "猎", ROGUE: "贼", PALADIN: "骑",
    MAGE: "法", PRIEST: "牧", WARLOCK: "术", SHAMAN: "萨",
    DRUID: "德", DEMONHUNTER: "恶", DEATHKNIGHT: "死",
  };
  return m[id] || "?";
}

function getClassGradient(color: string): string {
  return `linear-gradient(135deg, ${color}33, ${color}15)`;
}

export default function HomePage() {
  const topDecks = getHotDecks(6);
  const freshness = getDataFreshness();
  const totalCards = ALL_CARDS.length;
  const totalDecks = DECKS.length;
  const latestNews = NEWS.slice(0, 3);
  const featuredSynergies = SYNERGIES.slice(0, 3);
  const featured = topDecks.slice(0, 3);

  const topWinRate = topDecks.length > 0 ? Math.max(...topDecks.map(d => d.winRate || 0)) : 0;
  const avgWinRate = topDecks.length > 0
    ? topDecks.reduce((s, d) => s + (d.winRate || 0), 0) / topDecks.length
    : 0;

  return (
    <div>
      {/* Data Overview */}
      <section className="border-b border-border py-8">
        <div className="mx-auto max-w-280 px-8">
          <div className="flex items-center justify-between mb-5">
            <h1 className="font-heading text-[clamp(28px,3.5vw,40px)] leading-tight tracking-tight">数据概览</h1>
            <span className="font-mono text-xs text-muted-foreground">最近更新: {freshness.label}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="font-mono text-[28px] font-semibold text-primary tracking-tight tabular-nums">
                {topWinRate > 0 ? `${topWinRate}%` : "—"}
              </div>
              <div className="text-[13px] text-muted-foreground mt-1">最高胜率</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="font-mono text-[28px] font-semibold tracking-tight tabular-nums">
                {avgWinRate > 0 ? `${avgWinRate.toFixed(1)}%` : "—"}
              </div>
              <div className="text-[13px] text-muted-foreground mt-1">平均胜率</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="font-mono text-[28px] font-semibold tracking-tight tabular-nums">{totalDecks}</div>
              <div className="text-[13px] text-muted-foreground mt-1">卡组总数</div>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border">
              <div className="font-mono text-[28px] font-semibold tracking-tight tabular-nums">{totalCards.toLocaleString()}</div>
              <div className="text-[13px] text-muted-foreground mt-1">卡牌总数</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Decks */}
      <section className="border-b border-border py-8">
        <div className="mx-auto max-w-280 px-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading text-[clamp(24px,3vw,32px)] leading-tight tracking-tight">精选卡组</h2>
              <p className="text-muted-foreground text-[13px] mt-1">根据胜率和使用率综合推荐</p>
            </div>
            <Link
              href="/decks"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm font-medium hover:border-foreground transition-colors"
            >
              查看全部
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((deck) => {
              const color = CLASS_COLORS[deck.cardClass] || "#888";
              const repCardId = getRepresentativeCardId(deck.cards.map(c => c.cardId));
              const artUrl = repCardId ? getCardArtUrl(repCardId) : undefined;
              return (
                <Link key={deck.id} href={`/decks/${deck.id}`} className="group">
                  <div className="bg-card rounded-xl overflow-hidden transition-all duration-150 group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <div
                      className="aspect-video grid place-items-center relative overflow-hidden"
                      style={{
                        background: artUrl
                          ? `url('${artUrl}') center/cover no-repeat`
                          : getClassGradient(color),
                      }}
                    >
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                      <div
                        className="relative z-10 w-9 h-9 rounded-full grid place-items-center text-base font-bold text-white/90 backdrop-blur-sm"
                        style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                      >
                        {getClassLetter(deck.cardClass)}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="font-semibold text-sm mb-1">{deck.nameZh || deck.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span>{HS_CLASSES.find(c => c.id === deck.cardClass)?.nameZh || deck.cardClass}</span>
                        <span>·</span>
                        {deck.tier && (
                          <span className="font-mono text-[10px] font-semibold px-1.5 py-px rounded-full bg-primary/10 text-primary">
                            T{deck.tier}
                          </span>
                        )}
                        <span>·</span>
                        {deck.winRate && <span className="font-mono tabular-nums">{deck.winRate}%</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Class Overview */}
      <section className="border-b border-border py-8">
        <div className="mx-auto max-w-280 px-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-[clamp(24px,3vw,32px)] leading-tight tracking-tight">职业速览</h2>
            <span className="font-mono text-xs text-muted-foreground">{HS_CLASSES.length} 职业</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {HS_CLASSES.map((cls) => {
              const deckCount = DECKS.filter(d => d.cardClass === cls.id).length;
              return (
                <Link key={cls.id} href={`/decks?class=${cls.id}`}>
                  <div className="bg-card rounded-xl p-4 text-center border border-border transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] cursor-pointer">
                    <div
                      className="w-10 h-10 rounded-full mx-auto mb-2 grid place-items-center text-base font-bold text-white"
                      style={{ backgroundColor: cls.color === "#ffffff" ? "#D4CFC0" : cls.color }}
                    >
                      {getClassLetter(cls.id)}
                    </div>
                    <div className="text-[13px] font-medium">{cls.nameZh}</div>
                    <div className="font-mono text-[11px] text-muted-foreground mt-0.5">{deckCount} 套</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Classic Synergies */}
      <section className="border-b border-border py-8">
        <div className="mx-auto max-w-280 px-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-[clamp(24px,3vw,32px)] leading-tight tracking-tight">经典配合</h2>
            <Link href="/synergies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredSynergies.map((syn) => (
              <div key={syn.id} className="bg-card rounded-xl p-4 border border-border">
                <div className="font-semibold text-sm mb-1">{syn.nameZh}</div>
                <div className="text-[13px] text-muted-foreground leading-relaxed line-clamp-3">{syn.description}</div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {syn.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-foreground/5 text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-8">
        <div className="mx-auto max-w-280 px-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-[clamp(24px,3vw,32px)] leading-tight tracking-tight">最新资讯</h2>
            <Link href="/news" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              全部资讯 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestNews.map((item) => {
              const tagStyle = item.category === "patch"
                ? "bg-[#FFF0E0] text-[#D97706]"
                : item.category === "event" || item.category === "esports"
                ? "bg-[#E0F0FF] text-[#2563EB]"
                : "bg-[#E8F8EE] text-[#059669]";
              const tagLabel = item.category === "patch" ? "补丁"
                : item.category === "event" ? "活动"
                : item.category === "esports" ? "赛事"
                : item.category === "expansion" ? "扩展" : "攻略";
              const inner = (
                <div className="bg-card rounded-xl p-4 border border-border">
                  <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full mb-2 font-medium ${tagStyle}`}>
                    {tagLabel}
                  </span>
                  <h3 className="text-[15px] font-semibold mb-1">{item.title}</h3>
                  <div className="text-xs text-muted-foreground">{item.date}</div>
                </div>
              );
              return item.link ? (
                <Link key={item.id} href={item.link} target="_blank" rel="noopener noreferrer">{inner}</Link>
              ) : (
                <div key={item.id}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
