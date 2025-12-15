import { type SudokuGrid } from '@Procareful/common/lib';
import { type GameDisplayState } from '@Procareful/games';
import SudokuCell from '../SudokuCell';
import { useStyles } from './styles';

type SudokuBoardProps = {
  board: SudokuGrid;
  initialBoard: SudokuGrid;
  solution: SudokuGrid;
  gameDisplayState: GameDisplayState;
  selectedCell: { row: number; col: number } | null;
  isPreview?: boolean;
  onCellClick?: (row: number, col: number) => void;
};

const SudokuBoard = ({
  board,
  initialBoard,
  solution,
  gameDisplayState,
  selectedCell,
  isPreview,
  onCellClick,
}: SudokuBoardProps) => {
  const { styles } = useStyles();

  return (
    <div className={styles.sudokuBoard}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.sudokuRow}>
          {row.map((_, colIndex) => {
            const isInitial = initialBoard[rowIndex][colIndex] !== null;
            const isValid =
              !isPreview && board[rowIndex][colIndex] === solution[rowIndex][colIndex];

            return (
              <SudokuCell
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                onClick={() => onCellClick?.(rowIndex, colIndex)}
                value={board[rowIndex][colIndex]}
                isInitial={isInitial}
                selectedCell={selectedCell}
                gameDisplayState={gameDisplayState}
                isValid={isValid}
                isPreview={isPreview}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SudokuBoard;
