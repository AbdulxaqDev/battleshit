import { WebSocket } from "ws";

import { tPlayer } from "src/types/types";
import { createPlayer, removePassword } from "./player.util";
import { addPlayer, isPlayerExist } from "src/helpers/helpers";

export function register(ws: WebSocket, data: tPlayer): tPlayer {
  const isExist = isPlayerExist(ws);
  if (isExist) {
    const { name, index, error, errorText } = isExist;
    return {
      name,
      index,
      error,
      errorText,
    };
  } else {
    const newPlayer = createPlayer(ws, data);
    const registered = removePassword(data);

    addPlayer(newPlayer);

    return registered;
  }
}
