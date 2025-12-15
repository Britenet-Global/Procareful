import { create } from 'zustand';
import { GameDisplayState } from '@Procareful/games';
import { uniqueCardsArray } from '../constants';
import { generateGameArray } from '../helpers';
import type { CardData } from '../typings';

type ClearedCards = {
  [key: string]: boolean;
};

type MemoryStore = {
  points: number;
  setPoints: (points: number) => void;
  showTutorial: boolean;
  setShowTutorial: (showTutorial: boolean) => void;
  showTutorialModal: boolean;
  setShowTutorialModal: (showTutorialModal: boolean) => void;
  cards: CardData[];
  setCards: (cards: CardData[]) => void;
  openCards: number[];
  setOpenCards: (openCards: number[]) => void;
  clearedCards: ClearedCards;
  setClearedCards: (clearedCards: ClearedCards) => void;
  shouldDisableAllCards: boolean;
  setShouldDisableAllCards: (shouldDisableAllCards: boolean) => void;
  moves: number;
  setMoves: (moves: number) => void;
  hintsLeft: number;
  setHintsLeft: (hintsLeft: number) => void;
  setUpGame: (complexityLevel: number, hintLeft: number, numberOfCardsToPair: number) => void;
  gameDisplayState: GameDisplayState;
  setGameDisplayState: (gameDisplayState: GameDisplayState) => void;
  result: ClearedCards;
  setResult: (result: ClearedCards) => void;
};

const initialState = {
  points: 0,
  cards: [],
  openCards: [],
  clearedCards: {},
  result: {},
  shouldDisableAllCards: false,
  moves: 0,
  hintsLeft: 0,
  showTutorial: true,
  showTutorialModal: false,
  gameDisplayState: GameDisplayState.PLAYING,
};

export const useMemoryStore = create<MemoryStore>(set => ({
  ...initialState,
  setPoints: points => set({ points }),
  setCards: cards => set({ cards }),
  setOpenCards: openCards => set({ openCards }),
  setClearedCards: clearedCards => set({ clearedCards }),
  setResult: result => set({ result }),
  setShouldDisableAllCards: shouldDisableAllCards => set({ shouldDisableAllCards }),
  setMoves: moves => set({ moves }),
  setHintsLeft: hintsLeft => set({ hintsLeft }),
  setShowTutorial: showTutorial => set({ showTutorial }),
  setShowTutorialModal: showTutorialModal => set({ showTutorialModal }),
  setGameDisplayState: gameDisplayState => set({ gameDisplayState }),
  setUpGame: (complexityLevel, hintsLeft, numberOfCardsToPair) => {
    set({
      points: 0,
      clearedCards: {},
      result: {},
      openCards: [],
      moves: 0,
      shouldDisableAllCards: false,
      hintsLeft,
      gameDisplayState: GameDisplayState.PLAYING,
      cards: generateGameArray(
        uniqueCardsArray.concat(uniqueCardsArray),
        complexityLevel,
        numberOfCardsToPair
      ),
    });
  },
}));
