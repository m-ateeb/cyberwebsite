"use client";

import React, { useEffect, useState } from "react";
import { List, ChevronDown } from "lucide-react";
import type { TocItem } from "@/lib/markdown";

export function TableOfContents({
  items,
  variant = "desktop",
}: {
  items: TocItem[];
  variant?: "desktop" | "mobile";
}) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-18% 0px -70% 0px", threshold: 0.1 }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  if (variant === "mobile") {
    return (
      <details className="xl:hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-xs uppercase tracking-widest text-[var(--accent-blue)]">
          <span className="inline-flex items-center gap-2">
            <List className="h-3.5 w-3.5" />
            Table of Contents ({items.length})
          </span>
          <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
        </summary>
        <nav aria-label="Mobile table of contents" className="mt-3 space-y-1.5 border-t border-[var(--border-default)] pt-3">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block rounded-md py-1 text-xs transition-colors ${
                item.level === 3 ? "pl-3" : ""
              } ${
                activeId === item.id
                  ? "text-[var(--accent-lime)] font-medium"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </details>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
      <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent-blue)]">
        On This Page
      </p>
      <nav aria-label="Table of contents" className="mt-3.5 space-y-1.5">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block border-l-2 py-1 text-xs leading-snug transition-colors ${
                item.level === 3 ? "pl-5" : "pl-3"
              } ${
                isActive
                  ? "border-[var(--accent-lime)] text-[var(--accent-lime)] font-medium"
                  : "border-transparent text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              }`}
            >
              {item.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
