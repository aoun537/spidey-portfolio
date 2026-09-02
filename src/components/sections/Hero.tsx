"use client";

import Image from "next/image";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from "motion/react";
import { useCallback, useEffect, useRef, type PointerEvent } from "react";
import { SpinLoop, YoyoLoop } from "@/components/motion/Loops";
import { WebBackdrop } from "@/components/ui/WebBackdrop";
import { DownloadIcon } from "@/components/ui/icons";
import { images, site } from "@/data/site";
import { elasticOut10_07, power4InOut, power4Out } from "@/lib/easings";
import { HERO, HERO_WEB_BREATH } from "@/lib/motion-config";

/**
 * The hero: "Behind the Mask".
 *
 * Two full-bleed portraits are stacked — the masked Spider-Man on top, the
 * unmasked face beneath. A radial-gradient `mask-image` on the top layer
 * tracks the pointer; hovering drives its centre alpha to 0 and its radius to
 * 700px, punching a soft hole through the mask so the person shows through.
 *
 * The gradient string is assembled from four motion values through
 * `useMotionTemplate`, so pointer movement never triggers a React render —
 * the same zero-render path GSAP's `quickTo` takes on the reference.
 */

const REST_RADIUS = 50;
const OPEN_RADIUS = 700;

/**
 * Vertical framing of the portrait inside the hero's full-bleed crop.
 *
 * Both layers are `object-cover`, so the portrait is cropped to the viewport
 * independently of the mask. This offset lines the portrait's eyeline up with
 * the mask's eyeline (~34% down the stage) so the reveal reads as one head
 * rather than two overlaid photos.
 *
 * Tuned for a 3:4 portrait with the eyes ~30% down the frame. If you swap in a
 * photo framed differently, this is the one number to nudge: lower percentage
 * moves the face down, higher moves it up.
 */
const PORTRAIT_FOCUS = "50% 25%";

