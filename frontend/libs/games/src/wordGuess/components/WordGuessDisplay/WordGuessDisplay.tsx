import { Typography } from 'antd';
import { useStyles } from './styles';

const { Text } = Typography;

type WordGuessDisplayProps = {
  guessLetters: string[];
  wordToGuess: string | null;
  showResult?: boolean;
};

type LetterStyle = {
  visibility: 'visible' | 'hidden';
  color: string;
};

const WordGuessDisplay = ({
  guessLetters,
  wordToGuess = '',
  showResult = false,
}: WordGuessDisplayProps) => {
  const { styles } = useStyles();
  const getLetterStyle = (
    letter: string,
    guessLetters: string[],
    showResult: boolean
  ): LetterStyle => {
    const isVisible = guessLetters.includes(letter) || showResult;
    const isGameFailed = !guessLetters.includes(letter) && showResult;

    return {
      visibility: isVisible ? 'visible' : 'hidden',
      color: isGameFailed ? '#BE123C' : '#1C1917',
    };
  };

  return (
    <div className={styles.container}>
      {wordToGuess?.split('').map((letter, index) => (
        <span className={styles.letter} key={index}>
          <Text style={getLetterStyle(letter, guessLetters, showResult)}>{letter}</Text>
        </span>
      ))}
    </div>
  );
};

export default WordGuessDisplay;
