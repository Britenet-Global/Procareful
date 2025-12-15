import SudokuGif from '@ProcarefulGamesAssets/sudokuGif.gif';
import { t } from 'i18next';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spin } from 'antd';
import {
  type AddGameScoreDto,
  type AddGameScoreDtoGameLevel,
  AddGameScoreDtoGameName,
  useUserControllerAddGameScore,
  useUserControllerGetGameLevelAndRules,
  useUserControllerUpdateBrainPoints,
} from '@Procareful/common/api';
import {
  ProcarefulAppPathRoutes,
  saveGameResult,
  SearchParams,
  type SudokuGrid,
} from '@Procareful/common/lib';
import GameControlModal from '../components/GameControlModal';
import GameTutorialModal from '../components/GameTutorialModal';
import SummaryContainer from '../components/SummaryContainer';
import TutorialScreen from '../components/TutorialScreen';
import { useTimer } from '../hooks';
import { GameDisplayState } from '../typings';
import ButtonGrid from './components/ButtonGrid';
import { SolutionModal } from './components/SolutionModal';
import SudokuBoard from './components/SudokuBoard';
import { BOARD_SIZE, boards, FIRST_GROUP, NUMBER_OF_GROUP, POLLING_INTERVAL } from './constants';
import { countNumbersInBoard, getNumberOfPoints, getSudokuSolution } from './helpers';
import { generateBoard } from './hooks/GenerateBoard';
import { useSudokuStore } from './store/sudokuStore';
import { useStyles } from './styles';

