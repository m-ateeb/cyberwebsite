"use client";

import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Globe,
  Home,
  Laptop,
  Mail,
  Network,
  Package,
  Pause,
  Play,
  Printer,
  RotateCcw,
  Router,
  Server,
  ShieldCheck,
  Smartphone,
  Terminal,
  Wifi,
} from "lucide-react";

type SimTab = "journey" | "packets" | "addressing" | "lan-wan";

interface WebsitePreset {
  domain: string;
  ip: string;
  service: string;
  port: number;
  protocol: string;
}

const WEBSITE_PRESETS: WebsitePreset[] = [
  {
    domain: "youtube.com",
    ip: "142.250.190.78",
    service: "Video Streaming Web Server",
    port: 443,
    protocol: "HTTPS (Encrypted Web)",
  },
  {
    domain: "wikipedia.org",
    ip: "208.80.154.224",
    service: "Encyclopedia Web Server",
    port: 443,
    protocol: "HTTPS (Encrypted Web)",
  },
  {
    domain: "mail.example.com",
    ip: "93.184.216.34",
    service: "Email Server",
    port: 25,
    protocol: "SMTP (Mail Delivery)",
  },
];

const SERVER_PORTS = [
  {
    port: 443,
    name: "HTTPS",
    role: "Secure Websites",
    icon: ShieldCheck,
    accent: "#b7f36b",
  },
  {
    port: 25,
    name: "SMTP",
    role: "Email Delivery",
    icon: Mail,
    accent: "#58c8ef",
  },
  {
    port: 22,
    name: "SSH",
    role: "Remote Admin",
    icon: Terminal,
    accent: "#e5a93c",
  },
];

const JOURNEY_STEPS = [
  {
    title: "1. Your Laptop Creates a Packet",
    detail:
      'Your laptop wraps your message ("Load webpage") in a digital envelope stamped with your return address (192.168.1.12) and the destination address (93.184.216.34).',
  },
  {
    title: "2. Home Wi-Fi Router Forwards It",
    detail:
      "Your router checks the destination. Since it is outside your house, it forwards the packet out to your Internet Service Provider (ISP).",
  },
  {
    title: "3. Internet Routers Pick the Fastest Path",
    detail:
      "Core internet routers act like postal sorting centers—reading the destination IP and hopping the packet across fiber links (or rerouting if a link is down).",
  },
  {
    title: "4. Destination Server Receives & Replies",
    detail:
      "The server opens the packet, prepares the webpage data, and sends reply packets right back to your router and onto your screen—all in ~35 milliseconds!",
  },
];

const PACKET_STAGES = [
  "1. Splitting: A 4 MB photo is chopped into 4 numbered packets (#1/4 to #4/4) so it can travel smoothly without clogging the wire.",
  "2. In Transit: Packets race across multiple network paths at the same time—some take Route A, others take Route B.",
  "3. Checking & Recovery: The receiver checks the sequence numbers. If any packet is lost on the way, TCP asks the sender to resend just that piece.",
  "4. Reassembled: All 4 packets are stitched back together in exact order (1 → 2 → 3 → 4) so the original photo appears intact.",
];

