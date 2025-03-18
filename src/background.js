import { fetchGroqResponse, analyzeBase64Image } from "./groqRequest.js";


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

    /*if (message.type === "CAPTURE_SCREENSHOT") {
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
    }*/

    if (message.type === "CAPTURE_SCREENSHOT") {
        console.log("📸 Capturing screenshot...");

        chrome.tabs.captureVisibleTab(null, { format: "png" }, async (image) => {
            if (chrome.runtime.lastError || !image) {
                console.error("❌ Screenshot capture failed:", chrome.runtime.lastError);
                sendResponse({ status: "failed" });
            } else {
                console.log("✅ Screenshot captured successfully!");
                
                console.log("🖼️ Base64 Image Data URL:", image);

               /* const base64Image = image.replace(/^data:image\/png;base64,/, '');

                const analysisResult = await analyzeBase64Image(base64Image);
                
                console.log("🤖 AI Analysis Result:", analysisResult); */

                sendResponse({ status: "success" /*, image , analysis: analysisResult */});
            }
        });

        return true; // Keeps sendResponse callback open for async
    }

    if (message.type === "VISUAL_CONTENT_EXTRACTED") {
        console.log("🖼️ Received visual content from content script:", message.images);

        // Loop and display each image/canvas
        message.images.forEach((imgObj, index) => {
            if (imgObj.type === 'img') {
                console.log(`📷 IMG [${index}]:`, imgObj.src);
            } else if (imgObj.type === 'canvas') {
                console.log(`🖌️ CANVAS [${index}]:`, imgObj.dataURL);
            }
        });

        sendResponse({ status: "received" });
    }
});



