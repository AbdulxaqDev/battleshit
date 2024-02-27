import { v4 as uuidv4 } from "uuid";
import { RawData, WebSocket } from "ws";

import { tDefault, tPlayer } from "src/types/types";

export function dataToString(DATA: tDefault): string {
  const stringData = {
    ...DATA,
    data: JSON.stringify(DATA.data),
  };
  return JSON.stringify(stringData);
}

export function dataToJSON(DATA: RawData) {
  const rawDATA = JSON.parse(DATA.toString());

  return {
    ...rawDATA,
    data: JSON.parse(rawDATA.data || '""'),
  };
}

export function removePassword(player: tPlayer): tPlayer {
  const { name } = player;

  return {
    name,
    index: uuidv4(),
    error: false,
    errorText: "noError",
  };
}

export function createPlayer(ws: WebSocket, player: tPlayer): tPlayer {
  const { name, password } = player;

  return {
    name,
    password,
    index: uuidv4(),
    error: false,
    errorText: "noError",
    ws: ws,
  };
}
