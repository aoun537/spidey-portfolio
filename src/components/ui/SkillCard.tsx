"use client";

import { motion } from "motion/react";
import type { Skill } from "@/data/skills";
import { SKILL_CARD } from "@/lib/motion-config";

/**
 * One cell of the skills matrix. A crimson panel wipes across from the left on
 * hover and every foreground element inverts against it.
 */
export function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.li
      variants={SKILL_CARD(index)}
      className="group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-gray-50/90 px-5 py-3.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-spidey hover:shadow-[0_8px_20px_rgba(163,21,21,0.15)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 z-0 -translate-x-full bg-spidey transition-transform duration-400 ease-out group-hover:translate-x-0"
      />

      <div className="relative z-10 flex items-center gap-3">
        <span
          aria-hidden
          className="h-2 w-2 rounded-full bg-spidey shadow-[0_0_8px_rgba(163,21,21,0.6)] transition-colors duration-300 group-hover:bg-white"
        />
        <span className="flex flex-col">
          <span className="text-sm font-black tracking-tight text-gray-900 uppercase transition-colors duration-300 group-hover:text-white md:text-base">
            {skill.name}
          </span>
          <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase transition-colors duration-300 group-hover:text-gray-200">
            {skill.category}
          </span>
        </span>
      </div>

      <div className="relative z-10">
        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold tracking-wider text-gray-700 uppercase shadow-sm transition-colors duration-300 group-hover:bg-black group-hover:text-white">
          {skill.level}
        </span>
      </div>
    </motion.li>
  );
}
