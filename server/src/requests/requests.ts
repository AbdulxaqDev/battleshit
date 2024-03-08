import { WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

import { playersDB, playersShipsDB, roomsDB, winnersDB } from "src/db/db";
import { register } from "src/utils/login.util";
import {
  tAttack,
  tGame,
  tIncomingPlayerShips,
  tPlayer,
  tPlayerShips,
  tPlayersShips,
  tRoom,
  tWinner,
} from "src/types/types";
import {
  attackResponce,
  coordinatedShips,
  isPlayerInRoom,
  response,
} from "src/helpers/helpers";
import { addPlayerToRoom, createRoom } from "src/utils/room.util";

// reg
export function regRequest(ws: WebSocket, data: tPlayer) {
  const registered = register(ws, data);
  ws.send(response<tPlayer>(registered, "reg"));
}

// create_room
export function createRoomRequest(ws: WebSocket, data: tRoom) {
  if (isPlayerInRoom(ws)) return;

  const { roomId } = createRoom(ws, data);
  addPlayerToRoom(ws, roomId);
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
      user.ws.send(response<tRoom[]>(rooms, "update_room"))
    );
  } else {
    ws.send(response<tRoom[]>(rooms, "update_room"));
  }
}

// add_user_to_room
export function addUserToRoomRequest(ws: WebSocket, roomIndex: string) {
  addPlayerToRoom(ws, roomIndex);
}

// create_game
export function createGameRequest(roomId: string) {
  const gameRoom = roomsDB.find((room) => room.roomId === roomId);

  if (gameRoom?.roomUsers.length == 2) {
    const idGame = uuidv4();

    gameRoom?.roomUsers.map((user) => {
      const gameID: tGame = {
        idGame,
        idPlayer: user.index,
      };
      user.ws.send(response<tGame>(gameID, "create_game"));
    });
  }
}

// update_winners *TODO*
export function updateWinnersReqeuest(ws: WebSocket) {
  ws.send(response<tWinner[]>(winnersDB, "update_winners"));
}

// add_ships
export function addShipsRequest(
  ws: WebSocket,
  playerShips: tIncomingPlayerShips
): void {
  const { ships, indexPlayer, gameId } = playerShips;
  const shipsWithCoordinates = coordinatedShips(ships);
  console.log(JSON.stringify(shipsWithCoordinates, null, 4));
  const game = playersShipsDB.find(
    (game) => game.gameId === playerShips.gameId
  );
  if (game) {
    game.players.push({
      ships: shipsWithCoordinates,
      indexPlayer,
      ws: ws,
      life: 10,
    });
  } else {
    playersShipsDB.push({
      gameId,
      players: [
        {
          ships: shipsWithCoordinates,
          indexPlayer,
          ws: ws,
          life: 10,
        },
      ],
    });
  }
}

// start_game
export function startGameRequest(gameId: string): void {
  const game = playersShipsDB.find((game) => game.gameId === gameId);

  if (game && game.players.length === 2) {
    game.players.map((player) =>
      player.ws.send(
        response<tPlayerShips>(
          { ships: player.ships, currentPlayerIndex: player.indexPlayer },
          "start_game"
        )
      )
    );
    const randomUser = game.players[Math.round(Math.random() * 1)];
    turnRequest(game, randomUser.indexPlayer);
  }
}

// attack
export function attackRequest(attack: tAttack) {
  const game = playersShipsDB.find((game) => game.gameId === attack.gameId);
  const bait = game?.players.find(
    (player) => player.indexPlayer != attack.indexPlayer
  );
  const attacker = game?.players.find(
    (player) => player.indexPlayer === attack.indexPlayer
  );
  const { x, y } = attack;
  let targetCor: { x: number; y: number } = {
    x: 0,
    y: 0,
  };
  const hit = bait?.ships.find((ship) => {
    const coordinates = ship.shipCoords.find((c) => c.x === x && c.y === y);
    if (coordinates) {
      targetCor = coordinates;
      return ship;
    } else {
      undefined;
    }
  });

  if (hit && hit.length === 1) {
    const attackRes = attackResponce(
      targetCor.x,
      targetCor.y,
      attacker?.indexPlayer,
      "killed"
    );

    attacker?.ws.send(response(attackRes, "attack"));

    hit.shipAroundCoords.forEach((cor) => {
      const attackRes = attackResponce(
        cor.x,
        cor.y,
        attacker?.indexPlayer,
        "miss"
      );
      attacker?.ws.send(response(attackRes, "attack"));
    });

    if (hit.life) {
      hit.life--;
      console.log("life");
    } else {
      const winner = playersDB.find(
        (player) => player.index === attacker?.indexPlayer
      );

      const isWinnerExist = winnersDB.find((w) => w.name === winner?.name);
      if (isWinnerExist) {
        isWinnerExist.wins++;
      } else {
        winnersDB.push({
          name: winner?.name,
          wins: 1,
        });
      }
      if (winner?.ws) {
        finishRequest(winner.ws, winner.index);
        updateWinnersReqeuest(winner.ws);
      }
    }
  } else if (hit && hit.length > 1) {
    hit.length--;
    const attackRes = attackResponce(
      targetCor.x,
      targetCor.y,
      attacker?.indexPlayer,
      "shot"
    );

    attacker?.ws.send(response(attackRes, "attack"));
  } else {
    const attackRes = attackResponce(
      attack.x,
      attack.y,
      attacker?.indexPlayer,
      "miss"
    );

    attacker?.ws.send(response(attackRes, "attack"));
  }
}

// turn
export function turnRequest(
  game: tPlayersShips,
  currentPlayer: string | number
) {
  game.players.map((player) =>
    player.ws.send(
      response<{ currentPlayer: string | number }>({ currentPlayer }, "turn")
    )
  );
}

// finish *TODO*
export function finishRequest(ws: WebSocket, winnerIndex: string | number) {
  ws.send(
    response<{ winPlayer: number | string }>(
      {
        winPlayer: winnerIndex,
      },
      "finish"
    )
  );
}