/** Empty parent variants so the load timeline propagates to descendants. */
const STAGE: Variants = { hidden: {}, visible: {} };

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const alpha = useMotionValue(1);
  const radius = useMotionValue(REST_RADIUS);

  // `elastic.out` overshoots past its target, so alpha briefly leaves [0,1].
  // Browsers clamp CSS alpha anyway; clamping here keeps the emitted value a
  // valid colour regardless.
  const safeAlpha = useTransform(alpha, (value) =>
    Math.min(1, Math.max(0, value)),
  );

  const maskImage = useMotionTemplate`radial-gradient(circle ${radius}px at ${x}px ${y}px, rgba(0,0,0,${safeAlpha}) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,1) 100%)`;

  // Cache the section's box so pointer moves don't force layout, and keep the
  // mask anchored to the element rather than the viewport when the page is
  // scrolled mid-hover.
  useEffect(() => {
    const measure = () => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      boundsRef.current = rect;
      // Rest position matches the reference: the centre of the stage.
      if (x.get() === 0 && y.get() === 0) {
        x.set(rect.width / 2);
        y.set(rect.height / 2);
      }
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [x, y]);

  const trackDuration = reduceMotion ? 0 : 0.3;
  const openDuration = reduceMotion ? 0 : 0.8;
  const closeDuration = reduceMotion ? 0 : 1.2;

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const rect = boundsRef.current;
      if (!rect) return;
      // GSAP `quickTo(…, { duration: .3, ease: "power4.out" })` — each call
      // supersedes the animation in flight on that value.
      animate(x, event.clientX - rect.left, {
        duration: trackDuration,
        ease: power4Out,
      });
      animate(y, event.clientY - rect.top, {
        duration: trackDuration,
        ease: power4Out,
      });
    },
    [x, y, trackDuration],
  );

  const handlePointerEnter = useCallback(() => {
    const transition = { duration: openDuration, ease: elasticOut10_07 };
    animate(alpha, 0, transition);
    animate(radius, OPEN_RADIUS, transition);
  }, [alpha, radius, openDuration]);

  const handlePointerLeave = useCallback(() => {
    const transition = { duration: closeDuration, ease: power4InOut };
    animate(alpha, 1, transition);
    animate(radius, REST_RADIUS, transition);
  }, [alpha, radius, closeDuration]);

  return (
    <motion.section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      variants={STAGE}
      initial="hidden"
      animate="visible"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="relative flex h-screen w-full cursor-crosshair items-center justify-center overflow-hidden"
    >
      {/* Bottom layer — the real face, revealed through the hole. */}
      <Image
        src={images.portrait}
        alt={`${site.name}, ${site.role}`}
        fill
        priority
        sizes="100vw"
        style={{ objectPosition: PORTRAIT_FOCUS }}
        className="pointer-events-none z-10 object-cover select-none"
      />

      {/* Top layer — the mask, carrying the live radial-gradient cutout. */}
      <motion.div
        style={{ maskImage, WebkitMaskImage: maskImage }}
        className="mask-layer pointer-events-none absolute inset-0 z-20"
      >
        <Image
          src={images.heroMask}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover object-center select-none"
        />
      </motion.div>

      {/* Drifting webs. Opacity and blend must share an element, so the
          variant-driven wrapper carries both; rotation and breathing sit on
          nested wrappers so neither overwrites the other's transform. */}
      <div className="pointer-events-none absolute inset-0 z-[25] overflow-hidden">
        <motion.div
          variants={HERO.web(0)}
          className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 mix-blend-multiply"
        >
          <SpinLoop duration={120} className="h-[400px] w-[400px]">
            <YoyoLoop
              keyframes={{ scale: [HERO_WEB_BREATH.from, HERO_WEB_BREATH.to] }}
              duration={HERO_WEB_BREATH.duration}
              className="h-full w-full"
            >
              <WebBackdrop className="h-full w-full" priority />
            </YoyoLoop>
          </SpinLoop>
        </motion.div>

        <motion.div
          variants={HERO.web(1)}
          className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 mix-blend-multiply"
        >
          <SpinLoop duration={120} className="h-[500px] w-[500px]">
            <YoyoLoop
              keyframes={{ scale: [HERO_WEB_BREATH.from, HERO_WEB_BREATH.to] }}
              duration={HERO_WEB_BREATH.duration}
              className="h-full w-full"
            >
              <WebBackdrop className="h-full w-full" priority />
            </YoyoLoop>
          </SpinLoop>
        </motion.div>
      </div>

      {/* Copy */}
      <div className="pointer-events-none absolute top-1/2 left-6 z-30 flex w-full max-w-lg -translate-y-1/2 flex-col gap-3 drop-shadow-md md:left-12 lg:left-24">
        <motion.span
          variants={HERO.eyebrow}
          className="text-xs font-bold tracking-[0.2em] text-spidey uppercase md:text-sm"
        >
          {site.eyebrow}
        </motion.span>

        <motion.h1
          id="hero-heading"
          variants={HERO.heading}
          className="text-shadow-hero text-5xl leading-none font-black tracking-tighter text-gray-900 uppercase italic md:text-6xl lg:text-7xl"
        >
          {site.heroLines[0]}
          <br />
          {site.heroLines[1]}
        </motion.h1>

        <motion.p
          variants={HERO.supporting}
          className="max-w-xl text-base leading-relaxed font-medium text-gray-700 md:text-lg"
        >
          {site.heroSupporting}
        </motion.p>

        <div className="pointer-events-auto mt-6 flex flex-wrap items-center gap-4">
          <motion.a
            variants={HERO.cta(0)}
            href={site.primaryCtaHref}
            className="relative cursor-pointer overflow-hidden rounded-lg border border-spidey bg-spidey px-8 py-3 text-sm font-bold tracking-wide text-white uppercase transition-all duration-300 hover:-translate-y-1 hover:bg-spidey-dark hover:shadow-[0_10px_20px_rgba(163,21,21,0.4)]"
          >
            {site.primaryCta}
          </motion.a>

          <motion.a
            variants={HERO.cta(1)}
            href={site.resumeHref}
            download
            className="group flex cursor-pointer items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-bold text-white uppercase transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
          >
            <DownloadIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
            {site.resumeLabel}
          </motion.a>
        </div>
      </div>
    </motion.section>
  );
}
