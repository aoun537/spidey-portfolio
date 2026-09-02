"use client";

import { motion, type Variants } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

/**
 * Scroll-triggered section shell.
 *
 * Stands in for the reference's GSAP ScrollTrigger:
 *   { start: "top 80%", toggleActions: "play none none reverse" }
 *
 * Descendant `motion` elements that declare `variants` inherit the
 * hidden/visible state through Framer Motion's variant propagation, which is
 * how a single scroll trigger drives a whole section's choreography — the same
 * shape as a GSAP timeline bound to one trigger.
 */

const CONTAINER: Variants = { hidden: {}, visible: {} };

type ViewportOptions = ComponentProps<typeof motion.section>["viewport"];

type RevealSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  viewport: ViewportOptions;
  "aria-labelledby"?: string;
};

export function RevealSection({
  children,
  className,
  id,
  viewport,
  ...rest
}: RevealSectionProps) {
  return (
    <motion.section
      id={id}
      className={className}
      variants={CONTAINER}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      {...rest}
    >
      {children}
    </motion.section>
  );
}
