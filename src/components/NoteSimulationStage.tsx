"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  ShieldAlert,
  ShieldCheck,
  GitBranch,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import type { SimulationStep } from "@/data/notes";

interface NoteSimulationStageProps {
  steps: SimulationStep[];
  activeStepIndex: number;
  onSelectStep: (index: number) => void;
  autoPlay: boolean;
  onToggleAutoPlay: () => void;
}

const PIPELINE_NODES = [
  { id: "client", label: "Workload", sub: "Pod / Client" },
  { id: "edge", label: "Edge", sub: "ZTNA / Ingress" },
  { id: "mesh", label: "Proxy", sub: "L7 Waypoint" },
  { id: "kernel", label: "Kernel", sub: "eBPF Hook" },
  { id: "vault", label: "Vault", sub: "KMS / Data" },
] as const;

export function NoteSimulationStage({
  steps,
  activeStepIndex,
  onSelectStep,
  autoPlay,
  onToggleAutoPlay,
}: NoteSimulationStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const current = steps[activeStepIndex] ?? steps[0];

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || !stageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sim-packet-dot",
        { attr: { cx: 24 } },
        {
          attr: { cx: 336 },
          duration: current.diagramMode === "threat" ? 1.5 : 2.1,
          repeat: -1,
          ease: "power1.inOut",
        }
      );

      gsap.fromTo(
        ".sim-caption-box",
        { y: 8, opacity: 0.4 },
        { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" }
      );
    }, stageRef);

    return () => ctx.revert();
  }, [activeStepIndex, current.diagramMode]);

  const modeColor =
    current.diagramMode === "threat"
      ? {
          badge: "border-amber-500/40 bg-amber-500/10 text-amber-300",
          stroke: "#f59e0b",
          icon: <ShieldAlert className="h-3.5 w-3.5" />,
          modeText: "Vulnerability / Tax",
        }
      : current.diagramMode === "hybrid"
      ? {
          badge: "border-sky-400/40 bg-sky-400/10 text-sky-300",
          stroke: "#38bdf8",
          icon: <GitBranch className="h-3.5 w-3.5" />,
          modeText: "Hybrid Architecture",
        }
      : {
          badge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
          stroke: "#10b981",
          icon: <ShieldCheck className="h-3.5 w-3.5" />,
          modeText: "Zero-Trust Enforced",
        };

  return (
    <div
      ref={stageRef}
      className="glass-panel rounded-2xl p-4 sm:p-5 space-y-4"
      aria-label="Read-along interactive concept simulation"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-sky-400">
            Scroll-Synced Simulation
          </span>
          <p className="font-display text-xs sm:text-sm font-semibold text-slate-100">
            {current.label}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] ${modeColor.badge}`}
        >
          {modeColor.icon}
          {modeColor.modeText}
        </span>
      </div>

      {/* 3D Perspective Pipeline Stage */}
      <div
        style={{ perspective: "900px" }}
        className="rounded-xl border border-white/[0.07] bg-[#080b10] p-3.5 overflow-hidden"
      >
        <div
          style={{ transform: "rotateX(8deg)" }}
          className="space-y-3 transition-transform duration-300"
        >
          {/* SVG Animated Packet Conduit */}
          <svg
            viewBox="0 0 360 32"
            className="w-full h-7 overflow-visible"
            aria-hidden="true"
          >
            <line
              x1="24"
              y1="16"
              x2="336"
              y2="16"
              stroke="rgba(148,163,184,0.22)"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
            <line
              x1="24"
              y1="16"
              x2="336"
              y2="16"
              stroke={modeColor.stroke}
              strokeWidth="2"
              strokeOpacity="0.45"
            />
            <circle
              className="sim-packet-dot"
              cx="24"
              cy="16"
              r="4.5"
              fill={modeColor.stroke}
            />
          </svg>

          {/* 5 Architectural Nodes */}
          <div className="grid grid-cols-5 gap-1.5">
            {PIPELINE_NODES.map((node) => {
              const isActive = current.activeNodes.includes(node.id);
              const isBlocked = current.blockedAt === node.id;

              return (
                <div
                  key={node.id}
                  className={`rounded-lg border px-1.5 py-2 text-center transition-all duration-300 ${
                    isBlocked
                      ? "border-emerald-400/70 bg-emerald-400/15 shadow-[0_0_16px_-4px_rgba(16,185,129,0.5)] -translate-y-0.5"
                      : isActive
                      ? "border-sky-400/50 bg-sky-400/10 -translate-y-0.5"
                      : "border-white/[0.06] bg-white/[0.02] opacity-45"
                  }`}
                >
                  <p className="font-mono text-[10px] font-semibold text-slate-100 truncate">
                    {node.label}
                  </p>
                  <p className="mt-0.5 text-[9px] text-slate-400 truncate">
                    {isBlocked ? "Enforced" : node.sub}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Explanation Caption */}
      <div className="sim-caption-box rounded-xl border border-white/[0.08] bg-[#0b0f16] p-3">
        <p className="text-xs leading-relaxed text-slate-300">
          {current.caption}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {current.telemetry.map((t) => (
            <div
              key={t.label}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5"
            >
              <span className="block font-mono text-[9px] uppercase text-slate-500">
                {t.label}
              </span>
              <span
                className={`font-mono text-[11px] font-semibold ${
                  t.status === "warn"
                    ? "text-amber-300"
                    : t.status === "ok"
                    ? "text-emerald-300"
                    : "text-sky-300"
                }`}
              >
                {t.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Stepper Controls */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1">
          {steps.map((s, idx) => (
            <button
              key={s.sectionId}
              type="button"
              onClick={() => onSelectStep(idx)}
              aria-label={`Simulation step ${idx + 1}: ${s.label}`}
              className={`h-2 rounded-full transition-all ${
                idx === activeStepIndex
                  ? "w-6 bg-sky-400"
                  : "w-2 bg-slate-700 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleAutoPlay}
            aria-label={autoPlay ? "Pause auto-step" : "Auto-play steps"}
            className="rounded-lg border border-white/10 bg-white/[0.03] p-1.5 text-slate-300 hover:border-white/25"
          >
            {autoPlay ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() =>
              onSelectStep(
                (activeStepIndex - 1 + steps.length) % steps.length
              )
            }
            aria-label="Previous simulation step"
            className="rounded-lg border border-white/10 bg-white/[0.03] p-1.5 text-slate-300 hover:border-white/25"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onSelectStep((activeStepIndex + 1) % steps.length)}
            aria-label="Next simulation step"
            className="rounded-lg border border-white/10 bg-white/[0.03] p-1.5 text-slate-300 hover:border-white/25"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
