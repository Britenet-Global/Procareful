import { create } from 'zustand';

type SnakeStore = {
  hearts: number;
  setHearts: (hearts: number) => void;
  points: number;
  setPoints: (points: number) => void;
  endGame: boolean;
  setEndGame: (endGame: boolean) => void;
  eatenBlock: number;
  setEatenBlock: (eatenBlock: number) => void;
  showTutorial: boolean;
  setShowTutorial: (showTutorial: boolean) => void;
  eatenCombo: number;
  setEatenCombo: (eatenCombo: number) => void;
  showTutorialModal: boolean;
  setShowTutorialModal: (showTutorialModal: boolean) => void;
};

const initialState = {
  points: 0,
  hearts: 6,
  endGame: false,
  eatenBlock: 0,
  showTutorial: true,
  eatenCombo: 0,
  showTutorialModal: false,
};

export const useSnakeStore = create<SnakeStore>(set => ({
  ...initialState,
  setPoints: points => set({ points }),
  setHearts: hearts => set({ hearts }),
  setEndGame: endGame => set({ endGame }),
  setEatenBlock: eatenBlock => set({ eatenBlock }),
  setShowTutorial: showTutorial => set({ showTutorial }),
  setEatenCombo: eatenCombo => set({ eatenCombo }),
  setShowTutorialModal: showTutorialModal => set({ showTutorialModal }),
}));
