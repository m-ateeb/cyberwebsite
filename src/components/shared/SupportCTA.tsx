import React from "react";
import Link from "next/link";
import { Coffee, ArrowRight } from "lucide-react";

interface SupportCTAProps {
  compact?: boolean;
}

export function SupportCTA({ compact = false }: SupportCTAProps) {
  return (
    <section
      aria-label="Support StratumSec"
      className={`rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] ${
        compact ? "p-5 sm:p-6" : "p-6 sm:p-9"
      }`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[var(--accent-lime)]">
            <Coffee className="h-3.5 w-3.5" />
            Support Independent Technical Writing
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
            Keep StratumSec open, fast, and reader-funded.
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Every note takes hours of lab testing, diagramming, and verification.
            If a guide saved you debugging time, consider buying a coffee.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-lime)] px-5 py-2.5 text-sm font-semibold text-[#090d12] transition-opacity hover:opacity-90"
          >
            <Coffee className="h-4 w-4" />
            Buy Me a Coffee
          </a>
          {!compact && (
            <Link
              href="/support"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)]"
            >
              More ways to support
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
