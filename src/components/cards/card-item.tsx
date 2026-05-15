import { Badge } from "@/components/ui/badge";
import { HearthstoneCard } from "@/types";
import { getClassColor } from "@/data/classes";
import { cn } from "@/lib/utils";

const RARITY_COLORS: Record<string, string> = {
  FREE: "text-gray-400",
  COMMON: "text-gray-300",
  RARE: "text-blue-400",
  EPIC: "text-purple-400",
  LEGENDARY: "text-orange-400",
};

const RARITY_BG: Record<string, string> = {
  FREE: "bg-gray-500/10",
  COMMON: "bg-gray-400/10",
  RARE: "bg-blue-500/10",
  EPIC: "bg-purple-500/10",
  LEGENDARY: "bg-orange-500/10",
};

const TYPE_ICONS: Record<string, string> = {
  MINION: "👤",
  SPELL: "📜",
  WEAPON: "⚔️",
  HERO: "🦸",
  LOCATION: "📍",
};

export function CardItem({ card }: { card: HearthstoneCard }) {
  const classColor = getClassColor(card.cardClass);

  return (
    <div
      className={cn(
        "group relative rounded-lg border border-border/50 bg-card/50 p-3 transition-all duration-200 hover:border-border hover:shadow-md",
        RARITY_BG[card.rarity] || "bg-card/50"
      )}
    >
      {/* Cost gem */}
      <div className="flex items-start gap-2.5">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white"
          style={{ backgroundColor: classColor }}
        >
          {card.cost}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs">{TYPE_ICONS[card.type] || "📋"}</span>
            <h4 className={cn("text-sm font-semibold truncate", RARITY_COLORS[card.rarity])}>
              {card.nameZh || card.name}
            </h4>
            {card.rarity === "LEGENDARY" && (
              <span className="text-orange-400 text-xs">★</span>
            )}
          </div>

          {card.text && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
              {card.text}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {card.attack !== undefined && <span> ATK: {card.attack}</span>}
            {card.health !== undefined && <span> HP: {card.health}</span>}
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {card.cardClass}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
