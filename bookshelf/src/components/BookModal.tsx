"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Book, typeColor, STATUS_LABEL } from "@/lib/types";

export default function BookModal({
  book,
  loggedIn,
  onClose,
  onDeleted,
}: {
  book: Book;
  loggedIn: boolean;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const color = typeColor(book.type);

  async function handleDelete() {
    if (!confirm(`Remove "${book.title}" from the shelf?`)) return;
    setDeleting(true);
    const res = await fetch(`/api/books/${book.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      onDeleted(book.id);
      onClose();
    } else {
      alert("Couldn't delete that book. Try again.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-lg bg-surface shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/40 px-2.5 py-1 font-body text-sm text-parchment hover:bg-black/60"
          aria-label="Close"
        >
          ✕
        </button>

        <div
          className="hidden w-48 shrink-0 sm:block"
          style={{
            background: book.coverUrl
              ? undefined
              : `linear-gradient(160deg, ${color}, #14231C)`,
          }}
        >
          {book.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col justify-between p-5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                {book.genre}
              </span>
              <span className="font-display text-2xl italic leading-snug text-white/95">
                {book.title}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-brass">
            {book.type} · {book.genre}
          </p>
          <h2 className="mt-1 font-display text-2xl text-parchment">{book.title}</h2>
          {book.author && (
            <p className="mt-1 font-body text-sm text-ash">by {book.author}</p>
          )}

          <div className="mt-4 flex items-center gap-3">
            <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-parchment/80">
              {STATUS_LABEL[book.status]}
            </span>
            {book.status === "READ" && book.rating != null && (
              <span className="rounded-full bg-brass px-3 py-1 font-mono text-xs font-medium text-ink">
                {book.rating.toFixed(1).replace(/\.0$/, "")} / 10
              </span>
            )}
          </div>

          {book.review && (
            <div className="mt-5">
              <p className="mb-1 font-mono text-[11px] uppercase tracking-wide text-ash">
                Review
              </p>
              <p className="whitespace-pre-wrap font-body text-sm leading-relaxed text-parchment/90">
                {book.review}
              </p>
            </div>
          )}

          {loggedIn && (
            <div className="mt-6 flex gap-3 border-t border-white/10 pt-4">
              <button
                onClick={() => router.push(`/add?id=${book.id}`)}
                className="rounded-md border border-brass/50 px-3 py-1.5 font-body text-sm text-brass hover:bg-brass/10"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-md border border-rose/50 px-3 py-1.5 font-body text-sm text-rose hover:bg-rose/10 disabled:opacity-50"
              >
                {deleting ? "Removing…" : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
