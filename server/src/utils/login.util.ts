import { addPlayer, checkUser } from "src/helpers/helpers";
import { tPlayer } from "src/types/types";
import { v4 as uuidv4 } from "uuid";

export function playerDataToStr(player: tPlayer): string {
  const stringData = {
    ...player,
    data: JSON.stringify(player.data),
  };
  return JSON.stringify(stringData);
}

export function playerDataToJSON(player: string) {
  const rawPlayer = JSON.parse(player.toString());

  return {
    ...rawPlayer,
    data: JSON.parse(rawPlayer.data),
  };
}

export function register(player: tPlayer): string {
  const isExist = checkUser(player);
  if (isExist) {
    const { name, index, error, errorText } = isExist.data;
    return playerDataToStr({
      ...isExist,
      data: {
        name,
        index,
        error,
        errorText,
      },
    });
  } else {
    const { name, password } = player.data;

    const newPlayerWithPassword = {
      ...player,
      data: {
        name,
        password,
        index: uuidv4(),
        error: false,
        errorText: "noError",
      },
    };

    const newPlayerWithoutPassword = {
      ...player,
      data: {
        name,
        index: uuidv4(),
        error: false,
        errorText: "noError",
      },
    };

    addPlayer(newPlayerWithPassword);

    return playerDataToStr(newPlayerWithoutPassword);
  }
}
