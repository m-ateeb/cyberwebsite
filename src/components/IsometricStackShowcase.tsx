"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, KeyRound, Network, Cpu, Database } from "lucide-react";
import { ARCHITECTURE_LAYERS } from "@/data/notes";

const ICONS: Record<string, React.ReactNode> = {
  identity: <KeyRound className="h-4 w-4 text-sky-400" />,
  network: <Network className="h-4 w-4 text-indigo-400" />,
  workload: <Cpu className="h-4 w-4 text-emerald-400" />,
  data: <Database className="h-4 w-4 text-cyan-300" />,
};

export function IsometricStackShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeLayer = ARCHITECTURE_LAYERS[activeIndex];

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-7 relative overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
            Spatial Architecture Stack
          </span>
          <p className="mt-0.5 font-display text-sm font-semibold text-slate-100">
            Click a floating layer to inspect
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-slate-300">
          4-Layer Model
        </span>
      </div>

      {/* Isometric Floating Wafers */}
      <div className="isometric-stage py-10 sm:py-12 flex items-center justify-center">
        <div className="isometric-stack relative w-64 sm:w-72 space-y-3">
          {ARCHITECTURE_LAYERS.map((layer, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                style={{
                  transform: isActive
                    ? "translateZ(26px) translateX(-6px)"
                    : "translateZ(0px)",
                }}
                className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-300 backdrop-blur-md ${
                  isActive
                    ? "border-sky-400/60 bg-slate-900/95 shadow-[0_24px_45px_rgba(0,0,0,0.65)]"
                    : "border-white/10 bg-slate-900/65 hover:border-white/25 hover:bg-slate-900/85 shadow-[0_12px_24px_rgba(0,0,0,0.4)]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {ICONS[layer.id]}
                    <span className="font-mono text-xs font-semibold text-slate-100">
                      {layer.layer.split("·")[1]?.trim() ?? layer.layer}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    0{idx + 1}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Layer Summary Readout */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#090b0f]/80 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] text-sky-400">
            {activeLayer.layer}
          </span>
          <Link
            href={`/notes/${activeLayer.recommendedSlug}`}
            className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-300 hover:text-sky-300 transition-colors"
          >
            Read Note
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
          {activeLayer.modernApproach}
        </p>
      </div>
    </div>
  );
}
