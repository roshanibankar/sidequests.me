"use client";

import { Book, typeColor } from "@/lib/types";
import { spineWidth, spineHeight, spineTilt, shadeHex } from "@/lib/spine";

export default function BookSpine({
  book,
  onClick,
}: {
  book: Book;
  onClick: () => void;
}) {
  const base = typeColor(book.type);
  const color = shadeHex(base, book.id);
  const width = spineWidth(book.id);
  const height = spineHeight(book.id);
  const tilt = spineTilt(book.id);

  return (
    <button
      onClick={onClick}
      className="group relative shrink-0 self-end transition-transform duration-150 ease-out hover:z-10 hover:-translate-y-3 focus-visible:z-10 focus-visible:-translate-y-3"
      style={{
        width,
        height,
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        transformOrigin: "bottom center",
      }}
      aria-label={`${book.title}${book.author ? ` by ${book.author}` : ""}`}
      title={`${book.title}${book.author ? ` — ${book.author}` : ""}`}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-[1px] shadow-spine ring-1 ring-black/40 transition-shadow duration-150 group-hover:shadow-shelf"
        style={{
          background: book.coverUrl
            ? undefined
            : `linear-gradient(90deg, rgba(0,0,0,0.25), transparent 6%, transparent 94%, rgba(255,255,255,0.08)), linear-gradient(180deg, ${color}, ${color})`,
        }}
      >
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center overflow-hidden px-0.5 py-2">
            <span
              className="block max-h-full whitespace-nowrap font-display text-[11px] leading-none tracking-wide text-white/95"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {book.title}
              {book.author ? (
                <span className="text-white/60"> · {book.author}</span>
              ) : null}
            </span>
          </div>
        )}

        {book.status === "READING" && (
          <span className="absolute inset-x-0 top-0 h-1.5 bg-moss" />
        )}
        {book.status === "READ" && book.rating != null && (
          <span className="absolute inset-x-0 top-0 flex justify-center bg-brass/90 py-0.5 font-mono text-[8px] font-medium leading-none text-ink">
            {book.rating.toFixed(1).replace(/\.0$/, "")}
          </span>
        )}
      </div>
    </button>
  );
}
