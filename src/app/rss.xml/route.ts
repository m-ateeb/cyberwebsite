import { getAllNotes } from "@/lib/content";
import { canonicalUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

/**
 * Strips illegal XML 1.0 control characters and escapes all XML special characters
 * to prevent XML injection, malformed feed parsing, and XSS in feed readers.
 */
function sanitizeXmlText(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Ensures only safe http/https URLs are emitted inside RSS links.
 */
function sanitizeXmlUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return "";
    }
    return sanitizeXmlText(parsed.toString());
  } catch {
    return "";
  }
}

export function GET() {
  const notes = getAllNotes();
  const homeUrl = sanitizeXmlUrl(canonicalUrl("/"));
  const selfUrl = sanitizeXmlUrl(canonicalUrl("/rss.xml"));

  const itemsXml = notes
    .map((note) => {
      const safeLink = sanitizeXmlUrl(canonicalUrl(`/notes/${note.slug}`));
      if (!safeLink) return "";
      const pubDate = new Date(note.publishedAt);
      const safeDate = Number.isNaN(pubDate.getTime())
        ? new Date().toUTCString()
        : pubDate.toUTCString();

      return `    <item>
      <title>${sanitizeXmlText(note.title)}</title>
      <link>${safeLink}</link>
      <guid isPermaLink="true">${safeLink}</guid>
      <description>${sanitizeXmlText(note.description)}</description>
      <category>${sanitizeXmlText(note.category)}</category>
      <pubDate>${sanitizeXmlText(safeDate)}</pubDate>
    </item>`;
    })
    .filter(Boolean)
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${sanitizeXmlText(SITE_NAME)}</title>
    <link>${homeUrl}</link>
    <description>${sanitizeXmlText(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
    },
  });
}
