"use client";

import { useState, useMemo } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TavernDivider } from "@/components/ui/tavern-divider";
import { CardImage } from "@/components/cards/card-image";
import { decodeDeckCode, type DecodedDeck } from "@/lib/deck-code";
import {
  ArrowLeft, ClipboardPaste, Zap, Gem, AlertCircle,
  Swords, Search, Trash2,
} from "lucide-react";

const CLASS_COLORS: Record<string, string> = {
  DEMONHUNTER: "#a330c9", DRUID: "#ff7d0a", HUNTER: "#abd473", MAGE: "#69ccf0",
  PALADIN: "#f58cba", PRIEST: "#ffffff", ROGUE: "#fff569", SHAMAN: "#0070de",
  WARLOCK: "#9482c9", WARRIOR: "#c79c6e", DEATHKNIGHT: "#196feb", NEUTRAL: "#888888",
};

const CLASS_ZH: Record<string, string> = {
  DEMONHUNTER: "恶魔猎手", DRUID: "德鲁伊", HUNTER: "猎人", MAGE: "法师",
  PALADIN: "圣骑士", PRIEST: "牧师", ROGUE: "潜行者", SHAMAN: "萨满祭司",
  WARLOCK: "术士", WARRIOR: "战士", DEATHKNIGHT: "死亡骑士", NEUTRAL: "中立",
};

