/**
 * Site-wide identity and content. Everything the page says about its owner
 * lives here — edit this file, not the components.
 */

export const site = {
  name: "Syed Aoun",
  role: "AI-Powered Web Developer",
  location: "Jhelum, Pakistan",

  /** The hero splits the name across two lines with an explicit break. */
  heroLines: ["SYED", "AOUN."] as const,
  /** Navbar logo: the first character is accented, the rest follows. */
  logo: { lead: "A", rest: "OUN." },

  eyebrow: "AI-Powered Web Developer",
  heroSupporting:
    "I build modern websites and AI-powered web applications that are fast, functional, responsive, and designed to create real impact.",

  title: "Syed Aoun | AI-Powered Web Developer",
  description:
    "Syed Aoun is an AI-Powered Web Developer building modern websites and AI-powered web applications using React, Next.js, TypeScript, and modern web technologies.",
  url: "https://syed-aoun.vercel.app",

  resumeHref: "/syed-aoun-resume.pdf",
  resumeLabel: "syed_aoun_resume.pdf",
  primaryCta: "Explore Projects",
  primaryCtaHref: "#projects",
} as const;

export const links = {
  github: "https://github.com/aoun537",
  linkedin: "https://www.linkedin.com/in/syed-aoun-dev/",
  portfolio: "https://syed-aoun.vercel.app/",
} as const;

export const navLinks = ["About", "Skills", "Projects", "Contact"] as const;

export const images = {
  /** Hero top layer — the Spider-Man mask the cursor cuts through. */
  heroMask: "/images/hero-mask.jpg",
  /** Hero bottom layer + About portrait — the face behind the mask. */
  portrait: "/images/aoun-portrait.png",
  web: "/images/spider-web.png",
  spiderIcon: "/images/spidey-icon.jpg",
  spiderHang: "/images/spidey-hang.png",
  spiderStand: "/images/spidey-stand.png",
} as const;
