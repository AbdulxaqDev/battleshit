import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

import { tRoom } from "src/types/types";
import { playersDB, roomsDB } from "src/db/db";

export function createRoom(ws: WebSocket, room: tRoom): tRoom {
  const newRoom: tRoom = {
    ws: ws,
    roomId: uuidv4(),
    roomUsers: [],
  };

  roomsDB.push(newRoom);

  return newRoom;
}

export function addPlayerToRoom(ws: WebSocket, roomIndex: string = ""): void {
  const player = playersDB.find((player) => player.ws === ws);
  if (!player) return;

  const { name, index } = player;
  let room;
  if (ws && !roomIndex) {
    room = roomsDB.find((room) => room.ws === ws);
  } else {
    room = roomsDB.find((room) => room.roomId === roomIndex);
  }

  room?.roomUsers.push({ name, index, ws });
}

export function removeFullRoom(roomIndex: string) {
  roomsDB.map((room) => {
    if (room.roomId === roomIndex) {
      roomsDB.splice(roomsDB.indexOf(room), 1);
    }
  });
}
