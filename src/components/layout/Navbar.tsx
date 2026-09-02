"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { navLinks, site } from "@/data/site";
import { power3Out } from "@/lib/easings";
import { cn } from "@/lib/cn";

/**
 * Fixed navigation. Transparent over the hero, then condensing into a blurred
 * black bar with a crimson glow once the page has scrolled past 50px —
 * matching the reference's single `scrollY > 50` breakpoint.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu once the viewport is wide enough to show the
  // inline links, so the panel can't be stranded open on rotate/resize.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed top-0 left-0 z-50 w-full border-b transition-all duration-300",
        scrolled || menuOpen
          ? "border-red-900/50 bg-black/90 py-3 shadow-[0_4px_30px_rgba(220,38,38,0.15)] backdrop-blur-md"
          : "border-transparent bg-transparent py-5",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12">
        <Link
          href="/"
          className="group flex items-center text-2xl font-black tracking-tighter text-white uppercase italic"
        >
          <span className="text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">
            {site.logo.lead}
          </span>
          <span className="transition-colors duration-300 group-hover:text-red-500">
            {site.logo.rest}
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="group relative text-xs font-bold tracking-[0.15em] text-gray-400 uppercase transition-colors duration-300 hover:text-white md:text-sm"
            >
              {item}
              <span
                aria-hidden
                className="absolute -bottom-2 left-0 h-[2px] w-0 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] transition-all duration-300 ease-out group-hover:w-full"
              />
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="text-gray-400 transition-colors hover:text-red-600 md:hidden"
        >
          {menuOpen ? (
            <CloseIcon className="h-7 w-7" />
          ) : (
            <MenuIcon className="h-7 w-7" />
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen ? (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: power3Out }}
            className="overflow-hidden md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 pt-4 pb-1">
              {navLinks.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-red-900/30 py-3 text-sm font-bold tracking-[0.15em] text-gray-400 uppercase transition-colors duration-300 last:border-b-0 hover:text-white"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
