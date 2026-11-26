import type { MetadataRoute } from "next";
import { getAllNotes } from "@/lib/content";
import { canonicalUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const notes = getAllNotes();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/explore",
    "/networking",
    "/cloud",
    "/security",
    // "/architecture",
    "/about",
    "/support",
    "/search",
  ].map((route) => ({
    url: canonicalUrl(route || "/"),
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  const noteRoutes: MetadataRoute.Sitemap = notes.map((note) => ({
    url: canonicalUrl(`/notes/${note.slug}`),
    lastModified: new Date(note.updatedAt),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...noteRoutes];
}
