"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Cloud,
  FolderSync,
  Laptop,
  Monitor,
  Pause,
  Play,
  RotateCcw,
  Server,
  Smartphone,
  Zap,
} from "lucide-react";

type VisualMode = "sync" | "elasticity" | "models";
type ServiceModel = "IaaS" | "PaaS" | "SaaS";

const SERVICE_LAYERS: {
  name: string;
  IaaS: "user" | "provider";
  PaaS: "user" | "provider";
  SaaS: "user" | "provider";
}[] = [
  { name: "Data & Access Policies", IaaS: "user", PaaS: "user", SaaS: "user" },
  { name: "Application Code", IaaS: "user", PaaS: "user", SaaS: "provider" },
  { name: "Runtime & OS Patching", IaaS: "user", PaaS: "provider", SaaS: "provider" },
  { name: "Virtualization & Compute", IaaS: "provider", PaaS: "provider", SaaS: "provider" },
  { name: "Physical Data Center", IaaS: "provider", PaaS: "provider", SaaS: "provider" },
];

export function CloudComputingVisualizer() {
  const [mode, setMode] = useState<VisualMode>("sync");
  const [playing, setPlaying] = useState(true);
  const [tick, setTick] = useState(0);
  const [spikeActive, setSpikeActive] = useState(false);
  const [serviceModel, setServiceModel] = useState<ServiceModel>("PaaS");

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!playing || prefersReduced) return;

    const id = setInterval(() => {
      setTick((t) => (t + 1) % 4);
    }, 1500);
    return () => clearInterval(id);
  }, [playing]);

  const activeInstances = spikeActive ? 6 : 2;
  const syncStepLabels = [
    "1. Laptop uploads updated file to Cloud Object Storage",
    "2. Cloud replicates object across availability zones",
    "3. Smartphone & Analytics desktops receive instant sync notification",
    "4. All 4 client devices reflect the latest version over HTTPS",
  ];

  const handleReset = () => {
    setTick(0);
    setSpikeActive(false);
    setPlaying(true);
  };

  return (
    <section
      aria-label="Interactive Cloud Computing Visualizer"
      className="my-8 overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)]"
    >
      {/* Header + Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-default)] px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-blue)]">
            Interactive Learning Module · Cloud Computing
          </p>
          <p className="font-display text-sm font-semibold text-[var(--text-primary)]">
            Visualize How Cloud Services Power Every Device
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          {(
            [
              { id: "sync", label: "Multi-Device Sync" },
              { id: "elasticity", label: "Auto-Scaling" },
              { id: "models", label: "IaaS / PaaS / SaaS" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              className={`pb-0.5 font-mono text-[11px] transition-colors ${
                mode === tab.id
                  ? "border-b border-[var(--accent-lime)] text-[var(--text-primary)] font-medium"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-stratum-grid p-5 sm:p-6 bg-[#090d12]">
        {mode === "models" ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#8e9eae]">
                Toggle a service model to inspect which layers{" "}
                <span className="text-[#b7f36b] font-medium">You Manage</span> vs.{" "}
                <span className="text-[#58c8ef] font-medium">Cloud Provider Manages</span>.
              </p>
              <div className="inline-flex rounded-md border border-[#1c2632] bg-[#0e141b] p-0.5 font-mono text-[11px]">
                {(["IaaS", "PaaS", "SaaS"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setServiceModel(m)}
                    className={`rounded px-3 py-1 transition-colors ${
                      serviceModel === m
                        ? "bg-[#e8eef4] text-[#090d12] font-semibold"
                        : "text-[#8e9eae] hover:text-[#e8eef4]"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {SERVICE_LAYERS.map((layer) => {
                const owner = layer[serviceModel];
                const isUser = owner === "user";
                return (
                  <div
                    key={layer.name}
                    className={`flex items-center justify-between rounded-md border px-4 py-2.5 transition-all duration-300 ${
                      isUser
                        ? "border-[#b7f36b]/45 bg-[#b7f36b]/10"
                        : "border-[#58c8ef]/35 bg-[#58c8ef]/8"
                    }`}
                  >
                    <span className="font-mono text-xs text-[#e8eef4]">
                      {layer.name}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                        isUser
                          ? "bg-[#b7f36b] text-[#090d12] font-semibold"
                          : "border border-[#58c8ef]/50 text-[#58c8ef]"
                      }`}
                    >
                      {isUser ? "You Manage" : "Cloud Provider"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Top Cloud Data Center Hub */}
            <div className="mx-auto max-w-xl rounded-xl border border-[#58c8ef]/50 bg-[#0e141b] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#58c8ef]/40 bg-[#58c8ef]/10 text-[#58c8ef]">
                    <Cloud className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-[#e8eef4]">
                      Cloud Computing Platform
                    </p>
                    <p className="font-mono text-[10px] text-[#8e9eae]">
                      {mode === "sync"
                        ? "Object Storage · Identity · SaaS Messaging"
                        : `Elastic Compute Pool · ${activeInstances} Active Instances`}
                    </p>
                  </div>
                </div>

                {mode === "elasticity" && (
                  <button
                    type="button"
                    onClick={() => setSpikeActive((s) => !s)}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-[11px] font-semibold transition-colors ${
                      spikeActive
                        ? "border-[#e5a93c] bg-[#e5a93c] text-[#090d12]"
                        : "border-[#b7f36b]/50 bg-[#b7f36b]/10 text-[#b7f36b] hover:bg-[#b7f36b] hover:text-[#090d12]"
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    {spikeActive ? "Cool Down Traffic" : "Simulate Traffic Spike"}
                  </button>
                )}
              </div>

              {/* Elastic Server Nodes inside the Cloud */}
              <div className="mt-4 grid grid-cols-6 gap-2">
                {Array.from({ length: 6 }).map((_, idx) => {
                  const isRunning = idx < activeInstances;
                  const isPulsing = isRunning && tick % 2 === idx % 2;
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col items-center justify-center rounded-md border py-2 font-mono text-[10px] transition-all duration-300 ${
                        isRunning
                          ? spikeActive
                            ? "border-[#e5a93c]/70 bg-[#e5a93c]/15 text-[#e5a93c]"
                            : isPulsing
                            ? "border-[#b7f36b]/70 bg-[#b7f36b]/15 text-[#b7f36b]"
                            : "border-[#58c8ef]/50 bg-[#58c8ef]/10 text-[#58c8ef]"
                          : "border-[#1c2632] bg-[#090d12] text-[#5d6d7e] opacity-40"
                      }`}
                    >
                      <Server className="h-3.5 w-3.5 mb-1" />
                      <span>VM-0{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Animated SVG Network Conduits (Matching the 4 Dotted Streams in the Uploaded Image) */}
            <svg
              viewBox="0 0 600 64"
              className="mx-auto h-14 w-full max-w-2xl overflow-visible"
              aria-hidden="true"
            >
              {[75, 225, 375, 525].map((x, idx) => {
                const isUpward = mode === "sync" && tick === 0 && idx === 1;
                const isActive =
                  mode === "elasticity"
                    ? spikeActive || idx === 0 || idx === 3
                    : tick >= 2 || (tick === 0 && idx === 1) || tick === 1;
                const dotY = isUpward ? 14 : tick % 2 === 0 ? 48 : 24;
                const color =
                  mode === "elasticity" && spikeActive
                    ? "#e5a93c"
                    : isUpward
                    ? "#b7f36b"
                    : "#58c8ef";
                return (
                  <g key={x}>
                    <line
                      x1={x}
                      y1="4"
                      x2={x}
                      y2="60"
                      stroke={isActive ? color : "#1c2632"}
                      strokeWidth="2"
                      strokeDasharray="4 6"
                    />
                    {isActive && (
                      <circle
                        cx={x}
                        cy={dotY}
                        r="4.5"
                        fill={color}
                        style={{ transition: "cy 600ms ease" }}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Bottom 4 Connected Client Devices (Directly Mirroring the Uploaded Image) */}
            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  id: "analytics",
                  title: "BI Desktop",
                  sub: "Cloud Analytics",
                  icon: <Monitor className="h-4 w-4 text-[#58c8ef]" />,
                  highlight:
                    (mode === "sync" && tick >= 2) ||
                    (mode === "elasticity" && spikeActive),
                },
                {
                  id: "laptop",
                  title: "Sync Laptop",
                  sub: "File Storage",
                  icon: <Laptop className="h-4 w-4 text-[#b7f36b]" />,
                  highlight: mode === "sync" && (tick === 0 || tick === 3),
                },
                {
                  id: "mobile",
                  title: "Smartphone",
                  sub: "SaaS Email",
                  icon: <Smartphone className="h-4 w-4 text-[#58c8ef]" />,
                  highlight: mode === "sync" && tick >= 2,
                },
                {
                  id: "metrics",
                  title: "Metrics Node",
                  sub: "Live Telemetry",
                  icon: <BarChart3 className="h-4 w-4 text-[#b7f36b]" />,
                  highlight: mode === "elasticity" || tick === 3,
                },
              ].map((device) => (
                <div
                  key={device.id}
                  className={`rounded-lg border p-3 text-center transition-colors duration-300 ${
                    device.highlight
                      ? "border-[#b7f36b]/65 bg-[#141d27]"
                      : "border-[#1c2632] bg-[#0e141b]"
                  }`}
                >
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-md border border-[#1c2632] bg-[#090d12]">
                    {device.icon}
                  </div>
                  <p className="mt-2 font-mono text-[11px] font-semibold text-[#e8eef4]">
                    {device.title}
                  </p>
                  <p className="font-mono text-[10px] text-[#8e9eae]">
                    {device.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Explanation & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-xs">
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <FolderSync className="h-3.5 w-3.5 shrink-0 text-[var(--accent-blue)]" />
          <span>
            {mode === "sync"
              ? syncStepLabels[tick]
              : mode === "elasticity"
              ? spikeActive
                ? "Traffic spike detected: Auto-scaler provisioned 6 VMs in seconds to keep latency flat."
                : "Baseline traffic: Running 2 VMs so you only pay for compute you actively use."
              : `${serviceModel} selected: inspect the shared responsibility boundary above.`}
          </span>
        </div>

        {mode !== "models" && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause animation" : "Play animation"}
              className="inline-flex items-center gap-1 rounded border border-[var(--border-default)] bg-[var(--bg-base)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              {playing ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset visualizer"
              className="inline-flex items-center gap-1 rounded border border-[var(--border-default)] bg-[var(--bg-base)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
