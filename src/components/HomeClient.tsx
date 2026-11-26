"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, Layers } from "lucide-react";
import { NOTES, type NoteDomain } from "@/data/notes";
import { Navbar } from "./Navbar";
import { AdSlot } from "./AdSlot";
import { IsometricStackShowcase } from "./IsometricStackShowcase";
import { StackDefenseExplorer } from "./StackDefenseExplorer";
import { NotesCatalog } from "./NotesCatalog";
import { Footer } from "./Footer";

gsap.registerPlugin(ScrollTrigger);

const STORAGE_KEY = "stratumsec_saved_notes";
const EMPTY_SLUGS: string[] = [];
let cachedRaw: string | null = null;
let cachedParsed: string[] = EMPTY_SLUGS;

function subscribeToSaved(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("stratumsec-saved-updated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("stratumsec-saved-updated", callback);
  };
}

function getSavedSnapshot(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedParsed;
    cachedRaw = raw;
    if (raw) {
      const parsed = JSON.parse(raw);
      cachedParsed = Array.isArray(parsed) ? parsed : EMPTY_SLUGS;
    } else {
      cachedParsed = EMPTY_SLUGS;
    }
    return cachedParsed;
  } catch {
    return EMPTY_SLUGS;
  }
}

function getServerSnapshot(): string[] {
  return EMPTY_SLUGS;
}

export function HomeClient() {
  const [activeDomain, setActiveDomain] = useState<"all" | NoteDomain>("all");
  const rootRef = useRef<HTMLDivElement>(null);
  const savedSlugs = useSyncExternalStore(
    subscribeToSaved,
    getSavedSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      // Subtle parallax on the architectural grid layer
      gsap.to(".parallax-grid", {
        y: 80,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Weightless entrance for hero elements
      gsap.from(".hero-stagger", {
        y: 22,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform",
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const toggleSave = (slug: string) => {
    const next = savedSlugs.includes(slug)
      ? savedSlugs.filter((s) => s !== slug)
      : [...savedSlugs, slug];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("stratumsec-saved-updated"));
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div ref={rootRef} className="relative flex min-h-screen flex-col overflow-x-clip">
      {/* Parallax Architectural Grid Backdrop */}
      <div
        aria-hidden="true"
        className="parallax-grid bg-architectural-grid pointer-events-none fixed inset-0 -z-10 opacity-70"
      />

      <Navbar
        savedCount={savedSlugs.length}
        activeDomain={activeDomain}
        onSelectDomain={(domain) => {
          setActiveDomain(domain);
          document
            .getElementById("notes-catalog")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <main className="flex-1">
        {/* Editorial + Spatial Hero Section */}
        <section className="hero-section mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="hero-stagger inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 font-mono text-[11px] text-slate-300 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Engineering Field Notes · Cybersecurity &amp; Cloud
              </div>

              <h1 className="hero-stagger font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-slate-50 leading-[1.08]">
                Complex security &amp; cloud systems,{" "}
                <span className="text-sky-400">distilled with clarity.</span>
              </h1>

              <p className="hero-stagger max-w-xl text-sm sm:text-base leading-relaxed text-slate-400">
                Long-form technical notes covering kernel-level eBPF,
                SPIFFE/SPIRE workload identity, IAM blast-radius boundaries, and
                modern Zero-Trust architecture—written for practitioners.
              </p>

              <div className="hero-stagger flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#notes-catalog"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-white"
                >
                  <BookOpen className="h-4 w-4" />
                  Browse Field Notes
                </a>
                <a
                  href="#architecture-explorer"
                  className="glass-panel inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/25"
                >
                  <Layers className="h-4 w-4 text-sky-400" />
                  3D Topology Lab
                </a>
              </div>

              <div className="hero-stagger grid grid-cols-3 gap-6 border-t border-white/[0.08] pt-6 max-w-md">
                <div>
                  <p className="font-display text-2xl font-bold text-slate-100">
                    {NOTES.length}
                  </p>
                  <p className="font-mono text-[11px] text-slate-500">
                    Monographs
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-slate-100">
                    4
                  </p>
                  <p className="font-mono text-[11px] text-slate-500">
                    Stack Strata
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-sky-400">
                    0 CLS
                  </p>
                  <p className="font-mono text-[11px] text-slate-500">
                    Ad Containers
                  </p>
                </div>
              </div>
            </div>

            {/* Isometric 3D Floating Stack Showcase */}
            <div className="hero-stagger lg:col-span-6">
              <IsometricStackShowcase />
            </div>
          </div>

          {/* Top Reserved Leaderboard Ad Slot */}
          <div className="mt-12">
            <AdSlot slotId="home-top-leaderboard" format="leaderboard" />
          </div>
        </section>

        {/* Interactive 3D WebGL Cloud & Security Topology */}
        <StackDefenseExplorer />

        {/* Filterable Notes Library + Sticky Ad Sidebar */}
        <NotesCatalog
          activeDomain={activeDomain}
          onDomainChange={setActiveDomain}
          savedSlugs={savedSlugs}
          onToggleSave={toggleSave}
        />
      </main>

      <Footer />
    </div>
  );
}
