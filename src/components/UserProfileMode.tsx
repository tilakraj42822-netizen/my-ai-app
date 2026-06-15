import React, { useState } from "react";
import { User, Heart, Bookmark, Sliders, LogOut, CheckCircle2, ShieldAlert, Sparkles, Code, Volume2, Moon } from "lucide-react";
import { MemeItem, UserProfile } from "../types";

interface UserProfileModeProps {
  profile: UserProfile;
  memes: MemeItem[];
  savedMemes: string[]; // IDs
  onSelectMeme: (meme: MemeItem) => void;
  onSignOut: () => void;
  // Settings adjusters
  adsEnabled: boolean;
  setAdsEnabled: (v: boolean) => void;
  devModeActive: boolean;
  setDevModeActive: (v: boolean) => void;
}

export default function UserProfileMode({
  profile,
  memes,
  savedMemes,
  onSelectMeme,
  onSignOut,
  adsEnabled,
  setAdsEnabled,
  devModeActive,
  setDevModeActive
}: UserProfileModeProps) {
  const [activeTab, setActiveTab] = useState<"creations" | "likes" | "saved">("creations");
  const [showSettings, setShowSettings] = useState(false);

  // Filter memes for tabs
  const creationsList = memes.filter(m => m.creator.username === profile.username);
  const likesList = memes.filter(m => m.likedByUser);
  const savedList = memes.filter(m => savedMemes.includes(m.id) || m.savedByUser);

  const activeList = 
    activeTab === "creations" ? creationsList :
    activeTab === "likes" ? likesList : savedList;

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 text-slate-100 flex flex-col pb-20">
      
      {/* Top Banner Cover */}
      <div className="h-28 bg-gradient-to-r from-indigo-950 via-zinc-900 to-brand-magenta/30 relative shrink-0">
        <button
          onClick={() => setShowSettings(true)}
          className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>

      {/* Profile Header Block */}
      <div className="px-6 pb-4 -mt-10 relative space-y-4 shrink-0">
        <div className="flex items-end justify-between">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-zinc-950 bg-zinc-900 shadow-xl"
            referrerPolicy="no-referrer"
          />
          <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-zinc-400 font-mono">
            ID: {profile.username}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="font-display font-black text-xl text-white tracking-tight">{profile.name}</h2>
            {profile.verified && (
              <CheckCircle2 className="w-4 h-4 text-brand-cyan fill-slate-950" />
            )}
          </div>
          <p className="text-zinc-500 text-xs">@{profile.username}</p>
        </div>

        <p className="text-zinc-350 text-xs leading-relaxed">{profile.bio}</p>

        {/* Stats segment */}
        <div className="flex gap-6 py-2 border-y border-zinc-900 justify-start">
          <div className="text-left">
            <span className="block font-black text-sm text-white">{profile.following}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Following</span>
          </div>
          <div className="text-left">
            <span className="block font-black text-sm text-white">
              {profile.followers >= 1000 ? `${(profile.followers / 1000).toFixed(1)}k` : profile.followers}
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Followers</span>
          </div>
          <div className="text-left">
            <span className="block font-black text-sm text-white">
              {creationsList.length}
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Uploads</span>
          </div>
        </div>
      </div>

      {/* Tabs Selector list */}
      <div className="grid grid-cols-3 border-b border-zinc-900 shrink-0">
        <button
          onClick={() => setActiveTab("creations")}
          className={`py-3.5 text-xs font-semibold flex flex-col items-center gap-1 transition-colors group cursor-pointer ${activeTab === "creations" ? 'text-brand-cyan border-b-2 border-brand-cyan font-bold' : 'text-zinc-500 hover:text-white'}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>My AI Memes ({creationsList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("likes")}
          className={`py-3.5 text-xs font-semibold flex flex-col items-center gap-1 transition-colors group cursor-pointer ${activeTab === "likes" ? 'text-brand-magenta border-b-2 border-brand-magenta font-bold' : 'text-zinc-500 hover:text-white'}`}
        >
          <Heart className="w-4 h-4" />
          <span>Liked ({likesList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`py-3.5 text-xs font-semibold flex flex-col items-center gap-1 transition-colors group cursor-pointer ${activeTab === "saved" ? 'text-indigo-400 border-b-2 border-indigo-400 font-bold' : 'text-zinc-500 hover:text-white'}`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Bookmarks ({savedList.length})</span>
        </button>
      </div>

      {/* Listed Content Grid */}
      <div className="flex-1 p-3">
        {activeList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-600">
            <Moon className="w-10 h-10 mb-2.5 text-zinc-850" />
            <p className="text-xs font-medium">This grid is currently empty.</p>
            <p className="text-[10px] mt-0.5 text-zinc-700">Explore and swipe the vertical feed to assemble humor!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {activeList.map((meme) => (
              <div
                key={meme.id}
                onClick={() => onSelectMeme(meme)}
                className="aspect-square bg-zinc-900 rounded-lg overflow-hidden border border-zinc-900 cursor-pointer relative hover:border-zinc-750 transition"
              >
                <img src={meme.src} alt="Meme Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                
                {/* Text overlays indicators */}
                {meme.topText && (
                  <div className="absolute top-1 left-0 right-0 px-1 pointer-events-none">
                    <p className="text-[6px] font-bold text-white text-center uppercase truncate drop-shadow">
                      {meme.topText}
                    </p>
                  </div>
                )}
                <div className="absolute bottom-1 right-1.5 text-[8px] font-mono text-zinc-400 bg-black/60 px-1 rounded">
                  ❤️{meme.likes}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings Dialog Overlay */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-end justify-center">
          <div className="w-full bg-zinc-900 rounded-t-[28px] border-t border-zinc-800 p-6 space-y-6 text-slate-100">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-brand-cyan" />
                <h3 className="font-display font-black text-lg text-white">App Settings</h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-xs bg-zinc-800 p-1.5 px-3 rounded-xl hover:text-white transition"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              {/* AdMob Toggle */}
              <div className="flex items-center justify-between p-4 bg-zinc-850 rounded-xl border border-zinc-800">
                <div className="text-left">
                  <span className="block font-bold text-xs text-white">AdMob Ad Placeholders</span>
                  <span className="text-[10px] text-zinc-450 block mt-0.5">Show native banner & list ads as monetization placeholders</span>
                </div>
                <button
                  onClick={() => setAdsEnabled(!adsEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${adsEnabled ? 'bg-brand-cyan' : 'bg-zinc-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-slate-950 transition-all ${adsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Developer Retro Mode Toggle */}
              <div className="flex items-center justify-between p-4 bg-zinc-850 rounded-xl border border-zinc-800">
                <div className="text-left">
                  <span className="block font-bold text-xs text-white">Developer Matrix Mode</span>
                  <span className="text-[10px] text-zinc-450 block mt-0.5">Toggle animated scanline CRT overlay for maximum hacker mood</span>
                </div>
                <button
                  onClick={() => setDevModeActive(!devModeActive)}
                  className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${devModeActive ? 'bg-brand-magenta' : 'bg-zinc-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-slate-100 transition-all ${devModeActive ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Core Credits info */}
              <div className="p-3.5 bg-neutral-950 border border-zinc-850 rounded-xl flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-zinc-500" />
                <div className="text-left text-3xs text-zinc-500 leading-normal">
                  <span className="font-bold text-zinc-400 block">Durable Cloud Sync Available</span>
                  Run "set_up_firebase" in AI Studio to bind your custom Spark Firestore DB dynamically.
                </div>
              </div>

              {/* Sign Out Trigger */}
              <button
                onClick={() => {
                  onSignOut();
                  setShowSettings(false);
                }}
                className="w-full py-3.5 bg-zinc-800 hover:bg-rose-950/40 hover:text-rose-400 transition font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-zinc-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Reset User Auth State</span>
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
