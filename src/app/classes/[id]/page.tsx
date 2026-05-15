import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateClassMetadata } from "@/lib/seo";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TavernDivider } from "@/components/ui/tavern-divider";
import { HS_CLASSES, getClassInfo, getClassColor } from "@/data/classes";
import { DECKS } from "@/data/decks";
import { ALL_CARDS, getCardImageUrl } from "@/data/real-cards";
import { CardClass } from "@/types";
import { DeckCard } from "@/components/decks/deck-card";
import { ArrowLeft, Swords, BookOpen, Users } from "lucide-react";


export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const cls = HS_CLASSES.find(c => c.id === id);
  if (!cls) return {};
  return generateClassMetadata({ nameZh: cls.nameZh, name: cls.name, id: cls.id });
}

export function generateStaticParams() {
  return HS_CLASSES.map((cls) => ({ id: cls.id }));
}

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const classInfo = getClassInfo(id as CardClass);
  if (!classInfo) notFound();

  const classDecks = DECKS.filter((d) => d.cardClass === id);
  const classCards = ALL_CARDS.filter((c) => c.cardClass === id).sort((a, b) => a.cost - b.cost);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> 首页
        </Link>
        <span>/</span>
        <span className="text-foreground">{classInfo.nameZh}</span>
      </div>

      {/* Hero */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{ background: `linear-gradient(135deg, ${classInfo.color}33, ${classInfo.color}11)` }}
      >
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{classInfo.icon}</span>
          <div>
            <h1 className="text-2xl font-bold font-heading">{classInfo.nameZh}</h1>
            <p className="text-sm text-muted-foreground">{classInfo.name} · {classInfo.heroTitle || classInfo.hero}</p>
          </div>
        </div>
        {classInfo.description && (
          <p className="text-sm text-muted-foreground mb-3">{classInfo.description}</p>
        )}
        {classInfo.playStyle && (
          <div className="flex items-start gap-2 text-sm">
            <Swords className="h-4 w-4 mt-0.5 shrink-0" style={{ color: classInfo.color }} />
            <span className="text-muted-foreground">{classInfo.playStyle}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="border-border/30">
          <CardContent className="pt-4 pb-4 text-center">
            <BookOpen className="h-5 w-5 mx-auto mb-1" style={{ color: classInfo.color }} />
            <div className="text-2xl font-bold">{classCards.length}</div>
            <div className="text-xs text-muted-foreground">职业卡牌</div>
          </CardContent>
        </Card>
        <Card className="border-border/30">
          <CardContent className="pt-4 pb-4 text-center">
            <Swords className="h-5 w-5 mx-auto mb-1" style={{ color: classInfo.color }} />
            <div className="text-2xl font-bold">{classDecks.length}</div>
            <div className="text-xs text-muted-foreground">推荐卡组</div>
          </CardContent>
        </Card>
        <Card className="border-border/30">
          <CardContent className="pt-4 pb-4 text-center">
            <Users className="h-5 w-5 mx-auto mb-1" style={{ color: classInfo.color }} />
            <div className="text-2xl font-bold">
              {classDecks.length > 0 ? classDecks[0].winRate?.toFixed(1) : "—"}%
            </div>
            <div className="text-xs text-muted-foreground">最高胜率</div>
          </CardContent>
        </Card>
      </div>

      {/* Decks */}
      {classDecks.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold font-heading mb-4">推荐卡组</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {classDecks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        </div>
      )}

      {/* Cards */}
      <div>
        <h2 className="text-lg font-bold font-heading mb-4">职业卡牌</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {classCards.map((card) => (
            <Link key={card.id} href={`/cards/${card.id}`}>
              
                <div className="relative rounded-lg border border-border/30 bg-card/30 p-3 transition-all duration-200 hover:border-border hover:shadow-md flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white" style={{ backgroundColor: getClassColor(card.cardClass as CardClass) }}>{card.cost}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate">{card.nameZh}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {card.attack != null && <span>⚔{card.attack} ❤{card.health}</span>}
                      <span className="text-[10px]">{card.type}</span>
                    </div>
                  </div>
                </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
