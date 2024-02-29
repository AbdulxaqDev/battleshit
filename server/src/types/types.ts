import { WebSocket } from "ws";

export type tDefault = {
  type: string;
  data: string | object;
  id: number;
};

export type tPlayer = {
  name: string;
  password?: string;
  index: number | string;
  error?: boolean;
  errorText?: string;
  ws?: WebSocket;
};

export type tRoomPlayer = {
  name: string;
  index: number | string | undefined;
  ws: WebSocket;
};

export type tRoom = {
  roomId: number | string;
  roomUsers: tRoomPlayer[];
  ws: WebSocket;
};

export type tGame = {
  idGame: string;
  idPlayer: number | string | undefined;
};

export type tRooms = tRoom[] | string;

export type tShip = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  type: string;
  length: number;
};

export type tIncomingPlayerShips = {
  gameId: string;
  ships: tShip[];
  indexPlayer: number | string;
};

export type tSinglePlayerShips = {
  ships: tShip[];
  indexPlayer: number | string;
  ws: WebSocket;
};

export type tPlayerShips = {
  ships: tShip[];
  currentPlayerIndex: string | number;
};

export type tPlayersShips = {
  gameId: string;
  players: tSinglePlayerShips[];
};

export type tWinner = {
  name: string;
  wins: number;
};
