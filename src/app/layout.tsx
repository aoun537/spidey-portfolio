import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { links, site } from "@/data/site";
import "./globals.css";

/**
 * The reference requests Outfit at 300–700 only, yet styles every heading
 * `font-black` (900) — so the browser synthesises the weight. Loading the same
 * range reproduces that rendering; pulling in a real 900 cut would make the
 * headings noticeably different from the reference.
 */
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

/**
 * Declared in the reference's theme but never applied to an element. Kept for
 * token parity with `preload: false`, so the file is never actually fetched.
 */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    "AI-powered web developer",
    "web developer",
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "AI integration",
    "prompt engineering",
    "Jhelum",
    "Pakistan",
    "portfolio",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: site.title,
    description: site.description,
    siteName: site.name,
    url: site.url,
    images: [
      {
        url: "/images/hero-mask.jpg",
        width: 1600,
        height: 893,
        alt: `${site.name} — ${site.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/images/hero-mask.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#a31515",
  colorScheme: "light",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  description: site.description,
  url: site.url,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jhelum",
    addressCountry: "PK",
  },
  sameAs: [links.github, links.linkedin, links.portfolio],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "OpenAI APIs",
    "AI Integration",
    "Prompt Engineering",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      {/* Extensions (ColorZilla, Grammarly, password managers) inject
          attributes onto <body> before React hydrates, which reads as a
          mismatch. This suppresses the warning for this element only —
          hydration errors inside the tree still surface normally. */}
      <body className="antialiased" suppressHydrationWarning>
        <MotionProvider>{children}</MotionProvider>
        <script
          type="application/ld+json"
          // Static, author-controlled payload — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
