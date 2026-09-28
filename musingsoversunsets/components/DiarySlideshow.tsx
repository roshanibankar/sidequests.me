"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Musing } from "@/lib/musings";

export default function DiarySlideshow({ entries }: { entries: Musing[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!entries || entries.length === 0) {
    return (
      <main className="min-h-screen py-16 px-4 max-w-4xl mx-auto text-center text-stone-300 font-[family-name:var(--font-caveat)] text-2xl">
        No journal entries found in public/musings/
      </main>
    );
  }

  const currentEntry = entries[currentIndex];

  const handleNext = () => {
    if (currentIndex < entries.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4 md:px-8 max-w-4xl mx-auto flex flex-col justify-between">
      {/* Journal Header */}
      <header className="text-center mb-10 space-y-2">
        <h1 className="text-4xl md:text-5xl font-light italic tracking-wide text-stone-100">
          musings over sunsets
        </h1>
        <p className="font-[family-name:var(--font-caveat)] text-xl text-stone-400">
          a steel-bound personal journal ~
        </p>
      </header>

      {/* Steel-Bound Diary Page */}
      <article className="relative bg-[#fbfbf8] text-stone-900 rounded-r-2xl rounded-l-sm shadow-2xl border-l-[12px] border-stone-300 p-6 md:p-12 pl-10 md:pl-16 transition-all duration-300 min-h-[580px] flex flex-col justify-between">
        
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

        <div>
          {/* Header Metadata */}
          <div className="flex justify-between items-baseline border-b border-stone-200 pb-3 mb-6 font-[family-name:var(--font-caveat)] text-2xl text-amber-800">
            <span>{currentEntry.date}</span>
            <div className="flex items-center gap-4">
              {currentEntry.location && <span>📍 {currentEntry.location}</span>}
              <span className="text-stone-400 text-lg">
                [{currentIndex + 1} / {entries.length}]
              </span>
            </div>
          </div>

          {/* Title */}
          {currentEntry.title && (
            <h2 className="text-3xl font-serif italic text-stone-900 mb-6">
              <Link
                href={`/musings/${currentEntry.slug}`}
                className="hover:underline"
              >
                {currentEntry.title}
              </Link>
            </h2>
          )}

          {/* Sunset Photo */}
          <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden shadow-md mb-6 border border-stone-200">
            <Link href={`/musings/${currentEntry.slug}`}>
              <Image
                src={currentEntry.sunsetPhoto}
                alt={currentEntry.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
            </Link>
          </div>

          {/* Musing Text Preview */}
          <p className="text-lg md:text-xl font-serif text-stone-800 leading-relaxed font-light line-clamp-3">
            {currentEntry.excerpt}
          </p>
        </div>

        {/* Page Flip Controls & Link */}
        <div className="mt-8 pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-[family-name:var(--font-caveat)] text-2xl">
          <Link
            href={`/musings/${currentEntry.slug}`}
            className="text-amber-800 hover:text-amber-950 transition-colors flex items-center gap-1 group"
          >
            read full musing <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-4 py-1 rounded-full border border-stone-300 transition-all ${
                currentIndex === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-amber-100 hover:border-amber-800 text-amber-900 cursor-pointer"
              }`}
            >
              ← Previous Page
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === entries.length - 1}
              className={`px-4 py-1 rounded-full border border-stone-300 transition-all ${
                currentIndex === entries.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-amber-100 hover:border-amber-800 text-amber-900 cursor-pointer"
              }`}
            >
              Flip Page →
            </button>
          </div>
        </div>
      </article>
    </main>
  );
}