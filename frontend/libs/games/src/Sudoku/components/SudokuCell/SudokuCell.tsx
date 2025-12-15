import { Button } from 'antd';
import { cx } from 'antd-style';
import { GameDisplayState } from '@Procareful/games';
import { LAST_ROW, NUMBER_OF_GROUP } from '../../constants';
import { useStyles } from './styles';

type CellProps = {
  className?: string;
  value: number | null;
  row: number;
  col: number;
  selectedCell: { row: number; col: number } | null;
  gameDisplayState: GameDisplayState;
  isInitial: boolean;
  isValid: boolean;
  isPreview?: boolean;
  onClick: () => void;
};

type ActiveCellProps = {
  row: number;
  col: number;
  selectedCell: { row: number; col: number } | null;
};

const useActiveCell = ({ row, col, selectedCell }: ActiveCellProps) => {
  const { row: selectedRow, col: selectedCol } = selectedCell || {};

  const isActiveCell = col === selectedCol && row === selectedRow;

  const isInSelectedRow = row === selectedRow;
  const isInSelectedCol = col === selectedCol;
  const isInSelectedSquare =
    Math.floor(col / NUMBER_OF_GROUP) === Math.floor((selectedCol || 0) / NUMBER_OF_GROUP) &&
    Math.floor(row / NUMBER_OF_GROUP) === Math.floor((selectedRow || 0) / NUMBER_OF_GROUP);
  const isInSelectedZone =
    !!selectedCell && (isInSelectedRow || isInSelectedCol || isInSelectedSquare);

  const isBottomCell = row % NUMBER_OF_GROUP === 2 && row !== LAST_ROW;
  const isRightCell = col % NUMBER_OF_GROUP === 2 && col !== LAST_ROW;

  return {
    isActiveCell,
    isInSelectedZone,
    isBottomCell,
    isRightCell,
  };
};

const SudokuCell = ({
  row,
  col,
  onClick,
  value,
  selectedCell,
  className,
  gameDisplayState,
  isInitial,
  isPreview,
  isValid,
}: CellProps) => {
  const { styles } = useStyles();

  const { isActiveCell, isInSelectedZone, isBottomCell, isRightCell } = useActiveCell({
    col,
    row,
    selectedCell,
  });

  const isShowingDiff = !isPreview && gameDisplayState === GameDisplayState.DIFF;
  const cellStyle = `${styles.sudokuCell} ${className}`;
  const diffClass = isValid ? 'validCell' : 'invalidCell';

  return (
    <Button
      className={cx(cellStyle, {
        [styles.initialCell]: isInitial,
        [styles.bottomBorder]: isBottomCell,
        [styles.rightBorder]: isRightCell,
        [styles.selectedRowColSquare]: !isShowingDiff && isInSelectedZone,
        [styles.activeCell]: !isShowingDiff && isActiveCell,
        [styles[diffClass]]: isShowingDiff && !isInitial,
      })}
      onClick={onClick}
    >
      {value}
    </Button>
  );
};

export default SudokuCell;
