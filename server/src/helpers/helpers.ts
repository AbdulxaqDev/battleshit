import { RawData, WebSocket } from "ws";

import { playersDB, roomsDB } from "src/db/db";
import { tDefault, tPlayer, tShip } from "src/types/types";

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

export function response<T>(DATA: T, type: string): string {
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

export function coordinatedShips(ships: tShip[]) {
  return ships.map((ship) => {
    const { direction, length } = ship;
    const { x, y } = ship.position;
    let shipCoords;
    let shipAroundCoords;

    if (length > 1) {
      if (direction) {
        // true => vertical |
        shipAroundCoords = [
          { x: x, y: y - 1 }, // top
          { x: x - 1, y: y - 1 }, // top left side
          { x: x + 1, y: y - 1 }, // top right side
          { x: x - 1, y }, // left side
          { x: x + 1, y }, // right side
          { x: x - 1, y: y + length }, // bottom left side
          { x: x + 1, y: y + length }, // bottom right side
          { x: x, y: y + length }, // bottom
        ];
        shipCoords = [{ x, y }];

        for (let i = 1; i < length; i++) {
          shipCoords.push({
            x,
            y: y + i,
          });
          shipAroundCoords.push(
            {
              x: x - 1,
              y: y + i,
            },
            {
              x: x + 1,
              y: y + i,
            }
          );
        }
      } else {
        // fasle => horizontal __
        shipAroundCoords = [
          { x: x, y: y - 1 }, // top
          { x: x - 1, y: y - 1 }, // top left side
          { x: x - 1, y }, // left side
          { x: x - 1, y: y + 1 }, // bottom left side
          { x: x + length, y: y - 1 }, // right top side
          { x: x + length, y }, // right
          { x: x + length, y: y + 1 }, // right bottom side
          { x, y: y + 1 }, // bottom
        ];
        shipCoords = [{ x, y }];

        for (let i = 1; i < length; i++) {
          shipCoords.push({
            x: x + i,
            y: y,
          });
          shipAroundCoords.push(
            {
              x: x + i,
              y: y - 1,
            },
            {
              x: x + i,
              y: y + 1,
            }
          );
        }
      }
    } else {
      shipAroundCoords = [
        { x: x, y: y - 1 }, // top
        { x: x - 1, y: y - 1 }, // top left side
        { x: x - 1, y: y }, // left side
        { x: x - 1, y: y + 1 }, // left bottom side
        { x, y: y + 1 }, // bottom
        { x: x + length, y: y + 1 }, // bottom right side
        { x: x + 1, y }, // right side
        { x: x + length, y: y - 1 }, // top right side
      ];
      shipCoords = [{ x, y }];
    }
    return { ...ship, shipCoords, shipAroundCoords };
  });
}

export function attackResponce(
  x: number,
  y: number,
  currentPlayer: string | number | undefined,
  status: string
) {
  return {
    position: {
      x,
      y,
    },
    currentPlayer,
    status,
  };
}
