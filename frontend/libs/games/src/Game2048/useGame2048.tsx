import Game2048Gif from '@ProcarefulGamesAssets/game2048gif.gif';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import {
  type AddGameScoreDto,
  type AddGameScoreDtoGameLevel,
  AddGameScoreDtoGameName,
  type Game2048,
  getUserControllerGetBrainPointsQueryKey,
  useUserControllerAddGameScore,
  useUserControllerGetGameLevelAndRules,
  useUserControllerUpdateBrainPoints,
} from '@Procareful/common/api';
import {
  ProcarefulAppPathRoutes,
  saveGameResult,
  SearchParams,
  useTypedTranslation,
} from '@Procareful/common/lib';
import GameTutorialModal from '../components/GameTutorialModal';
import SummaryContainer from '../components/SummaryContainer';
import TutorialScreen from '../components/TutorialScreen';
import { useTimer } from '../hooks/useTimer';
import { GameDisplayState } from '../typings';
import Board from './components/Board';
import { POLLING_INTERVAL } from './constants';
import { useGame2048Store } from './store/game2048store';
import { useStyles } from './styles';

const POINTS_TO_ADD_IF_USER_WON = 50;

const useGame2048 = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    gameState,
    setConfig,
    setBoard,
    setGameFinished,
    resetGame,
    showTutorial,
    setShowTutorial,
    showTutorialModal,
    setShowTutorialModal,
    gameDisplayState,
    setGameDisplayState,
  } = useGame2048Store(state => ({
    showTutorial: state.showTutorial,
    setShowTutorial: state.setShowTutorial,
    gameState: state.gameState,
    setConfig: state.setConfig,
    setBoard: state.setBoard,
    setGameFinished: state.setGameFinished,
    resetGame: state.resetGame,
    showTutorialModal: state.showTutorialModal,
    setShowTutorialModal: state.setShowTutorialModal,
    gameDisplayState: state.gameDisplayState,
    setGameDisplayState: state.setGameDisplayState,
  }));

  const { data: gameData, isLoading } = useUserControllerGetGameLevelAndRules(
    AddGameScoreDtoGameName.game_2048,
    {
      query: {
        refetchOnWindowFocus: false,
      },
    }
  );

  const { timer, timeToDisplay, stopTimer } = useTimer();

  const { mutate: sendGameScores } = useUserControllerAddGameScore({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getUserControllerGetBrainPointsQueryKey(),
        });
      },
    },
  });

  const { mutate: handleSendBrainPoints } = useUserControllerUpdateBrainPoints();

  const { scoreId = 0, rules, level } = gameData?.details || {};
  const { size_of_field, start_number } = (rules as Game2048) || {};

  const feedbackGameNavigationConfig = useMemo(
    () => ({
      pathname: ProcarefulAppPathRoutes.GameFeedback,
      search: new URLSearchParams({
        [SearchParams.Name]: AddGameScoreDtoGameName.game_2048.toString(),
      }).toString(),
    }),
    []
  );

  const handleEndGame = useCallback(() => {
    stopTimer();
    const isGameWon = gameState.status.isWon;
    const isGameCompleted = gameState.status.isFinished || gameState.status.isOver;

    const { score } = gameState;

    const gameScores: AddGameScoreDto = {
      game_2048: { score: gameState.score },
      game_name: AddGameScoreDtoGameName.game_2048,
      game_level: level as AddGameScoreDtoGameLevel,
      completion_time: timer,
      completed: isGameCompleted,
    };

    const points = !isGameWon ? score : score + POINTS_TO_ADD_IF_USER_WON;

    sendGameScores({ scoreId, data: gameScores });
    handleSendBrainPoints({
      data: { points },
    });

    saveGameResult({
      name: AddGameScoreDtoGameName.game_2048,
      points,
      time: timeToDisplay,
      status: isGameWon ? 'won' : 'lost',
      difficultyLevel: level,
    });

    setGameDisplayState(GameDisplayState.DIFF);
  }, [
    setGameDisplayState,
    stopTimer,
    gameState,
    level,
    timer,
    sendGameScores,
    scoreId,
    timeToDisplay,
    handleSendBrainPoints,
  ]);

  useEffect(() => {
    if (
      (gameState.status.isOver || gameState.status.isFinished) &&
      gameDisplayState === GameDisplayState.PLAYING
    ) {
      handleEndGame();
    }
  }, [gameState.status.isOver, gameState.status.isFinished, handleEndGame, gameDisplayState]);

  useEffect(() => {
    if (!gameState.status.isOver || gameState.status.isFinished) return;

    const gameOverDelay = setTimeout(() => {
      stopTimer();
      setGameFinished(true);
    }, 300);

    return () => clearTimeout(gameOverDelay);
  }, [gameState.status, stopTimer, setGameFinished]);

  useEffect(() => {
    if (!gameState.status.isWon || gameState.status.isFinished) return;

    const finishGameDelay = setTimeout(() => {
      stopTimer();
      setGameFinished(true);
    }, 300);

    return () => clearTimeout(finishGameDelay);
  }, [gameState.status, stopTimer, setGameFinished]);

  useEffect(() => {
    if (!level || !start_number || !size_of_field) {
      return;
    }

    setBoard(size_of_field);
    setConfig(level, size_of_field, start_number);
  }, [setConfig, setBoard, level, start_number, size_of_field]);

  useEffect(() => {
    const isGameCompleted = gameState.status.isFinished || gameState.status.isOver;

    if (timer % POLLING_INTERVAL || !timer || isGameCompleted) {
      return;
    }

    const gameScores: AddGameScoreDto = {
      game_2048: { score: gameState.score },
      game_name: AddGameScoreDtoGameName.game_2048,
      game_level: level as AddGameScoreDtoGameLevel,
      completion_time: timer,
      completed: isGameCompleted,
    };

    sendGameScores({ scoreId, data: gameScores });
  }, [sendGameScores, scoreId, timer, level, gameState.score, gameState.status]);

  const handleGameTutorialModalClose = () => {
    setShowTutorialModal(!showTutorialModal);
  };

  const handleTutorialIconClick = () => {
    setShowTutorialModal(true);
  };

  const handleDiffSubmit = () => {
    resetGame();
    navigate(feedbackGameNavigationConfig);
  };

  const renderGame = () => {
    if (isLoading) {
      return (
        <div className={styles.spinContainer}>
          <Spin />
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <SummaryContainer points={gameState.score} time={timeToDisplay} />
        <Board handleDiffSubmit={handleDiffSubmit} />
      </div>
    );
  };

  const renderGame2048 = () => (
    <>
      {showTutorial ? (
        <TutorialScreen
          tutorialGif={Game2048Gif}
          title={t('senior_games_2048_tutorial_title')}
          description={t('senior_games_2048_tutorial_text')}
          onPlayButtonClick={() => setShowTutorial(!showTutorial)}
        />
      ) : (
        renderGame()
      )}
      {showTutorialModal && (
        <GameTutorialModal
          open={showTutorialModal}
          tutorialGif={Game2048Gif}
          description={t('senior_games_2048_tutorial_text')}
          onCloseButtonClick={handleGameTutorialModalClose}
        />
      )}
    </>
  );

  return {
    showTutorial,
    handleTutorialIconClick,
    renderGame2048,
    points: gameState.score,
    resetGame,
    difficultyLevel: level,
  };
};

export default useGame2048;
