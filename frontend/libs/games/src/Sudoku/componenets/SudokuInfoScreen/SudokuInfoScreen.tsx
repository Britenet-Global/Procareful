import { useTypedTranslation } from '@Procareful/common/lib';
import { Paragraph, Text } from '@Procareful/ui';
import { useStyles } from './styles';

const SudokuInfoScreen = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <div className={styles.container}>
      <Text strong className={styles.title}>
        {t('senior_games_solve_sudoku_puzzles')}
      </Text>
      <Paragraph className={styles.text}>{t('senior_games_play_sudoku')}</Paragraph>
    </div>
  );
};

export default SudokuInfoScreen;
