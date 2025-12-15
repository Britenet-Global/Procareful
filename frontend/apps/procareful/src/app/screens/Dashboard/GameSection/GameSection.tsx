import { useTypedTranslation } from '@Procareful/common/lib';
import { ProcarefulAppPathRoutes } from '@Procareful/common/lib/constants';
import { Text } from '@Procareful/ui';
import ActivityTile from '../ActivityTile';
import NoDataPlaceholderTile from '../NoDataPlaceholderTile';
import { useStyles } from './styles';

type GameSectionProps = {
  isCompleted: boolean;
  hasAssessmentCompleted: boolean;
};

const GameSection = ({ isCompleted = false, hasAssessmentCompleted = false }: GameSectionProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text strong>{t('senior_title_game')}</Text>
      </div>
      {hasAssessmentCompleted ? (
        <ActivityTile
          redirectTo={ProcarefulAppPathRoutes.Games}
          type="game"
          title={t('senior_title_game_time')}
          description={t('senior_title_game_spare_five_minutes')}
          isCompleted={isCompleted}
        />
      ) : (
        <NoDataPlaceholderTile
          type="game"
          title={t('admin_title_nothing_here')}
          description={t('senior_title_no_games_assigned')}
        />
      )}
    </div>
  );
};

export default GameSection;
