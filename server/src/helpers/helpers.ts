import { playersDB } from "src/db/db";
import { tPlayer } from "src/types/types";

export function checkUser(player: tPlayer) {
  const { name, password } = player.data;

  return playersDB.find(
    (player) => player.data.name === name && player.data.password === password
  );
}

export function addPlayer(newPlayer: tPlayer) {
  playersDB.push(newPlayer);
  console.log(newPlayer);
  console.log(playersDB);
}
