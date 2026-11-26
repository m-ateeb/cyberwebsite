import React from "react";
import Link from "next/link";
import { BookOpen, Cpu, GitBranch, Shield } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import { SupportCTA } from "@/components/shared/SupportCTA";

export const metadata = buildPageMetadata({
  title: "About",
  description:
    "The mission, editorial philosophy, and static-first technical architecture behind StratumSec.",
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
          Engineering knowledge. Without the noise.
        </h1>
        <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
          StratumSec is an independent technical publication and interactive
          engineering environment focused on Cloud Infrastructure and
          Cybersecurity.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-2.5">
          <BookOpen className="h-5 w-5 text-[var(--accent-lime)]" />
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            Practitioner-First Clarity
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Every note starts with the concrete failure mode or threat model,
            walks through the real mechanism, and ends with production-ready
            hardening controls.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-2.5">
          <GitBranch className="h-5 w-5 text-[var(--accent-blue)]" />
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            Static-First &amp; Git-Backed
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            All technical notes live as version-controlled Markdown in Git,
            managed through Decap CMS and deployed statically—no bloated servers
            or tracking scripts.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-2.5">
          <Cpu className="h-5 w-5 text-[var(--accent-blue)]" />
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            Simulation-Ready Architecture
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Each article schema reserves a structured interface for the upcoming
            StratumSec Interactive Learning Engine (SILE), bringing verified
            visual simulations to complex protocols and architectures.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-2.5">
          <Shield className="h-5 w-5 text-[var(--accent-lime)]" />
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">
            Zero-Noise Reading Experience
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            Clean dark typography, syntax-highlighted code blocks, keyboard
            search, and accessible static HTML that works even with JavaScript
            disabled.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/explore"
          className="inline-flex items-center rounded-xl bg-[var(--accent-lime)] px-5 py-2.5 text-sm font-semibold text-[#090d12]"
        >
          Browse Knowledge Library
        </Link>
        <Link
          href="/architecture"
          className="inline-flex items-center rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--border-strong)]"
        >
          Explore 3D Architecture Stack
        </Link>
      </div>

      <SupportCTA />
    </main>
  );
}
