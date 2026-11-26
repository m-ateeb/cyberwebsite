import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const notesDir = path.join(process.cwd(), "src", "content", "notes");
const files = fs
  .readdirSync(notesDir)
  .filter((f) => /\.(md|mdx)$/i.test(f));

const slugs = new Set();
let errors = 0;

for (const file of files) {
  const fullPath = path.join(notesDir, file);
  const { data } = matter(fs.readFileSync(fullPath, "utf8"));
  const required = ["title", "description", "category", "publishedAt", "difficulty"];

  for (const field of required) {
    if (!data[field]) {
      console.error(`[ERROR] ${file}: missing required frontmatter field "${field}"`);
      errors++;
    }
  }

  const slug = data.slug || file.replace(/\.(md|mdx)$/i, "");
  if (slugs.has(slug)) {
    console.error(`[ERROR] ${file}: duplicate slug "${slug}"`);
    errors++;
  }
  slugs.add(slug);
}

if (errors > 0) {
  console.error(`\nContent validation failed with ${errors} error(s).`);
  process.exit(1);
}

console.log(`Validated ${files.length} technical note(s) successfully.`);
