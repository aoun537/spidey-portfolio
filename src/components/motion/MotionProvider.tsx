"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * `reducedMotion="user"` makes Framer Motion drop transform animations
 * (x, y, scale, rotate, skew) for visitors who ask for reduced motion, while
 * still letting opacity and colour cross-fade. That covers every entrance
 * variant in one place; the idle-loop primitives opt out separately, and the
 * hero's mask transitions collapse to zero duration.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
