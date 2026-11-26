import React from "react";
import Link from "next/link";
import { Shield, Rss, GitBranch, Coffee } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border-default)] bg-[var(--bg-surface)]/50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--accent-lime)]/35 bg-[var(--accent-lime-dim)] text-[var(--accent-lime)]">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-display text-base font-bold tracking-tight text-[var(--text-primary)]">
                STRATUM<span className="text-[var(--accent-lime)]">SEC</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
              Engineering knowledge without the noise. Independent technical notes
              on cloud infrastructure, kernel security, and Zero-Trust architecture.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/m-ateeb/cyberwebsite"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              >
                <GitBranch className="h-3.5 w-3.5" />
                GitHub
              </a>
              <Link
                href="/rss.xml"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--accent-lime)]"
              >
                <Rss className="h-3.5 w-3.5" />
                RSS Feed
              </Link>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2.5 text-sm">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
              Topics
            </p>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li>
                <Link href="/cloud" className="hover:text-[var(--accent-blue)] transition-colors">
                  Cloud Infrastructure
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-[var(--accent-lime)] transition-colors">
                  Cybersecurity
                </Link>
              </li>
              <li>
                <Link href="/architecture" className="hover:text-[var(--text-primary)] transition-colors">
                  Architecture Stack
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-[var(--text-primary)] transition-colors">
                  Knowledge Library
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2.5 text-sm">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
              Publication
            </p>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li>
                <Link href="/about" className="hover:text-[var(--text-primary)] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-[var(--text-primary)] transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[var(--text-primary)] transition-colors">
                  Support &amp; Contact
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-[var(--text-primary)] transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent-lime)]">
              Independent Research
            </p>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              StratumSec is ad-light, static-first, and written for engineers. Support
              new deep dives and open architecture diagrams.
            </p>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent-lime)]/40 bg-[var(--accent-lime-dim)] px-3.5 py-2 text-xs font-semibold text-[var(--accent-lime)] transition-colors hover:bg-[var(--accent-lime)] hover:text-[#090d12]"
            >
              <Coffee className="h-3.5 w-3.5" />
              Buy Me a Coffee
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--border-default)] pt-6 font-mono text-[11px] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 StratumSec. All technical notes version-controlled in Git.</span>
          <span>Static-First · Zero-CLS · Reduced-Motion Aware</span>
        </div>
      </div>
    </footer>
  );
}
