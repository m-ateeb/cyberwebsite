import { Marked, type Tokens } from "marked";
import { codeToHtml } from "shiki";

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface RenderedMarkdown {
  html: string;
  toc: TocItem[];
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseCodeInfo(rawLang?: string): { lang: string; title?: string } {
  if (!rawLang) return { lang: "text" };
  const trimmed = rawLang.trim();
  const titleMatch = trimmed.match(/title="([^"]+)"/);
  const lang = trimmed.split(/\s+/)[0] || "text";
  return {
    lang: lang.toLowerCase(),
    title: titleMatch?.[1],
  };
}

export async function renderMarkdownToHtml(
  markdown: string
): Promise<RenderedMarkdown> {
  "use cache";
  const toc: TocItem[] = [];
  const usedIds = new Map<string, number>();

  // Pre-highlight all fenced code blocks asynchronously with Shiki
  const codePlaceholders = new Map<string, string>();
  let blockIndex = 0;

  const markedInstance = new Marked({
    gfm: true,
    breaks: false,
  });

  const tokens = markedInstance.lexer(markdown);

  async function processTokens(tokenList: Tokens.Generic[]) {
    for (const token of tokenList) {
      if (token.type === "code") {
        const codeToken = token as Tokens.Code;
        const { lang, title } = parseCodeInfo(codeToken.lang);
        const placeholderKey = `@@SHIKI_CODE_BLOCK_${blockIndex++}@@`;
        let highlighted: string;
        try {
          highlighted = await codeToHtml(codeToken.text, {
            lang: lang === "text" ? "plaintext" : lang,
            theme: "github-dark-default",
          });
        } catch {
          highlighted = `<pre class="shiki"><code>${escapeHtml(codeToken.text)}</code></pre>`;
        }

        const encodedRaw = encodeURIComponent(codeToken.text);
        const isTerminal = ["bash", "sh", "shell", "zsh"].includes(lang);
        const headerLabel = title ?? (isTerminal ? `terminal · ${lang}` : lang);

        const wrappedHtml = `
<div class="stratum-code-block" data-code-block="true" data-lang="${escapeHtml(lang)}">
  <div class="stratum-code-header">
    <div class="stratum-code-meta">
      <span class="stratum-code-dot ${isTerminal ? "is-terminal" : ""}"></span>
      <span>${escapeHtml(headerLabel)}</span>
    </div>
    <button type="button" class="stratum-copy-btn" data-copy-code="${encodedRaw}" aria-label="Copy code snippet">
      Copy
    </button>
  </div>
  <div class="stratum-code-body">${highlighted}</div>
</div>`;
        codePlaceholders.set(placeholderKey, wrappedHtml);
        codeToken.text = placeholderKey;
        codeToken.lang = "placeholder";
      }

      if ("tokens" in token && Array.isArray(token.tokens)) {
        await processTokens(token.tokens as Tokens.Generic[]);
      }
    }
  }

  await processTokens(tokens as Tokens.Generic[]);

  markedInstance.use({
    renderer: {
      heading({ tokens: headingTokens, depth }) {
        const rendered = this.parser.parseInline(headingTokens);
        const plainText = rendered.replace(/<[^>]+>/g, "").trim();
        let id = slugifyHeading(plainText) || "section";
        const count = usedIds.get(id) ?? 0;
        usedIds.set(id, count + 1);
        if (count > 0) id = `${id}-${count + 1}`;

        if (depth === 2 || depth === 3) {
          toc.push({ id, text: plainText, level: depth });
        }

        return `<h${depth} id="${id}" class="stratum-heading scroll-mt-28"><a href="#${id}" class="stratum-heading-anchor" aria-label="Link to ${escapeHtml(plainText)}">#</a>${rendered}</h${depth}>\n`;
      },

      code({ text, lang }) {
        if (lang === "placeholder" && codePlaceholders.has(text)) {
          return codePlaceholders.get(text)!;
        }
        return `<pre><code>${escapeHtml(text)}</code></pre>`;
      },

      blockquote({ tokens: quoteTokens }) {
        const inner = this.parser.parse(quoteTokens);
        const alertMatch = inner.match(
          /^<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:<br\s*\/?>|\n)?([\s\S]*)/i
        );

        if (alertMatch) {
          const kind = alertMatch[1].toLowerCase();
          const rest = `<p>${alertMatch[2]}`;
          const labelMap: Record<string, string> = {
            note: "Engineering Note",
            tip: "Design Tip",
            important: "Key Insight",
            warning: "Security Warning",
            caution: "Caution",
          };
          return `
<aside class="stratum-callout stratum-callout-${kind}" role="note">
  <div class="stratum-callout-title">${labelMap[kind] ?? kind}</div>
  <div class="stratum-callout-body">${rest}</div>
</aside>\n`;
        }

        return `<blockquote class="stratum-blockquote">${inner}</blockquote>\n`;
      },

      table(token) {
        const header = token.header
          .map((cell) => `<th>${this.parser.parseInline(cell.tokens)}</th>`)
          .join("");
        const rows = token.rows
          .map(
            (row) =>
              `<tr>${row
                .map((cell) => `<td>${this.parser.parseInline(cell.tokens)}</td>`)
                .join("")}</tr>`
          )
          .join("");
        return `
<div class="stratum-table-wrap">
  <table class="stratum-table">
    <thead><tr>${header}</tr></thead>
    <tbody>${rows}</tbody>
  </table>
</div>\n`;
      },

      link({ href, title, tokens: linkTokens }) {
        const text = this.parser.parseInline(linkTokens);
        const isExternal = /^https?:\/\//i.test(href);
        const attrs = isExternal
          ? ` target="_blank" rel="noopener noreferrer"`
          : "";
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
        return `<a href="${escapeHtml(href)}"${titleAttr}${attrs}>${text}</a>`;
      },
    },
  });

  const html = markedInstance.parser(tokens);
  return { html, toc };
}
