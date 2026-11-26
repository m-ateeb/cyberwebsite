"use client";

import React, { useState } from "react";
import { CheckCircle2, Mail, Send } from "lucide-react";

const DIRECT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "mateebsaleemi@gmail.com";
const WEB3FORMS_PUBLIC_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, website }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setStatus("error");
        setFeedback(data.error ?? "Please check your inputs and try again.");
        return;
      }

      // Send directly from browser via Web3Forms (free tier works best client-side)
      if (WEB3FORMS_PUBLIC_KEY && !website.trim()) {
        const w3Res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_PUBLIC_KEY,
            from_name: "StratumSec Contact",
            name,
            email,
            replyto: email,
            subject: `[StratumSec Contact] ${subject}`,
            message,
          }),
        });
        const w3Data = await w3Res.json().catch(() => null);
        if (!w3Res.ok || !w3Data?.success) {
          setStatus("error");
          setFeedback(
            w3Data?.message ??
              "Saved locally, but email delivery failed. Please check your Web3Forms key."
          );
          return;
        }
      }

      setStatus("success");
      setFeedback(data.message ?? "Your message has been sent.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
      setFeedback("Network error. You can also email directly below.");
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-20 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-6"
    >
      <div className="space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent-blue)]">
          Direct Contact
        </p>
        <h2
          id="contact-heading"
          className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]"
        >
          Send a Message
        </h2>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          Have a question about a technical note, spotted a correction, want to
          suggest a topic, or discuss a collaboration? Send a message below or
          email directly at{" "}
          <a
            href={`mailto:${DIRECT_EMAIL}`}
            className="font-mono text-xs text-[var(--accent-blue)] underline underline-offset-4 hover:text-[var(--accent-lime)]"
          >
            {DIRECT_EMAIL}
          </a>
          .
        </p>
      </div>

      {status === "success" ? (
        <div className="rounded-lg border border-[var(--accent-lime)]/40 bg-[var(--accent-lime-dim)] p-4 flex items-start gap-3 text-sm text-[var(--accent-lime)]">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="space-y-1">
            <p className="font-medium">{feedback}</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="font-mono text-xs underline underline-offset-4 hover:opacity-80 cursor-pointer"
            >
              Send another message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Hidden honeypot field */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="contact-name"
                className="block font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]"
              >
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="h-10 w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-base)] px-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="contact-email"
                className="block font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]"
              >
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="h-10 w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-base)] px-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="contact-subject"
              className="block font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]"
            >
              Subject
            </label>
            <input
              id="contact-subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Topic request, technical question, or feedback"
              className="h-10 w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-base)] px-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="contact-message"
              className="block font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)]"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-base)] p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--border-strong)] focus:outline-none resize-y"
            />
          </div>

          {status === "error" && (
            <p className="text-xs text-[var(--accent-warn)]">{feedback}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--accent-lime)] px-5 text-xs font-semibold text-[#090d12] transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>

            <a
              href={`mailto:${DIRECT_EMAIL}`}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <Mail className="h-3.5 w-3.5" />
              Open in Email App
            </a>
          </div>
        </form>
      )}
    </section>
  );
}
