import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * SwiftVerify logo lockup.
 *
 * Uses /public/logo.svg (placeholder). When the real brand asset is ready,
 * drop it in as /public/logo.svg (or logo.png) — nothing else needs to change.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="SwiftVerify home"
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src="/logo.svg"
        alt="SwiftVerify"
        width={182}
        height={40}
        priority
        className="h-9 w-auto"
      />
    </Link>
  );
}
