package com.memeverse.app;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.card.MaterialCardView;
import com.google.android.material.textfield.TextInputEditText;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Random;
import java.util.Set;

public class MainActivity extends AppCompatActivity {

    private TextInputEditText etTopic;
    private Spinner spinnerCategory;
    private MaterialButton btnGenerateMeme;
    private MaterialButton btnGenerateReel;
    private MaterialButton btnViewHistory;

    private TextView tvResultHeader;
    private RelativeLayout layoutMemePreview;
    private TextView tvMemeTop;
    private TextView tvMemeBottom;
    private TextView tvMemeGraphicStatus;
    private TextView tvTextResult;
    private LinearLayout layoutResultActions;
    private MaterialButton btnCopyResult;
    private MaterialButton btnShareResult;

    private LinearLayout layoutHistorySection;
    private LinearLayout layoutHistoryItems;
    private TextView tvHistoryEmpty;
    private TextView btnClearHistory;

    private static final String PREF_NAME = "MemeVersePrefs";
    private static final String KEY_HISTORY = "CreationHistory";
    private SharedPreferences sharedPreferences;

    // Rich collections of templates for premium dynamic content generation
    private final String[] categories = {
        "Coding & Tech",
        "Coffee & Monday Blues",
        "Corporate & Work Life",
        "Fitness & Gym Goals",
        "Gaming & Chill"
    };

    private final String[] funnyEmojis = {"⚡", "🤓", "☕", "💀", "🤡", "🤖", "🔥", "🚀", "🤫", "🫣", "😭", "😮‍💨"};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        sharedPreferences = getSharedPreferences(PREF_NAME, MODE_PRIVATE);

        // Bind all required UI elements
        etTopic = findViewById(R.id.et_topic);
        spinnerCategory = findViewById(R.id.spinner_category);
        btnGenerateMeme = findViewById(R.id.btn_generate_meme);
        btnGenerateReel = findViewById(R.id.btn_generate_reel);
        btnViewHistory = findViewById(R.id.btn_view_history);

        tvResultHeader = findViewById(R.id.tv_result_header);
        layoutMemePreview = findViewById(R.id.layout_meme_preview);
        tvMemeTop = findViewById(R.id.tv_meme_top);
        tvMemeBottom = findViewById(R.id.tv_meme_bottom);
        tvMemeGraphicStatus = findViewById(R.id.tv_meme_graphic_status);
        tvTextResult = findViewById(R.id.tv_text_result);
        layoutResultActions = findViewById(R.id.layout_result_actions);
        btnCopyResult = findViewById(R.id.btn_copy_result);
        btnShareResult = findViewById(R.id.btn_share_result);

        layoutHistorySection = findViewById(R.id.layout_history_section);
        layoutHistoryItems = findViewById(R.id.layout_history_items);
        tvHistoryEmpty = findViewById(R.id.tv_history_empty);
        btnClearHistory = findViewById(R.id.btn_clear_history);

