import type { Metadata } from "next";
import { PAGE_SEO } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NEWS } from "@/data/news";
import type { NewsItem } from "@/types";
import { Newspaper, Calendar, ExternalLink, MessageSquare } from "lucide-react";
import Link from "next/link";

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  patch: { label: "补丁", color: "text-red-400 border-red-400/20 bg-red-400/10" },
  event: { label: "活动", color: "text-amber-400 border-amber-400/20 bg-amber-400/10" },
  esports: { label: "电竞", color: "text-blue-400 border-blue-400/20 bg-blue-400/10" },
  expansion: { label: "扩展", color: "text-purple-400 border-purple-400/20 bg-purple-400/10" },
  guide: { label: "攻略", color: "text-primary border-primary/20 bg-primary/10" },
};

const SOURCE_CONFIG: Record<string, { label: string }> = {
  reddit: { label: "Reddit" },
  hearthstone: { label: "官方" },
  hearthstonetopdecks: { label: "HSTD" },
  hearthpwn: { label: "HearthPwn" },
};

export const metadata: Metadata = PAGE_SEO.news;

export default function NewsPage() {
  const curated = NEWS.filter((n) => n.id.startsWith("news-"));
  const community = NEWS.filter((n) => !n.id.startsWith("news-"));

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

      {/* Curated news */}
      {curated.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-base font-bold">精选资讯</h2>
            <Badge variant="secondary" className="text-[10px]">{curated.length}</Badge>
          </div>
          <div className="space-y-3">
            {curated.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Community highlights */}
      {community.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h2 className="font-heading text-base font-bold">社区热议</h2>
            <Badge variant="secondary" className="text-[10px]">{community.length}</Badge>
          </div>
          <div className="space-y-2">
            {community.map((item) => (
              <NewsCard key={item.id} item={item} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function NewsCard({ item, compact }: { item: NewsItem; compact?: boolean }) {
  const cat = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.guide;
  const src = SOURCE_CONFIG[item.source || ""] || { label: item.source || "" };

  const content = (
    <>
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <Badge variant="outline" className={cat.color}>
          {cat.label}
        </Badge>
        {item.source && (
          <Badge variant="secondary" className="text-[10px]">{src.label}</Badge>
        )}
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {item.date}
        </span>
      </div>
      <h3 className={`font-semibold leading-snug mb-1 ${compact ? "text-sm" : "text-base"}`}>
        {item.title}
      </h3>
      {!compact && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {item.summary}
        </p>
      )}
    </>
  );

  if (item.link) {
    return (
      <Link href={item.link} target="_blank" rel="noopener noreferrer">
        <Card className="border-border/30 bg-card/30 hover:bg-accent/30 transition-colors group">
          <CardContent className={compact ? "p-3" : "p-5"}>
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">{content}</div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50 mt-1 shrink-0 group-hover:text-primary transition-colors" />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Card className="border-border/30 bg-card/30">
      <CardContent className={compact ? "p-3" : "p-5"}>
        {content}
      </CardContent>
    </Card>
  );
}
