interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "TopHSDeck",
        alternateName: "炉石传说卡组推荐",
        url: "https://hstopdecks.com",
        description: "专业的炉石传说攻略平台，提供最新卡组推荐、环境分析、卡牌数据库。",
        inLanguage: "zh-CN",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://hstopdecks.com/cards?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function CardJsonLd(opts: {
  nameZh: string;
  name: string;
  cardClass: string;
  type: string;
  rarity: string;
  cost: number;
  text: string;
  image: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "VideoGame",
        name: opts.nameZh,
        alternateName: opts.name,
        description: opts.text,
        image: opts.image,
        gamePlatform: "Hearthstone",
        applicationCategory: "Game",
        genre: "Digital Card Game",
        additionalProperty: [
          { "@type": "PropertyValue", name: "cardClass", value: opts.cardClass },
          { "@type": "PropertyValue", name: "type", value: opts.type },
          { "@type": "PropertyValue", name: "rarity", value: opts.rarity },
          { "@type": "PropertyValue", name: "cost", value: opts.cost },
        ],
      }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
