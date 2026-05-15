import type { Metadata } from "next";
import { PAGE_SEO } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NEWS } from "@/data/news";
import { Newspaper, Calendar, Tag } from "lucide-react";

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  patch: { label: "补丁", color: "text-primary border-primary/20 bg-primary/10" },
  event: { label: "活动", color: "text-primary border-primary/20 bg-primary/10" },
  esports: { label: "电竞", color: "text-primary border-primary/20 bg-primary/10" },
  guide: { label: "攻略", color: "text-primary border-primary/20 bg-primary/10" },
};


export const metadata: Metadata = PAGE_SEO.news;
export default function NewsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading mb-1 flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-primary" />
          资讯动态
        </h1>
        <p className="text-sm text-muted-foreground">
          炉石传说最新资讯、补丁公告和赛事信息
        </p>
      </div>

      <div className="space-y-4">
        {NEWS.map((item) => {
          const cat = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.guide;
          return (
            <Card key={item.id} className="border-border/30 bg-card/30 hover:bg-accent/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={cat.color}>
                        {cat.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.date}
                      </span>
                    </div>
                    <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
