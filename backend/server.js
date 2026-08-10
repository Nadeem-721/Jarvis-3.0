const axios = require("axios");
const yts = require("youtube-search-api");
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { exec, execFile } = require("child_process");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("../frontend"));

const PORT = process.env.PORT || 8000;
// =========================
// YOUTUBE SEARCH & PLAY
// =========================

async function playYouTube(query) {

    try {

        console.log("YouTube search:", query);

        const result = await yts.GetListByKeyword(
            query,
            false,
            5,
            [{ type: "video" }]
        );

        if (!result.items || result.items.length === 0) {
            return {
                success: false,
                message: "I couldn't find that on YouTube, sir."
            };
        }

        const video = result.items[0];

        console.log("Selected video:", video.title);
        console.log("Video ID:", video.id);

const youtubeUrl =
    `https://www.youtube.com/watch?v=${video.id}`;


return {
    success: true,
    title: video.title,
    videoId: video.id,
    url: `https://www.youtube.com/watch?v=${video.id}`
};

    } catch (error) {

        console.error("YouTube Error:", error.message);

        return {
            success: false,
            message: "I couldn't access YouTube right now, sir."
        };

    }

}

// =========================
// NATIVE JARVIS VOICE
// =========================

function jarvisSpeak(text) {

    const safeText = text
        .replace(/"/g, '\\"')
        .replace(/\$/g, '\\$')
        .replace(/`/g, '\\`');

    exec(`termux-tts-speak "${safeText}"`, (error) => {

        if (error) {
            console.error("TTS Error:", error.message);
        }

    });

}
// =========================
// HEALTH CHECK
// =========================
app.get("/", (req, res) => {
    res.json({
        status: "online",
        assistant: "JARVIS 3.0",
        message: "JARVIS backend is running successfully."
    });
});

// =========================
// SPEAK
// =========================
app.post("/speak", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                reply: "No command received."
            });
        }

        console.log("User:", text);

        let reply = "";
       let youtubeUrl = null;

        const command = text.toLowerCase();

// =========================
// YOUTUBE PLAY COMMAND
// =========================

if (
    command.startsWith("play ") ||
    command.includes("play ") && command.includes("youtube")
) {

    let query = command
        .replace("on youtube", "")
        .replace("on youtube app", "")
        .replace(/^play\s+/i, "")
        .trim();

    if (!query) {
        reply = "What would you like me to play, sir?";
    } else {

        const result = await playYouTube(query)
        if (result.success) {
    reply = `Playing ${result.title}, sir.`;
    youtubeUrl = result.url;
}
 else {
            reply = result.message;
        }

    }

}

else if (
    command.includes("hello") ||
    command.includes("hi") ||
    command.includes("hey")
) {

    reply =
    "Welcome back sir. JARVIS is online and ready for your commands.";

}


else if (command.includes("how are you")) {

    reply =
    "I am operating perfectly, sir. All systems are running normally.";

}


else if (
    command.includes("your name") ||
    command.includes("who are you")
) {

    reply =
    "I am JARVIS 3.0, your personal artificial intelligence assistant.";

}


else if (
    command.includes("who created you") ||
    command.includes("who made you")
) {

    reply =
    "I was created by you, sir. I am your personal JARVIS assistant, built to support you, assist you, and make your tasks easier.";

}
else if (command.includes("open youtube")) {

    const { exec } = require("child_process");

    const { spawn } = require("child_process");

const child = spawn("bash", [
    "/data/data/com.termux/files/home/Jarvis-3.0/backend/open_youtube.sh"
], {
    detached: true,
    stdio: "ignore"
});

child.unref();
    reply = "Opening YouTube, sir.";

}
else if (
    command.includes("thank you jarvis") ||
    command.includes("thanks")
) {

    reply =
    "It's my pleasure,sir. Assisting you in every possible way is my primary directive. I'm always at your service.";

}

else if (command.includes("time")) {

    reply =
    `The current time is ${new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    })}, sir.`;

}


else if (
    command.includes("date") ||
    command.includes("today")
) {

    reply =
    `Today's date is ${new Date().toLocaleDateString()}, sir.`;

}


else if (command.includes("help")) {

    reply =
    "I can assist you with time, date, greetings, identity, and future advanced AI commands.";

}


else {

    reply =
    "I received your command, sir. I am ready to assist you.";

}
console.log("Reply:", reply);
jarvisSpeak(reply);
res.json({
    success: true,
    reply,
    url: youtubeUrl
});
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            reply: "Internal server error."
        });
    }
});

// =========================
// START SERVER
// =========================
app.listen(PORT, "127.0.0.1", () => {
    console.log(`JARVIS 3.0 Server running securely on http://127.0.0.1:${PORT}`);
});
