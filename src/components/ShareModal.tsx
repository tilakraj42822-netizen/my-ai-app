import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Copy, QrCode, MessageCircle, Send, Check } from "lucide-react";
import { MemeItem } from "../types";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MemeItem | null;
}

export default function ShareModal({ isOpen, onClose, item }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopy = () => {
    if (!item) return;
    const shareUrl = `${window.location.origin}/share/meme/${item.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const platforms = [
    { name: "WhatsApp", icon: MessageCircle, color: "bg-emerald-650 text-white" },
    { name: "Insta Story", icon: Send, color: "bg-pink-600 text-white" },
    { name: "Twitter / X", icon: X, color: "bg-neutral-800 text-white" },
  ];

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black z-40"
          />

          {/* Social Share Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="absolute bottom-0 left-0 right-0 h-[48%] bg-zinc-900 rounded-t-[28px] border-t border-zinc-800 flex flex-col p-6 z-50 text-slate-100"
          >
            {/* Draggability indicator */}
            <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-lg font-display text-white">Share Meme</span>
              <button
                onClick={onClose}
                className="p-1 px-1.5 rounded-full hover:bg-zinc-800 text-neutral-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main sharing pathways */}
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              {showQR ? (
                /* Interactive Simulated QR Code Grid */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center p-4 bg-zinc-800 rounded-2xl"
                >
                  <div className="w-28 h-28 bg-white p-2 rounded-lg flex items-center justify-center relative">
                    {/* Retro / Tech QR Style */}
                    <div className="w-full h-full border-[6px] border-black bg-white flex flex-col justify-between p-1">
                      <div className="flex justify-between">
                        <div className="w-5 h-5 bg-black" />
                        <div className="w-5 h-5 bg-black" />
                      </div>
                      <div className="w-full flex-1 flex flex-wrap gap-1 justify-center items-center py-2">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className={`w-2.5 h-2.5 ${Math.random() > 0.4 ? 'bg-black' : 'bg-transparent'}`} />
                        ))}
                      </div>
                      <div className="flex justify-between">
                        <div className="w-5 h-5 bg-black" />
                        <div className="w-2 h-2 bg-black" />
                      </div>
                    </div>
                    {/* Accent logo center */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brand-cyan flex items-center justify-center border border-white">
                      <span className="text-[9px] font-bold text-slate-950 font-display">MV</span>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-300 mt-2 font-mono">Scan code to view on MemeVerse</span>
                  <button 
                    onClick={() => setShowQR(false)}
                    className="text-xs text-brand-cyan hover:underline mt-2 font-semibold"
                  >
                    Back to social hubs
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* Share platforms */}
                  <div className="flex justify-around items-center gap-2 py-2">
                    {platforms.map((platform, key) => (
                      <button
                        key={key}
                        onClick={() => {
                          alert(`Simulating share process on ${platform.name}!`);
                        }}
                        className="flex flex-col items-center gap-2 group cursor-pointer"
                      >
                        <div className={`w-14 h-14 rounded-full ${platform.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                          <platform.icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-zinc-400 group-hover:text-white transition-colors">
                          {platform.name}
                        </span>
                      </button>
                    ))}
                    
                    {/* QR Code toggle */}
                    <button
                      onClick={() => setShowQR(true)}
                      className="flex flex-col items-center gap-2 group cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-full bg-indigo-650 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <QrCode className="w-6 h-6" />
                      </div>
                      <span className="text-xs text-zinc-400 group-hover:text-white transition-colors">
                        Meme QR Code
                      </span>
                    </button>
                  </div>

                  {/* Copy Link Segment */}
                  <div className="space-y-2 mt-auto">
                    <span className="text-xs font-semibold text-zinc-450 tracking-wider uppercase">
                      Share Link
                    </span>
                    <div className="flex gap-2 bg-zinc-800 p-2.5 rounded-xl border border-zinc-700/60 items-center">
                      <span className="flex-1 text-xs text-zinc-300 truncate select-all pr-2">
                        {window.location.origin}/share/meme/{item.id}
                      </span>
                      <button
                        onClick={handleCopy}
                        className="p-2 px-3.5 bg-brand-cyan text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 hover:bg-opacity-90 active:scale-95 transition"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
