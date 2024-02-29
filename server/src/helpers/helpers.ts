import { RawData, WebSocket } from "ws";

import { playersDB, roomsDB } from "src/db/db";
import {
  tDefault,
  tPlayer,
  tRoom,
  tGame,
  tWinner,
  tPlayersShips,
  tPlayerShips,
} from "src/types/types";

export function isPlayerExist(ws: WebSocket) {
  return playersDB.find((p) => p.ws === ws);
}

export function addPlayer(newPlayer: tPlayer): void {
  playersDB.push(newPlayer);
}

export function reqLogger(data: tDefault, type: string) {
  console.log("\n");
  console.log(
    "\x1b[33m%s\x1b[0m\x1b[32m(%s)\x1b[0m\x1b[33m%s\x1b[0m",
    "REQUEST",
    type,
    ":"
  );
  console.log("\x1b[36mdata: %s\x1b[0m", JSON.stringify(data, null, 4)); //cyan
  console.log("\n");
}

export function request(DATA: RawData) {
  const rawDATA = JSON.parse(DATA.toString());
  return {
    ...rawDATA,
    data: JSON.parse(rawDATA.data || '""'),
  };
}

export function response(
  DATA:
    | tPlayer
    | tRoom
    | tRoom[]
    | tGame
    | tWinner[]
    | tPlayersShips
    | tPlayerShips,
  type: string
): string {
  const stringData = {
    type,
    data: JSON.stringify(DATA),
    id: 0,
  };
  return JSON.stringify(stringData);
}

export function isPlayerInRoom(ws: WebSocket) {
  return roomsDB.find((room) => {
    return room.roomUsers.find((user) => user.ws === ws);
  });
}
