import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** SwiftVerify logo lockup — real brand mark, clipped to a circle (source JPEG has no alpha channel). */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="SwiftVerify home"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full">
        <Image
          src="/swiftverify-logo.jpg"
          alt="SwiftVerify"
          fill
          priority
          sizes="36px"
          className="object-cover"
        />
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-navy-900">
        Swift<span className="text-brand-500">Verify</span>
      </span>
    </Link>
  );
}
