import type { Metadata } from "next";
import { Suspense } from "react";
import { PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = PAGE_SEO.cards;

export default function CardsLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
