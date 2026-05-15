import type { Metadata } from "next";
import { Suspense } from "react";
import { PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = PAGE_SEO.decks;

export default function DecksLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
