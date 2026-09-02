/**
 * GSAP-equivalent easing functions.
 *
 * The reference site animates with GSAP. This rebuild uses Framer Motion, so
 * the curves are re-implemented here as pure `(t) => t` functions rather than
 * approximated with generic CSS easings — the motion stays identical even
 * though the engine changed.
 *
 * GSAP's Power ramp is offset by one from the usual naming:
 *   Power0 = Linear, Power1 = Quad, Power2 = Cubic, Power3 = Quart, Power4 = Quint
 */

export type Easing = (t: number) => number;

const TAU = Math.PI * 2;

export const linear: Easing = (t) => t;

/** GSAP `power2.out` — cubic out. */
export const power2Out: Easing = (t) => 1 - Math.pow(1 - t, 3);

/** GSAP `power3.out` — quart out. */
export const power3Out: Easing = (t) => 1 - Math.pow(1 - t, 4);

/** GSAP `power4.out` — quint out. */
export const power4Out: Easing = (t) => 1 - Math.pow(1 - t, 5);

/** GSAP `power4.inOut` — quint in-out. */
export const power4InOut: Easing = (t) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

/** GSAP `sine.inOut`. */
export const sineInOut: Easing = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * GSAP `back.out(overshoot)`.
 *
 * f(t) = 1 + (s+1)(t-1)³ + s(t-1)²
 *
 * The reference uses overshoots 1.2, 1.4, 1.5, 1.7 and 2.
 */
export const backOut =
  (overshoot = 1.70158): Easing =>
  (t) => {
    const p = t - 1;
    return 1 + (overshoot + 1) * p * p * p + overshoot * p * p;
  };

/**
 * GSAP `elastic.out(amplitude, period)`.
 *
 * Ported directly from GSAP's EasePack so the overshoot count, decay and
 * settle time match. Note that an amplitude below 1 is clamped for the
 * magnitude term but still shortens the period — that asymmetry is GSAP's,
 * and the reference depends on it (it calls `elastic.out(0.8, 0.4)` and
 * `elastic.out(0.7, 0.4)`, which differ only through this path).
 */
export const elasticOut = (amplitude = 1, period = 0.3): Easing => {
  const p1 = amplitude >= 1 ? amplitude : 1;
  const rawPeriod = period / (amplitude < 1 ? amplitude : 1);
  const p3 = (rawPeriod / TAU) * (Math.asin(1 / p1) || 0);
  const p2 = TAU / rawPeriod;

  return (t) =>
    t === 1 ? 1 : p1 * Math.pow(2, -10 * t) * Math.sin((t - p3) * p2) + 1;
};

/* ------------------------------------------------------------------ */
/* Pre-built instances for the exact configurations the reference uses  */
/* ------------------------------------------------------------------ */

export const backOut12 = backOut(1.2);
export const backOut14 = backOut(1.4);
export const backOut15 = backOut(1.5);
export const backOut17 = backOut(1.7);
export const backOut20 = backOut(2);

export const elasticOut08_04 = elasticOut(0.8, 0.4);
export const elasticOut07_04 = elasticOut(0.7, 0.4);
export const elasticOut10_07 = elasticOut(1, 0.7);
