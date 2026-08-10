// JARVIS 3.0 script.js v1.0

console.log("JARVIS script loaded");


function updateSystemTime() {

    const now = new Date();

    document.getElementById("time").innerText =
        now.toLocaleTimeString();

    document.getElementById("date").innerText =
        now.toLocaleDateString();

}


setInterval(updateSystemTime, 1000);

updateSystemTime();

// ==========================
// JARVIS Voice Reply v1.3
// ==========================

function jarvisSpeak(message) {
    console.log("JARVIS:", message);
}
async function sendToJarvis(command) {

    try {

        const response = await fetch(
             "http://127.0.0.1:8000/speak",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    text: command
                })
            }
        );


        const data = await response.json();


responseText.innerText = data.reply;

jarvisSpeak(data.reply);

if (data.url) {

    setTimeout(() => {

        window.location.href = data.url;

    }, 1000);

}

    } catch (error) {

        responseText.innerText =
            "Backend connection failed, sir.";

        console.log(error);

    }

}
// ==========================
// JARVIS 3.0 Wake Word v1.2
// ==========================


const micButton = document.getElementById("mic");
const statusText = document.getElementById("jarvis-status");
const responseText = document.getElementById("response");

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

console.log("SpeechRecognition:", SpeechRecognition);

statusText.innerText =
    SpeechRecognition ? "Speech API found" : "Speech API NOT found";


if (SpeechRecognition) {
console.log("Speech recognition is supported");
statusText.innerText = "Speech recognition available";
    const recognition = new SpeechRecognition();



    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;


micButton.onclick = () => {

    statusText.innerText = "Button clicked";

    recognition.start();

};


recognition.onresult = (event) => {


    let speech =
        event.results[0][0].transcript.toLowerCase();



    console.log("Heard:", speech);

// =========================
// SMART APP COMMANDS
// =========================
// ---------- YouTube ----------
if (speech.includes("open youtube")) {

    let query = "";

    if (speech.includes("search")) {
        query = speech.split("search")[1].trim();
    }

    responseText.innerText =
        query
        ? `Certainly, sir. Opening YouTube and searching for ${query}.`
        : "Certainly, sir. Opening YouTube.";

    jarvisSpeak(
        query
        ? `Certainly, sir. Opening YouTube and searching for ${query}.`
        : "Certainly, sir. Opening YouTube."
    );

    setTimeout(() => {

        window.location.href = query
            ? "https://www.youtube.com/results?search_query=" + encodeURIComponent(query)
            : "https://www.youtube.com";

    }, 1500);

    return;
}


// ---------- Google ----------
if (speech.includes("open google")) {

    let query = "";

    if (speech.includes("search")) {
        query = speech.split("search")[1].trim();
    }

    responseText.innerText =
        query
        ? `Certainly, sir. Searching Google for ${query}.`
        : "Certainly, sir. Opening Google.";

    jarvisSpeak(
        query
        ? `Certainly, sir. Searching Google for ${query}.`
        : "Certainly, sir. Opening Google."
    );

    setTimeout(() => {

        window.location.href = query
            ? "https://www.google.com/search?q=" + encodeURIComponent(query)
            : "https://www.google.com";

    }, 1500);

    return;
}


// ---------- ChatGPT ----------
if (
    speech.includes("open ai") ||
    speech.includes("open gpt") ||
    speech.includes("open chat")
) {

    let query = "";

    if (speech.includes("search")) {
        query = speech.split("search")[1].trim();
    }

    responseText.innerText =
        query
        ? `Certainly, sir. Opening ChatGPT for ${query}.`
        : "Certainly, sir. Opening ChatGPT.";

    jarvisSpeak(
        query
        ? `Certainly, sir. Opening ChatGPT for ${query}.`
        : "Certainly, sir. Opening ChatGPT."
    );

    setTimeout(() => {

        window.location.href = "https://chat.openai.com";

    }, 1500);

    return;
}


// ---------- Instagram ----------
if (speech.includes("open instagram")) {

    responseText.innerText = "Opening Instagram, sir.";
    jarvisSpeak("Opening Instagram, sir.");

    setTimeout(() => {
        window.location.href = "https://www.instagram.com";
    }, 1500);

    return;
}


// ---------- WhatsApp ----------
if (speech.includes("open whatsapp")) {

    responseText.innerText = "Opening WhatsApp, sir.";
    jarvisSpeak("Opening WhatsApp, sir.");

    setTimeout(() => {
        window.location.href = "https://wa.me";
    }, 1500);

    return;
}


// ---------- Gmail ----------
if (speech.includes("open gmail")) {

    responseText.innerText = "Opening Gmail, sir.";
    jarvisSpeak("Opening Gmail, sir.");

    setTimeout(() => {
        window.location.href = "https://mail.google.com";
    }, 1500);

    return;
}


// ---------- GitHub ----------
if (speech.includes("open github")) {

    responseText.innerText = "Opening GitHub, sir.";
    jarvisSpeak("Opening GitHub, sir.");

    setTimeout(() => {
        window.location.href = "https://github.com";
    }, 1500);

    return;
}





if (speech.includes("jarvis")) {

    statusText.innerText =
        "Wake word detected";

    sendToJarvis(speech);

}

    else {

    statusText.innerText =
        "Command processing...";

    sendToJarvis(speech);

}

};


    recognition.onerror = () => {

        statusText.innerText =
            "Voice error";

    };


}

