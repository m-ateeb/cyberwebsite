import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center space-y-6">
      <span className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-1 font-mono text-xs uppercase tracking-widest text-[var(--accent-lime)]">
        HTTP 404 · Stratum Not Found
      </span>
      <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
        This page doesn&apos;t exist in the archive.
      </h1>
      <p className="text-base text-[var(--text-secondary)]">
        The note or route you requested may have moved or hasn&apos;t been
        published yet.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-lime)] px-5 py-2.5 text-sm font-semibold text-[#090d12]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back Home
        </Link>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--border-strong)]"
        >
          <Compass className="h-4 w-4 text-[var(--accent-blue)]" />
          Explore Notes
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--border-strong)]"
        >
          <Search className="h-4 w-4 text-[var(--accent-lime)]" />
          Search
        </Link>
      </div>
    </main>
  );
}
