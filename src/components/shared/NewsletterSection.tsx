"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "subscribed">("idle");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      return;
    }
    setStatus("subscribed");
    setEmail("");
  };

  return (
    <section aria-labelledby="newsletter-heading" className="space-y-4">
      <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
        Field Dispatches
      </p>
      <h2
        id="newsletter-heading"
        className="font-display text-xl font-semibold tracking-tight text-[var(--text-primary)]"
      >
        New monographs, delivered once a week.
      </h2>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
        Receive a plain-text summary when new architecture notes or threat models
        are published. No marketing sequences.
      </p>

      {status === "subscribed" ? (
        <div className="inline-flex items-center gap-2 rounded-md border border-[var(--accent-lime)]/40 bg-[var(--accent-lime-dim)] px-3.5 py-2 text-xs text-[var(--accent-lime)]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Subscribed. You&apos;ll receive the next dispatch.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md" noValidate>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="engineer@company.com"
            aria-label="Email address"
            className="h-9 flex-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none"
          />
          <button
            type="submit"
            className="h-9 shrink-0 rounded-md border border-[var(--border-strong)] bg-[var(--text-primary)] px-4 text-xs font-semibold text-[var(--bg-base)] transition-opacity hover:opacity-90"
          >
            Subscribe
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-xs text-[var(--accent-warn)]">
          Enter a valid email address.
        </p>
      )}
    </section>
  );
}
