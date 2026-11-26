"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Search, Bookmark, Terminal } from "lucide-react";
import { CommandSearchModal } from "./CommandSearchModal";

interface NavbarProps {
  savedCount?: number;
  onSelectDomain?: (domain: "all" | "cybersecurity" | "cloud" | "architecture") => void;
  activeDomain?: string;
}

export function Navbar({
  savedCount = 0,
  onSelectDomain,
  activeDomain,
}: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0a0d12]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-slate-100 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-400/30 bg-sky-400/10 text-sky-400">
              <Shield className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <span className="font-display text-base font-bold tracking-tight">
                Stratum<span className="text-sky-400">Sec</span>
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-widest text-slate-400">
                Cyber &amp; Cloud Notes
              </span>
            </div>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-1 rounded-full border border-slate-800 bg-[#11161f] p-1 text-xs font-medium"
          >
            {(
              [
                { id: "all", label: "All Notes" },
                { id: "cybersecurity", label: "Cybersecurity" },
                { id: "cloud", label: "Cloud Infra" },
                { id: "architecture", label: "Modern Approaches" },
              ] as const
            ).map((item) => {
              const isActive = activeDomain === item.id;
              if (onSelectDomain) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectDomain(item.id)}
                    className={`rounded-full px-3.5 py-1.5 transition-colors ${
                      isActive
                        ? "bg-sky-400/15 text-sky-300 border border-sky-400/30"
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              }
              return (
                <Link
                  key={item.id}
                  href={`/#notes-catalog`}
                  className="rounded-full px-3.5 py-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-[#11161f] px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-200"
              aria-label="Search notes (Ctrl+K)"
            >
              <Search className="h-3.5 w-3.5 text-sky-400" />
              <span className="hidden sm:inline">Search concepts...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-700 bg-slate-800/80 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                Ctrl K
              </kbd>
            </button>

            <Link
              href="/#notes-catalog"
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#11161f] px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-slate-700"
              title="Saved reading list"
            >
              <Bookmark className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-mono text-[11px]">{savedCount}</span>
            </Link>

            <Link
              href="/#architecture-explorer"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-lg bg-sky-500/15 border border-sky-400/30 px-3 py-1.5 text-xs font-medium text-sky-300 transition-colors hover:bg-sky-500/25"
            >
              <Terminal className="h-3.5 w-3.5" />
              Threat Matrix
            </Link>
          </div>
        </div>
      </header>

      <CommandSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
