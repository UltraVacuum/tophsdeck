import type { Metadata } from "next";
import { PAGE_SEO } from "@/lib/seo";
import { SynergiesContent } from "@/components/synergies/synergies-content";

export const metadata: Metadata = PAGE_SEO.synergies;

export default function SynergiesPage() {
  return <SynergiesContent />;
}
