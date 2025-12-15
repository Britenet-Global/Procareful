import wordGuessGif from '@ProcarefulGamesAssets/wordGuessGif.gif';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Spin } from 'antd';
import {
  type AddGameScoreDto,
  type AddGameScoreDtoGameLevel,
  AddGameScoreDtoGameName,
  useUserControllerAddGameScore,
  useUserControllerGetGameLevelAndRules,
  useUserControllerGetLanguage,
  useUserControllerUpdateBrainPoints,
  type WordGuess as WordGuessGameType,
} from '@Procareful/common/api';
import { ProcarefulAppPathRoutes, saveGameResult, SearchParams } from '@Procareful/common/lib';
import GameControlModal from '../components/GameControlModal';
import GameTutorialModal from '../components/GameTutorialModal';
import SummaryContainer from '../components/SummaryContainer';
import TutorialScreen from '../components/TutorialScreen';
import { useTimer } from '../hooks';
import { GameDisplayState, GameResult } from '../typings';
import Keyboard from './components/Keyboard';
import WordGuessDisplay from './components/WordGuessDisplay';
import { POLLING_INTERVAL } from './constants';
import { selectWordByLengthAndLanguage } from './helpers';
import { useWordGuessStore } from './store/wordGuessStore';
import { useStyles } from './styles';

