chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "RUN_LOGIC") {
        let pageText = document.body.innerText || "No text found on page.";

        chrome.runtime.sendMessage({ type: "GET_GROQ_RESPONSE", pageText }, (response) => {
            if (response && response.status === "success") {
                sendResponse({ status: "done", aiResponse: response.response });
            } else {
                console.error("❌ Error fetching AI response:", response?.message);
                sendResponse({ status: "error", error: response?.message });
            }
        });

        return true; // ✅ Keeps the message channel open
    }
});
