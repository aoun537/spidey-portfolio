import type { Variants } from "motion/react";
import {
  backOut12,
  backOut14,
  backOut15,
  backOut17,
  backOut20,
  elasticOut07_04,
  elasticOut08_04,
  power3Out,
  type Easing,
} from "./easings";

/* ------------------------------------------------------------------
   Scroll triggers

   The reference drives every section with GSAP ScrollTrigger:
     { start: "top 80%", toggleActions: "play none none reverse" }

   "top 80%" fires when the section's top crosses 80% of the viewport
   height, i.e. 20% up from the bottom edge. Framer Motion's viewport
   margin expresses the same thing by shrinking the root bounds.

   `once: false` reproduces the "…none reverse" leg — sections replay
   on re-entry and rewind on exit, exactly as they do on the reference.
------------------------------------------------------------------ */

export const VIEWPORT_TOP_80 = {
  once: false,
  margin: "0px 0px -20% 0px",
} as const;

export const VIEWPORT_TOP_70 = {
  once: false,
  margin: "0px 0px -30% 0px",
} as const;

/* ------------------------------------------------------------------
   Variant builder

   GSAP timelines position tweens relative to the timeline end ("-=1.4").
   Framer Motion has no equivalent, and `staggerChildren` cannot express
   overlap, so each step's absolute start time is resolved by hand (see
   the per-section tables below) and applied as an explicit delay.
------------------------------------------------------------------ */

type Keyframes = Record<string, number | string>;

export function reveal(
  hidden: Keyframes,
  visible: Keyframes,
  duration: number,
  ease: Easing,
  delay = 0,
): Variants {
  return {
    hidden,
    visible: { ...visible, transition: { duration, ease, delay } },
  };
}

/** Per-item delay for a list whose reveal is staggered. */
export const staggered = (base: number, each: number, index: number) =>
  base + each * index;

/* ==================================================================
   HERO — page-load timeline
   GSAP: defaults { ease: back.out(1.7) }

   step                      position   absolute window
   1 webs (stagger 0.4)      0          0.00 → 2.00 / 0.40 → 2.40
   2 eyebrow                 -=1.5      0.90 → 2.10
   3 h1                      -=1.0      1.40 → 2.60
   4 CTAs (stagger 0.15)     -=0.8      1.80 → 2.60 / 1.95 → 2.75
================================================================== */

export const HERO = {
  web: (index: number) =>
    reveal(
      { opacity: 0 },
      { opacity: 0.5 },
      2,
      power3Out,
      staggered(0, 0.4, index),
    ),
  eyebrow: reveal(
    { opacity: 0, x: -100 },
    { opacity: 1, x: 0 },
    1.2,
    backOut17,
    0.9,
  ),
  heading: reveal(
    { opacity: 0, x: -150, skewX: -15 },
    { opacity: 1, x: 0, skewX: 0 },
    1.2,
    backOut17,
    1.4,
  ),
  /**
   * The supporting line sits between the name and the CTAs. It rises on the
   * same cascade, slotted just before the buttons so the block still reads
   * top-to-bottom; the CTA timings are untouched.
   */
  supporting: reveal({ opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.8, power3Out, 1.7),
  cta: (index: number) =>
    reveal(
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0 },
      0.8,
      backOut20,
      staggered(1.8, 0.15, index),
    ),
} as const;

/* ==================================================================
   ABOUT — start: "top 70%"

   step                      position   absolute window
   1 hanging webs (0.3)      0          0.00 → 1.80 / 0.30 → 2.10
   2 eyebrow (clip wipe)     -=1.4      0.70 → 1.50
   3 h2 (clip wipe)          -=1.0      1.10 → 1.90
   4 hanging photo           -=0.8      1.30 → 3.10
   5 paragraphs (0.15)       -=1.2      1.90 → 2.90 / 2.05 → 3.05
   6 tech pills (0.1)        -=0.8      2.30 → 2.80 …
================================================================== */

const CLIP_HIDDEN_LEFT = "polygon(0 0, 0 0, 0 100%, 0% 100%)";
const CLIP_HIDDEN_BOTTOM = "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)";
const CLIP_SHOWN = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";

