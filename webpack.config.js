const path = require("path");

module.exports = {
    mode: "production",
    entry: {
        background: "./src/background.js",
        contentScript: "./src/contentScript.js",
        popup: "./src/popup.js",
        groqRequest: "./src/groqRequest.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: [".js"]
    }
};
