import { type PropsWithChildren } from 'react';
import { Button } from 'antd';
import { cx } from 'antd-style';
import { Text } from '@Procareful/ui';
import { useStyles } from './styles';

type SudokuButtonProps = PropsWithChildren<{
  onClick: () => void;
  remainingNumber?: number;
  additionalStyle?: string;
  additionalLabelStyles?: string;
}>;

const SudokuButton = ({
  children,
  remainingNumber,
  additionalStyle,
  additionalLabelStyles,
  onClick,
}: SudokuButtonProps) => {
  const { styles } = useStyles();

  const isNumberExhausted = remainingNumber === 0;

  return (
    <Button
      size="large"
      className={cx(styles.singleButton, additionalStyle)}
      onClick={onClick}
      disabled={isNumberExhausted}
    >
      <div className={cx(styles.label, additionalLabelStyles)}>{children}</div>
      {remainingNumber && (
        <Text className={cx(styles.remainingNumberLabel)}>{remainingNumber}</Text>
      )}
    </Button>
  );
};

export default SudokuButton;
