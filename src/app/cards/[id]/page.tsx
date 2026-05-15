import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_CARDS } from "@/data/real-cards";
import { generateCardMetadata } from "@/lib/seo";
import { CardJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { HS_CLASSES, CLASS_COLORS } from "@/data/classes";
import { MECHANICS } from "@/data/mechanics";
import { ArrowLeft, Star, Flame, Sparkles, Swords, Shield, Heart, Zap, Palette } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const card = ALL_CARDS.find(c => c.id === id);
  if (!card) return {};
  return generateCardMetadata({
    nameZh: card.nameZh, name: card.name, cardClass: card.cardClass,
    rarity: card.rarity, type: card.type, cost: card.cost,
    text: card.textZh || card.text, id: card.id,
  });
}

export function generateStaticParams() {
  return ALL_CARDS.filter(c => c.set === "CORE" || c.rarity === "LEGENDARY")
    .slice(0, 200)
    .map(c => ({ id: c.id }));
}

const RARITY_NAMES: Record<string, string> = {
  FREE: "基础", COMMON: "普通", RARE: "稀有", EPIC: "史诗", LEGENDARY: "传说",
};
const RARITY_COLORS: Record<string, string> = {
  FREE: "#9ca3af", COMMON: "#d1d5db", RARE: "#60a5fa", EPIC: "#c084fc", LEGENDARY: "#fb923c",
};
const RARITY_TEXT: Record<string, string> = {
  FREE: "text-gray-400", COMMON: "text-gray-300", RARE: "text-blue-400", EPIC: "text-purple-400", LEGENDARY: "text-orange-400",
};
const RACE_ZH: Record<string, string> = {
  BEAST: "野兽", DEMON: "恶魔", DRAGON: "龙", ELEMENTAL: "元素", MECH: "机械",
  MURLOC: "鱼人", PIRATE: "海盗", TOTEM: "图腾", UNDEAD: "亡灵", NAGA: "娜迦",
  QUILBOAR: "野猪人", BREAKER: "破碎者",
};
const SCHOOL_ZH: Record<string, string> = {
  ARCANE: "奥术", FIRE: "火焰", FROST: "冰霜", NATURE: "自然",
  HOLY: "神圣", SHADOW: "暗影", FEL: "邪能",
};
const TYPE_ZH: Record<string, string> = {
  MINION: "随从", SPELL: "法术", WEAPON: "武器", HERO: "英雄", LOCATION: "地标",
};
const TYPE_ICONS: Record<string, string> = {
  MINION: "👤", SPELL: "📜", WEAPON: "⚔️", HERO: "🦸", LOCATION: "📍",
};

function getClassInfo(cardClass: string) {
  return HS_CLASSES.find(c => c.id === cardClass) || { id: "NEUTRAL", name: "Neutral", nameZh: "中立", icon: "🎯" };
}

