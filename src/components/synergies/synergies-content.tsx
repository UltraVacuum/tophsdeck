"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SYNERGIES } from "@/data/synergies";
import { ALL_CARDS, getCardImageUrl, getRealCardById } from "@/data/real-cards";
import { getClassColor } from "@/data/classes";
import { CardClass } from "@/types";
import { Sparkles, Search, Star } from "lucide-react";

export function SynergiesContent() {
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("ALL");

  const filtered = useMemo(() => {
    let result = SYNERGIES;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.nameZh.includes(search) ||
          s.name.toLowerCase().includes(q) ||
          s.description.includes(search) ||
          s.tags.some((t) => t.includes(search))
      );
    }
    if (diffFilter !== "ALL") {
      result = result.filter((s) => s.difficulty === parseInt(diffFilter));
    }
    return result;
  }, [search, diffFilter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading mb-1 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          经典配合与有趣搭配
        </h1>
        <p className="text-sm text-muted-foreground">
          发现炉石传说中最经典的卡牌配合和有趣组合
        </p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索配合..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={diffFilter} onValueChange={(v) => v !== null && setDiffFilter(v)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="难度" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">全部难度</SelectItem>
            <SelectItem value="1">⭐ 简单</SelectItem>
            <SelectItem value="2">⭐⭐ 普通</SelectItem>
            <SelectItem value="3">⭐⭐⭐ 进阶</SelectItem>
            <SelectItem value="4">⭐⭐⭐⭐ 大师</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filtered.map((syn) => (
          <Card key={syn.id} className="border-border/30 bg-card/30">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-bold text-base mb-1">{syn.nameZh}</h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {syn.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-medium">{syn.difficulty}/5</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {syn.description}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">涉及卡牌:</span>
                {syn.cardIds.map((cid) => {
                  const card = getRealCardById(cid);
                  if (!card) return null;
                  const color = getClassColor(card.cardClass as CardClass);
                  return (
                    <Badge
                      key={cid}
                      variant="outline"
                      className="text-xs"
                      style={{ borderColor: `${color}44`, color }}
                    >
                      {card.nameZh || card.name}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          没有找到匹配的配合
        </div>
      )}
    </div>
  );
}
