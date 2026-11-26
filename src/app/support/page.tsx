import React from "react";
import { Mail, Rss } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";
import { NewsletterSection } from "@/components/shared/NewsletterSection";
import { ContactForm } from "@/components/shared/ContactForm";

export const metadata = buildPageMetadata({
  title: "Contact, Support & Dispatches",
  description:
    "Get in touch with StratumSec, subscribe to weekly field dispatches, or follow via RSS.",
  pathname: "/support",
});

const DIRECT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "mateebsaleemi@gmail.com";

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <header className="max-w-3xl space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-lime)]">
          Contact &amp; Dispatches
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Get in Touch &amp; Follow Updates
        </h1>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          StratumSec stays free to read, fast, and independent. Reach out
          directly below, subscribe to weekly dispatches, or follow the RSS feed.
        </p>
      </header>

      {/* Buy Me a Coffee temporarily commented out
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-8 flex flex-col justify-between space-y-6">
        <div className="space-y-3">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            Buy Me a Coffee
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            One-time or recurring support directly funds cloud lab testing and new architectural deep dives.
          </p>
        </div>
        <a
          href="https://buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--accent-lime)] px-5 py-2.5 text-sm font-semibold text-[#090d12] transition-opacity hover:opacity-90"
        >
          Support on Buy Me a Coffee
        </a>
      </div>
      */}

      <ContactForm />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-4">
          <NewsletterSection />
        </div>

        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent-blue)]/40 bg-[var(--accent-blue-dim)] text-[var(--accent-blue)]">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
              Direct Channels
            </h2>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              Prefer email or an RSS reader? Reach out directly or paste the RSS
              feed into Feedly, Inoreader, or NetNewsWire.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <a
              href={`mailto:${DIRECT_EMAIL}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-blue)]"
            >
              <Mail className="h-3.5 w-3.5" />
              {DIRECT_EMAIL}
            </a>
            <a
              href="/rss.xml"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-lime)]"
            >
              <Rss className="h-3.5 w-3.5" />
              RSS Feed
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
