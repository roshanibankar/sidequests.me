"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface MusingItem {
  slug: string;
  title: string;
  date: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  
  const [musings, setMusings] = useState<MusingItem[]>([]);
  const router = useRouter();

  const fetchMusings = async () => {
    const res = await fetch("/api/admin/list");
    if (res.ok) {
      const data = await res.json();
      setMusings(data);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsAuthenticated(true);
      fetchMusings();
    } else {
      alert("Incorrect password");
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Publishing...");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("content", content);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch("/api/admin/publish", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setStatus("Successfully published! 🎉");
      setTitle("");
      setContent("");
      setImageFile(null);
      fetchMusings();
      router.refresh();
    } else {
      setStatus("Failed to publish.");
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete "${slug}"?`)) return;

    const res = await fetch(`/api/admin/delete?slug=${slug}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setMusings(musings.filter((m) => m.slug !== slug));
      router.refresh();
    } else {
      alert("Failed to delete musing.");
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#f4ebd0] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-[#fefcf9] p-8 rounded shadow-md border border-[#e2d5c3] max-w-sm w-full space-y-4">
          <h1 className="font-handwritten text-3xl text-[#2c221a] text-center">Secret Desk</h1>
          <input
            type="password"
            placeholder="Enter passcode..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-[#d1c4b2] rounded bg-[#fdfbf7] text-[#3d3127]"
          />
          <button type="submit" className="w-full bg-[#856348] text-white py-2 rounded font-handwritten text-xl hover:bg-[#544133]">
            Unlock
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4ebd0] p-6 md:p-12 text-[#3d3127]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center bg-[#fefcf9] p-6 rounded shadow-sm border border-[#e2d5c3]">
          <h1 className="font-handwritten text-3xl text-[#2c221a]">Secret Desk Admin</h1>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="text-sm text-[#8c7863] underline hover:text-[#2c221a]"
          >
            Lock / Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Create Form */}
          <div className="bg-[#fefcf9] p-6 rounded shadow-lg border border-[#e2d5c3]">
            <h2 className="font-handwritten text-2xl text-[#2c221a] mb-4">New Musing & Sunset</h2>
            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-2 border border-[#d1c4b2] rounded bg-[#fdfbf7]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full p-2 border border-[#d1c4b2] rounded bg-[#fdfbf7]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Sunset Image (Polaroid/Photo)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                  className="w-full p-2 border border-[#d1c4b2] rounded bg-[#fdfbf7] text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Poem / Content (Markdown)</label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  placeholder="Write your musings here..."
                  className="w-full p-2 border border-[#d1c4b2] rounded bg-[#fdfbf7] font-serif"
                />
              </div>

              <button type="submit" className="w-full bg-[#856348] text-white py-2 rounded font-handwritten text-xl hover:bg-[#544133]">
                Publish to Desk
              </button>

              {status && <p className="text-center font-handwritten text-lg text-[#856348] mt-2">{status}</p>}
            </form>
          </div>

          {/* Existing Musings List & Delete */}
          <div className="bg-[#fefcf9] p-6 rounded shadow-lg border border-[#e2d5c3] flex flex-col">
            <h2 className="font-handwritten text-2xl text-[#2c221a] mb-4">Existing Musings</h2>
            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-3 pr-2">
              {musings.length === 0 ? (
                <p className="text-sm text-[#8c7863] italic">No musings found.</p>
              ) : (
                musings.map((m) => (
                  <div key={m.slug} className="flex justify-between items-center p-3 border border-[#e2d5c3] rounded bg-[#fdfbf7]">
                    <div>
                      <p className="font-bold text-sm text-[#2c221a]">{m.title}</p>
                      <p className="text-xs text-[#8c7863]">{m.date}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(m.slug)}
                      className="bg-red-800 text-white px-3 py-1 rounded text-xs hover:bg-red-900 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}