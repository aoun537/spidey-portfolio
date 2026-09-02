"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { RevealSection } from "@/components/motion/RevealSection";
import { Float, Pendulum, SpinLoop } from "@/components/motion/Loops";
import { SpiderMark } from "@/components/ui/SpiderMark";
import { WebBackdrop } from "@/components/ui/WebBackdrop";
import { about } from "@/data/about";
import { images, site } from "@/data/site";
import { sineInOut } from "@/lib/easings";
import { ABOUT, PILL_FLOAT, VIEWPORT_TOP_70 } from "@/lib/motion-config";

/**
 * "Behind the Mask" — the biographical section.
 *
 * Two webs drop in from above on threads and rotate in opposite directions for
 * the rest of the page's life; the portrait swings in on its own web and then
 * settles into a slow pendulum. The copy wipes in behind clip-paths.
 */

/** Tailwind's `shadow-2xl`, spelled out so it can be a keyframe endpoint. */
const FRAME_SHADOW_REST = "0px 25px 50px -12px rgba(0,0,0,0.25)";
const FRAME_SHADOW_GLOW = "0px 15px 35px rgba(163,21,21,0.25)";

/**
 * GSAP staggers the pill float with `from: "random"`. A fixed permutation
 * keeps the same uncorrelated bobbing while staying stable across SSR and
 * hydration — a real `Math.random()` would mismatch.
 */
const PILL_STAGGER_ORDER = [3, 0, 5, 1, 4, 2];

/**
 * Framing for the circular portrait.
 *
 * A 3:4 bust photo cropped square leaves the head sitting high in the circle,
 * so the crop is nudged with `objectPosition` and then scaled about the
 * eyeline — `transformOrigin` is placed on the face so enlarging it doesn't
 * drift. This lands the head at roughly half the circle's height, which is
 * how a portrait wants to sit in a round frame.
 *
 * Nudge `scale` for a tighter or looser crop; nudge `objectPosition`'s second
 * value to move the face up or down.
 */
const PORTRAIT_FRAMING = {
  objectPosition: "50% 20%",
  transform: "scale(1.45)",
  transformOrigin: "50% 32%",
} as const;

export function About() {
  const reduceMotion = useReducedMotion();

  return (
    <RevealSection
      id="about"
      aria-labelledby="about-heading"
      viewport={VIEWPORT_TOP_70}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gray-50 py-24 text-gray-900"
    >
      {/* Webs suspended from above the fold, counter-rotating forever. */}
      <motion.div
        variants={ABOUT.web(0)}
        className="pointer-events-none absolute top-[-50px] left-[-5%] z-0 flex flex-col items-center md:left-[2%]"
      >
        <div
          aria-hidden
          className="h-[250px] w-[1px] bg-gradient-to-b from-transparent to-gray-300 md:h-[350px]"
        />
        <SpinLoop duration={70} className="-mt-12">
          <WebBackdrop className="h-64 w-64 opacity-[0.12] mix-blend-multiply md:h-96 md:w-96" />
        </SpinLoop>
      </motion.div>

      <motion.div
        variants={ABOUT.web(1)}
        className="pointer-events-none absolute top-[-50px] right-[-5%] z-0 flex flex-col items-center md:right-[2%]"
      >
        <div
          aria-hidden
          className="h-[200px] w-[1px] bg-gradient-to-b from-transparent to-gray-300 md:h-[300px]"
        />
        <SpinLoop duration={90} direction={-1} className="-mt-10">
          <WebBackdrop className="h-56 w-56 opacity-[0.12] mix-blend-multiply md:h-80 md:w-80" />
        </SpinLoop>
      </motion.div>

      <div className="relative z-10 container mx-auto flex flex-col-reverse items-center gap-12 px-6 md:px-12 lg:flex-row lg:items-start lg:gap-20 lg:px-24">
        {/* ---------------------------------------------------------- */}
        {/* Copy                                                        */}
        {/* ---------------------------------------------------------- */}
        <div className="relative z-20 mt-10 flex flex-1 flex-col gap-6 lg:mt-0">
          <div className="overflow-hidden">
            <motion.span
              variants={ABOUT.eyebrow}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-spidey uppercase md:text-sm"
            >
              <SpiderMark className="h-5 w-5 drop-shadow-sm" />
              {about.eyebrow}
            </motion.span>
          </div>

          <div className="overflow-hidden py-2">
            <motion.h2
              id="about-heading"
              variants={ABOUT.heading}
              className="text-shadow-comic text-4xl font-black tracking-tighter text-gray-900 uppercase italic md:text-5xl lg:text-7xl"
            >
              {about.heading}
            </motion.h2>
          </div>

          <div
            style={{ perspective: "1000px" }}
            className="mt-2 flex max-w-xl flex-col gap-6 text-base leading-relaxed font-medium text-gray-700 md:text-lg"
          >
            {about.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                variants={ABOUT.paragraph(index)}
                className="origin-bottom"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="mb-6 inline-block border-b border-gray-300 pb-2 text-xs font-bold tracking-widest text-gray-500 uppercase">
              {about.stackHeading}
            </h3>

            <ul className="flex list-none flex-wrap gap-3 p-0">
              {about.stack.map((tech, index) => (
                <motion.li key={tech} variants={ABOUT.pill(index)}>
                  <Float
                    range={PILL_FLOAT}
                    delay={1.5 + PILL_STAGGER_ORDER[index] * 0.2}
                  >
                    <span className="block cursor-default rounded-xl border border-spidey/30 bg-white px-5 py-2.5 text-sm font-bold tracking-wider text-spidey shadow-sm transition-colors duration-300 hover:border-spidey hover:bg-spidey hover:text-white hover:shadow-[0_8px_20px_rgba(163,21,21,0.3)]">
                      {tech}
                    </span>
                  </Float>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Portrait, hanging from its own web                          */}
        {/* ---------------------------------------------------------- */}
        <div className="relative flex w-full min-h-[550px] flex-1 items-start justify-center">
          <motion.div variants={ABOUT.photo} className="z-30">
            <Pendulum
              angle={2.5}
              duration={3.2}
              delay={2}
              origin="top center"
              className="group flex flex-col items-center"
            >
              <div
                aria-hidden
                className="h-[200px] w-[2px] bg-gradient-to-b from-transparent via-spidey/60 to-spidey md:h-[350px]"
              />

              <motion.div
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        boxShadow: [
                          FRAME_SHADOW_REST,
                          FRAME_SHADOW_GLOW,
                          FRAME_SHADOW_REST,
                        ],
                      }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 4, ease: sineInOut, repeat: Infinity }
                }
                className="relative h-64 w-64 rounded-full border-[6px] border-spidey bg-white p-2 shadow-2xl transition-transform duration-500 group-hover:scale-105 md:h-[340px] md:w-[340px]"
              >
                <div className="relative h-full w-full overflow-hidden rounded-full">
                  <Image
                    src={images.portrait}
                    alt={`${site.name}, ${site.role}`}
                    fill
                    sizes="(min-width: 768px) 340px, 256px"
                    style={PORTRAIT_FRAMING}
                    className="rounded-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                  />
                </div>
              </motion.div>
            </Pendulum>
          </motion.div>
        </div>
      </div>
    </RevealSection>
  );
}
