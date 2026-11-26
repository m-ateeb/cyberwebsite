import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { getNotesByCategory, getTopicBySlug } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { NoteCard } from "@/components/shared/NoteCard";

export const metadata = buildPageMetadata({
  title: "Cybersecurity",
  description:
    "Deep technical notes on Zero Trust, SPIFFE/SPIRE, Kubernetes RBAC hardening, ZTNA, and modern threat defense.",
  pathname: "/security",
});

export default function SecurityTopicPage() {
  const topic = getTopicBySlug("security");
  const notes = getNotesByCategory("Cybersecurity");

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <header className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-10 space-y-5">
        <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent-lime)]/35 bg-[var(--accent-lime-dim)] px-3 py-1 font-mono text-xs uppercase tracking-widest text-[var(--accent-lime)]">
          <ShieldCheck className="h-3.5 w-3.5" />
          Topic Hub · Cybersecurity
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          {topic?.title ?? "Cybersecurity"}
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-[var(--text-secondary)]">
          {topic?.description}
        </p>

        {topic && topic.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {topic.subcategories.map((sub) => (
              <span
                key={sub}
                className="rounded-md border border-[var(--border-default)] bg-[var(--bg-base)] px-3 py-1 font-mono text-xs text-[var(--text-secondary)]"
              >
                {sub}
              </span>
            ))}
          </div>
        )}
      </header>

      <section aria-label="Cybersecurity articles" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
            Published Notes ({notes.length})
          </h2>
          <Link
            href="/cloud"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-blue)] hover:underline"
          >
            Switch to Cloud Infrastructure
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.slug} note={note} />
          ))}
        </div>
      </section>
    </main>
  );
}
