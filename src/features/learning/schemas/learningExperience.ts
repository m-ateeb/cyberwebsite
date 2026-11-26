import { z } from "zod";

export const LearningExperienceStatusSchema = z.enum([
  "not-created",
  "proposed",
  "approved",
  "published",
]);

export const LearningExperienceSchema = z.object({
  status: LearningExperienceStatusSchema.default("not-created"),
  id: z.string().nullable().optional(),
  title: z.string().optional(),
  type: z
    .enum([
      "protocol-flow",
      "network-topology",
      "iam-policy-explorer",
      "packet-visualizer",
      "attack-path-visualizer",
      "architecture-explorer",
      "sequence-diagram",
      "resource-lifecycle",
    ])
    .optional(),
  componentRef: z.string().nullable().optional(),
  learningObjectives: z.array(z.string()).optional(),
  config: z.record(z.string(), z.unknown()).optional(),
  accessibility: z
    .object({
      reducedMotion: z.boolean().default(true),
      keyboardAccessible: z.boolean().default(true),
      staticFallback: z.boolean().default(true),
    })
    .optional(),
});

export type LearningExperienceMetadata = z.infer<typeof LearningExperienceSchema>;
