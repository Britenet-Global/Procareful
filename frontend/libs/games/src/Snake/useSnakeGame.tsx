import SnakeGif from '@ProcarefulGamesAssets/snakeGif.gif';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  type AddGameScoreDto,
  type AddGameScoreDtoGameLevel,
  AddGameScoreDtoGameName,
  useUserControllerAddGameScore,
  useUserControllerGetGameLevelAndRules,
  useUserControllerUpdateBrainPoints,
} from '@Procareful/common/api';
import { ProcarefulAppPathRoutes, saveGameResult, SearchParams } from '@Procareful/common/lib';
import GameTutorialModal from '../components/GameTutorialModal';
import SummaryContainer from '../components/SummaryContainer';
import TutorialScreen from '../components/TutorialScreen';
import { useTimer } from '../hooks';
import GameLogic from './components/GameLogic';
import {
  extraPointsForWin,
  extraPointsForWinInOneCombo,
  heartsAfterGame,
  numbersOfBlocksToWin,
  POLLING_INTERVAL,
} from './constants';
import { useSnakeStore } from './store/snakeStore';
import { useStyles } from './styles';

const useSnakeGame = () => {
  const { styles } = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { timer, timeToDisplay, resetTimer, stopTimer, startTimer } = useTimer();

  const feedbackGameNavigationConfig = useMemo(
    () => ({
      pathname: ProcarefulAppPathRoutes.GameFeedback,
      search: new URLSearchParams({
        [SearchParams.Name]: AddGameScoreDtoGameName.snake.toString(),
      }).toString(),
    }),
    []
  );

  const { data: gameData, refetch } = useUserControllerGetGameLevelAndRules('snake', {
    query: {
      refetchOnWindowFocus: false,
    },
  });
  const { level: difficulty_level, scoreId = 0, rules } = gameData?.details || {};
  const { mutate: sendGameScores } = useUserControllerAddGameScore();
  const { mutate: sendPoints } = useUserControllerUpdateBrainPoints();

  const {
    hearts,
    setHearts,
    points,
    setPoints,
    endGame,
    setEndGame,
    eatenBlock,
    setEatenBlock,
    showTutorial,
    setShowTutorial,
    eatenCombo,
    setEatenCombo,
    showTutorialModal,
    setShowTutorialModal,
  } = useSnakeStore(state => ({
    hearts: state.hearts,
    setHearts: state.setHearts,
    points: state.points,
    setPoints: state.setPoints,
    endGame: state.endGame,
    setEndGame: state.setEndGame,
    eatenBlock: state.eatenBlock,
    setEatenBlock: state.setEatenBlock,
    showTutorial: state.showTutorial,
    setShowTutorial: state.setShowTutorial,
    eatenCombo: state.eatenCombo,
    setEatenCombo: state.setEatenCombo,
    showTutorialModal: state.showTutorialModal,
    setShowTutorialModal: state.setShowTutorialModal,
  }));

  const handleRestart = () => {
    refetch();
    if (difficulty_level) {
      resetTimer();
      setHearts(heartsAfterGame);
      setEndGame(false);
      setEatenBlock(0);
    }
  };

  const checkIsGameOver = useCallback(() => {
    if (endGame === true || eatenBlock === numbersOfBlocksToWin) {
      stopTimer();
      const gameScores: AddGameScoreDto = {
        snake: {
          number_of_hearts_used: 0,
        },
        game_name: AddGameScoreDtoGameName.snake,
        game_level: difficulty_level as AddGameScoreDtoGameLevel,
        completion_time: timer,
        completed: true,
      };
      sendGameScores({ scoreId, data: gameScores });
      sendPoints({ data: { points } });

      saveGameResult({
        name: AddGameScoreDtoGameName.snake,
        points,
        time: timeToDisplay,
        status: eatenBlock === numbersOfBlocksToWin ? 'won' : 'lost',
        difficultyLevel: difficulty_level as number,
      });

      handleRestart();
      navigate(feedbackGameNavigationConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endGame]);

  const handleTutorialIconClick = () => {
    setShowTutorialModal(true);
  };

  useEffect(() => {
    checkIsGameOver();
  }, [checkIsGameOver]);

  useEffect(() => {
    const setHeartsForDifficultyLevel = 7 - (difficulty_level || 1);
    setHearts(setHeartsForDifficultyLevel);
    setPoints(0);
    resetTimer();
    setEatenBlock(0);
    setEatenCombo(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty_level]);

  useEffect(() => {
    if (eatenBlock === numbersOfBlocksToWin && eatenCombo === numbersOfBlocksToWin - 1) {
      setPoints(points + extraPointsForWinInOneCombo);
      setEndGame(true);

      return;
    }
    if (eatenBlock === numbersOfBlocksToWin) {
      setPoints(points + extraPointsForWin);
      setEndGame(true);

      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eatenBlock, eatenCombo]);

  const renderGameTutorialModal = () => (
    <GameTutorialModal
      open={showTutorialModal}
      tutorialGif={SnakeGif}
      description={t('senior_games_snake_tutorial_text')}
      onCloseButtonClick={() => setShowTutorialModal(!showTutorialModal)}
    />
  );

  const renderGame = () => (
    <>
      <SummaryContainer points={points} time={timeToDisplay} hearts={hearts} />
      <div className={styles.mainContainer}>
        <GameLogic
          showTutorialModal={showTutorialModal}
          resetTimer={resetTimer}
          startTimer={startTimer}
          stopTimer={stopTimer}
          setPoints={setPoints}
          hearts={hearts}
          setHearts={setHearts}
          setEndGame={setEndGame}
          eatenBlock={eatenBlock}
          setEatenBlock={setEatenBlock}
          eatenCombo={eatenCombo}
          setEatenCombo={setEatenCombo}
        />
      </div>
    </>
  );

  const renderSnakeGame = () => (
    <>
      {showTutorial ? (
        <TutorialScreen
          tutorialGif={SnakeGif}
          title={t('senior_games_snake_tutorial_title')}
          description={t('senior_games_snake_tutorial_text')}
          onPlayButtonClick={() => setShowTutorial(!showTutorial)}
        />
      ) : (
        renderGame()
      )}
      {showTutorialModal && renderGameTutorialModal()}
    </>
  );

  useEffect(() => {
    if (
      timer % POLLING_INTERVAL ||
      !timer ||
      endGame ||
      (rules && !('number_of_hearts' in rules))
    ) {
      return;
    }

    const gameScores: AddGameScoreDto = {
      snake: {
        number_of_hearts_used: rules?.number_of_hearts ? rules?.number_of_hearts - hearts : 0,
      },
      game_name: AddGameScoreDtoGameName.snake,
      game_level: difficulty_level as AddGameScoreDtoGameLevel,
      completion_time: timer,
      completed: endGame,
    };

    sendGameScores({ scoreId, data: gameScores });
  }, [sendGameScores, scoreId, endGame, timer, difficulty_level, hearts, rules]);

  useEffect(
    () => {
      setShowTutorial(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    showTutorial,
    points,
    renderSnakeGame,
    handleTutorialIconClick,
    difficultyLevel: difficulty_level,
  };
};

export default useSnakeGame;
