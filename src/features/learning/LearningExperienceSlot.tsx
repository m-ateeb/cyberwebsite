import React from "react";
import type { LearningExperienceMetadata } from "./schemas/learningExperience";

interface LearningExperienceSlotProps {
  experience?: LearningExperienceMetadata;
}

/**
 * Reserved integration slot for the future StratumSec Interactive Learning Engine (SILE).
 *
 * Intentionally inert during the current phase:
 * - Renders nothing when status is "not-created" or undefined.
 * - Future Phase 5 will resolve approved/published experiences via a validated
 *   component registry without executing arbitrary AI-generated code.
 */
export function LearningExperienceSlot({
  experience,
}: LearningExperienceSlotProps) {
  if (!experience || experience.status !== "published" || !experience.id) {
    return null;
  }

  return (
    <section
      aria-label="Interactive learning module"
      data-learning-experience-id={experience.id}
      data-learning-experience-status={experience.status}
      className="my-8 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent-lime)]">
        Interactive Learning Module · Reserved Slot
      </p>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Module <code className="text-[var(--accent-blue)]">{experience.id}</code>{" "}
        will mount here once the StratumSec Interactive Learning Engine is enabled.
      </p>
    </section>
  );
}
