import { MemeItem } from "./types";

export const defaultMemes: MemeItem[] = [
  {
    id: "meme-1",
    type: "image",
    src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800&auto=format&fit=crop",
    caption: "The absolute look of panic when a developer hears: 'Let's just deploy these changes directly to production'",
    topText: "YEAH, I TEST ON PRODUCTION",
    bottomText: "PRODUCTION TESTS ME BACK",
    likes: 1242,
    likedByUser: false,
    savedByUser: false,
    commentsCount: 2,
    comments: [
      { username: "DevDeity", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=60", text: "Bold of you to assume there is a testing environment.", timestamp: "2h ago" },
      { username: "CallbackCat", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=60", text: "Every user is a manual tester if you're brave enough.", timestamp: "1h ago" }
    ],
    creator: {
      username: "cyber_junkie",
      name: "Cyber Monk",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60",
      followers: 8430,
      following: false
    },
    audioTrack: "Original Sound - Coder Beats",
    tags: ["programming", "devlife", "production", "relatable"]
  },
  {
    id: "video-1",
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-fast-on-a-laptop-42352-large.mp4",
    caption: "Leaked footage of our senior engineer resolving an accidental git push force to the main branch at 4:59 PM...",
    topText: "",
    bottomText: "",
    likes: 3105,
    likedByUser: false,
    savedByUser: false,
    commentsCount: 3,
    comments: [
      { username: "MergeMaster", avatar: "https://images.unsplash.com/photo-1527983359383-4758693f760c?w=60&auto=format&fit=crop&q=60", text: "That keystroke per second rate is highly realistic.", timestamp: "5h ago" },
      { username: "StackSniper", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&auto=format&fit=crop&q=60", text: "git push --force solves everything... eventually.", timestamp: "3h ago" },
      { username: "CodeConfused", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&auto=format&fit=crop&q=60", text: "Hold my coffee, I'm calling git-reflog", timestamp: "1h ago" }
    ],
    creator: {
      username: "code_rush_99",
      name: "Code Rush",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
      followers: 21300,
      following: true
    },
    audioTrack: "Synthesizer Rush - Lofi Devs",
    tags: ["git", "devhumor", "terminal", "engineering"]
  },
  {
    id: "ad-1",
    type: "image",
    src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    caption: "Need an upgrade from legacy spaghetti code? Try MemeVerse Premium or master full-stack clean architecture today! (Sponsored)",
    topText: "MESSY SPAGHETTI CODE?",
    bottomText: "UPGRADE TO CLEAN MEMEVERSE PREMIUM",
    likes: 88,
    likedByUser: false,
    savedByUser: false,
    commentsCount: 1,
    comments: [
      { username: "SkepticSteve", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=60&auto=format&fit=crop&q=60", text: "Can this Ad fix my undefined is not a function?", timestamp: "1d ago" }
    ],
    creator: {
      username: "admob_network",
      name: "MemeVerse Ads",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60",
      followers: 99999,
      following: false
    },
    audioTrack: "Premium Sponsor - MemeVerse Music",
    tags: ["sponsored", "premium", "software", "career"],
    isAd: true
  },
  {
    id: "meme-2",
    type: "image",
    src: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=800&auto=format&fit=crop",
    caption: "How non-programmers think hackers look vs what is actually happening (just typing standard html boilerplates)",
    topText: "WHAT OTHERS THINK I AM DOING",
    bottomText: "WHAT I'M ACTUALLY DOING: DOC TYPE HTML",
    likes: 852,
    likedByUser: false,
    savedByUser: false,
    commentsCount: 1,
    comments: [
      { username: "WebWeaver", avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=60&auto=format&fit=crop&q=60", text: "Shh, don't tell them! They think we are magical sorcerers.", timestamp: "8h ago" }
    ],
    creator: {
      username: "hacker_hound",
      name: "Neo Coder",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60",
      followers: 4320,
      following: false
    },
    audioTrack: "Cyberpunk Ambience - Glitch Track",
    tags: ["hacking", "techlife", "html", "humor"]
  },
  {
    id: "video-2",
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-funny-cat-with-a-toy-42284-large.mp4",
    caption: "The AI agent writing robust concurrent database handlers while I watch, completely hypnotized by the cursor...",
    topText: "",
    bottomText: "",
    likes: 4561,
    likedByUser: false,
    savedByUser: false,
    commentsCount: 2,
    comments: [
      { username: "PromptWizard", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&auto=format&fit=crop&q=60", text: "I just say 'build it' and pray.", timestamp: "4h ago" },
      { username: "GatlingGun", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&auto=format&fit=crop&q=60", text: "Look at his claws go! Maximum computational speed.", timestamp: "2h ago" }
    ],
    creator: {
      username: "ai_enthusiast",
      name: "Future Pulse",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=60",
      followers: 12400,
      following: true
    },
    audioTrack: "Cute Cat Whistle - Meow Soundboards",
    tags: ["cats", "ai-art", "automation", "hypnotic"]
  }
];
