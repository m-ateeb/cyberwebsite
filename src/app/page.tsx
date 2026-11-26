import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  formatDisplayDate,
  getAllNotes,
  getAllTopics,
  getFeaturedNotes,
  getKnowledgeStats,
} from "@/lib/content";
import { Hero3DVisual } from "@/components/home/Hero3DVisual";
import { ArchitectureExplorerClient } from "@/components/architecture/ArchitectureExplorerClient";
import { NewsletterSection } from "@/components/shared/NewsletterSection";
import { SupportCTA } from "@/components/shared/SupportCTA";

export default function HomePage() {
  const allNotes = getAllNotes();
  const featuredNotes = getFeaturedNotes(3);
  const [leadNote, ...secondaryFeatured] = featuredNotes;
  const stats = getKnowledgeStats();
  const topics = getAllTopics();

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* 1. Editorial Masthead & Hero */}
      <section className="pt-8 pb-14 lg:pt-12 lg:pb-16">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-default)] pb-3 font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
          <span>Cloud Infrastructure &amp; Security Research</span>
          <span>
            {stats.totalNotes} Monographs · Updated{" "}
            {stats.latestUpdate ? formatDisplayDate(stats.latestUpdate) : "—"}
          </span>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6 space-y-6">
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] leading-[1.08]">
              Engineering knowledge, without the noise.
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-[var(--text-secondary)]">
              Technical monographs, threat models, and architectural blueprints
              examining how modern cloud infrastructure and Linux security
              controls actually work in production.
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-1">
              <Link
                href="/explore"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--text-primary)] px-4 text-sm font-medium text-[var(--bg-base)] transition-opacity hover:opacity-90"
              >
                Explore Notes
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#architecture-explainer"
                className="font-mono text-xs text-[var(--text-secondary)] underline underline-offset-4 decoration-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors"
              >
                Inspect 3D Architecture →
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Hero3DVisual />
          </div>
        </div>
      </section>

      {/* 2. Interactive 3D Request & Threat Walkthrough */}
      <section
        id="architecture-explainer"
        aria-label="Interactive 3D Defense-in-Depth Architecture"
        className="scroll-mt-20 border-t border-[var(--border-default)] py-14 lg:py-16"
      >
        <ArchitectureExplorerClient />
      </section>

      {/* 3. Asymmetric Featured Monographs */}
      {leadNote && (
        <section
          aria-labelledby="featured-heading"
          className="border-t border-[var(--border-default)] py-14 lg:py-16 space-y-8"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
                Featured Monographs
              </p>
              <h2
                id="featured-heading"
                className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--text-primary)]"
              >
                Selected Deep Dives
              </h2>
            </div>
            <Link
              href="/explore"
              className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              View all ({stats.totalNotes}) →
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Primary Lead Monograph */}
            <article
              className={`group flex flex-col justify-between rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-8 transition-colors hover:border-[var(--border-strong)] ${
                secondaryFeatured.length > 0 ? "lg:col-span-7" : "lg:col-span-12"
              }`}
            >
              <div className={`grid gap-6 ${secondaryFeatured.length === 0 && leadNote.coverImage ? "md:grid-cols-12 md:items-center" : ""}`}>
                <div className={`space-y-4 ${secondaryFeatured.length === 0 && leadNote.coverImage ? "md:col-span-7" : ""}`}>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span
                      className={
                        leadNote.category === "Cloud Infrastructure"
                          ? "text-[var(--accent-blue)]"
                          : "text-[var(--accent-lime)]"
                      }
                    >
                      {leadNote.category} · Lead Note
                    </span>
                    <span className="text-[var(--text-muted)]">
                      {leadNote.difficulty}
                    </span>
                  </div>

                  <Link href={`/notes/${leadNote.slug}`} className="block space-y-3">
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent-blue)] transition-colors">
                      {leadNote.title}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                      {leadNote.description}
                    </p>
                  </Link>
                </div>

                {secondaryFeatured.length === 0 && leadNote.coverImage && (
                  <Link
                    href={`/notes/${leadNote.slug}`}
                    className="md:col-span-5 overflow-hidden rounded-md border border-[var(--border-default)] bg-[#090d12]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={leadNote.coverImage}
                      alt={leadNote.title}
                      className="h-52 w-full object-contain p-2"
                    />
                  </Link>
                )}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-[var(--border-default)] pt-4 font-mono text-xs text-[var(--text-muted)]">
                <span>
                  {formatDisplayDate(leadNote.publishedAt)} · {leadNote.readingTimeLabel}
                </span>
                <Link
                  href={`/notes/${leadNote.slug}`}
                  className="inline-flex items-center gap-1 text-[var(--text-primary)] group-hover:text-[var(--accent-lime)] transition-colors"
                >
                  Read monograph &amp; interactive visual
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>

            {/* Stacked Secondary Monographs */}
            {secondaryFeatured.length > 0 && (
              <div className="lg:col-span-5 flex flex-col divide-y divide-[var(--border-default)] rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)]">
                {secondaryFeatured.map((note) => {
                  const isCloud = note.category === "Cloud Infrastructure";
                  return (
                    <article key={note.slug} className="group flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span
                            className={
                              isCloud
                                ? "text-[var(--accent-blue)]"
                                : "text-[var(--accent-lime)]"
                            }
                          >
                            {note.category}
                          </span>
                          <span className="text-[var(--text-muted)]">
                            {note.readingTimeLabel}
                          </span>
                        </div>
                        <Link href={`/notes/${note.slug}`} className="mt-2.5 block">
                          <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent-blue)] transition-colors">
                            {note.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-2">
                            {note.description}
                          </p>
                        </Link>
                      </div>
                      <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-[var(--text-muted)]">
                        <span>{formatDisplayDate(note.publishedAt)}</span>
                        <Link
                          href={`/notes/${note.slug}`}
                          className="inline-flex items-center gap-1 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                        >
                          Read
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Engineering Archive Index (Clean Hairline Table) */}
      <section
        aria-labelledby="archive-heading"
        className="border-t border-[var(--border-default)] py-14 lg:py-16 space-y-6"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
              Complete Index
            </p>
            <h2
              id="archive-heading"
              className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--text-primary)]"
            >
              Published Field Notes
            </h2>
          </div>

          <div className="flex items-center gap-5 font-mono text-xs">
            {topics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/${topic.slug}`}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {topic.title} (
                {topic.slug === "cloud"
                  ? stats.cloudCount
                  : topic.slug === "networking"
                  ? stats.networkingCount
                  : stats.securityCount}
                )
              </Link>
            ))}
          </div>
        </div>

        <div className="divide-y divide-[var(--border-default)] border-y border-[var(--border-default)]">
          {allNotes.map((note) => {
            const isSecurity = note.category === "Cybersecurity";
            return (
              <Link
                key={note.slug}
                href={`/notes/${note.slug}`}
                className="group grid gap-2 py-4 transition-colors hover:bg-[var(--bg-surface)]/70 sm:px-3 md:grid-cols-12 md:items-baseline md:gap-4"
              >
                <span className="font-mono text-xs text-[var(--text-muted)] md:col-span-2">
                  {formatDisplayDate(note.publishedAt)}
                </span>
                <span
                  className={`font-mono text-[11px] md:col-span-2 ${
                    isSecurity
                      ? "text-[var(--accent-lime)]"
                      : "text-[var(--accent-blue)]"
                  }`}
                >
                  {note.category === "Cloud Infrastructure"
                    ? "Cloud Infra"
                    : note.category}
                </span>
                <div className="md:col-span-6">
                  <h3 className="font-display text-base font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
                    {note.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)] line-clamp-1">
                    {note.description}
                  </p>
                </div>
                <span className="font-mono text-[11px] text-[var(--text-muted)] md:col-span-2 md:text-right">
                  {note.readingTimeLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. Dispatches & Reader Support (Clean 2-Column Closing Band) */}
      <section className="border-t border-[var(--border-default)] py-14 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 md:divide-x md:divide-[var(--border-default)]">
          <div>
            <NewsletterSection />
          </div>
          <div className="md:pl-12">
            <SupportCTA />
          </div>
        </div>
      </section>
    </main>
  );
}