export default function DeckImportPage() {
  const [code, setCode] = useState("");
  const [deck, setDeck] = useState<DecodedDeck | null>(null);
  const [error, setError] = useState("");

  function handleDecode() {
    if (!code.trim()) { setError("请粘贴卡组代码"); setDeck(null); return; }
    const result = decodeDeckCode(code);
    if (!result) { setError("无法识别的卡组代码，请检查格式"); setDeck(null); return; }
    setError("");
    setDeck(result);
  }

  function handleClear() {
    setCode("");
    setDeck(null);
    setError("");
  }

  function handlePaste() {
    navigator.clipboard.readText().then(text => {
      setCode(text);
      setError("");
    }).catch(() => setError("无法读取剪贴板"));
  }

  const heroClass = useMemo(() => {
    if (!deck) return null;
    const classCard = deck.cards.find(c => c.card.cardClass !== "NEUTRAL");
    return classCard?.card.cardClass || deck.heroCard?.cardClass || null;
  }, [deck]);

  const groupedByCost = useMemo(() => {
    if (!deck) return [];
    const groups = new Map<number, { card: DecodedDeck["cards"][0]["card"]; quantity: number }[]>();
    for (const { card, quantity } of deck.cards) {
      if (!groups.has(card.cost)) groups.set(card.cost, []);
      groups.get(card.cost)!.push({ card, quantity });
    }
    for (const [, cards] of groups) cards.sort((a, b) => a.card.name.localeCompare(b.card.name));
    return [...groups.entries()].sort((a, b) => a[0] - b[0]);
  }, [deck]);

  const classColor = heroClass ? CLASS_COLORS[heroClass] || "#888" : "#888";
  const maxCurve = deck ? Math.max(...deck.manaCurve.map(m => m.count)) : 1;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/decks" className="hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> 卡组列表
        </Link>
        <span>/</span>
        <span className="text-foreground">导入卡组</span>
      </div>

      <h1 className="text-2xl font-bold font-heading mb-2 flex items-center gap-2">
        <ClipboardPaste className="h-6 w-6 text-primary" /> 卡组代码导入
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        粘贴炉石传说卡组代码，自动解析并展示完整卡牌列表、法力曲线和粉尘成本
      </p>

      {/* Input Area */}
      <Card className="mb-6 border-border/30">
        <CardContent className="p-4">
          <textarea
            value={code}
            onChange={e => { setCode(e.target.value); setError(""); }}
            placeholder="在此粘贴炉石传说卡组代码（如 AAECAZ8F...）"
            className="w-full h-24 bg-background text-sm rounded-md border border-border/30 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
          />
          <div className="flex items-center gap-3 mt-3">
            <Button onClick={handleDecode} className="gap-2">
              <Search className="h-4 w-4" /> 解析卡组
            </Button>
            <Button variant="outline" onClick={handlePaste} className="gap-2">
              <ClipboardPaste className="h-4 w-4" /> 粘贴
            </Button>
            <Button variant="ghost" onClick={handleClear} className="gap-2">
              <Trash2 className="h-4 w-4" /> 清空
            </Button>
          </div>
          {error && (
            <div className="flex items-center gap-2 mt-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Decoded Deck Display */}
      {deck && (
        <>
          <TavernDivider className="mb-6" />

          {/* Hero Banner */}
          <div className="relative rounded-xl overflow-hidden mb-6"
            style={{ background: `linear-gradient(135deg, ${classColor}22, ${classColor}08, transparent)` }}>
            <div className="absolute inset-0 border border-border/30 rounded-xl" />
            <div className="relative p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Swords className="h-6 w-6" style={{ color: classColor }} />
                  <h2 className="text-xl font-bold font-heading">
                    {heroClass ? CLASS_ZH[heroClass] || heroClass : "未知"}卡组
                  </h2>
                  <Badge variant="outline" className="text-xs">
                    {deck.format === "standard" ? "标准" : deck.format === "wild" ? "狂野" : deck.format}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Swords className="h-3 w-3" /> 卡牌数
                    </div>
                    <div className="text-lg font-bold">{deck.totalCards}</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Gem className="h-3 w-3" /> 粉尘
                    </div>
                    <div className="text-lg font-bold">{deck.dustCost.toLocaleString()}</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                    <div className="text-xs text-muted-foreground mb-1">职业卡/中立</div>
                    <div className="text-lg font-bold">{deck.classCards.length}/{deck.neutralCards.length}</div>
                  </div>
                </div>
              </div>

              {/* Mana Curve */}
              <Card className="w-full md:w-52 border-border/30 bg-background/50 shrink-0">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-sm flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" /> 法力曲线
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="flex items-end gap-0.5 h-20">
                    {deck.manaCurve.map(({ cost, count }) => (
                      <div key={cost} className="flex-1 flex flex-col items-center gap-1">
                        <div className="text-[9px] text-muted-foreground">{count}</div>
                        <div className="w-full rounded-t-sm" style={{
                          height: `${(count / maxCurve) * 100}%`,
                          backgroundColor: classColor,
                          opacity: 0.5 + (count / maxCurve) * 0.5,
                          minHeight: "4px",
                        }} />
                        <span className="text-[9px] text-muted-foreground">{cost}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Card List */}
          <Card className="border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">卡牌列表 ({deck.totalCards})</CardTitle>
            </CardHeader>
            <CardContent>
              {groupedByCost.map(([cost, entries]) => (
                <div key={cost} className="mb-4">
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    {cost} 费 ({entries.reduce((s, e) => s + e.quantity, 0)} 张)
                  </div>
                  <div className="space-y-1">
                    {entries.map(({ card, quantity }) => (
                      <Link key={card.id} href={`/cards/${card.id}`}>
                        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent/50 transition-colors group">
                          <div className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-white"
                            style={{ backgroundColor: classColor }}>{card.cost}</div>
                          <CardImage
                            cardId={card.id}
                            nameZh={card.nameZh}
                            rarity={card.rarity}
                            cardClass={card.cardClass}
                            size="tile"
                            className="opacity-60 group-hover:opacity-100 transition-opacity"
                          />
                          <span className="flex-1 truncate">{card.nameZh}</span>
                          <span className="text-xs text-muted-foreground">
                            {card.attack != null ? `${card.attack}/${card.health}` : card.type}
                          </span>
                          <Badge variant="outline" className="text-[10px]"
                            style={card.cardClass !== "NEUTRAL"
                              ? { color: classColor, borderColor: `${classColor}44` }
                              : { color: "#888" }}>
                            {card.cardClass === "NEUTRAL" ? "中立" : CLASS_ZH[card.cardClass] || card.cardClass}
                          </Badge>
                          {quantity === 2 && <Badge variant="secondary" className="text-[10px]">x2</Badge>}
                          {card.rarity === "LEGENDARY" && <span className="text-primary text-xs">&#9733;</span>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Unknown cards warning */}
              {deck.totalCards < 30 && (
                <div className="flex items-center gap-2 mt-4 text-sm text-yellow-500">
                  <AlertCircle className="h-4 w-4" />
                  检测到 {deck.totalCards} 张卡牌（标准卡组为 30 张），部分卡牌可能未被数据库收录
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
