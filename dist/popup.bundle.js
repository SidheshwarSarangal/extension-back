document.addEventListener("DOMContentLoaded",(()=>{const e=document.getElementById("process-text");e?e.addEventListener("click",(async()=>{console.log("🟢 Button clicked! Extracting text & getting AI response...");try{const e=await chrome.tabs.query({active:!0,currentWindow:!0});if(0===e.length)return void console.error("❌ No active tab found.");let t=e[0];await chrome.scripting.executeScript({target:{tabId:t.id},files:["dist/contentScript.bundle.js"]}),console.log("✅ Content script injected successfully."),chrome.tabs.sendMessage(t.id,{type:"RUN_LOGIC"},(e=>{chrome.runtime.lastError?console.error("❌ Error sending message:",chrome.runtime.lastError.message):e&&"done"===e.status?console.log("🤖 AI Response:",e.aiResponse):console.error("❌ Unexpected response:",e)}))}catch(e){console.error("❌ Error:",e)}})):console.error("❌ Button not found! Check popup.html.")}));