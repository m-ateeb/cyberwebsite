"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowUpRight, CornerDownLeft } from "lucide-react";
import type { SearchDocument } from "@/lib/types";

interface CommandSearchModalProps {
  open: boolean;
  onClose: () => void;
  documents: SearchDocument[];
}

export function CommandSearchModal({
  open,
  onClose,
  documents,
}: CommandSearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 20);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return documents.slice(0, 6);
    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        (doc.subcategory?.toLowerCase().includes(q) ?? false) ||
        doc.tags.some((t) => t.toLowerCase().includes(q)) ||
        doc.excerpt.toLowerCase().includes(q)
    );
  }, [documents, query]);

  if (!open) return null;

  const goToSearchPage = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    handleClose();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 px-4 pt-16 sm:pt-24 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search StratumSec notes"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={goToSearchPage}
          className="flex items-center gap-3 border-b border-[var(--border-default)] px-4 py-3.5"
        >
          <Search className="h-4 w-4 shrink-0 text-[var(--accent-lime)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Cloud Computing, IaaS, PaaS, SaaS, Elasticity..."
            aria-label="Search notes"
            className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </form>

        <div className="max-h-96 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-10 text-center text-sm text-[var(--text-secondary)]">
              No matching notes for &ldquo;{query}&rdquo;. Try{" "}
              <span className="font-mono text-[var(--accent-blue)]">eBPF</span>,{" "}
              <span className="font-mono text-[var(--accent-lime)]">Zero Trust</span>, or{" "}
              <span className="font-mono text-[var(--accent-blue)]">KMS</span>.
            </div>
          ) : (
            <ul className="space-y-1">
              {results.map((doc) => {
                const isCloud = doc.category === "Cloud Infrastructure";
                return (
                  <li key={doc.slug}>
                    <Link
                      href={`/notes/${doc.slug}`}
                      onClick={handleClose}
                      className="group flex items-start justify-between gap-3 rounded-xl px-3.5 py-2.5 transition-colors hover:bg-[var(--bg-elevated)]"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
                          <span
                            className={
                              isCloud
                                ? "text-[var(--accent-blue)]"
                                : "text-[var(--accent-lime)]"
                            }
                          >
                            {doc.category}
                          </span>
                          <span className="text-[var(--text-muted)]">·</span>
                          <span className="text-[var(--text-muted)]">
                            {doc.difficulty} · {doc.readingTimeLabel}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-lime)] transition-colors">
                          {doc.title}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-[var(--text-secondary)]">
                          {doc.description}
                        </p>
                      </div>
                      <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent-lime)]" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-2.5 font-mono text-[11px] text-[var(--text-muted)]">
          <span>{results.length} result(s)</span>
          <div className="flex items-center gap-3">
            <Link
              href={query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search"}
              onClick={handleClose}
              className="inline-flex items-center gap-1 text-[var(--accent-blue)] hover:underline"
            >
              Full search
              <CornerDownLeft className="h-3 w-3" />
            </Link>
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
