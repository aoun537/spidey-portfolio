"use client";

import { RevealSection } from "@/components/motion/RevealSection";
import { YoyoLoop } from "@/components/motion/Loops";
import { HangingMascot } from "@/components/ui/HangingMascot";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillCard } from "@/components/ui/SkillCard";
import { WebBackdrop } from "@/components/ui/WebBackdrop";
import { skills, skillsSection } from "@/data/skills";
import { VIEWPORT_TOP_80 } from "@/lib/motion-config";
import { SECTION_SHELL } from "@/lib/styles";

/** The skills matrix, watched over by a Spider-Man dangling from the top-right. */
export function Skills() {
  return (
    <RevealSection
      id="skills"
      aria-labelledby="skills-heading"
      viewport={VIEWPORT_TOP_80}
      className={SECTION_SHELL}
    >
      {/* Breathing web behind the grid. Opacity and blend share this element. */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <YoyoLoop
          keyframes={{ scale: [1, 1.05], opacity: [0.04, 0.06] }}
          duration={5}
          className="mix-blend-multiply"
        >
          <WebBackdrop className="h-[600px] w-[600px] md:h-[800px] md:w-[800px]" />
        </YoyoLoop>
      </div>

      <HangingMascot
        positionClassName="top-0 right-8 md:right-16"
        threadClassName="h-16 md:h-24"
        imageClassName="w-28 md:w-40 drop-shadow-lg"
        angle={5}
        duration={3.2}
      />

      <SectionHeading
        eyebrow={skillsSection.eyebrow}
        heading={skillsSection.heading}
        headingId="skills-heading"
      />

      <ul className="z-10 grid w-full max-w-4xl list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 md:gap-4">
        {skills.map((skill, index) => (
          <SkillCard key={skill.name} skill={skill} index={index} />
        ))}
      </ul>
    </RevealSection>
  );
}
