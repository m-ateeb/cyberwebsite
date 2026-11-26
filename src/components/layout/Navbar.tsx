"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Shield, X, Coffee } from "lucide-react";
import type { SearchDocument } from "@/lib/types";
import { CommandSearchModal } from "@/components/shared/CommandSearchModal";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/cloud", label: "Cloud" },
  { href: "/security", label: "Security" },
  { href: "/architecture", label: "Architecture" },
  { href: "/about", label: "About" },
] as const;

export function Navbar({ searchDocs }: { searchDocs: SearchDocument[] }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "/" && !isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border-default)] bg-[var(--bg-base)]/92 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[var(--text-primary)] transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--accent-lime)]/35 bg-[var(--accent-lime-dim)] text-[var(--accent-lime)]">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <div className="leading-none">
              <span className="font-display text-base font-bold tracking-tight">
                STRATUM<span className="text-[var(--accent-lime)]">SEC</span>
              </span>
              <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Technical Publication
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-1 text-sm font-medium"
          >
            {NAV_LINKS.map((item) => {
              const isActive =
                pathname === item.href ||
                Boolean(pathname?.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-1.5 transition-colors ${
                    isActive
                      ? "bg-[var(--bg-surface)] text-[var(--accent-lime)] border border-[var(--border-default)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] border border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search notes (Ctrl+K or /)"
              className="flex h-9 items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
            >
              <Search className="h-3.5 w-3.5 text-[var(--accent-blue)]" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden lg:inline-flex items-center rounded border border-[var(--border-default)] bg-[var(--bg-base)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
                /
              </kbd>
            </button>

            <ThemeToggle />

            <Link
              href="/support"
              className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--accent-lime)]/40 bg-[var(--accent-lime-dim)] px-3 text-xs font-semibold text-[var(--accent-lime)] transition-colors hover:bg-[var(--accent-lime)] hover:text-[#090d12]"
            >
              <Coffee className="h-3.5 w-3.5" />
              Support
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] md:hidden"
            >
              {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="border-t border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-4 md:hidden">
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive
                        ? "bg-[var(--bg-elevated)] text-[var(--accent-lime)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/search"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              >
                Search
              </Link>
              <Link
                href="/support"
                onClick={() => setMobileOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--accent-lime)] px-4 py-2.5 text-sm font-semibold text-[#090d12]"
              >
                <Coffee className="h-4 w-4" />
                Support StratumSec
              </Link>
            </nav>
          </div>
        )}
      </header>

      <CommandSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        documents={searchDocs}
      />
    </>
  );
}
