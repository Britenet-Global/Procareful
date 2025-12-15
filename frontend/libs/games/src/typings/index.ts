export enum GameResult {
  WON,
  LOST,
  DRAW,
}

export type Round = {
  id: number;
  status: GameResult | undefined | null;
};

export enum GameDisplayState {
  PLAYING = 'playing',
  DIFF = 'diff',
}