export const ABOUT = {
  web: (index: number) =>
    reveal(
      { opacity: 0, y: -600 },
      { opacity: 1, y: 0 },
      1.8,
      elasticOut08_04,
      staggered(0, 0.3, index),
    ),
  eyebrow: reveal(
    { opacity: 0, x: -50, clipPath: CLIP_HIDDEN_LEFT },
    { opacity: 1, x: 0, clipPath: CLIP_SHOWN },
    0.8,
    power3Out,
    0.7,
  ),
  heading: reveal(
    { opacity: 0, y: 50, clipPath: CLIP_HIDDEN_BOTTOM },
    { opacity: 1, y: 0, clipPath: CLIP_SHOWN },
    0.8,
    power3Out,
    1.1,
  ),
  photo: reveal(
    { opacity: 0, y: -800 },
    { opacity: 1, y: 0 },
    1.8,
    elasticOut07_04,
    1.3,
  ),
  paragraph: (index: number) =>
    reveal(
      { opacity: 0, y: 40, rotateX: -45 },
      { opacity: 1, y: 0, rotateX: 0 },
      1,
      backOut12,
      staggered(1.9, 0.15, index),
    ),
  /**
   * `y` is deliberately absent. The reference's entrance sets `y: 20` as its
   * from-value, but the float loop — created immediately afterwards — captures
   * that 20 as *its* start and then owns `y` on every frame (GSAP renders
   * tweens in creation order). The entrance's `y: 20 → 0` therefore never
   * renders; the pills just oscillate 20 → −4 forever. See `PILL_FLOAT`.
   */
  pill: (index: number) =>
    reveal(
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1 },
      0.5,
      backOut15,
      staggered(2.3, 0.1, index),
    ),
} as const;

/** Measured on the reference: translateY oscillates 20 → −4 over 1.5s legs. */
export const PILL_FLOAT = { from: 20, to: -4, duration: 1.5 } as const;

/* ==================================================================
   SECTION HEADERS — Skills / Projects / Contact, start: "top 80%"
   1 header                  0          0.00 → 0.60
================================================================== */

export const SECTION_HEADER = reveal(
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0 },
  0.6,
  power3Out,
  0,
);

/* ==================================================================
   SKILLS
   2 .matrix-item (0.04)     -=0.3      0.30 → 0.80 …
================================================================== */

export const SKILL_CARD = (index: number) =>
  reveal(
    { opacity: 0, y: 30, x: -15 },
    { opacity: 1, y: 0, x: 0 },
    0.5,
    backOut15,
    staggered(0.3, 0.04, index),
  );

/* ==================================================================
   PROJECTS
   2 .project-item (0.1)     -=0.3      0.30 → 0.80 …
   3 standing Spider-Man     -=0.4      0.70 → 1.50
================================================================== */

export const PROJECT_CARD = (index: number) =>
  reveal(
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0 },
    0.5,
    backOut14,
    staggered(0.3, 0.1, index),
  );

/**
 * Opacity only, for the same reason as `ABOUT.pill`: the mascot's float loop
 * captures the entrance's `y: 100` from-value and then drives `y` itself, so
 * the reference's mascot never slides up — it fades in while bobbing across a
 * 110px range. See `MASCOT_FLOAT`.
 */
export const PROJECT_MASCOT = reveal({ opacity: 0 }, { opacity: 1 }, 0.8, backOut17, 0.7);

/** Measured on the reference: translateY oscillates 100 → −10 over 2.5s legs. */
export const MASCOT_FLOAT = { from: 100, to: -10, duration: 2.5 } as const;

/** Measured on the reference: the hero webs breathe 0.5 → 1.1 over 4s legs. */
export const HERO_WEB_BREATH = { from: 0.5, to: 1.1, duration: 4 } as const;

/* ==================================================================
   CONTACT
   2 form card               -=0.3      0.30 → 1.00
================================================================== */

export const CONTACT_CARD = reveal(
  { opacity: 0, y: 30 },
  { opacity: 1, y: 0 },
  0.7,
  backOut14,
  0.3,
);
