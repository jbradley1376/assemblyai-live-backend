// Load environment variables from .env file (for local dev only)

const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");
const { startAssemblyAI } = require("./assemblyai");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Store the active AssemblyAI socket connection
let activeSocket = null;

// Endpoint to start live transcription session
app.post("/start-stream", (req, res) => {
  console.log("Received request to start stream");

  const apiKey = process.env.ASSEMBLYAI_KEY;
  console.log("API KEY:", apiKey); // Debugging check

  if (!apiKey) {
    res.status(500).send("API key not found");
    return;
  }

  activeSocket = startAssemblyAI(apiKey, (transcript) => {
    console.log("Transcript:", transcript);
    // Optional: forward to Base44 or process it here
  });

  res.json({ message: "Live transcription initialized" });
});

// Endpoint to receive and forward audio chunks to AssemblyAI
app.post("/audio", (req, res) => {
  if (!activeSocket) {
    res.status(400).send("AssemblyAI socket not initialized.");
    return;
  }

  // Audio streaming implementation goes here if needed
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
