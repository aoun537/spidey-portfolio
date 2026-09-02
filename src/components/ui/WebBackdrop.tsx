import Image from "next/image";
import { images } from "@/data/site";
import { cn } from "@/lib/cn";

/**
 * The hand-drawn spider web that recurs across every section — full strength
 * in the hero, a whisper (4%) behind the content sections.
 *
 * `mix-blend-multiply` is deliberately NOT applied here. Blending and opacity
 * have to sit on the same element: an ancestor with opacity < 1 opens a new
 * stacking context, and the web would then multiply against that empty group
 * instead of the page. Call sites put both on whichever element owns the
 * animated opacity.
 */
export function WebBackdrop({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={images.web}
      alt=""
      aria-hidden
      width={500}
      height={500}
      priority={priority}
      className={cn("object-contain select-none", className)}
    />
  );
}
