import type { Metadata } from "next";
import type { NoteRecord } from "./content";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://cyberwebsite-nu.vercel.app";

export const SITE_NAME = "StratumSec";
export const SITE_TAGLINE = "Engineering Knowledge. Without the Noise.";
export const SITE_DESCRIPTION =
  "Premium technical publication covering Cloud Infrastructure, Cybersecurity, Zero-Trust architecture, and kernel-level defense.";

export function canonicalUrl(pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${normalized}`;
}

export function buildPageMetadata({
  title,
  description,
  pathname,
}: {
  title: string;
  description: string;
  pathname: string;
}): Metadata {
  const url = canonicalUrl(pathname);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildNoteJsonLd(note: NoteRecord) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: note.seoTitle ?? note.title,
    description: note.seoDescription ?? note.description,
    author: {
      "@type": "Organization",
      name: note.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    datePublished: note.publishedAt,
    dateModified: note.updatedAt,
    mainEntityOfPage: canonicalUrl(`/notes/${note.slug}`),
    articleSection: note.category,
    keywords: note.tags.join(", "),
  };
}
