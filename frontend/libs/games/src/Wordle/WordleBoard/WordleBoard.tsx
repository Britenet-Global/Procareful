import { useStyles } from './styles';

type WordleBoardProps = {
  board: string[][];
  currentRow: number;
  currentRowLetters: string[];
  targetWord: string;
  showHintLetter: boolean;
  hintLetterIndex: number[];
};

const LETTERS_COUNT = 5;

const WordleBoard = ({
  board,
  currentRow,
  currentRowLetters,
  targetWord,
  showHintLetter,
  hintLetterIndex,
}: WordleBoardProps) => {
  const { styles, cx } = useStyles();
  const getLetter = (rowIndex: number, colIndex: number): string => {
    if (showHintLetter && rowIndex === 0 && hintLetterIndex.includes(colIndex)) {
      return targetWord[colIndex];
    }

    return (
      (rowIndex === currentRow ? currentRowLetters[colIndex] : board[rowIndex][colIndex]) || ''
    );
  };

  const getCellClass = (rowIndex: number, colIndex: number, letter: string): string => {
    if (rowIndex >= currentRow || !letter) {
      return styles.letterBox;
    }

    const currentRowWord = board[rowIndex].join('');
    const isCorrectPosition = letter === targetWord[colIndex];

    // Count occurrences of the letter in target word and guess
    const targetLetterCount = targetWord.split(letter).length - 1;

    // Find all positions of this letter in the guess that are correct
    const correctPositions = board[rowIndex].reduce((acc: number[], curr, idx) => {
      if (curr === targetWord[idx] && curr === letter) {
        acc.push(idx);
      }

      return acc;
    }, []);

    return cx(styles.letterBox, {
      [styles.correct]: isCorrectPosition,
      [styles.present]:
        !isCorrectPosition &&
        targetWord.includes(letter) &&
        // Case 1: Target word has multiple occurrences of the letter
        (targetLetterCount > 1 ||
          // Case 2: Target word has single occurrence and this is not beyond the valid occurrences
          (targetLetterCount === 1 &&
            correctPositions.length === 0 &&
            currentRowWord.indexOf(letter) === colIndex)),
    });
  };

  const flattenedCells = board.flatMap((_, rowIndex) =>
    Array.from({ length: LETTERS_COUNT }, (_, colIndex) => {
      const letter = getLetter(rowIndex, colIndex);
      const cellClass = getCellClass(rowIndex, colIndex, letter);

      return { rowIndex, colIndex, letter, cellClass };
    })
  );

  return (
    <div className={styles.container}>
      {flattenedCells.map(({ rowIndex, colIndex, letter, cellClass }) => (
        <div key={`${rowIndex}-${colIndex}`} className={cellClass}>
          {letter}
        </div>
      ))}
    </div>
  );
};

export default WordleBoard;
