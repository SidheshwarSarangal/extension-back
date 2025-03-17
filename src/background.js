import { fetchGroqResponse } from "./groqRequest.js";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    /*if (message.type === "GET_GROQ_RESPONSE") {
        console.log("🔄 Fetching Groq AI response...");

        fetchGroqResponse(message.pageText).then(({ response, totalTokens }) => {
            console.log(`📊 Total Tokens Used: ${totalTokens}`);

            if (response) {
                sendResponse({ status: "success", response });
            } else {
                sendResponse({ status: "error", message: "Failed to fetch AI response" });
            }
        }).catch(error => {
            console.error("❌ Error fetching Groq response:", error);
            sendResponse({ status: "error", message: error.message });
        });

        return true;
    }*/

    if (message.type === "GET_GROQ_RESPONSE") {
        console.log("🚧 AI processing is currently disabled. Returning dummy response.");
        
        // ✅ Return a placeholder response instead of failing
        sendResponse({ status: "success", response: "AI processing is disabled for now." });

        return true;
    }


    if (message.type === "START_FULL_PAGE_CAPTURE") {
        console.log("📸 Received request to start full-page capture...");

        // ✅ Forward to content script (so it scrolls)
        chrome.tabs.sendMessage(message.tabId, { type: "START_SCROLL_AND_CAPTURE" }, sendResponse);

        return true; // Keep sendResponse open
    }

    if (message.type === "CAPTURE_SCREENSHOT") {
        console.log("📸 Capturing screenshot...");

        chrome.tabs.captureVisibleTab(null, { format: "png" }, (image) => {
            if (chrome.runtime.lastError || !image) {
                console.error("❌ Screenshot capture failed:", chrome.runtime.lastError);
                sendResponse({ status: "failed" });
            } else {
                console.log("✅ Screenshot captured successfully!");
                sendResponse({ status: "success", image });
            }
        });

        return true; // Keeps sendResponse callback open
    }
});
