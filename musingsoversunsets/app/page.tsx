import Image from "next/image";
import Link from "next/link";
import { getAllMusings } from "@/lib/musings";

export default function Home() {
  const entries = getAllMusings();
  const rotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-3"];

  return (
    <main className="min-h-screen py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      <header className="text-center mb-16 space-y-3">
        <h1 className="text-4xl md:text-6xl font-light italic text-stone-100 font-serif tracking-tight">
          musings over sunsets
        </h1>
        <p className="font-handwritten text-2xl text-amber-200/80">
          pinned snapshots & field notes
        </p>
      </header>

      {entries.length === 0 ? (
        <div className="text-center text-stone-400 font-handwritten text-2xl py-12">
          No polaroids found in public/musings/
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-start">
          {entries.map((entry, index) => {
            const rotationClass = rotations[index % rotations.length];

            return (
              <div key={entry.slug} className="relative pt-6 group">
                {/* Paperclip */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none drop-shadow-md">
                  <svg width="28" height="54" viewBox="0 0 28 54" fill="none">
                    <path
                      d="M10 44V12C10 7.57873 13.5787 4 18 4C22.4213 4 26 7.57873 26 12V38C26 44.6274 20.6274 50 14 50C7.37258 50 2 44.6274 2 38V16"
                      stroke="url(#clip_grad)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="clip_grad" x1="0" y1="0" x2="28" y2="54">
                        <stop offset="0%" stopColor="#e2e8f0" />
                        <stop offset="50%" stopColor="#94a3b8" />
                        <stop offset="100%" stopColor="#475569" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <Link href={`/musings/${entry.slug}`}>
                  <article
                    className={`bg-[#fefcf9] text-stone-900 p-4 pb-6 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-stone-200 transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-[0_20px_40px_rgba(251,146,60,0.2)] ${rotationClass}`}
                  >
                    <div className="relative aspect-square w-full bg-stone-900 rounded-sm overflow-hidden shadow-inner mb-4 flex items-center justify-center">
                      {entry.photo ? (
                        <Image
                          src={entry.photo}
                          alt={entry.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-stone-500 font-handwritten text-lg px-4 text-center">
                          [ No image linked ]
                        </div>
                      )}
                    </div>

                    <div className="text-center px-1">
                      <h2 className="font-handwritten text-2xl font-bold text-stone-800 line-clamp-1 leading-snug">
                        {entry.title}
                      </h2>
                      <span className="font-mono text-[10px] text-stone-400 uppercase tracking-wider block mt-1">
                        {entry.date}
                      </span>
                    </div>
                  </article>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}