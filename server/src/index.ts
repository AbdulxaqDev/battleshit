import { WebSocketServer } from "ws";

import {
  addUserToRoomRequest,
  createRoomRequest,
  regRequest,
  updateRoomRequest,
  createGameRequest,
  updateWinnersReqeuest,
  addShipsRequest,
  startGameRequest,
} from "./requests/requests";
import { roomsDB } from "./db/db";
import { removeFullRoom } from "./utils/room.util";
import { reqLogger, request } from "./helpers/helpers";

const PORT = 3000;

const wss = new WebSocketServer({ port: PORT });

wss.on("listening", () => {
  console.log(`Websocket is running on port ${PORT}`);
});

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (message) => {
    const { type, data } = request(message);

    switch (type) {
      case "reg" /* <= */:
        regRequest(ws, data); /* => */
        updateRoomRequest(ws); /* => */
        updateWinnersReqeuest(ws);
        break;
      case "create_room" /* <= */:
        createRoomRequest(ws, data); /* => */
        updateRoomRequest(ws); /* => */
        break;
      case "add_user_to_room" /* <= */:
        const roomIndex = data.indexRoom;
        addUserToRoomRequest(ws, roomIndex); /* => */
        updateRoomRequest(ws, roomIndex); /* => */
        createGameRequest(ws); /* => */
        removeFullRoom(roomIndex); /* in server */
        break;
      case "add_ships":
        addShipsRequest(ws, data);
        startGameRequest(data.gameId);
        break;
      // case "start_game":
      //   break;
      default:
        break;
    }
    reqLogger(data, type);
  });
});
