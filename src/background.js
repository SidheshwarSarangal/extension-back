

import { fetchGroqResponse } from "./groqRequest.js";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_GROQ_RESPONSE") {
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

        return true; // Keeps the message channel open for async response
    }
});
