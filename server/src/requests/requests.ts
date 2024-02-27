import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

import { roomsDB } from "src/db/db";
import { register } from "src/utils/login.util";
import { tGame, tPlayer, tRoom } from "src/types/types";
import { isPlayerInRoom, response } from "src/helpers/helpers";
import { addPlayerToRoom, createRoom } from "src/utils/room.util";

// reg
export function regRequest(ws: WebSocket, data: tPlayer) {
  const registered = register(ws, data);
  ws.send(response(registered, "reg"));
}

// create_room
export function createRoomRequest(ws: WebSocket, data: tRoom) {
  if (isPlayerInRoom(ws)) return;
  console.log("create room");

  createRoom(ws, data);
  addPlayerToRoom(ws);
}

// update_room
export function updateRoomRequest(ws: WebSocket): void {
  const rooms = roomsDB.filter(
    (room) => room.roomUsers.length < 2 && room.roomUsers.length > 0
  );
  ws.send(response(rooms, "update_room"));
}

// add_user_to_room
export function addUserToRoomRequest(ws: WebSocket, roomIndex: string) {
  addPlayerToRoom(ws, roomIndex);
}

// create_game
export function createGameRequest(ws: WebSocket) {
  const gameRoom = roomsDB.find(
    (room) => room.roomUsers[0].ws === ws || room.roomUsers[1].ws === ws
  );

  gameRoom?.roomUsers.map((user) => {
    const gameID: tGame = {
      idGame: uuidv4(),
      idPlayer: user.index,
    };
    user.ws.send(response(gameID, "create_game"));
  });
}
