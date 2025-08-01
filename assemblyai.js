const WebSocket = require("ws");

function startAssemblyAI(apiKey, onTranscript) {
  const ws = new WebSocket(
    "wss://api.assemblyai.com/v3/realtime/ws?sample_rate=16000",
    {
      headers: { Authorization: apiKey },
    }
  );

  ws.on("open", () => {
    console.log("Connected to AssemblyAI");
  });

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    if (data.text) {
      onTranscript(data.text);
    }
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });

  return ws;
}

module.exports = { startAssemblyAI };
