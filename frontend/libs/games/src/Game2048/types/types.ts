export type TileProps = {
  id: string;
  position: [number, number];
  value: number;
};

export type TileMap = { [id: string]: TileProps };

export enum MoveDirections {
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
}

type GameStatus = {
  isStarted: boolean;
  isFinished: boolean;
  isOver: boolean;
  isWon: boolean;
};

export type GameState = {
  board: string[][];
  tiles: TileMap;
  tilesByIds: string[];
  hasChanged: boolean;
  score: number;
  scoredValues: Set<number>;
  level?: number;
  status: GameStatus;
};

export type GameConfig = {
  totalCellsCount: number;
  tileCount: number;
  startingNumber: number;
};
