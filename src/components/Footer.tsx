"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, CheckCircle2, Mail } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "subscribed">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("subscribed");
    setEmail("");
  };

  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-[#080b0f]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5 text-slate-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-400/30 bg-sky-400/10 text-sky-400">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-display text-base font-bold">
                Stratum<span className="text-sky-400">Sec</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-sm">
              Independent field notes on cybersecurity, cloud infrastructure, and
              modern architectural approaches—built for engineers who want clarity
              without the fluff.
            </p>
          </div>

          <div className="lg:col-span-3 grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Topics
              </p>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <Link href="/#notes-catalog" className="hover:text-sky-300">
                    Cybersecurity
                  </Link>
                </li>
                <li>
                  <Link href="/#notes-catalog" className="hover:text-sky-300">
                    Cloud Architecture
                  </Link>
                </li>
                <li>
                  <Link href="/#architecture-explorer" className="hover:text-sky-300">
                    Defense Matrix
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Site
              </p>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <Link href="/notes/ebpf-kernel-observability-vs-sidecars" className="hover:text-sky-300">
                    Featured Note
                  </Link>
                </li>
                <li>
                  <Link href="/#notes-catalog" className="hover:text-sky-300">
                    Sponsorships &amp; Ads
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-sky-400">
              Weekly Field Dispatches
            </p>
            <p className="mt-1 text-xs text-slate-400">
              One deep-dive note per week on cloud security &amp; modern defense.
            </p>

            {status === "subscribed" ? (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Subscribed! You&apos;ll receive the next dispatch.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-3 flex gap-2" noValidate>
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder="engineer@company.com"
                    aria-label="Email address for newsletter"
                    className="w-full rounded-lg border border-slate-800 bg-[#11161f] py-2 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-sky-400/60 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-sky-400 px-3.5 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-300"
                >
                  Subscribe
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="mt-1.5 text-[11px] text-amber-400">
                Please enter a valid email address.
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-800/80 pt-6 text-[11px] font-mono text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 StratumSec. Built with Next.js &amp; Tailwind CSS.</span>
          <span>Zero-CLS Reserved Ad Layout · Accessible Dark UI</span>
        </div>
      </div>
    </footer>
  );
}
