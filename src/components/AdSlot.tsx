import React from "react";

export type AdFormat = "leaderboard" | "sidebar" | "sidebar-tall" | "in-feed" | "in-article";

interface AdSlotProps {
  slotId: string;
  format: AdFormat;
  label?: string;
  className?: string;
}

const FORMAT_SPECS: Record<
  AdFormat,
  { containerClass: string; dimensions: string; description: string }
> = {
  leaderboard: {
    containerClass: "min-h-[92px] sm:min-h-[104px] w-full",
    dimensions: "728×90 / 320×50",
    description: "Top / Section Leaderboard Slot (Zero-CLS Reserved)",
  },
  sidebar: {
    containerClass: "min-h-[250px] w-full",
    dimensions: "300×250",
    description: "Medium Rectangle Sidebar Slot",
  },
  "sidebar-tall": {
    containerClass: "min-h-[420px] xl:min-h-[600px] w-full",
    dimensions: "300×600",
    description: "Sticky Half-Page Sidebar Slot",
  },
  "in-feed": {
    containerClass: "min-h-[132px] w-full",
    dimensions: "Fluid Native",
    description: "In-Feed Native Sponsor / Ad Slot",
  },
  "in-article": {
    containerClass: "min-h-[140px] w-full",
    dimensions: "Fluid In-Article",
    description: "Mid-Article Contextual Ad Slot",
  },
};

/**
 * Reserved Ad Integration Container (Zero-CLS).
 * Drop your ad network script (Google AdSense <ins>, Carbon Ads, or EthicalAds)
 * inside the inner slot container while preserving the min-height to prevent layout shift.
 */
export function AdSlot({
  slotId,
  format,
  label = "Advertisement",
  className = "",
}: AdSlotProps) {
  const spec = FORMAT_SPECS[format];

  return (
    <aside
      aria-label={`${label} (${slotId})`}
      data-ad-slot={slotId}
      data-ad-format={format}
      className={`rounded-xl border border-dashed border-slate-700/70 bg-[#0d121a]/80 p-3 flex flex-col justify-between transition-colors hover:border-slate-600/80 ${spec.containerClass} ${className}`}
    >
      <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-600" />
          {label} · Reserved Space
        </span>
        <span className="rounded bg-slate-800/80 px-1.5 py-0.5 text-slate-400">
          {spec.dimensions}
        </span>
      </div>

      {/* Mount AdSense / Carbon / EthicalAds / Direct Sponsor unit here */}
      <div className="my-auto py-3 text-center">
        <p className="text-xs font-medium text-slate-400">{spec.description}</p>
        <p className="mt-1 font-mono text-[11px] text-slate-500">
          slot-id: <span className="text-sky-400/80">{slotId}</span>
        </p>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-600 font-mono">
        <span>CLS-locked container</span>
        <span>AdSense / EthicalAds ready</span>
      </div>
    </aside>
  );
}
