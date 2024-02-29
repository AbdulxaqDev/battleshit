import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

import { playersShipsDB, roomsDB, winnersDB } from "src/db/db";
import { register } from "src/utils/login.util";
import { tGame, tIncomingPlayerShips, tPlayer, tRoom } from "src/types/types";
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

  createRoom(ws, data);
  addPlayerToRoom(ws);
}

// update_room
export function updateRoomRequest(
  ws: WebSocket,
  roomIndex?: string | undefined
): void {
  const rooms = roomsDB.filter(
    (room) => room.roomUsers.length < 2 && room.roomUsers.length > 0
  );

  if (roomIndex) {
    const gameRoom = roomsDB.find((room) => room.roomId === roomIndex);
    gameRoom?.roomUsers.map((user) =>
      user.ws.send(response(rooms, "update_room"))
    );
  } else {
    ws.send(response(rooms, "update_room"));
  }
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

  const idGame = uuidv4();

  gameRoom?.roomUsers.map((user) => {
    const gameID: tGame = {
      idGame,
      idPlayer: user.index,
    };
    user.ws.send(response(gameID, "create_game"));
  });
}

// update_winners *TODO*
export function updateWinnersReqeuest(ws: WebSocket) {
  ws.send(response(winnersDB, "update_winners"));
}

// add_ships
export function addShipsRequest(
  ws: WebSocket,
  playerShips: tIncomingPlayerShips
): void {
  const { ships, indexPlayer, gameId } = playerShips;
  const game = playersShipsDB.find(
    (game) => game.gameId === playerShips.gameId
  );
  if (game) {
    game.players.push({
      ships,
      indexPlayer,
      ws: ws,
    });
  } else {
    playersShipsDB.push({
      gameId,
      players: [
        {
          ships,
          indexPlayer,
          ws: ws,
        },
      ],
    });
  }
}

// start_game
export function startGameRequest(gameId: string): void {
  const game = playersShipsDB.find((game) => game.gameId === gameId);
  console.log("STARTING GAME 11");

  if (game && game.players.length === 2) {
    console.log("STARTING GAME");

    game.players.map((player) =>
      player.ws.send(
        response(
          { ships: player.ships, currentPlayerIndex: player.indexPlayer },
          "start_game"
        )
      )
    );
  }
}
