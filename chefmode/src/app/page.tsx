"use client";

import { useEffect, useMemo, useState } from "react";

interface Recipe {
  id: string;
  title: string;
  category: "Breakfast" | "Mains" | "Snacks" | "Desserts" | "Drinks";
  prepTime: string;
  servings: string;
  notes?: string;
  ingredients: string[];
  steps: string[];
  createdAt: string;
}

const CATEGORIES: Record<
  Recipe["category"],
  { bg: string; border: string; badge: string; accent: string; icon: string }
> = {
  Breakfast: {
    bg: "bg-[#ffedd5]", // Warm Creamy Orange
    border: "border-orange-300",
    badge: "bg-orange-300 text-orange-950",
    accent: "text-orange-950",
    icon: "🥐",
  },
  Mains: {
    bg: "bg-[#f3e8ff]", // Lavender Purple
    border: "border-purple-300",
    badge: "bg-purple-200 text-purple-950",
    accent: "text-purple-900",
    icon: "🍝",
  },
  Snacks: {
    bg: "bg-[#e0f2fe]", // Sky Blue
    border: "border-sky-300",
    badge: "bg-sky-200 text-sky-950",
    accent: "text-sky-950",
    icon: "🥝",
  },
  Desserts: {
    bg: "bg-[#fce7f3]", // Soft Pink
    border: "border-pink-200",
    badge: "bg-pink-200/80 text-pink-950",
    accent: "text-pink-950",
    icon: "🍰",
  },
  Drinks: {
    bg: "bg-[#e2ebd8]", // Light Matcha Green
    border: "border-[#b8caad]",
    badge: "bg-[#c9d8bd] text-[#2d4029]",
    accent: "text-[#2d4029]",
    icon: "🥤",
  },
};

