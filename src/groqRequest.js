import Groq from "groq-sdk";

export async function fetchGroqResponse(pageText) {
    try {
        if (!pageText || pageText.trim() === "No text found on page.") {
            return { response: "No text found to get converted.", totalTokens: 0 };
        }

        console.log("🔄 Fetching API key from config.json...");

        const response = await fetch(chrome.runtime.getURL("config.json"));
        const config = await response.json();
        const API_KEY = config.API_KEY;

        if (!API_KEY) {
            console.error("❌ Groq API Key is missing!");
            return { response: "Error: Missing API Key in config.json", totalTokens: 0 };
        }

        console.log("🔑 Loaded API Key:", API_KEY);

        const groq = new Groq({ apiKey: API_KEY });

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Analyze the following page text:
                    1. Key facts/definitions
                    2. Relevant data/statistics
                    3. Clear insights and conclusions
                    
                    Text: ${pageText}`
                }
            ],
            model: "llama-3.3-70b-versatile"
        });

        return {
            response: completion.choices[0].message.content,
            totalTokens: completion.usage.total_tokens
        };
    } catch (error) {
        console.error("❌ Groq API Error:", error);
        return { response: `Error: ${error.message}`, totalTokens: 0 };
    }
}
