import { cn } from "@/lib/utils";

const MASK = "url(/sites/colegio/logo.png)";

/** Logo IEMFS (PNG con alpha derivado del logo del usuario) pintado con el token --color-brand vía CSS mask. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="IEMFS"
      className={cn("block aspect-[1030/295] bg-brand", className)}
      style={{
        maskImage: MASK,
        maskRepeat: "no-repeat",
        maskSize: "contain",
        maskPosition: "left center",
        WebkitMaskImage: MASK,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        WebkitMaskPosition: "left center",
      }}
    />
  );
}
