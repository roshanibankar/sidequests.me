"use client";

import { Book, typeColor } from "@/lib/types";
import { shadeHex } from "@/lib/spine";

export default function HorizontalStackShelf({
  label,
  count,
  books,
  onSelect,
}: {
  label: string;
  count: number;
  books: Book[];
  onSelect: (book: Book) => void;
}) {
  // Exclude READING and RECOMMENDED books from this view
  const readBooks = books.filter((b) => b.status === "READ");

  if (readBooks.length === 0) return null;

  // Group read books into stacks of 3 books per pile
  const stackSize = 3;
  const stacks: Book[][] = [];
  for (let i = 0; i < readBooks.length; i += stackSize) {
    stacks.push(readBooks.slice(i, i + stackSize));
  }

  // Break stacks into rows of 4 stacks per shelf plank on desktop (lg:grid-cols-4)
  const stacksPerRow = 4;
  const rowsOfStacks: Book[][][] = [];
  for (let i = 0; i < stacks.length; i += stacksPerRow) {
    rowsOfStacks.push(stacks.slice(i, i + stacksPerRow));
  }

  return (
    <section className="mb-14">
      <div className="mb-3 flex items-baseline gap-2 px-1">
        <h2 className="font-display text-lg italic text-brass">{label}</h2>
        <span className="font-mono text-xs text-ash">({readBooks.length})</span>
      </div>

      <div className="space-y-10 pt-4">
        {rowsOfStacks.map((rowStacks, rowIdx) => (
          <div key={rowIdx} className="relative">
            {/* Grid set to 2 columns on mobile/tablet, expanding to 4 columns on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 px-2 pb-1">
              {rowStacks.map((stack, stackIdx) => (
                <div key={stackIdx} className="flex flex-col-reverse items-center justify-start w-full">
                  {stack.map((book, bookIdx) => {
                    const base = typeColor(book.type);
                    const color = shadeHex(base, book.id);

                    return (
                      <div
                        key={book.id}
                        onClick={() => onSelect(book)}
                        className="group relative cursor-pointer transition-transform duration-150 ease-out hover:-translate-y-1 w-full h-9 mb-[-1px] flex items-center justify-between px-3 sm:px-4 select-none rounded-[1px] shadow-spine ring-1 ring-black/40 overflow-hidden"
                        style={{
                          zIndex: stack.length - bookIdx,
                          background: `linear-gradient(0deg, rgba(0,0,0,0.25), transparent 15%, transparent 85%, rgba(255,255,255,0.08)), linear-gradient(90deg, ${color}, ${color})`,
                        }}
                        title={`${book.title}${book.author ? ` — ${book.author}` : ""}`}
                      >
                        {/* Rating badge pinned to the top-left edge */}
                        {book.rating != null && (
                          <span className="absolute top-0 left-0 bg-brass px-1.5 py-0.5 font-mono text-[9px] font-bold leading-none text-ink shadow-sm z-10 rounded-br-sm">
                            {book.rating.toFixed(1).replace(/\.0$/, "")}
                          </span>
                        )}

                        {/* Book Title and Author */}
                        <span className="font-display text-[10px] sm:text-[11px] leading-none tracking-wide text-white/95 truncate w-full text-center pl-3 sm:pl-4">
                          {book.title}
                          {book.author ? (
                            <span className="text-white/60"> · {book.author}</span>
                          ) : null}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Continuous brown wooden plank under this specific row of stacks */}
            <div className="h-3 w-full rounded-b-sm bg-gradient-to-b from-shelf to-shelfDark shadow-shelf" />
          </div>
        ))}
      </div>
    </section>
  );
}