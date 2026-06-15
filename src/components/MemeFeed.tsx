import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Music, Plus, Check, Bookmark, ArrowDown, ArrowUp } from "lucide-react";
import { MemeItem } from "../types";

interface MemeFeedProps {
  memes: MemeItem[];
  likedStates: { [id: string]: boolean };
  savedStates: { [id: string]: boolean };
  onToggleLike: (memeId: string) => void;
  onToggleSave: (memeId: string) => void;
  onToggleFollow: (creatorUsername: string) => void;
  onOpenComments: (item: MemeItem) => void;
  onOpenShare: (item: MemeItem) => void;
}

export default function MemeFeed({
  memes,
  likedStates,
  savedStates,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
  onOpenComments,
  onOpenShare
}: MemeFeedProps) {
  const [globalMuted, setGlobalMuted] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom double tap spawn hearts
  const [heartSpawns, setHeartSpawns] = useState<{ id: number; x: number; y: number }[]>([]);
  const lastTapRef = useRef<{ id: string; time: number } | null>(null);

  // Monitor grid snapping scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    if (clientHeight === 0) return;
    const index = Math.round(scrollTop / clientHeight);
    if (index !== activeIndex && index >= 0 && index < memes.length) {
      setActiveIndex(index);
    }
  };

  // Up/Down arrows controls support
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const h = containerRef.current.clientHeight;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        containerRef.current.scrollBy({ top: h, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        containerRef.current.scrollBy({ top: -h, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, []);

  // Manage video node plays/pauses based on active Index
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    Object.keys(videoRefs.current).forEach((id) => {
      const vid = videoRefs.current[id];
      if (vid) {
        if (memes[activeIndex]?.id === id) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
          vid.currentTime = 0; // reset
        }
      }
    });
  }, [activeIndex, memes]);

  // Handle double tap like gesture
  const handleDoubleTapCard = (e: React.MouseEvent<HTMLDivElement>, item: MemeItem) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    
    if (lastTapRef.current && lastTapRef.current.id === item.id && (now - lastTapRef.current.time) < DOUBLE_PRESS_DELAY) {
      // Double tap triggered!
      if (!likedStates[item.id]) {
        onToggleLike(item.id);
      }
      
      // Spawn floating heart
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const heartId = Date.now();
      
      setHeartSpawns((prev) => [...prev, { id: heartId, x, y }]);
      setTimeout(() => {
        setHeartSpawns((prev) => prev.filter((h) => h.id !== heartId));
      }, 800);
      
      lastTapRef.current = null; // reset
    } else {
      lastTapRef.current = { id: item.id, time: now };
    }
  };

  return (
    <div className="flex-1 bg-black relative flex flex-col overflow-hidden">
      
      {/* Floating Sound Controller Global Banner */}
      <button
        onClick={() => setGlobalMuted(!globalMuted)}
        className="absolute top-4 left-4 p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors z-30 flex items-center gap-1.5 backdrop-blur-md cursor-pointer border border-zinc-800/60"
      >
        {globalMuted ? (
          <>
            <VolumeX className="w-4 h-4 text-brand-magenta animate-pulse" />
            <span className="text-[10px] font-bold tracking-tight text-brand-magenta mr-1">App Muted</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-brand-cyan animate-bounce" />
            <span className="text-[10px] font-bold tracking-tight text-brand-cyan mr-1">Sound Live</span>
          </>
        )}
      </button>

      {/* Swipe/Scrolling Reels Snap container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 reels-container"
      >
        {memes.map((item, index) => {
          const isLiked = likedStates[item.id] || item.likedByUser;
          const isSaved = savedStates[item.id] || item.savedByUser;
          const isActive = index === activeIndex;

          return (
            <div
              key={item.id}
              onClick={(e) => handleDoubleTapCard(e, item)}
              className="w-full h-full reel-item relative bg-neutral-950 flex flex-col justify-center overflow-hidden"
            >
              {/* Media Content Host */}
              {item.type === "video" ? (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
                  <video
                    ref={(el) => {
                      videoRefs.current[item.id] = el;
                    }}
                    src={item.src}
                    loop
                    playsInline
                    muted={globalMuted}
                    autoPlay={isActive}
                    className="w-full h-full object-cover pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-zinc-950">
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="w-full h-full object-cover opacity-90 select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Dynamic Retro Overlay (gradient fog) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/30 pointer-events-none" />

              {/* Meme OVERLAYS Render if it has topText & bottomText */}
              {item.topText && (
                <div className="absolute top-16 left-0 right-0 px-6 text-center select-none pointer-events-none z-10">
                  <h1 className="font-display font-black text-2xl md:text-3xl tracking-tight text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.95)] uppercase break-words">
                    {item.topText}
                  </h1>
                </div>
              )}

              {item.bottomText && (
                <div className="absolute bottom-[24%] left-0 right-0 px-6 text-center select-none pointer-events-none z-10">
                  <h1 className="font-display font-black text-2xl md:text-3xl tracking-tight text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.95)] uppercase break-words">
                    {item.bottomText}
                  </h1>
                </div>
              )}

              {/* Double-tap Heart Spawns Overlay */}
              {heartSpawns.map((h) => (
                <div
                  key={h.id}
                  style={{ left: h.x - 24, top: h.y - 24 }}
                  className="absolute pointer-events-none z-40 text-brand-magenta select-none animate-ping"
                >
                  <Heart className="w-12 h-12 fill-current drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
                </div>
              ))}

              {/* Right Sidebar Floating Interaction panel */}
              <div className="absolute right-3.5 bottom-16 flex flex-col gap-5 items-center z-25">
                
                {/* Creator Profile Avatar block */}
                <div className="flex flex-col items-center mb-1 relative">
                  <img
                    src={item.creator.avatar}
                    alt={item.creator.name}
                    className="w-11 h-11 rounded-full object-cover border-[2.5px] border-black bg-zinc-800 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFollow(item.creator.username);
                    }}
                    className={`absolute bottom-[-6px] p-0.5 rounded-full border border-black shadow-md transition-all ${item.creator.following ? 'bg-brand-cyan text-slate-950' : 'bg-brand-magenta text-white hover:scale-105'}`}
                  >
                    {item.creator.following ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <Plus className="w-3 h-3 stroke-[3]" />
                    )}
                  </button>
                </div>

                {/* Like trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLike(item.id);
                  }}
                  className="bg-black/45 backdrop-blur-md p-3 rounded-full hover:scale-105 active:scale-95 transition text-slate-200 border border-zinc-800/40 cursor-pointer"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'text-brand-magenta fill-current animate-ping' : ''}`} />
                  <span className="text-[10px] font-black font-mono mt-1 block">
                    {item.likes >= 1000 ? `${(item.likes / 1000).toFixed(1)}k` : item.likes}
                  </span>
                </button>

                {/* Comment trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenComments(item);
                  }}
                  className="bg-black/45 backdrop-blur-md p-3 rounded-full hover:scale-105 active:scale-95 transition text-slate-200 border border-zinc-800/40 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 hover:text-brand-cyan transition-colors" />
                  <span className="text-[10px] font-black font-mono mt-1 block">
                    {item.commentsCount}
                  </span>
                </button>

                {/* Favorite Bookmark trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(item.id);
                  }}
                  className="bg-black/45 backdrop-blur-md p-3 rounded-full hover:scale-105 active:scale-95 transition text-slate-200 border border-zinc-800/40 cursor-pointer"
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'text-brand-cyan fill-current' : 'hover:text-brand-cyan transition-colors'}`} />
                  <span className="text-[10px] font-black font-mono mt-1 block">
                    Save
                  </span>
                </button>

                {/* Share trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenShare(item);
                  }}
                  className="bg-black/45 backdrop-blur-md p-3 rounded-full hover:scale-105 active:scale-95 transition text-slate-200 border border-zinc-800/40 cursor-pointer"
                >
                  <Share2 className="w-5 h-5 hover:text-white" />
                  <span className="text-[10px] font-semibold mt-1 block">
                    Share
                  </span>
                </button>

                {/* Spinning audio disk decoration */}
                <div className="relative w-8 h-8 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center animate-spin mt-2">
                  <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
                    <Music className="w-2.5 h-2.5 text-zinc-400" />
                  </div>
                </div>

              </div>

              {/* Bottom description / caption block */}
              <div className="absolute left-4 bottom-5 right-20 text-left space-y-2 z-20 select-none pointer-events-none">
                
                {/* Creator tag and verified details */}
                <div className="flex items-center gap-1.5 font-sans">
                  <span className="font-bold text-sm text-white drop-shadow">
                    @{item.creator.username}
                  </span>
                  
                  {item.creator.following && (
                    <span className="text-[9px] bg-brand-cyan/20 text-brand-cyan px-2 py-0.5 rounded-full font-semibold border border-brand-cyan/30 tracking-tight">
                      Following
                    </span>
                  )}
                </div>

                {/* Hilarious Roast Caption */}
                <p className="text-[12.5px] text-zinc-200 text-left leading-relaxed font-sans line-clamp-3 drop-shadow font-normal overflow-hidden break-words pr-2">
                  {item.caption}
                </p>

                {/* Animated scrolling audio banner track */}
                <div className="flex items-center gap-2 text-zinc-450 font-mono text-[10px] py-1 bg-black/25 px-2.5 rounded-lg border border-zinc-900/30 w-fit drop-shadow-sm">
                  <Music className="w-3 h-3 text-zinc-400 shrink-0" />
                  <div className="overflow-hidden w-28 relative">
                    <span className="inline-block whitespace-nowrap animate-[marquee_12s_linear_infinite] font-semibold text-zinc-300">
                      {item.audioTrack} • {item.audioTrack}
                    </span>
                  </div>
                </div>

                {/* Grid Categorization Hashtags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[9px] bg-zinc-900/80 border border-zinc-800/40 text-brand-cyan font-bold font-mono px-2 py-0.5 rounded flex items-center shadow-sm drop-shadow"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

              </div>

              {/* Navigation tip banner displayed only on first post */}
              {index === 0 && (
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-15 bg-black/60 p-2.5 px-4 rounded-xl text-3xs text-neutral-300 font-medium tracking-wide flex items-center gap-2 border border-zinc-800/40 backdrop-blur-md animate-bounce pointer-events-none selection:bg-transparent">
                  <div className="flex flex-col gap-0.5 text-brand-cyan shrink-0">
                    <ArrowUp className="w-3.5 h-3.5 mx-auto" />
                    <ArrowDown className="w-3.5 h-3.5 mx-auto -mt-0.5" />
                  </div>
                  <span>Swipe up/down or use Keyboard arrows to browse memes</span>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
