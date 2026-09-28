import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMusingBySlug } from "@/lib/musings";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EntryPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getMusingBySlug(slug);

  if (!entry) notFound();

  return (
    <main className="min-h-screen py-12 px-4 md:px-8 max-w-3xl mx-auto">
      {/* Back Button */}
      <Link
        href="/"
        className="font-[family-name:var(--font-caveat)] text-2xl text-amber-200/80 hover:text-amber-100 transition-colors mb-8 inline-block"
      >
        ← back to journal
      </Link>

      {/* Steel-Bound Diary Page */}
      <article className="relative bg-[#fbfbf8] text-stone-900 rounded-r-2xl rounded-l-sm shadow-2xl border-l-[12px] border-stone-300 p-6 md:p-12 pl-10 md:pl-16">
        {/* Steel Binding Rings */}
        <div className="absolute -left-5 top-0 bottom-0 flex flex-col justify-around py-8 z-20 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-9 h-3.5 rounded-full bg-gradient-to-r from-slate-400 via-slate-100 to-slate-600 shadow-md border border-slate-400/60 -rotate-3"
            />
          ))}
        </div>

        {/* Punch Holes */}
        <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-around py-8 z-10 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-stone-900/80 shadow-inner"
            />
          ))}
        </div>

        {/* Metadata Header */}
        <div className="flex justify-between items-baseline border-b border-stone-200 pb-3 mb-6 font-[family-name:var(--font-caveat)] text-2xl text-amber-800">
          <span>{entry.date}</span>
          {entry.location && <span>📍 {entry.location}</span>}
        </div>

        {/* Title */}
        {entry.title && (
          <h1 className="text-4xl font-serif italic text-stone-900 mb-6">
            {entry.title}
          </h1>
        )}

        {/* Sunset Photo */}
        {entry.sunsetPhoto && (
          <div className="relative h-80 md:h-[450px] w-full rounded-lg overflow-hidden shadow-md mb-8 border border-stone-200">
            <Image
              src={entry.sunsetPhoto}
              alt={entry.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Full Un-truncated Text */}
        <div className="pt-2">
          <p className="text-xl md:text-2xl font-serif text-stone-800 leading-relaxed font-light whitespace-pre-line">
            {entry.content}
          </p>
        </div>
      </article>
    </main>
  );
}
