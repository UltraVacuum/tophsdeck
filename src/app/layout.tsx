import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { WebsiteJsonLd } from "@/components/seo/json-ld";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1a1810",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hstopdecks.com"),
  title: {
    default: "TopHSDeck - 炉石传说卡组推荐 | 最新卡组搭配与环境分析",
    template: "%s | TopHSDeck",
  },
  description:
    "TopHSDeck 是专业的炉石传说攻略平台，提供最新卡组推荐、环境分析、卡牌数据库、Tier排行。涵盖标准/狂野模式全职业卡组搭配，助你轻松上分。",
  keywords: [
    "炉石传说", "Hearthstone", "炉石传说卡组", "炉石传说攻略",
    "炉石传说卡组推荐", "炉石卡组代码", "炉石传说环境分析",
    "炉石传说卡牌数据库", "炉石天梯排行", "炉石传说最强卡组",
    "炉石标准模式", "炉石狂野模式", "炉石传说Tier列表",
  ],
  authors: [{ name: "TopHSDeck" }],
  creator: "TopHSDeck",
  publisher: "TopHSDeck",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://hstopdecks.com",
    siteName: "TopHSDeck",
    title: "TopHSDeck - 炉石传说卡组推荐",
    description:
      "专业的炉石传说攻略平台，提供最新卡组推荐、环境分析、卡牌数据库。",
  },
  twitter: {
    card: "summary_large_image",
    title: "TopHSDeck - 炉石传说卡组推荐",
    description:
      "专业的炉石传说攻略平台，提供最新卡组推荐、环境分析、卡牌数据库。",
  },
  alternates: {
    canonical: "https://hstopdecks.com",
  },
  category: "gaming",
  classification: "Hearthstone Guide Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <WebsiteJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <TooltipProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}
