"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight, Cpu, Layers } from "lucide-react";
import type { HeroCompareMode } from "./Hero3DCanvas";

const LazyHero3DCanvas = dynamic(
  () => import("./Hero3DCanvas").then((mod) => ({ default: mod.Hero3DCanvas })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center font-mono text-xs text-[var(--text-muted)]">
        Loading 3D Kernel Cutaway...
      </div>
    ),
  }
);

export function Hero3DVisual() {
  const [mode, setMode] = useState<HeroCompareMode>("ebpf");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)]">
      {/* Header + eBPF vs Sidecar Cutaway Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-default)] px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
          3D Kernel Cutaway · User Space vs Ring-0
        </span>

        <div
          role="group"
          aria-label="Compare eBPF kernel fast path vs sidecar proxies"
          className="inline-flex rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] p-0.5 text-[11px]"
        >
          <button
            type="button"
            onClick={() => setMode("ebpf")}
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-colors ${
              mode === "ebpf"
                ? "bg-[var(--accent-lime)] text-[#090d12] font-semibold"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Cpu className="h-3 w-3" />
            eBPF Fast Path
          </button>
          <button
            type="button"
            onClick={() => setMode("sidecar")}
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-colors ${
              mode === "sidecar"
                ? "bg-[var(--accent-warn)] text-[#090d12] font-semibold"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Layers className="h-3 w-3" />
            Sidecar Mesh
          </button>
        </div>
      </div>

      {/* 3D User-Space / Kernel Cutaway Viewport */}
      <div className="relative h-[290px] sm:h-[330px] w-full bg-[#090d12]">
        <LazyHero3DCanvas mode={mode} />
      </div>

      {/* Concise Technical Explanation */}
      <div className="flex flex-col gap-2 border-t border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
          {mode === "ebpf" ? (
            <>
              <strong className="text-[var(--accent-lime)]">eBPF Kernel Hook:</strong>{" "}
              Packets route directly between Pod A and Pod B inside Linux Ring-0—zero
              per-pod proxy memory overhead and full syscall visibility.
            </>
          ) : (
            <>
              <strong className="text-[var(--accent-warn)]">Sidecar Proxies:</strong>{" "}
              Every packet bounces repeatedly between User Space and Kernel through
              two Envoy sidecars, adding latency and extra TCP hops per pod.
            </>
          )}
        </p>
        <Link
          href="/notes/ebpf-kernel-observability-vs-sidecars"
          className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] font-semibold text-[var(--accent-blue)] hover:text-[var(--accent-lime)]"
        >
          Read note
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
