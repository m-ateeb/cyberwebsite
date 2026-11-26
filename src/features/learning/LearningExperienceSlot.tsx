import React from "react";
import type { LearningExperienceMetadata } from "./schemas/learningExperience";
import { CloudComputingVisualizer } from "./simulations/CloudComputingVisualizer";

interface LearningExperienceSlotProps {
  experience?: LearningExperienceMetadata;
}

/**
 * Approved registry of validated interactive learning components (SILE).
 * Only explicitly registered, audited components can mount here.
 */
const SIMULATION_REGISTRY: Record<string, React.ComponentType> = {
  "cloud-computing-fundamentals-01": CloudComputingVisualizer,
};

export function LearningExperienceSlot({
  experience,
}: LearningExperienceSlotProps) {
  if (!experience || experience.status !== "published" || !experience.id) {
    return null;
  }

  const SimulationComponent = SIMULATION_REGISTRY[experience.id];
  if (!SimulationComponent) {
    return null;
  }

  return <SimulationComponent />;
}
