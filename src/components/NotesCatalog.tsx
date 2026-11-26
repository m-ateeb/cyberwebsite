"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Bookmark,
  Clock,
  ArrowUpRight,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import {
  NOTES,
  type NoteDifficulty,
  type NoteDomain,
  type TechnicalNote,
} from "@/data/notes";
import { AdSlot } from "./AdSlot";
import { TiltCard3D } from "./TiltCard3D";

gsap.registerPlugin(ScrollTrigger);

interface NotesCatalogProps {
  activeDomain: "all" | NoteDomain;
  onDomainChange: (domain: "all" | NoteDomain) => void;
  savedSlugs: string[];
  onToggleSave: (slug: string) => void;
}

const DOMAIN_BADGE: Record<NoteDomain, string> = {
  cybersecurity: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  cloud: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  architecture: "border-violet-500/30 bg-violet-500/10 text-violet-300",
};

export function NotesCatalog({
  activeDomain,
  onDomainChange,
  savedSlugs,
  onToggleSave,
}: NotesCatalogProps) {
  const [difficulty, setDifficulty] = useState<"all" | NoteDifficulty>("all");
  const [onlySaved, setOnlySaved] = useState(false);
  const [query, setQuery] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || !gridRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".note-card-item", {
        y: 26,
        rotationX: 6,
        opacity: 0,
        duration: 0.55,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  const filteredNotes = useMemo(() => {
    return NOTES.filter((note) => {
      if (activeDomain !== "all" && note.domain !== activeDomain) return false;
      if (difficulty !== "all" && note.difficulty !== difficulty) return false;
      if (onlySaved && !savedSlugs.includes(note.slug)) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hit =
          note.title.toLowerCase().includes(q) ||
          note.subtitle.toLowerCase().includes(q) ||
          note.tags.some((t) => t.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return true;
    });
  }, [activeDomain, difficulty, onlySaved, savedSlugs, query]);

  return (
    <section
      id="notes-catalog"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      aria-labelledby="catalog-heading"
    >
      {/* Header & Filter Controls */}
      <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-sky-400">
            Field Notes &amp; Deep Dives
          </span>
          <h2
            id="catalog-heading"
            className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-100"
          >
            Engineering Notes Library
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by keyword or tag..."
            aria-label="Filter notes by keyword or tag"
            className="w-full sm:w-52 rounded-lg border border-slate-800 bg-[#11161f] px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-sky-400/60 focus:outline-none"
          />

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#11161f] px-2.5 py-1.5 text-xs text-slate-300">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <select
              aria-label="Filter by difficulty"
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as "all" | NoteDifficulty)
              }
              className="bg-transparent text-xs text-slate-200 focus:outline-none"
            >
              <option value="all" className="bg-[#11161f]">
                All Levels
              </option>
              <option value="Foundational" className="bg-[#11161f]">
                Foundational
              </option>
              <option value="Deep Dive" className="bg-[#11161f]">
                Deep Dive
              </option>
              <option value="Architecture" className="bg-[#11161f]">
                Architecture
              </option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setOnlySaved((p) => !p)}
            aria-pressed={onlySaved}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              onlySaved
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-slate-800 bg-[#11161f] text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            Saved ({savedSlugs.length})
          </button>
        </div>
      </div>

      {/* Domain Pills (mobile + desktop quick access) */}
      <div className="mt-5 flex flex-wrap gap-2">
        {(
          [
            { id: "all", label: "All Topics" },
            { id: "cybersecurity", label: "Cybersecurity" },
            { id: "cloud", label: "Cloud Infrastructure" },
            { id: "architecture", label: "Modern Approaches" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onDomainChange(tab.id)}
            className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
              activeDomain === tab.id
                ? "bg-sky-400 text-slate-950 font-semibold"
                : "border border-slate-800 bg-[#11161f] text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Grid + Sticky Ad/Reference Sidebar */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          {filteredNotes.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-[#11161f] p-10 text-center">
              <p className="text-sm text-slate-300">
                No notes match the current filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  onDomainChange("all");
                  setDifficulty("all");
                  setOnlySaved(false);
                  setQuery("");
                }}
                className="mt-3 text-xs font-medium text-sky-400 hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div ref={gridRef} className="grid gap-5 sm:grid-cols-2">
              {filteredNotes.map((note, idx) => (
                <React.Fragment key={note.slug}>
                  <div className="note-card-item h-full">
                    <NoteCard
                      note={note}
                      index={idx}
                      isSaved={savedSlugs.includes(note.slug)}
                      onToggleSave={onToggleSave}
                    />
                  </div>
                  {/* Insert a clean in-feed ad slot after the 2nd card */}
                  {idx === 1 && (
                    <div className="note-card-item sm:col-span-2">
                      <AdSlot
                        slotId="home-in-feed-01"
                        format="in-feed"
                        label="Sponsored · In-Feed"
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Sticky Sidebar with Reserved Ad Spaces */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="lg:sticky lg:top-24 space-y-6">
            <AdSlot slotId="sidebar-rect-01" format="sidebar" />

            <div className="rounded-2xl border border-slate-800 bg-[#11161f] p-5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
                <Sparkles className="h-3.5 w-3.5" />
                Core Concepts Index
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                Jump straight to foundational primitives covered across these notes:
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {[
                  "eBPF",
                  "SPIFFE/SPIRE",
                  "mTLS",
                  "IAM Boundaries",
                  "K8s RBAC",
                  "Envelope Encryption",
                  "ZTNA",
                  "Zero Trust",
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag.split("/")[0])}
                    className="rounded-md border border-slate-800 bg-[#0d121a] px-2.5 py-1 font-mono text-[11px] text-slate-300 hover:border-sky-400/40 hover:text-sky-300 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <AdSlot slotId="sidebar-tall-02" format="sidebar-tall" />
          </div>
        </aside>
      </div>
    </section>
  );
}

function NoteCard({
  note,
  index,
  isSaved,
  onToggleSave,
}: {
  note: TechnicalNote;
  index: number;
  isSaved: boolean;
  onToggleSave: (slug: string) => void;
}) {
  return (
    <TiltCard3D>
      <article className="glass-panel group flex h-full flex-col justify-between rounded-2xl p-5 transition-colors hover:border-white/20">
        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-slate-500">
                0{index + 1}
              </span>
              <span
                className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                  DOMAIN_BADGE[note.domain]
                }`}
              >
                {note.domain}
              </span>
            </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-500">
              {note.difficulty}
            </span>
            <button
              type="button"
              onClick={() => onToggleSave(note.slug)}
              aria-label={isSaved ? "Remove bookmark" : "Save note"}
              aria-pressed={isSaved}
              className={`rounded-md p-1 transition-colors ${
                isSaved
                  ? "text-emerald-400 bg-emerald-400/10"
                  : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <Link href={`/notes/${note.slug}`} className="mt-3 block">
          <h3 className="font-display text-lg font-semibold leading-snug text-slate-100 group-hover:text-sky-300 transition-colors">
            {note.title}
          </h3>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400 line-clamp-3">
            {note.subtitle}
          </p>
        </Link>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-slate-800/70 px-2 py-0.5 font-mono text-[10px] text-slate-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-3.5 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
          <Clock className="h-3.5 w-3.5" />
          {note.readTime} · {note.updatedAt}
        </span>

        <Link
          href={`/notes/${note.slug}`}
          className="inline-flex items-center gap-1 font-medium text-sky-400 hover:text-sky-300"
        >
          Read note
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
    </TiltCard3D>
  );
}
