import Image from "next/image";
import Link from "next/link";
import { getAllMusings } from "@/lib/musings";

export default function Home() {
  const entries = getAllMusings();
  const rotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-3"];

  return (
    <main className="min-h-screen w-full py-16 px-4 md:px-12 bg-[#f4ebd0] text-[#3d3127] relative selection:bg-[#d97706]/20">
      {/* Aged Parchment Vignette & Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(70,53,38,0.12)_100%)]" />

      {/* Main Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto">
        <header className="text-center mb-16 space-y-3 flex flex-col items-center">
          {/* Quill, Inkwell & Sunset Horizon Illustration */}
          <div className="flex items-center justify-center gap-4 mb-2 opacity-85 text-[#544133]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
              <path d="M12 21a4 4 0 0 1-4-4v-2h8v2a4 4 0 0 1-4 4z" fill="currentColor" fillOpacity="0.15" />
              <path d="M9 15h6v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1z" />
              <path d="M7 15h10" />
              <path d="M19 2c-3 1-7 4-9 8s-3 7-3 7l2 1s2-3 5-7 5-8 5-9z" fill="currentColor" fillOpacity="0.1" />
              <path d="M19 2s-1 4-5 9-7 7-7 7" />
              <path d="M14 7c-1.5 2-3 4-4 6" />
            </svg>

            <span className="w-1.5 h-1.5 rounded-full bg-[#856348]/60" />

            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
              <circle cx="12" cy="10" r="4" fill="#d97706" fillOpacity="0.3" stroke="#b45309" />
              <path d="M12 2v2" />
              <path d="M4.93 4.93l1.41 1.41" />
              <path d="M2 10h2" />
              <path d="M20 10h2" />
              <path d="M19.07 4.93l-1.41 1.41" />
              <path d="M2 18h20" strokeWidth="1.5" />
              <path d="M3 21c3 0 3-2 6-2s3 2 6 2 3-2 6-2" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-6xl font-light italic text-[#2c221a] font-serif tracking-tight drop-shadow-sm">
            musings over sunsets
          </h1>
          <p className="font-handwritten text-2xl text-[#856348] drop-shadow-sm">
            A collection of reflections during golden hours captured in polaroids and words.
          </p>
        </header>

        {entries.length === 0 ? (
          <div className="text-center text-[#6e5440] font-handwritten text-2xl py-12">
            No polaroids found in public/musings/
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-start">
            {entries.map((entry, index) => {
              const rotationClass = rotations[index % rotations.length];

              return (
                <div key={entry.slug} className="relative pt-6 group">
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
                          <stop offset="0%" stopColor="#d1c4b2" />
                          <stop offset="50%" stopColor="#8c7863" />
                          <stop offset="100%" stopColor="#4f4031" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <Link href={`/musings/${entry.slug}`}>
                    <article
                      className={`bg-[#fefcf9] text-stone-900 p-4 pb-6 rounded-sm shadow-[0_15px_35px_rgba(61,49,39,0.25)] border border-[#e2d5c3] transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-[0_25px_50px_rgba(61,49,39,0.35)] ${rotationClass}`}
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
                        <h2 className="font-handwritten text-2xl font-bold text-[#30261f] line-clamp-1 leading-snug">
                          {entry.title}
                        </h2>
                        <span className="font-mono text-[10px] text-[#8c7863] uppercase tracking-wider block mt-1">
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
      </div>
    </main>
  );
}