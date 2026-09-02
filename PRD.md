# PRD — Spidey Portfolio Replication

A pixel-faithful rebuild of **https://spydyy-portfolio.vercel.app/** on Next.js + TypeScript + Tailwind CSS v4 + Framer Motion.

---

## 1. Project Overview

### Purpose
A single-page personal portfolio for **Syed Aoun**, an AI-Powered Web Developer based in Jhelum, Pakistan. The site is built around one conceit: a **Spider-Man "Behind the Mask" identity reveal**. The hero stacks a masked Spider-Man portrait over the owner's real portrait and lets the visitor's cursor punch a soft spotlight hole through the mask to reveal the face beneath. Every subsequent section carries the motif forward — hand-drawn spider webs drifting in the background, a Spider-Man hanging from a thread off the top of the viewport, comic-style hard-offset text shadows, and a crimson `#a31515` accent.

### Reference
- **URL:** https://spydyy-portfolio.vercel.app/
- **Document title:** `hero`
- **Deployed stack (verified from the built bundle):** Vite + React 19 + Tailwind CSS v4 + **GSAP 3.15 with ScrollTrigger**. AOS (`aos`) is imported and `AOS.init()` is called but **no element carries a `data-aos` attribute** — it is a dead dependency in the reference.
- **Bundle inspected:** `/assets/index-7gpe6wYR.js` (347 KB) and `/assets/index-BPMueBD_.css` (65 KB). The app source was fully recoverable from the minified bundle, so every class name, animation parameter, easing, duration, stagger and string of copy in this PRD is transcribed from the reference rather than estimated.

### Replication Goals
1. Reproduce the visual identity exactly: layout, spacing, typography, color, shadows, radii, decorative asset placement.
2. Reproduce the hero mask-reveal interaction and its motion feel **using Framer Motion instead of GSAP**, matching GSAP's easing curves numerically rather than approximating them with generic CSS easings.
3. Reproduce every scroll-triggered reveal, idle loop, and hover state.
4. Reproduce the real responsive behavior at 1440 / 1280 / 1024 / 768 / 480 / 375.
5. Ship production-quality Next.js: typed, componentized, content-driven, accessible, `prefers-reduced-motion`-aware.

### Deliberate deviations from the reference
These are the only places the rebuild will not copy the reference 1:1, each for a concrete reason:

| Deviation | Reason |
|---|---|
| Framer Motion replaces GSAP + ScrollTrigger | Explicit project requirement. GSAP easings are reimplemented exactly (§7.1) so the *motion* is preserved even though the *engine* changes. |
| `AOS` is not installed | Dead code in the reference; installing it would be an unnecessary dependency. |
| `id="about"` added to the About section | The reference navbar links to `#about` but the About `<section>` has no `id` — the link is broken there. A broken link is disallowed by the build requirements. |
| Mobile hamburger opens a real menu | The reference renders a hamburger `<button>` with no `onClick` and no state — it does nothing. A dead control is a defect; the menu is styled to match the navbar's existing black/red language and adds no new design vocabulary. |
| `/syed-aoun-resume.pdf` is generated and served | The reference links `/sde_resume.pdf`, which returns **404**. A generated one-page PDF, built only from the facts on this page, keeps the download control honest. |
| Favicon uses the site's own spider artwork | The reference `favicon.svg` is the unmodified **bolt.new** logo (a purple lightning bolt) left over from scaffolding — an unrelated third party's brand mark, and off-theme. |
| AVIF/WebP served via `next/image` | Same pixels, smaller payload. `image-2` alone is 1.9 MB as shipped by the reference. |

---

## 2. Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Required. Single route (`/`); sections are client components where they animate. |
| Language | **TypeScript** (strict) | Required. |
| Styling | **Tailwind CSS v4** (`@tailwindcss/postcss`, CSS-first `@theme`) | The reference *is* Tailwind v4 — confirmed by `@layer theme`, `@property` registrations, `oklch()` palette, and dynamic utilities like `duration-400`. Using v4 means class strings transfer verbatim. |
| Animation | **Framer Motion (`motion` v12)** | Required. Used for entrance timelines, scroll reveals, idle loops, marquee, and the hero mask. |
| Fonts | **`next/font/google`** — Outfit (300/400/500/600/700/800/900), JetBrains Mono (300/400/500) | The reference `@import`s exactly these two families from Google Fonts. `next/font` self-hosts them, removing the render-blocking request. |
| Icons | **Inline SVG** | The reference ships **zero icon libraries**. Its only two icons — a download arrow and an external-link arrow — are hand-written inline `<svg>` paths. Adding `lucide-react` would be an unnecessary dependency. |
| Images | **`next/image`** | Optimization + lazy loading for the seven PNGs. |

**Total runtime dependencies: `next`, `react`, `react-dom`, `motion`.** Nothing else.

---

## 3. Design System

### 3.1 Color

