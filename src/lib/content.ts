import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { LearningExperienceSchema } from "@/features/learning/schemas/learningExperience";

export const NoteCategorySchema = z.enum([
  "Cloud Infrastructure",
  "Cybersecurity",
]);

export const NoteDifficultySchema = z.enum([
  "Beginner",
  "Intermediate",
  "Advanced",
]);

export const NoteFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().min(1),
  category: NoteCategorySchema,
  subcategory: z.string().optional(),
  tags: z.array(z.string()).default([]),
  author: z.string().default("StratumSec"),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  difficulty: NoteDifficultySchema.default("Intermediate"),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  coverImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  learningExperience: LearningExperienceSchema.optional(),
});

export type NoteCategory = z.infer<typeof NoteCategorySchema>;
export type NoteDifficulty = z.infer<typeof NoteDifficultySchema>;
export type NoteFrontmatter = z.infer<typeof NoteFrontmatterSchema>;

export interface NoteRecord extends Omit<NoteFrontmatter, "slug" | "publishedAt" | "updatedAt"> {
  slug: string;
  publishedAt: string;
  updatedAt: string;
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

export const TopicFrontmatterSchema = z.object({
  title: NoteCategorySchema,
  slug: z.enum(["cloud", "security"]),
  description: z.string(),
  accent: z.enum(["blue", "lime"]).default("blue"),
  subcategories: z.array(z.string()).default([]),
});

export interface TopicRecord extends z.infer<typeof TopicFrontmatterSchema> {
  body: string;
}

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");
const NOTES_DIR = path.join(CONTENT_ROOT, "notes");
const TOPICS_DIR = path.join(CONTENT_ROOT, "topics");

function calculateReadingTime(markdown: string): number {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/[#>*_\-|[\]()]/g, " ")
    .trim();
  const words = plain ? plain.split(/\s+/).length : 0;
  return Math.max(2, Math.ceil(words / 210));
}

function stripMarkdownForSearch(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]()|]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 600);
}

function readMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...readMarkdownFiles(full));
    } else if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

export function getAllNotes(options?: { includeDrafts?: boolean }): NoteRecord[] {
  const includeDrafts = options?.includeDrafts ?? false;
  const files = readMarkdownFiles(NOTES_DIR);

  const notes = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const parsed = NoteFrontmatterSchema.parse(data);
    const fallbackSlug = path.basename(filePath).replace(/\.(md|mdx)$/i, "");
    const slug = parsed.slug ?? fallbackSlug;
    const readingTimeMinutes = calculateReadingTime(content);

    return {
      ...parsed,
      slug,
      publishedAt: parsed.publishedAt.toISOString(),
      updatedAt: (parsed.updatedAt ?? parsed.publishedAt).toISOString(),
      readingTimeMinutes,
      readingTimeLabel: `${readingTimeMinutes} min read`,
      body: content.trim(),
    } satisfies NoteRecord;
  });

  return notes
    .filter((note) => includeDrafts || !note.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getNoteBySlug(slug: string): NoteRecord | undefined {
  return getAllNotes().find((note) => note.slug === slug);
}

export function getNotesByCategory(category: NoteCategory): NoteRecord[] {
  return getAllNotes().filter((note) => note.category === category);
}

export function getFeaturedNotes(limit = 3): NoteRecord[] {
  const all = getAllNotes();
  const featured = all.filter((n) => n.featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

export function getRelatedNotes(current: NoteRecord, limit = 3): NoteRecord[] {
  const others = getAllNotes().filter((n) => n.slug !== current.slug);
  const currentTags = new Set(current.tags.map((t) => t.toLowerCase()));

  return others
    .map((note) => {
      let score = 0;
      if (note.category === current.category) score += 2;
      if (note.subcategory && note.subcategory === current.subcategory) score += 2;
      for (const tag of note.tags) {
        if (currentTags.has(tag.toLowerCase())) score += 3;
      }
      return { note, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.note);
}

export function getAdjacentNotes(slug: string): {
  prev: NoteRecord | null;
  next: NoteRecord | null;
} {
  const all = getAllNotes();
  const idx = all.findIndex((n) => n.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx < all.length - 1 ? all[idx + 1] : null,
    next: idx > 0 ? all[idx - 1] : null,
  };
}

export function getAllTopics(): TopicRecord[] {
  const files = readMarkdownFiles(TOPICS_DIR);
  return files.map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const parsed = TopicFrontmatterSchema.parse(data);
    return {
      ...parsed,
      body: content.trim(),
    };
  });
}

export function getTopicBySlug(slug: "cloud" | "security"): TopicRecord | undefined {
  return getAllTopics().find((t) => t.slug === slug);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const note of getAllNotes()) {
    for (const tag of note.tags) tags.add(tag);
  }
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

export function getKnowledgeStats() {
  const notes = getAllNotes();
  const cloudCount = notes.filter((n) => n.category === "Cloud Infrastructure").length;
  const securityCount = notes.filter((n) => n.category === "Cybersecurity").length;
  const latestUpdate = notes.reduce<string | null>((acc, note) => {
    if (!acc) return note.updatedAt;
    return new Date(note.updatedAt) > new Date(acc) ? note.updatedAt : acc;
  }, null);

  return {
    totalNotes: notes.length,
    cloudCount,
    securityCount,
    topicCount: 2,
    tagCount: getAllTags().length,
    latestUpdate,
  };
}

export function getSearchDocuments(): SearchDocument[] {
  return getAllNotes().map((note) => ({
    slug: note.slug,
    title: note.title,
    description: note.description,
    category: note.category,
    subcategory: note.subcategory,
    tags: note.tags,
    difficulty: note.difficulty,
    readingTimeLabel: note.readingTimeLabel,
    publishedAt: note.publishedAt,
    excerpt: stripMarkdownForSearch(note.body),
  }));
}

export function formatDisplayDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
