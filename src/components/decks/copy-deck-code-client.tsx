"use client";

import { useState } from "react";

export function CopyDeckCodeClient({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-8 py-3 rounded-full text-[15px] font-medium border-none cursor-pointer transition-all ${
        copied ? "bg-emerald-700 text-white" : "bg-foreground text-white hover:bg-foreground/85"
      }`}
    >
      {copied ? "已复制!" : "复制卡组代码"}
    </button>
  );
}
