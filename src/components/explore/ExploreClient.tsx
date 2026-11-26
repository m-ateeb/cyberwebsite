"use client";

import React, { useMemo, useState } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import type { NoteCategory, NoteDifficulty, NoteRecord } from "@/lib/types";
import { NoteCard } from "@/components/shared/NoteCard";

type SortMode = "newest" | "oldest" | "shortest" | "longest";

export function ExploreClient({
  notes,
  tags,
}: {
  notes: NoteRecord[];
  tags: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | NoteCategory>("all");
  const [difficulty, setDifficulty] = useState<"all" | NoteDifficulty>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = notes.filter((note) => {
      if (category !== "all" && note.category !== category) return false;
      if (difficulty !== "all" && note.difficulty !== difficulty) return false;
      if (activeTag && !note.tags.includes(activeTag)) return false;
      if (q) {
        const hit =
          note.title.toLowerCase().includes(q) ||
          note.description.toLowerCase().includes(q) ||
          note.category.toLowerCase().includes(q) ||
          (note.subcategory?.toLowerCase().includes(q) ?? false) ||
          note.tags.some((t) => t.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === "oldest") {
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      }
      if (sort === "shortest") return a.readingTimeMinutes - b.readingTimeMinutes;
      if (sort === "longest") return b.readingTimeMinutes - a.readingTimeMinutes;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [notes, query, category, difficulty, activeTag, sort]);

  const hasFilters =
    query.trim() !== "" ||
    category !== "all" ||
    difficulty !== "all" ||
    activeTag !== null;

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setDifficulty("all");
    setActiveTag(null);
    setSort("newest");
  };

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 sm:p-5 space-y-4">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles, descriptions, subcategories, or tags..."
              aria-label="Filter knowledge library"
              className="h-10 w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] pl-10 pr-3.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-lime)] focus:outline-none"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] px-3">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0" />
            <select
              aria-label="Filter by difficulty"
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as "all" | NoteDifficulty)
              }
              className="h-10 w-full bg-transparent text-xs text-[var(--text-primary)] focus:outline-none"
            >
              <option value="all" className="bg-[#111923]">All Difficulties</option>
              <option value="Beginner" className="bg-[#111923]">Beginner</option>
              <option value="Intermediate" className="bg-[#111923]">Intermediate</option>
              <option value="Advanced" className="bg-[#111923]">Advanced</option>
            </select>
          </div>

          <div className="md:col-span-3 flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] px-3">
            <ArrowUpDown className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0" />
            <select
              aria-label="Sort notes"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="h-10 w-full bg-transparent text-xs text-[var(--text-primary)] focus:outline-none"
            >
              <option value="newest" className="bg-[#111923]">Newest First</option>
              <option value="oldest" className="bg-[#111923]">Oldest First</option>
              <option value="shortest" className="bg-[#111923]">Shortest Read</option>
              <option value="longest" className="bg-[#111923]">Longest Deep Dive</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "all", label: "All Topics" },
                { id: "Cloud Infrastructure", label: "Cloud Infrastructure" },
                { id: "Cybersecurity", label: "Cybersecurity" },
              ] as const
            ).map((item) => {
              const active = category === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-[var(--accent-lime)] text-[#090d12] font-semibold"
                      : "border border-[var(--border-default)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 font-mono text-xs text-[var(--accent-blue)] hover:text-[var(--accent-lime)]"
            >
              <X className="h-3.5 w-3.5" />
              Reset filters
            </button>
          )}
        </div>

        {/* Tag Strip */}
        <div className="flex flex-wrap gap-1.5 border-t border-[var(--border-default)] pt-3.5">
          {tags.map((tag) => {
            const isSelected = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(isSelected ? null : tag)}
                className={`rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  isSelected
                    ? "border-[var(--accent-blue)] bg-[var(--accent-blue-dim)] text-[var(--accent-blue)]"
                    : "border-[var(--border-default)] bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">
        <span>
          Showing {filtered.length} of {notes.length} technical note
          {notes.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Notes Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-12 text-center space-y-3">
          <p className="text-base font-medium text-[var(--text-primary)]">
            No notes match the active filters.
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            Try clearing a tag or searching for broader terms like eBPF, IAM, or ZTNA.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-2 inline-flex items-center rounded-xl bg-[var(--accent-lime)] px-4 py-2 text-xs font-semibold text-[#090d12]"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((note) => (
            <NoteCard key={note.slug} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
