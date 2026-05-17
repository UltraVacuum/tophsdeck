"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CardLoreEntry, getCardLore, getAllStoryTags, getCardsByStoryTag } from "@/data/lore";
import { getRealCardById } from "@/data/real-cards";
import { CLASS_COLORS } from "@/data/classes";
import {
  BookOpen,
  ExternalLink,
  MapPin,
  Sparkles,
  Lightbulb,
  Link2,
  Swords,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CardStoryProps {
  cardId: string;
  dbfId?: number;
  cardNameZh?: string;
  cardName?: string;
  flavorZh?: string;
  cardClass?: string;
}

const RARITY_TEXT: Record<string, string> = {
  FREE: "text-gray-400",
  COMMON: "text-gray-300",
  RARE: "text-blue-400",
  EPIC: "text-purple-400",
  LEGENDARY: "text-orange-400",
};

export function CardStory({
  cardId,
  dbfId,
  cardNameZh,
  cardName,
  flavorZh,
  cardClass,
}: CardStoryProps) {
  const lore = getCardLore(cardId);
  const classColor = cardClass ? CLASS_COLORS[cardClass] || "#888" : "#888";

  // No story content at all — show minimal Wowhead link
  const hasLore = !!lore;
  const hasFlavor = !!flavorZh;
  const hasWowheadLink = !!dbfId || !!lore?.wowheadCardUrl;

  if (!hasLore && !hasFlavor && !hasWowheadLink) return null;

  // Resolve related cards
  const relatedCardIds = lore?.relatedCardIds || [];
  const relatedCards = relatedCardIds
    .map((id) => {
      const c = getRealCardById(id);
      return c ? { id: c.id, nameZh: c.nameZh, cost: c.cost, cardClass: c.cardClass } : null;
    })
    .filter(Boolean);

  // Resolve story tag connections
  const storyTags = lore?.storyTags || [];
  const tagConnections = storyTags
    .map((tag) => ({
      tag,
      cards: getCardsByStoryTag(tag).filter((id) => id !== cardId),
    }))
    .filter((tc) => tc.cards.length > 0);

  const wowheadUrl =
    lore?.wowheadCardUrl || (dbfId ? `https://www.wowhead.com/hearthstone/card=${dbfId}` : null);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-lg"
          style={{ backgroundColor: `${classColor}20` }}
        >
          <BookOpen className="h-4 w-4" style={{ color: classColor }} />
        </div>
        <h3 className="text-sm font-semibold">卡牌故事</h3>
        {lore?.wowOrigin && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-1">
            <MapPin className="h-2.5 w-2.5 mr-0.5" />
            {lore.wowOrigin}
          </Badge>
        )}
      </div>

      {/* Main Story Content */}
      {hasLore && (
        <div className="rounded-lg border border-border/40 bg-card/60 p-4 space-y-3">
          {/* Lore narrative */}
          <div className="relative pl-4 border-l-2" style={{ borderColor: `${classColor}40` }}>
            <p className="text-sm leading-relaxed text-foreground/90">{lore!.lore}</p>
          </div>

          {/* Fun Fact */}
          {lore!.funFact && (
            <div className="flex gap-2.5 rounded-md bg-muted/30 px-3 py-2.5">
              <Lightbulb className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  趣味知识
                </span>
                <p className="text-xs text-muted-foreground/80 leading-relaxed mt-0.5">
                  {lore!.funFact}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Flavor text (if no lore, show as standalone) */}
      {hasFlavor && (
        <div
          className={cn(
            "rounded-lg border border-border/30 bg-muted/20 px-4 py-3",
            !hasLore && "border-border/40 bg-card/60"
          )}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-xs font-medium text-muted-foreground">
              {hasLore ? "风味文字" : "卡牌描述"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground/80 italic leading-relaxed">{flavorZh}</p>
        </div>
      )}

      {/* Story Connections — Related Cards by Tag */}
      {tagConnections.length > 0 && (
        <div className="rounded-lg border border-border/30 bg-card/40 p-3">
          <div className="flex items-center gap-2 mb-2.5">
            <Link2 className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-semibold">故事线索</span>
          </div>
          <div className="space-y-2">
            {tagConnections.map(({ tag, cards }) => (
              <div key={tag} className="flex items-start gap-2">
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 shrink-0 mt-0.5 border-primary/30 text-primary"
                >
                  {tag}
                </Badge>
                <div className="flex flex-wrap gap-1.5">
                  {cards.map((cid) => {
                    const rc = getRealCardById(cid);
                    if (!rc) return null;
                    const rcColor = CLASS_COLORS[rc.cardClass] || "#888";
                    return (
                      <Link
                        key={cid}
                        href={`/cards/${cid}`}
                        className="group/rc flex items-center gap-1.5 rounded-md border border-border/30 bg-muted/30 px-2 py-1 transition-all hover:border-primary/30 hover:bg-accent/50"
                      >
                        <div
                          className="flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold text-white shrink-0"
                          style={{ backgroundColor: rcColor }}
                        >
                          {rc.cost}
                        </div>
                        <span className="text-[11px] font-medium text-foreground/80 group-hover/rc:text-foreground">
                          {rc.nameZh}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Directly Related Cards */}
      {relatedCards.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Swords className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-xs font-semibold">关联卡牌</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedCards.map((rc) => {
              if (!rc) return null;
              const rcColor = CLASS_COLORS[rc.cardClass] || "#888";
              return (
                <Link
                  key={rc.id}
                  href={`/cards/${rc.id}`}
                  className="group flex items-center gap-2 rounded-lg border border-border/30 bg-card/40 px-2.5 py-1.5 transition-all hover:border-primary/30 hover:shadow-sm"
                >
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: rcColor }}
                  >
                    {rc.cost}
                  </div>
                  <span className="text-xs font-medium">{rc.nameZh}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Story Tags */}
      {storyTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="h-3 w-3 text-muted-foreground" />
          {storyTags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-muted-foreground/70 bg-muted/30 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Wowhead External Links */}
      {hasWowheadLink && (
        <>
          <Separator className="opacity-30" />
          <div className="flex items-center gap-3 flex-wrap">
            {wowheadUrl && (
              <a
                href={wowheadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group/wh"
              >
                <ExternalLink className="h-3 w-3" />
                <span className="group-hover/wh:underline">Wowhead 卡牌</span>
              </a>
            )}
            {lore?.wowheadWowUrl && (
              <a
                href={lore.wowheadWowUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group/wh"
              >
                <ExternalLink className="h-3 w-3" />
                <span className="group-hover/wh:underline">Wowhead 魔兽世界</span>
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
