import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

import { tRoom } from "src/types/types";
import { playersDB, roomsDB } from "src/db/db";

export function createRoom(ws: WebSocket, room: tRoom): tRoom {
  const roomId = uuidv4();
  const newRoom: tRoom = {
    ws: ws,
    roomId,
    roomUsers: [],
  };

  roomsDB.push(newRoom);

  return newRoom;
}

export function addPlayerToRoom(
  ws: WebSocket,
  roomIndex: string | number
): void {
  const player = playersDB.find((player) => player.ws === ws);
  if (!player) return;

  const { name, index } = player;

  let room = roomsDB.find((room) => room.roomId === roomIndex);
  let isPlayerInRoom = room?.roomUsers.find((u) => u.index === index);

  if (isPlayerInRoom) {
    console.log("\x1b[31m%s\x1b[0m", "User is already in room");
  } else {
    console.log("\x1b[32m%s\x1b[0m", "Adding player to room!");
    room?.roomUsers.push({ name, index, ws });
  }
}

export function removeFullRoom(roomIndex: string) {
  roomsDB.map((room) => {
    if (room.roomId === roomIndex && room.roomUsers.length === 2) {
      roomsDB.splice(roomsDB.indexOf(room), 1);
    }
  });
}
