import fs from "node:fs";
import path from "node:path";

export type Musing = {
  slug: string;
  title: string;
  date: string;
  location?: string;
  sunsetPhoto: string;
  excerpt: string;
  content: string;
};

const DEFAULT_PHOTOS = [
  "/sunsets/sunset1.jpg",
  "/sunsets/sunset2.jpg",
  "/sunsets/sunset3.jpg",
];

export function getAllMusings(): Musing[] {
  const directory = path.join(process.cwd(), "public", "musings");

  if (!fs.existsSync(directory)) return [];

  const files = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md"));

  return files
    .map((filename, index) => {
      const slug = filename.replace(/\.md$/, "");
      const rawContent = fs.readFileSync(path.join(directory, filename), "utf8");

      // Normalize line endings (\r\n -> \n)
      const normalized = rawContent.replace(/\r\n/g, "\n").trim();

      const frontmatterMatch = normalized.match(/^---\n([\s\S]*?)\n---\n?/);
      const metadata: Record<string, string> = {};

      if (frontmatterMatch) {
        frontmatterMatch[1].split("\n").forEach((line) => {
          const colonIndex = line.indexOf(":");
          if (colonIndex !== -1) {
            const key = line.slice(0, colonIndex).trim();
            const value = line
              .slice(colonIndex + 1)
              .trim()
              .replace(/^["']|["']$/g, "");
            metadata[key] = value;
          }
        });
      }

      const body = normalized.replace(frontmatterMatch?.[0] ?? "", "").trim();

      const cleanText = body
        .replace(/#+\s/g, "")
        .replace(/[*_`~]/g, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .trim();

      const formattedTitle = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return {
        slug,
        title: metadata.title || formattedTitle,
        date: metadata.date || "Undated",
        location: metadata.location,
        sunsetPhoto:
          metadata.sunsetPhoto || DEFAULT_PHOTOS[index % DEFAULT_PHOTOS.length],
        excerpt:
          cleanText.length > 180
            ? cleanText.slice(0, 180) + "..."
            : cleanText,
        content: body,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getMusingBySlug(slug: string): Musing | null {
  const musings = getAllMusings();
  return musings.find((m) => m.slug === slug) || null;
}