        // Setup Spinner
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, categories);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerCategory.setAdapter(adapter);

        // Action Handlers
        btnGenerateMeme.setOnClickListener(v -> generateMeme());
        btnGenerateReel.setOnClickListener(v -> generateReel());
        btnViewHistory.setOnClickListener(v -> toggleHistorySection());
        btnClearHistory.setOnClickListener(v -> clearAllHistory());

        // Copy and Share actions
        btnCopyResult.setOnClickListener(v -> {
            String textToCopy = getResultStringForSharing();
            copyToClipboard(textToCopy);
        });

        btnShareResult.setOnClickListener(v -> {
            String textToShare = getResultStringForSharing();
            shareText(textToShare);
        });

        // Preload history
        updateHistoryUI();
    }

    private void generateMeme() {
        String topic = etTopic.getText() != null ? etTopic.getText().toString().trim() : "";
        if (TextUtils.isEmpty(topic)) {
            topic = "Doing Stuff";
        }

        String category = spinnerCategory.getSelectedItem().toString();
        Random random = new Random();

        String topText = "";
        String bottomText = "";
        String emoji = funnyEmojis[random.nextInt(funnyEmojis.length)];

        // Category-enhanced humor intelligence
        if (category.contains("Coding")) {
            String[] topTemplates = {
                "WHEN THE USER CLICKS A BUTTON FOR " + topic.toUpperCase(),
                "ME COMMITTING '" + topic.toUpperCase() + "' DIRECTLY TO MAIN",
                "SENIOR DEVS WATCHING ME FIX " + topic.toUpperCase(),
                "MY CODE HANDLES " + topic.toUpperCase() + " PERFECTLY",
                "100 COMPILER WARNINGS ON " + topic.toUpperCase()
            };
            String[] bottomTemplates = {
                "BUT IT TRIGGERS 42 SECRETS OF HELL 💀",
                "IT COMPILES ONCE. NEVER GIVING THAT LUCK AGAIN 😮‍💨",
                "THE DEPLOYMENT CONTAINER IMMEDIATELY CRASHES 🤖",
                "AT LEAST THE SPINNER ANNOTATION IS ROTATING! 🚀",
                "STILL DECLARED AS PRODUCTION PREVIEW 😂"
            };
            topText = topTemplates[random.nextInt(topTemplates.length)];
            bottomText = bottomTemplates[random.nextInt(bottomTemplates.length)];
        } else if (category.contains("Coffee")) {
            String[] topTemplates = {
                "10 MINUTES OF WORKING ON " + topic.toUpperCase(),
                "WITHOUT COFFEE, " + topic.toUpperCase() + " IS IMPOSSIBLE",
                "JUST FINISHED THE 4TH LATTE FOR " + topic.toUpperCase(),
                "MY MANAGER THINKS " + topic.toUpperCase() + " DRIVES ME"
            };
            String[] bottomTemplates = {
                "ACTUALLY I AM JUST STICKING TO MY SOUP 😭",
                "BUT NOW MY HANDS ARE SHAKING SO FAST I AM WRITING CODES AT 300 WPM ☕",
                "MY INNER PEACE IS SLOWLY SHUTTING DOWN",
                "IT WAS AN ESPRESSO PROPHECY 😂"
            };
            topText = topTemplates[random.nextInt(topTemplates.length)];
            bottomText = bottomTemplates[random.nextInt(bottomTemplates.length)];
        } else if (category.contains("Corporate")) {
            String[] topTemplates = {
                "THE BRAINSTORMING MEETING ON " + topic.toUpperCase(),
                "AS PER MY PREVIOUS EMAIL REGARDING " + topic.toUpperCase(),
                "ME ATTENDING " + topic.toUpperCase() + " PROGRESS CALL",
                "WHEN THEY ASK FOR STATUS OF " + topic.toUpperCase()
            };
            String[] bottomTemplates = {
                "COULD HAVE BEEN A 3-SECOND SILENCE 🤫",
                "MY INBOX IS OVERFLOWING BUT INTENT IS STILL AT ZERO",
                "NODDING COMPLIANTLY WHILE PLAYING MINER 🫣",
                "LETS TOUCH BASE OUTSIDE THE SPACE-TIME CONTINUUM!"
            };
            topText = topTemplates[random.nextInt(topTemplates.length)];
            bottomText = bottomTemplates[random.nextInt(bottomTemplates.length)];
        } else if (category.contains("Fitness")) {
            String[] topTemplates = {
                "ME PREPARING HEAVY LIFTS FOR " + topic.toUpperCase(),
                "DAY 3 OF FITNESS WITH " + topic.toUpperCase(),
                "SQUATTING 100KG FOR " + topic.toUpperCase(),
                "THE GYM TRAINER ENCOURAGES ME ON " + topic.toUpperCase()
            };
            String[] bottomTemplates = {
                "I HAVE SEEN HEAVEN INDEED 💀",
                "IMMEDIATELY JOINS A FAST-FOOD RECOVERY TEAM",
                "BUT MY LEG MUSCLES DISAGREED AND LEFT THE BUILDING",
                "WOKE UP SORE AND READY TO RETIRE AT 25"
            };
            topText = topTemplates[random.nextInt(topTemplates.length)];
            bottomText = bottomTemplates[random.nextInt(bottomTemplates.length)];
        } else {
            // General template fallback
            topText = "ME TRYING TO EXPLAIN " + topic.toUpperCase();
            bottomText = "BUT NOBODY UNDERSTANDS THE GENIUS BEHIND IT " + emoji;
        }

        // Apply generated strings to view elements
        tvMemeTop.setText(topText);
        tvMemeBottom.setText(bottomText);
        tvMemeGraphicStatus.setText(emoji);

        // Switch visible results format
        layoutMemePreview.setVisibility(View.VISIBLE);
        tvTextResult.setVisibility(View.GONE);
        tvResultHeader.setText("Fresh Meme Generated! 👇");
        layoutResultActions.setVisibility(View.VISIBLE);

        // Store to SharedPreferences
        saveContentToHistory("Meme", "Topic: " + topic + "\n[TOP]: " + topText + "\n[BOTTOM]: " + bottomText + " " + emoji);
    }

    private void generateReel() {
        String topic = etTopic.getText() != null ? etTopic.getText().toString().trim() : "";
        if (TextUtils.isEmpty(topic)) {
            topic = "Doing Stuff";
        }

        String category = spinnerCategory.getSelectedItem().toString();
        Random random = new Random();

        // 15-30s Script generator
        StringBuilder scriptBuilder = new StringBuilder();
        scriptBuilder.append("🎬 VIRAL SHORT REEL SCRIPT\n");
        scriptBuilder.append("Topic: ").append(topic).append(" | Style: ").append(category).append("\n\n");

        scriptBuilder.append("⏱️ [0:00 - 0:05] THE HOOK\n");
        scriptBuilder.append("🎥 Scene: Extreme close-up of a person dramatically staring at screen with sweat drops.\n");
        scriptBuilder.append("🔊 Audio/SFX: Suspenseful cinematic build-up. Boom sound!\n");
        scriptBuilder.append("🎤 Text on screen: \"Why nobody tells you this about ").append(topic).append("?!\"\n\n");

        scriptBuilder.append("⏱️ [0:05 - 0:15] THE ESCLATION\n");
        scriptBuilder.append("🎥 Scene: Fast cut transitions! Character doing funny fast motions (hyper-speed typing, frantic drinking, or gym posing) about ").append(topic).append(".\n");
        scriptBuilder.append("🎤 Dialogue/Voiceover: ");

        if (category.contains("Coding")) {
            scriptBuilder.append("\"Step 1: Write magnificent lines of script. Step 2: Test and declare ultimate success. Step 3: Face ").append(topic).append(" and reconsider entire life choices! It's an endless loop!\"\n\n");
        } else if (category.contains("Coffee")) {
            scriptBuilder.append("\"You think coffee keeps you awake? No! It's the sheer anxiety of facing ").append(topic).append(" at 9 AM without a single survival tactic! Spark up that coffee mug!\"\n\n");
        } else if (category.contains("Corporate")) {
            scriptBuilder.append("\"Your boss asks for a quick sync. You dress up your upper body, join the call, only to hear: 'So, about ").append(topic).append("...' Instant heart acceleration!\"\n\n");
        } else if (category.contains("Fitness")) {
            scriptBuilder.append("\"You eat clean, train heavy, and feel great, until ").append(topic).append(" shows up and proves you have the core strength of an overcooked spaghetti!\"\n\n");
        } else {
            scriptBuilder.append("\"The secret to ruling ").append(topic).append("? Simple. You don't! You just look extremely focused and hope things solve themselves.\" \n\n");
        }

        scriptBuilder.append("⏱️ [0:15 - 0:25] THE TRANSITION / PUNCHLINE\n");
        scriptBuilder.append("🎥 Scene: Person looking completely calm, sipping water, with funny text on screen.\n");
        scriptBuilder.append("🎤 Voiceover/Audio: \"Save this reel before you regret not knowing this!\"\n");
        scriptBuilder.append("🔥 Trending Audio recommended: Fast Lo-Fi Beats with retro vinyl scratch sound.\n\n");

        scriptBuilder.append("🏷️ Hashtags:\n");
        scriptBuilder.append("#").append(topic.replaceAll("\\s+", "")).append(" #MemeLife #ShortsReels #HumorDaily #ViralScript");

        String fullScript = scriptBuilder.toString();

        // Bind result text
        tvTextResult.setText(fullScript);

        // Visibility switches (hides visual meme view, shows text result box)
        layoutMemePreview.setVisibility(View.GONE);
        tvTextResult.setVisibility(View.VISIBLE);
        tvResultHeader.setText("Viral Reel Script Generated! 🎬");
        layoutResultActions.setVisibility(View.VISIBLE);

        // Save entry
        saveContentToHistory("Short Reel", fullScript);
    }

    private void toggleHistorySection() {
        if (layoutHistorySection.getVisibility() == View.VISIBLE) {
            layoutHistorySection.setVisibility(View.GONE);
        } else {
            layoutHistorySection.setVisibility(View.VISIBLE);
            updateHistoryUI();
        }
    }

    private void saveContentToHistory(String type, String content) {
        Set<String> currentHistory = sharedPreferences.getStringSet(KEY_HISTORY, new HashSet<>());
        // Create a new set to avoid mutations constraints of SharedPreferences
        Set<String> updatedHistory = new HashSet<>(currentHistory);

        String dateStr = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault()).format(new Date());
        // String encoding representation: [TYPE]|||[TIMESTAMP]|||[CONTENT]
        String entry = type + "|||" + dateStr + "|||" + content;
        updatedHistory.add(entry);

        sharedPreferences.edit().putStringSet(KEY_HISTORY, updatedHistory).apply();

        // Update the history layout view
        if (layoutHistorySection.getVisibility() == View.VISIBLE) {
            updateHistoryUI();
        }
    }

    private void updateHistoryUI() {
        layoutHistoryItems.removeAllViews();
        Set<String> currentHistory = sharedPreferences.getStringSet(KEY_HISTORY, new HashSet<>());

        if (currentHistory.isEmpty()) {
            tvHistoryEmpty.setVisibility(View.VISIBLE);
            return;
        }

        tvHistoryEmpty.setVisibility(View.GONE);

        // Convert set to List to display or sort them
        List<String> items = new ArrayList<>(currentHistory);
        // Sort descending or display directly
        for (String itemStr : items) {
            String[] parts = itemStr.split("\\|\\|\\|", 3);
            if (parts.length < 3) continue;

            String type = parts[0];
            String date = parts[1];
            String content = parts[2];

            // Programmatically inflate beautiful premium Material Cards for history list rows
            MaterialCardView card = new MaterialCardView(this);
            LinearLayout.LayoutParams cardParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            );
            cardParams.setMargins(0, 0, 0, 12);
            card.setLayoutParams(cardParams);
            card.setRadius(24f);
            card.setCardElevation(1.5f);
            card.setStrokeWidth(1);
            card.setStrokeColor(Color.parseColor("#EAEAEA"));

            LinearLayout innerContainer = new LinearLayout(this);
            innerContainer.setOrientation(LinearLayout.VERTICAL);
            innerContainer.setPadding(24, 20, 24, 20);

            // Row header with Type label and date
            RelativeLayout rowHeader = new RelativeLayout(this);
            RelativeLayout.LayoutParams rowHeaderParams = new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            );
            rowHeader.setLayoutParams(rowHeaderParams);

            TextView tvType = new TextView(this);
            tvType.setText(type.toUpperCase(Locale.getDefault()));
            tvType.setTextSize(12);
            tvType.setAllCaps(true);
            tvType.setTextColor(Color.parseColor(type.contains("Meme") ? "#6200EE" : "#018786"));
            tvType.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
            RelativeLayout.LayoutParams typeParams = new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            );
            typeParams.addRule(RelativeLayout.ALIGN_PARENT_START);
            tvType.setLayoutParams(typeParams);

            TextView tvDate = new TextView(this);
            tvDate.setText(date);
            tvDate.setTextSize(10);
            tvDate.setTextColor(Color.parseColor("#999999"));
            RelativeLayout.LayoutParams dateParams = new RelativeLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            );
            dateParams.addRule(RelativeLayout.ALIGN_PARENT_END);
            tvDate.setLayoutParams(dateParams);

            rowHeader.addView(tvType);
            rowHeader.addView(tvDate);
            innerContainer.addView(rowHeader);

            // Content preview text
            TextView tvContent = new TextView(this);
            tvContent.setText(content);
            tvContent.setEllipsize(TextUtils.TruncateAt.END);
            tvContent.setMaxLines(4);
            tvContent.setTextSize(13);
            tvContent.setTextColor(Color.parseColor("#2D3436"));
            tvContent.setPadding(0, 12, 0, 12);
            innerContainer.addView(tvContent);

            // Item actions row (Copy, Share, Delete)
            LinearLayout actionBar = new LinearLayout(this);
            actionBar.setOrientation(LinearLayout.HORIZONTAL);
            actionBar.setGravity(Gravity.END);

            TextView btnCopy = new TextView(this);
            btnCopy.setText("Copy");
            btnCopy.setTextColor(Color.parseColor("#6200EE"));
            btnCopy.setTextSize(12);
            btnCopy.setPadding(16, 8, 16, 8);
            btnCopy.setOnClickListener(v -> {
                copyToClipboard(content);
                Toast.makeText(this, "Copied saved item!", Toast.LENGTH_SHORT).show();
            });

            TextView btnShare = new TextView(this);
            btnShare.setText("Share");
            btnShare.setTextColor(Color.parseColor("#018786"));
            btnShare.setTextSize(12);
            btnShare.setPadding(16, 8, 16, 8);
            btnShare.setOnClickListener(v -> shareText(content));

            TextView btnDelete = new TextView(this);
            btnDelete.setText("Delete");
            btnDelete.setTextColor(Color.parseColor("#FF3B30"));
            btnDelete.setTextSize(12);
            btnDelete.setPadding(16, 8, 16, 8);
            btnDelete.setOnClickListener(v -> {
                // Delete specific item and re-render
                currentHistory.remove(itemStr);
                sharedPreferences.edit().putStringSet(KEY_HISTORY, currentHistory).apply();
                updateHistoryUI();
            });

            actionBar.addView(btnCopy);
            actionBar.addView(btnShare);
            actionBar.addView(btnDelete);
            innerContainer.addView(actionBar);

            card.addView(innerContainer);
            layoutHistoryItems.addView(card);
        }
    }

    private void clearAllHistory() {
        sharedPreferences.edit().remove(KEY_HISTORY).apply();
        updateHistoryUI();
        Toast.makeText(this, "Cleared all history!", Toast.LENGTH_SHORT).show();
    }

    private String getResultStringForSharing() {
        if (layoutMemePreview.getVisibility() == View.VISIBLE) {
            return "[MEME GENERATED]\nTop: " + tvMemeTop.getText().toString() + "\nBottom: " + tvMemeBottom.getText().toString() + " " + tvMemeGraphicStatus.getText().toString();
        } else {
            return tvTextResult.getText().toString();
        }
    }

    private void copyToClipboard(String text) {
        ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText("MemeVerse Generated Content", text);
        if (clipboard != null) {
            clipboard.setPrimaryClip(clip);
            Toast.makeText(this, "Text copied to clipboard!", Toast.LENGTH_SHORT).show();
        }
    }

    private void shareText(String text) {
        Intent intent = new Intent(Intent.ACTION_SEND);
        intent.setType("text/plain");
        intent.putExtra(Intent.EXTRA_TEXT, text);
        startActivity(Intent.createChooser(intent, "Share via"));
    }
}
