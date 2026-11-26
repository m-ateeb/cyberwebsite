"use client";

import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Box,
  CheckCircle2,
  Cloud,
  Globe,
  Layers,
  Lock,
  Pause,
  Play,
  RotateCcw,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";

type SimTab = "architecture" | "ecs-scaling" | "providers";
type ProviderId = "aws" | "gcp" | "azure" | "alibaba" | "oci";
type LaunchMode = "serverless" | "vm-backed";

interface CloudProviderInfo {
  id: ProviderId;
  name: string;
  accent: string;
  vpcName: string;
  vpcScope: string;
  containerService: string;
  vmService: string;
  firewallName: string;
  natName: string;
  standoutNote: string;
}

const CLOUD_PROVIDERS: CloudProviderInfo[] = [
  {
    id: "aws",
    name: "AWS",
    accent: "#e5a93c",
    vpcName: "Amazon VPC",
    vpcScope: "Regional (Subnets are Zonal)",
    containerService: "Amazon ECS (with Fargate or EC2)",
    vmService: "Amazon EC2",
    firewallName: "Security Groups + Network ACLs",
    natName: "NAT Gateway & Internet Gateway",
    standoutNote:
      'In AWS, "ECS" means Elastic Container Service—a managed Docker orchestrator deeply integrated with IAM, ALB, and VPC.',
  },
  {
    id: "gcp",
    name: "Google Cloud",
    accent: "#58c8ef",
    vpcName: "Google Cloud VPC",
    vpcScope: "Global (Subnets are Regional)",
    containerService: "Cloud Run / GKE Autopilot",
    vmService: "Compute Engine (GCE)",
    firewallName: "VPC Firewall Rules (Tag/SA-based)",
    natName: "Cloud NAT (Managed, no single VM)",
    standoutNote:
      "GCP's VPC is global by default—a single VPC can span continents without needing manual VPC peering between regions.",
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    accent: "#58c8ef",
    vpcName: "Azure Virtual Network (VNet)",
    vpcScope: "Regional (Subnets span all AZs)",
    containerService: "Azure Container Apps / ACI",
    vmService: "Azure Virtual Machines",
    firewallName: "Network Security Groups (NSGs)",
    natName: "Azure NAT Gateway",
    standoutNote:
      "Azure calls its private network a VNet, and its subnets automatically span all Availability Zones in a region.",
  },
  {
    id: "alibaba",
    name: "Alibaba Cloud",
    accent: "#b7f36b",
    vpcName: "Alibaba Cloud VPC",
    vpcScope: "Regional (VSwitches are Zonal)",
    containerService: "Elastic Container Instance (ECI) / ACK",
    vmService: "Elastic Compute Service (ECS)",
    firewallName: "Security Groups + Network ACLs",
    natName: "Internet & VPC NAT Gateway",
    standoutNote:
      'Watch the acronym! On Alibaba (and Huawei) Cloud, "ECS" refers to Virtual Machines (equivalent to AWS EC2), not containers.',
  },
  {
    id: "oci",
    name: "Oracle Cloud (OCI)",
    accent: "#e5a93c",
    vpcName: "Virtual Cloud Network (VCN)",
    vpcScope: "Regional (Subnets can be Regional)",
    containerService: "OCI Container Instances / OKE",
    vmService: "OCI Compute Instances",
    firewallName: "Security Lists + NSGs",
    natName: "Internet, NAT & Service Gateways",
    standoutNote:
      "OCI uses VCN and includes a dedicated Service Gateway so private subnets reach object storage without traversing the public Internet.",
  },
];

const ARCH_STEPS = [
  {
    title: "1. User Sends HTTPS Request",
    detail:
      "A user's browser sends an encrypted HTTPS (Port 443) request over the public Internet toward your cloud application's domain.",
  },
  {
    title: "2. Internet Gateway & Public Subnet",
    detail:
      "Your VPC's Internet Gateway admits the traffic into the Public Subnet (10.0.1.0/24), where a Load Balancer terminates TLS and inspects the request.",
  },
  {
    title: "3. Security Group Checks the Rules",
    detail:
      "Before reaching your private containers, the VPC Security Group acts like a bouncer—allowing only approved Port 443 traffic from the Load Balancer.",
  },
  {
    title: "4. ECS Tasks Run Inside Private Subnet",
    detail:
      "Your ECS containers run safely inside the Private Subnet (10.0.2.0/24) with no public IP, processing the request and querying the private database.",
  },
];

