import React from "react";
import Link from "next/link";
import { Cloud, ArrowRight } from "lucide-react";
import { getNotesByCategory, getTopicBySlug } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { NoteCard } from "@/components/shared/NoteCard";

export const metadata = buildPageMetadata({
  title: "Cloud Infrastructure",
  description:
    "Technical notes on AWS, Kubernetes, eBPF, KMS cryptography, networking, and distributed cloud systems.",
  pathname: "/cloud",
});

export default function CloudTopicPage() {
  const topic = getTopicBySlug("cloud");
  const notes = getNotesByCategory("Cloud Infrastructure");

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <header className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-10 space-y-5">
        <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent-blue)]/35 bg-[var(--accent-blue-dim)] px-3 py-1 font-mono text-xs uppercase tracking-widest text-[var(--accent-blue)]">
          <Cloud className="h-3.5 w-3.5" />
          Topic Hub · Cloud Infrastructure
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          {topic?.title ?? "Cloud Infrastructure"}
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

      <section aria-label="Cloud Infrastructure articles" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
            Published Notes ({notes.length})
          </h2>
          <Link
            href="/security"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-lime)] hover:underline"
          >
            Switch to Cybersecurity
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
