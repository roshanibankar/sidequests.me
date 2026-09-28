import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMusingBySlug, normalizeImagePath } from "@/lib/musings";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Parses inline markdown: **bold**, *italic*, ***bold italic***
 */
function parseInlineMarkdown(text: string) {
  // Regex matches ***bold italic***, **bold**, or *italic*
  const parts = text.split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("***") && part.endsWith("***")) {
      return <strong key={index}><em>{part.slice(3, -3)}</em></strong>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function FormattedMarkdown({ content }: { content: string }) {
  // Remove the first image line from body text since it's displayed in the Polaroid header
  const bodyWithoutFirstImage = content.replace(/!\[.*?\]\((.*?)\)\n?/, "").trim();

  // Separate content into blocks
  const blocks = bodyWithoutFirstImage.split(/\n\s*\n/);

  return (
    <div className="space-y-6 font-serif text-stone-800 leading-relaxed text-lg md:text-xl">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        // Headers
        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={idx} className="text-3xl md:text-4xl font-bold font-handwritten text-stone-900 mt-6 mb-2">
              {parseInlineMarkdown(trimmed.replace(/^#\s+/, ""))}
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-2xl md:text-3xl font-bold font-handwritten text-stone-900 mt-5 mb-2">
              {parseInlineMarkdown(trimmed.replace(/^##\s+/, ""))}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-xl md:text-2xl font-bold text-stone-900 mt-4 mb-2">
              {parseInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
            </h3>
          );
        }

        // Inline images inside body
        const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imgMatch) {
          const alt = imgMatch[1];
          const src = normalizeImagePath(imgMatch[2]);
          return src ? (
            <div key={idx} className="relative h-72 md:h-96 w-full rounded-sm overflow-hidden my-6 border border-stone-200 shadow-md">
              <Image src={src} alt={alt} fill unoptimized className="object-cover" />
            </div>
          ) : null;
        }

        // Paragraphs & poem line breaks
        const lines = trimmed.split("\n");
        return (
          <p key={idx} className="leading-relaxed">
            {lines.map((line, lIdx) => (
              <span key={lIdx}>
                {parseInlineMarkdown(line)}
                {lIdx < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default async function EntryPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getMusingBySlug(slug);

  if (!entry) notFound();

  return (
    <main className="min-h-screen py-12 px-4 md:px-8 max-w-3xl mx-auto">
      <Link
        href="/"
        className="font-handwritten text-2xl text-amber-200/80 hover:text-amber-100 transition-colors mb-8 inline-block"
      >
        ← back to pinboard
      </Link>

      <article className="relative bg-[#fefcf9] text-stone-900 p-6 md:p-10 rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-stone-200">
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-md">
          <svg width="32" height="60" viewBox="0 0 28 54" fill="none">
            <path
              d="M10 44V12C10 7.57873 13.5787 4 18 4C22.4213 4 26 7.57873 26 12V38C26 44.6274 20.6274 50 14 50C7.37258 50 2 44.6274 2 38V16"
              stroke="url(#detail_clip)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="detail_clip" x1="0" y1="0" x2="28" y2="54">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="border-b border-stone-200 pb-4 mb-6 flex justify-between items-baseline">
          <h1 className="font-handwritten text-4xl md:text-5xl font-bold text-stone-900">
            {entry.title}
          </h1>
          <span className="font-mono text-xs text-stone-400">{entry.date}</span>
        </div>

        {entry.photo && (
          <div className="relative h-80 md:h-[450px] w-full rounded-sm overflow-hidden shadow-inner mb-8 bg-stone-900">
            <Image
              src={entry.photo}
              alt={entry.title}
              fill
              unoptimized
              className="object-cover"
              priority
            />
          </div>
        )}

        <FormattedMarkdown content={entry.content} />
      </article>
    </main>
  );
}