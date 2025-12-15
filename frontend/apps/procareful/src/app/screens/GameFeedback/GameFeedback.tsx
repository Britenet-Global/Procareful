import { type AddGameScoreDtoGameName } from '@Procareful/common/api';
import { type GameData } from '@Procareful/common/lib';
import {
  GAME_NAME_FROM_BACKEND_FORMAT,
  LocalStorageKey,
  SearchParams,
} from '@Procareful/common/lib/constants';
import TopBarLayout from '@ProcarefulApp/layout/TopBarLayout';
import { useSearchParams } from 'react-router-dom';
import { getFeedbackSteps } from './helpers';
import { useStyles } from './styles';

const GameFeedback = () => {
  const { styles } = useStyles();
  const [searchParams] = useSearchParams();
  const step = Number(searchParams.get(SearchParams.Step)) || 0;
  const gameName = (searchParams.get(SearchParams.Name) ||
    '') as unknown as AddGameScoreDtoGameName;

  const localStorageGameData = localStorage.getItem(LocalStorageKey.CompletedGameData);
  const gameDataParsed = localStorageGameData ? JSON.parse(localStorageGameData) : [];

  const gameData: GameData = gameDataParsed?.find((game: GameData) => game.name === gameName);

  return (
    <TopBarLayout
      title={GAME_NAME_FROM_BACKEND_FORMAT[gameName]}
      className={styles.layoutContainer}
    >
      <div className={styles.container}>{getFeedbackSteps(gameData)[step]}</div>
    </TopBarLayout>
  );
};

export default GameFeedback;
