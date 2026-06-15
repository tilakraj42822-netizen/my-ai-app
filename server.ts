import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry User-Agent
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini SDK initialized successfully.");
  } else {
    console.log("No GEMINI_API_KEY found. AI features will run on highly intelligent local generator.");
  }
} catch (e) {
  console.error("Failed to initialize Gemini SDK:", e);
}

// Global In-Memory Database for demonstration/fallback
// (allowing instant, robust operation and persistence across the current container lifespan)
let activeMemes = [
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
    commentsCount: 34,
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
    commentsCount: 92,
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
    commentsCount: 3,
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
    commentsCount: 19,
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
    commentsCount: 147,
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
  },
  {
    id: "meme-3",
    type: "image",
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    caption: "The AI model explaining to me in extreme detail why a single missed semicolon broke my entire 2,000 line clean database handler",
    topText: "AI EXPLAINING RECURSION COMPLEXITY",
    bottomText: "ME JUST GLAD IT RUNS",
    likes: 1941,
    likedByUser: false,
    savedByUser: false,
    commentsCount: 41,
    comments: [
      { username: "SemicolonSlayer", avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=60&auto=format&fit=crop&q=60", text: "This is why TypeScript is a life saver.", timestamp: "6h ago" }
    ],
    creator: {
      username: "prompt_monk",
      name: "Prompt Monk",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60",
      followers: 1540,
      following: false
    },
    audioTrack: "Deep Focus - Lofi Study Chill",
    tags: ["programming", "funny", "debugging", "ai"]
  },
  {
    id: "video-3",
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-dog-running-on-the-grass-in-slow-motion-42291-large.mp4",
    caption: "Me running away from meetings to actually sit down and write code undisturbed as a happy puppy",
    topText: "",
    bottomText: "",
    likes: 5122,
    likedByUser: false,
    savedByUser: false,
    commentsCount: 110,
    comments: [
      { username: "NoMeetings", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=60", text: "Meetings should be emails on Discord tbh.", timestamp: "3h ago" }
    ],
    creator: {
      username: "puppy_code_labs",
      name: "Happy Labs",
      avatar: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=100&auto=format&fit=crop&q=60",
      followers: 6700,
      following: false
    },
    audioTrack: "Playful Goofy Tuba - Happy Tunes",
    tags: ["dogs", "officelife", "corporate", "running"]
  }
];

// Helper to generate hilarious meme template ideas locally
const generateLocalMeme = (prompt: string) => {
  const funCaptions = [
    "When you finally fix that one stubborn CSS bug but three buttons migrate entirely to the footer.",
    "My code explaining to the compiler that it actually did compile correctly yesterday.",
    "The junior developer confidently closing thirty open git merged issues within the first hour.",
    "That incredible burst of absolute pride after rewriting your backend with robust concurrent types."
  ];
  const funTops = [
    "IT FINALLY WORKS!",
    "NO CLUE HOW...",
    "ME WRITING REACT",
    "THE SENIOR DEV WAITING"
  ];
  const funBottoms = [
    "BUT DO NOT TOUCH ANYTHING.",
    "PLEASE JUST LET IT CHILL.",
    "BUT ABSOLUTELY MAGNIFICENT.",
    "STILL CONFUSED AND PROUD."
  ];

  const index = Math.floor(Math.random() * funCaptions.length);
  const colorGradients = [
    "linear-gradient(135deg, #FF007F 0%, #7F00FF 100%)",
    "linear-gradient(135deg, #00F0FF 0%, #0022FF 100%)",
    "linear-gradient(135deg, #f39c12 0%, #d35400 100%)",
    "linear-gradient(135deg, #1abc9c 0%, #2ecc71 100%)",
    "linear-gradient(135deg, #9b59b6 0%, #34495e 100%)"
  ];
  const selectedGrad = colorGradients[Math.floor(Math.random() * colorGradients.length)];

  // Create an elegant colored background using a stylized template SVG/Unsplash image placeholder
  const unsplashTemplates = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
    "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=800&q=80",
    "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80"
  ];
  const selectedImg = unsplashTemplates[Math.floor(Math.random() * unsplashTemplates.length)];

  return {
    id: `custom-meme-${Date.now()}`,
    type: "image",
    src: selectedImg,
    caption: `AI Response to '${prompt}': ${funCaptions[index]}`,
    topText: funTops[index],
    bottomText: funBottoms[index],
    likes: 42,
    likedByUser: false,
    savedByUser: false,
    commentsCount: 0,
    comments: [],
    creator: {
      username: "ai_bot_generator",
      name: "MemeVerse AI",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&auto=format&fit=crop&q=60",
      followers: 1250000,
      following: false
    },
    audioTrack: `AI Synth Symphony - ${prompt.substring(0, 10)}...`,
    tags: ["ai-generated", "memeverse", prompt.toLowerCase().replace(/\s+/g, "")]
  };
};

// API Endpoints
app.get("/api/memes", (req, res) => {
  res.json(activeMemes);
});