export function NetworkingVisualizer() {
  const [tab, setTab] = useState<SimTab>("journey");

  // Shared animation play state
  const [playing, setPlaying] = useState(true);
  const [step, setStep] = useState(0);

  // Tab 1: Journey state
  const [brokenLink, setBrokenLink] = useState(false);

  // Tab 2: Packet splitting state
  const [dropPacketTwo, setDropPacketTwo] = useState(false);

  // Tab 3: DNS & Ports state
  const [selectedSiteIdx, setSelectedSiteIdx] = useState(0);
  const [dnsStage, setDnsStage] = useState<0 | 1 | 2 | 3>(0);

  // Tab 4: LAN vs WAN state
  const [trafficScope, setTrafficScope] = useState<"local" | "internet">("local");

  const selectedSite = WEBSITE_PRESETS[selectedSiteIdx];

  // Auto-advance timer for animated tabs
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!playing || prefersReduced) return;

    const intervalMs = tab === "addressing" ? 1700 : 1850;
    const id = setInterval(() => {
      if (tab === "addressing") {
        setDnsStage((prev) => ((prev + 1) % 4) as 0 | 1 | 2 | 3);
      } else {
        setStep((prev) => (prev + 1) % 4);
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [playing, tab]);

  const handleTabChange = (nextTab: SimTab) => {
    setTab(nextTab);
    setStep(0);
    setDnsStage(0);
  };

  const handleReset = () => {
    setStep(0);
    setDnsStage(0);
    setBrokenLink(false);
    setDropPacketTwo(false);
    setPlaying(true);
  };

  const handleManualStep = () => {
    setPlaying(false);
    if (tab === "addressing") {
      setDnsStage((prev) => ((prev + 1) % 4) as 0 | 1 | 2 | 3);
    } else {
      setStep((prev) => (prev + 1) % 4);
    }
  };

  // Packet dot coordinates for Tab 1 (Journey)
  const journeyDot = (() => {
    if (step === 0) return { x: 80, y: 100 };
    if (step === 1) return { x: 230, y: 100 };
    if (step === 2) return brokenLink ? { x: 390, y: 156 } : { x: 390, y: 44 };
    return { x: 540, y: 100 };
  })();

  const dnsStageDescriptions = [
    `1. You type "${selectedSite.domain}" in your browser. Computers don't know names—they need numeric IP addresses.`,
    `2. Your device asks a DNS Server (the Internet's phonebook): "What is the IP address for ${selectedSite.domain}?"`,
    `3. DNS replies: "${selectedSite.domain} lives at ${selectedSite.ip}". Now your device knows which building to send packets to.`,
    `4. Your packet arrives at ${selectedSite.ip} and knocks on Port :${selectedSite.port} (${selectedSite.protocol})—the exact apartment door for that service.`,
  ];

  const lanWanDescriptions =
    trafficScope === "local"
      ? [
          "Local LAN: Your Laptop (192.168.1.12) wants to print a document on the Home Printer (192.168.1.25).",
          "Your Wi-Fi Router sees both devices share the same 192.168.1.x local network.",
          "The router hands the print job straight to the printer inside your house—fast, private, and never leaves to the Internet.",
          "Done! Local Area Network (LAN) traffic works even if your Internet cable is unplugged.",
        ]
      : [
          "Global WAN: Your Phone (192.168.1.18) requests a webpage from a server across the world (93.184.216.34).",
          "Your Wi-Fi Router sees the address is NOT in your house, so it sends the packet out through your ISP gateway.",
          "The packet hops across the Wide Area Network (WAN)—interconnected ISP networks that form the Internet.",
          "The remote server responds through the WAN back to your router, which delivers it to your phone!",
        ];

  return (
    <section
      aria-label="Interactive Networking Fundamentals Simulator"
      className="my-8 overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)]"
    >
      {/* Header + Simulation Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-default)] px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-blue)]">
            Interactive Learning Module · Networking Fundamentals
          </p>
          <p className="font-display text-sm font-semibold text-[var(--text-primary)]">
            See How Devices Actually Talk Across a Network
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
          {(
            [
              { id: "journey", label: "1. Packet Journey" },
              { id: "packets", label: "2. Packet Splitting" },
              { id: "addressing", label: "3. DNS & Ports" },
              { id: "lan-wan", label: "4. LAN vs. WAN" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabChange(item.id)}
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

      {/* Main Interactive Stage */}
      <div className="bg-stratum-grid bg-[#090d12] p-4 sm:p-6">
        {/* ================= TAB 1: PACKET JOURNEY ================= */}
        {tab === "journey" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#8e9eae]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#b7f36b]" />
                <span>
                  Packet Envelope:{" "}
                  <span className="text-[#e8eef4]">
                    [From: 192.168.1.12 → To: 93.184.216.34]
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setBrokenLink((b) => !b)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                  brokenLink
                    ? "border-[#e5a93c] bg-[#e5a93c]/15 text-[#e5a93c]"
                    : "border-[#1c2632] bg-[#0e141b] text-[#8e9eae] hover:border-[#e5a93c]/60 hover:text-[#e5a93c]"
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {brokenLink ? "Primary Cable Cut (Rerouting)" : "Cut Primary Cable"}
              </button>
            </div>

            {/* SVG Network Topology & Animated Packet */}
            <div className="overflow-x-auto">
              <svg
                viewBox="0 0 620 200"
                className="mx-auto h-48 w-full min-w-[500px] max-w-2xl"
                role="img"
                aria-label="Animated diagram showing a packet traveling from a laptop through a Wi-Fi router and ISP routers to a web server"
              >
                {/* Link: Laptop -> Home Router */}
                <line
                  x1="96"
                  y1="100"
                  x2="214"
                  y2="100"
                  stroke={step >= 1 ? "#58c8ef" : "#1c2632"}
                  strokeWidth="2.5"
                  strokeDasharray="5 5"
                />

                {/* Primary Path: Home Router -> ISP North -> Server */}
                <path
                  d="M 246 92 Q 318 44 374 44 L 406 44 Q 465 44 524 92"
                  fill="none"
                  stroke={
                    brokenLink
                      ? "#e5a93c"
                      : step >= 2
                      ? "#58c8ef"
                      : "#1c2632"
                  }
                  strokeWidth="2.5"
                  strokeDasharray={brokenLink ? "3 6" : "5 5"}
                  opacity={brokenLink ? 0.45 : 1}
                />

                {/* Backup Path: Home Router -> ISP South -> Server */}
                <path
                  d="M 246 108 Q 318 156 374 156 L 406 156 Q 465 156 524 108"
                  fill="none"
                  stroke={
                    brokenLink && step >= 2
                      ? "#b7f36b"
                      : "#1c2632"
                  }
                  strokeWidth={brokenLink ? "2.5" : "2"}
                  strokeDasharray="5 5"
                />

                {/* Red X on broken primary link */}
                {brokenLink && (
                  <g transform="translate(310, 56)">
                    <circle r="11" fill="#090d12" stroke="#e5a93c" strokeWidth="1.5" />
                    <text
                      textAnchor="middle"
                      y="4"
                      fill="#e5a93c"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      ✕
                    </text>
                  </g>
                )}

                {/* Node 1: Your Laptop */}
                <g transform="translate(80, 100)">
                  <rect
                    x="-48"
                    y="-32"
                    width="96"
                    height="64"
                    rx="10"
                    fill="#0e141b"
                    stroke={step === 0 ? "#b7f36b" : "#1c2632"}
                    strokeWidth={step === 0 ? "2" : "1.5"}
                  />
                  <text
                    textAnchor="middle"
                    y="-4"
                    fill="#e8eef4"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    Your Laptop
                  </text>
                  <text
                    textAnchor="middle"
                    y="14"
                    fill="#8e9eae"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    192.168.1.12
                  </text>
                </g>

                {/* Node 2: Home Router */}
                <g transform="translate(230, 100)">
                  <rect
                    x="-46"
                    y="-32"
                    width="92"
                    height="64"
                    rx="10"
                    fill="#0e141b"
                    stroke={step === 1 ? "#58c8ef" : "#1c2632"}
                    strokeWidth={step === 1 ? "2" : "1.5"}
                  />
                  <text
                    textAnchor="middle"
                    y="-4"
                    fill="#e8eef4"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    Wi-Fi Router
                  </text>
                  <text
                    textAnchor="middle"
                    y="14"
                    fill="#8e9eae"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    192.168.1.1
                  </text>
                </g>

                {/* Node 3A: ISP Router North */}
                <g transform="translate(390, 44)">
                  <rect
                    x="-46"
                    y="-22"
                    width="92"
                    height="44"
                    rx="8"
                    fill="#0e141b"
                    stroke={
                      brokenLink
                        ? "#e5a93c"
                        : step === 2
                        ? "#58c8ef"
                        : "#1c2632"
                    }
                    strokeWidth={!brokenLink && step === 2 ? "2" : "1.5"}
                    opacity={brokenLink ? 0.5 : 1}
                  />
                  <text
                    textAnchor="middle"
                    y="-1"
                    fill="#e8eef4"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    ISP Hub A
                  </text>
                  <text
                    textAnchor="middle"
                    y="13"
                    fill={brokenLink ? "#e5a93c" : "#8e9eae"}
                    fontSize="8.5"
                    fontFamily="monospace"
                  >
                    {brokenLink ? "Link Offline" : "Primary Path"}
                  </text>
                </g>

                {/* Node 3B: ISP Router South */}
                <g transform="translate(390, 156)">
                  <rect
                    x="-46"
                    y="-22"
                    width="92"
                    height="44"
                    rx="8"
                    fill="#0e141b"
                    stroke={
                      brokenLink && step === 2 ? "#b7f36b" : "#1c2632"
                    }
                    strokeWidth={brokenLink && step === 2 ? "2" : "1.5"}
                  />
                  <text
                    textAnchor="middle"
                    y="-1"
                    fill="#e8eef4"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    ISP Hub B
                  </text>
                  <text
                    textAnchor="middle"
                    y="13"
                    fill={brokenLink ? "#b7f36b" : "#8e9eae"}
                    fontSize="8.5"
                    fontFamily="monospace"
                  >
                    {brokenLink ? "Auto-Reroute!" : "Backup Path"}
                  </text>
                </g>

                {/* Node 4: Web Server */}
                <g transform="translate(540, 100)">
                  <rect
                    x="-48"
                    y="-32"
                    width="96"
                    height="64"
                    rx="10"
                    fill="#0e141b"
                    stroke={step === 3 ? "#b7f36b" : "#1c2632"}
                    strokeWidth={step === 3 ? "2" : "1.5"}
                  />
                  <text
                    textAnchor="middle"
                    y="-4"
                    fill="#e8eef4"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    Web Server
                  </text>
                  <text
                    textAnchor="middle"
                    y="14"
                    fill="#8e9eae"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    93.184.216.34
                  </text>
                </g>

                {/* Moving Glowing Packet */}
                <g
                  style={{
                    transform: `translate(${journeyDot.x}px, ${journeyDot.y}px)`,
                    transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <circle r="13" fill="#b7f36b" opacity="0.18" />
                  <circle r="6" fill="#b7f36b" stroke="#090d12" strokeWidth="1.5" />
                </g>
              </svg>
            </div>

            {/* Step Indicator Pills */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {JOURNEY_STEPS.map((s, idx) => (
                <button
                  key={s.title}
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
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 2: PACKET SPLITTING ================= */}
        {tab === "packets" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-[11px] text-[#8e9eae]">
                Watch a single <span className="text-[#e8eef4]">4 MB Photo</span>{" "}
                split into numbered packets, travel independently, and reassemble.
              </p>

              <button
                type="button"
                onClick={() => setDropPacketTwo((d) => !d)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                  dropPacketTwo
                    ? "border-[#e5a93c] bg-[#e5a93c]/15 text-[#e5a93c]"
                    : "border-[#1c2632] bg-[#0e141b] text-[#8e9eae] hover:border-[#e5a93c]/60 hover:text-[#e5a93c]"
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {dropPacketTwo ? "Packet #2 Dropped (TCP Resends)" : "Simulate Packet Loss"}
              </button>
            </div>

            <div className="grid items-center gap-4 md:grid-cols-11">
              {/* Sender Box */}
              <div className="md:col-span-3 rounded-lg border border-[#1c2632] bg-[#0e141b] p-3.5 text-center">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-md border border-[#58c8ef]/40 bg-[#58c8ef]/10 text-[#58c8ef]">
                  <Laptop className="h-4 w-4" />
                </div>
                <p className="mt-2 font-mono text-xs font-semibold text-[#e8eef4]">
                  Sender
                </p>
                <p className="font-mono text-[10px] text-[#8e9eae]">
                  Splits file into 4 packets
                </p>
                <div className="mt-3 grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className={`rounded border py-1 font-mono text-[10px] transition-all ${
                        step === 0
                          ? "border-[#b7f36b] bg-[#b7f36b]/15 text-[#b7f36b]"
                          : "border-[#1c2632] bg-[#090d12] text-[#5d6d7e]"
                      }`}
                    >
                      #{n}
                    </div>
                  ))}
                </div>
              </div>

              {/* Middle Network Lanes */}
              <div className="md:col-span-5 space-y-2.5">
                {[
                  { id: 1, route: "Route A (Fiber)", color: "#58c8ef" },
                  { id: 2, route: "Route B (Wireless)", color: "#b7f36b" },
                  { id: 3, route: "Route A (Fiber)", color: "#58c8ef" },
                  { id: 4, route: "Route B (Wireless)", color: "#b7f36b" },
                ].map((pkt) => {
                  const isLostNow = dropPacketTwo && pkt.id === 2 && step === 1;
                  const isRetrying = dropPacketTwo && pkt.id === 2 && step === 2;
                  const progressPct =
                    step === 0
                      ? 4
                      : step === 1
                      ? isLostNow
                        ? 48
                        : pkt.id % 2 === 0
                        ? 58
                        : 72
                      : step === 2
                      ? isRetrying
                        ? 62
                        : 92
                      : 92;

                  return (
                    <div
                      key={pkt.id}
                      className="rounded-md border border-[#1c2632] bg-[#0e141b] px-3 py-2"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-[#8e9eae]">{pkt.route}</span>
                        <span
                          className={
                            isLostNow
                              ? "text-[#e5a93c]"
                              : isRetrying
                              ? "text-[#b7f36b]"
                              : "text-[#5d6d7e]"
                          }
                        >
                          {isLostNow
                            ? "Dropped! Missing #2"
                            : isRetrying
                            ? "TCP Resending #2..."
                            : step === 3
                            ? "Delivered ✓"
                            : `Packet #${pkt.id}/4`}
                        </span>
                      </div>
                      <div className="relative mt-1.5 h-2 rounded-full bg-[#090d12] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${progressPct}%`,
                            backgroundColor: isLostNow
                              ? "#e5a93c"
                              : isRetrying
                              ? "#b7f36b"
                              : pkt.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Receiver Box */}
              <div className="md:col-span-3 rounded-lg border border-[#1c2632] bg-[#0e141b] p-3.5 text-center">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-md border border-[#b7f36b]/40 bg-[#b7f36b]/10 text-[#b7f36b]">
                  <Server className="h-4 w-4" />
                </div>
                <p className="mt-2 font-mono text-xs font-semibold text-[#e8eef4]">
                  Receiver
                </p>
                <p className="font-mono text-[10px] text-[#8e9eae]">
                  {step === 3 ? "Photo Complete!" : "Reassembling..."}
                </p>
                <div className="mt-3 grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((n) => {
                    const arrived =
                      step === 3 ||
                      (step === 2 && !(dropPacketTwo && n === 2));
                    return (
                      <div
                        key={n}
                        className={`rounded border py-1 font-mono text-[10px] transition-all ${
                          arrived
                            ? "border-[#b7f36b] bg-[#b7f36b]/15 text-[#b7f36b]"
                            : dropPacketTwo && n === 2 && step >= 1
                            ? "border-[#e5a93c]/60 bg-[#e5a93c]/10 text-[#e5a93c]"
                            : "border-[#1c2632] bg-[#090d12] text-[#5d6d7e]"
                        }`}
                      >
                        {arrived ? `#${n}` : "?"}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: DNS & PORTS ================= */}
        {tab === "addressing" && (
          <div className="space-y-5">
            {/* Website selector */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-[11px] text-[#8e9eae]">
                Pick a destination to watch{" "}
                <span className="text-[#58c8ef]">DNS</span> find the building (IP)
                and the <span className="text-[#b7f36b]">Port</span> open the right
                door:
              </p>
              <div className="inline-flex rounded-md border border-[#1c2632] bg-[#0e141b] p-0.5 font-mono text-[11px]">
                {WEBSITE_PRESETS.map((site, idx) => (
                  <button
                    key={site.domain}
                    type="button"
                    onClick={() => {
                      setSelectedSiteIdx(idx);
                      setDnsStage(0);
                    }}
                    className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                      selectedSiteIdx === idx
                        ? "bg-[#e8eef4] text-[#090d12] font-semibold"
                        : "text-[#8e9eae] hover:text-[#e8eef4]"
                    }`}
                  >
                    {site.domain}
                  </button>
                ))}
              </div>
            </div>

            {/* 3-Column Visual Flow: Browser -> DNS Phonebook -> Server Building + Doors */}
            <div className="grid gap-3 md:grid-cols-3">
              {/* Step 1: Browser */}
              <div
                className={`rounded-lg border p-4 transition-all duration-300 ${
                  dnsStage === 0
                    ? "border-[#b7f36b]/70 bg-[#141d27]"
                    : "border-[#1c2632] bg-[#0e141b]"
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#8e9eae]">
                  <Globe className="h-3.5 w-3.5 text-[#58c8ef]" />
                  <span>1. Human Name</span>
                </div>
                <div className="mt-3 rounded border border-[#1c2632] bg-[#090d12] px-3 py-2 font-mono text-xs text-[#e8eef4]">
                  https://{selectedSite.domain}
                </div>
                <p className="mt-2.5 text-[11px] text-[#8e9eae]">
                  Easy for humans to remember, but routers only understand numbers.
                </p>
              </div>

              {/* Step 2: DNS Phonebook */}
              <div
                className={`rounded-lg border p-4 transition-all duration-300 ${
                  dnsStage === 1 || dnsStage === 2
                    ? "border-[#58c8ef]/70 bg-[#141d27]"
                    : "border-[#1c2632] bg-[#0e141b]"
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#8e9eae]">
                  <BookOpen className="h-3.5 w-3.5 text-[#58c8ef]" />
                  <span>2. DNS Phonebook</span>
                </div>
                <div className="mt-3 flex items-center justify-between rounded border border-[#1c2632] bg-[#090d12] px-3 py-2 font-mono text-xs">
                  <span className="text-[#8e9eae]">{selectedSite.domain}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#58c8ef]" />
                  <span
                    className={
                      dnsStage >= 2
                        ? "text-[#b7f36b] font-semibold"
                        : "text-[#5d6d7e]"
                    }
                  >
                    {dnsStage >= 2 ? selectedSite.ip : "Looking up..."}
                  </span>
                </div>
                <p className="mt-2.5 text-[11px] text-[#8e9eae]">
                  Translates the domain name into the server&apos;s IP street address.
                </p>
              </div>

              {/* Step 3: Server Building & Port Doors */}
              <div
                className={`rounded-lg border p-4 transition-all duration-300 ${
                  dnsStage === 3
                    ? "border-[#b7f36b]/70 bg-[#141d27]"
                    : "border-[#1c2632] bg-[#0e141b]"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#8e9eae]">
                  <span className="inline-flex items-center gap-1.5">
                    <Server className="h-3.5 w-3.5 text-[#b7f36b]" />
                    <span>3. Building &amp; Doors</span>
                  </span>
                  <span className="text-[#58c8ef]">{selectedSite.ip}</span>
                </div>
                <div className="mt-3 space-y-1.5">
                  {SERVER_PORTS.map((p) => {
                    const Icon = p.icon;
                    const isTarget = p.port === selectedSite.port && dnsStage === 3;
                    return (
                      <div
                        key={p.port}
                        className={`flex items-center justify-between rounded border px-2.5 py-1.5 font-mono text-[11px] transition-all ${
                          isTarget
                            ? "border-[#b7f36b] bg-[#b7f36b]/15 text-[#e8eef4]"
                            : "border-[#1c2632] bg-[#090d12] text-[#8e9eae]"
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <Icon className="h-3 w-3" style={{ color: p.accent }} />
                          <span>:{p.port}</span>
                          <span className="text-[10px] opacity-80">{p.name}</span>
                        </span>
                        <span className="text-[10px]">
                          {isTarget ? "Open ✓" : p.role}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: LAN VS WAN ================= */}
        {tab === "lan-wan" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-[11px] text-[#8e9eae]">
                Compare traffic staying inside your{" "}
                <span className="text-[#b7f36b]">Home LAN</span> vs. crossing the{" "}
                <span className="text-[#58c8ef]">Global Internet (WAN)</span>.
              </p>

              <div className="inline-flex rounded-md border border-[#1c2632] bg-[#0e141b] p-0.5 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setTrafficScope("local");
                    setStep(0);
                  }}
                  className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                    trafficScope === "local"
                      ? "bg-[#b7f36b] text-[#090d12] font-semibold"
                      : "text-[#8e9eae] hover:text-[#e8eef4]"
                  }`}
                >
                  Print Locally (LAN)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrafficScope("internet");
                    setStep(0);
                  }}
                  className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                    trafficScope === "internet"
                      ? "bg-[#58c8ef] text-[#090d12] font-semibold"
                      : "text-[#8e9eae] hover:text-[#e8eef4]"
                  }`}
                >
                  Visit Website (WAN)
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-12 items-stretch">
              {/* Home LAN Box */}
              <div
                className={`md:col-span-7 rounded-xl border p-4 transition-colors ${
                  trafficScope === "local"
                    ? "border-[#b7f36b]/55 bg-[#0e141b]"
                    : "border-[#1c2632] bg-[#0e141b]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#b7f36b]">
                    <Home className="h-3.5 w-3.5" />
                    YOUR HOME LAN (192.168.1.x)
                  </span>
                  <span className="font-mono text-[10px] text-[#8e9eae]">
                    Private &amp; Local
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
                  <div
                    className={`rounded-lg border p-2.5 transition-all ${
                      (trafficScope === "local" && (step === 0 || step === 3)) ||
                      (trafficScope === "internet" && step === 0)
                        ? "border-[#b7f36b] bg-[#141d27]"
                        : "border-[#1c2632] bg-[#090d12]"
                    }`}
                  >
                    <Laptop className="mx-auto h-4 w-4 text-[#b7f36b]" />
                    <p className="mt-1.5 font-mono text-[10px] font-semibold text-[#e8eef4]">
                      Laptop
                    </p>
                    <p className="font-mono text-[9px] text-[#8e9eae]">.1.12</p>
                  </div>

                  <div
                    className={`rounded-lg border p-2.5 transition-all ${
                      step === 1 || (trafficScope === "internet" && step === 3)
                        ? "border-[#58c8ef] bg-[#141d27]"
                        : "border-[#1c2632] bg-[#090d12]"
                    }`}
                  >
                    <Router className="mx-auto h-4 w-4 text-[#58c8ef]" />
                    <p className="mt-1.5 font-mono text-[10px] font-semibold text-[#e8eef4]">
                      Wi-Fi Router
                    </p>
                    <p className="font-mono text-[9px] text-[#8e9eae]">Gateway</p>
                  </div>

                  <div
                    className={`rounded-lg border p-2.5 transition-all ${
                      trafficScope === "local" && step >= 2
                        ? "border-[#b7f36b] bg-[#141d27]"
                        : "border-[#1c2632] bg-[#090d12]"
                    }`}
                  >
                    <Printer className="mx-auto h-4 w-4 text-[#b7f36b]" />
                    <p className="mt-1.5 font-mono text-[10px] font-semibold text-[#e8eef4]">
                      Printer
                    </p>
                    <p className="font-mono text-[9px] text-[#8e9eae]">.1.25</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-md border border-[#1c2632] bg-[#090d12] px-3 py-2 font-mono text-[10px]">
                  <span className="inline-flex items-center gap-1.5 text-[#8e9eae]">
                    <Wifi className="h-3.5 w-3.5 text-[#58c8ef]" />
                    <Smartphone className="h-3.5 w-3.5 text-[#8e9eae]" />
                    <span>Phone (.1.18) also connected</span>
                  </span>
                  <span
                    className={
                      trafficScope === "local"
                        ? "text-[#b7f36b]"
                        : "text-[#58c8ef]"
                    }
                  >
                    {trafficScope === "local"
                      ? "Stays inside LAN ✓"
                      : "Exits via Router →"}
                  </span>
                </div>
              </div>

              {/* Global WAN Box */}
              <div
                className={`md:col-span-5 rounded-xl border p-4 flex flex-col justify-between transition-colors ${
                  trafficScope === "internet" && step >= 2
                    ? "border-[#58c8ef]/70 bg-[#141d27]"
                    : "border-[#1c2632] bg-[#0e141b]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#58c8ef]">
                    <Globe className="h-3.5 w-3.5" />
                    GLOBAL WAN (INTERNET)
                  </span>
                </div>

                <div className="my-4 flex items-center justify-center gap-3">
                  <div
                    className={`rounded-lg border p-3 text-center transition-all ${
                      trafficScope === "internet" && step === 2
                        ? "border-[#58c8ef] bg-[#58c8ef]/15"
                        : "border-[#1c2632] bg-[#090d12] opacity-60"
                    }`}
                  >
                    <Network className="mx-auto h-4 w-4 text-[#58c8ef]" />
                    <p className="mt-1 font-mono text-[10px] text-[#e8eef4]">
                      ISP Backbone
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#5d6d7e]" />
                  <div
                    className={`rounded-lg border p-3 text-center transition-all ${
                      trafficScope === "internet" && step === 3
                        ? "border-[#b7f36b] bg-[#b7f36b]/15"
                        : "border-[#1c2632] bg-[#090d12] opacity-60"
                    }`}
                  >
                    <Server className="mx-auto h-4 w-4 text-[#b7f36b]" />
                    <p className="mt-1 font-mono text-[10px] text-[#e8eef4]">
                      Cloud Server
                    </p>
                  </div>
                </div>

                <p className="font-mono text-[10px] text-[#8e9eae]">
                  {trafficScope === "local"
                    ? "Idle — local printing never needs the Internet."
                    : "Active — connecting your LAN to a remote network."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Narration Bar & Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-xs">
        <div className="flex items-start gap-2 text-[var(--text-secondary)] max-w-2xl">
          {tab === "packets" ? (
            <Package className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-lime)]" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-blue)]" />
          )}
          <span className="leading-relaxed">
            {tab === "journey"
              ? JOURNEY_STEPS[step].detail
              : tab === "packets"
              ? PACKET_STAGES[step]
              : tab === "addressing"
              ? dnsStageDescriptions[dnsStage]
              : lanWanDescriptions[step]}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause simulation" : "Play simulation"}
            className="inline-flex items-center gap-1 rounded border border-[var(--border-default)] bg-[var(--bg-base)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={handleManualStep}
            aria-label="Next step"
            className="inline-flex items-center gap-1 rounded border border-[var(--border-default)] bg-[var(--bg-base)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            Step
            <ArrowRight className="h-3 w-3" />
          </button>
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
