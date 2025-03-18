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

export async function analyzeVisualContent(imageData) {
    try {
       // console.log("🧠 Starting Groq AI analysis of visual content...");

        // Load API Key from config
        const response = await fetch(chrome.runtime.getURL("config.json"));
        const config = await response.json();
        const API_KEY = config.API_KEY;

        if (!API_KEY) {
            console.error("❌ Groq API Key is missing!");
            return { analysis: "Error: Missing API Key" };
        }

        const groq = new Groq({ apiKey: API_KEY });

        const chatCompletion = await groq.chat.completions.create({
            model: "llama-3.2-11b-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `If the image contains a statistical graph, chart, or data visualization, analyze the data and provide ONLY the key conclusions or insights as clear, vertical bullet points (one per line). 
                            - Do NOT describe the chart, bars, colors, or general appearance. 
                            - Do NOT write conclusions in a horizontal paragraph. 
                            - If no statistical data is present, just respond with 'nothing found' and nothing else.`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `${imageData}`
                            }
                        }
                    ]
                }
            ],
            max_completion_tokens: 1024
        });

        //console.log("✅ Groq AI Analysis Complete");
        return {
            analysis: chatCompletion.choices[0].message.content
        };
    } catch (error) {
        console.error("❌ Error analyzing visual content with Groq:", error);
        return { analysis: `Error: ${error.message}` };
    }
}