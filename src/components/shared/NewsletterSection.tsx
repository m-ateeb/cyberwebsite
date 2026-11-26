"use client";

import React, { useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";

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
    <section
      aria-labelledby="newsletter-heading"
      className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-10"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7 space-y-2.5">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-blue)]">
            Field Dispatches
          </p>
          <h2
            id="newsletter-heading"
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]"
          >
            One technical deep dive per week. Zero filler.
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl">
            Get notified when new cloud infrastructure diagrams, threat models, and
            security engineering notes are published.
          </p>
        </div>

        <div className="lg:col-span-5">
          {status === "subscribed" ? (
            <div className="flex items-center gap-2.5 rounded-xl border border-[var(--accent-lime)]/40 bg-[var(--accent-lime-dim)] px-4 py-3.5 text-sm text-[var(--accent-lime)]">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
              You&apos;re on the list. Watch for the next StratumSec dispatch.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2.5" noValidate>
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="engineer@company.com"
                  aria-label="Email address"
                  className="h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] pl-10 pr-3.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-lime)] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="h-11 shrink-0 rounded-xl bg-[var(--accent-lime)] px-5 text-sm font-semibold text-[#090d12] transition-opacity hover:opacity-90"
              >
                Subscribe
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="mt-2 text-xs text-[var(--accent-warn)]">
              Please enter a valid email address.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
