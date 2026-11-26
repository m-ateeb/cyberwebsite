import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Cloud,
  Layers,
  ShieldCheck,
} from "lucide-react";
import {
  formatDisplayDate,
  getAllNotes,
  getAllTopics,
  getFeaturedNotes,
  getKnowledgeStats,
} from "@/lib/content";
import { Hero3DVisual } from "@/components/home/Hero3DVisual";
import { ArchitectureExplorerClient } from "@/components/architecture/ArchitectureExplorerClient";
import { NoteCard } from "@/components/shared/NoteCard";
import { NewsletterSection } from "@/components/shared/NewsletterSection";
import { SupportCTA } from "@/components/shared/SupportCTA";

export default function HomePage() {
  const allNotes = getAllNotes();
  const featuredNotes = getFeaturedNotes(3);
  const featuredSlugs = new Set(featuredNotes.map((n) => n.slug));
  const recentNotes = allNotes.filter((n) => !featuredSlugs.has(n.slug));
  const stats = getKnowledgeStats();
  const topics = getAllTopics();

  return (
    <main className="bg-stratum-grid">
      {/* 1. Editorial Hero + Live 3D Zero-Trust Mesh Core */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-12 sm:px-6 lg:px-8 lg:pt-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[var(--accent-lime)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-lime)]" />
              STRATUMSEC · Technical Publication
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-bold tracking-tight text-[var(--text-primary)] leading-[1.06]">
              Engineering knowledge.{" "}
              <span className="text-[var(--accent-lime)]">
                Without the noise.
              </span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
              Deep technical notes, threat models, and interactive 3D architecture
              explainers across Cloud Infrastructure and Cybersecurity—written
              for practitioners.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-lime)] px-5 py-3 text-sm font-semibold text-[#090d12] transition-opacity hover:opacity-90"
              >
                <BookOpen className="h-4 w-4" />
                Explore Notes
              </Link>
              <a
                href="#architecture-explainer"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-5 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)]"
              >
                <Layers className="h-4 w-4 text-[var(--accent-blue)]" />
                Launch 3D Explainer
              </a>
            </div>

            {/* Compact Knowledge Metrics Strip */}
            <div className="grid grid-cols-3 gap-4 border-t border-[var(--border-default)] pt-6 max-w-md">
              <div>
                <p className="font-display text-2xl font-bold text-[var(--text-primary)]">
                  {stats.totalNotes}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Monographs
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-[var(--accent-blue)]">
                  4 Strata
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  3D Defense Stack
                </p>
              </div>
              <div>
                <p className="font-display text-sm sm:text-base font-bold text-[var(--accent-lime)] pt-1">
                  {stats.latestUpdate ? formatDisplayDate(stats.latestUpdate) : "—"}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Updated
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Hero3DVisual />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 pb-16 sm:px-6 lg:px-8">
        {/* 2. Interactive 3D Defense-in-Depth Explainer (Prominent Top-Mid Placement) */}
        <section
          id="architecture-explainer"
          aria-label="Interactive 3D Defense-in-Depth Explainer"
          className="scroll-mt-24 pt-2"
        >
          <ArchitectureExplorerClient />
        </section>

        {/* 3. Featured Deep Dives */}
        <section aria-labelledby="featured-heading" className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-lime)]">
                Start Reading
              </p>
              <h2
                id="featured-heading"
                className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]"
              >
                Featured Deep Dives
              </h2>
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-blue)] hover:text-[var(--accent-lime)] transition-colors"
            >
              Browse full library ({stats.totalNotes})
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredNotes.map((note) => (
              <NoteCard key={note.slug} note={note} variant="featured" />
            ))}
          </div>
        </section>

        {/* 4. Explore by Discipline */}
        <section aria-labelledby="topics-heading" className="space-y-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-blue)]">
              Core Disciplines
            </p>
            <h2
              id="topics-heading"
              className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]"
            >
              Browse by Engineering Domain
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {topics.map((topic) => {
              const isCloud = topic.slug === "cloud";
              const count = isCloud ? stats.cloudCount : stats.securityCount;
              return (
                <Link
                  key={topic.slug}
                  href={`/${topic.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${
                          isCloud
                            ? "border-[var(--accent-blue)]/35 bg-[var(--accent-blue-dim)] text-[var(--accent-blue)]"
                            : "border-[var(--accent-lime)]/35 bg-[var(--accent-lime-dim)] text-[var(--accent-lime)]"
                        }`}
                      >
                        {isCloud ? (
                          <Cloud className="h-5 w-5" />
                        ) : (
                          <ShieldCheck className="h-5 w-5" />
                        )}
                      </div>
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        {count} note{count === 1 ? "" : "s"}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-lime)] transition-colors">
                      {topic.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {topic.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {topic.subcategories.slice(0, 5).map((sub) => (
                        <span
                          key={sub}
                          className="rounded-md border border-[var(--border-default)] bg-[var(--bg-base)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-blue)] group-hover:text-[var(--accent-lime)] transition-colors">
                    Explore {topic.title}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 5. Recent Field Notes (Non-duplicate chronological archive) */}
        {recentNotes.length > 0 && (
          <section aria-labelledby="recent-heading" className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-blue)]">
                  More From the Archive
                </p>
                <h2
                  id="recent-heading"
                  className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]"
                >
                  Recent Field Notes
                </h2>
              </div>
              <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-blue)] hover:text-[var(--accent-lime)] transition-colors"
              >
                Filter &amp; search all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {recentNotes.map((note) => (
                <NoteCard key={note.slug} note={note} />
              ))}
            </div>
          </section>
        )}

        {/* 6. Community: Newsletter + Reader Support */}
        <div className="space-y-6">
          <NewsletterSection />
          <SupportCTA />
        </div>
      </div>
    </main>
  );
}
