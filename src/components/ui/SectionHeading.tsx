"use client";

import { motion } from "motion/react";
import { SECTION_HEADER } from "@/lib/motion-config";
import { SpiderMark } from "./SpiderMark";

/**
 * Shared header for Skills, Projects and Contact: crimson eyebrow, italic
 * blackletter-weight heading with the hard comic shadow, and a short rule.
 */
export function SectionHeading({
  eyebrow,
  heading,
  headingId,
  withMark = false,
}: {
  eyebrow: string;
  heading: string;
  headingId: string;
  withMark?: boolean;
}) {
  return (
    <motion.div
      variants={SECTION_HEADER}
      className="z-10 mb-10 flex flex-col items-center text-center"
    >
      <span className="mb-2 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] text-spidey uppercase md:text-xs">
        {withMark ? <SpiderMark className="h-4 w-4" /> : null}
        {eyebrow}
      </span>

      <h2
        id={headingId}
        className="text-shadow-comic text-3xl font-black tracking-tighter text-gray-900 uppercase italic md:text-5xl"
      >
        {heading}
      </h2>

      <div className="mt-2 h-1 w-12 rounded-full bg-spidey" />
    </motion.div>
  );
}
