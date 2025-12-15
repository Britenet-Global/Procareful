import WordleGif from '@ProcarefulGamesAssets/wordleGif.gif';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message, Spin } from 'antd';
import {
  type AddGameScoreDto,
  type AddGameScoreDtoGameLevel,
  AddGameScoreDtoGameName,
  type Wordle as WordleGameType,
  useUserControllerAddGameScore,
  useUserControllerGetGameLevelAndRules,
  useUserControllerGetLanguage,
  useUserControllerUpdateBrainPoints,
} from '@Procareful/common/api';
import { saveGameResult, useTypedTranslation } from '@Procareful/common/lib';
import GameControlModal from '../components/GameControlModal';
import GameTutorialModal from '../components/GameTutorialModal';
import SummaryContainer from '../components/SummaryContainer';
import TutorialScreen from '../components/TutorialScreen';
import { useTimer } from '../hooks';
import { GameDisplayState } from '../typings';
import Keyboard from './Keyboard';
import { TargetWordTag } from './TargetWordTag';
import WordleBoard from './WordleBoard';
import {
  KeyActions,
  LetterStatus,
  POLLING_INTERVAL,
  feedbackGameNavigationConfig,
  pointsToAddConfig,
} from './constants';
import wordList from './constants/wordList';
import { useWordleStore } from './store/wordleStore';
import { useStyles } from './styles';

