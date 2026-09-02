export type ClassValue = string | false | null | undefined;

/** Minimal className joiner — no dependency needed for this project's needs. */
export const cn = (...classes: ClassValue[]) => classes.filter(Boolean).join(" ");
