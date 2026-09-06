"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Book, TYPES } from "@/lib/types";
import TypeTabs from "@/components/TypeTabs";
import GenreFilter from "@/components/GenreFilter";
import Shelf from "@/components/Shelf";
import MosaicWall from "@/components/MosaicWall";
import BookModal from "@/components/BookModal";

type View = "wall" | "shelves";

export default function HomePage() {
  const [books, setBooks] = useState<Book[] | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [openBook, setOpenBook] = useState<Book | null>(null);
  const [view, setView] = useState<View>("wall");

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then(setBooks)
      .catch(() => setBooks([]));
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setLoggedIn(!!d.loggedIn))
      .catch(() => {});
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/logout", { method: "POST" });
      setLoggedIn(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  // Reset genre selection whenever the type changes.
  function changeType(type: string | null) {
    setActiveType(type);
    setSelectedGenres(new Set());
  }

  function toggleGenre(genre: string) {
    setSelectedGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) next.delete(genre);
      else next.add(genre);
      return next;
    });
  }

  // Fixed set of 5 types shown as tabs regardless of how many books exist
  // yet — the categories are the taxonomy, not derived from data.
  const typesPresent = [...TYPES];

  const genresForType = useMemo(() => {
    if (!books || !activeType) return [];
    const set = new Set(
      books.filter((b) => b.type === activeType).map((b) => b.genre)
    );
    return [...set].sort();
  }, [books, activeType]);

  const filtered = useMemo(() => {
    if (!books) return [];
    const query = searchQuery.toLowerCase().trim();

    return books.filter((b) => {
      if (activeType && b.type !== activeType) return false;
      if (selectedGenres.size > 0 && !selectedGenres.has(b.genre)) return false;

      if (query) {
        const matchesTitle = b.title.toLowerCase().includes(query);
        const matchesAuthor = b.author?.toLowerCase().includes(query) ?? false;
        const matchesGenre = b.genre.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAuthor && !matchesGenre) return false;
      }

      return true;
    });
  }, [books, activeType, selectedGenres, searchQuery]);

  const reading = filtered.filter((b) => b.status === "READING");
  const recommended = filtered.filter((b) => b.status === "RECOMMENDED");
  
  // Finished books sorted by rating for the wall view
  const readForWall = filtered
    .filter((b) => b.status === "READ")
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  // Finished books sorted strictly by recently added order (createdAt descending)
  const readForShelves = filtered
    .filter((b) => b.status === "READ")
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

  // Wall view shows everything together: reading first, then recommended, then finished (highest-rated first)
  const wallOrder = [...reading, ...recommended, ...readForWall];

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      <header className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl italic text-parchment sm:text-5xl">
            My Bookshelf
          </h1>
          <p className="mt-2 max-w-md font-body text-sm text-ash">
            Digital bookshelf until I build my own physical one. Cause the stories we love best do live in us forever!
            Browse by type, then narrow by genre. View on Desktop for better experience.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search title, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-md border border-white/10 bg-surface px-3 py-1.5 font-body text-xs text-parchment outline-none focus:border-brass placeholder:text-ash"
          />

          {loggedIn ? (
            <>
              <Link
                href="/add"
                className="shrink-0 rounded-md border border-brass/60 px-4 py-1.5 font-body text-sm text-brass transition-colors hover:bg-brass/10"
              >
                + Add a book
              </Link>
              <button
                onClick={handleLogout}
                className="shrink-0 rounded-md border border-ash/40 px-4 py-1.5 font-body text-sm text-ash transition-colors hover:bg-ash/10 hover:text-parchment"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="shrink-0 rounded-md border border-brass/60 px-4 py-1.5 font-body text-sm text-brass transition-colors hover:bg-brass/10"
            >
              Log in
            </Link>
          )}
        </div>
      </header>

      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TypeTabs types={typesPresent} active={activeType} onChange={changeType} />
          <div className="flex shrink-0 gap-1 rounded-full border border-white/10 bg-surface p-1">
            <ViewButton label="Wall" isActive={view === "wall"} onClick={() => setView("wall")} />
            <ViewButton label="Shelves" isActive={view === "shelves"} onClick={() => setView("shelves")} />
          </div>
        </div>
        {activeType && genresForType.length > 0 && (
          <GenreFilter
            genres={genresForType}
            selected={selectedGenres}
            onToggle={toggleGenre}
            onClear={() => setSelectedGenres(new Set())}
          />
        )}
      </div>

      {books === null && (
        <p className="font-mono text-sm text-ash">Loading the shelf…</p>
      )}

      {books !== null && filtered.length === 0 && (
        <p className="font-mono text-sm text-ash">
          Nothing on the shelf matches that filter yet.
        </p>
      )}

      {view === "wall" ? (
        <MosaicWall books={wallOrder} onSelect={setOpenBook} />
      ) : (
        <>
          <Shelf
            label="Currently reading"
            count={reading.length}
            books={reading}
            onSelect={setOpenBook}
          />
          <Shelf
            label="Recommended"
            count={recommended.length}
            books={recommended}
            onSelect={setOpenBook}
          />
          <Shelf
            label="Recently finished"
            count={readForShelves.length}
            books={readForShelves}
            onSelect={setOpenBook}
          />
        </>
      )}

      {openBook && (
        <BookModal
          book={openBook}
          loggedIn={loggedIn}
          onClose={() => setOpenBook(null)}
          onDeleted={(id) =>
            setBooks((prev) => (prev ? prev.filter((b) => b.id !== id) : prev))
          }
        />
      )}
    </main>
  );
}

function ViewButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 font-mono text-xs transition-colors ${
        isActive ? "bg-brass text-ink" : "text-ash hover:text-parchment"
      }`}
    >
      {label}
    </button>
  );
}