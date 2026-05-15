"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const STORAGE_KEY = "tophsdeck_favorites";

function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function setFavorites(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function FavoriteButton({ deckId, deckName }: { deckId: string; deckName: string }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(getFavorites().includes(deckId));
  }, [deckId]);

  const toggle = () => {
    const favs = getFavorites();
    if (isFav) {
      setFavorites(favs.filter(id => id !== deckId));
      setIsFav(false);
    } else {
      setFavorites([...favs, deckId]);
      setIsFav(true);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={toggle}
    >
      <Heart className={`h-3.5 w-3.5 transition-colors ${isFav ? "fill-red-400 text-red-400" : ""}`} />
      {isFav ? "已收藏" : "收藏"}
    </Button>
  );
}
