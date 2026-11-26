"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Route,
  ShieldAlert,
  Sliders,
} from "lucide-react";

type SimTab = "cidr" | "vlsm" | "public-private";
type RouteScenario = "inbound-public" | "inbound-private" | "outbound-nat";

interface CidrPreset {
  prefix: number;
  mask: string;
  totalIps: number;
  standardUsable: number;
  cloudUsable: number;
  sampleRange: string;
  typicalUse: string;
}

const CIDR_PRESETS: CidrPreset[] = [
  {
    prefix: 24,
    mask: "255.255.255.0",
    totalIps: 256,
    standardUsable: 254,
    cloudUsable: 251,
    sampleRange: "10.0.1.0 – 10.0.1.255",
    typicalUse: "Standard VPC subnet (app servers, office floor)",
  },
  {
    prefix: 25,
    mask: "255.255.255.128",
    totalIps: 128,
    standardUsable: 126,
    cloudUsable: 123,
    sampleRange: "10.0.1.0 – 10.0.1.127",
    typicalUse: "Medium application or Kubernetes node pool",
  },
  {
    prefix: 26,
    mask: "255.255.255.192",
    totalIps: 64,
    standardUsable: 62,
    cloudUsable: 59,
    sampleRange: "10.0.1.0 – 10.0.1.63",
    typicalUse: "Database tier or microservice cluster",
  },
  {
    prefix: 27,
    mask: "255.255.255.224",
    totalIps: 32,
    standardUsable: 30,
    cloudUsable: 27,
    sampleRange: "10.0.1.0 – 10.0.1.31",
    typicalUse: "Public load balancer / NAT subnet",
  },
  {
    prefix: 28,
    mask: "255.255.255.240",
    totalIps: 16,
    standardUsable: 14,
    cloudUsable: 11,
    sampleRange: "10.0.1.0 – 10.0.1.15",
    typicalUse: "Small admin/bastion subnet (AWS minimum)",
  },
  {
    prefix: 30,
    mask: "255.255.255.252",
    totalIps: 4,
    standardUsable: 2,
    cloudUsable: 0,
    sampleRange: "10.0.1.0 – 10.0.1.3",
    typicalUse: "Point-to-point link between 2 routers",
  },
];

interface VlsmBlock {
  id: string;
  name: string;
  needed: number;
  cidr: string;
  range: string;
  allocated: number;
  widthPct: number;
  accent: string;
}

const FIXED_BLOCKS: VlsmBlock[] = [
  {
    id: "app",
    name: "App Servers",
    needed: 55,
    cidr: "10.0.1.0/26",
    range: ".0 – .63",
    allocated: 64,
    widthPct: 25,
    accent: "#58c8ef",
  },
  {
    id: "db",
    name: "Databases",
    needed: 20,
    cidr: "10.0.1.64/26",
    range: ".64 – .127",
    allocated: 64,
    widthPct: 25,
    accent: "#b7f36b",
  },
  {
    id: "lb",
    name: "Load Balancers",
    needed: 10,
    cidr: "10.0.1.128/26",
    range: ".128 – .191",
    allocated: 64,
    widthPct: 25,
    accent: "#e5a93c",
  },
  {
    id: "link",
    name: "Router Link",
    needed: 2,
    cidr: "10.0.1.192/26",
    range: ".192 – .255",
    allocated: 64,
    widthPct: 25,
    accent: "#8e9eae",
  },
];

const VLSM_BLOCKS: VlsmBlock[] = [
  {
    id: "app",
    name: "App Servers",
    needed: 55,
    cidr: "10.0.1.0/26",
    range: ".0 – .63",
    allocated: 64,
    widthPct: 25,
    accent: "#58c8ef",
  },
  {
    id: "db",
    name: "Databases",
    needed: 20,
    cidr: "10.0.1.64/27",
    range: ".64 – .95",
    allocated: 32,
    widthPct: 12.5,
    accent: "#b7f36b",
  },
  {
    id: "lb",
    name: "Load Balancers",
    needed: 10,
    cidr: "10.0.1.96/28",
    range: ".96 – .111",
    allocated: 16,
    widthPct: 6.25,
    accent: "#e5a93c",
  },
  {
    id: "link",
    name: "Router Link",
    needed: 2,
    cidr: "10.0.1.112/30",
    range: ".112 – .115",
    allocated: 4,
    widthPct: 3.25,
    accent: "#c084fc",
  },
  {
    id: "free",
    name: "Free Space Saved!",
    needed: 0,
    cidr: "10.0.1.116 – .255",
    range: "140 IPs free",
    allocated: 140,
    widthPct: 53,
    accent: "#1c2632",
  },
];

