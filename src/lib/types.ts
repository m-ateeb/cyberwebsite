import type { LearningExperienceMetadata } from "@/features/learning/schemas/learningExperience";

export type NoteCategory = "Cloud Infrastructure" | "Cybersecurity";
export type NoteDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface NoteRecord {
  title: string;
  slug: string;
  description: string;
  category: NoteCategory;
  subcategory?: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  difficulty: NoteDifficulty;
  featured: boolean;
  draft: boolean;
  coverImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  learningExperience?: LearningExperienceMetadata;
  readingTimeMinutes: number;
  readingTimeLabel: string;
  body: string;
}

export interface SearchDocument {
  slug: string;
  title: string;
  description: string;
  category: NoteCategory;
  subcategory?: string;
  tags: string[];
  difficulty: NoteDifficulty;
  readingTimeLabel: string;
  publishedAt: string;
  excerpt: string;
}

export interface TopicRecord {
  title: NoteCategory;
  slug: "cloud" | "security";
  description: string;
  accent: "blue" | "lime";
  subcategories: string[];
  body: string;
}

export function formatDisplayDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
