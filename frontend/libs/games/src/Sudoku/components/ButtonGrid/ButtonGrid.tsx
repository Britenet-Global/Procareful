import { CheckOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Text } from '@Procareful/ui';
import EraseIcon from '@Procareful/ui/assets/icons/eraser.svg?react';
import SudokuButton from '../SudokuButton';
import { useStyles } from './styles';

type ButtonGridProps = {
  onGameButtonClick: (value: number | null) => void;
  onEndGameButtonClick: () => void;
  remainingCounts: Record<number, number>;
};

const ButtonGrid = ({
  onGameButtonClick,
  onEndGameButtonClick,
  remainingCounts,
}: ButtonGridProps) => {
  const { t } = useTranslation();
  const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const { styles } = useStyles();

  const buttonsInRow = 5;
  const numbersLeft = (number: number) => 9 - (remainingCounts[number] || 0);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.buttonLine}>
          {labels.slice(0, buttonsInRow).map(label => (
            <SudokuButton
              key={label}
              onClick={() => onGameButtonClick(label)}
              remainingNumber={numbersLeft(label)}
            >
              {label}
            </SudokuButton>
          ))}
        </div>
        <div className={styles.buttonLine}>
          {labels.slice(buttonsInRow).map(label => (
            <SudokuButton
              key={label}
              onClick={() => onGameButtonClick(label)}
              remainingNumber={numbersLeft(label)}
            >
              {label}
            </SudokuButton>
          ))}
        </div>
      </div>
      <div className={styles.buttonLine}>
        <SudokuButton
          onClick={() => onGameButtonClick(null)}
          additionalStyle={styles.configButton}
          additionalLabelStyles={styles.labelConfigButton}
        >
          <EraseIcon className={styles.clearIcon} />
          <Text className={styles.textButton}>{t('senior_games_erase_cell')}</Text>
        </SudokuButton>
        <SudokuButton
          onClick={onEndGameButtonClick}
          additionalStyle={styles.configButton}
          additionalLabelStyles={styles.labelConfigButton}
        >
          <CheckOutlined className={styles.checkIcon} />
          <Text className={styles.textButton}>{t('senior_games_end_game_cell')}</Text>
        </SudokuButton>
      </div>
    </div>
  );
};

export default ButtonGrid;
