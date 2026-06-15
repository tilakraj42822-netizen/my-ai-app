import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, MessageSquare, Heart } from "lucide-react";
import { Comment } from "../types";

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (text: string) => void;
  title?: string;
}

export default function CommentsDrawer({ isOpen, onClose, comments, onAddComment }: CommentsDrawerProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Transparent backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black z-40"
          />

          {/* Comments Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="absolute bottom-0 left-0 right-0 h-[65%] bg-zinc-900 rounded-t-[28px] border-t border-zinc-800 flex flex-col z-50 text-slate-100"
          >
            {/* Header / Grab Handle */}
            <div className="flex flex-col items-center pt-3 pb-4 px-6 border-b border-zinc-800 shrink-0">
              <div className="w-10 h-1 bg-zinc-700 rounded-full mb-3" />
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-brand-cyan" />
                  <span className="font-semibold text-lg font-display text-white">
                    Comments ({comments.length})
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 px-1.5 rounded-full hover:bg-zinc-800 text-neutral-400 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="w-12 h-12 text-zinc-700 mb-3" />
                  <p className="text-zinc-500 text-sm">No comments yet.</p>
                  <p className="text-zinc-650 text-xs mt-1">Be the first to roast this meme!</p>
                </div>
              ) : (
                comments.map((comment, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex gap-3 text-sm items-start"
                  >
                    <img
                      src={comment.avatar}
                      alt={comment.username}
                      className="w-9 h-9 rounded-full object-cover border border-zinc-700 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-[13px] text-zinc-200">
                          @{comment.username}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-zinc-350 text-[13px] leading-relaxed break-words pr-2">
                        {comment.text}
                      </p>
                    </div>
                    <button className="text-zinc-500 hover:text-rose-500 flex flex-col items-center gap-0.5 mt-1">
                      <Heart className="w-3.5 h-3.5" />
                      <span className="text-[9px]">0</span>
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Input Form at Bottom */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-zinc-800 bg-zinc-925 shadow-top shrink-0 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Add a comment... (Be funny or prepare to get roasted)"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={200}
                className="flex-1 bg-zinc-800 text-zinc-100 text-sm rounded-xl px-4 py-3 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-cyan transition"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="p-3 bg-brand-cyan text-slate-950 font-semibold rounded-xl hover:bg-opacity-90 active:scale-95 transition disabled:opacity-50 disabled:active:scale-100 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
