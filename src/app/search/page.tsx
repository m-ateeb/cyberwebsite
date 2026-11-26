import React, { Suspense } from "react";
import { getSearchDocuments } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { SearchClient } from "@/components/search/SearchClient";

export const metadata = buildPageMetadata({
  title: "Search",
  description:
    "Search StratumSec technical notes by title, content, tags, or category.",
  pathname: "/search",
});

export default function SearchPage() {
  const documents = getSearchDocuments();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <header className="space-y-2.5">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-blue)]">
          Static Archive Search
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Search StratumSec
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)]">
          Instant build-time indexed search across titles, descriptions, tags,
          and article content. Press <kbd className="rounded border border-[var(--border-default)] bg-[var(--bg-surface)] px-1.5 py-0.5 font-mono text-xs">/</kbd> anywhere on the site to jump in.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-8 font-mono text-xs text-[var(--text-muted)]">
            Loading search index...
          </div>
        }
      >
        <SearchClient documents={documents} />
      </Suspense>
    </main>
  );
}
