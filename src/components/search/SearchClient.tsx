"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, ArrowUpRight, Clock } from "lucide-react";
import type { NoteCategory, SearchDocument } from "@/lib/types";

export function SearchClient({ documents }: { documents: SearchDocument[] }) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<"all" | NoteCategory>("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((doc) => {
      if (category !== "all" && doc.category !== category) return false;
      if (!q) return true;
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        (doc.subcategory?.toLowerCase().includes(q) ?? false) ||
        doc.tags.some((t) => t.toLowerCase().includes(q)) ||
        doc.excerpt.toLowerCase().includes(q)
      );
    });
  }, [documents, query, category]);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--accent-lime)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search technical notes, protocols, tools, or tags..."
            aria-label="Search StratumSec archive"
            className="h-12 w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] pl-11 pr-4 text-sm sm:text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-lime)] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "all", label: "All Categories" },
              { id: "Cloud Infrastructure", label: "Cloud Infrastructure" },
              { id: "Cybersecurity", label: "Cybersecurity" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                category === item.id
                  ? "bg-[var(--accent-lime)] text-[#090d12] font-semibold"
                  : "border border-[var(--border-default)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <p className="font-mono text-xs text-[var(--text-muted)]">
        {results.length} matching note{results.length === 1 ? "" : "s"}
        {query.trim() ? ` for "${query.trim()}"` : ""}
      </p>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-10 text-center space-y-4">
          <p className="text-base font-semibold text-[var(--text-primary)]">
            No results found for &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            Try one of these popular topics:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["eBPF", "SPIFFE", "AWS", "Kubernetes", "KMS", "ZTNA"].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] px-3 py-1.5 font-mono text-xs text-[var(--accent-blue)] hover:border-[var(--accent-lime)] hover:text-[var(--accent-lime)]"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((doc) => {
            const isCloud = doc.category === "Cloud Infrastructure";
            return (
              <Link
                key={doc.slug}
                href={`/notes/${doc.slug}`}
                className="group block rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 sm:p-6 transition-colors hover:border-[var(--border-strong)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        isCloud
                          ? "text-[var(--accent-blue)]"
                          : "text-[var(--accent-lime)]"
                      }
                    >
                      {doc.category}
                    </span>
                    <span className="text-[var(--text-muted)]">·</span>
                    <span className="text-[var(--text-muted)]">{doc.difficulty}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[var(--text-muted)]">
                    <Clock className="h-3.5 w-3.5" />
                    {doc.readingTimeLabel}
                  </span>
                </div>

                <div className="mt-2 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-lime)] transition-colors">
                      {doc.title}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {doc.description}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent-lime)]" />
                </div>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-[var(--border-default)] bg-[var(--bg-base)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
