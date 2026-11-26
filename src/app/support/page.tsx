import React from "react";
import { Coffee, GitBranch, Mail, Rss } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import { NewsletterSection } from "@/components/shared/NewsletterSection";

export const metadata = buildPageMetadata({
  title: "Support & Newsletter",
  description:
    "Support independent cloud and security technical writing on StratumSec, subscribe to field dispatches, or get in touch.",
  pathname: "/support",
});

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <header className="max-w-3xl space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-lime)]">
          Support &amp; Community
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Support Independent Engineering Notes
        </h1>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          StratumSec stays free to read, fast, and independent thanks to readers
          and technical sponsors.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent-lime)]/40 bg-[var(--accent-lime-dim)] text-[var(--accent-lime)]">
              <Coffee className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
              Buy Me a Coffee
            </h2>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              One-time or recurring support directly funds cloud lab testing,
              Kubernetes/eBPF testbeds, and new architectural deep dives.
            </p>
          </div>
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--accent-lime)] px-5 py-2.5 text-sm font-semibold text-[#090d12] transition-opacity hover:opacity-90"
          >
            <Coffee className="h-4 w-4" />
            Support on Buy Me a Coffee
          </a>
        </div>

        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent-blue)]/40 bg-[var(--accent-blue-dim)] text-[var(--accent-blue)]">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
              Channels &amp; Contact
            </h2>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              Follow repository updates, subscribe via RSS, or reach out for
              technical corrections and sponsorship inquiries.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <a
              href="https://github.com/m-ateeb/cyberwebsite"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--border-strong)]"
            >
              <GitBranch className="h-3.5 w-3.5" />
              GitHub Repository
            </a>
            <a
              href="/rss.xml"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-lime)]"
            >
              <Rss className="h-3.5 w-3.5" />
              RSS Feed
            </a>
          </div>
        </div>
      </div>

      <NewsletterSection />
    </main>
  );
}
