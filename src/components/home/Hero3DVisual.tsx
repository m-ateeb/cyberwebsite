"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { HeroCompareMode } from "./Hero3DCanvas";

const LazyHero3DCanvas = dynamic(
  () => import("./Hero3DCanvas").then((mod) => ({ default: mod.Hero3DCanvas })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center font-mono text-xs text-[var(--text-muted)]">
        Loading Fig. 01...
      </div>
    ),
  }
);

export function Hero3DVisual() {
  const [mode, setMode] = useState<HeroCompareMode>("ebpf");

  return (
    <figure className="overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)]">
      {/* Figure Masthead */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-default)] px-4 py-2.5">
        <span className="font-mono text-[11px] tracking-wider text-[var(--text-muted)]">
          FIG. 01 · KERNEL VS. USER-SPACE PATH
        </span>

        <div
          role="group"
          aria-label="Compare eBPF kernel fast path vs sidecar proxies"
          className="flex items-center gap-4 text-xs"
        >
          <button
            type="button"
            onClick={() => setMode("ebpf")}
            className={`pb-0.5 font-mono text-[11px] transition-colors ${
              mode === "ebpf"
                ? "border-b border-[var(--accent-lime)] text-[var(--text-primary)] font-medium"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            eBPF Fast Path
          </button>
          <button
            type="button"
            onClick={() => setMode("sidecar")}
            className={`pb-0.5 font-mono text-[11px] transition-colors ${
              mode === "sidecar"
                ? "border-b border-[var(--accent-warn)] text-[var(--text-primary)] font-medium"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Sidecar Mesh
          </button>
        </div>
      </div>

      {/* 3D Cutaway Viewport */}
      <div className="bg-stratum-grid relative h-[285px] sm:h-[320px] w-full bg-[#090d12]">
        <LazyHero3DCanvas mode={mode} />
      </div>

      {/* Editorial Figure Caption */}
      <figcaption className="flex flex-col gap-2 border-t border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
          {mode === "ebpf" ? (
            <>
              <span className="font-medium text-[var(--text-primary)]">
                Direct Ring-0 routing:
              </span>{" "}
              eBPF enforces policy inside the Linux kernel without per-pod proxy hops.
            </>
          ) : (
            <>
              <span className="font-medium text-[var(--text-primary)]">
                Double-hop proxy tax:
              </span>{" "}
              Traffic traverses user-space Envoy sidecars on both pods, multiplying latency.
            </>
          )}
        </p>
        <Link
          href="/notes/what-is-cloud-computing"
          className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] text-[var(--accent-blue)] hover:text-[var(--text-primary)] transition-colors"
        >
          Read Cloud Note
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </figcaption>
    </figure>
  );
}
