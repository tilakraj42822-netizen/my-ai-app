import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Flame, Play, Grid, Layers, Sparkles, Award } from "lucide-react";
import { MemeItem } from "../types";

interface ExploreGridProps {
  memes: MemeItem[];
  onSelectMeme: (meme: MemeItem) => void;
}

export default function ExploreGrid({ memes, onSelectMeme }: ExploreGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "🔥 All Roasts" },
    { id: "programming", label: "💻 Code" },
    { id: "devlife", label: "☕ Dev Life" },
    { id: "hacking", label: "🛡️ Security" },
    { id: "cats", label: "🐾 Cute AI" },
    { id: "sponsored", label: "📢 Sponsored" }
  ];

  const filteredMemes = memes.filter((meme) => {
    const matchesSearch = meme.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          meme.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          meme.creator.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeCategory === "all") return matchesSearch;
    return matchesSearch && (meme.tags.includes(activeCategory) || (activeCategory === "sponsored" && meme.isAd));
  });

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 p-4 flex flex-col text-slate-100 pb-20">
      
      {/* Banner Area */}
      <div className="mb-6 bg-gradient-to-r from-zinc-900 to-indigo-950/40 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between relative overflow-hidden shrink-0">
        <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-brand-cyan/10 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-1.5 text-brand-cyan text-xs font-mono font-bold tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5 fill-current text-brand-magenta animate-pulse" />
            <span>Trending Arena</span>
          </div>
          <h2 className="font-display font-black text-lg text-white">MemeVerse Pulse</h2>
          <p className="text-[10px] text-zinc-400">Interact with the world's finest AI-crafted brain rot</p>
        </div>
        <Award className="w-10 h-10 text-brand-cyan/40 shrink-0" />
      </div>

      {/* Modern Search Bar */}
      <div className="relative mb-5 shrink-0">
        <input
          type="text"
          placeholder="Search creators, keywords or hashtags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-850 rounded-xl pl-11 pr-4 py-3 text-sm placeholder-zinc-550 focus:outline-none focus:ring-1 focus:ring-brand-cyan text-slate-100 transition shadow-inner"
        />
        <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Category Horizontal Filter Scroller */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none shrink-0 -mx-4 px-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`py-2 px-4 rounded-xl text-2xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${activeCategory === cat.id ? 'bg-white text-slate-950 font-bold border-white scale-102 shadow-md' : 'bg-zinc-900 text-zinc-400 border-zinc-850 hover:text-white hover:border-zinc-700'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid listing */}
      <div className="flex-1">
        {filteredMemes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Layers className="w-12 h-12 text-zinc-800 mb-3" />
            <p className="text-zinc-550 text-sm font-medium">No funny material found.</p>
            <p className="text-zinc-650 text-xs mt-1">Try tweaking your search keywords or categories</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredMemes.map((meme, idx) => (
              <motion.div
                key={meme.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                onClick={() => onSelectMeme(meme)}
                className="group relative aspect-square bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer border border-zinc-850 hover:border-zinc-700/80 transition shadow-lg shrink-0"
              >
                {/* Visual Backdrop */}
                <img
                  src={meme.src}
                  alt={meme.caption}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/40 pointer-events-none" />

                {/* Type identifier overlay badge */}
                {meme.type === "video" && (
                  <div className="absolute top-2.5 right-2.5 bg-black/60 p-1 px-1.5 rounded-lg flex items-center gap-1 backdrop-blur-md">
                    <Play className="w-2.5 h-2.5 text-brand-cyan fill-current" />
                    <span className="text-[8px] font-bold text-white tracking-wider uppercase">Reel</span>
                  </div>
                )}
                
                {meme.isAd && (
                  <div className="absolute top-2.5 left-2.5 bg-brand-magenta/90 p-1 px-1.5 rounded-lg">
                    <span className="text-[8px] font-bold text-white tracking-widest uppercase">AD</span>
                  </div>
                )}

                {/* Inner Overlay Texts preview */}
                {meme.topText && (
                  <div className="absolute top-2 left-0 right-0 px-2 pointer-events-none">
                    <p className="text-[9px] font-black text-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] uppercase truncate">
                      {meme.topText}
                    </p>
                  </div>
                )}

                {/* Info and interaction counts */}
                <div className="absolute bottom-2.5 left-3 right-3 text-left">
                  <p className="text-white text-3xs font-medium leading-normal line-clamp-2 drop-shadow-md mb-1.5">
                    {meme.caption}
                  </p>
                  <div className="flex items-center justify-between text-4xs font-mono text-zinc-400">
                    <span>@{meme.creator.username}</span>
                    <span className="text-white font-semibold">❤️ {meme.likes >= 1000 ? `${(meme.likes / 1000).toFixed(1)}k` : meme.likes}</span>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
