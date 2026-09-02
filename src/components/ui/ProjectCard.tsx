"use client";

import { motion } from "motion/react";
import type { Project } from "@/data/projects";
import { ExternalLinkIcon } from "@/components/ui/icons";
import { PROJECT_CARD } from "@/lib/motion-config";

/**
 * A featured-work card. A crimson rail wipes across the top edge on hover and
 * the whole card lifts.
 *
 * The title's anchor carries an `after:inset-0` overlay, so clicking anywhere
 * on the card opens the live site while the markup stays valid — that lets the
 * source-code chip sit above the overlay as a second, separate link instead of
 * being illegally nested inside the first.
 */
export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const chip =
    "rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase transition-colors duration-300";

  return (
    <motion.li variants={PROJECT_CARD(index)} className="flex">
      <article className="group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/90 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-spidey hover:shadow-[0_10px_25px_rgba(163,21,21,0.15)]">
        <div
          aria-hidden
          className="absolute top-0 left-0 h-1 w-full -translate-x-full bg-spidey transition-transform duration-500 ease-out group-hover:translate-x-0"
        />

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight text-gray-900 uppercase transition-colors duration-300 group-hover:text-spidey">
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer noopener"
                className="after:absolute after:inset-0 after:content-['']"
              >
                {project.title}
              </a>
            </h3>
            <ExternalLinkIcon
              aria-hidden
              className="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-spidey"
            />
          </div>
          <p className="mb-6 text-xs leading-relaxed font-medium text-gray-600 md:text-sm">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-gray-200/60 pt-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`${chip} text-gray-600 group-hover:border-spidey/30 group-hover:text-spidey`}
            >
              {tag}
            </span>
          ))}

          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer noopener"
              // Above the title's click overlay so the repo link stays reachable.
              className={`${chip} relative z-10 text-gray-500 hover:border-spidey hover:bg-spidey hover:text-white`}
            >
              Source
            </a>
          ) : null}
        </div>
      </article>
    </motion.li>
  );
}