// Use Gemini API directly on the server to generate high-quality hilarious meme elements
app.post("/api/generate-meme", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Please provide a valid prompt for the meme!" });
  }

  if (ai) {
    try {
      console.log(`Querying Gemini with prompt: "${prompt}"`);
      // Ask Gemini for a JSON schema response matching the meme components
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Create a hilarious internet meme based on target concept: "${prompt}".
        Provide three fields:
        1. caption: A hilarious long caption that introduces the context or joke.
        2. topText: An punchy, funny top overlay text formatted in CAPITAL letters. Keep it short (1-5 words).
        3. bottomText: A punchy, hilarious bottom overlay text formatted in CAPITAL letters. Keep it short (1-5 words).
        4. tags: An array of 3-4 funny relevant hashtags.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              caption: { type: Type.STRING, description: "A highly humorous caption to describe the meme or situation." },
              topText: { type: Type.STRING, description: "Punchy, relatable text overlay on the top of the meme." },
              bottomText: { type: Type.STRING, description: "Punchy, relatable text overlay on the bottom." },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of 3 relevant hilarious hashtags"
              }
            },
            required: ["caption", "topText", "bottomText", "tags"]
          }
        }
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText.trim());
        
        // Match with a beautiful dynamic abstract visual backdrop to host the text overlay
        const unsplashBackdrops = [
          "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop", // colorful liquid
          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop", // retro consoles
          "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop", // neon signs
          "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop", // beautiful laser neon
          "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop", // mesh gradient
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"  // dark futuristic shapes
        ];
        
        // Select backdrop based on prompt length or random
        const backdropUrl = unsplashBackdrops[Math.floor(Math.random() * unsplashBackdrops.length)];

        const newMeme = {
          id: `ai-meme-${Date.now()}`,
          type: "image",
          src: backdropUrl,
          caption: parsed.caption,
          topText: parsed.topText.toUpperCase(),
          bottomText: parsed.bottomText.toUpperCase(),
          likes: 310,
          likedByUser: false,
          savedByUser: false,
          commentsCount: 2,
          comments: [
            { username: "GeminiBot", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&auto=format&fit=crop&q=60", text: "I generated this setup with pure algorithmic love 😂", timestamp: "Just now" },
            { username: "CodePurist", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=60", text: "This is highly accurate.", timestamp: "Just now" }
          ],
          creator: {
            username: "gemini_chef",
            name: "MemeVerse AI Chef",
            avatar: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&auto=format&fit=crop&q=60",
            followers: 450300,
            following: false
          },
          audioTrack: `AI Grooves - prompt: ${prompt}`,
          tags: parsed.tags || ["ai", "memeverse", "gemini"]
        };

        activeMemes.unshift(newMeme);
        return res.json(newMeme);
      }
    } catch (err) {
      console.error("Gemini invocation failed, launching fallback generator:", err);
    }
  }

  // Fallback in case of missing model/keys
  const fallbackMeme = generateLocalMeme(prompt);
  activeMemes.unshift(fallbackMeme);
  return res.json(fallbackMeme);
});

// Save simulated likes, comments and uploads to active in-memory list
app.post("/api/memes/:id/like", (req, res) => {
  const { id } = req.params;
  const meme = activeMemes.find(m => m.id === id);
  if (meme) {
    meme.likedByUser = !meme.likedByUser;
    meme.likes += meme.likedByUser ? 1 : -1;
    return res.json({ id: meme.id, likes: meme.likes, likedByUser: meme.likedByUser });
  }
  return res.status(404).json({ error: "Meme not found" });
});

app.post("/api/memes/:id/save", (req, res) => {
  const { id } = req.params;
  const meme = activeMemes.find(m => m.id === id);
  if (meme) {
    meme.savedByUser = !meme.savedByUser;
    return res.json({ id: meme.id, savedByUser: meme.savedByUser });
  }
  return res.status(404).json({ error: "Meme not found" });
});

app.post("/api/memes/:id/comment", (req, res) => {
  const { id } = req.params;
  const { author, text } = req.body;
  const meme = activeMemes.find(m => m.id === id);
  if (meme && text) {
    const newComment = {
      username: author || "GamerGuise",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=60",
      text,
      timestamp: "Just now"
    };
    meme.comments.unshift(newComment);
    meme.commentsCount = meme.comments.length;
    return res.json(meme);
  }
  return res.status(404).json({ error: "Meme or template not found" });
});

app.post("/api/memes/upload", (req, res) => {
  const { caption, topText, bottomText, imageSrc, creatorName } = req.body;
  const createdMeme = {
    id: `upload-${Date.now()}`,
    type: "image",
    src: imageSrc || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800&auto=format&fit=crop",
    caption: caption || "Meme uploaded by a talented user",
    topText: (topText || "").toUpperCase(),
    bottomText: (bottomText || "").toUpperCase(),
    likes: 1,
    likedByUser: true,
    savedByUser: false,
    commentsCount: 0,
    comments: [],
    creator: {
      username: creatorName ? creatorName.toLowerCase().replace(/\s+/g, "_") : "anonymous_user",
      name: creatorName || "Anonymous Creator",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=60",
      followers: 1,
      following: false
    },
    audioTrack: "Original Track - User Sound",
    tags: ["user-upload", "memeverse", "exclusive"]
  };
  activeMemes.unshift(createdMeme);
  res.json(createdMeme);
});

// Set up Vite & build asset delivery pipeline
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode with Express + Vite Middleware integrated
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Middlewares running in development mode.");
  } else {
    // Production Mode serving compiled bundles
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MemeVerse full stack server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
