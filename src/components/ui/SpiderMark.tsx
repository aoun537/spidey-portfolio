import Image from "next/image";
import { images } from "@/data/site";
import { cn } from "@/lib/cn";

/**
 * The small Spider-Man crop that prefixes the About and Contact eyebrows.
 * The source artwork is a wide banner, so `object-contain` letterboxes it into
 * the little square slot — that squat crop is the reference's look, not a bug.
 */
export function SpiderMark({ className }: { className?: string }) {
  return (
    <Image
      src={images.spiderIcon}
      alt=""
      aria-hidden
      width={200} /* downscaled from 1600px — it renders at ~20px */
      height={101}
      className={cn("object-contain select-none", className)}
    />
  );
}
