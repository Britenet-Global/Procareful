import { type AddGameScoreDtoGameName } from '@Procareful/common/api';
import { type GameData, LocalStorageKey } from '@Procareful/common/lib';

type GameResult = 'won' | 'lost' | 'aborted';

const getFeedbackType = (
  currentDifficultyLevel?: number,
  oldDifficultyLevel?: number,
  currentGameResult?: GameResult,
  oldGameResult?: GameResult
) => {
  if (oldDifficultyLevel && currentDifficultyLevel && currentDifficultyLevel > oldDifficultyLevel) {
    return 'increasedDifficultyLevel';
  }

  if (currentGameResult === 'aborted') {
    return 'closingGameBeforeCompletion';
  }

  if (currentGameResult === 'lost' && oldGameResult === 'lost') {
    return 'secondLoss';
  }
};

const getStoredGamesHistory = (): GameData[] => {
  const storedData = localStorage.getItem(LocalStorageKey.CompletedGameData);

  return storedData ? JSON.parse(storedData) : [];
};

const findGameHistory = (
  gamesHistory: GameData[],
  gameName: AddGameScoreDtoGameName
): GameData | undefined => gamesHistory.find(game => game.name === gameName);

const createNewGameRecord = (
  name: AddGameScoreDtoGameName,
  points: number,
  time?: string,
  status?: GameResult,
  difficultyLevel?: number,
  feedbackType?: GameData['feedbackType']
) => ({
  name,
  points,
  time,
  status,
  difficultyLevel,
  feedbackType,
});

const updateGamesHistory = (
  gamesHistory: Partial<GameData>[],
  newGameRecord: Partial<GameData>
) => {
  const existingGameIndex = gamesHistory.findIndex(game => game.name === newGameRecord.name);
  if (existingGameIndex !== -1)
    return gamesHistory.map(game => (game.name === newGameRecord.name ? newGameRecord : game));

  return [...gamesHistory, newGameRecord];
};

const saveGamesHistory = (gamesHistory: Partial<GameData>[]): void => {
  localStorage.setItem(LocalStorageKey.CompletedGameData, JSON.stringify(gamesHistory));
};

export type PartialGameData = Partial<Omit<GameData, 'feedbackType'>> & {
  name: AddGameScoreDtoGameName;
  points: number;
};

export const saveGameResult = ({
  name,
  points,
  time,
  status,
  difficultyLevel,
}: PartialGameData): boolean => {
  const gamesHistory = getStoredGamesHistory();
  const currentGameHistory = findGameHistory(gamesHistory, name);

  const feedbackType = getFeedbackType(
    difficultyLevel,
    currentGameHistory?.difficultyLevel,
    status,
    currentGameHistory?.status as GameResult
  );

  const newGameRecord = createNewGameRecord(
    name,
    points,
    time,
    status,
    difficultyLevel,
    feedbackType
  );
  const updatedGamesHistory = updateGamesHistory(gamesHistory, newGameRecord);

  saveGamesHistory(updatedGamesHistory);

  const canPlayAgain = !feedbackType;

  return canPlayAgain;
};