| Token | Value | Usage |
|---|---|---|
| `--color-spidey` | `#a31515` | Primary crimson. Eyebrows, headings' shadow layer, buttons, borders, pills, focus rings, marquee bar 1. |
| `--color-spidey-dark` | `#7a0f0f` | Button hover. |
| `--color-spidey-ink` | `#111111` | Marquee bar 2 background. |
| `--color-spidey-blush` | `#fca5a5` (red-300) | Hard 2px offset text-shadow on all section `h2`s. |
| `--color-spidey-flare` | `#ef4444` (red-500) | First shadow layer of the hero `h1`. |
| Page background | `#fafafa` | `body`. Set on `:root` and `body` in the reference. |
| Section backgrounds | `#fff` (Hero shell, Skills, Projects, Contact) · `gray-50` (About) | |
| Text | `gray-900` body · `gray-700` prose · `gray-600` meta · `gray-500` labels · `gray-400` de-emphasis | |
| Navbar (scrolled) | `bg-black/90`, `border-red-900/50` | |
| Navbar link | `gray-400` → `white` on hover; `red-600` underline | |

Glow / shadow colors are all `rgba(163,21,21,α)` — the crimson at 0.15 / 0.25 / 0.3 / 0.4 / 0.5 / 0.6.

### 3.2 Typography

- **Sans:** `"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` — the entire site.
- **Mono:** `"JetBrains Mono", ui-monospace, …` — declared in the theme but **never applied** in the reference. Retained as a token for parity; not used.

