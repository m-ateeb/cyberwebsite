import React from "react";

export type AdFormat = "leaderboard" | "sidebar" | "in-article";

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
    containerClass: "min-h-[90px] w-full",
    dimensions: "728×90 / 320×50",
    description: "Reserved Leaderboard Slot",
  },
  sidebar: {
    containerClass: "min-h-[240px] w-full",
    dimensions: "300×250",
    description: "Reserved Sidebar Sponsor Slot",
  },
  "in-article": {
    containerClass: "min-h-[120px] w-full",
    dimensions: "Fluid Native",
    description: "Reserved Contextual Sponsor Slot",
  },
};

export function AdSlot({
  slotId,
  format,
  label = "Sponsor Space",
  className = "",
}: AdSlotProps) {
  const spec = FORMAT_SPECS[format];

  return (
    <aside
      aria-label={`${label} (${slotId})`}
      data-ad-slot={slotId}
      data-ad-format={format}
      className={`flex flex-col justify-between rounded-xl border border-dashed border-[var(--border-default)] bg-[var(--bg-surface)]/60 p-3.5 ${spec.containerClass} ${className}`}
    >
      <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
        <span>{label}</span>
        <span>{spec.dimensions}</span>
      </div>
      <div className="my-auto py-3 text-center">
        <p className="text-xs text-[var(--text-secondary)]">{spec.description}</p>
        <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">
          Zero-CLS · EthicalAds / Direct Sponsor Ready
        </p>
      </div>
    </aside>
  );
}
