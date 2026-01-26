import { cn } from "@/lib/utils";

export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <div className="h-px bg-slate-200 w-full max-w-[100px]" />
      <div className="mx-4 text-slate-300">✦</div>
      <div className="h-px bg-slate-200 w-full max-w-[100px]" />
    </div>
  );
}
