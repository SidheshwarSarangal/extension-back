import html2canvas from "html2canvas";

async function captureFullPage() {
    console.log("📸 Starting smart visual content extraction...");

    const totalHeight = document.body.scrollHeight;
    const viewportHeight = window.innerHeight;
    let currentPosition = 0;
    let images = [];

    while (currentPosition < totalHeight) {
        window.scrollTo(0, currentPosition);
        await new Promise(resolve => setTimeout(resolve, 800)); // Allow render

        const visualElements = [...document.querySelectorAll('img, canvas, .chartjs, .highcharts-container, .plotly')]
            .filter(el => {
                const rect = el.getBoundingClientRect();
                return rect.top < window.innerHeight && rect.bottom > 0;
            });

        if (visualElements.length > 0) {
            console.log(`📸 Visual content detected at ${currentPosition}, extracting...`);

            for (let el of visualElements) {
                if (el.tagName === 'IMG') {
                    images.push({
                        type: 'img',
                        src: el.src,
                        position: currentPosition
                    });
                } else if (el.tagName === 'CANVAS') {
                    images.push({
                        type: 'canvas',
                        dataURL: el.toDataURL(),
                        position: currentPosition
                    });
                }
            }
        } else {
            console.log(`⏩ Skipping ${currentPosition}, no visual content.`);
        }

        currentPosition += viewportHeight;
    }

    window.scrollTo(0, 0);
    console.log("✅ Finished extracting visual content.");

    // ✅ Send to background
    chrome.runtime.sendMessage({ type: "VISUAL_CONTENT_EXTRACTED", images });
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
