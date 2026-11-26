import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDisplayDate, type NoteRecord } from "@/lib/types";

interface NoteCardProps {
  note: NoteRecord;
  variant?: "default" | "featured";
}

export function NoteCard({ note, variant = "default" }: NoteCardProps) {
  const isSecurity = note.category === "Cybersecurity";

  return (
    <article className="group flex h-full flex-col justify-between rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 transition-colors hover:border-[var(--border-strong)]">
      <div>
        <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
          <span
            className={
              isSecurity
                ? "text-[var(--accent-lime)]"
                : "text-[var(--accent-blue)]"
            }
          >
            {note.category}
          </span>
          <span className="text-[var(--text-muted)]">{note.difficulty}</span>
        </div>

        <Link href={`/notes/${note.slug}`} className="mt-3 block">
          <h3
            className={`font-display font-semibold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-blue)] ${
              variant === "featured" ? "text-xl leading-snug" : "text-base leading-snug"
            }`}
          >
            {note.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-3">
            {note.description}
          </p>
        </Link>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--border-default)] pt-3.5 font-mono text-[11px] text-[var(--text-muted)]">
        <span>
          {formatDisplayDate(note.publishedAt)} · {note.readingTimeLabel}
        </span>
        <Link
          href={`/notes/${note.slug}`}
          className="inline-flex items-center gap-1 text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]"
        >
          Read
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
