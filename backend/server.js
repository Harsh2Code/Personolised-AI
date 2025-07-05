// server.js (Node.js/Express Backend)

// Import necessary modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();
const port = process.env.PORT || 5000; // Use port from environment or default to 5000

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests from your frontend
app.use(express.json()); // Enable JSON body parsing for incoming requests

// --- IMPORTANT: API Key Configuration ---
// GUIDE: Where to paste your API key
// 1. Create a file named `.env` in the same directory as this `server.js` file.
// 2. Inside the `.env` file, add the following line:
//    GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY_HERE"
//    Replace "YOUR_GOOGLE_GEMINI_API_KEY_HERE" with your actual Gemini 1.5 Pro API key.
//    (Example: GEMINI_API_KEY="AIzaSyA_xxxxxxxxxxxxxxxxxxxxxxxxxxxx")
// 3. Make sure to restart your Node.js server after creating or modifying the .env file.
//    The `dotenv` package (imported above) will load this key into `process.env.GEMINI_API_KEY`.
//    NEVER commit your .env file to version control (like Git)! Add it to your .gitignore.
const API_KEY = process.env.GEMINI_API_KEY;

// Initialize Google Generative AI
let genAI;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
} else {
  console.error("GEMINI_API_KEY not found in .env file. Please set it up as guided.");
  // Exit or handle error appropriately if API key is missing
  process.exit(1);
}

// Define the API endpoint for Gemini queries
app.post('/api/gemini-query', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required.' });
    }

    // Get the Gemini 1.5 Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // --- First call: Get the initial response from Gemini ---
    const initialResult = await model.generateContent(prompt);
    const initialText = initialResult.response.text();

    // --- Second call: Reformat the initial response into a structured, engaging, emoji-rich format ---
    const reformatPrompt = `
      You are an engaging and helpful AI assistant.
      Take the following text and reformat it into a structured, human-readable, and engaging response.
      Use relevant emojis to highlight points, create sections, and make the content more appealing.
      Maintain a friendly and enthusiastic tone.

      Original Text:
      "${initialText}"
    `;

    const formattedResult = await model.generateContent(reformatPrompt);
    const formattedText = formattedResult.response.text();

    // Send the AI's formatted response back to the frontend
    res.json({ response: formattedText });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ message: 'Error processing your request with Gemini API.', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log("Backend ready to receive requests!");
});
