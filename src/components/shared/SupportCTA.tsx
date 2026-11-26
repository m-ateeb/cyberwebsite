import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface SupportCTAProps {
  compact?: boolean;
}

export function SupportCTA({ compact = false }: SupportCTAProps) {
  return (
    <section
      aria-label="Support StratumSec"
      className={
        compact
          ? "rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 space-y-3"
          : "space-y-4"
      }
    >
      <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
        Reader Support
      </p>
      <h3 className="font-display text-xl font-semibold tracking-tight text-[var(--text-primary)]">
        Independent, ad-light engineering research.
      </h3>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
        Every guide is lab-tested on real cloud infrastructure. If a note saved
        your team debugging time, you can fund future deep dives directly.
      </p>
      <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-medium">
        <a
          href="https://buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 text-[var(--text-primary)] transition-colors hover:border-[var(--accent-lime)] hover:text-[var(--accent-lime)]"
        >
          Buy Me a Coffee
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
        {!compact && (
          <Link
            href="/support"
            className="text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]"
          >
            Sponsorships &amp; contact
          </Link>
        )}
      </div>
    </section>
  );
}