Display treatment (the site's signature): `font-black` + `tracking-tighter` + `uppercase` + `italic` + a **hard, un-blurred offset text-shadow**.

| Element | Size ramp | Weight | Extras |
|---|---|---|---|
| Hero `h1` | `text-5xl` → `md:text-6xl` → `lg:text-7xl` | 900 | `tracking-tighter leading-none italic uppercase`, `text-shadow: 4px 4px 0 #ef4444, 7px 7px 0 #a31515` |
| Hero eyebrow | `text-xs` → `md:text-sm` | 700 | `uppercase tracking-[0.2em]`, crimson |
| About `h2` | `text-4xl` → `md:text-5xl` → `lg:text-7xl` | 900 | `text-shadow: 2px 2px 0 #fca5a5` |
| Section `h2` (Skills/Projects/Contact) | `text-3xl` → `md:text-5xl` | 900 | `text-shadow: 2px 2px 0 #fca5a5` |
| Section eyebrow | `text-[10px]` → `md:text-xs` | 700 | `uppercase tracking-[0.2em]`, crimson |
| Body prose (About) | `text-base` → `md:text-lg` | 500 | `text-gray-700 leading-relaxed max-w-xl` |
| Card title | `text-lg` (Projects) · `text-sm`→`md:text-base` (Skills) | 900 | `uppercase tracking-tight` |
| Card body | `text-xs` → `md:text-sm` | 500 | `text-gray-600 leading-relaxed` |
| Tag / level chip | `text-[10px]` / `text-[11px]` | 700 | `uppercase tracking-wider` |
| Marquee item | `text-sm` → `md:text-base` → `lg:text-xl` | 900 | `uppercase italic tracking-widest` |
| Nav logo | `text-2xl` | 900 | `tracking-tighter italic uppercase` |
| Nav link | `text-xs` → `md:text-sm` | 700 | `uppercase tracking-[0.15em]` |

Tailwind's default type scale is unmodified: `xs .75 / sm .875 / base 1 / lg 1.125 / xl 1.25 / 2xl 1.5 / 3xl 1.875 / 4xl 2.25 / 5xl 3 / 6xl 3.75 / 7xl 4.5` rem.

### 3.3 Spacing & Layout

- Spacing unit: `0.25rem` (Tailwind default).
- **Section padding:** Hero `h-screen` (no padding) · About `py-24` + `min-h-screen` · Skills/Projects/Contact `py-16`.
- **Horizontal gutters:** `px-6` → `md:px-16` → `lg:px-24` (Skills/Projects/Contact) · `px-6` → `md:px-12` → `lg:px-24` (About container, Navbar uses `px-6 md:px-12`).
- **Container widths:** Navbar `max-w-7xl` (80rem) · About `.container` (Tailwind v4 breakpoint container: 40/48/64/80/96rem) · Skills & Projects grids `max-w-4xl` (56rem) · Contact card `max-w-2xl` (42rem) · About prose `max-w-xl` (36rem) · Hero copy block `max-w-lg` (32rem).
- **Grid gaps:** Skills `gap-3 md:gap-4` · Projects `gap-4 md:gap-6` · About columns `gap-12 lg:gap-20` · Contact form `gap-5` / fields `gap-4`.

### 3.4 Radii

`rounded-md` (project tags) · `rounded-lg` (hero buttons) · `rounded-xl` (tech pills, skill cards, form inputs, submit) · `rounded-2xl` (project cards, contact card) · `rounded-full` (About photo frame, status dot, level chips, section divider).

### 3.5 Shadows

| Name | Value | Where |
|---|---|---|
| Card rest | `shadow-sm` | Skill / project / contact cards, pills |
| Skill hover | `0 8px 20px rgba(163,21,21,0.15)` | |
| Project hover | `0 10px 25px rgba(163,21,21,0.15)` | |
| Pill hover | `0 8px 20px rgba(163,21,21,0.3)` | |
| Hero primary hover | `0 10px 20px rgba(163,21,21,0.4)` | |
| Hero secondary hover | `0 10px 20px rgba(0,0,0,0.2)` | |
| Submit rest / hover | `0 4px 15px rgba(163,21,21,0.3)` / `0 6px 20px rgba(163,21,21,0.5)` | |
| Navbar scrolled | `0 4px 30px rgba(220,38,38,0.15)` | |
| Marquee bar 1 / 2 | `0 10px 20px rgba(0,0,0,0.4)` / `0 5px 15px rgba(0,0,0,0.5)` | |
| Status dot | `0 0 8px rgba(163,21,21,0.6)` | |
| Nav underline | `0 0 8px rgba(220,38,38,0.8)` | |
| Photo frame (animated) | `0 15px 35px rgba(163,21,21,0.25)` pulsing | |

### 3.6 Gradients & Glass

- **Web threads:** `bg-gradient-to-b from-transparent to-gray-300` (About, `1px`), `… to-gray-400 opacity-60` (Skills/Contact, `2px`).
- **Photo thread:** `bg-gradient-to-b from-transparent via-[#a31515]/60 to-[#a31515]`, `2px`.
- **Hero cursor mask:** `radial-gradient(circle {size}px at {x}px {y}px, rgba(0,0,0,{alpha}) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,1) 100%)` applied as `mask-image` to the top layer.
- **Glass:** `bg-gray-50/90 backdrop-blur-sm` on skill cards, project cards and the contact card; `bg-black/90 backdrop-blur-md` on the scrolled navbar.
- **Blend:** every decorative web uses `mix-blend-multiply` at `opacity-50` (hero) or `opacity-[0.12]` (About) or `opacity-[0.04]` (Skills/Projects/Contact).

### 3.7 Breakpoints

Tailwind v4 defaults, and the reference only ever uses `sm` / `md` / `lg`:

| Token | Min-width |
|---|---|
| `sm` | 40rem / 640px |
| `md` | 48rem / 768px |
| `lg` | 64rem / 1024px |
| `xl` | 80rem / 1280px (container only) |
| `2xl` | 96rem / 1536px (container only) |

### 3.8 Scrollbar

`6px` wide · track `#fafafa` · thumb `#e4e4e7` (`3px` radius) · thumb hover `#d4d4d8`.

---

## 4. Component Architecture

```
src/
├─ app/
│  ├─ layout.tsx            Fonts, metadata, JSON-LD, <body>
│  ├─ page.tsx              Section composition
│  └─ globals.css           Tailwind v4 @theme, base, scrollbar, text-shadow utils
├─ components/
│  ├─ layout/
│  │  └─ Navbar.tsx         Fixed nav, scroll state, desktop links, mobile menu
│  ├─ sections/
│  │  ├─ Hero.tsx           Mask-reveal stage + copy + CTAs
│  │  ├─ Marquee.tsx        Two counter-rotated scrolling bars
│  │  ├─ About.tsx          "Behind the Mask" + hanging photo + tech pills
│  │  ├─ Skills.tsx         10-item matrix + hanging Spider-Man
│  │  ├─ Projects.tsx       4 cards + standing Spider-Man
│  │  └─ Contact.tsx        Form with success state + hanging Spider-Man
│  ├─ motion/
│  │  ├─ MotionProvider.tsx     MotionConfig reducedMotion="user"
│  │  ├─ Reveal.tsx            whileInView wrapper (ScrollTrigger equivalent)
│  │  ├─ RevealGroup.tsx       Staggered children container
│  │  ├─ ClipReveal.tsx        clip-path wipe (About eyebrow / heading)
│  │  ├─ Pendulum.tsx          Infinite yoyo rotation about an origin
│  │  ├─ Drift.tsx            Infinite yoyo translate / scale / opacity
│  │  ├─ SpinLoop.tsx         Infinite linear rotation
│  │  └─ HangingThread.tsx    Gradient thread + suspended child
│  └─ ui/
│     ├─ SectionHeading.tsx  Eyebrow + h2 + crimson rule
│     ├─ WebBackdrop.tsx     Positioned decorative web
│     ├─ TechPill.tsx
│     ├─ SkillCard.tsx
│     ├─ ProjectCard.tsx
│     ├─ Field.tsx           Labeled input / textarea
│     ├─ ButtonPrimary.tsx / ButtonDark.tsx
│     └─ icons/              DownloadIcon, ExternalLinkIcon, MenuIcon, CloseIcon
├─ data/
│  ├─ site.ts               Name, tagline, nav links, resume path
│  ├─ about.ts              Eyebrow, heading, paragraphs, tech stack
│  ├─ skills.ts             10 × { name, category, level }
│  ├─ projects.ts           4 × { title, description, tags, link }
│  └─ marquee.ts            5 marquee phrases
└─ lib/
   ├─ easings.ts            GSAP-equivalent easing functions
   ├─ variants.ts           Shared Framer Motion variants
   ├─ motion-config.ts      Durations, staggers, viewport margins
   └─ cn.ts                 className joiner
```

---

## 5. Page Structure (in order)

1. **Navbar** — fixed, overlays everything (`z-50`).
2. **Hero** — `h-screen`, cursor mask reveal.
3. **Marquee** — `h-[20vh] md:h-[30vh]`, two crossed bars. *(Rendered by the same `<main>` as the hero in the reference; kept as its own component here.)*
4. **About** — `#about`, `min-h-screen`, `bg-gray-50`.
5. **Skills** — `#skills`, `bg-white`, `border-t border-gray-100`.
6. **Projects** — `#projects`, `bg-white`, `border-t border-gray-100`.
7. **Contact** — `#contact`, `bg-white`, `border-t border-gray-100`.

**There is no footer.** The reference's `App` renders exactly `<Navbar/><Hero/><About/><Skills/><Projects/><Contact/>` and the page ends at the contact card. This is reproduced as-is.

---

## 6. Content

All copy lives in `src/data/*` — the components read from it and never hard-code a
string. Swapping the site's owner means editing those six files and one image.

### Identity
| Field | Value |
|---|---|
| Name | Syed Aoun |
| Role | AI-Powered Web Developer |
| Location | Jhelum, Pakistan |
| GitHub | https://github.com/aoun537 |
| LinkedIn | https://www.linkedin.com/in/syed-aoun-dev/ |
| Portfolio | https://syed-aoun.vercel.app/ |

Positioning: *AI-Powered Web Developer building modern websites and AI-powered web applications that turn ideas into real digital experiences.*

### Hero
- Eyebrow: `AI-Powered Web Developer`
- Heading: `SYED` / `AOUN.` (explicit `<br>`)
- Supporting: *"I build modern websites and AI-powered web applications that are fast, functional, responsive, and designed to create real impact."*
- CTAs: `Explore Projects` (crimson) · `syed_aoun_resume.pdf` (near-black, download icon)

### Marquee
`FRONTEND DEVELOPMENT` · `UI/UX DESIGN` · `GSAP ANIMATIONS` · `REACT NATIVE` · `FULL STACK ENGINEER`
Separated by alternating spider / web images (even index → spider, odd → web).

### About
- Eyebrow: spider icon + `Behind the Mask`
- Heading: `Syed Aoun.`
- P1: *"I'm an AI-Powered Web Developer focused on creating modern, responsive, and high-performance websites and web applications. I combine modern frontend technologies with AI-powered development workflows to transform ideas into practical digital products."*
- P2: *"Based in Jhelum, Pakistan, I work with React, Next.js, TypeScript and Tailwind CSS — turning ideas into real digital experiences that are fast, functional, and built to make an impact."*
- `Primary Tech Stack`: React · Next.js · TypeScript · Tailwind CSS · JavaScript · OpenAI APIs

### Skills — eyebrow `Arsenal & Expertise`, heading `TECHNICAL SKILLS.`

Ten entries fill the 2×5 grid exactly. Levels are a self-assessment.

| Name | Category | Level |
|---|---|---|
| React / Next.js | Frontend | Advanced |
| JavaScript / TS | Languages | Advanced |
| Tailwind CSS | Frontend | Advanced |
| HTML & CSS | Frontend | Advanced |
| AI-Assisted Dev | AI | Advanced |
| Prompt Engineering | AI | Advanced |
| OpenAI APIs | AI | Proficient |
| AI Integration | AI | Proficient |
| Git & GitHub | Tools | Advanced |
| Claude Code & Copilot | Tools | Advanced |

### Projects — eyebrow `Featured Works`, heading `PROJECTS.`

| Title | Tags | Live | Source |
|---|---|---|---|
| AI-Powered Developer Portfolio | Next.js · React · TypeScript | syed-aoun.vercel.app | github.com/aoun537/my-portfolio |
| Clear Flow Plumbing | Next.js · React · Tailwind CSS | clear-flow-plumbing.vercel.app | github.com/aoun537/clear-flow-plumbing |

Three tags per card keeps the tag row on one line once the `Source` chip joins it.

### Contact — eyebrow spider icon + `Get In Touch`, heading `CONTACT.`
Fields: `Your Name` / placeholder `Peter Parker` · `Your Email` / `peter@stark.com` · `Message` / `Let's build something amazing together...` (4 rows). Submit: `Send Message`.
Success state: crimson `✓` disc (bouncing), `Message Sent!`, *"Thanks for reaching out. I'll get back to you shortly."*, auto-reverting after **4000 ms**.

---

## 7. Animation Specification

Every value below is transcribed from the reference's GSAP calls.

### 7.1 Easing translation layer (`src/lib/easings.ts`)

GSAP eases are re-implemented as pure `(t: number) => number` functions so Framer Motion produces numerically identical curves.

| GSAP | Implementation |
|---|---|
| `power2.out` | `1 - (1-t)³` |
| `power3.out` | `1 - (1-t)⁴` (GSAP's Power3 = Quart) |
| `power4.out` | `1 - (1-t)⁵` |
| `power4.inOut` | quintInOut |
| `sine.inOut` | `-(cos(πt) - 1) / 2` |
| `back.out(s)` | `1 + (s+1)(t-1)³ + s(t-1)²`, generated per overshoot — the site uses **1.2, 1.4, 1.5, 1.7, 2** |
| `elastic.out(a, p)` | GSAP's exact formula: `p1 = max(a,1)`, `p2 = p / min(a,1)`, `p3 = p2/2π · asin(1/p1)`, `p2 = 2π/p2`, `f(t) = p1·2^(-10t)·sin((t-p3)·p2) + 1` — used at **(0.8, 0.4)**, **(0.7, 0.4)**, **(1, 0.7)** |
| `none` / `linear` | `t` |

### 7.2 ScrollTrigger translation

`toggleActions: "play none none reverse"` → `whileInView` with `viewport={{ once: false }}`, so a section replays on re-entry and reverses on exit — matching the reference exactly.

`start: "top X%"` → `viewport.margin = "0px 0px -(100-X)% 0px"`.
- `top 70%` (About) → `margin: "0px 0px -30% 0px"`
- `top 80%` (Skills, Projects, Contact) → `margin: "0px 0px -20% 0px"`

### 7.3 Hero — page load timeline (`defaults: { ease: back.out(1.7) }`)

Sequential, with negative offsets producing overlap:

| # | Target | From | To | Duration | Ease | Offset |
|---|---|---|---|---|---|---|
| 1 | Web layer children (2) | `opacity 0, scale .5` | `opacity .5, scale 1` | 2.0 s | `power3.out` | 0, **stagger 0.4** |
| 2 | Eyebrow | `x -100, opacity 0` | `x 0, opacity 1` | 1.2 s | `back.out(1.7)` | `-=1.5` |
| 3 | `h1` | `x -150, opacity 0, skewX -15` | `x 0, opacity 1, skewX 0` | 1.2 s | `back.out(1.7)` | `-=1.0` |
| 4 | CTA children (2) | `y 40, opacity 0` | `y 0, opacity 1` | 0.8 s | `back.out(2)` | `-=0.8`, **stagger 0.15** |

GSAP's `-=n` positions are measured from the *timeline's current end*, so the resolved absolute start times are: webs **0.00 / 0.40**, eyebrow **0.90**, `h1` **1.40**, CTAs **1.80 / 1.95** (full entrance runs 2.75 s). These are implemented as explicit `delay`s on Framer Motion variants — a `staggerChildren` container cannot express negative overlaps.

### 7.4 Hero — the mask reveal (the centerpiece)

Two absolutely-positioned, full-bleed `object-cover` images:
- **`z-10` bottom layer** — `image-2`, the unmasked portrait.
- **`z-20` top layer** — `image-1`, the Spider-Man mask, carrying a live `mask-image`.

A single state object drives it: `{ x, y, alpha, size }`, initialised to `{ innerWidth/2, innerHeight/2, 1, 50 }`.

```
mask-image: radial-gradient(circle {size}px at {x}px {y}px,
              rgba(0,0,0,{alpha}) 0%,
              rgba(0,0,0,0.85)   40%,
              rgba(0,0,0,1)      100%)
mask-repeat: no-repeat        (+ -webkit- prefixes)
```

Because mask alpha = visibility of the **top** layer, `alpha → 0` opens a hole in the mask and the real face shows through.

| Event | Animation |
|---|---|
| `pointermove` | `x → clientX`, `y → clientY`, **0.3 s, `power4.out`**, restarted each move (GSAP `quickTo` semantics) |
| `pointerenter` | `alpha → 0`, `size → 700`, **0.8 s, `elastic.out(1, 0.7)`**, overwrite |
| `pointerleave` | `alpha → 1`, `size → 50`, **1.2 s, `power4.inOut`**, overwrite |

Framer Motion implementation: four `useMotionValue`s composed through `useMotionTemplate` into the gradient string and bound to `style.maskImage` / `style.WebkitMaskImage`. Pointer handlers call `animate(mv, target, opts)`, which supersedes the previous animation on that value — the direct analogue of `gsap.quickTo` / `overwrite: "auto"`. No React re-render occurs on pointer move. Section cursor is `cursor-crosshair`.

**Touch / reduced motion:** the effect is pointer-driven and inert on touch, exactly as in the reference (the mask simply rests at `alpha 1`, showing the masked portrait). Under `prefers-reduced-motion` the hole is opened statically at a fixed centre so the reveal concept still reads without motion.

### 7.5 Hero — idle loops (created at mount, alongside the entrance)

| Target | Animation |
|---|---|
| Both web images | `rotation 0 → 360°`, **120 s**, `linear`, infinite |
| Both web images | `scale 0.5 ↔ 1.1`, **4 s** per leg, `sine.inOut`, yoyo infinite — see §7.13 |

### 7.6 Marquee

| Element | Animation |
|---|---|
| Bar 1 inner track | `x: 0 → -50%`, **15 s**, `none`, infinite |
| Bar 2 inner track | set `x: -50%`, then `→ 0%`, **20 s**, `none`, infinite |
| `.marquee-text` spans | `y → -4`, **0.8 s**, `sine.inOut`, yoyo infinite, **stagger 0.1** |
| Section `mouseenter` | both track timelines `timeScale → 0.1` over **0.8 s**, `power2.out` |
| Section `mouseleave` | `timeScale → 1` over **0.8 s**, `power2.out` |

Framer Motion equivalent: `animate()` returns `AnimationPlaybackControls` exposing a writable `speed`; a helper tween drives `speed` from 1 → 0.1 with `power2.out` over 0.8 s. Track content is duplicated ×2 so the `-50%` shift loops seamlessly.

Bar geometry: both `w-[110vw]`, `h-12 md:h-16 lg:h-20`, `scale-105`, `border-y-[3px]`.
Bar 1 — `bg-[#a31515] text-white border-black rotate-[4deg] -translate-y-4 md:-translate-y-6 z-20`.
Bar 2 — `bg-[#111111] text-[#a31515] border-[#a31515] rotate-[-4deg] translate-y-4 md:translate-y-6 z-10`.

### 7.7 About (`start: top 70%`, `end: bottom center`)

| # | Target | From | To | Duration | Ease | Offset |
|---|---|---|---|---|---|---|
| 1 | Both hanging webs | `y -600, opacity 0` | `y 0, opacity 1` | 1.8 s | `elastic.out(0.8, 0.4)` | 0, **stagger 0.3** |
| 2 | Eyebrow | `x -50, opacity 0`, `clip-path polygon(0 0, 0 0, 0 100%, 0 100%)` | `x 0, opacity 1`, full rect | 0.8 s | `power3.out` | `-=1.4` |
| 3 | `h2` | `y 50, opacity 0`, `clip-path polygon(0 100%, 100% 100%, 100% 100%, 0 100%)` | `y 0, opacity 1`, full rect | 0.8 s | `power3.out` | `-=1.0` |
| 4 | Photo assembly | `y -800, opacity 0` | `y 0, opacity 1` | 1.8 s | `elastic.out(0.7, 0.4)` | `-=0.8` |
| 5 | Paragraphs (2) | `y 40, opacity 0, rotateX -45°` | `y 0, opacity 1, rotateX 0` | 1.0 s | `back.out(1.2)` | `-=1.2`, **stagger 0.15** |
| 6 | Tech pills (6) | `scale .5, opacity 0, y 20` | `scale 1, opacity 1, y 0` | 0.5 s | `back.out(1.5)` | `-=0.8`, **stagger 0.1** |

Resolved absolute start times: webs **0.00 / 0.30**, eyebrow **0.70**, `h2` **1.10**, photo **1.30**, paragraphs **1.90 / 2.05**, pills **2.30 → 2.80** (0.1 apart).

The paragraph wrapper carries `perspective: 1000px` and children `transform-origin: bottom` so the `rotateX` reads as a 3-D card flip-up.

**Idle loops:**
- Photo assembly — `rotate → 2.5°`, origin `top center`, **3.2 s**, `sine.inOut`, yoyo infinite, **delay 2 s** (a pendulum swing on its web thread).
- `.bg-web-left` — `rotate 360°`, **70 s**, linear, infinite.
- `.bg-web-right` — `rotate -360°`, **90 s**, linear, infinite.
- `.glow-frame` — `box-shadow → 0 15px 35px rgba(163,21,21,0.25)`, **2 s**, `sine.inOut`, yoyo infinite.
- `.tech-pill` — `y 20 ↔ -4`, **1.5 s** per leg, `sine.inOut`, yoyo infinite, **stagger `{ each: 0.2, from: "random" }`**, delay 1.5 s. The lower bound is 20, not 0 — see §7.13. (The randomised offsets are a fixed permutation so SSR and client agree.)

**Hover:** photo frame `group-hover:scale-105` (500 ms); photo `grayscale → grayscale-0` (700 ms).

### 7.8 Skills (`start: top 80%`)

| # | Target | From | To | Duration | Ease | Offset |
|---|---|---|---|---|---|---|
| 1 | Header block | `y 20, opacity 0` | `y 0, opacity 1` | 0.6 s | `power3.out` | 0 |
| 2 | `.matrix-item` (10) | `y 30, x -15, opacity 0` | `y 0, x 0, opacity 1` | 0.5 s | `back.out(1.5)` | `-=0.3`, **stagger 0.04** |

**Idle:** background web `scale → 1.05`, `opacity → 0.06`, **5 s**, `sine.inOut`, yoyo infinite · hanging Spider-Man `rotate → 5°`, origin `top center`, **3.2 s**, `sine.inOut`, yoyo infinite.

**Card hover:** crimson panel wipes in from `-translate-x-full` → `0` (**400 ms**, `ease-out`); card lifts `-translate-y-0.5`; border → crimson; shadow → `0 8px 20px rgba(163,21,21,0.15)`; dot → white; name → white; category → `gray-200`; level chip → black bg / white text.

### 7.9 Projects (`start: top 80%`)

| # | Target | From | To | Duration | Ease | Offset |
|---|---|---|---|---|---|---|
| 1 | Header block | `y 20, opacity 0` | `y 0, opacity 1` | 0.6 s | `power3.out` | 0 |
| 2 | `.project-item` (4) | `y 30, opacity 0` | `y 0, opacity 1` | 0.5 s | `back.out(1.4)` | `-=0.3`, **stagger 0.1** |
| 3 | Standing Spider-Man | `opacity 0` | `opacity 1` | 0.8 s | `back.out(1.7)` | `-=0.4` |

**Idle:** background web `rotate → 8°` (origin `top right`, **6 s**) **and** `scale → 1.1, opacity → 0.07` (**4 s**), both `sine.inOut` yoyo infinite · standing Spider-Man `y 100 ↔ -10`, **2.5 s** per leg, `sine.inOut`, yoyo infinite — a 110px bob, see §7.13.

**Card hover:** crimson `h-1` top rail wipes in from `-translate-x-full` (**500 ms**, `ease-out`); card lifts `-translate-y-1`; border → crimson; title → crimson; external-link icon translates `+1 / -1` and turns crimson; tags gain crimson border/text.

### 7.10 Contact (`start: top 80%`)

| # | Target | From | To | Duration | Ease | Offset |
|---|---|---|---|---|---|---|
| 1 | Header block | `y 20, opacity 0` | `y 0, opacity 1` | 0.6 s | `power3.out` | 0 |
| 2 | Form card | `y 30, opacity 0` | `y 0, opacity 1` | 0.7 s | `back.out(1.4)` | `-=0.3` |

**Idle:** background web `scale → 1.15, opacity → 0.06`, **4.5 s**, `sine.inOut`, yoyo infinite · hanging Spider-Man `rotate → 8°`, origin `top center`, **2 s**, `sine.inOut`, yoyo infinite.

**Success:** the ✓ disc uses Tailwind's `animate-bounce`.

### 7.11 Navbar

`scrollY > 50` toggles between:
- **top:** `bg-transparent border-transparent py-5`
- **scrolled:** `bg-black/90 backdrop-blur-md border-red-900/50 py-3 shadow-[0_4px_30px_rgba(220,38,38,0.15)]`

All via a 300 ms CSS transition. Link underline: `w-0 → w-full`, 300 ms `ease-out`, crimson with an 8px glow. Logo `S` glows `drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]`; `USHMITA.` → `red-500` on hover.

### 7.12 Loops that inherit an entrance's from-value

Three of the reference's idle loops do **not** oscillate around zero, and reproducing them naively produces visibly wrong motion. The cause is a GSAP interaction worth spelling out:

1. A `fromTo` with `immediateRender` (the default) writes its **from**-value to the target the moment the timeline is built — even when the timeline is parked behind a ScrollTrigger.
2. The idle `gsap.to(...)` created immediately afterwards records the element's *current* value as its own start — which is now that from-value.
3. GSAP writes tweens in creation order each tick, so the later loop wins the contested property outright. The entrance's animation of that property **never renders at all**.

The result, measured off the live reference via CDP:

| Target | Property | Naive assumption | Actual, measured |
|---|---|---|---|
| Hero webs | `scale` | 1 → 1.1 | **0.50 ↔ 1.10** (8 s cycle) |
| About tech pills | `y` | 0 → −4 | **20 ↔ −4** (3 s cycle) |
| Projects mascot | `y` | 0 → −10 | **100 ↔ −10** (5 s cycle) |

The rebuild reproduces the *rendered* behaviour: the contested property is removed from the entrance variant and owned entirely by the loop, which is exactly what the reference does on screen. The affected entrance variants therefore animate opacity (and scale, for the pills) only. Verified: my build measures 0.50–1.09, −4.0–20.0, and −9.4–98.9 respectively.

### 7.13 Reduced motion

`useReducedMotion()` gates every loop primitive (`YoyoLoop`, `SpinLoop`, `Pendulum`, `Float`), which fall back to a plain, untransformed element. The marquee tracks hold still, the About frame's glow pulse is dropped, and the hero mask's transitions become instant — the reveal still follows the pointer, since that is user-driven rather than autonomous motion, but nothing eases, bounces or loops. A CSS `@media (prefers-reduced-motion: reduce)` block in `globals.css` covers the remaining transition/animation declarations. Layout, colour and hover styling are unaffected.

---

## 8. Responsive Specification

### Navbar
- **≥768px:** logo left, four links right (`gap-8`), no hamburger.
- **<768px:** logo left, hamburger right; links collapse into a black/90 blurred panel that slides down beneath the bar, closing on selection.
- Padding `px-6` → `md:px-12`; height `py-5` → `py-3` once scrolled at all widths.

### Hero
- Always `h-screen`. Both portrait layers are `object-cover object-center`, so the framing crops rather than letterboxes at every aspect ratio.
- Copy block is vertically centred and pinned left at `left-6` → `md:left-12` → `lg:left-24`, capped `max-w-lg`.
- `h1` `text-5xl` → `md:text-6xl` → `lg:text-7xl`.
- CTAs `flex-wrap`, so at 375px the resume button drops to a second line.
- Decorative webs are fixed pixel sizes (400px top-left, 500px bottom-right) and deliberately overflow the viewport corners at small widths — reproduced as-is.

### Marquee
- Height `20vh` → `md:30vh`; bar height `h-12` → `md:h-16` → `lg:h-20`.
- Vertical offset `∓4` → `md:∓6`; item margin `mx-4` → `md:mx-6`; text `text-sm` → `md:text-base` → `lg:text-xl`.
- Bars stay `110vw` and rotated ±4° at all sizes, so the ends always run off-screen.

### About
- **≥1024px:** two columns (`lg:flex-row`, `lg:items-start`, `gap-20`) — copy left, hanging photo right.
- **<1024px:** `flex-col-reverse` — **the photo moves above the copy**, both centred, `gap-12`, copy gains `mt-10`.
- Photo `w-64 h-64` → `md:w-[340px] md:h-[340px]`; thread `h-[200px]` → `md:h-[350px]`.
- Decorative webs pull outward (`left-[-5%]` → `md:left-[2%]`) and shrink (`w-64` → `md:w-96` / `w-56` → `md:w-80`).
- Heading `text-4xl` → `md:text-5xl` → `lg:text-7xl`.

### Skills
- Grid `grid-cols-1` → `sm:grid-cols-2` (stays 2 at `lg`, never 3 or 4).
- Background web `600px` → `md:800px`; hanging Spider-Man `w-28` → `md:w-40`, `right-8` → `md:right-16`.
- Padding `px-6` → `md:px-16` → `lg:px-24`.

### Projects
- Grid `grid-cols-1` → `sm:grid-cols-2`.
- Standing Spider-Man `w-32` → `md:w-48`, `left-4` → `md:left-12`; anchored `bottom-0`, overlapping the cards at narrow widths exactly as the reference does.

### Contact
- Card `max-w-2xl`, `p-8` at all sizes.
- Name/Email `grid-cols-1` → `sm:grid-cols-2`.
- Hanging Spider-Man `w-40` → `md:w-60`, `right-8` → `md:right-20`, thread `h-24` → `md:h-36`.

### Verified widths
1440 · 1280 · 1024 · 768 · 480 · 375 — checked for horizontal overflow (`body { overflow-x: hidden }` is present in the reference and retained), text clipping, and decorative overlap.

---

## 9. Asset Inventory

The Spider-Man artwork is reused from the reference. Every image of the reference's
owner has been deleted — her hero portrait, her circular About photo and her
résumé are gone from `public/`, and a single owner portrait replaces all of them.

**Spider-Man artwork** (from the reference's `/assets/`)

| Reference path | Local path | Dimensions | Role |
|---|---|---|---|
| `/assets/image-1-fYP2o7gg.png` | `public/images/hero-mask.jpg` | 1600×893 (JPEG) | Hero **top** layer — the mask the cursor cuts through |
| `/assets/web1-770H2sSx.png` | `public/images/spider-web.png` | 500×500 | Decorative web (hero ×2, about ×2, skills, projects, contact, marquee separator) |
| `/assets/spydy-DLbFrGCQ.png` | `public/images/spidey-icon.jpg` | 1600×809 (JPEG) | Small spider mark (about eyebrow, contact eyebrow) + marquee separator |
| `/assets/spydy_hang-Cac1gK30.png` | `public/images/spidey-hang.png` | 340×734 | Hanging Spider-Man (skills, contact) |
| `/assets/spydy_stand-BwBM-zCr.png` | `public/images/spidey-stand.png` | 339×736 | Standing Spider-Man (projects) |

**Owner portrait**

| Local path | Dimensions | Role |
|---|---|---|
| `public/images/aoun-portrait.png` | 1080×1440 (3:4) | Hero **bottom** layer (the face behind the mask) **and** the About circular photo |

One file serves both placements; the framing differences are handled in CSS
(`PORTRAIT_FOCUS` in `Hero.tsx`, `PORTRAIT_FRAMING` in `About.tsx`).

**Generated locally**
| Asset | Note |
|---|---|
| `public/icon.svg` | Spider-web favicon derived from the site's own web artwork (replaces the reference's stray bolt.new logo). |
| `public/syed-aoun-resume.pdf` | One-page résumé built only from the facts on this page; the reference's link 404s. |

**Fonts** — Outfit and JetBrains Mono, self-hosted through `next/font/google`.

**Icons** — two inline SVG paths transcribed from the reference:
- Download: `M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z`
- External link: `M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14`

---

## 10. Implementation Plan

1. **Scaffold** — `create-next-app` (TS, App Router, `src/`), add `motion`, wire Tailwind v4 via `@tailwindcss/postcss`.
2. **Design tokens** — `globals.css`: `@theme` colors/fonts, `#fafafa` body, custom scrollbar, text-shadow utilities.
3. **Assets** — copy the seven PNGs into `public/images/` under semantic names; generate favicon and résumé PDF.
4. **Motion library** — `easings.ts` (GSAP-equivalent curves), `motion-config.ts` (durations/staggers/viewport margins), `variants.ts`, then the `components/motion/*` primitives.
5. **Data layer** — populate `src/data/*` with all transcribed copy.
6. **Navbar** — scroll state, desktop links, mobile menu.
7. **Hero** — layer stack, motion-value mask pipeline, entrance timeline, web loops, CTAs.
8. **Marquee** — duplicated tracks, opposing directions, hover `speed` ramp.
9. **About** — two-column layout, clip-path reveals, 3-D paragraph flip, hanging photo pendulum, tech-pill float.
10. **Skills / Projects / Contact** — shared `SectionHeading`, `WebBackdrop`, hanging decor; card grids; contact form + success state.
11. **Accessibility & SEO** — semantic landmarks, labelled fields, focus-visible rings, `alt` text, metadata + Open Graph + JSON-LD.
12. **QA** — `tsc --noEmit`, `next lint`, `next build`, dev-server pass at all six widths, console check, reduced-motion pass.
13. **Visual audit** — section-by-section comparison against the reference; refine spacing, timing and hover states until they match.