export default function ChefModePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form input states
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<Recipe["category"]>("Mains");
  const [formPrepTime, setFormPrepTime] = useState("");
  const [formServings, setFormServings] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formIngredients, setFormIngredients] = useState("");
  const [formSteps, setFormSteps] = useState("");

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/recipes");
      if (res.ok) {
        const data = await res.json();
        setRecipes(data);
      }
    } catch (err) {
      console.error("Failed to load recipes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      const matchesCat = activeCategory === "All" || r.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.ingredients.some((ing) => ing.toLowerCase().includes(q)) ||
        (r.notes && r.notes.toLowerCase().includes(q));

      return matchesCat && matchesQuery;
    });
  }, [recipes, activeCategory, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingRecipeId(null);
    setFormTitle("");
    setFormCategory("Mains");
    setFormPrepTime("");
    setFormServings("");
    setFormNotes("");
    setFormIngredients("");
    setFormSteps("");
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (recipe: Recipe) => {
    setEditingRecipeId(recipe.id);
    setFormTitle(recipe.title);
    setFormCategory(recipe.category);
    setFormPrepTime(recipe.prepTime);
    setFormServings(recipe.servings);
    setFormNotes(recipe.notes || "");
    setFormIngredients(recipe.ingredients.join("\n"));
    setFormSteps(recipe.steps.join("\n"));
    setOpenRecipe(null); // Close viewer modal
    setIsAddModalOpen(true); // Open form modal
  };

  const handleSaveRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    const ingredients = formIngredients.split("\n").map((s) => s.trim()).filter(Boolean);
    const steps = formSteps.split("\n").map((s) => s.trim()).filter(Boolean);

    if (!formTitle || ingredients.length === 0 || steps.length === 0) return;

    const url = editingRecipeId ? `/api/recipes/${editingRecipeId}` : "/api/recipes";
    const method = editingRecipeId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formTitle,
        category: formCategory,
        prepTime: formPrepTime || "15 mins",
        servings: formServings || "2 servings",
        notes: formNotes,
        ingredients,
        steps,
      }),
    });

    if (res.ok) {
      const savedRecipe = await res.json();
      if (editingRecipeId) {
        setRecipes(recipes.map((r) => (r.id === editingRecipeId ? savedRecipe : r)));
      } else {
        setRecipes([savedRecipe, ...recipes]);
      }
      setIsAddModalOpen(false);
      setEditingRecipeId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRecipes(recipes.filter((r) => r.id !== id));
      setOpenRecipe(null);
    }
  };

  const categoriesList = ["All", "Breakfast", "Mains", "Snacks", "Desserts", "Drinks"];

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#2c302e] font-sans selection:bg-[#556b2f] selection:text-white pb-28">
      
      {/* Header Banner */}
      <header className="mx-auto max-w-7xl px-8 py-10 mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#e6e2dd]">
        <div className="flex items-center space-x-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e3ede0] text-2xl shadow-xs border border-[#d8e2d5]">
            🌿
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1a1c1b] flex items-center gap-3">
              Recipes 
              <span className="text-stone-400 font-light">•</span> 
              <span className="font-handwritten text-2xl font-normal text-[#556b2f]">Food is my love language.</span>
            </h1>
            <p className="text-xs font-medium text-[#6e7571] tracking-wide mt-0.5">Sticky notes from my kitchen</p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 rounded-full bg-[#556b2f] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#445625] active:scale-95 cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Recipe</span>
        </button>
      </header>

      {/* Navigation / Filters Bar */}
      <section className="mx-auto max-w-7xl px-8 mb-10 space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categoriesList.map((cat) => {
              const isActive = activeCategory === cat;
              const icon = cat === "All" ? "✨" : CATEGORIES[cat as Recipe["category"]].icon;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#556b2f] text-white shadow-sm"
                      : "bg-white text-[#4a504c] border border-[#e6e2dd] hover:bg-[#f2efe9]"
                  }`}
                >
                  <span>{icon}</span>
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          <div className="relative min-w-[240px] md:w-72">
            <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c948f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipe or ingredient..."
              className="w-full rounded-full border border-[#e6e2dd] bg-white py-2 pl-10 pr-4 text-sm text-[#1a1c1b] placeholder-[#8c948f] focus:border-[#556b2f] focus:outline-none transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-[#e6e2dd] text-xs text-[#4a504c] hover:bg-[#d4cfc7] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

        </div>
      </section>

      {/* Grid of Colorful Sticky Note Cards */}
      <div className="mx-auto max-w-7xl px-8">
        {loading ? (
          <div className="text-center py-24 font-mono text-sm text-[#6e7571] animate-pulse">
            Fetching recipe notes from kitchen vault...
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl border border-[#e6e2dd] bg-white shadow-xs max-w-md mx-auto">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f2efe9] text-2xl text-[#556b2f]">
              🔍
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#1a1c1b]">No recipes found</h3>
            <p className="mt-1 text-sm text-[#6e7571]">Try clearing your search query or switching category tabs.</p>
            <button
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
              className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#556b2f] hover:underline cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredRecipes.map((recipe, index) => {
              const config = CATEGORIES[recipe.category] || CATEGORIES.Mains;
              const tilt = index % 3 === 0 ? "-rotate-1" : index % 3 === 1 ? "rotate-1" : "rotate-0.5";

              return (
                <article
                  key={recipe.id}
                  onClick={() => setOpenRecipe(recipe)}
                  style={{ boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)" }}
                  className={`group relative cursor-pointer ${config.bg} border ${config.border} text-stone-900 rounded-2xl p-6 flex flex-col justify-between h-64 select-none transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:rotate-0 ${tilt}`}
                >
                  {/* Washi Tape Pin Accent */}
                  <div 
                    className="absolute -top-3 left-1/2 h-5 w-24 -translate-x-1/2 rounded-xs z-10 opacity-80"
                    style={{
                      background: "rgba(255, 255, 255, 0.65)",
                      backdropFilter: "blur(2px)",
                      borderLeft: "1px dashed rgba(0,0,0,0.12)",
                      borderRight: "1px dashed rgba(0,0,0,0.12)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  />

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${config.badge}`}>
                        {config.icon} {recipe.category}
                      </span>
                      <span className="font-mono text-[11px] font-medium text-stone-600">
                        ⏱️ {recipe.prepTime}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold leading-snug text-stone-950 group-hover:underline line-clamp-2">
                      {recipe.title}
                    </h3>

                    {recipe.notes && (
                      <p className="mt-2 font-handwritten text-lg italic leading-tight text-stone-800 line-clamp-2">
                        &quot;{recipe.notes}&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-stone-900/10 pt-3 font-mono text-xs text-stone-700">
                    <span>🍽️ {recipe.servings}</span>
                    <span className={`flex items-center gap-1 font-sans text-xs font-bold ${config.accent} group-hover:translate-x-1 transition-transform`}>
                      View note ➔
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Recipe Detail Modal */}
      {openRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-[#e6e2dd] bg-white text-[#2c302e] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="relative border-b border-[#e6e2dd] px-8 py-6 bg-[#faf8f5]">
              <div className="pr-8">
                <span className={`inline-block mb-2 rounded-full px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider ${CATEGORIES[openRecipe.category].badge}`}>
                  {CATEGORIES[openRecipe.category].icon} {openRecipe.category}
                </span>
                <h2 className="font-serif text-2xl font-bold sm:text-3xl text-[#1a1c1b] leading-tight">
                  {openRecipe.title}
                </h2>
                <div className="mt-3 flex items-center gap-4 font-mono text-xs text-[#6e7571]">
                  <span>⏱️ {openRecipe.prepTime}</span>
                  <span>🍽️ {openRecipe.servings}</span>
                  <span>🥗 {openRecipe.ingredients.length} items</span>
                </div>
              </div>

              <button
                onClick={() => setOpenRecipe(null)}
                className="absolute right-6 top-6 rounded-full p-2 text-[#6e7571] hover:bg-[#f2efe9] hover:text-[#1a1c1b] cursor-pointer transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {openRecipe.notes && (
                <div className="rounded-2xl border-l-4 border-[#556b2f] bg-[#f4f7f4] p-4 font-handwritten text-xl leading-relaxed text-[#3b5336]">
                  <p>💡 &quot;{openRecipe.notes}&quot;</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-2 space-y-3">
                  <h3 className="flex items-center justify-between border-b border-[#e6e2dd] pb-2 font-serif text-lg font-semibold text-[#1a1c1b]">
                    <span>Ingredients</span>
                    <span className="font-sans text-[11px] text-[#8c948f]">Tap to check</span>
                  </h3>
                  <ul className="space-y-2 text-sm text-[#4a504c]">
                    {openRecipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-[#faf8f5] transition-colors">
                        <input type="checkbox" id={`ing-${i}`} className="mt-1 rounded text-[#556b2f] focus:ring-[#556b2f] cursor-pointer h-4 w-4 border-[#e6e2dd]" />
                        <label htmlFor={`ing-${i}`} className="cursor-pointer select-none leading-snug">{ing}</label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-3 space-y-3">
                  <h3 className="border-b border-[#e6e2dd] pb-2 font-serif text-lg font-semibold text-[#1a1c1b]">
                    Method Steps
                  </h3>
                  <ol className="space-y-4 text-sm text-[#4a504c]">
                    {openRecipe.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3.5">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f2efe9] font-mono text-xs font-semibold text-[#556b2f]">
                          {i + 1}
                        </span>
                        <p className="leading-relaxed pt-0.5">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#e6e2dd] bg-[#faf8f5] px-8 py-4 font-mono text-xs text-[#6e7571]">
              <button
                onClick={() => handleOpenEditModal(openRecipe)}
                className="font-sans font-medium text-[#556b2f] hover:text-[#445625] px-3 py-1.5 rounded-xl hover:bg-[#e3ede0]/50 cursor-pointer transition-colors flex items-center gap-1.5"
              >
                ✏️ Edit Recipe
              </button>
              <button
                onClick={() => handleDelete(openRecipe.id)}
                className="font-sans font-medium text-rose-600 hover:text-rose-800 px-3 py-1.5 rounded-xl hover:bg-rose-50 cursor-pointer transition-colors"
              >
                Delete Recipe
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add / Edit Recipe Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col rounded-3xl border border-[#e6e2dd] bg-white text-[#2c302e] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-[#e6e2dd] bg-[#faf8f5] px-6 py-5">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#1a1c1b]">
                  {editingRecipeId ? "Edit Recipe Note" : "Add New Recipe"}
                </h2>
                <p className="text-xs text-[#6e7571]">Save to your kitchen vault</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-full p-2 text-[#6e7571] hover:bg-[#f2efe9] hover:text-[#1a1c1b] cursor-pointer transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveRecipe} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
              <div>
                <label className="block mb-1 font-medium text-[#4a504c]">Recipe Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Creamy Coconut Lentil Curry"
                  className="w-full rounded-xl border border-[#e6e2dd] bg-[#faf8f5] px-4 py-2.5 text-[#1a1c1b] focus:border-[#556b2f] focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-medium text-[#4a504c]">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Recipe["category"])}
                    className="w-full rounded-xl border border-[#e6e2dd] bg-[#faf8f5] px-3.5 py-2.5 text-[#1a1c1b] focus:border-[#556b2f] focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Mains">Mains</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-[#4a504c]">Prep Time</label>
                  <input
                    type="text"
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(e.target.value)}
                    placeholder="e.g. 20 mins"
                    className="w-full rounded-xl border border-[#e6e2dd] bg-[#faf8f5] px-3.5 py-2.5 text-[#1a1c1b] focus:border-[#556b2f] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-[#4a504c]">Servings</label>
                <input
                  type="text"
                  value={formServings}
                  onChange={(e) => setFormServings(e.target.value)}
                  placeholder="e.g. 2 - 3 servings"
                  className="w-full rounded-xl border border-[#e6e2dd] bg-[#faf8f5] px-3.5 py-2.5 text-[#1a1c1b] focus:border-[#556b2f] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-[#4a504c]">Chef&apos;s Tip / Memo</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Add extra lime juice right before serving!"
                  className="w-full rounded-xl border border-[#e6e2dd] bg-[#faf8f5] px-3.5 py-2.5 text-[#1a1c1b] focus:border-[#556b2f] focus:outline-none font-handwritten text-lg transition-all"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-[#4a504c]">Ingredients (one per line) *</label>
                <textarea
                  required
                  rows={4}
                  value={formIngredients}
                  onChange={(e) => setFormIngredients(e.target.value)}
                  placeholder="1 cup rolled oats&#10;2 cups almond milk&#10;1 tbsp chia seeds"
                  className="w-full rounded-xl border border-[#e6e2dd] bg-[#faf8f5] p-3.5 font-mono text-xs text-[#1a1c1b] focus:border-[#556b2f] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-[#4a504c]">Method Steps (one per line) *</label>
                <textarea
                  required
                  rows={4}
                  value={formSteps}
                  onChange={(e) => setFormSteps(e.target.value)}
                  placeholder="Combine oats and milk in saucepan.&#10;Simmer gently for 8-10 minutes.&#10;Top with berries and maple syrup."
                  className="w-full rounded-xl border border-[#e6e2dd] bg-[#faf8f5] p-3.5 font-mono text-xs text-[#1a1c1b] focus:border-[#556b2f] focus:outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#e6e2dd]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-full border border-[#e6e2dd] px-5 py-2.5 text-sm font-medium text-[#6e7571] hover:text-[#1a1c1b] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#556b2f] px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#445625] cursor-pointer transition-all"
                >
                  {editingRecipeId ? "Update Recipe" : "Save Recipe"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </main>
  );
}