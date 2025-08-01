const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/start-stream", (req, res) => {
  console.log("Received request to start stream");

  // (In the next step we’ll connect to AssemblyAI WebSocket here.)

  res.json({ message: "Live transcription initialized" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
