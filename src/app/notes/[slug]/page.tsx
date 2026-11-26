import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Layers,
  User,
} from "lucide-react";
import {
  formatDisplayDate,
  getAdjacentNotes,
  getAllNotes,
  getNoteBySlug,
  getNotesByCategory,
  getRelatedNotes,
} from "@/lib/content";
import { renderMarkdownToHtml } from "@/lib/markdown";
import { buildNoteJsonLd, canonicalUrl, SITE_NAME } from "@/lib/seo";
import { ReadingProgress } from "@/components/notes/ReadingProgress";
import { TableOfContents } from "@/components/notes/TableOfContents";
import { CodeCopyHydrator } from "@/components/notes/CodeCopyHydrator";
import { NoteCard } from "@/components/shared/NoteCard";
import { SupportCTA } from "@/components/shared/SupportCTA";
import { AdSlot } from "@/components/shared/AdSlot";
import { LearningExperienceSlot } from "@/features/learning/LearningExperienceSlot";

export function generateStaticParams() {
  return getAllNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) {
    return { title: "Note Not Found" };
  }

  const title = note.seoTitle ?? note.title;
  const description = note.seoDescription ?? note.description;
  const url = canonicalUrl(`/notes/${note.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: note.publishedAt,
      modifiedTime: note.updatedAt,
      authors: [note.author],
      tags: note.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function NotePage({ params }: PageProps<"/notes/[slug]">) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  const { html, toc } = await renderMarkdownToHtml(note.body);
  const related = getRelatedNotes(note, 3);
  const { prev, next } = getAdjacentNotes(note.slug);
  const siblingNotes = getNotesByCategory(note.category);
  const isCloud = note.category === "Cloud Infrastructure";
  const topicHref = isCloud ? "/cloud" : "/security";
  const jsonLd = buildNoteJsonLd(note);

  return (
    <>
      <ReadingProgress />
      <CodeCopyHydrator />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto max-w-[90rem] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--text-muted)]">
          <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={topicHref}
            className={
              isCloud
                ? "text-[var(--accent-blue)] hover:underline"
                : "text-[var(--accent-lime)] hover:underline"
            }
          >
            {note.category}
          </Link>
          {note.subcategory && (
            <>
              <span>/</span>
              <span>{note.subcategory}</span>
            </>
          )}
        </div>

        {/* Three-Part Desktop Editorial Layout */}
        <div className="grid gap-10 xl:grid-cols-12">
          {/* Left Sidebar: Topic Navigation & Sibling Notes */}
          <aside className="hidden xl:block xl:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
                <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
                  Topic Series
                </p>
                <Link
                  href={topicHref}
                  className={`mt-1.5 block font-display text-base font-bold ${
                    isCloud
                      ? "text-[var(--accent-blue)]"
                      : "text-[var(--accent-lime)]"
                  }`}
                >
                  {note.category}
                </Link>
                <ul className="mt-4 space-y-2 border-t border-[var(--border-default)] pt-4">
                  {siblingNotes.map((item) => {
                    const isCurrent = item.slug === note.slug;
                    return (
                      <li key={item.slug}>
                        <Link
                          href={`/notes/${item.slug}`}
                          className={`block rounded-lg px-2.5 py-2 text-xs leading-snug transition-colors ${
                            isCurrent
                              ? "bg-[var(--bg-elevated)] font-semibold text-[var(--accent-lime)]"
                              : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                          }`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <Link
                href="/architecture"
                className="flex items-center justify-between rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-blue)] hover:text-[var(--text-primary)]"
              >
                <span className="inline-flex items-center gap-2 font-medium">
                  <Layers className="h-4 w-4 text-[var(--accent-blue)]" />
                  3D Architecture Stack
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>

          {/* Main Reading Column */}
          <article className="xl:col-span-6 min-w-0">
            <header className="space-y-5 border-b border-[var(--border-default)] pb-8">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <Link
                  href={topicHref}
                  className={`rounded-md border px-2.5 py-0.5 uppercase tracking-wider ${
                    isCloud
                      ? "border-[var(--accent-blue)]/40 bg-[var(--accent-blue-dim)] text-[var(--accent-blue)]"
                      : "border-[var(--accent-lime)]/40 bg-[var(--accent-lime-dim)] text-[var(--accent-lime)]"
                  }`}
                >
                  {note.category}
                </Link>
                <span className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-2.5 py-0.5 text-[var(--text-secondary)]">
                  {note.difficulty}
                </span>
                <span className="inline-flex items-center gap-1 text-[var(--text-muted)]">
                  <Clock className="h-3.5 w-3.5" />
                  {note.readingTimeLabel}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.15]">
                {note.title}
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
                {note.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 font-mono text-xs text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {note.author}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Published {formatDisplayDate(note.publishedAt)}
                </span>
                {note.updatedAt !== note.publishedAt && (
                  <span>Updated {formatDisplayDate(note.updatedAt)}</span>
                )}
              </div>

              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {note.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--text-secondary)] hover:border-[var(--accent-lime)] hover:text-[var(--accent-lime)] transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* Mobile Collapsible TOC */}
            <div className="mt-6">
              <TableOfContents items={toc} variant="mobile" />
            </div>

            {/* Reserved Slot for Future Interactive Learning Engine (SILE) */}
            <LearningExperienceSlot experience={note.learningExperience} />

            {/* Server-Rendered Technical Article Prose (works without JS) */}
            <div
              className="stratum-prose mt-8"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* Contextual Sponsor Slot */}
            <div className="mt-10">
              <AdSlot
                slotId={`article-footer-${note.slug}`}
                format="in-article"
                label="Sponsored · Technical Partner"
              />
            </div>

            {/* Previous / Next Navigation */}
            {(prev || next) && (
              <nav
                aria-label="Adjacent articles"
                className="mt-10 grid gap-4 border-t border-[var(--border-default)] pt-8 sm:grid-cols-2"
              >
                {prev ? (
                  <Link
                    href={`/notes/${prev.slug}`}
                    className="group rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 transition-colors hover:border-[var(--border-strong)]"
                  >
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Previous Note
                    </span>
                    <p className="mt-1.5 font-display text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-lime)] transition-colors">
                      {prev.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}

                {next && (
                  <Link
                    href={`/notes/${next.slug}`}
                    className="group rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 text-right transition-colors hover:border-[var(--border-strong)]"
                  >
                    <span className="inline-flex items-center justify-end gap-1 font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                      Next Note
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <p className="mt-1.5 font-display text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-lime)] transition-colors">
                      {next.title}
                    </p>
                  </Link>
                )}
              </nav>
            )}

            {/* Support CTA */}
            <div className="mt-10">
              <SupportCTA compact />
            </div>
          </article>

          {/* Right Sidebar: Sticky Table of Contents & Sponsor */}
          <aside className="hidden xl:block xl:col-span-3">
            <div className="sticky top-24 space-y-6">
              <TableOfContents items={toc} variant="desktop" />
              <AdSlot slotId={`article-sidebar-${note.slug}`} format="sidebar" />
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <section
            aria-labelledby="related-heading"
            className="mt-16 border-t border-[var(--border-default)] pt-12"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-blue)]">
                  Continue Reading
                </p>
                <h2
                  id="related-heading"
                  className="mt-1 font-display text-2xl font-bold text-[var(--text-primary)]"
                >
                  Related Technical Notes
                </h2>
              </div>
              <Link
                href="/explore"
                className="text-sm font-medium text-[var(--accent-blue)] hover:text-[var(--accent-lime)]"
              >
                All notes
              </Link>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {related.map((rel) => (
                <NoteCard key={rel.slug} note={rel} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
