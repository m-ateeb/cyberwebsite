"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  KeyRound,
  Network,
  Cpu,
  Database,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Flame,
  MousePointerClick,
} from "lucide-react";
import { ARCHITECTURE_LAYERS } from "@/data/notes";
import {
  CloudSecurity3DScene,
  type SimulationMode,
} from "./CloudSecurity3DScene";

const LAYER_ICONS: Record<string, React.ReactNode> = {
  identity: <KeyRound className="h-4 w-4" />,
  network: <Network className="h-4 w-4" />,
  workload: <Cpu className="h-4 w-4" />,
  data: <Database className="h-4 w-4" />,
};

export function StackDefenseExplorer() {
  const [selectedId, setSelectedId] = useState<string>(ARCHITECTURE_LAYERS[0].id);
  const [mode, setMode] = useState<SimulationMode>("defense");

  const active =
    ARCHITECTURE_LAYERS.find((l) => l.id === selectedId) ?? ARCHITECTURE_LAYERS[0];

  return (
    <section
      id="architecture-explorer"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      aria-labelledby="explorer-heading"
    >
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/90 bg-[#0b1018]/95 p-5 sm:p-8 shadow-[0_25px_80px_-20px_rgba(14,165,233,0.18)]">
        {/* Top HUD Bar */}
        <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-sky-400">
              <span className="inline-block h-2 w-2 rounded-full bg-sky-400 animate-ping" />
              Interactive 3D Learning Lab
            </div>
            <h2
              id="explorer-heading"
              className="mt-1 font-display text-2xl sm:text-3xl font-bold text-slate-100"
            >
              3D Cloud &amp; Security Topology Simulator
            </h2>
          </div>

          {/* Simulation Mode Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="Simulation mode"
              className="inline-flex rounded-xl border border-slate-800 bg-[#080c12] p-1 text-xs"
            >
              <button
                type="button"
                onClick={() => setMode("defense")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-medium transition-all ${
                  mode === "defense"
                    ? "bg-sky-400/20 text-sky-300 border border-sky-400/40 shadow-[0_0_20px_-4px_rgba(56,189,248,0.45)]"
                    : "text-slate-400 hover:text-slate-200 border border-transparent"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Zero-Trust Defense
              </button>
              <button
                type="button"
                onClick={() => setMode("attack")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-medium transition-all ${
                  mode === "attack"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_20px_-4px_rgba(245,158,11,0.45)]"
                    : "text-slate-400 hover:text-slate-200 border border-transparent"
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                Simulate Attack
              </button>
            </div>
          </div>
        </div>

        {/* 3D Canvas + Interactive Learning Panel */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* Interactive 3D WebGL Canvas */}
          <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[460px] rounded-2xl border border-slate-800/80 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.12),rgba(7,10,15,0.95))] overflow-hidden">
            <CloudSecurity3DScene
              selectedLayerId={selectedId}
              onSelectLayer={setSelectedId}
              mode={mode}
            />

            {/* Floating Canvas Controls & Hint */}
            <div className="pointer-events-none absolute top-3.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-[#0a0f17]/80 px-3 py-1 font-mono text-[10px] text-slate-300 backdrop-blur-md">
                <MousePointerClick className="h-3 w-3 text-sky-400" />
                Drag to orbit · Click any 3D node
              </span>
              <span
                className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider backdrop-blur-md ${
                  mode === "attack"
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                }`}
              >
                {mode === "attack"
                  ? "Threat Packets Probing"
                  : "mTLS + eBPF Verified"}
              </span>
            </div>

            {/* Bottom Layer Quick-Select Dock */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap justify-center gap-1.5">
              {ARCHITECTURE_LAYERS.map((layer) => {
                const isSelected = layer.id === active.id;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => setSelectedId(layer.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 font-mono text-[11px] backdrop-blur-md transition-all ${
                      isSelected
                        ? "border-sky-400/60 bg-sky-400/20 text-sky-200 shadow-lg"
                        : "border-slate-800/90 bg-[#0a0f17]/80 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {LAYER_ICONS[layer.id]}
                    <span>{layer.layer.split("·")[1]?.trim() ?? layer.layer}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right-hand Animated Learning Breakdown */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0d121a]/90 p-5 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${active.id}-${mode}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                <div>
                  <span className="font-mono text-xs text-sky-400">
                    {active.layer}
                  </span>
                  <h3 className="mt-1 font-display text-lg font-bold text-slate-100">
                    {active.subtitle}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {active.controls.map((ctrl) => (
                    <span
                      key={ctrl}
                      className="rounded-md border border-slate-700/80 bg-slate-800/70 px-2.5 py-0.5 font-mono text-[11px] text-slate-300"
                    >
                      {ctrl}
                    </span>
                  ))}
                </div>

                <div
                  className={`rounded-xl border p-4 transition-colors ${
                    mode === "attack"
                      ? "border-amber-500/50 bg-amber-500/10"
                      : "border-amber-500/20 bg-amber-500/5"
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {mode === "attack"
                      ? "Active Attack Surface"
                      : "Legacy Threat Vector"}
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-200">
                    {active.threatVector}
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-4 transition-colors ${
                    mode === "defense"
                      ? "border-emerald-500/50 bg-emerald-500/10"
                      : "border-emerald-500/20 bg-emerald-500/5"
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Modern Engineering Approach
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-200">
                    {active.modernApproach}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="text-xs text-slate-400">Deep-Dive Note</span>
              <Link
                href={`/notes/${active.recommendedSlug}`}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors"
              >
                {active.recommendedTitle}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