const useWordleGame = () => {
  const { t } = useTypedTranslation();
  const { styles } = useStyles();
  const { timer, timeToDisplay, startTimer, stopTimer, resetTimer } = useTimer();
  const navigate = useNavigate();
  const { data: gameData, isLoading, refetch } = useUserControllerGetGameLevelAndRules('wordle');
  const { level: difficulty_level, scoreId = 0, rules } = gameData?.details || {};
  const { number_of_hints, number_of_chances } = (rules as WordleGameType) || {};
  const { mutate: sendGameScores } = useUserControllerAddGameScore();
  const { mutate: handleSendBrainPoints } = useUserControllerUpdateBrainPoints();
  const {
    targetWord,
    setTargetWord,
    letters,
    setLetters,
    board,
    setBoard,
    colors,
    setColors,
    currentRow,
    setCurrentRow,
    showHintLetter,
    hintLetterIndex,
    setHintLetterIndex,
    hintsRemaining,
    setHintsRemaining,
    numberOfAttempts,
    setNumberOfAttempts,
    gameFinished,
    setGameFinished,
    hintsUsed,
    setHintsUsed,
    gameResult,
    setGameResult,
    points,
    setPoints,
    showTutorial,
    setShowTutorial,
    showTutorialModal,
    setShowTutorialModal,
    showModal,
    setShowModal,
    gameDisplayState,
    setGameDisplayState,
  } = useWordleStore(state => ({
    targetWord: state.targetWord,
    setTargetWord: state.setTargetWord,
    letters: state.letters,
    setLetters: state.setLetters,
    board: state.board,
    setBoard: state.setBoard,
    colors: state.colors,
    setColors: state.setColors,
    currentRow: state.currentRow,
    setCurrentRow: state.setCurrentRow,
    showHintLetter: state.showHintLetter,
    setShowHintLetter: state.setShowHintLetter,
    hintLetterIndex: state.hintLetterIndex,
    setHintLetterIndex: state.setHintLetterIndex,
    hintsRemaining: state.hintsRemaining,
    setHintsRemaining: state.setHintsRemaining,
    numberOfAttempts: state.numberOfAttempts,
    setNumberOfAttempts: state.setNumberOfAttempts,
    gameFinished: state.gameFinished,
    setGameFinished: state.setGameFinished,
    hintsUsed: state.hintsUsed,
    setHintsUsed: state.setHintsUsed,
    gameResult: state.gameResult,
    setGameResult: state.setGameResult,
    points: state.points,
    setPoints: state.setPoints,
    showTutorial: state.showTutorial,
    setShowTutorial: state.setShowTutorial,
    showTutorialModal: state.showTutorialModal,
    setShowTutorialModal: state.setShowTutorialModal,
    showModal: state.showModal,
    setShowModal: state.setShowModal,
    gameDisplayState: state.gameDisplayState,
    setGameDisplayState: state.setGameDisplayState,
  }));

  const { data: languageData } = useUserControllerGetLanguage();
  const currentLanguage = languageData?.details.language.toLowerCase() || 'en';

  useEffect(() => {
    if (!showTutorial) {
      setGameDisplayState(GameDisplayState.PLAYING);
      initializeGame();
      resetTimer();
      startTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTutorial]);

  const initializeGame = useCallback(() => {
    const words = wordList[currentLanguage].filter(word => word.trim().length === 5);
    const selectedWord = words[Math.floor(Math.random() * words.length)];
    const initialBoard = Array.from({ length: number_of_chances }, () => Array(5).fill(''));
    setBoard(initialBoard);
    setColors(Array.from({ length: number_of_chances }, () => Array(5).fill('')));
    setTargetWord(selectedWord);
    setLetters(Array(5).fill(''));
    setCurrentRow(0);
    setNumberOfAttempts(0);
    setHintsUsed(0);
    setHintsRemaining(number_of_hints);
    setPoints(0);
    setGameFinished(false);
    setGameResult('lost');
    setHintLetterIndex([]);
    resetTimer();
    refetch();
    setShowTutorial(false);
    setShowModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    refetch,
    resetTimer,
    number_of_chances,
    number_of_hints,
    setBoard,
    setColors,
    setTargetWord,
    setLetters,
    setNumberOfAttempts,
    setHintsUsed,
    setHintsRemaining,
    setPoints,
    setGameFinished,
    setGameResult,
    setHintLetterIndex,
    setShowTutorial,
    setShowModal,
    setCurrentRow,
    languageData?.details.language,
  ]);

  const handleKeyPress = (key: string) => {
    if (currentRow >= number_of_chances) return;
    const filteredLetter =
      letters?.filter(letter => letter !== '').length < 5 &&
      /^(?:[a-ząćęłńóśźżÄÀÁÖÜČŠŽĐáÉÈŐÒÚÙŰẞÌÍ]|DŽ|LJ|NJ|DZS|DZ|CS|GY|LY|NY|SZ|TY|ZS)$/i.test(key);
    switch (key) {
      case KeyActions.Backspace:
        if (letters) {
          const newLetters = [...letters];
          for (let i = newLetters.length - 1; i >= 0; i--) {
            if (newLetters[i] !== '' && !(currentRow === 0 && hintLetterIndex.includes(i))) {
              newLetters[i] = '';
              break;
            }
          }
          setLetters(newLetters);
        }
        break;
      case KeyActions.Enter:
        handleSubmit();
        break;
      default:
        if (filteredLetter) {
          const newLetters = [...letters];

          for (let i = 0; i < newLetters.length; i++) {
            if (newLetters[i] === '' && !(currentRow === 0 && hintLetterIndex.includes(i))) {
              newLetters[i] = key;
              break;
            }
          }
          setLetters(newLetters);
        }
    }
  };

  const handleSubmit = () => {
    const word = letters
      .map((letter, index) => (hintLetterIndex.includes(index) ? targetWord[index] : letter))
      .join('');
    const totalLettersCount = word.length;
    if (totalLettersCount !== 5) {
      message.error(t('senior_games_enter_five_letter'));

      return;
    }
    setNumberOfAttempts(numberOfAttempts + 1);
    const isWordAlreadyOnBoard = board.some(row => row.join('') === word);
    if (word === targetWord) {
      handleSubmitWord(word);
    }
    if (
      isWordAlreadyOnBoard ||
      (wordList[currentLanguage] && wordList[currentLanguage].includes(word))
    ) {
      handlePresentAndCorrectLetters(word);
      handleSubmitWord(word);

      return;
    }

    return message.error(t('senior_games_word_not_in_the_list'));
  };

  const zeroPoints = 0;
  const pointsForLetter = 10;
  const pointsForHints = 25;

  const handleSubmitWord = (word: string) => {
    const newBoard = [...board];
    newBoard[currentRow] = word.split('');
    setBoard(newBoard);
    const isCorrectWord = word.toUpperCase() === targetWord;
    const calculatePointsToAdd = (): number => {
      if (isCorrectWord) {
        const basePoints = pointsToAddConfig[numberOfAttempts] || 0;

        return basePoints + (hintsUsed === 0 ? pointsForHints : zeroPoints);
      }
      const letterCounts = targetWord.split('').reduce(
        (acc, letter) => {
          acc[letter] = (acc[letter] || 0) + 1;

          return acc;
        },
        {} as Record<string, number>
      );
      const usedLetters = new Set<string>();
      const pointsFromLetters = word.split('').reduce((sum, letter) => {
        if (letterCounts[letter] && !usedLetters.has(letter)) {
          usedLetters.add(letter);

          return sum + pointsForLetter;
        }

        return sum;
      }, 0);
      const additionalPoints = currentRow + 1 >= number_of_chances ? 50 : 0;

      return pointsFromLetters + additionalPoints;
    };
    const pointsToAdd = calculatePointsToAdd();
    if (isCorrectWord) {
      setGameResult('won');
      setGameFinished(true);
      stopTimer();
    } else if (currentRow + 1 >= number_of_chances) {
      setGameResult('lost');
      setGameFinished(true);
      stopTimer();
    }
    setPoints(points + pointsToAdd);
    setLetters(Array(5).fill(''));
    setCurrentRow(currentRow + 1);
    checkCompletion();
  };

  const handlePresentAndCorrectLetters = (word: string) => {
    const newColors = [...colors];
    const rowColors = word.split('').map((letter, index) => {
      if (letter === targetWord[index]) return LetterStatus.Correct;
      if (targetWord.includes(letter)) return LetterStatus.Present;

      return '';
    });
    newColors[currentRow] = rowColors;
    setColors(newColors);
  };

  const getRandomHintIndex = (usedIndices: number[]) => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * targetWord.length);
    } while (usedIndices.includes(randomIndex));

    return randomIndex;
  };

  const handleAddHintLetter = () => {
    if (hintsRemaining > 0) {
      const newLetters = [...letters];
      const newHintIndices = [...hintLetterIndex];
      const hintIndex = getRandomHintIndex(newHintIndices);
      newHintIndices.push(hintIndex);
      newLetters[hintIndex] = targetWord[hintIndex];
      setLetters(newLetters);
      setHintLetterIndex(newHintIndices);
      setHintsRemaining(hintsRemaining - 1);
      setHintsUsed(hintsUsed + 1);
    }
  };

  const handleEndGameButtonClick = () => {
    setShowModal(true);
  };

  const handleConfirmEndGame = () => {
    stopTimer();
    initializeGame();
    setShowModal(false);
    navigate(feedbackGameNavigationConfig);
  };

  const checkGameLost = useCallback(() => {
    if (currentRow >= number_of_chances && !gameFinished) {
      setGameResult('lost');
      setGameFinished(true);
      const gameScores: AddGameScoreDto = {
        wordle: {
          number_of_tries: numberOfAttempts,
          number_of_hints_used: hintsUsed,
        },
        game_name: AddGameScoreDtoGameName.wordle,
        game_level: difficulty_level as AddGameScoreDtoGameLevel,
        completion_time: timer,
        completed: false,
      };
      sendGameScores({ scoreId, data: gameScores });
      handleSendBrainPoints({ data: { points } });
      saveGameResult({
        name: AddGameScoreDtoGameName.wordle,
        points,
        time: timeToDisplay,
        status: 'lost',
        difficultyLevel: difficulty_level as number,
      });
      initializeGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentRow,
    number_of_chances,
    gameFinished,
    numberOfAttempts,
    hintsUsed,
    difficulty_level,
    timer,
    scoreId,
    sendGameScores,
    timeToDisplay,
    points,
    setGameFinished,
    setGameResult,
    initializeGame,
    handleSendBrainPoints,
  ]);

  const checkCompletion = useCallback(() => {
    if (gameFinished && gameDisplayState === GameDisplayState.PLAYING) {
      const gameScores: AddGameScoreDto = {
        wordle: {
          number_of_tries: numberOfAttempts,
          number_of_hints_used: number_of_hints - hintsRemaining,
        },
        game_name: AddGameScoreDtoGameName.wordle,
        game_level: difficulty_level as AddGameScoreDtoGameLevel,
        completion_time: timer,
        completed: gameResult === 'won',
      };
      sendGameScores({ scoreId, data: gameScores });
      handleSendBrainPoints({ data: { points } });
      saveGameResult({
        name: AddGameScoreDtoGameName.wordle,
        points,
        time: timeToDisplay,
        status: gameResult === 'won' ? 'won' : 'lost',
        difficultyLevel: difficulty_level as number,
      });
      setGameDisplayState(GameDisplayState.DIFF);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gameFinished,
    numberOfAttempts,
    number_of_hints,
    hintsRemaining,
    difficulty_level,
    timer,
    gameResult,
    sendGameScores,
    scoreId,
    points,
    timeToDisplay,
    initializeGame,
    navigate,
    handleSendBrainPoints,
    gameDisplayState,
  ]);

  const handleDiffSubmit = () => {
    initializeGame();
    navigate(feedbackGameNavigationConfig);
  };

  useEffect(() => {
    if (gameFinished) {
      checkCompletion();
    }
  }, [gameFinished, checkCompletion]);

  useEffect(() => {
    checkGameLost();
  }, [checkGameLost]);

  useEffect(() => {
    if (timer % POLLING_INTERVAL || !timer) {
      return;
    }

    const gameScores: AddGameScoreDto = {
      wordle: {
        number_of_tries: numberOfAttempts,
        number_of_hints_used: number_of_hints - hintsRemaining,
      },
      game_name: AddGameScoreDtoGameName.wordle,
      game_level: difficulty_level as AddGameScoreDtoGameLevel,
      completion_time: timer,
      completed: gameResult === 'won',
    };
    sendGameScores({ scoreId, data: gameScores });
  }, [
    timer,
    numberOfAttempts,
    number_of_hints,
    hintsRemaining,
    difficulty_level,
    gameResult,
    sendGameScores,
    scoreId,
  ]);

  useEffect(
    () => {
      initializeGame();
      setShowTutorial(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const renderGame = () => (
    <>
      <SummaryContainer
        points={points}
        time={timeToDisplay}
        hints={hintsRemaining}
        handleOnHintsClick={handleAddHintLetter}
      />
      <div className={styles.container}>
        {!isLoading ? (
          <>
            <WordleBoard
              board={board}
              currentRow={currentRow}
              currentRowLetters={letters}
              targetWord={targetWord}
              showHintLetter={showHintLetter}
              hintLetterIndex={hintLetterIndex}
            />
            {gameDisplayState === GameDisplayState.PLAYING ? (
              <Keyboard language={currentLanguage} onKeyPress={handleKeyPress} />
            ) : (
              <>
                <Button
                  size="large"
                  type="primary"
                  className={styles.diffButton}
                  onClick={handleDiffSubmit}
                >
                  {t('senior_games_end_game_cell')}
                </Button>
                {gameResult === 'lost' && <TargetWordTag targetWord={targetWord} />}
              </>
            )}
          </>
        ) : (
          <div className={styles.spinContainer}>
            <Spin />
          </div>
        )}
      </div>
    </>
  );

  const renderGameTutorialModal = () => (
    <GameTutorialModal
      open={showTutorialModal}
      tutorialGif={WordleGif}
      description={t('senior_games_wordle_tutorial_text')}
      onCloseButtonClick={toggleTutorialModal}
    />
  );

  const toggleTutorialModal = () => {
    setShowTutorialModal(!showTutorialModal);
  };

  const handleBackToGame = () => {
    setShowModal(!showModal);
  };

  const renderWordleGame = () => (
    <>
      {showTutorial ? (
        <TutorialScreen
          onPlayButtonClick={() => setShowTutorial(!showTutorial)}
          tutorialGif={WordleGif}
          title={t('senior_games_wordle_tutorial_title')}
          description={t('senior_games_wordle_tutorial_text')}
        />
      ) : (
        renderGame()
      )}
      <GameControlModal
        type="endGame"
        open={showModal}
        onFirstButtonClick={handleBackToGame}
        onSecondButtonClick={handleConfirmEndGame}
      />
      {showTutorialModal && renderGameTutorialModal()}
    </>
  );

  return {
    points,
    showTutorial,
    toggleTutorialModal,
    renderWordleGame,
    handleEndGameButtonClick,
    difficultyLevel: difficulty_level,
  };
};

export default useWordleGame;
