import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { GameDisplayState, type GameResult, type Round } from '../../typings';

enableMapSet();

const STORAGE_KEY = 'wordGuessHints';
const DEFAULT_HINTS = 10;

const getInitialHints = () => {
  if (typeof window === 'undefined') return DEFAULT_HINTS;

  const storedHints = localStorage.getItem(STORAGE_KEY);

  return storedHints ? parseInt(storedHints, 10) : DEFAULT_HINTS;
};

type WordGuessState = {
  wordToGuess: string;
  guessLetters: string[];
  isModalVisible: boolean;
  currentScore: number;
  heartsToHide: number;
  wrongGuesses: Set<string>;
  gameResult: GameResult | null;
  showTutorial: boolean;
  showModal: boolean;
  showTutorialModal: boolean;
  numberOfHints: number;
  totalRounds: number;
  currentRound: number;
  gameRounds: Round[];
  points: number;
  gameFinished: GameResult | null;
  correctLetters: string[];
  incorrectLetters: string[];
  gameDisplayState: GameDisplayState;
  setGuessLetters: (letters: string[]) => void;
  updateScore: (score: number) => void;
  setShowTutorial: (showTutorial: boolean) => void;
  setShowModal: (showModal: boolean) => void;
  setShowTutorialModal: (showTutorialModal: boolean) => void;
  setWordToGuess: (word: string) => void;
  setHeartsToHide: (hearts: number) => void;
  decrementHearts: () => void;
  addWrongGuess: (letter: string) => void;
  resetWrongGuesses: () => void;
  requestHint: () => void;
  setNumberOfHints: (hints: number) => void;
  setGameResult: (gameResult: GameResult | null) => void;
  setCurrentRound: (round: number) => void;
  setGameRounds: (rounds: Round[]) => void;
  nextRound: () => void;
  setTotalRounds: (rounds: number) => void;
  incrementRound: () => void;
  setPoints: (points: number) => void;
  setGameFinished: (finished: GameResult | null) => void;
  setCurrentScore: (score: number) => void;
  resetGame: () => void;
  setGameDisplayState: (gameDisplayState: GameDisplayState) => void;
};

const INITIAL_STATE = {
  wordToGuess: '',
  guessLetters: [],
  isModalVisible: false,
  currentScore: 0,
  heartsToHide: 10,
  wrongGuesses: new Set<string>(),
  gameResult: null,
  showTutorial: false,
  showModal: false,
  showTutorialModal: false,
  numberOfHints: 10,
  totalRounds: 0,
  currentRound: 0,
  gameRounds: [],
  points: 0,
  gameFinished: null,
  correctLetters: [],
  incorrectLetters: [],
  gameDisplayState: GameDisplayState.PLAYING,
};

export const useWordGuessStore = create<WordGuessState>()(
  persist(
    immer(set => ({
      ...INITIAL_STATE,

      setGameFinished: (finished: GameResult | null) =>
        set(state => {
          state.gameFinished = finished;
          if (finished) {
            localStorage.removeItem(STORAGE_KEY);
          }
        }),

      incrementRound: () =>
        set(state => {
          if (state.currentRound < state.totalRounds - 1) {
            state.currentRound += 1;
          }
        }),

      setTotalRounds: (rounds: number) =>
        set(state => {
          state.totalRounds = rounds;
          state.gameRounds = Array.from({ length: rounds }, (_, index) => ({
            id: index + 1,
            status: null,
          }));
        }),

      setCurrentRound: (newRound: number) =>
        set(state => {
          state.currentRound = newRound;
        }),

      setGameRounds: (rounds: Round[]) =>
        set(state => {
          state.gameRounds = rounds.map((round, index) => ({ ...round, id: index + 1 }));
        }),

      setGuessLetters: (letters: string[]) =>
        set(state => {
          state.guessLetters = letters;
        }),

      resetGame: () =>
        set(state => {
          state.isModalVisible = false;
          state.heartsToHide = 0;
          state.wordToGuess = '';
          state.guessLetters = [];
          state.correctLetters = [];
          state.incorrectLetters = [];
          state.wrongGuesses.clear();
          state.gameResult = null;
          state.currentRound = 0;
          state.totalRounds = 0;
          state.gameRounds = [];
          state.points = 0;
          state.currentScore = 0;
          state.numberOfHints = DEFAULT_HINTS;
          state.gameFinished = null;
          state.gameDisplayState = GameDisplayState.PLAYING;
          localStorage.removeItem(STORAGE_KEY);
        }),

      updateScore: (score: number) =>
        set(state => {
          state.currentScore = score;
        }),

      setShowTutorial: (showTutorial: boolean) =>
        set(state => {
          state.showTutorial = showTutorial;
        }),

      setShowModal: (showModal: boolean) =>
        set(state => {
          state.showModal = showModal;
        }),

      setShowTutorialModal: (showTutorialModal: boolean) =>
        set(state => {
          state.showTutorialModal = showTutorialModal;
        }),

      setWordToGuess: (word: string) =>
        set(state => {
          state.wordToGuess = word;
        }),

      setHeartsToHide: (hearts: number) =>
        set(state => {
          state.heartsToHide = hearts;
        }),

      decrementHearts: () =>
        set(state => {
          if (state.heartsToHide > 0) {
            state.heartsToHide -= 1;
          }
        }),

      addWrongGuess: (letter: string) =>
        set(state => {
          state.wrongGuesses.add(letter);
        }),

      resetWrongGuesses: () =>
        set(state => {
          state.wrongGuesses.clear();
        }),

      requestHint: () =>
        set(state => {
          if (state.numberOfHints > 0 && state.gameResult === null) {
            state.numberOfHints -= 1;
          }
        }),

      setNumberOfHints: (hints: number) =>
        set(state => {
          state.numberOfHints = Math.max(0, hints);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(hints));
        }),

      setGameResult: (gameResult: GameResult | null) =>
        set(state => {
          state.gameResult = gameResult;
        }),

      nextRound: () =>
        set(state => {
          if (state.currentRound < state.totalRounds - 1) {
            state.currentRound += 1;
          }
        }),

      setPoints: (points: number) =>
        set(state => {
          state.points += points;
        }),

      setCurrentScore: (score: number) =>
        set(state => {
          state.currentScore = score;
        }),

      setGameDisplayState: (gameDisplayState: GameDisplayState) =>
        set(state => {
          state.gameDisplayState = gameDisplayState;
        }),
    })),
    {
      name: STORAGE_KEY,
      partialize: state => ({ numberOfHints: state.numberOfHints }),
      onRehydrateStorage: () => state => {
        if (!state) return;
        // Ensure numberOfHints is a number and has a valid value
        state.numberOfHints = getInitialHints();
      },
    }
  )
);
