"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { RevealSection } from "@/components/motion/RevealSection";
import { Float, YoyoLoop } from "@/components/motion/Loops";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WebBackdrop } from "@/components/ui/WebBackdrop";
import { projects, projectsSection } from "@/data/projects";
import { images } from "@/data/site";
import {
  MASCOT_FLOAT,
  PROJECT_MASCOT,
  VIEWPORT_TOP_80,
} from "@/lib/motion-config";
import { SECTION_SHELL } from "@/lib/styles";

/**
 * Featured work. The background web pivots about its top-right corner while
 * breathing, and a standing Spider-Man bobs in the bottom-left gutter.
 */
export function Projects() {
  return (
    <RevealSection
      id="projects"
      aria-labelledby="projects-heading"
      viewport={VIEWPORT_TOP_80}
      className={SECTION_SHELL}
    >
      {/* Two independent loops on one web: a slow pivot and a slower breath.
          GSAP sets `transformOrigin: top right` once for both, so the nested
          wrappers each anchor to the same corner. */}
      <div className="pointer-events-none absolute top-0 right-0 z-0 overflow-hidden">
        <YoyoLoop
          keyframes={{ rotate: [0, 8] }}
          duration={6}
          origin="top right"
        >
          <YoyoLoop
            keyframes={{ scale: [1, 1.1], opacity: [0.04, 0.07] }}
            duration={4}
            origin="top right"
            className="mix-blend-multiply"
          >
            <WebBackdrop className="h-[500px] w-[500px] translate-x-1/4 -translate-y-1/4 md:h-[700px] md:w-[700px]" />
          </YoyoLoop>
        </YoyoLoop>
      </div>

      <motion.div
        variants={PROJECT_MASCOT}
        className="pointer-events-none absolute bottom-0 left-4 z-30 md:left-12"
      >
        <Float range={MASCOT_FLOAT}>
          <Image
            src={images.spiderStand}
            alt=""
            aria-hidden
            width={339}
            height={736}
            className="h-auto w-32 object-contain drop-shadow-2xl select-none md:w-48"
          />
        </Float>
      </motion.div>

      <SectionHeading
        eyebrow={projectsSection.eyebrow}
        heading={projectsSection.heading}
        headingId="projects-heading"
      />

      <ul className="z-10 grid w-full max-w-4xl list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 md:gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </ul>
    </RevealSection>
  );
}
