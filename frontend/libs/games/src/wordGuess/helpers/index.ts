import { deKEYS, enKEYS, hrKEYS, huKEYS, itKEYS, plKEYS, siKEYS } from '../constants';
import { wordList } from '../constants/wordLists';

export const selectProperKeyboard = (language: string) => {
  switch (language) {
    case 'DE':
      return deKEYS;
    case 'HR':
      return hrKEYS;
    case 'HU':
      return huKEYS;
    case 'IT':
      return itKEYS;
    case 'PL':
      return plKEYS;
    case 'SI':
      return siKEYS;
    case 'EN':
      return enKEYS;
    default:
      return enKEYS;
  }
};

const getWordsForLanguage = (language: string) => wordList[language as keyof typeof wordList] || [];

export const selectWordByLengthAndLanguage = (language: string, wordLength: number) => {
  const words = getWordsForLanguage(language);

  const filteredWords = words.filter(word => word.trim().length === wordLength);
  const randomIndex = Math.floor(Math.random() * filteredWords.length);

  return filteredWords[randomIndex];
};
