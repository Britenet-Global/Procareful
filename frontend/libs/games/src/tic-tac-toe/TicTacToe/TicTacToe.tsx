import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import {
  type AddGameScoreDto,
  type AddGameScoreDtoGameLevel,
  AddGameScoreDtoGameName,
  useUserControllerAddGameScore,
  useUserControllerGetGameLevelAndRules,
  useUserControllerUpdateBrainPoints,
  type TicTacToe as TicTacToeRules,
} from '@Procareful/common/api';
import {
  ProcarefulAppPathRoutes,
  saveGameResult,
  SearchParams,
  useTimer,
  useTypedTranslation,
} from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SummaryContainer from '../../components/SummaryContainer';
import { GameDisplayState, GameResult } from '../../typings';
import {
  GameLevel,
  NoOneWon,
  PlayerFigure,
  POINTS_EARN_WHEN_ALL_GAMES_FINISHED,
  POINTS_EARN_WHEN_WON_EXPECTED_NUMBER_OF_GAMES,
} from '../constants';
import { type Player, checkWinner, handleAIMove } from '../helpers';
import { useTicTacToeStore } from '../store/ticTacToeStore';
import { useStyles } from '../styles';

const TicTacToe = () => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();

  const {
    isGameOver,
    isGameStarted,
    gameConfig,
    isPlayerTurn,
    setIsPlayerTurn,
    board,
    progress,
    score,
    playerFigure,
    aiFigure,
    winner,
    setWinner,
    playerPoints,
    currentGamePoints,
    setCurrentGamePoints,
    startGame,
    resetBoard,
    setProgress,
    setUpdatedBoard,
    setPlayersFigure,
    setPlayerScore,
    clearState,
    setPlayerPoints,
    gameDisplayState,
    setGameDisplayState,
    winningCells,
    setWinningCells,
  } = useTicTacToeStore(state => ({
    isGameOver: state.isGameOver,
    isGameStarted: state.isGameStarted,
    gameConfig: state.gameConfig,
    isPlayerTurn: state.isPlayerTurn,
    setIsPlayerTurn: state.setIsPlayerTurn,
    board: state.board,
    progress: state.progress,
    score: state.score,
    gameLevel: state.gameLevel,
    playerFigure: state.playerFigure,
    aiFigure: state.aiFigure,
    winner: state.winner,
    setWinner: state.setWinner,
    playerPoints: state.points,
    currentGamePoints: state.currentGamePoints,
    startGame: state.startGame,
    resetBoard: state.resetBoard,
    currentRound: state.currentRound,
    setUpdatedBoard: state.setUpdatedBoard,
    setProgress: state.setProgress,
    setPlayersFigure: state.setPlayersFigure,
    setPlayerScore: state.setPlayerScore,
    setCurrentGamePoints: state.setCurrentGamePoints,
    clearState: state.clearState,
    setPlayerPoints: state.setPlayerPoints,
    gameDisplayState: state.gameDisplayState,
    setGameDisplayState: state.setGameDisplayState,
    winningCells: state.winningCells,
    setWinningCells: state.setWinningCells,
  }));

  const { timer, timeToDisplay, startTimer, stopTimer } = useTimer();
  const { data: gameData } = useUserControllerGetGameLevelAndRules(
    AddGameScoreDtoGameName.tic_tac_toe
  );

  const { scoreId = 0, level: difficulty_level, rules } = gameData?.details || {};

  const {
    number_of_fields,
    number_of_figures_in_one_line_to_win,
    number_of_games_to_play,
    number_of_games_to_win,
  } = (rules as TicTacToeRules) || {};

  const { mutate: sendGameScores } = useUserControllerAddGameScore();
  const { mutate: sendPoints } = useUserControllerUpdateBrainPoints();

  const allLevelsPlayed = progress?.length > 0 && progress.every(item => item.status !== null);

  const feedbackGameNavigationConfig = useMemo(
    () => ({
      pathname: ProcarefulAppPathRoutes.GameFeedback,
      search: new URLSearchParams({
        [SearchParams.Name]: AddGameScoreDtoGameName.tic_tac_toe.toString(),
      }).toString(),
    }),
    []
  );

  const isUserWinner = winner === playerFigure;

  const handleDrawFigure = useCallback(() => {
    const drawPlayerFigure = Math.floor(Math.random() * 2);
    const playerFigure = drawPlayerFigure ? PlayerFigure.Circle : PlayerFigure.Cross;
    const aiFigure = drawPlayerFigure ? PlayerFigure.Cross : PlayerFigure.Circle;

    setPlayersFigure(playerFigure, aiFigure);
  }, [setPlayersFigure]);

  useEffect(() => {
    if (
      isGameStarted ||
      !difficulty_level ||
      !number_of_fields ||
      !number_of_games_to_win ||
      !number_of_games_to_play
    ) {
      return;
    }

    const levelsArr = [
      GameLevel.Easy,
      GameLevel.EasyPlus,
      GameLevel.Medium,
      GameLevel.MediumPlus,
      GameLevel.Hard,
      GameLevel.HardPlus,
    ];

    const gameLevel = levelsArr[difficulty_level - 1];

    if (
      difficulty_level &&
      number_of_fields &&
      number_of_games_to_win &&
      number_of_games_to_play &&
      number_of_figures_in_one_line_to_win
    ) {
      startGame(
        gameLevel,
        number_of_fields,
        number_of_figures_in_one_line_to_win,
        number_of_games_to_play,
        number_of_games_to_win,
        handleDrawFigure
      );
    }
  }, [
    difficulty_level,
    number_of_fields,
    number_of_games_to_win,
    number_of_games_to_play,
    isGameStarted,
    startGame,
    handleDrawFigure,
    number_of_figures_in_one_line_to_win,
  ]);

  useEffect(() => {
    if (!isGameStarted || isGameOver || isPlayerTurn) {
      return;
    }
    const AIMoveTimeout = setTimeout(() => {
      const figurePosition = handleAIMove(
        board,
        playerFigure,
        number_of_figures_in_one_line_to_win
      );
      const newBoard = JSON.parse(JSON.stringify(board));

      newBoard[figurePosition[0]][figurePosition[1]] = aiFigure;
      setUpdatedBoard(newBoard);

      setIsPlayerTurn(true);
    }, 500);

    return () => clearTimeout(AIMoveTimeout);
  }, [
    isPlayerTurn,
    isGameOver,
    aiFigure,
    board,
    number_of_figures_in_one_line_to_win,
    playerFigure,
    setIsPlayerTurn,
    setUpdatedBoard,
    isGameStarted,
    gameConfig.aiDepth,
  ]);

  useEffect(() => {
    if (!isGameStarted || isGameOver || !board || !number_of_figures_in_one_line_to_win) {
      return;
    }
    const { winner: whoIsTheWinner, winningCells } = checkWinner(
      board,
      number_of_figures_in_one_line_to_win
    );

    if (winningCells?.length) {
      setWinningCells(winningCells);
    }

    if (whoIsTheWinner) {
      setPlayerScore(whoIsTheWinner);
      setWinner(whoIsTheWinner);
      const currentScore = [...score];

      const isPlayerAWinner = () => {
        const isPlayerWinner = whoIsTheWinner === playerFigure;
        const isAIWinner =
          whoIsTheWinner && whoIsTheWinner !== playerFigure && whoIsTheWinner !== NoOneWon.Draw;
        const isDraw = whoIsTheWinner === NoOneWon.Draw;

        if (isPlayerWinner) {
          return true;
        }

        if (isDraw) {
          return 'draw';
        }

        if (isAIWinner) {
          return false;
        }
      };

      const updateCurrentScore = () => {
        const allNull = currentScore.every(item => item.isWon === null);
        if (allNull) {
          return currentScore.map((item, index) =>
            index === 0 ? { ...item, isWon: isPlayerAWinner() } : item
          );
        } else {
          return currentScore.map((item, index, array) => {
            if (array[index - 1]?.isWon !== null && item.isWon === null) {
              return { ...item, isWon: isPlayerAWinner() };
            }

            return item;
          });
        }
      };

      const newScore = updateCurrentScore();
      const allGamesFinished = newScore.every(item => item.isWon !== null);
      const numberOfWins = newScore.filter(user => user.isWon === true).length;

      if (allGamesFinished) {
        const points =
          numberOfWins === number_of_games_to_win
            ? POINTS_EARN_WHEN_ALL_GAMES_FINISHED + POINTS_EARN_WHEN_WON_EXPECTED_NUMBER_OF_GAMES
            : POINTS_EARN_WHEN_ALL_GAMES_FINISHED;

        setPlayerPoints(points);
        sendPoints({
          data: {
            points,
          },
        });
      }

      const gameScores: AddGameScoreDto = {
        tic_tac_toe: {
          number_of_wins: numberOfWins,
        },
        game_name: AddGameScoreDtoGameName.tic_tac_toe,
        game_level: difficulty_level as AddGameScoreDtoGameLevel,
        completion_time: timer,
        completed: allGamesFinished,
      };
      sendGameScores({ scoreId, data: gameScores });
      setProgress(whoIsTheWinner);
      stopTimer();
    }
  }, [
    setWinningCells,
    board,
    setPlayerScore,
    setWinner,
    stopTimer,
    number_of_figures_in_one_line_to_win,
    isGameOver,
    isGameStarted,
    number_of_games_to_win,
    playerFigure,
    score,
    scoreId,
    sendGameScores,
    setProgress,
    timer,
    difficulty_level,
    sendPoints,
    setPlayerPoints,
  ]);

  useEffect(() => {
    if (winner && currentGamePoints !== 0) {
      sendPoints({
        data: {
          points: currentGamePoints,
        },
      });
    }

    const numberOfWins = progress?.filter(p => p.status === GameResult.WON)?.length;
    const hasWon = numberOfWins >= number_of_games_to_win;

    if (allLevelsPlayed) {
      saveGameResult({
        name: AddGameScoreDtoGameName.tic_tac_toe,
        points: playerPoints,
        time: timeToDisplay,
        status: hasWon ? 'won' : 'lost',
        difficultyLevel: difficulty_level as number,
      });

      setGameDisplayState(GameDisplayState.DIFF);
    }
  }, [
    setGameDisplayState,
    winner,
    currentGamePoints,
    sendPoints,
    allLevelsPlayed,
    setCurrentGamePoints,
    playerPoints,
    clearState,
    timeToDisplay,
    difficulty_level,
    progress,
    number_of_games_to_win,
  ]);

  const resetGame = () => {
    setWinningCells([]);
    resetBoard(number_of_fields);
    startTimer();
    handleDrawFigure();
  };

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] || isGameOver || !isPlayerTurn) return;
    const newBoard = [...board];
    newBoard[row][col] = playerFigure;
    setUpdatedBoard(newBoard);

    setIsPlayerTurn(false);
  };

  const renderProperFigure = (figure: Player) => {
    if (figure === PlayerFigure.Circle) {
      return <RadioButtonUncheckedIcon className={styles.circleFigureIconSmall} />;
    }

    if (figure === PlayerFigure.Cross) {
      return <CloseIcon className={styles.crossFigureIconSmall} />;
    }

    return null;
  };

  const handleDiffSubmit = () => {
    clearState();
    navigate(feedbackGameNavigationConfig);
  };

  return (
    <div className={styles.container}>
      <div className={styles.gameInfoContainer}>
        <SummaryContainer gameRounds={progress} time={timeToDisplay} points={playerPoints} />
      </div>
      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => {
              const isSolutionCell = isGameOver && winningCells.includes(`${rowIndex}-${colIndex}`);

              return (
                <div
                  key={colIndex}
                  className={cx(styles.cell, {
                    [styles.failureCell]: isSolutionCell && !isUserWinner,
                    [styles.successCell]: isSolutionCell && isUserWinner,
                  })}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {renderProperFigure(cell)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {gameDisplayState === GameDisplayState.PLAYING ? (
        <>
          {isGameOver ? (
            <Button size="large" type="primary" className={styles.button} onClick={resetGame}>
              {t('senior_games_modal_button_lets_go')}
            </Button>
          ) : (
            <>
              <div className={styles.figureContainer}>
                <div className={styles.figureDescription}>
                  <Text className={styles.figureText}>{t('senior_games_your_figure')}</Text>
                  {playerFigure === PlayerFigure.Cross ? (
                    <CloseIcon className={styles.chosenFigureIcon} />
                  ) : (
                    <RadioButtonUncheckedIcon className={styles.chosenFigureIcon} />
                  )}
                </div>
              </div>
              <div className={styles.figureContainer}>
                <div className={styles.figureDescription}>
                  <Text className={styles.figureText}>
                    {t('senior_games_number_of_figures_to_win')}{' '}
                    {number_of_figures_in_one_line_to_win}
                  </Text>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <Button size="large" type="primary" className={styles.button} onClick={handleDiffSubmit}>
          {t('senior_games_end_game_cell')}
        </Button>
      )}
    </div>
  );
};

export default TicTacToe;
