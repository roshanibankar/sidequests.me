"use client";

import { useMemo } from "react";
import { Book } from "@/lib/types";
import SpineRow from "./SpineRow";

// Books per row. Tuned so a row fills roughly one desktop screen width
// without needing to scroll on a typical monitor.
const ROW_SIZE = 18;

export default function MosaicWall({
  books,
  onSelect,
}: {
  books: Book[];
  onSelect: (book: Book) => void;
}) {
  const rows = useMemo(() => {
    const chunks: Book[][] = [];
    for (let i = 0; i < books.length; i += ROW_SIZE) {
      chunks.push(books.slice(i, i + ROW_SIZE));
    }
    return chunks;
  }, [books]);

  if (books.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 px-1">
        <h2 className="font-display text-lg italic text-brass">The whole shelf</h2>
        <span className="font-mono text-xs text-ash">{books.length}</span>
        <span className="font-mono text-[10px] text-ash/70">
          · <span className="text-moss">green bar</span> = reading ·{" "}
          <span className="text-brass">gold number</span> = your rating
        </span>
      </div>

      <div className="space-y-2">
        {rows.map((row, i) => (
          <SpineRow key={i} books={row} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