export default async function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = ALL_CARDS.find(c => c.id === id);
  if (!card) notFound();

  const classInfo = getClassInfo(card.cardClass);
  const classColor = CLASS_COLORS[card.cardClass] || "#888";
  const rarityColor = RARITY_COLORS[card.rarity] || "#888";

  const relatedMechanics = (card.mechanics || [])
    .map(m => MECHANICS.find(mc => mc.id === m))
    .filter(Boolean);

  const relatedCards = ALL_CARDS.filter(
    c => c.cardClass === card.cardClass && c.id !== card.id && Math.abs(c.cost - card.cost) <= 1 && c.type === card.type
  ).slice(0, 6);

  return (
    <>
      <CardJsonLd
        nameZh={card.nameZh} name={card.name} cardClass={card.cardClass}
        type={card.type} rarity={card.rarity} cost={card.cost}
        text={card.textZh || card.text}
        image={`https://art.hearthstonejson.com/v1/512x/${card.id}.jpg`}
      />
      <BreadcrumbJsonLd items={[
        { name: "首页", url: "https://hstopdecks.com" },
        { name: "卡牌浏览", url: "https://hstopdecks.com/cards" },
        { name: card.nameZh, url: `https://hstopdecks.com/cards/${card.id}` },
      ]} />
      <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Top banner with class color gradient */}
      <div
        className="relative h-48 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${classColor}30, ${classColor}08, transparent 60%)`,
        }}
      >
        {/* Blurred card art as background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(https://art.hearthstonejson.com/v1/512x/${card.id}.jpg)`,
            backgroundSize: "auto",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(8px)",
            transform: "scale(1.1)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />

        {/* Breadcrumb */}
        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/cards" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> 卡牌浏览
            </Link>
            <span>/</span>
            <span className="text-foreground/80">{card.nameZh}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-4 -mt-28 relative z-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Card Image Column */}
          <div className="lg:col-span-4 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[300px]">
              {/* Glow effect */}
              <div
                className="absolute -inset-6 rounded-2xl opacity-25 blur-2xl"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${rarityColor}60, ${classColor}30, transparent 70%)`,
                }}
              />
              <div className="relative">
                <div
                  className="w-full aspect-2/3 rounded-xl shadow-2xl bg-muted/30"
                  style={{
                    backgroundImage: `url(https://art.hearthstonejson.com/v1/render/latest/zhCN/512x/${card.id}.png)`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                  role="img"
                  aria-label={card.nameZh}
                />
                {/* Legendary shimmer */}
                {card.rarity === "LEGENDARY" && (
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      background: "linear-gradient(120deg, transparent 30%, rgba(251,146,60,0.1) 50%, transparent 70%)",
                      backgroundSize: "200% 100%",
                      animation: "legendaryShimmer 3s ease-in-out infinite",
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Card Info Column */}
          <div className="lg:col-span-8 space-y-5">
            {/* Title section */}
            <div>
              <div className="flex items-start gap-4">
                {/* Cost gem */}
                <div
                  className="flex items-center justify-center w-14 h-14 rounded-xl text-xl font-bold text-white shadow-lg shrink-0"
                  style={{ backgroundColor: classColor }}
                >
                  {card.cost}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className={`font-heading text-2xl font-bold ${RARITY_TEXT[card.rarity]}`}>
                      {card.nameZh}
                    </h1>
                    {card.rarity === "LEGENDARY" && <Star className="h-5 w-5 text-orange-400 shrink-0" />}
                    <Badge
                      variant="outline"
                      className="text-xs shrink-0"
                      style={{ color: classColor, borderColor: `${classColor}40` }}
                    >
                      {classInfo.icon} {card.cardClass === "NEUTRAL" ? "中立" : classInfo.nameZh}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{card.name}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span>{RARITY_NAMES[card.rarity]}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                    <span>{TYPE_ICONS[card.type]} {TYPE_ZH[card.type]}</span>
                    {card.race && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                        <span>{RACE_ZH[card.race]}</span>
                      </>
                    )}
                    {card.spellSchool && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                        <span>{SCHOOL_ZH[card.spellSchool]}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Card text */}
            {card.textZh && (
              <div className="rounded-lg border border-border/40 bg-card/60 px-4 py-3">
                <p className="text-sm leading-relaxed">{card.textZh}</p>
              </div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {card.attack != null && (
                <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-card/40 px-3 py-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-500/15">
                    <Swords className="h-4 w-4 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">攻击力</div>
                    <div className="text-lg font-bold text-yellow-400">{card.attack}</div>
                  </div>
                </div>
              )}
              {card.health != null && (
                <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-card/40 px-3 py-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/15">
                    <Heart className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">生命值</div>
                    <div className="text-lg font-bold text-red-400">{card.health}</div>
                  </div>
                </div>
              )}
              {card.durability != null && (
                <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-card/40 px-3 py-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/15">
                    <Shield className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">耐久度</div>
                    <div className="text-lg font-bold text-blue-400">{card.durability}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-card/40 px-3 py-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${classColor}20` }}>
                  <Zap className="h-4 w-4" style={{ color: classColor }} />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">法力值</div>
                  <div className="text-lg font-bold" style={{ color: classColor }}>{card.cost}</div>
                </div>
              </div>
            </div>

            {/* Card properties grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm rounded-lg border border-border/40 bg-card/40 p-4">
              {card.race && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">种族</span>
                  <span className="font-medium">{RACE_ZH[card.race] || card.race}</span>
                </div>
              )}
              {card.spellSchool && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">法术派系</span>
                  <span className="font-medium">{SCHOOL_ZH[card.spellSchool] || card.spellSchool}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">来源</span>
                <span className="font-medium text-xs">{card.set}</span>
              </div>
              {card.artist && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1"><Palette className="h-3 w-3" /> 画师</span>
                  <span className="font-medium text-xs truncate ml-2 max-w-[160px]">{card.artist}</span>
                </div>
              )}
            </div>

            {/* Flavor text */}
            {card.flavorZh && (
              <div className="rounded-lg border border-border/30 bg-muted/20 px-4 py-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <Flame className="h-3.5 w-3.5 text-orange-400" />
                  <span className="text-xs font-medium text-muted-foreground">风味文字</span>
                </div>
                <p className="text-sm text-muted-foreground/80 italic leading-relaxed">{card.flavorZh}</p>
              </div>
            )}

            {/* Mechanics */}
            {relatedMechanics.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" /> 相关机制
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {relatedMechanics.map(m => m && (
                    <div key={m.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/30 border border-border/20">
                      <span className="text-base mt-0.5">{m.icon}</span>
                      <div>
                        <div className="text-sm font-medium">{m.nameZh}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{m.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Cards */}
            {relatedCards.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3">同类卡牌</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {relatedCards.map(rc => {
                    const rcColor = CLASS_COLORS[rc.cardClass] || "#888";
                    return (
                      <Link key={rc.id} href={`/cards/${rc.id}`} className="group">
                        <div className="relative overflow-hidden rounded-lg border border-border/30 bg-card/40 transition-all hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-lg">
                          <div
                            className="relative aspect-3/4 overflow-hidden bg-muted/30"
                            style={{
                              backgroundImage: `url(https://art.hearthstonejson.com/v1/256x/${rc.id}.jpg)`,
                              backgroundSize: "auto",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            <div
                              className="absolute top-1 left-1 flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white shadow"
                              style={{ backgroundColor: rcColor }}
                            >
                              {rc.cost}
                            </div>
                          </div>
                          <div className="px-1.5 py-1">
                            <p className={`text-[10px] font-medium truncate ${RARITY_TEXT[rc.rarity]}`}>
                              {rc.nameZh}
                            </p>
                            <p className="text-[9px] text-muted-foreground">
                              {rc.attack != null ? `⚔${rc.attack} ❤${rc.health}` : TYPE_ZH[rc.type]}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}