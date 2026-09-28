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
 * Parses any path string and extracts the final image filename,
 * routing it directly to /sunsets/<filename>
 */
export function normalizeImagePath(rawPath: string | null): string | null {
  if (!rawPath) return null;

  const clean = rawPath.trim().replace(/^["']|["']$/g, "");

  // Match the filename after "sunsets/" or grab any image filename
  const filenameMatch = clean.match(/sunsets\/([^\s\)\'\"]+)/i) || 
                        clean.match(/([^\/\s\)\'\"]+\.(?:jpg|jpeg|png|webp|avif|gif|svg))/i);

  if (filenameMatch) {
    return `/sunsets/${filenameMatch[1]}`;
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

      if (rawContent.charCodeAt(0) === 0xfeff) {
        rawContent = rawContent.slice(1);
      }

      const normalized = rawContent.replace(/\r\n/g, "\n");

      let title = "";
      let date = "";
      let sunsetPhoto = "";
      let body = normalized;

      // Extract Frontmatter
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

      // Extract image URL directly from markdown content: ![alt](url)
      const imgRegex = /!\[.*?\]\((.*?)\)/g;
      const imgMatch = imgRegex.exec(body);
      const rawExtractedPhoto = imgMatch ? imgMatch[1] : sunsetPhoto;
      
      const photo = normalizeImagePath(rawExtractedPhoto);

      // Clean body text for preview cards
      const cleanText = body
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .replace(/^#+\s+/gm, "")
        .replace(/[*_`~]/g, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
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