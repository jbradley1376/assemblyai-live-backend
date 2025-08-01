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

  activeSocket = startAssemblyAI(process.env.ASSEMBLYAI_KEY, (transcript) => {
    console.log("Transcript:", transcript);
    // Optionally forward transcript to Base44 or process it here
  });

  res.json({ message: "Live transcription initialized" });
});

// Endpoint to receive and forward audio chunks to AssemblyAI
app.post("/audio", (req, res) => {
  if (!activeSocket) {
    res.status(400).send("AssemblyAI socket not initialized.");
    return;
  }

  let audioBuffer = [];

  req.on("data", (chunk) => {
    audioBuffer.push(chunk);
  });

  req.on("end", () => {
    const finalBuffer = Buffer.concat(audioBuffer);
    activeSocket.send(finalBuffer);
    res.status(200).send("Audio chunk received and sent.");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
