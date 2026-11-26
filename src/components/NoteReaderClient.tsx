"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { NOTES, type SimulationStep, type TechnicalNote } from "@/data/notes";
import { Navbar } from "./Navbar";
import { AdSlot } from "./AdSlot";
import { NoteSimulationStage } from "./NoteSimulationStage";
import { Footer } from "./Footer";

export function NoteReaderClient({ note }: { note: TechnicalNote }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [depthMode, setDepthMode] = useState<"deep" | "tldr">("deep");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSimIndex, setActiveSimIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const simulationSteps: SimulationStep[] = useMemo(() => {
    const fromSections = note.sections
      .map((s) => s.simulation)
      .filter((sim): sim is SimulationStep => Boolean(sim));

    if (fromSections.length > 0) return fromSections;

    return [
      {
        sectionId: "problem",
        label: "Step 1 · Threat Surface",
        diagramMode: "threat",
        activeNodes: ["client", "edge", "mesh"],
        packetPath: "bypass",
        caption: note.threatOrProblem,
        telemetry: [
          { label: "Posture", value: "Legacy Gap", status: "warn" },
          { label: "Domain", value: note.domain, status: "info" },
        ],
      },
      {
        sectionId: "modern-fix",
        label: "Step 2 · Modern Approach",
        diagramMode: "defense",
        activeNodes: ["client", "edge", "kernel", "vault"],
        blockedAt: "kernel",
        packetPath: "mtls-direct",
        caption: note.modernApproach,
        telemetry: [
          { label: "Posture", value: "Zero-Trust", status: "ok" },
          { label: "Level", value: note.difficulty, status: "info" },
        ],
      },
    ];
  }, [note]);

  useEffect(() => {
    if (!autoPlay || simulationSteps.length <= 1) return;
    const id = setInterval(() => {
      setActiveSimIndex((prev) => (prev + 1) % simulationSteps.length);
    }, 4500);
    return () => clearInterval(id);
  }, [autoPlay, simulationSteps.length]);

  useEffect(() => {
    if (depthMode !== "deep") return;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-sim-index]")
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-sim-index"));
            if (!Number.isNaN(idx) && idx < simulationSteps.length) {
              setActiveSimIndex(idx);
            }
          }
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: 0.1 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [depthMode, simulationSteps.length]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (total > 0) {
        setScrollProgress(Math.min(100, Math.round((window.scrollY / total) * 100)));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copyCode = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  const related = NOTES.filter((n) => n.slug !== note.slug).slice(0, 2);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-slate-900"
        aria-hidden="true"
      >
        <div
          className="h-full bg-sky-400 transition-[width] duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-sky-300 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Field Notes
        </Link>

        {/* Top Leaderboard Ad Slot */}
        <div className="mt-5">
          <AdSlot slotId={`article-top-${note.slug}`} format="leaderboard" />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          {/* Article Column */}
          <article className="lg:col-span-8 space-y-8">
            <header className="space-y-4 border-b border-slate-800/80 pb-6">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                <span className="rounded border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 uppercase text-sky-300">
                  {note.domain}
                </span>
                <span className="rounded border border-slate-700 bg-slate-800/70 px-2 py-0.5 text-slate-300">
                  {note.difficulty}
                </span>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  {note.readTime} · {note.updatedAt}
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-slate-100 leading-tight">
                {note.title}
              </h1>

              <p className="text-sm sm:text-base leading-relaxed text-slate-400">
                {note.subtitle}
              </p>

              {/* Depth Mode Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="inline-flex rounded-xl border border-slate-800 bg-[#11161f] p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setDepthMode("deep")}
                    className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                      depthMode === "deep"
                        ? "bg-sky-400 text-slate-950"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Deep Technical
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepthMode("tldr")}
                    className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                      depthMode === "tldr"
                        ? "bg-sky-400 text-slate-950"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Executive TL;DR
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {note.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-slate-800/70 px-2 py-0.5 font-mono text-[11px] text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            {/* TL;DR & Threat/Modern Approach Matrix */}
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-amber-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Core Problem / Threat
                </div>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-200">
                  {note.threatOrProblem}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Modern Approach
                </div>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-200">
                  {note.modernApproach}
                </p>
              </div>
            </section>

            {/* Executive Summary Box */}
            <section className="rounded-2xl border border-sky-400/25 bg-sky-400/5 p-5">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-sky-300">
                <BookOpen className="h-4 w-4" />
                Concept Summary
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                {depthMode === "tldr" ? note.tldr : note.deepDiveSummary}
              </p>
            </section>

            {/* Full Technical Sections (visible in Deep Technical mode) */}
            {depthMode === "deep" && (
              <div className="space-y-8">
                {note.sections.map((section, idx) => {
                  const isActiveSim = activeSimIndex === idx;
                  return (
                  <React.Fragment key={section.id}>
                    <section
                      id={section.id}
                      data-sim-index={idx}
                      className={`scroll-mt-24 space-y-4 border-l-2 pl-4 transition-colors duration-300 ${
                        isActiveSim
                          ? "border-sky-400"
                          : "border-transparent"
                      }`}
                    >
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
                        {section.heading}
                      </h2>

                      {section.body.map((para, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-sm sm:text-base leading-relaxed text-slate-300"
                        >
                          {para}
                        </p>
                      ))}

                      {section.callout && (
                        <div
                          className={`rounded-xl border p-4 ${
                            section.callout.type === "threat"
                              ? "border-amber-500/25 bg-amber-500/5"
                              : section.callout.type === "approach"
                              ? "border-sky-400/25 bg-sky-400/5"
                              : "border-emerald-500/25 bg-emerald-500/5"
                          }`}
                        >
                          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-100">
                            <Lightbulb className="h-4 w-4 text-sky-400" />
                            {section.callout.title}
                          </div>
                          <p className="mt-1.5 text-xs sm:text-sm text-slate-300">
                            {section.callout.text}
                          </p>
                        </div>
                      )}

                      {section.codeSnippet && (
                        <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0d1118]">
                          <div className="flex items-center justify-between border-b border-slate-800 bg-[#11161f] px-4 py-2 text-xs font-mono text-slate-400">
                            <span>{section.codeSnippet.filename}</span>
                            <button
                              type="button"
                              onClick={() =>
                                copyCode(section.id, section.codeSnippet!.code)
                              }
                              className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800/80 px-2 py-1 text-[11px] text-slate-300 hover:text-sky-300"
                            >
                              {copiedId === section.id ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-400" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-slate-200 font-mono">
                            <code>{section.codeSnippet.code}</code>
                          </pre>
                        </div>
                      )}
                    </section>

                    {/* Mid-Article Reserved Ad Slot */}
                    {idx === 0 && (
                      <AdSlot
                        slotId={`article-mid-${note.slug}`}
                        format="in-article"
                        label="Sponsored · In-Article"
                      />
                    )}
                  </React.Fragment>
                  );
                })}
              </div>
            )}

            {/* Key Takeaways */}
            <section className="rounded-2xl border border-slate-800 bg-[#11161f] p-6">
              <h3 className="font-display text-lg font-bold text-slate-100">
                Key Takeaways
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm text-slate-300">
                {note.keyTakeaways.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Related Notes */}
            <section className="pt-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400">
                Continue Reading
              </h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/notes/${rel.slug}`}
                    className="rounded-xl border border-slate-800 bg-[#11161f] p-4 transition-colors hover:border-sky-400/40"
                  >
                    <span className="font-mono text-[10px] uppercase text-sky-400">
                      {rel.domain} · {rel.difficulty}
                    </span>
                    <p className="mt-1 font-display text-sm font-semibold text-slate-100">
                      {rel.title}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </article>

          {/* Sticky Sidebar (Read-Along Simulation + TOC + Reserved Ad Slots) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-20 space-y-5">
              <NoteSimulationStage
                steps={simulationSteps}
                activeStepIndex={activeSimIndex}
                onSelectStep={(idx) => {
                  setAutoPlay(false);
                  setActiveSimIndex(idx);
                }}
                autoPlay={autoPlay}
                onToggleAutoPlay={() => setAutoPlay((p) => !p)}
              />

              {depthMode === "deep" && note.sections.length > 0 && (
                <div className="glass-panel rounded-2xl p-5">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-sky-400">
                    On This Page
                  </p>
                  <nav aria-label="Table of contents" className="mt-3 space-y-2">
                    {note.sections.map((s) => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className="block text-xs text-slate-400 hover:text-sky-300 transition-colors"
                      >
                        {s.heading}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              <AdSlot slotId={`article-sidebar-${note.slug}`} format="sidebar" />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
