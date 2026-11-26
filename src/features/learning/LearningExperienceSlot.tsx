import React from "react";
import type { LearningExperienceMetadata } from "./schemas/learningExperience";
import { CloudComputingVisualizer } from "./simulations/CloudComputingVisualizer";
import { NetworkingVisualizer } from "./simulations/NetworkingVisualizer";
import { VpcEcsVisualizer } from "./simulations/VpcEcsVisualizer";
import { SubnettingCidrVisualizer } from "./simulations/SubnettingCidrVisualizer";

interface LearningExperienceSlotProps {
  experience?: LearningExperienceMetadata;
}

/**
 * Approved registry of validated interactive learning components (SILE).
 * Only explicitly registered, audited components can mount here.
 */
const SIMULATION_REGISTRY: Record<string, React.ComponentType> = {
  "cloud-computing-fundamentals-01": CloudComputingVisualizer,
  "networking-fundamentals-01": NetworkingVisualizer,
  "vpc-ecs-cloud-01": VpcEcsVisualizer,
  "subnetting-cidr-vlsm-01": SubnettingCidrVisualizer,
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
