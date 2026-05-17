import Link from "next/link";

const NAV_LINKS = [
  { href: "/decks", label: "卡组" },
  { href: "/cards", label: "卡牌" },
  { href: "/meta", label: "环境" },
  { href: "/news", label: "资讯" },
];

const DATA_LINKS = [
  { href: "https://hearthstonejson.com/", label: "HearthstoneJSON" },
  { href: "https://hsreplay.net/", label: "HSReplay" },
  { href: "https://www.hearthstonetopdecks.com/", label: "HearthstoneTopDecks" },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-280 px-8 py-6 flex items-center justify-between flex-wrap gap-4">
        <span className="text-xs text-muted-foreground">&copy; 2026 TopHSDeck &middot; 炉石传说卡组社区</span>
        <div className="flex items-center gap-4">
          {DATA_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
