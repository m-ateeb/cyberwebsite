import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ARCHITECTURE_LAYERS } from "@/lib/architecture";
import { buildPageMetadata } from "@/lib/seo";
import { ArchitectureExplorerClient } from "@/components/architecture/ArchitectureExplorerClient";

export const metadata = buildPageMetadata({
  title: "Spatial Architecture Explorer",
  description:
    "Explore the 4-layer StratumSec cloud and cybersecurity defense stack in interactive 3D.",
  pathname: "/architecture",
});

export default function ArchitecturePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <header className="max-w-3xl space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-blue)]">
          Spatial Architecture Stack
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Four Strata of Modern Cloud Defense
        </h1>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Inspect how Identity, Network, Kernel Runtime, and Cryptographic Data
          planes interlock—and jump straight into the corresponding field notes.
        </p>
      </header>

      <ArchitectureExplorerClient showFullHeader />

      <section aria-labelledby="strata-breakdown-heading" className="space-y-6">
        <h2
          id="strata-breakdown-heading"
          className="font-display text-2xl font-bold text-[var(--text-primary)]"
        >
          Stratum Reference Breakdown
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {ARCHITECTURE_LAYERS.map((layer) => {
            const isLime = layer.accent === "lime";
            return (
              <div
                key={layer.id}
                className="flex flex-col justify-between rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-mono text-xs font-semibold ${
                        isLime
                          ? "text-[var(--accent-lime)]"
                          : "text-[var(--accent-blue)]"
                      }`}
                    >
                      {layer.layer}
                    </span>
                    <div className="flex gap-1.5">
                      {layer.protocols.map((p) => (
                        <span
                          key={p}
                          className="rounded border border-[var(--border-default)] bg-[var(--bg-base)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[var(--text-primary)]">
                    {layer.subtitle}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)]">Threat:</strong>{" "}
                    {layer.threatVector}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)]">Approach:</strong>{" "}
                    {layer.modernApproach}
                  </p>
                </div>

                <div className="border-t border-[var(--border-default)] pt-4">
                  <Link
                    href={`/notes/${layer.recommendedSlug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-blue)] hover:text-[var(--accent-lime)] transition-colors"
                  >
                    Read: {layer.recommendedTitle}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
