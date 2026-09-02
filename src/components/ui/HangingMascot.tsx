import Image from "next/image";
import { Pendulum } from "@/components/motion/Loops";
import { images } from "@/data/site";
import { cn } from "@/lib/cn";

/**
 * Spider-Man dangling into a section from above on a web thread, swaying
 * about the thread's anchor point. Used by Skills and Contact at different
 * scales and sway amplitudes.
 */
export function HangingMascot({
  positionClassName,
  threadClassName,
  imageClassName,
  angle,
  duration,
}: {
  /** Absolute placement of the whole assembly within the section. */
  positionClassName: string;
  /** Thread length; the width and gradient are fixed by the design. */
  threadClassName: string;
  /** Mascot size and shadow depth. */
  imageClassName: string;
  /** Peak sway in degrees. */
  angle: number;
  /** Seconds for one swing leg. */
  duration: number;
}) {
  return (
    <Pendulum
      angle={angle}
      duration={duration}
      origin="top center"
      className={cn(
        "pointer-events-none absolute z-30 flex flex-col items-center",
        positionClassName,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "w-[2px] bg-gradient-to-b from-transparent to-gray-400 opacity-60",
          threadClassName,
        )}
      />
      <Image
        src={images.spiderHang}
        alt=""
        aria-hidden
        width={340}
        height={734}
        className={cn("-mt-2 h-auto object-contain select-none", imageClassName)}
      />
    </Pendulum>
  );
}
