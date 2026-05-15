"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DeckCard } from "@/components/decks/deck-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HS_CLASSES } from "@/data/classes";
import { DECKS } from "@/data/decks";
import { Search, ClipboardPaste } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DecksPage() {
  const searchParams = useSearchParams();
  const [classFilter, setClassFilter] = useState<string>(
    searchParams.get("class") || "ALL"
  );
  const [formatFilter, setFormatFilter] = useState<string>(
    searchParams.get("format") || "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("winrate");

  const filteredDecks = useMemo(() => {
    let result = DECKS;

    if (classFilter !== "ALL") {
      result = result.filter((d) => d.cardClass === classFilter);
    }
    if (formatFilter !== "ALL") {
      result = result.filter((d) => d.format === formatFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.nameZh && d.nameZh.includes(q)) ||
          d.archetype.toLowerCase().includes(q) ||
          (d.description && d.description.includes(q))
      );
    }

    switch (sortBy) {
      case "winrate":
        result = [...result].sort((a, b) => (b.winRate || 0) - (a.winRate || 0));
        break;
      case "games":
        result = [...result].sort((a, b) => (b.gamesPlayed || 0) - (a.gamesPlayed || 0));
        break;
      case "tier":
        result = [...result].sort((a, b) => (a.tier || 99) - (b.tier || 99));
        break;
      case "dust":
        result = [...result].sort((a, b) => (a.dustCost || 0) - (b.dustCost || 0));
        break;
    }

    return result;
  }, [classFilter, formatFilter, searchQuery, sortBy]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold mb-1">卡组列表</h1>
          <p className="text-sm text-muted-foreground">
            共 {filteredDecks.length} 套卡组
          </p>
        </div>
        <Link href="/decks/import">
          <Button variant="outline" size="sm" className="gap-2">
            <ClipboardPaste className="h-4 w-4" /> 导入卡组代码
          </Button>
        </Link>
      </div>

      {/* Filter bar — warm bg + gold top border */}
      <div className="rounded-lg border border-border/30 bg-card/30 p-4 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/20" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索卡组..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={classFilter} onValueChange={(v) => v !== null && setClassFilter(v)}>
            <SelectTrigger className="w-35">
              <SelectValue placeholder="职业" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部职业</SelectItem>
              {HS_CLASSES.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.icon} {cls.nameZh}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={formatFilter} onValueChange={(v) => v !== null && setFormatFilter(v)}>
            <SelectTrigger className="w-30">
              <SelectValue placeholder="模式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">全部模式</SelectItem>
              <SelectItem value="standard">标准</SelectItem>
              <SelectItem value="wild">狂野</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => v !== null && setSortBy(v)}>
            <SelectTrigger className="w-30">
              <SelectValue placeholder="排序" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="winrate">按胜率</SelectItem>
              <SelectItem value="games">按场次</SelectItem>
              <SelectItem value="tier">按梯队</SelectItem>
              <SelectItem value="dust">按粉尘</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filters */}
      {(classFilter !== "ALL" || formatFilter !== "ALL") && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {classFilter !== "ALL" && (
            <Badge
              variant="secondary"
              className="cursor-pointer text-primary"
              onClick={() => setClassFilter("ALL")}
            >
              {HS_CLASSES.find((c) => c.id === classFilter)?.nameZh} ✕
            </Badge>
          )}
          {formatFilter !== "ALL" && (
            <Badge
              variant="secondary"
              className="cursor-pointer text-primary"
              onClick={() => setFormatFilter("ALL")}
            >
              {formatFilter === "standard" ? "标准" : "狂野"} ✕
            </Badge>
          )}
        </div>
      )}

      {/* Decks grid */}
      {filteredDecks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDecks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">没有找到匹配的卡组</p>
          <p className="text-sm">尝试调整筛选条件或搜索关键词</p>
        </div>
      )}
    </div>
  );
}