export function SubnettingCidrVisualizer() {
  const [tab, setTab] = useState<SimTab>("cidr");

  // Tab 1: CIDR prefix explorer
  const [selectedPrefix, setSelectedPrefix] = useState<number>(26);

  // Tab 2: VLSM vs Fixed Subnetting
  const [vlsmMode, setVlsmMode] = useState<"fixed" | "vlsm">("vlsm");
  const [activeBlockId, setActiveBlockId] = useState<string>("db");

  // Tab 3: Public vs Private Subnet Routing
  const [scenario, setScenario] = useState<RouteScenario>("inbound-public");
  const [playing, setPlaying] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!playing || prefersReduced || tab !== "public-private") return;

    const id = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 1800);
    return () => clearInterval(id);
  }, [playing, tab]);

  const cidrInfo =
    CIDR_PRESETS.find((c) => c.prefix === selectedPrefix) ?? CIDR_PRESETS[2];
  const hostBits = 32 - cidrInfo.prefix;

  const blocks = vlsmMode === "vlsm" ? VLSM_BLOCKS : FIXED_BLOCKS;
  const activeBlock =
    blocks.find((b) => b.id === activeBlockId) ?? blocks[0];

  const totalNeeded = 87; // 55 + 20 + 10 + 2
  const totalAllocated = vlsmMode === "vlsm" ? 116 : 256;
  const wastedIps = totalAllocated - totalNeeded;

  const scenarioNotes: Record<RouteScenario, string[]> = {
    "inbound-public": [
      "1. Internet User sends HTTPS request to your Load Balancer's Public IP (198.51.100.10).",
      "2. Internet Gateway checks the Public Route Table (0.0.0.0/0 → IGW) and admits the packet.",
      "3. Packet arrives at the Public Subnet (10.0.1.0/24). That route to an IGW is what makes a subnet Public!",
    ],
    "inbound-private": [
      "1. External attacker tries to connect directly to your Database in the Private Subnet (10.0.2.25).",
      "2. Blocked at the VPC edge! The Private Subnet has NO public IP and NO route from the Internet Gateway.",
      "3. Zero direct exposure—private workloads can only be reached internally from inside your VPC.",
    ],
    "outbound-nat": [
      "1. Private App Server (10.0.2.15) needs to download a security patch from the Internet.",
      "2. Private Route Table sends 0.0.0.0/0 traffic to the NAT Gateway sitting in the Public Subnet.",
      "3. NAT Gateway swaps the private IP for its own public IP, fetches the patch, and returns it safely!",
    ],
  };

  // Packet coordinates for Tab 3 SVG
  const routePacket = (() => {
    if (scenario === "inbound-public") {
      if (step === 0) return { x: 64, y: 102 };
      if (step === 1) return { x: 205, y: 102 };
      return { x: 345, y: 102 };
    }
    if (scenario === "inbound-private") {
      if (step === 0) return { x: 64, y: 102 };
      return { x: 205, y: 102 };
    }
    // outbound-nat: Private -> NAT (Public) -> Internet
    if (step === 0) return { x: 525, y: 102 };
    if (step === 1) return { x: 345, y: 102 };
    return { x: 64, y: 102 };
  })();

  const handleReset = () => {
    setStep(0);
    setPlaying(true);
    setSelectedPrefix(26);
    setVlsmMode("vlsm");
    setScenario("inbound-public");
  };

  return (
    <section
      aria-label="Interactive CIDR, VLSM, and Public vs. Private Subnet Simulator"
      className="my-8 overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)]"
    >
      {/* Header + Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-default)] px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-blue)]">
            Interactive Learning Module · IP Addressing &amp; Subnetting
          </p>
          <p className="font-display text-sm font-semibold text-[var(--text-primary)]">
            Slice CIDR Blocks, Compare VLSM &amp; Trace Public vs. Private Routes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
          {(
            [
              { id: "cidr", label: "1. CIDR Slicer" },
              { id: "vlsm", label: "2. VLSM vs. Fixed" },
              { id: "public-private", label: "3. Public vs. Private" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id);
                setStep(0);
              }}
              className={`pb-0.5 font-mono text-[11px] transition-colors cursor-pointer ${
                tab === item.id
                  ? "border-b border-[var(--accent-lime)] text-[var(--text-primary)] font-medium"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stage */}
      <div className="bg-stratum-grid bg-[#090d12] p-4 sm:p-6">
        {/* ================= TAB 1: CIDR SLICER ================= */}
        {tab === "cidr" && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#8e9eae]">
                <Sliders className="h-3.5 w-3.5 text-[#58c8ef]" />
                <span>
                  Choose a CIDR Prefix on{" "}
                  <span className="text-[#e8eef4]">10.0.1.0/{cidrInfo.prefix}</span>:
                </span>
              </div>

              <div className="inline-flex flex-wrap rounded-md border border-[#1c2632] bg-[#0e141b] p-0.5 font-mono text-[11px]">
                {CIDR_PRESETS.map((c) => (
                  <button
                    key={c.prefix}
                    type="button"
                    onClick={() => setSelectedPrefix(c.prefix)}
                    className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                      selectedPrefix === c.prefix
                        ? "bg-[#e8eef4] text-[#090d12] font-semibold"
                        : "text-[#8e9eae] hover:text-[#e8eef4]"
                    }`}
                  >
                    /{c.prefix}
                  </button>
                ))}
              </div>
            </div>

            {/* 32-Bit Visual Breakdown */}
            <div className="rounded-lg border border-[#1c2632] bg-[#0e141b] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] mb-2.5">
                <span className="text-[#58c8ef]">
                  Network Prefix: {cidrInfo.prefix} bits (Fixed Address)
                </span>
                <span className="text-[#b7f36b]">
                  Host Portion: {hostBits} bits (2^{hostBits} = {cidrInfo.totalIps} IPs)
                </span>
              </div>

              <div
                className="grid gap-[2px]"
                style={{ gridTemplateColumns: "repeat(32, minmax(0, 1fr))" }}
              >
                {Array.from({ length: 32 }).map((_, idx) => {
                  const isNetwork = idx < cidrInfo.prefix;
                  const isOctetBoundary = idx === 8 || idx === 16 || idx === 24;
                  return (
                    <div
                      key={idx}
                      className={`h-6 rounded-[2px] transition-all duration-300 ${
                        isOctetBoundary ? "ml-[2px]" : ""
                      } ${
                        isNetwork
                          ? "bg-[#58c8ef]/80"
                          : "bg-[#b7f36b]/85"
                      }`}
                      title={`Bit ${idx + 1}: ${isNetwork ? "Network" : "Host"}`}
                    />
                  );
                })}
              </div>

              <div className="mt-2 flex justify-between font-mono text-[9px] text-[#5d6d7e]">
                <span>Octet 1 (10)</span>
                <span>Octet 2 (0)</span>
                <span>Octet 3 (1)</span>
                <span>Octet 4 (Hosts)</span>
              </div>
            </div>

            {/* Live Calculated Readout Cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-[#1c2632] bg-[#0e141b] p-3">
                <p className="font-mono text-[10px] uppercase text-[#8e9eae]">
                  Subnet Mask
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-[#e8eef4]">
                  {cidrInfo.mask}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-[#58c8ef]">
                  /{cidrInfo.prefix} prefix
                </p>
              </div>

              <div className="rounded-lg border border-[#1c2632] bg-[#0e141b] p-3">
                <p className="font-mono text-[10px] uppercase text-[#8e9eae]">
                  Total IPs
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-[#e8eef4]">
                  {cidrInfo.totalIps}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-[#8e9eae]">
                  {cidrInfo.sampleRange}
                </p>
              </div>

              <div className="rounded-lg border border-[#b7f36b]/40 bg-[#0e141b] p-3">
                <p className="font-mono text-[10px] uppercase text-[#b7f36b]">
                  Usable Hosts
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-[#b7f36b]">
                  {cidrInfo.standardUsable} standard
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-[#8e9eae]">
                  {cidrInfo.cloudUsable > 0
                    ? `${cidrInfo.cloudUsable} in AWS/Azure (-5)`
                    : "Too small for AWS VPC"}
                </p>
              </div>

              <div className="rounded-lg border border-[#1c2632] bg-[#0e141b] p-3">
                <p className="font-mono text-[10px] uppercase text-[#8e9eae]">
                  Typical Use
                </p>
                <p className="mt-1 text-xs font-medium text-[#e8eef4] leading-snug">
                  {cidrInfo.typicalUse}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: VLSM VS FIXED ================= */}
        {tab === "vlsm" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] text-[#8e9eae]">
                Goal: Fit 4 teams needing{" "}
                <span className="text-[#e8eef4]">55 + 20 + 10 + 2 = 87 IPs</span>{" "}
                inside <span className="text-[#58c8ef]">10.0.1.0/24</span> (256 IPs).
              </p>

              <div className="inline-flex rounded-md border border-[#1c2632] bg-[#0e141b] p-0.5 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => setVlsmMode("fixed")}
                  className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                    vlsmMode === "fixed"
                      ? "bg-[#e5a93c] text-[#090d12] font-semibold"
                      : "text-[#8e9eae] hover:text-[#e8eef4]"
                  }`}
                >
                  Fixed Subnetting (4 × /26)
                </button>
                <button
                  type="button"
                  onClick={() => setVlsmMode("vlsm")}
                  className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                    vlsmMode === "vlsm"
                      ? "bg-[#b7f36b] text-[#090d12] font-semibold"
                      : "text-[#8e9eae] hover:text-[#e8eef4]"
                  }`}
                >
                  VLSM (Right-Sized!)
                </button>
              </div>
            </div>

            {/* Proportional IP Space Bar */}
            <div className="rounded-lg border border-[#1c2632] bg-[#0e141b] p-4 space-y-3">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#8e9eae]">
                  10.0.1.0/24 Address Map (Click any block to inspect)
                </span>
                <span
                  className={
                    vlsmMode === "vlsm" ? "text-[#b7f36b]" : "text-[#e5a93c]"
                  }
                >
                  {vlsmMode === "vlsm"
                    ? "140 IPs Saved for Future Growth!"
                    : "0 IPs Left — 169 IPs Wasted!"}
                </span>
              </div>

              <div className="flex h-14 w-full overflow-hidden rounded-md border border-[#1c2632]">
                {blocks.map((block) => {
                  const isSelected = activeBlock.id === block.id;
                  const isFree = block.id === "free";
                  return (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => setActiveBlockId(block.id)}
                      style={{
                        width: `${block.widthPct}%`,
                        backgroundColor: isFree
                          ? "#090d12"
                          : `${block.accent}22`,
                        borderRight: "1px solid #1c2632",
                      }}
                      className={`flex flex-col items-center justify-center px-1 text-center transition-all cursor-pointer ${
                        isSelected
                          ? "ring-1 ring-inset ring-[#e8eef4]"
                          : "hover:brightness-125"
                      }`}
                    >
                      <span
                        className="font-mono text-[10px] font-semibold truncate max-w-full"
                        style={{ color: isFree ? "#8e9eae" : block.accent }}
                      >
                        {block.name}
                      </span>
                      <span className="font-mono text-[9px] text-[#8e9eae] truncate max-w-full">
                        {block.cidr.replace("10.0.1.", ".")}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Block Details + Waste Summary */}
              <div className="grid gap-3 sm:grid-cols-3 pt-1">
                <div className="rounded-md border border-[#1c2632] bg-[#090d12] p-3">
                  <p className="font-mono text-[10px] text-[#8e9eae]">
                    Selected Slice
                  </p>
                  <p className="mt-1 font-mono text-xs font-semibold text-[#e8eef4]">
                    {activeBlock.name} ({activeBlock.cidr})
                  </p>
                  <p className="font-mono text-[10px] text-[#58c8ef]">
                    Range: {activeBlock.range}
                  </p>
                </div>

                <div className="rounded-md border border-[#1c2632] bg-[#090d12] p-3">
                  <p className="font-mono text-[10px] text-[#8e9eae]">
                    Slice Fit
                  </p>
                  <p className="mt-1 font-mono text-xs font-semibold text-[#e8eef4]">
                    {activeBlock.id === "free"
                      ? "140 Unallocated IPs"
                      : `${activeBlock.needed} needed / ${activeBlock.allocated} allocated`}
                  </p>
                  <p className="font-mono text-[10px] text-[#8e9eae]">
                    {activeBlock.id === "free"
                      ? "Ready for new services"
                      : `${activeBlock.allocated - activeBlock.needed} spare IPs in slice`}
                  </p>
                </div>

                <div className="rounded-md border border-[#1c2632] bg-[#090d12] p-3">
                  <p className="font-mono text-[10px] text-[#8e9eae]">
                    Total Unused in Allocated Slices
                  </p>
                  <p
                    className={`mt-1 font-mono text-xs font-semibold ${
                      vlsmMode === "vlsm" ? "text-[#b7f36b]" : "text-[#e5a93c]"
                    }`}
                  >
                    {wastedIps} spare IPs ({vlsmMode === "vlsm" ? "Efficient" : "Wasteful"})
                  </p>
                  <p className="font-mono text-[10px] text-[#8e9eae]">
                    {vlsmMode === "vlsm"
                      ? "55% of /24 still free!"
                      : "0% of /24 left for expansion"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PUBLIC VS PRIVATE SUBNET ================= */}
        {tab === "public-private" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-[11px] text-[#8e9eae]">
                Test what makes a subnet{" "}
                <span className="text-[#58c8ef]">Public</span> vs.{" "}
                <span className="text-[#b7f36b]">Private</span> (it&apos;s the Route Table!):
              </p>

              <div className="inline-flex flex-wrap rounded-md border border-[#1c2632] bg-[#0e141b] p-0.5 font-mono text-[11px]">
                {(
                  [
                    { id: "inbound-public", label: "User → Public Subnet" },
                    { id: "inbound-private", label: "Direct → Private (Blocked)" },
                    { id: "outbound-nat", label: "Private → NAT → Internet" },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setScenario(s.id);
                      setStep(0);
                    }}
                    className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                      scenario === s.id
                        ? "bg-[#e8eef4] text-[#090d12] font-semibold"
                        : "text-[#8e9eae] hover:text-[#e8eef4]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <svg
                viewBox="0 0 640 190"
                className="mx-auto h-48 w-full min-w-[520px] max-w-2xl"
                role="img"
                aria-label="Animated diagram comparing Public Subnet routing via Internet Gateway and Private Subnet outbound routing via NAT Gateway"
              >
                {/* Internet Node */}
                <rect
                  x="16"
                  y="68"
                  width="96"
                  height="68"
                  rx="10"
                  fill="#0e141b"
                  stroke="#58c8ef"
                  strokeWidth="1.5"
                />
                <text
                  x="64"
                  y="98"
                  textAnchor="middle"
                  fill="#e8eef4"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  Internet
                </text>
                <text
                  x="64"
                  y="114"
                  textAnchor="middle"
                  fill="#8e9eae"
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  0.0.0.0/0
                </text>

                {/* Internet Gateway */}
                <rect
                  x="155"
                  y="72"
                  width="100"
                  height="60"
                  rx="8"
                  fill="#0e141b"
                  stroke={
                    scenario === "inbound-private" && step >= 1
                      ? "#e5a93c"
                      : "#58c8ef"
                  }
                  strokeWidth="1.5"
                />
                <text
                  x="205"
                  y="98"
                  textAnchor="middle"
                  fill="#e8eef4"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  Internet GW
                </text>
                <text
                  x="205"
                  y="114"
                  textAnchor="middle"
                  fill={
                    scenario === "inbound-private" && step >= 1
                      ? "#e5a93c"
                      : "#58c8ef"
                  }
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  {scenario === "inbound-private" && step >= 1
                    ? "NO ROUTE ✕"
                    : "VPC Edge"}
                </text>

                {/* Public Subnet */}
                <rect
                  x="290"
                  y="24"
                  width="145"
                  height="148"
                  rx="10"
                  fill="#0e141b"
                  stroke="#58c8ef"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                />
                <text
                  x="304"
                  y="44"
                  fill="#58c8ef"
                  fontSize="9.5"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  Public Subnet
                </text>
                <text
                  x="304"
                  y="57"
                  fill="#8e9eae"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  10.0.1.0/24 · RT → IGW
                </text>
                <rect
                  x="305"
                  y="74"
                  width="115"
                  height="56"
                  rx="6"
                  fill="#090d12"
                  stroke="#2a3747"
                />
                <text
                  x="362"
                  y="98"
                  textAnchor="middle"
                  fill="#e8eef4"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {scenario === "outbound-nat" ? "NAT Gateway" : "Load Balancer"}
                </text>
                <text
                  x="362"
                  y="114"
                  textAnchor="middle"
                  fill="#58c8ef"
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  Has Public IP
                </text>

                {/* Private Subnet */}
                <rect
                  x="468"
                  y="24"
                  width="154"
                  height="148"
                  rx="10"
                  fill="#0e141b"
                  stroke="#b7f36b"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                />
                <text
                  x="482"
                  y="44"
                  fill="#b7f36b"
                  fontSize="9.5"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  Private Subnet
                </text>
                <text
                  x="482"
                  y="57"
                  fill="#8e9eae"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  10.0.2.0/24 · RT → NAT
                </text>
                <rect
                  x="483"
                  y="74"
                  width="124"
                  height="56"
                  rx="6"
                  fill="#090d12"
                  stroke="#2a3747"
                />
                <text
                  x="545"
                  y="98"
                  textAnchor="middle"
                  fill="#e8eef4"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  App / Database
                </text>
                <text
                  x="545"
                  y="114"
                  textAnchor="middle"
                  fill="#b7f36b"
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  Private IP Only
                </text>

                {/* Connecting Lines */}
                <line
                  x1="112"
                  y1="102"
                  x2="155"
                  y2="102"
                  stroke="#58c8ef"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <line
                  x1="255"
                  y1="102"
                  x2="305"
                  y2="102"
                  stroke={
                    scenario === "inbound-private" ? "#e5a93c" : "#58c8ef"
                  }
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <line
                  x1="420"
                  y1="102"
                  x2="483"
                  y2="102"
                  stroke={scenario === "outbound-nat" ? "#b7f36b" : "#1c2632"}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Animated Packet */}
                <g
                  style={{
                    transform: `translate(${routePacket.x}px, ${routePacket.y}px)`,
                    transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <circle
                    r="12"
                    fill={
                      scenario === "inbound-private" && step >= 1
                        ? "#e5a93c"
                        : "#b7f36b"
                    }
                    opacity="0.22"
                  />
                  <circle
                    r="5.5"
                    fill={
                      scenario === "inbound-private" && step >= 1
                        ? "#e5a93c"
                        : "#b7f36b"
                    }
                    stroke="#090d12"
                    strokeWidth="1.5"
                  />
                </g>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Narration & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-xs">
        <div className="flex items-start gap-2 text-[var(--text-secondary)] max-w-2xl">
          {tab === "public-private" && scenario === "inbound-private" && step >= 1 ? (
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-warn)]" />
          ) : tab === "vlsm" ? (
            <Layers className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-lime)]" />
          ) : tab === "public-private" ? (
            <Route className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-blue)]" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-blue)]" />
          )}
          <span className="leading-relaxed">
            {tab === "cidr"
              ? `10.0.1.0/${cidrInfo.prefix} locks ${cidrInfo.prefix} network bits and leaves ${hostBits} host bits → ${cidrInfo.totalIps} total IPs (${cidrInfo.standardUsable} usable).`
              : tab === "vlsm"
              ? vlsmMode === "vlsm"
                ? "VLSM cuts custom subnet sizes (/26, /27, /28, /30) to fit each workload—saving 140 IPs inside the same /24!"
                : "Fixed subnetting forces every team into a /26 (64 IPs)—even a 2-IP router link wastes 62 addresses."
              : scenarioNotes[scenario][step]}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {tab === "public-private" && (
            <>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause simulation" : "Play simulation"}
                className="inline-flex items-center gap-1 rounded border border-[var(--border-default)] bg-[var(--bg-base)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                {playing ? (
                  <Pause className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                {playing ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setStep((s) => (s + 1) % 3);
                }}
                aria-label="Next step"
                className="inline-flex items-center gap-1 rounded border border-[var(--border-default)] bg-[var(--bg-base)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                Step
                <ArrowRight className="h-3 w-3" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset simulation"
            className="inline-flex items-center gap-1 rounded border border-[var(--border-default)] bg-[var(--bg-base)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
