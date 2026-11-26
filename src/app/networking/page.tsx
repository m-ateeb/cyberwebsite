import React from "react";
import Link from "next/link";
import { ArrowRight, Network } from "lucide-react";
import { getNetworkingNotes } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { NoteCard } from "@/components/shared/NoteCard";

export const metadata = buildPageMetadata({
  title: "Networking",
  description:
    "Beginner-friendly visual guides and interactive simulations on computer networking, CIDR, subnetting, VLSM, VPCs, and cloud routing.",
  pathname: "/networking",
});

const NETWORKING_TOPICS = [
  "Packets & Protocols",
  "IP Addressing & DNS",
  "CIDR & Subnetting",
  "VLSM",
  "Public & Private Subnets",
  "VPC & Cloud Routing",
];

export default function NetworkingTopicPage() {
  const notes = getNetworkingNotes();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <header className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-10 space-y-5">
        <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent-blue)]/35 bg-[var(--accent-blue-dim)] px-3 py-1 font-mono text-xs uppercase tracking-widest text-[var(--accent-blue)]">
          <Network className="h-3.5 w-3.5" />
          Topic Hub · Networking
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Computer &amp; Cloud Networking
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-[var(--text-secondary)]">
          Clear, interactive visual guides covering how devices communicate—from
          packets, DNS, and routers to CIDR subnetting, VLSM, public/private
          subnets, and multi-cloud VPC architecture.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {NETWORKING_TOPICS.map((sub) => (
            <span
              key={sub}
              className="rounded-md border border-[var(--border-default)] bg-[var(--bg-base)] px-3 py-1 font-mono text-xs text-[var(--text-secondary)]"
            >
              {sub}
            </span>
          ))}
        </div>
      </header>

      <section aria-label="Networking articles" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
            Published Notes ({notes.length})
          </h2>
          <Link
            href="/cloud"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent-blue)] hover:underline"
          >
            All Cloud Infrastructure
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.slug} note={note} />
          ))}
        </div>
      </section>
    </main>
  );
}
