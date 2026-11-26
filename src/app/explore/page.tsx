import React from "react";
import { getAllNotes, getAllTags } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { ExploreClient } from "@/components/explore/ExploreClient";

export const metadata = buildPageMetadata({
  title: "Knowledge Library",
  description:
    "Browse, filter, and search all StratumSec technical notes across Cloud Infrastructure and Cybersecurity.",
  pathname: "/explore",
});

export default function ExplorePage() {
  const notes = getAllNotes();
  const tags = getAllTags();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <header className="max-w-3xl space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-lime)]">
          Knowledge Library
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          All Technical Notes &amp; Monographs
        </h1>
        <p className="text-base text-[var(--text-secondary)]">
          Filter by discipline, difficulty, or topic tag. Every article is
          version-controlled in Git and rendered statically for fast reading.
        </p>
      </header>

      <ExploreClient notes={notes} tags={tags} />
    </main>
  );
}
