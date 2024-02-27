import { WebSocketServer } from "ws";

import {
  addUserToRoomRequest,
  createRoomRequest,
  regRequest,
  updateRoomRequest,
  createGameRequest,
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
      case "reg":
        regRequest(ws, data);
        updateRoomRequest(ws);
        break;
      case "create_room":
        createRoomRequest(ws, data);
        updateRoomRequest(ws);
        break;
      case "add_user_to_room":
        const roomIndex = data.indexRoom;
        addUserToRoomRequest(ws, roomIndex);
        updateRoomRequest(ws);
        createGameRequest(ws);
        removeFullRoom(roomIndex);
        console.log(
          JSON.stringify(
            roomsDB.find((room) => room.roomId === data.indexRoom),
            null,
            4
          )
        );
        break;
      case "add_ships":
        break;
      case "start_game":
        break;
      default:
        break;
    }
    reqLogger(data, type);
  });
});
