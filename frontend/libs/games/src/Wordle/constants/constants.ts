import { AddGameScoreDtoGameName } from '@Procareful/common/api';
import { ProcarefulAppPathRoutes, SearchParams } from '@Procareful/common/lib';

export const keyboardLayouts: Record<string, string[][]> = {
  pl: [
    ['A', 'Ą', 'B', 'C', 'Ć', 'D', 'E', 'Ę', 'F'],
    ['G', 'H', 'I', 'J', 'K', 'L', 'Ł', 'M', 'N'],
    ['Ń', 'O', 'Ó', 'P', 'Q', 'R', 'S', 'Ś', 'T'],
    ['Enter', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Ż', 'Ź', 'Backspace'],
  ],
  en: [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
    ['O', 'P', 'Q', 'R', 'S', 'T', 'U'],
    ['Enter', 'V', 'W', 'X', 'Y', 'Z', 'Backspace'],
  ],
  it: [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
    ['O', 'P', 'Q', 'R', 'S', 'T', 'U'],
    ['Enter', 'V', 'W', 'X', 'Y', 'Z', 'Backspace'],
  ],
  de: [
    ['A', 'Ä', 'B', 'C', 'D', 'E', 'F', 'G'],
    ['H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'],
    ['Ö', 'P', 'Q', 'R', 'S', 'ẞ', 'T', 'U'],
    ['Enter', 'Ü', 'V', 'W', 'X', 'Y', 'Z', 'Backspace'],
  ],
  sl: [
    ['A', 'B', 'C', 'Č', 'D', 'E', 'F', 'G'],
    ['H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'],
    ['P', 'Q', 'R', 'S', 'Š', 'T', 'U', 'W'],
    ['Enter', 'X', 'Y', 'Z', 'Ž', 'Backspace'],
  ],
  hr: [
    ['A', 'B', 'C', 'Č', 'Ć', 'D', 'Dž', 'Đ'],
    ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    ['Lj', 'M', 'N', 'Nj', 'O', 'P', 'R', 'S'],
    ['Enter', 'Š', 'T', 'U', 'V', 'Z', 'Ž', 'Backspace'],
  ],
  hu: [
    ['A', 'á', 'B', 'C', 'Cs', 'D', 'Dz', 'Dzs', 'E'],
    ['É', 'F', 'G', 'Gy', 'H', 'I', 'Í', 'J', 'K'],
    ['L', 'Ly', 'M', 'N', 'Ny', 'O', 'Ó', 'Ö', 'Ő'],
    ['P', 'R', 'S', 'Sz', 'T', 'Ty', 'U', 'Ú', 'Ü'],
    ['Enter', 'Ű', 'V', 'Y', 'Z', 'Zs', 'Backspace'],
  ],
};

export enum KeyActions {
  Backspace = 'Backspace',
  Enter = 'Enter',
}

export const LetterStatus = {
  Correct: 'correct',
  Present: 'present',
  Absent: 'absent',
} as const;

export const feedbackGameNavigationConfig = {
  pathname: ProcarefulAppPathRoutes.GameFeedback,
  search: new URLSearchParams({
    [SearchParams.Name]: AddGameScoreDtoGameName.wordle,
  }).toString(),
};

export const pointsToAddConfig: Record<number, number> = {
  0: 350,
  1: 300,
  2: 250,
  3: 200,
  4: 150,
  5: 100,
  6: 50,
};
