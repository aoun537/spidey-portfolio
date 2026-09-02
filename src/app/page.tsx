import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";

/**
 * Single-page composition, in the reference's order. There is no footer — the
 * reference ends on the contact card, and that is reproduced as-is.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex w-full flex-col overflow-hidden bg-white">
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
