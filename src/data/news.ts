import { NewsItem } from "@/types";
import rawData from "./generated/news.json";

function isCurated(item: any): boolean {
  return item.id.startsWith("news-");
}

function isLowQuality(item: any): boolean {
  const title = (item.title || "").trim();
  const summary = (item.summary || "").trim();
  if (title.length < 5) return true;
  if (summary.length < 10) return true;
  if (title === summary) return true;
  return false;
}

function mapItem(item: any): NewsItem {
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    category: item.category,
    date: item.date,
    link: item.link,
    source: item.source,
  };
}

const curated: NewsItem[] = (rawData as any[])
  .filter(isCurated)
  .map(mapItem)
  .sort((a, b) => b.date.localeCompare(a.date));

const community: NewsItem[] = (rawData as any[])
  .filter((item) => !isCurated(item) && !isLowQuality(item))
  .map(mapItem)
  .sort((a, b) => b.date.localeCompare(a.date));

export const NEWS: NewsItem[] = [...curated, ...community];
