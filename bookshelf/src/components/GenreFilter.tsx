"use client";

export default function GenreFilter({
  genres,
  selected,
  onToggle,
  onClear,
}: {
  genres: string[];
  selected: Set<string>;
  onToggle: (genre: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
      <span className="shrink-0 font-mono text-[11px] uppercase tracking-wide text-ash">
        Genre
      </span>
      {genres.map((g) => {
        const isOn = selected.has(g);
        return (
          <button
            key={g}
            onClick={() => onToggle(g)}
            className={`shrink-0 rounded-full border px-3 py-1 font-body text-xs transition-colors ${
              isOn
                ? "border-moss bg-moss/20 text-moss"
                : "border-white/10 text-ash hover:border-moss/40 hover:text-parchment"
            }`}
          >
            {g}
          </button>
        );
      })}
      {selected.size > 0 && (
        <button
          onClick={onClear}
          className="shrink-0 font-mono text-[11px] text-rose underline decoration-dotted underline-offset-2 hover:text-rose/80"
        >
          clear
        </button>
      )}
    </div>
  );
}
