import fs from "node:fs";
import path from "node:path";

export type Musing = {
  slug: string;
  title: string;
  date: string;
  photo: string | null;
  excerpt: string;
  content: string;
};

/**
 * Robustly extracts the image filename and maps it to /sunsets/<filename>
 * Handles any prefix like /sidequests.me/musingsoversunsets/ or relative paths.
 */
export function normalizeImagePath(rawPath: string | null): string | null {
  if (!rawPath) return null;

  const clean = rawPath.trim().replace(/^["']|["']$/g, "");

  // Match any file extension inside or after a 'sunsets/' directory
  const sunsetMatch = clean.match(/sunsets\/([^\s\)\'\"]+)/i);
  if (sunsetMatch) {
    return `/sunsets/${sunsetMatch[1]}`;
  }

  // Fallback: match any standalone filename with an image extension
  const fileMatch = clean.match(/([^\/\s\)\'\"]+\.(?:jpg|jpeg|png|webp|avif|gif|svg))/i);
  if (fileMatch) {
    return `/sunsets/${fileMatch[1]}`;
  }

  return null;
}

export function getAllMusings(): Musing[] {
  const directory = path.join(process.cwd(), "public", "musings");

  if (!fs.existsSync(directory)) return [];

  const files = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fullPath = path.join(directory, filename);
      let rawContent = fs.readFileSync(fullPath, "utf8");

      // Strip UTF-8 BOM byte if present
      if (rawContent.charCodeAt(0) === 0xfeff) {
        rawContent = rawContent.slice(1);
      }

      // Normalize line endings to \n
      const normalized = rawContent.replace(/\r\n/g, "\n");

      let title = "";
      let date = "";
      let sunsetPhoto = "";
      let body = normalized;

      // Extract Frontmatter cleanly
      const fmMatch = normalized.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
      if (fmMatch) {
        body = normalized.slice(fmMatch[0].length).trim();
        const fmLines = fmMatch[1].split("\n");
        for (const line of fmLines) {
          const colonIdx = line.indexOf(":");
          if (colonIdx !== -1) {
            const key = line.slice(0, colonIdx).trim().toLowerCase();
            const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
            if (key === "title") title = val;
            if (key === "date") date = val;
            if (key === "sunsetphoto" || key === "photo") sunsetPhoto = val;
          }
        }
      }

      // Extract first Markdown image: ![alt](url)
      const imgMatch = body.match(/!\[.*?\]\((.*?)\)/);
      const rawExtractedPhoto = imgMatch ? imgMatch[1] : sunsetPhoto;
      const photo = normalizeImagePath(rawExtractedPhoto);

      // Clean body text for card previews
      const cleanText = body
        .replace(/!\[.*?\]\(.*?\)/g, "") // remove images
        .replace(/^#+\s+/gm, "")         // remove headers
        .replace(/[*_`~]/g, "")           // remove formatting symbols
        .replace(/\[(.*?)\]\(.*?\)/g, "$1") // convert links to text
        .trim();

      const formattedTitle = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return {
        slug,
        title: title || formattedTitle,
        date: date || "Undated",
        photo,
        excerpt: cleanText.length > 120 ? cleanText.slice(0, 120) + "..." : cleanText,
        content: body,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getMusingBySlug(slug: string): Musing | null {
  const musings = getAllMusings();
  return musings.find((m) => m.slug === slug) || null;
}