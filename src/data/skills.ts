export type SkillLevel = "Advanced" | "Proficient";

export type Skill = {
  name: string;
  category: string;
  level: SkillLevel;
};

export const skillsSection = {
  eyebrow: "Arsenal & Expertise",
  heading: "TECHNICAL SKILLS.",
} as const;

/**
 * The grid is two columns of five, so ten entries fill it exactly.
 * Levels are a self-assessment — adjust freely.
 */
export const skills: readonly Skill[] = [
  { name: "React / Next.js", category: "Frontend", level: "Advanced" },
  { name: "JavaScript / TS", category: "Languages", level: "Advanced" },
  { name: "Tailwind CSS", category: "Frontend", level: "Advanced" },
  { name: "HTML & CSS", category: "Frontend", level: "Advanced" },
  { name: "AI-Assisted Dev", category: "AI", level: "Advanced" },
  { name: "Prompt Engineering", category: "AI", level: "Advanced" },
  { name: "OpenAI APIs", category: "AI", level: "Proficient" },
  { name: "AI Integration", category: "AI", level: "Proficient" },
  { name: "Git & GitHub", category: "Tools", level: "Advanced" },
  { name: "Claude Code & Copilot", category: "Tools", level: "Advanced" },
];
