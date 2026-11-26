"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import type { SearchDocument } from "@/lib/types";
import { CommandSearchModal } from "@/components/shared/CommandSearchModal";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const NAV_LINKS = [
  { href: "/explore", label: "Archive" },
  { href: "/cloud", label: "Cloud" },
  { href: "/security", label: "Security" },
  { href: "/architecture", label: "Architecture" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
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
      <header className="sticky top-0 z-40 border-b border-[var(--border-default)] bg-[var(--bg-base)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          {/* Editorial Wordmark */}
          <Link
            href="/"
            className="flex items-baseline gap-2 text-[var(--text-primary)] transition-opacity hover:opacity-85"
          >
            <span className="font-display text-[15px] font-semibold tracking-[0.06em] uppercase">
              Stratum<span className="text-[var(--accent-lime)]">Sec</span>
            </span>
            <span className="hidden lg:inline font-mono text-[10px] text-[var(--text-muted)]">
              / field notes
            </span>
          </Link>

          {/* Clean Editorial Navigation */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-6 text-[13px]"
          >
            {NAV_LINKS.map((item) => {
              const isActive =
                pathname === item.href ||
                Boolean(pathname?.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-1 transition-colors ${
                    isActive
                      ? "text-[var(--text-primary)] font-medium border-b border-[var(--accent-lime)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Understated Utility Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search notes (Ctrl+K or /)"
              className="flex h-8 items-center gap-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-2.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
            >
              <Search className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden lg:inline font-mono text-[10px] text-[var(--text-muted)]">
                /
              </kbd>
            </button>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] md:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="border-t border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 md:hidden">
            <nav aria-label="Mobile navigation" className="flex flex-col divide-y divide-[var(--border-default)]">
              {NAV_LINKS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`py-2.5 text-sm ${
                      isActive
                        ? "text-[var(--accent-lime)] font-medium"
                        : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/search"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm text-[var(--text-secondary)]"
              >
                Search
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
