import Link from "next/link";
import { FileQuestion, Home, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <Card className="mx-auto w-full max-w-md border-orange-500/20 bg-card/80 backdrop-blur-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10 ring-1 ring-orange-500/20">
            <FileQuestion className="h-10 w-10 text-orange-500" />
          </div>
          <Badge variant="outline" className="border-orange-500/30 text-orange-400">
            404
          </Badge>
          <CardTitle className="mt-2 text-2xl">页面未找到</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">
            你探索的区域似乎不存在。也许是卡牌库被洗牌打乱了？
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/">
              <Button>
                <Home />
                返回首页
              </Button>
            </Link>
            <Link href="/decks">
              <Button variant="outline">
                <Swords />
                浏览卡组
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
