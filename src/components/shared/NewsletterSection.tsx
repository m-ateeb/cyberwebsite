"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const WEB3FORMS_PUBLIC_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "error" | "subscribed"
  >("idle");
  const [feedback, setFeedback] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setFeedback("Enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setFeedback("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setStatus("error");
        setFeedback(data.error ?? "Could not subscribe. Please try again.");
        return;
      }

      // Send notification directly from browser via Web3Forms if configured
      if (WEB3FORMS_PUBLIC_KEY && !data.alreadySubscribed) {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_PUBLIC_KEY,
            from_name: "StratumSec Newsletter",
            email: trimmed,
            subject: "[StratumSec] New Newsletter Subscriber",
            message: `New newsletter subscriber: ${trimmed}`,
          }),
        }).catch(() => {});
      }

      setStatus("subscribed");
      setFeedback(
        data.message ?? "Subscribed. You'll receive the next dispatch."
      );
      setEmail("");
    } catch {
      setStatus("error");
      setFeedback("Network error. Please try again in a moment.");
    }
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
        Receive a plain-text summary when new networking, cloud, or security
        notes are published. No marketing sequences.
      </p>

      {status === "subscribed" ? (
        <div className="inline-flex items-center gap-2 rounded-md border border-[var(--accent-lime)]/40 bg-[var(--accent-lime-dim)] px-3.5 py-2 text-xs text-[var(--accent-lime)]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="flex flex-col sm:flex-row gap-2 max-w-md"
          noValidate
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") {
                setStatus("idle");
                setFeedback("");
              }
            }}
            placeholder="engineer@company.com"
            aria-label="Email address"
            disabled={status === "submitting"}
            className="h-9 flex-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="h-9 shrink-0 rounded-md border border-[var(--border-strong)] bg-[var(--text-primary)] px-4 text-xs font-semibold text-[var(--bg-base)] transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
          >
            {status === "submitting" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-xs text-[var(--accent-warn)]">{feedback}</p>
      )}
    </section>
  );
}
