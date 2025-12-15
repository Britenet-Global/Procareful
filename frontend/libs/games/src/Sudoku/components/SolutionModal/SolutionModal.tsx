import { type FC } from 'react';
import { Modal } from 'antd';
import { type SudokuGrid } from '@Procareful/common/lib';
import { GameDisplayState } from '@Procareful/games';
import SudokuBoard from '../SudokuBoard';
import { useStyles } from './styles';

type SolutionModalProps = {
  initialBoard: SudokuGrid;
  solution: SudokuGrid;
  isOpen: boolean;
  onClose: () => void;
};

export const SolutionModal: FC<SolutionModalProps> = ({
  initialBoard,
  solution,
  isOpen,
  onClose,
}) => {
  const { styles } = useStyles();

  return (
    <Modal
      centered
      open={isOpen}
      footer={null}
      closable
      onOk={onClose}
      onCancel={onClose}
      className={styles.modal}
      width={600}
    >
      <div className={styles.container}>
        <SudokuBoard
          board={solution}
          initialBoard={initialBoard}
          selectedCell={null}
          gameDisplayState={GameDisplayState.DIFF}
          solution={solution}
          isPreview
        />
      </div>
    </Modal>
  );
};
