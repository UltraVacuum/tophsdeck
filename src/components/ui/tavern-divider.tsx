import { cn } from "@/lib/utils";

export function TavernDivider({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-px w-full my-8", className)}>
      <div className="absolute inset-x-[10%] h-full bg-linear-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-primary/40" />
    </div>
  );
}
