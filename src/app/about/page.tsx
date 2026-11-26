import React from "react";
import Link from "next/link";
import { BookOpen, Compass, Eye, Sparkles } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import { SupportCTA } from "@/components/shared/SupportCTA";

export const metadata = buildPageMetadata({
  title: "About",
  description:
    "Why StratumSec exists: making networking, cloud, and security concepts clear, visual, and accessible to everyone.",
  pathname: "/about",
});

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <header className="space-y-4 border-b border-[var(--border-default)] pb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-lime)]">
          About StratumSec
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
          Making complex tech easy to understand.
        </h1>
        <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
          When I was learning networking, cloud infrastructure, and security, I
          had to read through dozens of scattered, overly complicated resources
          just to grasp a single concept. I built this platform so anyone can
          learn these topics clearly, visually, and without the frustration.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-2.5">
          <Compass className="h-5 w-5 text-[var(--accent-lime)]" />
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            Built From Real Learning Struggles
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Too many technical guides assume you already know half the jargon.
            Every topic here is written from scratch the way I wish someone had
            explained it to me—straightforward, structured, and approachable.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-2.5">
          <BookOpen className="h-5 w-5 text-[var(--accent-blue)]" />
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            Clear Enough to Teach Someone Else
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            The goal of every guide is simple: after reading it once, you should
            not only understand how the concept works, you should be able to
            explain it in plain English to a friend, teammate, or interviewer.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-2.5">
          <Eye className="h-5 w-5 text-[var(--accent-blue)]" />
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            Visual &amp; Interactive by Default
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Some concepts only click when you can see them move. Each note pairs
            plain-English analogies with interactive diagrams and animations so
            you can test ideas step by step instead of memorizing definitions.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-2.5">
          <Sparkles className="h-5 w-5 text-[var(--accent-lime)]" />
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            Accessible Knowledge for Everyone
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Free to read, clean, and distraction-free—whether you are a student
            starting from zero or an engineer brushing up on cloud and
            networking fundamentals, you belong here.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/explore"
          className="inline-flex items-center rounded-xl bg-[var(--accent-lime)] px-5 py-2.5 text-sm font-semibold text-[#090d12]"
        >
          Explore Knowledge Library
        </Link>
      </div>

      <SupportCTA />
    </main>
  );
}
