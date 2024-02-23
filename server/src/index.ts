import { WebSocketServer } from "ws";
import { playerDataToJSON, register } from "./utils/login.util";

const PORT = 3000;

const wss = new WebSocketServer({ port: PORT });

wss.on("listening", () => {
  console.log(`Websocket is running on port ${PORT}`);
});

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data) => {
    const player = playerDataToJSON(data.toString());

    if (player.type === "reg") {
      const registered = register(player);
      ws.send(registered);
    }
    
  });
});
