"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Book, TYPES, Status } from "@/lib/types";

const GENRE_SUGGESTIONS = [
  "Sci-Fi",
  "Romance",
  "Drama/Literary",
  "Fantasy",
  "Comedy",
  "Crime/Mystery/Thriller",
  "Horror",
  "Science",
  "Architecture",
  "Self Help",
  "War/Tragedy",
  "Action/Adventure",
  "Poetry",
  "Art",
];

function AddForm() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("id");

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [type, setType] = useState<string>(TYPES[0]);
  const [genre, setGenre] = useState<string>(GENRE_SUGGESTIONS[0]);
  const [customGenre, setCustomGenre] = useState("");
  const [status, setStatus] = useState<Status>("RECOMMENDED");
  const [rating, setRating] = useState("8");
  const [review, setReview] = useState("");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(!!editId);

  useEffect(() => {
    if (!editId) return;
    fetch(`/api/books/${editId}`)
      .then((r) => r.json())
      .then((b: Book) => {
        setTitle(b.title);
        setAuthor(b.author || "");
        setType(TYPES.includes(b.type as any) ? b.type : "Other");
        setGenre(GENRE_SUGGESTIONS.includes(b.genre) ? b.genre : "__custom");
        if (!GENRE_SUGGESTIONS.includes(b.genre)) setCustomGenre(b.genre);
        setStatus(b.status);
        setRating(b.rating != null ? String(b.rating) : "8");
        setReview(b.review || "");
        setCoverUrl(b.coverUrl);
        setLoadingExisting(false);
      })
      .catch(() => setLoadingExisting(false));
  }, [editId]);

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      setCoverUrl(data.url);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Cover upload failed.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const finalType = type;
    const finalGenre = genre === "__custom" ? customGenre.trim() : genre;

    if (!title.trim() || !finalType || !finalGenre) {
      setError("Title, type, and genre are required.");
      setSaving(false);
      return;
    }

    const payload = {
      title: title.trim(),
      author: author.trim() || null,
      type: finalType,
      genre: finalGenre,
      status,
      rating: status === "READ" ? rating : null,
      review: review.trim() || null,
      coverUrl,
    };

    const res = await fetch(editId ? `/api/books/${editId}` : "/api/books", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Couldn't save that book.");
    }
  }

  if (loadingExisting) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <p className="font-mono text-sm text-ash">Loading book…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl italic text-parchment">
          {editId ? "Edit book" : "Add a book"}
        </h1>
        <a href="/" className="font-mono text-xs text-ash underline decoration-dotted underline-offset-2 hover:text-parchment">
          ← back to shelf
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="Dune"
          />
        </Field>

        <Field label="Author">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={inputClass}
            placeholder="Frank Herbert"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Type">
            <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>

          <Field label="Genre">
            <select value={genre} onChange={(e) => setGenre(e.target.value)} className={inputClass}>
              {GENRE_SUGGESTIONS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
              <option value="__custom">Other…</option>
            </select>
            {genre === "__custom" && (
              <input
                value={customGenre}
                onChange={(e) => setCustomGenre(e.target.value)}
                placeholder="Custom genre"
                className={`${inputClass} mt-2`}
              />
            )}
          </Field>
        </div>

        <Field label="Status">
          <div className="flex gap-2">
            {(["READING", "RECOMMENDED", "READ"] as Status[]).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-full border px-3 py-1.5 font-body text-sm transition-colors ${
                  status === s
                    ? "border-brass bg-brass text-ink"
                    : "border-white/10 text-ash hover:text-parchment"
                }`}
              >
                {s === "READING" ? "Currently reading" : s === "RECOMMENDED" ? "Recommended" : "Finished"}
              </button>
            ))}
          </div>
        </Field>

        {status === "READ" && (
          <Field label="Rating (0–10)">
            <input
              type="number"
              min={0}
              max={10}
              step={0.5}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className={inputClass}
            />
          </Field>
        )}

        <Field label="Cover image">
          <input type="file" accept="image/*" onChange={handleCoverChange} className="font-body text-sm text-ash" />
          {uploading && <p className="mt-1 font-mono text-xs text-ash">Uploading…</p>}
          {coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="Cover preview" className="mt-3 h-40 w-28 rounded-sm object-cover ring-1 ring-white/10" />
          )}
        </Field>

        <Field label="Review">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={5}
            placeholder="What did you think?"
            className={inputClass}
          />
        </Field>

        {error && <p className="font-body text-sm text-rose">{error}</p>}

        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full rounded-md bg-brass px-4 py-2 font-body text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : editId ? "Save changes" : "Add to shelf"}
        </button>
      </form>
    </main>
  );
}

const inputClass =
  "w-full rounded-md border border-white/10 bg-surface px-3 py-2 font-body text-sm text-parchment outline-none focus:border-brass";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block font-mono text-xs uppercase tracking-wide text-ash">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AddPage() {
  return (
    <Suspense fallback={null}>
      <AddForm />
    </Suspense>
  );
}
