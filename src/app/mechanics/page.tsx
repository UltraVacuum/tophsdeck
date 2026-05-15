import type { Metadata } from "next";
import { PAGE_SEO } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TavernDivider } from "@/components/ui/tavern-divider";
import { MECHANICS } from "@/data/mechanics";
import { ALL_CARDS } from "@/data/real-cards";
import { BookOpen, Lightbulb } from "lucide-react";


export const metadata: Metadata = PAGE_SEO.mechanics;
export default function MechanicsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading mb-1 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          关键词机制
        </h1>
        <p className="text-sm text-muted-foreground">
          炉石传说核心机制百科 — 了解每个关键词的效果和运用技巧
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {MECHANICS.map((mechanic) => {
          const relatedCards = ALL_CARDS.filter(c => (c.mechanics || []).includes(mechanic.id));
          return (
            <Card key={mechanic.id} className="border-border/30 bg-card/30">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{mechanic.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-bold text-base font-heading">{mechanic.nameZh}</h2>
                      <Badge variant="outline" className="text-[10px]">
                        {mechanic.name}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {mechanic.description}
                    </p>
                  </div>
                </div>

                {mechanic.tips && mechanic.tips.length > 0 && (
                  <div className="mb-3 ml-10">
                    <div className="flex items-center gap-1 mb-1.5">
                      <Lightbulb className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium text-primary">使用技巧</span>
                    </div>
                    <ul className="space-y-1">
                      {mechanic.tips.map((tip, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                          <span className="text-muted-foreground/60">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {relatedCards.length > 0 && (
                  <div className="ml-10">
                    <span className="text-xs text-muted-foreground">
                      相关卡牌: {relatedCards.slice(0, 4).map(c => c.nameZh || c.name).join("、")}
                      {relatedCards.length > 4 && ` 等${relatedCards.length}张`}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
