import { create } from 'zustand';
import { GameDisplayState } from '@Procareful/games';

type WordleStore = {
  targetWord: string;
  letters: string[];
  board: string[][];
  colors: string[][];
  currentRow: number;
  showHintLetter: boolean;
  hintLetter: string;
  hintLetterIndex: number[];
  hintsRemaining: number;
  numberOfAttempts: number;
  gameFinished: boolean;
  hintsUsed: number;
  gameResult: string;
  points: number;
  showTutorial: boolean;
  showTutorialModal: boolean;
  showModal: boolean;
  gameDisplayState: GameDisplayState;
  setTargetWord: (word: string) => void;
  setLetters: (letters: string[]) => void;
  setBoard: (board: string[][]) => void;
  setColors: (colors: string[][]) => void;
  setCurrentRow: (row: number) => void;
  setShowHintLetter: (show: boolean) => void;
  setHintLetter: (letter: string) => void;
  setHintLetterIndex: (indices: number[]) => void;
  setHintsRemaining: (count: number) => void;
  setNumberOfAttempts: (count: number) => void;
  setGameFinished: (finished: boolean) => void;
  setHintsUsed: (count: number) => void;
  setGameResult: (result: string) => void;
  setPoints: (points: number) => void;
  setShowTutorial: (showTutorial: boolean) => void;
  setShowTutorialModal: (showTutorialModal: boolean) => void;
  setShowModal: (showModal: boolean) => void;
  setGameDisplayState: (gameDisplayState: GameDisplayState) => void;
};

const initialState = {
  targetWord: '',
  letters: Array(5).fill(''),
  board: Array.from({ length: 6 }, () => Array(5).fill('')),
  colors: Array.from({ length: 6 }, () => Array(5).fill('')),
  currentRow: 0,
  showHintLetter: false,
  hintLetter: '',
  hintLetterIndex: [] as number[],
  hintsRemaining: 0,
  numberOfAttempts: 0,
  gameFinished: false,
  hintsUsed: 0,
  gameResult: 'lost',
  points: 0,
  showTutorial: true,
  showTutorialModal: false,
  guessedWithoutHints: true,
  showModal: false,
  gameDisplayState: GameDisplayState.PLAYING,
};

export const useWordleStore = create<WordleStore>(set => ({
  ...initialState,
  setTargetWord: targetWord => set({ targetWord }),
  setLetters: letters => set({ letters }),
  setBoard: board => set({ board }),
  setColors: colors => set({ colors }),
  setCurrentRow: currentRow => set({ currentRow }),
  setShowHintLetter: showHintLetter => set({ showHintLetter }),
  setHintLetter: hintLetter => set({ hintLetter }),
  setHintLetterIndex: hintLetterIndex => set({ hintLetterIndex }),
  setHintsRemaining: hintsRemaining => set({ hintsRemaining }),
  setNumberOfAttempts: numberOfAttempts => set({ numberOfAttempts }),
  setGameFinished: gameFinished => set({ gameFinished }),
  setHintsUsed: hintsUsed => set({ hintsUsed }),
  setGameResult: gameResult => set({ gameResult }),
  setPoints: points => set({ points }),
  setShowTutorial: showTutorial => set({ showTutorial }),
  setShowTutorialModal: showTutorialModal => set({ showTutorialModal }),
  setShowModal: showModal => set({ showModal }),
  setGameDisplayState: gameDisplayState => set({ gameDisplayState }),
}));