export const useWordGuessGame = () => {
  const { styles } = useStyles();
  const { t } = useTranslation();
  const { timer, timeToDisplay, stopTimer, startTimer, resetTimer } = useTimer();
  const navigate = useNavigate();
  const { data: gameData, isLoading } = useUserControllerGetGameLevelAndRules('word_guess');
  const { rules, level: difficulty_level, scoreId = 0 } = gameData?.details || {};
  const {
    number_of_hearts,
    number_of_hints: initialHints,
    word_length,
    number_of_words_to_guess,
  } = (rules as WordGuessGameType) || {};
  const { mutate: sendGameScores } = useUserControllerAddGameScore();
  const { mutate: sendPoints } = useUserControllerUpdateBrainPoints();
  const { data: languageData } = useUserControllerGetLanguage();
  const currentLanguage = languageData?.details.language || 'EN';

  const {
    wordToGuess,
    guessLetters,
    isModalVisible,
    currentScore,
    heartsToHide,
    setGuessLetters,
    showTutorial,
    setShowTutorial,
    showTutorialModal,
    setShowTutorialModal,
    showModal,
    setShowModal,
    setWordToGuess,
    setHeartsToHide,
    decrementHearts,
    addWrongGuess,
    resetWrongGuesses,
    wrongGuesses,
    requestHint,
    setNumberOfHints,
    numberOfHints,
    setGameResult,
    currentRound,
    totalRounds,
    gameRounds,
    setTotalRounds,
    setCurrentRound,
    setGameRounds,
    points,
    setPoints,
    gameFinished,
    setGameFinished,
    setCurrentScore,
    resetGame,
    gameDisplayState,
    setGameDisplayState,
  } = useWordGuessStore(state => ({
    wordToGuess: state.wordToGuess,
    guessLetters: state.guessLetters,
    isModalVisible: state.isModalVisible,
    currentScore: state.currentScore,
    heartsToHide: state.heartsToHide,
    setGuessLetters: state.setGuessLetters,
    updateScore: state.updateScore,
    showTutorial: state.showTutorial,
    setShowTutorial: state.setShowTutorial,
    showTutorialModal: state.showTutorialModal,
    setShowTutorialModal: state.setShowTutorialModal,
    showModal: state.showModal,
    setShowModal: state.setShowModal,
    setWordToGuess: state.setWordToGuess,
    setHeartsToHide: state.setHeartsToHide,
    decrementHearts: state.decrementHearts,
    addWrongGuess: state.addWrongGuess,
    wrongGuesses: state.wrongGuesses,
    resetWrongGuesses: state.resetWrongGuesses,
    requestHint: state.requestHint,
    setNumberOfHints: state.setNumberOfHints,
    numberOfHints: state.numberOfHints,
    setGameResult: state.setGameResult,
    nextRound: state.nextRound,
    currentRound: state.currentRound,
    totalRounds: state.totalRounds,
    gameRounds: state.gameRounds,
    setTotalRounds: state.setTotalRounds,
    setCurrentRound: state.setCurrentRound,
    setGameRounds: state.setGameRounds,
    points: state.points,
    setPoints: state.setPoints,
    gameFinished: state.gameFinished,
    setGameFinished: state.setGameFinished,
    setCurrentScore: state.setCurrentScore,
    resetGame: state.resetGame,
    gameDisplayState: state.gameDisplayState,
    setGameDisplayState: state.setGameDisplayState,
  }));

  useEffect(
    () => {
      resetGame();
      setCurrentRound(0);
      setPoints(0);
      setCurrentScore(0);
      setShowTutorial(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(
    () => {
      if (gameData?.details) {
        setTotalRounds(number_of_words_to_guess || 1);
        setHeartsToHide(heartsToHide < number_of_hearts ? heartsToHide : number_of_hearts);
        setNumberOfHints(numberOfHints < initialHints ? numberOfHints : initialHints);
        setShowModal(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameData]
  );

  useEffect(
    () => {
      if (currentRound >= 0) {
        const selectedWord = selectWordByLengthAndLanguage(currentLanguage, word_length);

        if (selectedWord?.length && selectedWord !== wordToGuess) {
          setWordToGuess(selectedWord);
          setGuessLetters([]);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRound, word_length, currentLanguage]
  );

  const feedbackGameNavigationConfig = {
    pathname: ProcarefulAppPathRoutes.GameFeedback,
    search: new URLSearchParams({
      [SearchParams.Name]: AddGameScoreDtoGameName.word_guess,
    }).toString(),
  };

  const handleUseHint = () => {
    if (numberOfHints <= 0 || heartsToHide <= 0 || isModalVisible) return;

    const unrevealedLetters = wordToGuess
      .split('')
      .filter(letter => !guessLetters.includes(letter) && letter !== ' ');

    if (unrevealedLetters.length === 0) return;

    const randomLetter = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
    const updatedGuessLetters = [...guessLetters, randomLetter];

    setGuessLetters(updatedGuessLetters);
    requestHint();
    setNumberOfHints(numberOfHints - 1);

    const isWordGuessed = wordToGuess
      .split('')
      .every(letter => updatedGuessLetters.includes(letter));
    if (isWordGuessed) {
      endGame(GameResult.WON);
    }
  };

  const handleGameTutorialModalClose = () => {
    setShowTutorialModal(!showTutorialModal);
  };

  const renderGameTutorialModal = () => (
    <GameTutorialModal
      open={showTutorialModal}
      tutorialGif={wordGuessGif}
      description={t('senior_games_wordguess_tutorial_text')}
      onCloseButtonClick={handleGameTutorialModalClose}
    />
  );

  const handleBackToGame = () => {
    setShowModal(false);
    startTimer();
    nextRound();
  };

  const handleTutorialIconClick = () => {
    setShowTutorialModal(true);
  };

  const sendGameResult = useCallback(
    (totalPoints: number, isCanceled?: boolean) => {
      if (!difficulty_level) {
        return;
      }

      sendGameScores({
        scoreId,
        data: {
          game_level: difficulty_level,
          word_guess: {
            number_of_words_to_guess: currentRound + 1,
            number_of_hints: numberOfHints,
            word_length: word_length,
            number_of_hearts: heartsToHide,
          },
          game_name: AddGameScoreDtoGameName.word_guess,
          completed: !isCanceled && gameFinished === GameResult.WON,
        },
      });

      if (currentScore || totalPoints) {
        sendPoints({ data: { points: totalPoints || currentScore } });
      }

      if (isCanceled) {
        return;
      }

      saveGameResult({
        name: AddGameScoreDtoGameName.word_guess,
        points: totalPoints,
        time: timeToDisplay,
        status: gameFinished === GameResult.WON ? 'won' : 'lost',
        difficultyLevel: difficulty_level,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      sendGameScores,
      scoreId,
      points,
      timeToDisplay,
      initialHints,
      numberOfHints,
      word_length,
      heartsToHide,
      gameFinished,
      saveGameResult,
      currentRound,
      navigate,
      feedbackGameNavigationConfig,
    ]
  );

  const endGame = useCallback(
    (result: GameResult) => {
      stopTimer();
      setGameFinished(result);
      const updatedGameRounds = [...gameRounds];
      updatedGameRounds[currentRound] = { id: currentRound, status: result };
      setGameRounds(updatedGameRounds);

      let totalPoints = 0;
      const lastRoundIndex = totalRounds - 1;
      const bonusPointsForCompleteGame = currentRound === lastRoundIndex ? 50 : 0;

      if (result === GameResult.WON) {
        const pointsForWord = 50;
        const pointsForRemainingHints = currentRound === lastRoundIndex ? numberOfHints * 25 : 0;
        totalPoints =
          (currentRound + 1) * pointsForWord + bonusPointsForCompleteGame + pointsForRemainingHints;
        setPoints(currentScore);
        setCurrentScore(totalPoints);
        resetWrongGuesses();
      }

      if (result === GameResult.LOST || currentRound === lastRoundIndex) {
        sendGameResult(currentScore + bonusPointsForCompleteGame);
        setGameDisplayState(GameDisplayState.DIFF);
      } else {
        setShowModal(true);
      }
      setGameResult(result);
      setPoints(currentScore);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      navigate,
      currentRound,
      totalRounds,
      numberOfHints,
      setGameFinished,
      setCurrentRound,
      setGameRounds,
      gameRounds,
      stopTimer,
      feedbackGameNavigationConfig,
      setGameResult,
      setShowModal,
      setPoints,
      sendGameResult,
      resetGame,
    ]
  );

  useEffect(
    () => {
      if (!heartsToHide && gameFinished) {
        endGame(GameResult.LOST);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [heartsToHide, gameFinished]
  );

  const nextRound = useCallback(
    () => {
      const newRound = currentRound + 1;

      if (newRound < totalRounds) {
        setCurrentRound(newRound);
        const selectedWord = selectWordByLengthAndLanguage(currentLanguage, word_length);

        if (selectedWord.length) {
          // setWordToGuess(selectedWord);
          setGuessLetters([]);
        }
      } else {
        endGame(GameResult.WON);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      currentRound,
      totalRounds,
      setCurrentRound,
      selectWordByLengthAndLanguage,
      word_length,
      endGame,
    ]
  );

  useEffect(
    () => {
      if (
        gameDisplayState === GameDisplayState.PLAYING &&
        gameFinished &&
        currentRound < totalRounds - 1
      ) {
        nextRound();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameFinished, currentRound, totalRounds, gameDisplayState]
  );
  const addGuessLetter = useCallback(
    (letter: string) => {
      if (guessLetters.includes(letter)) return;

      const newGuessLetters = [...guessLetters, letter];
      setGuessLetters(newGuessLetters);

      if (!wordToGuess.includes(letter)) {
        if (!wrongGuesses.has(letter)) {
          decrementHearts();
          addWrongGuess(letter);

          if (heartsToHide - 1 <= 0) {
            endGame(GameResult.LOST);

            return;
          }
        }
      }

      const isWordGuessed = wordToGuess.split('').every(letter => newGuessLetters.includes(letter));
      if (isWordGuessed) {
        endGame(GameResult.WON);
      }
    },
    [
      guessLetters,
      wordToGuess,
      decrementHearts,
      addWrongGuess,
      wrongGuesses,
      heartsToHide,
      setGuessLetters,
      endGame,
    ]
  );

  const sendScores = (isCanceled?: boolean) => {
    sendGameResult(currentScore, isCanceled);
  };

  const handleConfirmEndGame = () => {
    stopTimer();
    sendScores();
    setShowModal(false);
  };

  const handleDiffSubmit = () => {
    resetGame();
    navigate(feedbackGameNavigationConfig);
  };

  useEffect(() => {
    setHeartsToHide(number_of_hearts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty_level]);

  useEffect(() => {
    if (timer % POLLING_INTERVAL || !timer) {
      return;
    }

    const gameScores: AddGameScoreDto = {
      game_level: difficulty_level as AddGameScoreDtoGameLevel,
      word_guess: {
        number_of_words_to_guess: currentRound + 1,
        number_of_hints: numberOfHints,
        word_length: word_length,
        number_of_hearts: heartsToHide,
      },
      game_name: AddGameScoreDtoGameName.word_guess,
      completed: false,
      completion_time: timer,
    };
    sendGameScores({ scoreId, data: gameScores });
  }, [
    timer,
    difficulty_level,
    currentRound,
    numberOfHints,
    word_length,
    heartsToHide,
    scoreId,
    sendGameScores,
  ]);

  const renderGame = () => (
    <>
      <SummaryContainer
        points={currentScore}
        time={timeToDisplay}
        hints={numberOfHints}
        hearts={heartsToHide}
        handleOnHintsClick={handleUseHint}
        gameRounds={gameRounds}
      />
      {!isLoading ? (
        <div className={styles.container}>
          <div
            className={
              gameDisplayState === GameDisplayState.PLAYING
                ? styles.displayContainer
                : styles.diffContainer
            }
          >
            <WordGuessDisplay
              showResult={isModalVisible || gameDisplayState === GameDisplayState.DIFF}
              guessLetters={Array.isArray(guessLetters) ? guessLetters : []}
              wordToGuess={wordToGuess}
            />
          </div>
          {gameDisplayState === GameDisplayState.PLAYING ? (
            <div className={styles.keyboardContainer}>
              <Keyboard
                disabled={isModalVisible || heartsToHide === 0}
                currentLanguage={currentLanguage}
                activeLetter={(Array.isArray(guessLetters) ? guessLetters : []).filter(letter =>
                  wordToGuess.includes(letter)
                )}
                inactiveLetter={(Array.isArray(guessLetters) ? guessLetters : []).filter(
                  letter => !wordToGuess.includes(letter)
                )}
                addGuessLetter={addGuessLetter}
              />
            </div>
          ) : (
            <Button size="large" type="primary" onClick={handleDiffSubmit}>
              {t('senior_games_end_game_cell')}
            </Button>
          )}
        </div>
      ) : (
        <div className={styles.spinContainer}>
          <Spin />
        </div>
      )}
    </>
  );

  const handlePlayButtonClick = () => {
    setShowTutorial(false);
    resetTimer();
    startTimer();
  };

  const finishedGameType =
    gameFinished === GameResult.WON ? 'won' : gameFinished === GameResult.LOST ? 'lost' : 'draw';

  const renderWordGuessGame = () => (
    <>
      {showTutorial ? (
        <TutorialScreen
          tutorialGif={wordGuessGif}
          title={t('senior_games_wordguess_tutorial_title')}
          description={t('senior_games_wordguess_tutorial_text')}
          onPlayButtonClick={handlePlayButtonClick}
        />
      ) : (
        renderGame()
      )}
      {showTutorialModal && renderGameTutorialModal()}
      <GameControlModal
        type={finishedGameType}
        open={showModal}
        onFirstButtonClick={handleBackToGame}
        onSecondButtonClick={handleConfirmEndGame}
      />
    </>
  );

  return {
    showTutorial,
    renderWordGuessGame,
    handleTutorialIconClick,
    sendScores,
    currentScore,
    difficultyLevel: difficulty_level,
  };
};
