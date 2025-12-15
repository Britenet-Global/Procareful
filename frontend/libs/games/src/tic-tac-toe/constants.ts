export const POINTS_EARN_WHEN_WIN = 50;
export const POINTS_EARN_WHEN_LOSE = 0;
export const POINTS_EARN_WHEN_DRAW = 25;
export const POINTS_EARN_WHEN_ALL_GAMES_FINISHED = 25;
export const POINTS_EARN_WHEN_WON_EXPECTED_NUMBER_OF_GAMES = 50;

export enum GameLevel {
  Easy = 1,
  EasyPlus = 2,
  Medium = 3,
  MediumPlus = 4,
  Hard = 5,
  HardPlus = 6,
}

export enum PlayerFigure {
  Circle = 'O',
  Cross = 'X',
}

export enum NoOneWon {
  Draw = 'draw',
}

export const aiDepth: Record<GameLevel, number> = {
  [GameLevel.Easy]: 2,
  [GameLevel.EasyPlus]: 3,
  [GameLevel.Medium]: 4,
  [GameLevel.MediumPlus]: 5,
  [GameLevel.Hard]: 5,
  [GameLevel.HardPlus]: Infinity,
};
