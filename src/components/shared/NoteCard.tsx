import React from "react";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { formatDisplayDate, type NoteRecord } from "@/lib/types";

interface NoteCardProps {
  note: NoteRecord;
  variant?: "default" | "featured";
}

export function NoteCard({ note, variant = "default" }: NoteCardProps) {
  const isCloud = note.category === "Cloud Infrastructure";

  return (
    <article className="group relative flex h-full flex-col justify-between rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)]">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${
                isCloud
                  ? "border-[var(--accent-blue)]/35 bg-[var(--accent-blue-dim)] text-[var(--accent-blue)]"
                  : "border-[var(--accent-lime)]/35 bg-[var(--accent-lime-dim)] text-[var(--accent-lime)]"
              }`}
            >
              {isCloud ? "Cloud" : "Security"}
            </span>
            {note.subcategory && (
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                {note.subcategory}
              </span>
            )}
          </div>

          <span className="font-mono text-[11px] text-[var(--text-muted)]">
            {note.difficulty}
          </span>
        </div>

        <Link href={`/notes/${note.slug}`} className="mt-3.5 block">
          <h3
            className={`font-display font-bold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-lime)] ${
              variant === "featured" ? "text-xl leading-snug" : "text-lg leading-snug"
            }`}
          >
            {note.title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-3">
            {note.description}
          </p>
        </Link>

        {note.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {note.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-[var(--border-default)] bg-[var(--bg-base)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--border-default)] pt-4 text-xs text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
          <Clock className="h-3.5 w-3.5" />
          {note.readingTimeLabel} · {formatDisplayDate(note.publishedAt)}
        </span>

        <Link
          href={`/notes/${note.slug}`}
          className="inline-flex items-center gap-1 font-medium text-[var(--accent-blue)] transition-colors group-hover:text-[var(--accent-lime)]"
        >
          Read
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
