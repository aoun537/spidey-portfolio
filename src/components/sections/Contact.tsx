"use client";

import { motion } from "motion/react";
import { useEffect, useState, type FormEvent } from "react";
import { RevealSection } from "@/components/motion/RevealSection";
import { YoyoLoop } from "@/components/motion/Loops";
import { Field, TextAreaField } from "@/components/ui/Field";
import { HangingMascot } from "@/components/ui/HangingMascot";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WebBackdrop } from "@/components/ui/WebBackdrop";
import { contact } from "@/data/contact";
import { links } from "@/data/site";
import { CONTACT_CARD, VIEWPORT_TOP_80 } from "@/lib/motion-config";
import { SECTION_SHELL } from "@/lib/styles";

/**
 * Contact form. Submitting swaps the card for a confirmation panel that
 * reverts after four seconds — the reference has no backend, and the form is
 * left client-only here rather than inventing an endpoint.
 */
const socials = [
  { label: "GitHub", href: links.github },
  { label: "LinkedIn", href: links.linkedin },
] as const;

export function Contact() {
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!sent) return;
    const timer = window.setTimeout(
      () => setSent(false),
      contact.success.resetAfterMs,
    );
    return () => window.clearTimeout(timer);
  }, [sent]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <RevealSection
      id="contact"
      aria-labelledby="contact-heading"
      viewport={VIEWPORT_TOP_80}
      className={SECTION_SHELL}
    >
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 overflow-hidden">
        <YoyoLoop
          keyframes={{ scale: [1, 1.15], opacity: [0.04, 0.06] }}
          duration={4.5}
          className="mix-blend-multiply"
        >
          <WebBackdrop className="h-[500px] w-[500px] -translate-x-1/4 translate-y-1/4 md:h-[700px] md:w-[700px]" />
        </YoyoLoop>
      </div>

      <HangingMascot
        positionClassName="top-0 right-8 md:right-20"
        threadClassName="h-24 md:h-36"
        imageClassName="w-40 md:w-60 drop-shadow-2xl"
        angle={8}
        duration={2}
      />

      <SectionHeading
        eyebrow={contact.eyebrow}
        heading={contact.heading}
        headingId="contact-heading"
        withMark
      />

      <motion.div
        variants={CONTACT_CARD}
        className="relative z-10 w-full max-w-2xl rounded-2xl border border-gray-200 bg-gray-50/90 p-8 shadow-sm backdrop-blur-sm"
      >
        {sent ? (
          <div
            role="status"
            className="flex flex-col items-center py-12 text-center"
          >
            <div
              aria-hidden
              className="mb-4 flex h-12 w-12 animate-bounce items-center justify-center rounded-full bg-spidey text-xl font-black text-white shadow-md"
            >
              ✓
            </div>
            <h3 className="mb-2 text-xl font-black tracking-tight text-gray-900 uppercase">
              {contact.success.title}
            </h3>
            <p className="text-sm font-medium text-gray-600">
              {contact.success.body}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                name="name"
                label={contact.fields.name.label}
                placeholder={contact.fields.name.placeholder}
              />
              <Field
                name="email"
                type="email"
                label={contact.fields.email.label}
                placeholder={contact.fields.email.placeholder}
              />
            </div>

            <TextAreaField
              name="message"
              label={contact.fields.message.label}
              placeholder={contact.fields.message.placeholder}
              rows={contact.fields.message.rows}
            />

            <button
              type="submit"
              className="mt-2 w-full cursor-pointer rounded-xl bg-spidey py-3.5 text-xs font-bold tracking-widest text-white uppercase shadow-[0_4px_15px_rgba(163,21,21,0.3)] transition-all duration-300 hover:bg-spidey-dark hover:shadow-[0_6px_20px_rgba(163,21,21,0.5)]"
            >
              {contact.submit}
            </button>

            {/* Elsewhere on the web — chips reuse the project-tag styling so
                this adds no new visual vocabulary. */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {socials.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-bold tracking-wider text-gray-500 uppercase transition-colors duration-300 hover:border-spidey hover:bg-spidey hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </form>
        )}
      </motion.div>
    </RevealSection>
  );
}