export function VpcEcsVisualizer() {
  const [tab, setTab] = useState<SimTab>("architecture");
  const [playing, setPlaying] = useState(true);
  const [step, setStep] = useState(0);

  // Tab 1: VPC + ECS Architecture
  const [sgAllowed, setSgAllowed] = useState(true);

  // Tab 2: ECS Scaling & HA
  const [launchMode, setLaunchMode] = useState<LaunchMode>("serverless");
  const [scaledUp, setScaledUp] = useState(false);
  const [azFailed, setAzFailed] = useState(false);

  // Tab 3: Cloud Provider Translator
  const [selectedProvider, setSelectedProvider] = useState<ProviderId>("aws");

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!playing || prefersReduced || tab !== "architecture") return;

    const id = setInterval(() => {
      setStep((prev) => {
        if (!sgAllowed && prev === 2) return 0;
        return (prev + 1) % 4;
      });
    }, 1850);

    return () => clearInterval(id);
  }, [playing, tab, sgAllowed]);

  const handleReset = () => {
    setStep(0);
    setSgAllowed(true);
    setScaledUp(false);
    setAzFailed(false);
    setLaunchMode("serverless");
    setPlaying(true);
  };

  const handleStep = () => {
    setPlaying(false);
    setStep((prev) => {
      if (!sgAllowed && prev === 2) return 0;
      return (prev + 1) % 4;
    });
  };

  const activeProvider =
    CLOUD_PROVIDERS.find((p) => p.id === selectedProvider) ?? CLOUD_PROVIDERS[0];

  // Packet dot coordinates for Tab 1 SVG
  const packetPos = (() => {
    if (step === 0) return { x: 64, y: 105 };
    if (step === 1) return { x: 205, y: 105 };
    if (step === 2) return { x: 350, y: 105 };
    return { x: 505, y: 105 };
  })();

  const totalTasks = scaledUp ? 6 : 2;
  const azATasks = azFailed ? 0 : Math.ceil(totalTasks / 2);
  const azBTasks = azFailed ? totalTasks : Math.floor(totalTasks / 2);

  return (
    <section
      aria-label="Interactive VPC and ECS Multi-Cloud Simulator"
      className="my-8 overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)]"
    >
      {/* Header + Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-default)] px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-blue)]">
            Interactive Learning Module · VPC &amp; ECS
          </p>
          <p className="font-display text-sm font-semibold text-[var(--text-primary)]">
            Explore Private Cloud Networks, Elastic Compute &amp; Provider Mapping
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
          {(
            [
              { id: "architecture", label: "1. VPC + ECS Flow" },
              { id: "ecs-scaling", label: "2. ECS Scaling & HA" },
              { id: "providers", label: "3. Cloud Providers" },
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
        {/* ================= TAB 1: VPC + ECS ARCHITECTURE ================= */}
        {tab === "architecture" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#8e9eae]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#58c8ef]" />
                <span>
                  VPC CIDR:{" "}
                  <span className="text-[#e8eef4]">10.0.0.0/16</span>{" "}
                  <span className="hidden sm:inline text-[#5d6d7e]">
                    (Private Isolated Cloud Network)
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSgAllowed((s) => !s);
                  setStep(0);
                }}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                  sgAllowed
                    ? "border-[#b7f36b]/50 bg-[#b7f36b]/10 text-[#b7f36b] hover:bg-[#b7f36b]/20"
                    : "border-[#e5a93c] bg-[#e5a93c]/15 text-[#e5a93c]"
                }`}
              >
                {sgAllowed ? (
                  <ShieldCheck className="h-3.5 w-3.5" />
                ) : (
                  <ShieldAlert className="h-3.5 w-3.5" />
                )}
                {sgAllowed
                  ? "Security Group: Allow :443"
                  : "Security Group: Block All"}
              </button>
            </div>

            {/* SVG VPC Boundary + Subnets + Animated Traffic */}
            <div className="overflow-x-auto">
              <svg
                viewBox="0 0 640 215"
                className="mx-auto h-52 w-full min-w-[520px] max-w-2xl"
                role="img"
                aria-label="Animated diagram of a VPC containing a Public Subnet with a Load Balancer and a Private Subnet running ECS containers protected by a Security Group"
              >
                {/* Outer VPC Container Box */}
                <rect
                  x="130"
                  y="14"
                  width="495"
                  height="188"
                  rx="12"
                  fill="#0e141b"
                  fillOpacity="0.65"
                  stroke="#58c8ef"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />
                <text
                  x="146"
                  y="34"
                  fill="#58c8ef"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  VPC (10.0.0.0/16) — Your Private Cloud Network
                </text>

                {/* Public Subnet Box */}
                <rect
                  x="150"
                  y="48"
                  width="145"
                  height="136"
                  rx="8"
                  fill="#090d12"
                  stroke={step === 1 ? "#58c8ef" : "#1c2632"}
                  strokeWidth={step === 1 ? "2" : "1.2"}
                />
                <text
                  x="162"
                  y="66"
                  fill="#58c8ef"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  Public Subnet
                </text>
                <text
                  x="162"
                  y="79"
                  fill="#5d6d7e"
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  10.0.1.0/24
                </text>

                {/* Load Balancer inside Public Subnet */}
                <rect
                  x="164"
                  y="92"
                  width="116"
                  height="46"
                  rx="6"
                  fill="#0e141b"
                  stroke={step === 1 ? "#58c8ef" : "#2a3747"}
                  strokeWidth="1.2"
                />
                <text
                  x="222"
                  y="112"
                  textAnchor="middle"
                  fill="#e8eef4"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  Load Balancer
                </text>
                <text
                  x="222"
                  y="126"
                  textAnchor="middle"
                  fill="#8e9eae"
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  via Internet GW
                </text>

                {/* Private Subnet Box */}
                <rect
                  x="395"
                  y="48"
                  width="212"
                  height="136"
                  rx="8"
                  fill="#090d12"
                  stroke={step === 3 && sgAllowed ? "#b7f36b" : "#1c2632"}
                  strokeWidth={step === 3 && sgAllowed ? "2" : "1.2"}
                />
                <text
                  x="408"
                  y="66"
                  fill="#b7f36b"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  Private Subnet (No Public IP)
                </text>
                <text
                  x="408"
                  y="79"
                  fill="#5d6d7e"
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  10.0.2.0/24
                </text>

                {/* ECS Cluster inside Private Subnet */}
                <rect
                  x="410"
                  y="90"
                  width="118"
                  height="78"
                  rx="6"
                  fill="#0e141b"
                  stroke={step === 3 && sgAllowed ? "#b7f36b" : "#2a3747"}
                  strokeWidth="1.2"
                />
                <text
                  x="469"
                  y="107"
                  textAnchor="middle"
                  fill="#e8eef4"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  ECS Service
                </text>
                <rect
                  x="420"
                  y="116"
                  width="44"
                  height="20"
                  rx="3"
                  fill="#141d27"
                  stroke="#b7f36b"
                  strokeOpacity="0.6"
                />
                <text
                  x="442"
                  y="129"
                  textAnchor="middle"
                  fill="#b7f36b"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  Task 1
                </text>
                <rect
                  x="472"
                  y="116"
                  width="44"
                  height="20"
                  rx="3"
                  fill="#141d27"
                  stroke="#b7f36b"
                  strokeOpacity="0.6"
                />
                <text
                  x="494"
                  y="129"
                  textAnchor="middle"
                  fill="#b7f36b"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  Task 2
                </text>
                <text
                  x="469"
                  y="156"
                  textAnchor="middle"
                  fill="#8e9eae"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  Containers / VMs
                </text>

                {/* Private DB */}
                <rect
                  x="538"
                  y="102"
                  width="56"
                  height="52"
                  rx="6"
                  fill="#0e141b"
                  stroke="#1c2632"
                  strokeWidth="1.2"
                />
                <text
                  x="566"
                  y="125"
                  textAnchor="middle"
                  fill="#e8eef4"
                  fontSize="9.5"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  DB
                </text>
                <text
                  x="566"
                  y="140"
                  textAnchor="middle"
                  fill="#8e9eae"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  Private
                </text>

                {/* User Node outside VPC */}
                <rect
                  x="16"
                  y="78"
                  width="86"
                  height="56"
                  rx="8"
                  fill="#0e141b"
                  stroke={step === 0 ? "#b7f36b" : "#1c2632"}
                  strokeWidth={step === 0 ? "2" : "1.5"}
                />
                <text
                  x="59"
                  y="103"
                  textAnchor="middle"
                  fill="#e8eef4"
                  fontSize="10.5"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  User
                </text>
                <text
                  x="59"
                  y="118"
                  textAnchor="middle"
                  fill="#8e9eae"
                  fontSize="8.5"
                  fontFamily="monospace"
                >
                  Internet
                </text>

                {/* Security Group Gate between Public and Private */}
                <rect
                  x="312"
                  y="78"
                  width="66"
                  height="56"
                  rx="8"
                  fill="#0e141b"
                  stroke={
                    !sgAllowed
                      ? "#e5a93c"
                      : step === 2
                      ? "#b7f36b"
                      : "#2a3747"
                  }
                  strokeWidth={step === 2 || !sgAllowed ? "2" : "1.2"}
                />
                <text
                  x="345"
                  y="101"
                  textAnchor="middle"
                  fill={sgAllowed ? "#b7f36b" : "#e5a93c"}
                  fontSize="9.5"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  Firewall
                </text>
                <text
                  x="345"
                  y="116"
                  textAnchor="middle"
                  fill="#8e9eae"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {sgAllowed ? "Allow :443" : "BLOCKED"}
                </text>

                {/* Connecting Lines */}
                <line
                  x1="102"
                  y1="105"
                  x2="164"
                  y2="105"
                  stroke={step >= 1 ? "#58c8ef" : "#1c2632"}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <line
                  x1="280"
                  y1="105"
                  x2="312"
                  y2="105"
                  stroke={step >= 2 ? "#58c8ef" : "#1c2632"}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <line
                  x1="378"
                  y1="105"
                  x2="410"
                  y2="105"
                  stroke={
                    !sgAllowed
                      ? "#e5a93c"
                      : step >= 3
                      ? "#b7f36b"
                      : "#1c2632"
                  }
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Animated Packet Dot */}
                <g
                  style={{
                    transform: `translate(${packetPos.x}px, ${packetPos.y}px)`,
                    transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <circle
                    r="12"
                    fill={!sgAllowed && step === 2 ? "#e5a93c" : "#b7f36b"}
                    opacity="0.2"
                  />
                  <circle
                    r="5.5"
                    fill={!sgAllowed && step === 2 ? "#e5a93c" : "#b7f36b"}
                    stroke="#090d12"
                    strokeWidth="1.5"
                  />
                </g>
              </svg>
            </div>

            {/* Step pills */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ARCH_STEPS.map((item, idx) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => {
                    setPlaying(false);
                    setStep(idx);
                  }}
                  className={`rounded-md border px-2.5 py-2 text-left font-mono text-[10px] transition-colors cursor-pointer ${
                    step === idx
                      ? "border-[#b7f36b]/60 bg-[#b7f36b]/10 text-[#e8eef4]"
                      : "border-[#1c2632] bg-[#0e141b] text-[#8e9eae] hover:border-[#2a3747]"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 2: ECS SCALING & HA ================= */}
        {tab === "ecs-scaling" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex rounded-md border border-[#1c2632] bg-[#0e141b] p-0.5 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => setLaunchMode("serverless")}
                  className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                    launchMode === "serverless"
                      ? "bg-[#58c8ef] text-[#090d12] font-semibold"
                      : "text-[#8e9eae] hover:text-[#e8eef4]"
                  }`}
                >
                  Serverless (Fargate / Cloud Run)
                </button>
                <button
                  type="button"
                  onClick={() => setLaunchMode("vm-backed")}
                  className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                    launchMode === "vm-backed"
                      ? "bg-[#e8eef4] text-[#090d12] font-semibold"
                      : "text-[#8e9eae] hover:text-[#e8eef4]"
                  }`}
                >
                  VM-Backed (EC2 / VMs)
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScaledUp((s) => !s)}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                    scaledUp
                      ? "border-[#b7f36b] bg-[#b7f36b] text-[#090d12]"
                      : "border-[#b7f36b]/50 bg-[#b7f36b]/10 text-[#b7f36b]"
                  }`}
                >
                  <Zap className="h-3.5 w-3.5" />
                  {scaledUp ? "Scale Down (6 → 2)" : "Scale Out (2 → 6 Tasks)"}
                </button>

                <button
                  type="button"
                  onClick={() => setAzFailed((f) => !f)}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                    azFailed
                      ? "border-[#e5a93c] bg-[#e5a93c]/15 text-[#e5a93c]"
                      : "border-[#1c2632] bg-[#0e141b] text-[#8e9eae] hover:border-[#e5a93c]/60 hover:text-[#e5a93c]"
                  }`}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {azFailed ? "Restore Zone A" : "Simulate Zone A Outage"}
                </button>
              </div>
            </div>

            {/* Two Availability Zones inside the VPC */}
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  zone: "Availability Zone A",
                  subnet: "Private Subnet A · 10.0.2.0/24",
                  count: azATasks,
                  failed: azFailed,
                },
                {
                  zone: "Availability Zone B",
                  subnet: "Private Subnet B · 10.0.3.0/24",
                  count: azBTasks,
                  failed: false,
                },
              ].map((az) => (
                <div
                  key={az.zone}
                  className={`rounded-xl border p-4 transition-all duration-300 ${
                    az.failed
                      ? "border-[#e5a93c]/60 bg-[#e5a93c]/5 opacity-75"
                      : "border-[#1c2632] bg-[#0e141b]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs font-semibold text-[#e8eef4]">
                        {az.zone}
                      </p>
                      <p className="font-mono text-[10px] text-[#8e9eae]">
                        {az.subnet}
                      </p>
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                        az.failed
                          ? "bg-[#e5a93c]/20 text-[#e5a93c]"
                          : "bg-[#b7f36b]/15 text-[#b7f36b]"
                      }`}
                    >
                      {az.failed ? "OFFLINE" : `${az.count} Active`}
                    </span>
                  </div>

                  {/* Underlying host indicator */}
                  <div className="mt-3 rounded-md border border-[#1c2632] bg-[#090d12] px-3 py-2 font-mono text-[10px] text-[#8e9eae] flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5">
                      {launchMode === "serverless" ? (
                        <Cloud className="h-3.5 w-3.5 text-[#58c8ef]" />
                      ) : (
                        <Server className="h-3.5 w-3.5 text-[#e5a93c]" />
                      )}
                      {launchMode === "serverless"
                        ? "Serverless Compute (No OS Patching)"
                        : "Managed EC2 / VM Host (You Patch OS)"}
                    </span>
                  </div>

                  {/* Container Task Grid */}
                  <div className="mt-3 grid grid-cols-3 gap-2 min-h-[76px]">
                    {az.failed ? (
                      <div className="col-span-3 flex items-center justify-center rounded-md border border-dashed border-[#e5a93c]/50 text-center font-mono text-[10px] text-[#e5a93c] p-3">
                        Zone A unreachable — ECS automatically rescheduled all{" "}
                        {totalTasks} tasks into Zone B!
                      </div>
                    ) : (
                      Array.from({ length: az.count }).map((_, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center justify-center rounded-md border border-[#b7f36b]/50 bg-[#b7f36b]/10 py-2 font-mono text-[10px] text-[#b7f36b] transition-all"
                        >
                          <Box className="h-3.5 w-3.5 mb-1" />
                          <span>Task #{i + 1}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: CLOUD PROVIDER TRANSLATOR ================= */}
        {tab === "providers" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-[11px] text-[#8e9eae]">
                Select a cloud provider to see what they call{" "}
                <span className="text-[#58c8ef]">VPC</span>,{" "}
                <span className="text-[#b7f36b]">Containers</span>, and{" "}
                <span className="text-[#e5a93c]">Virtual Machines</span>:
              </p>

              <div className="flex flex-wrap rounded-md border border-[#1c2632] bg-[#0e141b] p-0.5 font-mono text-[11px]">
                {CLOUD_PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProvider(p.id)}
                    className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                      selectedProvider === p.id
                        ? "bg-[#e8eef4] text-[#090d12] font-semibold"
                        : "text-[#8e9eae] hover:text-[#e8eef4]"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-[#58c8ef]/40 bg-[#0e141b] p-3.5">
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#58c8ef]">
                  <Globe className="h-3.5 w-3.5" />
                  <span>Private Network</span>
                </div>
                <p className="mt-2 font-display text-sm font-semibold text-[#e8eef4]">
                  {activeProvider.vpcName}
                </p>
                <p className="mt-1 font-mono text-[10px] text-[#8e9eae]">
                  {activeProvider.vpcScope}
                </p>
              </div>

              <div className="rounded-lg border border-[#b7f36b]/40 bg-[#0e141b] p-3.5">
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#b7f36b]">
                  <Box className="h-3.5 w-3.5" />
                  <span>Managed Containers</span>
                </div>
                <p className="mt-2 font-display text-sm font-semibold text-[#e8eef4]">
                  {activeProvider.containerService}
                </p>
                <p className="mt-1 font-mono text-[10px] text-[#8e9eae]">
                  Runs Docker workloads
                </p>
              </div>

              <div className="rounded-lg border border-[#e5a93c]/40 bg-[#0e141b] p-3.5">
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#e5a93c]">
                  <Server className="h-3.5 w-3.5" />
                  <span>Virtual Machines</span>
                </div>
                <p className="mt-2 font-display text-sm font-semibold text-[#e8eef4]">
                  {activeProvider.vmService}
                </p>
                <p className="mt-1 font-mono text-[10px] text-[#8e9eae]">
                  Elastic cloud servers
                </p>
              </div>

              <div className="rounded-lg border border-[#1c2632] bg-[#0e141b] p-3.5">
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#8e9eae]">
                  <Shield className="h-3.5 w-3.5 text-[#58c8ef]" />
                  <span>Firewall &amp; NAT</span>
                </div>
                <p className="mt-2 font-display text-sm font-semibold text-[#e8eef4]">
                  {activeProvider.firewallName}
                </p>
                <p className="mt-1 font-mono text-[10px] text-[#8e9eae]">
                  {activeProvider.natName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-[#1c2632] bg-[#0e141b] px-4 py-3 text-xs text-[#e8eef4]">
              <Layers className="mt-0.5 h-4 w-4 shrink-0 text-[#b7f36b]" />
              <p className="leading-relaxed">{activeProvider.standoutNote}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Narration & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-xs">
        <div className="flex items-start gap-2 text-[var(--text-secondary)] max-w-2xl">
          {!sgAllowed && tab === "architecture" && step === 2 ? (
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-warn)]" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-blue)]" />
          )}
          <span className="leading-relaxed">
            {tab === "architecture"
              ? !sgAllowed && step === 2
                ? "Blocked! The VPC Security Group dropped the request before it ever touched your ECS containers."
                : ARCH_STEPS[step].detail
              : tab === "ecs-scaling"
              ? azFailed
                ? `Self-healing active: Zone A failed, so ECS automatically kept all ${totalTasks} tasks running in Zone B.`
                : `Running ${totalTasks} tasks across 2 Availability Zones in ${
                    launchMode === "serverless" ? "Serverless" : "VM-Backed"
                  } mode.`
              : `Inspecting ${activeProvider.name}: ${activeProvider.vpcName} + ${activeProvider.containerService}.`}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {tab === "architecture" && (
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
                onClick={handleStep}
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
