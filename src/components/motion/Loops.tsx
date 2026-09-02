"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { linear, sineInOut } from "@/lib/easings";

/**
 * Idle-loop primitives.
 *
 * The reference keeps a dozen `gsap.to(..., { repeat: -1 })` tweens running
 * behind the scroll timelines — swaying mascots, breathing webs, floating
 * pills. These wrap that behaviour so the loop config stays out of the JSX.
 *
 * GSAP's `yoyo: true, repeat: -1, duration: d, ease: sine.inOut` is expressed
 * as the keyframe triple [a, b, a] over `2d`. Framer Motion applies the easing
 * to each segment, and `sine.inOut` is symmetric, so the curves match exactly.
 */

type LoopChildProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** CSS transform-origin; GSAP's `transformOrigin`. */
  origin?: string;
};

/* ------------------------------------------------------------------ */

type YoyoLoopProps = LoopChildProps & {
  /** Rest → peak values; mirrored back to rest automatically. */
  keyframes: Record<string, [number, number]>;
  /** Duration of a single leg, matching GSAP's `duration`. */
  duration: number;
  delay?: number;
};

export function YoyoLoop({
  keyframes,
  duration,
  delay = 0,
  origin,
  className,
  style,
  children,
}: YoyoLoopProps) {
  const reduced = useReducedMotion();
  const baseStyle: CSSProperties = { ...style, transformOrigin: origin };

  if (reduced) {
    return (
      <div className={className} style={baseStyle}>
        {children}
      </div>
    );
  }

  const animate = Object.fromEntries(
    Object.entries(keyframes).map(([key, [from, to]]) => [key, [from, to, from]]),
  );

  return (
    <motion.div
      className={className}
      style={baseStyle}
      animate={animate}
      transition={{
        duration: duration * 2,
        ease: sineInOut,
        repeat: Infinity,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

type SpinLoopProps = LoopChildProps & {
  /** Seconds for a full revolution. */
  duration: number;
  /** 1 = clockwise, -1 = counter-clockwise. */
  direction?: 1 | -1;
};

/** GSAP: `gsap.to(el, { rotation: ±360, repeat: -1, ease: "linear" })`. */
export function SpinLoop({
  duration,
  direction = 1,
  origin = "center center",
  className,
  style,
  children,
}: SpinLoopProps) {
  const reduced = useReducedMotion();
  const baseStyle: CSSProperties = { ...style, transformOrigin: origin };

  if (reduced) {
    return (
      <div className={className} style={baseStyle}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={baseStyle}
      animate={{ rotate: 360 * direction }}
      transition={{ duration, ease: linear, repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

type PendulumProps = LoopChildProps & {
  /** Peak swing in degrees. */
  angle: number;
  duration: number;
  delay?: number;
};

/** A sway about a fixed pivot — the mascots and the hanging photo. */
export function Pendulum({
  angle,
  duration,
  delay = 0,
  origin = "top center",
  ...rest
}: PendulumProps) {
  return (
    <YoyoLoop
      keyframes={{ rotate: [0, angle] }}
      duration={duration}
      delay={delay}
      origin={origin}
      {...rest}
    />
  );
}

/* ------------------------------------------------------------------ */

type FloatProps = LoopChildProps & {
  /**
   * Vertical range in pixels. Several of the reference's float loops do not
   * start from 0 — GSAP captured the entrance tween's from-value as the loop's
   * start — so both ends are explicit rather than assumed.
   */
  range: { from: number; to: number; duration: number };
  delay?: number;
};

/** A vertical bob — tech pills and the standing mascot. */
export function Float({ range, delay = 0, ...rest }: FloatProps) {
  return (
    <YoyoLoop
      keyframes={{ y: [range.from, range.to] }}
      duration={range.duration}
      delay={delay}
      {...rest}
    />
  );
}
