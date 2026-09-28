import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMusingBySlug, normalizeImagePath } from "@/lib/musings";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function parseInlineMarkdown(text: string) {
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
  const bodyWithoutFirstImage = content.replace(/!\[.*?\]\((.*?)\)\n?/, "").trim();
  const blocks = bodyWithoutFirstImage.split(/\n\s*\n/);

  return (
    <div className="space-y-6 font-serif text-[#3d3127] leading-relaxed text-lg md:text-xl max-w-4xl mx-auto">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();

        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={idx} className="text-3xl md:text-4xl font-bold font-handwritten text-[#2c221a] mt-6 mb-2">
              {parseInlineMarkdown(trimmed.replace(/^#\s+/, ""))}
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-2xl md:text-3xl font-bold font-handwritten text-[#2c221a] mt-5 mb-2">
              {parseInlineMarkdown(trimmed.replace(/^##\s+/, ""))}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-xl md:text-2xl font-bold text-[#2c221a] mt-4 mb-2">
              {parseInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
            </h3>
          );
        }

        const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imgMatch) {
          const alt = imgMatch[1];
          const src = normalizeImagePath(imgMatch[2]);
          return src ? (
            <div key={idx} className="relative h-80 md:h-[500px] w-full rounded-sm overflow-hidden my-6 border border-[#e2d5c3] shadow-md">
              <Image src={src} alt={alt} fill unoptimized className="object-cover" />
            </div>
          ) : null;
        }

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
    <main className="min-h-screen w-full py-12 px-4 md:px-12 bg-[#f4ebd0] text-[#3d3127] relative selection:bg-[#d97706]/20">
      {/* Aged Parchment Vignette & Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(70,53,38,0.12)_100%)]" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <Link
            href="/"
            className="font-handwritten text-2xl text-[#856348] hover:text-[#544133] transition-colors drop-shadow-sm"
          >
            ← back to pinboard
          </Link>

          {/* Quill, Inkwell & Sunset Horizon Illustration */}
          <div className="flex items-center gap-4 opacity-85 text-[#544133]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <path d="M12 21a4 4 0 0 1-4-4v-2h8v2a4 4 0 0 1-4 4z" fill="currentColor" fillOpacity="0.15" />
              <path d="M9 15h6v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1z" />
              <path d="M7 15h10" />
              <path d="M19 2c-3 1-7 4-9 8s-3 7-3 7l2 1s2-3 5-7 5-8 5-9z" fill="currentColor" fillOpacity="0.1" />
              <path d="M19 2s-1 4-5 9-7 7-7 7" />
              <path d="M14 7c-1.5 2-3 4-4 6" />
            </svg>

            <span className="w-1.5 h-1.5 rounded-full bg-[#856348]/60" />

            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <circle cx="12" cy="10" r="4" fill="#d97706" fillOpacity="0.3" stroke="#b45309" />
              <path d="M12 2v2" />
              <path d="M4.93 4.93l1.41 1.41" />
              <path d="M2 10h2" />
              <path d="M20 10h2" />
              <path d="M19.07 4.93l-1.41 1.41" />
              <path d="M2 18h20" strokeWidth="1.5" />
              <path d="M3 21c3 0 3-2 6-2s3 2 6 2 3-2 6-2" />
            </svg>
          </div>
        </div>

        <article className="relative bg-[#fefcf9] text-[#3d3127] p-8 md:p-14 rounded-sm shadow-[0_20px_60px_rgba(61,49,39,0.3)] border border-[#e2d5c3]">
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
                  <stop offset="0%" stopColor="#d1c4b2" />
                  <stop offset="50%" stopColor="#8c7863" />
                  <stop offset="100%" stopColor="#4f4031" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="border-b border-[#e2d5c3] pb-6 mb-8 flex justify-between items-baseline max-w-4xl mx-auto">
            <h1 className="font-handwritten text-4xl md:text-6xl font-bold text-[#2c221a]">
              {entry.title}
            </h1>
            <span className="font-mono text-sm text-[#8c7863]">{entry.date}</span>
          </div>

          {entry.photo && (
            <div className="relative h-96 md:h-[550px] w-full rounded-sm overflow-hidden shadow-inner mb-10 bg-[#181512] max-w-4xl mx-auto">
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
      </div>
    </main>
  );
}