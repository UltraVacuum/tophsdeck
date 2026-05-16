"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CLASS_COLORS } from "@/data/classes";

const RARITY_COLORS: Record<string, string> = {
  FREE: "#9ca3af",
  COMMON: "#d1d5db",
  RARE: "#60a5fa",
  EPIC: "#c084fc",
  LEGENDARY: "#fb923c",
};

export type CardImageSize = "tile" | "thumb" | "normal" | "large";

interface CardImageProps {
  cardId: string;
  nameZh?: string;
  rarity?: string;
  cardClass?: string;
  size?: CardImageSize;
  className?: string;
  onClick?: () => void;
}

const SIZE_CLASSES: Record<CardImageSize, string> = {
  tile: "w-[256px] h-[59px]",
  thumb: "w-14 h-20",
  normal: "w-full aspect-[3/4]",
  large: "w-full aspect-[3/4]",
};

export function CardImage({
  cardId,
  nameZh,
  rarity,
  cardClass,
  size = "normal",
  className,
  onClick,
}: CardImageProps) {
  const [error, setError] = useState(false);

  const handleError = useCallback(() => setError(true), []);

  const rarityColor = rarity ? RARITY_COLORS[rarity] : undefined;
  const classColor = cardClass ? CLASS_COLORS[cardClass] : "#888";

  const isLarge = size === "normal" || size === "large";
  const isTile = size === "tile";
  const imageUrl = isTile
    ? `https://art.hearthstonejson.com/v1/tiles/${cardId}.png`
    : isLarge
      ? `https://art.hearthstonejson.com/v1/512x/${cardId}.jpg`
      : `https://art.hearthstonejson.com/v1/256x/${cardId}.jpg`;

  if (error) {
    return (
      <div
        className={cn(
          "relative flex flex-col items-center justify-center overflow-hidden rounded-lg bg-muted/50 border border-border/50",
          SIZE_CLASSES[size],
          className
        )}
        style={{
          background: classColor
            ? `linear-gradient(135deg, ${classColor}20, ${classColor}08)`
            : undefined,
        }}
      >
        <div
          className="flex items-center justify-center rounded-full w-8 h-8 mb-1"
          style={{ backgroundColor: `${classColor}30` }}
        >
          <span className="text-base">🃏</span>
        </div>
        {nameZh && (
          <span className="text-[10px] text-muted-foreground text-center px-1 line-clamp-2">
            {nameZh}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg",
        SIZE_CLASSES[size],
        isLarge && "group/img cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "auto",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: `${classColor}15`,
      }}
      onError={handleError}
    >
      {/* Shimmer loading skeleton — shows until image loads via background */}
      <div
        className="absolute inset-0 animate-pulse bg-muted/50"
        style={{
          background: classColor
            ? `linear-gradient(135deg, ${classColor}15, ${classColor}05, ${classColor}15)`
            : undefined,
        }}
      >
        <div
          className="h-full w-full"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${classColor}10 50%, transparent 100%)`,
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      </div>

      {/* Hover effect for large cards */}
      {isLarge && (
        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/5 transition-colors duration-200" />
      )}

      {/* Rarity shimmer for legendary */}
      {rarity === "LEGENDARY" && isLarge && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(120deg, transparent 30%, rgba(251,146,60,0.08) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
            animation: "legendaryShimmer 3s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}
