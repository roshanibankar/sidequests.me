"use client";

import { Book } from "@/lib/types";
import BookSpine from "./BookSpine";

export default function SpineRow({
  books,
  onSelect,
}: {
  books: Book[];
  onSelect: (book: Book) => void;
}) {
  return (
    <div className="shelf-scroll overflow-x-auto pb-2">
      <div className="flex w-max flex-col">
        <div className="flex items-end gap-px pl-1 pr-6 pt-4">
          {books.map((book) => (
            <BookSpine key={book.id} book={book} onClick={() => onSelect(book)} />
          ))}
        </div>
        <div className="ml-1 mr-6 h-3 rounded-b-sm bg-gradient-to-b from-shelf to-shelfDark shadow-shelf" />
      </div>
    </div>
  );
}
