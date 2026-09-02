"use client";

import Image from "next/image";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { Fragment, useCallback, useEffect } from "react";
import { marqueeItems } from "@/data/marquee";
import { images } from "@/data/site";
import { linear, power2Out, sineInOut } from "@/lib/easings";
import { cn } from "@/lib/cn";

/**
 * Two crossed ticker bars beneath the hero — crimson tilted +4°, ink-black
 * tilted −4°, scrolling in opposite directions at different speeds. Hovering
 * eases both tracks down to a tenth speed instead of stopping them dead.
 */

/** Copies of the phrase list inside each track; the loop shifts by exactly one. */
const COPIES = 2;
const SPANS_PER_TRACK = COPIES * marqueeItems.length;

function Track({
  /** Offsets the float stagger so the two bars don't bob in unison. */
  staggerOffset,
  /** Hides every phrase from assistive tech; used for the duplicate bar. */
  decorative = false,
}: {
  staggerOffset: number;
  decorative?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      {Array.from({ length: COPIES }, (_, copy) => (
        <div key={copy} className="flex h-full shrink-0 items-center">
          {marqueeItems.map((item, index) => {
            const order = staggerOffset + copy * marqueeItems.length + index;
            return (
              <Fragment key={`${copy}-${index}`}>
                <motion.span
                  aria-hidden={decorative || copy > 0}
                  animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 1.6,
                          ease: sineInOut,
                          repeat: Infinity,
                          delay: order * 0.1,
                        }
                  }
                  className="mx-4 shrink-0 text-sm font-black tracking-widest whitespace-nowrap uppercase italic drop-shadow-sm md:mx-6 md:text-base lg:text-xl"
                >
                  {item}
                </motion.span>
                <Image
                  src={index % 2 === 0 ? images.spiderIcon : images.web}
                  alt=""
                  aria-hidden
                  width={160}
                  height={80}
                  // The bar's height drives the size; both axes are declared
                  // so next/image doesn't warn about a half-overridden ratio.
                  style={{ width: "auto", height: "100%" }}
                  className="mx-4 shrink-0 object-cover drop-shadow-md select-none md:mx-6"
                />
              </Fragment>
            );
          })}
        </div>
      ))}
    </>
  );
}

export function Marquee() {
  const reduceMotion = useReducedMotion();

  const topX = useMotionValue("0%");
  const bottomX = useMotionValue("-50%");
  const speed = useMotionValue(1);

  useEffect(() => {
    if (reduceMotion) return;

    const top = animate(topX, ["0%", "-50%"], {
      duration: 15,
      ease: linear,
      repeat: Infinity,
    });
    const bottom = animate(bottomX, ["-50%", "0%"], {
      duration: 20,
      ease: linear,
      repeat: Infinity,
    });

    // GSAP tweens the timelines' `timeScale`; Framer Motion exposes the same
    // control as a writable `speed` on the playback handle.
    const unsubscribe = speed.on("change", (value) => {
      top.speed = value;
      bottom.speed = value;
    });

    return () => {
      unsubscribe();
      top.stop();
      bottom.stop();
    };
  }, [reduceMotion, topX, bottomX, speed]);

  const ramp = useCallback(
    (to: number) => {
      if (reduceMotion) return;
      animate(speed, to, { duration: 0.8, ease: power2Out });
    },
    [reduceMotion, speed],
  );

  const barBase =
    "absolute flex h-12 w-[110vw] scale-105 items-center overflow-hidden border-y-[3px] md:h-16 lg:h-20";

  return (
    <section
      aria-label="Specialisms"
      onMouseEnter={() => ramp(0.1)}
      onMouseLeave={() => ramp(1)}
      className="relative z-40 flex h-[20vh] w-full items-center justify-center overflow-hidden bg-white md:h-[30vh]"
    >
      <div
        className={cn(
          barBase,
          "z-20 -translate-y-4 rotate-[4deg] border-black bg-spidey text-white shadow-[0_10px_20px_rgba(0,0,0,0.4)] md:-translate-y-6",
        )}
      >
        <motion.div style={{ x: topX }} className="flex h-full w-max items-center">
          <Track staggerOffset={0} />
        </motion.div>
      </div>

      <div
        className={cn(
          barBase,
          "z-10 translate-y-4 rotate-[-4deg] border-spidey bg-spidey-ink text-spidey shadow-[0_5px_15px_rgba(0,0,0,0.5)] md:translate-y-6",
        )}
      >
        <motion.div
          style={{ x: bottomX }}
          className="flex h-full w-max items-center"
        >
          <Track staggerOffset={SPANS_PER_TRACK} decorative />
        </motion.div>
      </div>
    </section>
  );
}
