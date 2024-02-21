import { WebSocketServer } from "ws";

const PORT = 3000;

const wss = new WebSocketServer({ port: PORT });

wss.on("listening", () => {
  console.log(`Websocket is running on port ${PORT}`);
});

wss.on("connection", (ws) => {
  ws.on("error", console.error);
});
