import { AddGameScoreDtoGameName } from '@Procareful/common/api';
import { ProcarefulAppPathRoutes, SearchParams } from '@Procareful/common/lib';

export const keyboardLayouts: Record<string, string[][]> = {
  pl: [
    ['A', 'Ą', 'B', 'C', 'Ć', 'D', 'E', 'Ę', 'F'],
    ['G', 'H', 'I', 'J', 'K', 'L', 'Ł', 'M', 'N'],
    ['Ń', 'O', 'Ó', 'P', 'R', 'S', 'Ś', 'T', 'U'],
    ['Enter', 'W', 'X', 'Y', 'Z', 'Ż', 'Ź', 'Backspace'],
  ],
  en: [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
    ['O', 'P', 'Q', 'R', 'S', 'T', 'U'],
    ['Enter', 'V', 'W', 'X', 'Y', 'Z', 'Backspace'],
  ],
  it: [
    ['A', 'À', 'Á', 'B', 'C', 'D', 'E', 'È', 'É'],
    ['F', 'G', 'H', 'I', 'Ì', 'J', 'K', 'L', 'M'],
    ['N', 'O', 'Ò', 'P', 'Q', 'R', 'S', 'T', 'U'],
    ['Enter', 'Ù', 'V', 'W', 'X', 'Y', 'Z', 'Backspace'],
  ],
  de: [
    ['A', 'Ä', 'B', 'C', 'D', 'E', 'F', 'G'],
    ['H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'],
    ['Ö', 'P', 'Q', 'R', 'S', 'ẞ', 'T', 'U'],
    ['Enter', 'Ü', 'V', 'W', 'X', 'Y', 'Z', 'Backspace'],
  ],
  si: [
    ['A', 'B', 'C', 'Č', 'D', 'E', 'F'],
    ['G', 'H', 'I', 'J', 'K', 'L', 'M'],
    ['N', 'O', 'P', 'R', 'S', 'Š', 'T'],
    ['Enter', 'U', 'V', 'Z', 'Ž', 'Backspace'],
  ],
  hr: [
    ['A', 'B', 'C', 'Č', 'Ć', 'D', 'DŽ'],
    ['Đ', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    ['L', 'M', 'N', 'O', 'P', 'R', 'S'],
    ['Enter', 'Š', 'T', 'U', 'V', 'Z', 'Ž', 'Backspace'],
  ],
  // TODO: add if it will be provided
  hu: [
    ['A', 'Á', 'B', 'C', 'CS', 'D', 'DZ', 'DZS', 'E'],
    ['É', 'F', 'G', 'GY', 'H', 'I', 'Í', 'J', 'K'],
    ['L', 'LY', 'M', 'NY', 'O', 'Ó', 'Ö', 'Ő', 'P'],
    ['Q', 'R', 'S', 'SZ', 'T', 'TY', 'U', 'Ú', 'Ü'],
    ['Enter', 'Ű', 'V', 'W', 'X', 'Y', 'Z', 'ZS', 'Backspace'],
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

export const POLLING_INTERVAL = 15; // in seconds
