import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--border-default)] bg-[var(--bg-base)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6 space-y-2.5">
            <Link
              href="/"
              className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text-primary)]"
            >
              Stratum<span className="text-[var(--accent-lime)]">Sec</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
              Independent engineering monographs on cloud infrastructure, Linux
              kernel security, and Zero-Trust systems architecture.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs">
            <p className="font-mono uppercase tracking-widest text-[var(--text-muted)]">
              Index
            </p>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li>
                <Link href="/explore" className="hover:text-[var(--text-primary)]">
                  All Notes
                </Link>
              </li>
              <li>
                <Link href="/cloud" className="hover:text-[var(--text-primary)]">
                  Cloud Infrastructure
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-[var(--text-primary)]">
                  Cybersecurity
                </Link>
              </li>
              <li>
                <Link href="/architecture" className="hover:text-[var(--text-primary)]">
                  Architecture Explorer
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs">
            <p className="font-mono uppercase tracking-widest text-[var(--text-muted)]">
              Publication
            </p>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li>
                <Link href="/about" className="hover:text-[var(--text-primary)]">
                  About
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[var(--text-primary)]">
                  Support &amp; Dispatches
                </Link>
              </li>
              <li>
                <Link href="/rss.xml" className="hover:text-[var(--text-primary)]">
                  RSS Feed
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/m-ateeb/cyberwebsite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--text-primary)]"
                >
                  GitHub Source
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--border-default)] pt-6 font-mono text-[11px] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 StratumSec</span>
          <span>Published from Git · Static HTML</span>
        </div>
      </div>
    </footer>
  );
}
