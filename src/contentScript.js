import html2canvas from "html2canvas";

async function captureFullPage() {
    console.log("📸 Starting full-page screenshot capture...");

    const totalHeight = document.body.scrollHeight;
    const viewportHeight = window.innerHeight;
    let currentPosition = 0;
    let images = [];

    while (currentPosition < totalHeight) {
        console.log(`📜 Capturing at scroll position: ${currentPosition}...`);

        // Scroll down
        window.scrollTo(0, currentPosition);
        await new Promise(resolve => setTimeout(resolve, 800)); // 🕒 Wait for rendering

        // ✅ Request screenshot from `background.js`
        const response = await new Promise(resolve => {
            chrome.runtime.sendMessage({ type: "CAPTURE_SCREENSHOT" }, resolve);
        });

        if (response && response.status === "success") {
            console.log(`✅ Screenshot captured at position ${currentPosition}`);
            images.push({ image: response.image, position: currentPosition });
        } else {
            console.error(`❌ Screenshot capture failed at position ${currentPosition}`);
        }

        // Move down
        currentPosition += viewportHeight;
    }

    // Reset scroll position to top
    window.scrollTo(0, 0);

    console.log("✅ Finished capturing all images.");
    
    // ✅ Send images back to `popup.js`
    chrome.runtime.sendMessage({ type: "SCREENSHOTS_READY", images });
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "RUN_LOGIC") {
        console.log("📄 Extracting page text...");

        let pageText = document.body.innerText || "No text found on page.";

        chrome.runtime.sendMessage({ type: "GET_GROQ_RESPONSE", pageText }, (response) => {
            if (response && response.status === "success") {
                console.log("🤖 AI Response:", response.response);
                sendResponse({ status: "done", aiResponse: response.response });
            } else {
                console.error("❌ Error fetching AI response:", response?.message);
                sendResponse({ status: "error", error: response?.message });
            }
        });

        return true;
    }

    if (message.type === "START_SCROLL_AND_CAPTURE") {
        captureFullPage();
        sendResponse({ status: "started" });
    }
});
