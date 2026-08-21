"use client";

import { Book } from "@/lib/types";
import SpineRow from "./SpineRow";

export default function Shelf({
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
  if (books.length === 0) return null;

  return (
    <section className="mb-14">
      <div className="mb-3 flex items-baseline gap-2 px-1">
        <h2 className="font-display text-lg italic text-brass">{label}</h2>
        <span className="font-mono text-xs text-ash">{count}</span>
      </div>

      <SpineRow books={books} onSelect={onSelect} />
    </section>
  );
}
