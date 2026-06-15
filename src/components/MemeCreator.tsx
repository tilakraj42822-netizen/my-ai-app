import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Image, Check, Layers, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { MemeItem } from "../types";

interface MemeCreatorProps {
  onMemeCreated: (newMeme: MemeItem) => void;
  onBackToFeed: () => void;
}

export default function MemeCreator({ onMemeCreated, onBackToFeed }: MemeCreatorProps) {
  const [prompt, setPrompt] = useState("");
  const [creatorName, setCreatorName] = useState("AlphaCoder");
  const [styleMode, setStyleMode] = useState<"ai" | "manual">("ai");
  
  // Custom manual elements
  const [manualTopText, setManualTopText] = useState("");
  const [manualBottomText, setManualBottomText] = useState("");
  const [manualCaption, setManualCaption] = useState("");
  const [manualBgStyle, setManualBgStyle] = useState(0);

  const [loading, setLoading] = useState(false);
  const [loadingPhrase, setLoadingPhrase] = useState("Summoning Gemini AI...");
  const [error, setError] = useState<string | null>(null);
  const [generatedMeme, setGeneratedMeme] = useState<MemeItem | null>(null);

  const samplePrompts = [
    "Compiling 1000 lines of rust with zero warnings",
    "Product manager asking for a quick five minute database rewrite",
    "Me looking at my own code from three weeks ago",
    "AI translating my natural language into spaghetti code"
  ];

  const loadingPhrasesList = [
    "Reticulating splines...",
    "Summoning Google Gemini AI...",
    "Brewing digital espresso...",
    "Slicing developer tears...",
    "Structuring perfect sarcasm...",
    "Aligning missing semicolons...",
    "Roasting your codebase...",
    "Pouring pure high-contrast gradients..."
  ];

  const manualGrads = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please write down what your meme is about!");
      return;
    }

    setError(null);
    setLoading(true);
    setGeneratedMeme(null);

    // Rotate loading phrases every 2 seconds
    let phraseIndex = 0;
    const loadingInterval = setInterval(() => {
      phraseIndex = (phraseIndex + 1) % loadingPhrasesList.length;
      setLoadingPhrase(loadingPhrasesList[phraseIndex]);
    }, 2000);

    try {
      const response = await fetch("/api/generate-meme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with MemeVerse AI Server.");
      }

      const rawData = await response.json();
      setGeneratedMeme(rawData);
    } catch (err: any) {
      setError(err?.message || "Something went wrong during generation.");
    } finally {
      clearInterval(loadingInterval);
      setLoading(false);
    }
  };

  const handlePublish = () => {
    if (styleMode === "ai" && generatedMeme) {
      onMemeCreated({
        ...generatedMeme,
        creator: {
          ...generatedMeme.creator,
          name: creatorName || "MemeVerse AI Guest",
          username: (creatorName || "ai_guest").toLowerCase().replace(/\s+/g, "_")
        }
      });
      onBackToFeed();
    } else if (styleMode === "manual") {
      // Create manual upload
      const manualMeme: MemeItem = {
        id: `manual-meme-${Date.now()}`,
        type: "image",
        src: manualBgStyle < manualGrads.length ? manualGrads[manualBgStyle] : manualGrads[0],
        caption: manualCaption || `Visual setup: ${manualTopText} | ${manualBottomText}`,
        topText: manualTopText.toUpperCase() || "MANUAL SPEC",
        bottomText: manualBottomText.toUpperCase() || "CODE STAYS RAW",
        likes: 1,
        likedByUser: true,
        savedByUser: false,
        commentsCount: 0,
        comments: [],
        creator: {
          username: (creatorName || "handmade_chef").toLowerCase().replace(/\s+/g, "_"),
          name: creatorName || "Handmade Chef",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=60",
          followers: 1,
          following: false
        },
        audioTrack: "Original Score - Creator Beats",
        tags: ["custom", "creator", "handmade", "meme"]
      };
      onMemeCreated(manualMeme);
      onBackToFeed();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 p-6 flex flex-col text-slate-100">
      
      {/* Header Back Strip */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBackToFeed}
          className="p-2 bg-zinc-800 rounded-full text-zinc-300 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-display font-bold text-xl text-white">Create Meme</h2>
          <p className="text-xs text-neutral-400">Generate fresh roasts with modern tech</p>
        </div>
      </div>

      {/* Style Tabs */}
      <div className="grid grid-cols-2 bg-zinc-900 p-1.5 rounded-xl mb-6 border border-zinc-800">
        <button
          onClick={() => { setStyleMode("ai"); setError(null); }}
          className={`py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wide transition-all ${styleMode === "ai" ? 'bg-brand-cyan text-slate-950 font-bold shadow-md' : 'text-neutral-400 hover:text-white'}`}
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Gemini AI Engine</span>
        </button>
        <button
          onClick={() => { setStyleMode("manual"); setError(null); }}
          className={`py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wide transition-all ${styleMode === "manual" ? 'bg-brand-cyan text-slate-950 font-bold shadow-md' : 'text-neutral-400 hover:text-white'}`}
        >
          <Image className="w-4 h-4" />
          <span>Manual Workspace</span>
        </button>
      </div>

      {/* Input Group: Username */}
      <div className="mb-4">
        <label className="text-xs font-bold text-neutral-400 tracking-wide uppercase block mb-1">
          Creator Username
        </label>
        <input
          type="text"
          value={creatorName}
          onChange={(e) => setCreatorName(e.target.value)}
          maxLength={18}
          placeholder="Enter custom username"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-brand-cyan text-sm"
        />
      </div>

      {/* Conditionally Render Mode */}
      {styleMode === "ai" ? (
        /* AI Generator Block */
        <div className="space-y-4 flex-1 flex flex-col">
          <div>
            <label className="text-xs font-bold text-neutral-400 tracking-wide uppercase block mb-1.5">
              Describe your idea to Gemini 3.5
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Programming in raw javascript vs static typescript..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-brand-cyan text-sm leading-relaxed"
            />
          </div>

          {/* Quick suggestions */}
          <div>
            <span className="text-2xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">
              Inspire yourself (Quick Tap)
            </span>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((p, key) => (
                <button
                  key={key}
                  onClick={() => setPrompt(p)}
                  className="p-2.5 px-3 bg-zinc-900 hover:bg-zinc-850 hover:border-zinc-700 transition border border-zinc-800 rounded-xl text-3xs font-medium text-zinc-400 text-left line-clamp-2 cursor-pointer"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-950/40 p-4 border border-rose-900/60 rounded-xl flex items-start gap-3 mt-4 text-rose-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold">Generation warning: </span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Loading status */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 bg-zinc-900 rounded-2xl border border-zinc-800 my-4"
              >
                <div className="relative mb-4">
                  <div className="w-12 h-12 border-4 border-brand-cyan/20 border-t-brand-cyan rounded-full animate-spin" />
                  <Sparkles className="w-5 h-5 text-brand-magenta absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <span className="text-xs font-semibold tracking-wide text-white animate-pulse">
                  {loadingPhrase}
                </span>
                <span className="text-4xs text-zinc-550 mt-1 uppercase tracking-widest font-mono">
                  Powered by Google GenAI
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generated Card Review */}
          <AnimatePresence>
            {generatedMeme && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 my-2.5"
              >
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Success! AI Recipe Complete
                </span>
                
                {/* Visual Card Frame */}
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl flex flex-col justify-between p-6">
                  <img 
                    src={generatedMeme.src} 
                    alt="Meme Backdrop" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-color-dodge select-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80 pointer-events-none" />

                  {/* Top overlay */}
                  <h3 className="relative z-10 text-center font-display font-extrabold text-xl tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] break-words w-full uppercase">
                    {generatedMeme.topText}
                  </h3>

                  {/* Bottom overlay */}
                  <h3 className="relative z-10 text-center font-display font-extrabold text-xl tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] break-words w-full uppercase mt-auto pb-2">
                    {generatedMeme.bottomText}
                  </h3>
                </div>

                {/* Info Fields */}
                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-xs text-neutral-300">
                  <p className="font-medium text-white mb-2 leading-relaxed">
                    "{generatedMeme.caption}"
                  </p>
                  <div className="flex flex-wrap gap-2 font-mono text-[10px] text-brand-cyan">
                    {generatedMeme.tags.map((t, idx) => (
                      <span key={idx}>#{t}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleGenerate}
                    className="py-3 bg-zinc-800 hover:bg-zinc-700 transition font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reroast</span>
                  </button>
                  <button
                    onClick={handlePublish}
                    className="py-3 bg-brand-cyan hover:bg-opacity-95 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Publish Reel</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trigger generator button if nothing is generated yet */}
          {!generatedMeme && !loading && (
            <button
              onClick={handleGenerate}
              className="w-full py-4 mt-auto bg-brand-cyan hover:bg-opacity-90 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 select-none shadow-lg shadow-brand-cyan/10 active:scale-95 transition-all text-xs"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>⚡ Generate AI Meme</span>
            </button>
          )}
        </div>
      ) : (
        /* Manual workspace block */
        <div className="space-y-4 flex-1 flex flex-col">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-neutral-400 tracking-wide uppercase block mb-1">
                Top Overlay Text
              </label>
              <input
                type="text"
                placeholder="e.g. ME WRITING TYPESCRIPT"
                value={manualTopText}
                onChange={(e) => setManualTopText(e.target.value)}
                maxLength={30}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-brand-cyan text-sm uppercase"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-400 tracking-wide uppercase block mb-1">
                Bottom Overlay Text
              </label>
              <input
                type="text"
                placeholder="e.g. WITH NO COMPILE WARNINGS"
                value={manualBottomText}
                onChange={(e) => setManualBottomText(e.target.value)}
                maxLength={30}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-brand-cyan text-sm uppercase"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-400 tracking-wide uppercase block mb-1">
                Context Roast (Caption)
              </label>
              <textarea
                rows={2}
                placeholder="Write down the funniest explanation possible..."
                value={manualCaption}
                onChange={(e) => setManualCaption(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-brand-cyan text-sm leading-relaxed"
              />
            </div>

            {/* Backdrop selection */}
            <div>
              <label className="text-xs font-bold text-neutral-400 tracking-wide uppercase block mb-2">
                Select Meme Canvas
              </label>
              <div className="grid grid-cols-4 gap-2">
                {manualGrads.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setManualBgStyle(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 relative cursor-pointer ${manualBgStyle === idx ? 'border-brand-cyan bg-zinc-800 shadow-md scale-95' : 'border-transparent bg-zinc-900'}`}
                  >
                    <img src={src} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                    {manualBgStyle === idx && (
                      <div className="absolute inset-0 bg-brand-cyan/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-brand-cyan" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handlePublish}
            disabled={!manualTopText && !manualBottomText}
            className="w-full py-4 mt-auto bg-brand-cyan hover:bg-opacity-90 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 select-none shadow-lg shadow-brand-cyan/10 active:scale-95 transition-all text-xs disabled:opacity-40 disabled:active:scale-100"
          >
            <Check className="w-4 h-4" />
            <span>Publish Custom Reel</span>
          </button>
        </div>
      )}
    </div>
  );
}
