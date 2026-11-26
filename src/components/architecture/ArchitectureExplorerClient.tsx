"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
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
        Loading Fig. 02...
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
    <div className="space-y-5">
      {/* Section Header + Clean Scenario Tabs */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-default)] pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1.5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
            FIG. 02 · INTERACTIVE ARCHITECTURE TRACE
          </p>
          <h2 className="font-display text-2xl sm:text-[1.75rem] font-semibold tracking-tight text-[var(--text-primary)]">
            {showFullHeader
              ? "Four-Stage Cloud & Security Request Flow"
              : "Defense-in-Depth Across Four Strata"}
          </h2>
          <p className="max-w-2xl text-sm text-[var(--text-secondary)]">
            {scenario.summary}
          </p>
        </div>

        <div
          role="group"
          aria-label="Select architecture scenario"
          className="flex flex-wrap items-center gap-5 text-xs"
        >
          {ARCHITECTURE_SCENARIOS.map((item) => {
            const isActive = item.id === scenario.id;
            const isThreat = item.id !== "zero-trust";
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectScenario(item.id)}
                className={`pb-1 font-mono text-[11px] transition-colors ${
                  isActive
                    ? isThreat
                      ? "border-b border-[var(--accent-warn)] text-[var(--text-primary)] font-medium"
                      : "border-b border-[var(--accent-lime)] text-[var(--text-primary)] font-medium"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {item.shortTitle}
              </button>
            );
          })}
        </div>
      </div>

      {/* Full-Width 3D Architectural Blueprint Frame */}
      <div className="overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)]">
        <div className="bg-stratum-grid relative h-[350px] sm:h-[410px] w-full bg-[#090d12]">
          <LazyCloudSecurity3DScene
            selectedLayerId={selectedId}
            onSelectLayer={handleSelectLayer}
            scenarioId={scenario.id}
            blockedLayerId={scenario.blockedLayerId}
            activeStepIndex={activeStepIndex}
            resetSignal={resetSignal}
          />

          {/* Subtle Top Controls */}
          <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] text-[#6f8094] bg-[#090d12]/80 px-2 py-0.5 rounded">
              Drag to orbit · Click any node
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`rounded border px-2 py-0.5 font-mono text-[10px] ${
                  scenario.blockedLayerId
                    ? "border-[#e5a93c]/40 bg-[#090d12]/90 text-[#e5a93c]"
                    : "border-[#b7f36b]/40 bg-[#090d12]/90 text-[#b7f36b]"
                }`}
              >
                {scenario.badge}
              </span>
              <button
                type="button"
                onClick={() => setResetSignal((n) => n + 1)}
                className="pointer-events-auto inline-flex items-center gap-1 rounded border border-[#1c2632] bg-[#090d12]/90 px-2 py-0.5 font-mono text-[10px] text-[#8e9eae] hover:text-[#e8eef4]"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>
          </div>

          {/* Understated Stepper Footer inside Canvas */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded border border-[#1c2632] bg-[#090d12]/92 px-3 py-1.5">
            <button
              type="button"
              onClick={() => setActiveStepIndex((i) => Math.max(0, i - 1))}
              disabled={activeStepIndex === 0}
              className="inline-flex items-center gap-1 font-mono text-[11px] text-[#8e9eae] disabled:opacity-35 hover:text-[#e8eef4]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>

            <span className="font-mono text-[11px] text-[#e8eef4]">
              Step {activeStepIndex + 1} / 4 —{" "}
              <span className="text-[#8e9eae]">{activeLayer.name}</span>
            </span>

            <button
              type="button"
              onClick={() => setActiveStepIndex((i) => Math.min(3, i + 1))}
              disabled={activeStepIndex === 3}
              className="inline-flex items-center gap-1 font-mono text-[11px] text-[#8e9eae] disabled:opacity-35 hover:text-[#e8eef4]"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 4-Column Hairline-Divided Hop Table */}
        <div className="grid divide-y divide-[var(--border-default)] border-t border-[var(--border-default)] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {scenario.hops.map((hop, idx) => {
            const layer = ARCHITECTURE_LAYERS.find((l) => l.id === hop.layerId)!;
            const isSelected = idx === activeStepIndex;
            return (
              <button
                key={hop.layerId}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`flex flex-col justify-between p-4 text-left transition-colors ${
                  isSelected
                    ? "bg-[var(--bg-elevated)]"
                    : "bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)]/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                    <span
                      className={
                        isSelected
                          ? "font-semibold text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)]"
                      }
                    >
                      {layer.index} · {layer.name.split(" ")[0]}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider ${
                        hop.status === "blocked"
                          ? "text-[var(--accent-warn)] font-semibold"
                          : hop.status === "isolated"
                          ? "text-[var(--text-muted)]"
                          : "text-[var(--accent-lime)]"
                      }`}
                    >
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

        {/* Caption & Direct Monograph Link */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-3 text-xs">
          <span className="font-mono text-[11px] text-[var(--text-muted)]">
            Inspecting{" "}
            <strong className="font-medium text-[var(--text-primary)]">
              {activeLayer.layer}
            </strong>{" "}
            — {activeLayer.subtitle}
          </span>
          <Link
            href={`/notes/${activeLayer.recommendedSlug}`}
            className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--accent-blue)] hover:text-[var(--text-primary)] transition-colors"
          >
            Read: {activeLayer.recommendedTitle}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
