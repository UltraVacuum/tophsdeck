"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <Card className="mx-auto w-full max-w-md border-destructive/20 bg-card/80 backdrop-blur-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/20">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <Badge variant="destructive">
            Error
          </Badge>
          <CardTitle className="mt-2 text-2xl">出了点问题</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">
            英雄，服务器遇到了一些意外状况。请稍后再试一次。
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={reset}>
              <RotateCw />
              重试
            </Button>
            <Link href="/">
              <Button variant="outline">
                <Home />
                返回首页
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
