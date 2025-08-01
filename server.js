const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

let activeSocket = null;

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


const PORT = process.env.PORT || 3000;

app.post("/start-stream", (req, res) => {
  console.log("Received request to start stream");

  // (In the next step we’ll connect to AssemblyAI WebSocket here.)

  res.json({ message: "Live transcription initialized" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
