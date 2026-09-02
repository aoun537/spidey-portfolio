export type Project = {
  title: string;
  description: string;
  tags: readonly string[];
  /** Live deployment — the card links here. */
  link: string;
  /** Source repository — surfaced as a chip in the card's tag row. */
  repo?: string;
};

export const projectsSection = {
  eyebrow: "Featured Works",
  heading: "PROJECTS.",
} as const;

/**
 * Three tags keeps the card's tag row on a single line once the "Source"
 * chip is added, matching the reference's layout.
 */
export const projects: readonly Project[] = [
  {
    title: "Shiv Roofing Service",
    description:
      "A conversion-focused marketing site for a family-run roofing company in West London, turning local search traffic into quote requests through plain-spoken trust signals and a low-friction enquiry flow.",
    tags: ["Next.js", "React", "Tailwind CSS"],
    link: "https://shiv-roofing-mu.vercel.app/",
  },
  {
    title: "AI-Powered Developer Portfolio",
    description:
      "A modern personal portfolio showcasing my work, skills, projects, and capabilities as an AI-Powered Web Developer.",
    tags: ["Next.js", "React", "TypeScript"],
    link: "https://syed-aoun.vercel.app/",
    repo: "https://github.com/aoun537/my-portfolio",
  },
  {
    title: "Clear Flow Plumbing",
    description:
      "A professional and responsive website built for an emergency plumbing business, focused on providing a strong online presence and making it easy for customers to get in touch.",
    tags: ["Next.js", "React", "Tailwind CSS"],
    link: "https://clear-flow-plumbing.vercel.app/",
    repo: "https://github.com/aoun537/clear-flow-plumbing",
  },
];
