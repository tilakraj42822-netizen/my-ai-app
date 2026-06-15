import React, { useState, useEffect } from "react";
import AndroidShell from "./components/AndroidShell";
import AuthScreen from "./components/AuthScreen";
import MemeFeed from "./components/MemeFeed";
import ExploreGrid from "./components/ExploreGrid";
import MemeCreator from "./components/MemeCreator";
import UserProfileMode from "./components/UserProfileMode";
import CommentsDrawer from "./components/CommentsDrawer";
import ShareModal from "./components/ShareModal";
import { MemeItem, UserProfile, Comment } from "./types";
import { Compass, Search, PlusCircle, User, Terminal } from "lucide-react";
import { auth, db, handleFirestoreError, OperationType } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { 
  collection, 
  onSnapshot, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy, 
  deleteDoc, 
  writeBatch 
} from "firebase/firestore";
import { defaultMemes } from "./data";

export default function App() {
  // Navigation tabs: 'feed' | 'explore' | 'create' | 'profile'
  const [currentTab, setCurrentTab] = useState<"feed" | "explore" | "create" | "profile">("feed");
  
  // User Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Core Meme Catalog
  const [memes, setMemes] = useState<MemeItem[]>([]);
  const [likedMemeIds, setLikedMemeIds] = useState<{ [id: string]: boolean }>({});
  const [savedMemeIds, setSavedMemeIds] = useState<string[]>([]);
  
  // Real-time comments drawer state
  const [activeMemeComments, setActiveMemeComments] = useState<Comment[]>([]);

  // Bottom Draggables Overlays State
  const [activeCommentsMeme, setActiveCommentsMeme] = useState<MemeItem | null>(null);
  const [activeShareMeme, setActiveShareMeme] = useState<MemeItem | null>(null);

  // Advanced Interactive Settings
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [devModeActive, setDevModeActive] = useState(false);

  // Mount Firebase observers
  useEffect(() => {
    // 1. Listen to Auth State Changed
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profileSnap = await getDoc(doc(db, "users", firebaseUser.uid));
          if (profileSnap.exists()) {
            setUserProfile(profileSnap.data() as UserProfile);
            setIsAuthenticated(true);
          } else {
            const tempProfile: UserProfile = {
              username: firebaseUser.displayName 
                ? firebaseUser.displayName.toLowerCase().replace(/\s+/g, "_") 
                : "user_" + firebaseUser.uid.substring(0, 5),
              name: firebaseUser.displayName || "Meme Breeder",
              avatar: firebaseUser.photoURL || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60",
              bio: "Mysterious MemeVerse explorer.",
              followers: 12,
              following: 15,
              verified: false
            };
            await setDoc(doc(db, "users", firebaseUser.uid), tempProfile);
            setUserProfile(tempProfile);
            setIsAuthenticated(true);
          }
        } catch (err) {
          console.warn("User profile setup in Firestore skipped:", err);
          // Fallback static profile
          setUserProfile({
            username: "guest_" + firebaseUser.uid.substring(0, 5),
            name: "Meme Guest",
            avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60",
            bio: "Offline Guest session",
            followers: 0,
            following: 0,
            verified: false
          });
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
        setUserProfile(null);
      }
    });

    // 2. Listen to real-time MEMES collection with auto-seeding
    const unsubscribeMemes = onSnapshot(collection(db, "memes"), async (snapshot) => {
      if (snapshot.empty) {
        console.log("No memes detected in remote collection, auto seeding defaults...");
        try {
          const batch = writeBatch(db);
          defaultMemes.forEach((m) => {
            const mRef = doc(db, "memes", m.id);
            batch.set(mRef, {
              ...m,
              createdAt: new Date().toISOString()
            });
          });
          await batch.commit();
        } catch (dbErr) {
          console.warn("Database automatic seed transaction refused. Utilizing local catalog:", dbErr);
          setMemes(defaultMemes);
        }
      } else {
        const loaded = snapshot.docs.map(docSnap => ({
          ...docSnap.data(),
          id: docSnap.id
        } as MemeItem));

        // Sort: custom user-created/upload/ai ones on top, then default ones
        loaded.sort((a, b) => {
          const scoreA = a.id.startsWith("upload-") || a.id.startsWith("ai-") ? 1 : 0;
          const scoreB = b.id.startsWith("upload-") || b.id.startsWith("ai-") ? 1 : 0;
          return scoreB - scoreA;
        });

        setMemes(loaded);
      }
    }, (snapshotErr) => {
      console.warn("Real-time memes listener faulted, streaming simulation:", snapshotErr);
      setMemes(defaultMemes);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMemes();
    };
  }, []);

  // Sync user saved files and bookmarks list dynamically if profiles log in
  useEffect(() => {
    if (!userProfile || !auth.currentUser) {
      setSavedMemeIds([]);
      setLikedMemeIds({});
      return;
    }

    const savesRef = collection(db, "users", auth.currentUser.uid, "saves");
    const unsubscribeSaves = onSnapshot(savesRef, (snap) => {
      const ids = snap.docs.map(d => d.id);
      setSavedMemeIds(ids);
    }, (savesErr) => {
      console.warn("Could not read user saves stream:", savesErr);
    });

    return () => {
      unsubscribeSaves();
    };
  }, [userProfile]);

  // Real-time subcollection comment listener for open drawer
  useEffect(() => {
    if (!activeCommentsMeme) {
      setActiveMemeComments([]);
      return;
    }

    const commentsRef = collection(db, "memes", activeCommentsMeme.id, "comments");
    const unsubscribeComments = onSnapshot(commentsRef, (snap) => {
      const list = snap.docs.map(d => d.data() as Comment);
      // Sort newest comments on top if timestamp exists
      list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      setActiveMemeComments(list);
    }, (commentErr) => {
      console.warn("Could not fetch feedback subcollection feeds:", commentErr);
    });

    return () => {
      unsubscribeComments();
    };
  }, [activeCommentsMeme]);

  const handleAuthSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsAuthenticated(true);
    setCurrentTab("feed");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setUserProfile(null);
      setCurrentTab("feed");
    } catch (e) {
      console.error("Sign out action threw credentials error:", e);
    }
  };

  // Like operations synced with Firestore subcollections
  const handleToggleLike = async (memeId: string) => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const likeDocRef = doc(db, "memes", memeId, "likes", userId);
    const memeDocRef = doc(db, "memes", memeId);

    const isCurrentlyLiked = likedMemeIds[memeId] || false;

    // Optimistic UI update
    setLikedMemeIds(prev => ({ ...prev, [memeId]: !isCurrentlyLiked }));
    setMemes(current => 
      current.map(m => m.id === memeId ? { ...m, likes: Math.max(0, m.likes + (isCurrentlyLiked ? -1 : 1)) } : m)
    );

    try {
      if (isCurrentlyLiked) {
        await deleteDoc(likeDocRef);
        await updateDoc(memeDocRef, {
          likes: Math.max(0, (memes.find(m => m.id === memeId)?.likes || 1) - 1)
        });
      } else {
        await setDoc(likeDocRef, { userId, createdAt: new Date().toISOString() });
        await updateDoc(memeDocRef, {
          likes: (memes.find(m => m.id === memeId)?.likes || 0) + 1
        });
      }
    } catch (err) {
      console.error("Like synchronization failed:", err);
      // Rollback
      setLikedMemeIds(prev => ({ ...prev, [memeId]: isCurrentlyLiked }));
      setMemes(current => 
        current.map(m => m.id === memeId ? { ...m, likes: Math.max(0, m.likes + (isCurrentlyLiked ? 1 : -1)) } : m)
      );
      handleFirestoreError(err, OperationType.UPDATE, `memes/${memeId}/likes/${userId}`);
    }
  };

  // Saved bookmark operations mapping 1:1 with Firestore subcollections
  const handleToggleSave = async (memeId: string) => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const saveDocRef = doc(db, "users", userId, "saves", memeId);

    const isCurrentlySaved = savedMemeIds.includes(memeId);

    // Optimistically update
    setSavedMemeIds(prev => isCurrentlySaved ? prev.filter(id => id !== memeId) : [...prev, memeId]);

    try {
      if (isCurrentlySaved) {
        await deleteDoc(saveDocRef);
      } else {
        await setDoc(saveDocRef, { userId, createdAt: new Date().toISOString() });
      }
    } catch (err) {
      console.error("Bookmark registry synchronization failed:", err);
      setSavedMemeIds(prev => isCurrentlySaved ? [...prev, memeId] : prev.filter(id => id !== memeId));
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}/saves/${memeId}`);
    }
  };

  // Follow operations mapping creator records
  const handleToggleFollow = async (creatorUsername: string) => {
    if (!auth.currentUser || !userProfile) return;

    const userId = auth.currentUser.uid;
    const followDocRef = doc(db, "users", userId, "following", creatorUsername);

    setMemes(currentList =>
      currentList.map(m => {
        if (m.creator.username === creatorUsername) {
          const isFollowing = m.creator.following;
          return {
            ...m,
            creator: {
              ...m.creator,
              following: !isFollowing,
              followers: Math.max(0, m.creator.followers + (isFollowing ? -1 : 1))
            }
          };
        }
        return m;
      })
    );

    try {
      const snap = await getDoc(followDocRef);
      if (snap.exists()) {
        await deleteDoc(followDocRef);
      } else {
        await setDoc(followDocRef, {
          followerId: userId,
          creatorUsername,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Follow toggling failed:", err);
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}/following/${creatorUsername}`);
    }
  };

  // Add Comment on specific active Meme reels
  const handleAddComment = async (text: string) => {
    if (!activeCommentsMeme || !userProfile || !auth.currentUser) return;

    const memeId = activeCommentsMeme.id;
    const freshComment: Comment = {
      username: userProfile.username,
      avatar: userProfile.avatar,
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " ago"
    };

    try {
      // Create new subcollection document
      const commentDocRef = doc(collection(db, "memes", memeId, "comments"));
      await setDoc(commentDocRef, {
        ...freshComment,
        createdAt: new Date().toISOString()
      });

      // Update total comments counter dynamically
      const memeRef = doc(db, "memes", memeId);
      const newCommentsCount = (activeCommentsMeme.commentsCount || 0) + 1;
      await updateDoc(memeRef, {
        commentsCount: newCommentsCount
      });

      // Update current active slide-up
      const updatedMeme = {
        ...activeCommentsMeme,
        commentsCount: newCommentsCount,
        comments: [freshComment, ...activeCommentsMeme.comments]
      };
      setActiveCommentsMeme(updatedMeme);

    } catch (err) {
      console.error("Adding feedback item to Firestore failed:", err);
      handleFirestoreError(err, OperationType.CREATE, `memes/${memeId}/comments`);
    }
  };

  // Append new AI created or uploaded meme securely
  const handleMemeCreated = async (newMeme: MemeItem) => {
    try {
      await setDoc(doc(db, "memes", newMeme.id), {
        ...newMeme,
        createdAt: new Date().toISOString()
      });
      setCurrentTab("feed");
    } catch (err) {
      console.error("Meme upload to database refused. Creating locally:", err);
      setMemes(prev => [newMeme, ...prev]);
      setLikedMemeIds(prev => ({ ...prev, [newMeme.id]: false }));
      handleFirestoreError(err, OperationType.CREATE, `memes/${newMeme.id}`);
    }
  };

  // Filter ads dynamically
  const visibleMemes = memes.filter((m) => {
    if (m.isAd) return adsEnabled;
    return true;
  });

  // Map bookmarked list array directly to dictionary lookup
  const savedStatesObj = savedMemeIds.reduce((acc, id) => {
    acc[id] = true;
    return acc;
  }, {} as { [id: string]: boolean });

  return (
    <AndroidShell>
      
      {/* Absolute CRT Scanline hackers overlay when dev mode is active */}
      {devModeActive && (
        <div className="absolute inset-0 z-40 pointer-events-none mix-blend-overlay opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] overflow-hidden">
          <div className="absolute inset-0 bg-brand-cyan/5 animate-pulse" />
          <div className="absolute top-2 left-6 text-[8px] font-mono text-brand-cyan/85 py-1 px-2 bg-slate-950/80 rounded border border-brand-cyan/40 flex items-center gap-1">
            <Terminal className="w-3 h-3 text-brand-cyan" />
            <span>MemeVerse: Database Stream Active</span>
          </div>
        </div>
      )}

      {/* Main App Content router */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {!isAuthenticated ? (
          <AuthScreen onAuthSuccess={handleAuthSuccess} />
        ) : (
          <>
            {/* Nav Views Screen Dispatcher */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {currentTab === "feed" && (
                <MemeFeed
                  memes={visibleMemes}
                  likedStates={likedMemeIds}
                  savedStates={savedStatesObj}
                  onToggleLike={handleToggleLike}
                  onToggleSave={handleToggleSave}
                  onToggleFollow={handleToggleFollow}
                  onOpenComments={(item) => setActiveCommentsMeme(item)}
                  onOpenShare={(item) => setActiveShareMeme(item)}
                />
              )}

              {currentTab === "explore" && (
                <ExploreGrid
                  memes={visibleMemes}
                  onSelectMeme={(item) => {
                    const itemIndex = visibleMemes.findIndex((m) => m.id === item.id);
                    if (itemIndex !== -1) {
                      setCurrentTab("feed");
                    }
                  }}
                />
              )}

              {currentTab === "create" && (
                <MemeCreator
                  onMemeCreated={handleMemeCreated}
                  onBackToFeed={() => setCurrentTab("feed")}
                />
              )}

              {currentTab === "profile" && userProfile && (
                <UserProfileMode
                  profile={userProfile}
                  memes={memes}
                  savedMemes={savedMemeIds}
                  onSelectMeme={(item) => {
                    setCurrentTab("feed");
                  }}
                  onSignOut={handleSignOut}
                  adsEnabled={adsEnabled}
                  setAdsEnabled={setAdsEnabled}
                  devModeActive={devModeActive}
                  setDevModeActive={setDevModeActive}
                />
              )}
            </div>

            {/* Android Navigation Bar (Bottom Navigation) */}
            <div className="h-16 bg-slate-950 border-t border-zinc-900 flex items-center justify-around px-2 select-none shrink-0 z-30">
              
              <button
                onClick={() => setCurrentTab("feed")}
                className={`flex flex-col items-center gap-1.5 py-1 px-3.5 transition-all text-2xs font-semibold cursor-pointer ${currentTab === "feed" ? "text-brand-magenta font-black scale-105" : "text-zinc-550 hover:text-zinc-200"}`}
              >
                <Compass className={`w-5.5 h-5.5 ${currentTab === "feed" ? "text-brand-magenta fill-brand-magenta/15" : ""}`} />
                <span>Reels</span>
              </button>

              <button
                onClick={() => setCurrentTab("explore")}
                className={`flex flex-col items-center gap-1.5 py-1 px-3.5 transition-all text-2xs font-semibold cursor-pointer ${currentTab === "explore" ? "text-brand-cyan font-black scale-105" : "text-zinc-550 hover:text-zinc-200"}`}
              >
                <Search className={`w-5.5 h-5.5 ${currentTab === "explore" ? "text-brand-cyan" : ""}`} />
                <span>Explore</span>
              </button>

              <button
                onClick={() => setCurrentTab("create")}
                className={`flex flex-col items-center gap-1.5 py-1 px-3.5 transition-all text-2xs font-semibold cursor-pointer relative ${currentTab === "create" ? "text-brand-cyan font-black scale-105" : "text-zinc-550 hover:text-zinc-200"}`}
              >
                <div className="absolute top-[-22px] w-12 h-12 rounded-full bg-brand-cyan shadow-lg shadow-brand-cyan/20 border-4 border-slate-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer">
                  <PlusCircle className="w-7 h-7 text-slate-950 stroke-[3.5]" />
                </div>
                <span className="mt-4 pt-1">Create Roast</span>
              </button>

              <button
                onClick={() => setCurrentTab("profile")}
                className={`flex flex-col items-center gap-1.5 py-1 px-3.5 transition-all text-2xs font-semibold cursor-pointer ${currentTab === "profile" ? "text-brand-cyan font-black scale-105" : "text-zinc-550 hover:text-zinc-200"}`}
              >
                <User className={`w-5.5 h-5.5 ${currentTab === "profile" ? "text-brand-cyan fill-brand-cyan/15" : ""}`} />
                <span>My Stack</span>
              </button>

            </div>
          </>
        )}
      </div>

      {/* Slide-Ups Overlays */}
      <CommentsDrawer
        isOpen={activeCommentsMeme !== null}
        onClose={() => setActiveCommentsMeme(null)}
        comments={activeMemeComments.length > 0 ? activeMemeComments : (activeCommentsMeme ? activeCommentsMeme.comments : [])}
        onAddComment={handleAddComment}
      />

      <ShareModal
        isOpen={activeShareMeme !== null}
        onClose={() => setActiveShareMeme(null)}
        item={activeShareMeme}
      />

    </AndroidShell>
  );
}