const useSudokuGame = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();

  const {
    board,
    setBoard,
    initialBoard,
    setInitialBoard,
    solution,
    setSolution,
    gameDisplayState,
    setGameDisplayState,
    selectedCell,
    setSelectedCell,
    showModal,
    setShowModal,
    showTutorial,
    setShowTutorial,
    showTutorialModal,
    setShowTutorialModal,
    showSolutionModal,
    setShowSolutionModal,
    isValidSudoku,
    setIsValidSudoku,
    gameFinished,
    clearState,
  } = useSudokuStore(state => ({
    board: state.board,
    setBoard: state.setBoard,
    solution: state.solution,
    setSolution: state.setSolution,
    gameDisplayState: state.gameDisplayState,
    setGameDisplayState: state.setGameDisplayState,
    initialBoard: state.initialBoard,
    setInitialBoard: state.setInitialBoard,
    selectedCell: state.selectedCell,
    setSelectedCell: state.setSelectedCell,
    showModal: state.showModal,
    setShowModal: state.setShowModal,
    showTutorial: state.showTutorial,
    setShowTutorial: state.setShowTutorial,
    showTutorialModal: state.showTutorialModal,
    setShowTutorialModal: state.setShowTutorialModal,
    showSolutionModal: state.showSolutionModal,
    setShowSolutionModal: state.setShowSolutionModal,
    isValidSudoku: state.isValidSudoku,
    setIsValidSudoku: state.setIsValidSudoku,
    gameFinished: state.gameFinished,
    clearState: state.clearState,
  }));
  const { timer, timeToDisplay, stopTimer, resetTimer } = useTimer();
  const {
    data: gameData,
    isLoading,
    refetch,
  } = useUserControllerGetGameLevelAndRules('sudoku', {
    query: {
      refetchOnWindowFocus: false,
    },
  });
  const { level: difficulty_level, scoreId = 0 } = gameData?.details || {};
  const { mutate: sendGameScores } = useUserControllerAddGameScore();
  const { mutate: handleSendBrainPoints } = useUserControllerUpdateBrainPoints();
  const randomNumber = Math.floor(Math.random() * boards[difficulty_level || 1].length);

  const generatedSudokuBoard = generateBoard(boards[difficulty_level || 1][randomNumber]);

  const feedbackGameNavigationConfig = useMemo(
    () => ({
      pathname: ProcarefulAppPathRoutes.GameFeedback,
      search: new URLSearchParams({
        [SearchParams.Name]: AddGameScoreDtoGameName.sudoku.toString(),
      }).toString(),
    }),
    []
  );

  const checkValidSudoku = (board: SudokuGrid) => {
    const isUniqueAndComplete = (array: (number | null)[]) => {
      const setNumber = new Set<number>();

      return (
        array.every(cell => {
          if (cell === null) return false;
          if (setNumber.has(cell)) return false;
          setNumber.add(cell);

          return true;
        }) && setNumber.size === BOARD_SIZE
      );
    };

    const rowsValid = board.every(row => isUniqueAndComplete(row));

    const columnsValid = board[0]
      .map((_, colIndex) => board.map(row => row[colIndex]))
      .every(col => isUniqueAndComplete(col));

    const boxesValid = FIRST_GROUP.every(boxRow =>
      FIRST_GROUP.every(boxCol => {
        const box = board
          .slice(boxRow * NUMBER_OF_GROUP, boxRow * NUMBER_OF_GROUP + 3)
          .flatMap(row => row.slice(boxCol * NUMBER_OF_GROUP, boxCol * NUMBER_OF_GROUP + 3));

        return isUniqueAndComplete(box);
      })
    );

    return rowsValid && columnsValid && boxesValid;
  };

  const handleEndGameButtonClick = () => {
    setShowModal(true);
  };

  const handleRestart = () => {
    refetch();
    clearState();
    if (difficulty_level) {
      setShowModal(false);
      resetTimer();
    }
  };

  const handleConfirmEndGame = async () => {
    stopTimer();
    const isValidSudoku = checkValidSudoku(board);

    const gameScores: AddGameScoreDto = {
      sudoku: { number_of_hints_used: 0 },
      game_name: AddGameScoreDtoGameName.sudoku,
      game_level: difficulty_level as AddGameScoreDtoGameLevel,
      completion_time: timer,
      completed: isValidSudoku,
    };
    sendGameScores({ scoreId, data: gameScores });

    const points = getNumberOfPoints(isValidSudoku, initialBoard, board);

    if (points !== 0) {
      handleSendBrainPoints({
        data: { points },
      });
    }

    setShowModal(!showModal);

    saveGameResult({
      name: AddGameScoreDtoGameName.sudoku,
      points,
      time: timeToDisplay,
      status: isValidSudoku ? 'won' : 'lost',
      difficultyLevel: difficulty_level as number,
    });

    setGameDisplayState(GameDisplayState.DIFF);
    setIsValidSudoku(isValidSudoku);
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleCellValueChange = (value: number | null) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (initialBoard[row][col] === null) {
      const updatedBoard = board.map((row: (number | null)[]) => row.slice());
      updatedBoard[row][col] = value;
      setBoard(updatedBoard);
    }
  };

  const handleBackToGame = () => {
    setShowModal(!showModal);
  };

  const handleGameTutorialModalClose = () => {
    setShowTutorialModal(!showTutorialModal);
  };

  const handleTutorialIconClick = () => {
    setShowTutorialModal(true);
  };

  const handleShowSolutionModal = () => setShowSolutionModal(true);
  const handleCloseSolutionModal = () => setShowSolutionModal(false);

  const handleDiffSubmit = () => {
    handleRestart();
    navigate(feedbackGameNavigationConfig);
  };

  const renderGameTutorialModal = () => (
    <GameTutorialModal
      open={showTutorialModal}
      tutorialGif={SudokuGif}
      description={t('senior_games_sudoku_tutorial_text')}
      onCloseButtonClick={handleGameTutorialModalClose}
    />
  );

  const remainingNumbers = countNumbersInBoard(board);

  const renderGame = () => (
    <>
      <SummaryContainer points={0} time={timeToDisplay} />
      {!isLoading ? (
        <div className={styles.container}>
          <SudokuBoard
            board={board}
            onCellClick={handleCellClick}
            initialBoard={initialBoard}
            selectedCell={selectedCell}
            gameDisplayState={gameDisplayState}
            solution={solution}
          />
          {gameDisplayState === GameDisplayState.PLAYING ? (
            <ButtonGrid
              onGameButtonClick={handleCellValueChange}
              onEndGameButtonClick={handleEndGameButtonClick}
              remainingCounts={remainingNumbers}
            />
          ) : (
            <div className={styles.summaryWrapper}>
              {!isValidSudoku && (
                <Button
                  size="large"
                  className={styles.diffButton}
                  onClick={handleShowSolutionModal}
                >
                  {t('senior_btn_correct_answers')}
                </Button>
              )}
              <Button
                size="large"
                type="primary"
                className={styles.diffButton}
                onClick={handleDiffSubmit}
              >
                {t('senior_games_end_game_cell')}
              </Button>
            </div>
          )}
          <SolutionModal
            initialBoard={initialBoard}
            solution={solution}
            isOpen={showSolutionModal}
            onClose={handleCloseSolutionModal}
          />
        </div>
      ) : (
        <div className={styles.spinContainer}>
          <Spin />
        </div>
      )}
    </>
  );

  const renderSudokuGame = () => (
    <>
      {showTutorial ? (
        <TutorialScreen
          tutorialGif={SudokuGif}
          title={t('senior_games_sudoku_tutorial_title')}
          description={t('senior_games_sudoku_tutorial_text')}
          onPlayButtonClick={() => setShowTutorial(!showTutorial)}
        />
      ) : (
        renderGame()
      )}
      {showTutorialModal && renderGameTutorialModal()}
      <GameControlModal
        type="endGame"
        open={showModal}
        onFirstButtonClick={handleBackToGame}
        onSecondButtonClick={handleConfirmEndGame}
      />
    </>
  );

  useEffect(() => {
    const solution = getSudokuSolution(generatedSudokuBoard);
    if (!solution) return;

    setBoard(generatedSudokuBoard);
    setInitialBoard(generatedSudokuBoard);
    setSolution(solution);
    setSelectedCell(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setBoard, setInitialBoard, setSelectedCell, setSolution]);

  useEffect(() => {
    if (timer % POLLING_INTERVAL || !timer || gameFinished) {
      return;
    }

    const isValidSudoku = checkValidSudoku(board);
    const gameScores: AddGameScoreDto = {
      sudoku: { number_of_hints_used: 0 },
      game_name: AddGameScoreDtoGameName.sudoku,
      game_level: difficulty_level as AddGameScoreDtoGameLevel,
      completion_time: timer,
      completed: isValidSudoku && gameFinished,
    };
    sendGameScores({ scoreId, data: gameScores });
  }, [sendGameScores, scoreId, board, gameFinished, timer, difficulty_level]);

  useEffect(() => {
    setShowTutorial(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    showTutorial,
    renderSudokuGame,
    handleTutorialIconClick,
    points: getNumberOfPoints(false, board, initialBoard),
    clearState,
    difficultyLevel: difficulty_level,
  };
};

export default useSudokuGame;
