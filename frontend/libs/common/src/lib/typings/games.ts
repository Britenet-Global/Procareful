import { type AddGameScoreDtoGameName } from '@Procareful/common/api';

export type GameStatus = 'won' | 'lost' | 'aborted';

export type GameData = {
  name: AddGameScoreDtoGameName;
  status: GameStatus;
  points: number;
  time: string;
  feedbackType?: 'increasedDifficultyLevel' | 'secondLoss' | 'closingGameBeforeCompletion';
  difficultyLevel: number;
};

export type SudokuGrid = (number | null)[][];
export type SolvedSudokuGrid = number[][];
