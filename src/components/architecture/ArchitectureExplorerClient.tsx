"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  MousePointerClick,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import {
  ARCHITECTURE_LAYERS,
  ARCHITECTURE_SCENARIOS,
  type ArchitectureLayerId,
  type ArchitectureScenarioId,
} from "@/lib/architecture";

const LazyCloudSecurity3DScene = dynamic(
  () =>
    import("./CloudSecurity3DScene").then((mod) => ({
      default: mod.CloudSecurity3DScene,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center font-mono text-xs text-[var(--text-muted)]">
        Loading 3D Cloud Infrastructure Diagram...
      </div>
    ),
  }
);

const STEP_IDS: ArchitectureLayerId[] = ["identity", "network", "workload", "data"];

export function ArchitectureExplorerClient({
  showFullHeader = false,
}: {
  showFullHeader?: boolean;
}) {
  const [scenarioId, setScenarioId] = useState<ArchitectureScenarioId>("zero-trust");
  const [activeStepIndex, setActiveStepIndex] = useState<number>(3);
  const [resetSignal, setResetSignal] = useState<number>(0);

  const scenario =
    ARCHITECTURE_SCENARIOS.find((s) => s.id === scenarioId) ??
    ARCHITECTURE_SCENARIOS[0];
  const selectedId = STEP_IDS[activeStepIndex] ?? "identity";
  const activeLayer =
    ARCHITECTURE_LAYERS.find((l) => l.id === selectedId) ??
    ARCHITECTURE_LAYERS[0];

  const handleSelectScenario = (nextId: ArchitectureScenarioId) => {
    setScenarioId(nextId);
    const nextScenario = ARCHITECTURE_SCENARIOS.find((s) => s.id === nextId);
    if (nextScenario) {
      const targetIdx = STEP_IDS.indexOf(nextScenario.focusLayerId);
      setActiveStepIndex(targetIdx >= 0 ? targetIdx : 0);
    }
  };

  const handleSelectLayer = (layerId: ArchitectureLayerId) => {
    const idx = STEP_IDS.indexOf(layerId);
    if (idx >= 0) setActiveStepIndex(idx);
  };

  return (
    <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 sm:p-7 space-y-6">
      {/* Header + Concrete Scenario Selector */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-default)] pb-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent-blue)]">
            Interactive 3D Request &amp; Threat Walkthrough
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            {showFullHeader
              ? "3D Cloud & Security Architecture Simulator"
              : "Trace How Cloud Defense Works Step by Step"}
          </h2>
          <p className="max-w-2xl text-sm text-[var(--text-secondary)]">
            {scenario.summary}
          </p>
        </div>

        <div
          role="group"
          aria-label="Select architecture scenario"
          className="flex flex-wrap gap-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] p-1 text-xs"
        >
          {ARCHITECTURE_SCENARIOS.map((item) => {
            const isActive = item.id === scenario.id;
            const isThreat = item.id !== "zero-trust";
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectScenario(item.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-medium transition-colors ${
                  isActive
                    ? isThreat
                      ? "bg-[var(--accent-warn)] text-[#090d12] font-semibold"
                      : "bg-[var(--accent-lime)] text-[#090d12] font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {isThreat ? (
                  <ShieldAlert className="h-3.5 w-3.5" />
                ) : (
                  <ShieldCheck className="h-3.5 w-3.5" />
                )}
                {item.shortTitle}
              </button>
            );
          })}
        </div>
      </div>

      {/* Full-Width Spacious 3D Topology Canvas */}
      <div className="relative h-[360px] sm:h-[420px] w-full rounded-xl border border-[var(--border-default)] bg-[#090d12] overflow-hidden">
        <LazyCloudSecurity3DScene
          selectedLayerId={selectedId}
          onSelectLayer={handleSelectLayer}
          scenarioId={scenario.id}
          blockedLayerId={scenario.blockedLayerId}
          activeStepIndex={activeStepIndex}
          resetSignal={resetSignal}
        />

        {/* Top HUD */}
        <div className="pointer-events-none absolute top-3.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#202b37] bg-[#090d12]/88 px-2.5 py-1 font-mono text-[10px] text-[#9fb0c3]">
            <MousePointerClick className="h-3 w-3 text-[#b7f36b]" />
            Drag to inspect · Click any 3D node
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${
                scenario.blockedLayerId
                  ? "border-[#f5b942]/45 bg-[#f5b942]/12 text-[#f5b942]"
                  : "border-[#b7f36b]/45 bg-[#b7f36b]/12 text-[#b7f36b]"
              }`}
            >
              {scenario.badge}
            </span>
            <button
              type="button"
              onClick={() => setResetSignal((n) => n + 1)}
              className="pointer-events-auto inline-flex items-center gap-1 rounded-md border border-[#202b37] bg-[#090d12]/90 px-2.5 py-1 font-mono text-[10px] text-[#9fb0c3] hover:border-[#58c8ef] hover:text-[#eef2f6]"
            >
              <RotateCcw className="h-3 w-3" />
              Reset View
            </button>
          </div>
        </div>

        {/* Bottom Stepper Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded-lg border border-[#202b37] bg-[#090d12]/92 px-3 py-2">
          <button
            type="button"
            onClick={() => setActiveStepIndex((i) => Math.max(0, i - 1))}
            disabled={activeStepIndex === 0}
            className="inline-flex items-center gap-1 rounded-md border border-[#202b37] px-2.5 py-1 font-mono text-[11px] text-[#eef2f6] disabled:opacity-40 hover:border-[#b7f36b]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Prev Hop
          </button>

          <span className="font-mono text-[11px] text-[#b7f36b]">
            Step {activeStepIndex + 1} / 4 · {activeLayer.name}
          </span>

          <button
            type="button"
            onClick={() => setActiveStepIndex((i) => Math.min(3, i + 1))}
            disabled={activeStepIndex === 3}
            className="inline-flex items-center gap-1 rounded-md border border-[#202b37] px-2.5 py-1 font-mono text-[11px] text-[#eef2f6] disabled:opacity-40 hover:border-[#b7f36b]"
          >
            Next Hop
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 4-Column Horizontal Hop Trace (Aligned 1-to-1 with the 4 3D Nodes Above) */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {scenario.hops.map((hop, idx) => {
          const layer = ARCHITECTURE_LAYERS.find((l) => l.id === hop.layerId)!;
          const isSelected = idx === activeStepIndex;
          return (
            <button
              key={hop.layerId}
              type="button"
              onClick={() => setActiveStepIndex(idx)}
              className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-colors ${
                hop.status === "blocked"
                  ? "border-[var(--accent-warn)]/65 bg-[var(--accent-warn-dim)]"
                  : isSelected
                  ? "border-[var(--accent-lime)] bg-[var(--bg-base)]"
                  : "border-[var(--border-default)] bg-[var(--bg-base)]/60 hover:border-[var(--border-strong)]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold text-[var(--text-primary)]">
                    {layer.index} · {layer.name.split(" ")[0]}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9.5px] uppercase ${
                      hop.status === "blocked"
                        ? "bg-[var(--accent-warn)] text-[#090d12] font-bold"
                        : hop.status === "isolated"
                        ? "border border-[var(--border-default)] text-[var(--text-muted)]"
                        : "bg-[var(--accent-lime-dim)] text-[var(--accent-lime)]"
                    }`}
                  >
                    {hop.status === "blocked" ? (
                      <XCircle className="h-2.5 w-2.5" />
                    ) : hop.status === "isolated" ? (
                      <Lock className="h-2.5 w-2.5" />
                    ) : (
                      <CheckCircle2 className="h-2.5 w-2.5" />
                    )}
                    {hop.status}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {hop.summary}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Link to Deep-Dive Note for Selected Stratum */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-default)] pt-4">
        <span className="font-mono text-xs text-[var(--text-muted)]">
          Selected: <strong className="text-[var(--text-primary)]">{activeLayer.layer}</strong> — {activeLayer.subtitle}
        </span>
        <Link
          href={`/notes/${activeLayer.recommendedSlug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-blue)] hover:text-[var(--accent-lime)] transition-colors"
        >
          Read Deep Dive: {activeLayer.recommendedTitle}
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
