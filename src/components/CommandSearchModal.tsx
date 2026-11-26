"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, ArrowUpRight } from "lucide-react";
import { NOTES } from "@/data/notes";

interface CommandSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function CommandSearchModal({ open, onClose }: CommandSearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NOTES;
    return NOTES.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.subtitle.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q)) ||
        n.domain.toLowerCase().includes(q)
    );
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-20 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search technical notes"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700/80 bg-[#11161f] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3.5">
          <Search className="h-4 w-4 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search eBPF, SPIFFE, IAM boundaries, ZTNA, KMS..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              No matching notes for &ldquo;{query}&rdquo;. Try{" "}
              <span className="font-mono text-sky-400">eBPF</span>,{" "}
              <span className="font-mono text-sky-400">IAM</span>, or{" "}
              <span className="font-mono text-sky-400">Zero Trust</span>.
            </div>
          ) : (
            <ul className="space-y-1">
              {results.map((note) => (
                <li key={note.slug}>
                  <Link
                    href={`/notes/${note.slug}`}
                    onClick={handleClose}
                    className="group flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-800/70"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-sky-400">
                          {note.domain}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {note.difficulty}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm font-medium text-slate-100 group-hover:text-sky-300">
                        {note.title}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
                        {note.subtitle}
                      </p>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate-500 group-hover:text-sky-400" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 bg-[#0d121a] px-4 py-2 text-[11px] font-mono text-slate-500">
          <span>{results.length} note(s) indexed</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
