document.addEventListener("DOMContentLoaded", () => {
    const processButton = document.getElementById("process-text");

    if (!processButton) {
        console.error("❌ Button not found! Check popup.html.");
        return;
    }

    processButton.addEventListener("click", async () => {
        console.log("🟢 Button clicked! Extracting text & getting AI response...");

        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

            if (tabs.length === 0) {
                console.error("❌ No active tab found.");
                return;
            }

            let tab = tabs[0];

            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["dist/contentScript.bundle.js"]
            });

            console.log("✅ Content script injected successfully.");

            chrome.tabs.sendMessage(tab.id, { type: "RUN_LOGIC" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("❌ Error sending message:", chrome.runtime.lastError.message);
                } else if (response && response.status === "done") {
                    console.log("🤖 AI Response:", response.aiResponse);
                } else {
                    console.error("❌ Unexpected response:", response);
                }
            });
        } catch (error) {
            console.error("❌ Error:", error);
        }
    });
});
