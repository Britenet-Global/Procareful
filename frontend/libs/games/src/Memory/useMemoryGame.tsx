import MemoryGif from '@ProcarefulGamesAssets/memoryGif.gif';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spin } from 'antd';
import {
  type AddGameScoreDto,
  type AddGameScoreDtoGameLevel,
  AddGameScoreDtoGameName,
  type GetGameDifficultyLevelsResponseDtoDetailsItem,
  type Memory as MemoryGameType,
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
import Tile from './components/Tile';
import { POLLING_INTERVAL } from './constants';
import { useMemoryStore } from './store/memoryStore';
import { useStyles } from './styles';
import type { CardData } from './typings';

const EXTRA_WIN_POINTS = 25;

const useMemoryGame = () => {
  const { t } = useTypedTranslation();
  const { cx, styles } = useStyles();
  const {
    points,
    setPoints,
    cards,
    openCards,
    setOpenCards,
    clearedCards,
    setClearedCards,
    shouldDisableAllCards,
    setShouldDisableAllCards,
    moves,
    setMoves,
    hintsLeft,
    setHintsLeft,
    setUpGame,
    showTutorial,
    setShowTutorial,
    showTutorialModal,
    setShowTutorialModal,
    gameDisplayState,
    setGameDisplayState,
    result,
    setResult,
  } = useMemoryStore(state => ({
    points: state.points,
    setPoints: state.setPoints,
    cards: state.cards,
    setCards: state.setCards,
    openCards: state.openCards,
    setOpenCards: state.setOpenCards,
    clearedCards: state.clearedCards,
    setClearedCards: state.setClearedCards,
    shouldDisableAllCards: state.shouldDisableAllCards,
    setShouldDisableAllCards: state.setShouldDisableAllCards,
    moves: state.moves,
    setMoves: state.setMoves,
    hintsLeft: state.hintsLeft,
    setHintsLeft: state.setHintsLeft,
    setUpGame: state.setUpGame,
    showTutorial: state.showTutorial,
    setShowTutorial: state.setShowTutorial,
    showTutorialModal: state.showTutorialModal,
    setShowTutorialModal: state.setShowTutorialModal,
    gameDisplayState: state.gameDisplayState,
    setGameDisplayState: state.setGameDisplayState,
    result: state.result,
    setResult: state.setResult,
  }));

  const timeout = useRef<NodeJS.Timeout | null>(null);
  const { timer, timeToDisplay, stopTimer, resetTimer } = useTimer();
  const navigate = useNavigate();

  const feedbackGameNavigationConfig = useMemo(
    () => ({
      pathname: ProcarefulAppPathRoutes.GameFeedback,
      search: new URLSearchParams({
        [SearchParams.Name]: AddGameScoreDtoGameName.memory.toString(),
      }).toString(),
    }),
    []
  );

  const {
    data: gameData,
    isLoading,
    refetch,
  } = useUserControllerGetGameLevelAndRules(AddGameScoreDtoGameName.memory, {
    query: {
      refetchOnWindowFocus: false,
    },
  });

  const { level: difficulty_level, rules, scoreId = 0 } = gameData?.details || {};

  const { expected_number_of_tries, number_of_cards_to_pair, number_of_hints, complexity_level } =
    (rules as MemoryGameType) || {};

  const { mutate: sendGameScores } = useUserControllerAddGameScore();
  const { mutate: sendPoints } = useUserControllerUpdateBrainPoints();

  const handleEnable = useCallback(() => {
    setShouldDisableAllCards(false);
  }, [setShouldDisableAllCards]);

  const handleRestart = useCallback(() => {
    refetch();
    if (difficulty_level) {
      setUpGame(difficulty_level, complexity_level, number_of_hints);
      resetTimer();
    }
  }, [complexity_level, difficulty_level, number_of_hints, refetch, resetTimer, setUpGame]);

  const checkCompletion = useCallback(() => {
    if (
      Object.keys(clearedCards).length > 0 &&
      Object.keys(clearedCards).length === cards.length / 2
    ) {
      stopTimer();
      setClearedCards({});

      const gameScores: AddGameScoreDto = {
        memory: {
          number_of_tries: moves,
          number_of_hints_used: number_of_hints - hintsLeft,
        },
        game_name: AddGameScoreDtoGameName.memory,
        game_level: difficulty_level as AddGameScoreDtoGameLevel,
        completion_time: timer,
        completed: true,
      };
      sendGameScores({ scoreId, data: gameScores });

      saveGameResult({
        name: AddGameScoreDtoGameName.memory,
        points: points + EXTRA_WIN_POINTS,
        time: timeToDisplay,
        status: 'won',
        difficultyLevel: difficulty_level as number,
      });
      sendPoints({ data: { points: points + EXTRA_WIN_POINTS } });

      setGameDisplayState(GameDisplayState.DIFF);
    }
  }, [
    cards.length,
    clearedCards,
    difficulty_level,
    hintsLeft,
    moves,
    number_of_hints,
    scoreId,
    sendGameScores,
    setClearedCards,
    stopTimer,
    timer,
    timeToDisplay,
    points,
    sendPoints,
    setGameDisplayState,
  ]);

  const checkGameLost = useCallback(() => {
    if (!showTutorial && moves === expected_number_of_tries) {
      stopTimer();

      const gameScores: AddGameScoreDto = {
        memory: {
          number_of_tries: moves,
          number_of_hints_used: number_of_hints - hintsLeft,
        },
        game_name: AddGameScoreDtoGameName.memory,
        game_level: difficulty_level as AddGameScoreDtoGameLevel,
        completion_time: timer,
        completed: false,
      };
      sendGameScores({ scoreId, data: gameScores });

      saveGameResult({
        name: AddGameScoreDtoGameName.memory,
        points,
        time: timeToDisplay,
        status: 'lost',
        difficultyLevel: difficulty_level as number,
      });
      sendPoints({ data: { points } });

      setGameDisplayState(GameDisplayState.DIFF);
    }
  }, [
    stopTimer,
    difficulty_level,
    expected_number_of_tries,
    hintsLeft,
    moves,
    number_of_hints,
    scoreId,
    sendGameScores,
    showTutorial,
    timer,
    timeToDisplay,
    points,
    sendPoints,
    setGameDisplayState,
  ]);

  const evaluate = useCallback(() => {
    const [first, second] = openCards;
    handleEnable();

    if (cards[first].type !== cards[second].type || cards[first].color !== cards[second].color) {
      timeout.current = setTimeout(() => {
        setOpenCards([]);
      }, 3000);

      return;
    }
    const cardKey = `${cards[first].type}_${cards[first].color}`;

    const newValues = {
      ...clearedCards,
      [cardKey]: true,
    };
    setResult(newValues);
    setClearedCards(newValues);
    setOpenCards([]);
    setPoints(points + 50);
  }, [
    setResult,
    openCards,
    handleEnable,
    cards,
    setClearedCards,
    clearedCards,
    setOpenCards,
    setPoints,
    points,
  ]);

  const handleCardClick = (index: number) => {
    if (openCards.length !== 1) {
      if (timeout.current !== null) {
        clearTimeout(timeout.current);
      }
      setOpenCards([index]);

      return;
    }

    setOpenCards([...openCards, index]);
    setMoves(moves + 1);
    setShouldDisableAllCards(true);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 300);
    }

    return () => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
    };
  }, [evaluate, openCards]);

  useEffect(() => {
    if (gameDisplayState === GameDisplayState.DIFF) return;
    checkCompletion();
  }, [checkCompletion, gameDisplayState]);

  useEffect(() => {
    if (gameDisplayState === GameDisplayState.DIFF) return;
    checkGameLost();
  }, [checkGameLost, gameDisplayState]);

  useEffect(() => {
    if (timer % POLLING_INTERVAL || !timer) {
      return;
    }

    const gameScores: AddGameScoreDto = {
      memory: {
        number_of_tries: moves,
        number_of_hints_used: number_of_hints - hintsLeft,
      },
      game_name: AddGameScoreDtoGameName.memory,
      game_level: difficulty_level as AddGameScoreDtoGameLevel,
      completion_time: timer,
      completed: false,
    };
    sendGameScores({ scoreId, data: gameScores });
  }, [timer, moves, number_of_hints, hintsLeft, difficulty_level, sendGameScores, scoreId]);

  const checkIsFlipped = (index: number) => openCards.includes(index);

  const checkIsInactive = (card: CardData) => !!clearedCards[`${card.type}_${card.color}`];

  const handleHintClick = () => {
    if (hintsLeft > 0) {
      const indexes: number[] = [];
      cards.forEach(({ type, color }: CardData, index: number) => {
        if (
          !openCards.includes(index) &&
          !clearedCards[`${type}_${color}`] &&
          cards.filter(card => `${card.type}_${card.color}` === `${type}_${color}`).length >= 2
        ) {
          indexes.push(index);
        }
      });

      if (indexes.length > 0) {
        const pairIndex = indexes.find(index => !openCards.includes(index));
        if (pairIndex !== undefined) {
          const secondIndex: number = cards.findIndex(
            ({ type, color }: CardData, index: number) =>
              index !== pairIndex &&
              `${type}_${color}` === `${cards[pairIndex].type}_${cards[pairIndex].color}` &&
              !openCards.includes(index)
          );
          setOpenCards([pairIndex, secondIndex]);
          setHintsLeft(hintsLeft - 1);
          setMoves(moves + 1);
        }
      }
    }
  };

  const handleGameTutorialModalClose = () => {
    setShowTutorialModal(!showTutorialModal);
  };

  const handleDiffSubmit = () => {
    handleRestart();
    navigate(feedbackGameNavigationConfig);
  };

  useEffect(() => {
    if (!isLoading && difficulty_level && gameDisplayState === GameDisplayState.PLAYING) {
      setUpGame(complexity_level, number_of_hints, number_of_cards_to_pair);
    }
  }, [
    complexity_level,
    difficulty_level,
    gameDisplayState,
    isLoading,
    number_of_cards_to_pair,
    number_of_hints,
    setUpGame,
  ]);
  useEffect(() => {
    setShowTutorial(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderGame = () => (
    <>
      <SummaryContainer
        points={points}
        time={timeToDisplay}
        hints={hintsLeft}
        handleOnHintsClick={handleHintClick}
      />
      {difficulty_level && (
        <div
          className={cx(
            styles.container,
            styles[difficulty_level as GetGameDifficultyLevelsResponseDtoDetailsItem]
          )}
        >
          {!isLoading ? (
            <>
              {cards.map((card, index) => (
                <Tile
                  key={index}
                  card={card}
                  index={index}
                  result={result}
                  difficultyLevel={difficulty_level}
                  gameDisplayState={gameDisplayState}
                  isDisabled={shouldDisableAllCards}
                  isInactive={checkIsInactive(card)}
                  isFlipped={checkIsFlipped(index) || gameDisplayState === GameDisplayState.DIFF}
                  onClick={handleCardClick}
                />
              ))}
              {gameDisplayState === GameDisplayState.DIFF && (
                <Button
                  size="large"
                  type="primary"
                  className={styles.diffButton}
                  onClick={handleDiffSubmit}
                >
                  {t('senior_games_end_game_cell')}
                </Button>
              )}
            </>
          ) : (
            <div className={styles.spinContainer}>
              <Spin />
            </div>
          )}
        </div>
      )}
    </>
  );

  const renderGameTutorialModal = () => (
    <GameTutorialModal
      open={showTutorialModal}
      tutorialGif={MemoryGif}
      description={t('senior_games_memory_tutorial_text')}
      onCloseButtonClick={handleGameTutorialModalClose}
    />
  );

  const handleTutorialIconClick = () => {
    setShowTutorialModal(!showTutorialModal);
  };

  const renderMemoryGame = () => (
    <>
      {showTutorial ? (
        <TutorialScreen
          onPlayButtonClick={() => setShowTutorial(!showTutorial)}
          tutorialGif={MemoryGif}
          title={t('senior_games_memory_tutorial_title')}
          description={t('senior_games_memory_tutorial_text')}
        />
      ) : (
        renderGame()
      )}
      {showTutorialModal && renderGameTutorialModal()}
    </>
  );

  return {
    showTutorial,
    points,
    handleTutorialIconClick,
    renderMemoryGame,
    difficultyLevel: difficulty_level,
  };
};

export default useMemoryGame;
