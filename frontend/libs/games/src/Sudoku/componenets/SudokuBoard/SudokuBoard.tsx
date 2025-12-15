import type { SudokuBoardType } from '../../typings';
import SudokuCell from '../SudokuCell';
import { useStyles } from './styles';

type SudokuBoardProps = {
  board: SudokuBoardType;
  initialBoard: SudokuBoardType;
  onCellClick: (row: number, col: number) => void;
  selectedCell: { row: number; col: number } | null;
};

const SudokuBoard = ({ board, initialBoard, selectedCell, onCellClick }: SudokuBoardProps) => {
  const { styles } = useStyles();

  return (
    <div className={styles.sudokuBoard}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.sudokuRow}>
          {row.map((_, colIndex) => {
            const isInitial = initialBoard[rowIndex][colIndex] !== null;

            return (
              <SudokuCell
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                onClick={() => onCellClick(rowIndex, colIndex)}
                value={board[rowIndex][colIndex]}
                isInitial={isInitial}
                selectedCell={selectedCell}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SudokuBoard;
