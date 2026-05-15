import Link from "next/link";
import { Swords } from "lucide-react";

const NAV_LINKS = [
  { href: "/decks", label: "卡组" },
  { href: "/cards", label: "卡牌" },
  { href: "/meta", label: "环境" },
  { href: "/synergies", label: "配合" },
  { href: "/mechanics", label: "机制" },
  { href: "/news", label: "资讯" },
];

const DATA_LINKS = [
  { href: "https://hearthstonejson.com/", label: "HearthstoneJSON" },
  { href: "https://hsreplay.net/", label: "HSReplay" },
  { href: "https://www.hearthstonetopdecks.com/", label: "HSTopDecks" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Swords className="h-4 w-4 text-primary" />
            <span className="font-heading font-bold text-sm text-primary">TopHSDeck</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap border-t border-border pt-4">
          <div className="flex items-center gap-3">
            {DATA_LINKS.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-[11px] text-muted-foreground/70 hover:text-muted-foreground transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <div className="text-[11px] text-muted-foreground/60">
            &copy; 2025 TopHSDeck. 炉石传说&reg;是暴雪娱乐的注册商标.
          </div>
        </div>
      </div>
    </footer>
  );
}
