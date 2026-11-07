import { cn } from "@/lib/utils";

export function Placeholder({ className, label }: { className?: string; label?: React.ReactNode }) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-aqua/40 to-violet/30 text-xs font-medium uppercase tracking-widest text-ink/50",
        className,
      )}
    >
      {label ?? "Imagen"}
    </div>
  );
}
