import { MOCKED_GAMES } from './constants';

export const excludeDailyGame = (todayGameName?: string) =>
  MOCKED_GAMES.filter(game => game.gameCode !== todayGameName);

export const formatGameName = (str: string) => {
  const gameNameUppercase = str.charAt(0).toUpperCase() + str.slice(1);

  return gameNameUppercase.split('_').join(' ');
};
