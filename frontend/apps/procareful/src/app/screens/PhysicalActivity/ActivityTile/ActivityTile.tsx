import { useTypedTranslation } from '@Procareful/common/lib';
import { ProcarefulAppPathRoutes, SearchParams } from '@Procareful/common/lib/constants';
import { Paragraph, Text } from '@Procareful/ui';
import CheckIcon from '@mui/icons-material/Check';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useLocation, useNavigate } from 'react-router-dom';
import { activityDayTimeByRoute, physicalExercisesName } from '../constants';
import { useStyles } from './styles';

type ActivityTileProps = {
  title: string;
  isCompleted?: boolean;
};

const ActivityTile = ({ title, isCompleted }: ActivityTileProps) => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activityDayTime = activityDayTimeByRoute[pathname as keyof typeof activityDayTimeByRoute];

  const handleActivityDetailsNavigate = () => {
    if (isCompleted === undefined || !title) return;

    const additionalParams = activityDayTime
      ? { [SearchParams.ExerciseType]: activityDayTime }
      : null;

    const physicalActivityRedirectConfig = {
      pathname: ProcarefulAppPathRoutes.PhysicalActivityDetails,
      search: new URLSearchParams({
        [SearchParams.Name]: title,
        [SearchParams.IsCompleted]: isCompleted.toString(),
        ...additionalParams,
      }).toString(),
    };

    navigate(physicalActivityRedirectConfig);
  };

  return (
    <div
      className={cx(styles.card, { [styles.singleLinePadding]: !isCompleted })}
      onClick={handleActivityDetailsNavigate}
    >
      <div className={styles.sideContainer}>
        <div className={styles.textContainer}>
          <Text strong>
            {physicalExercisesName[title as unknown as keyof typeof physicalExercisesName]}
          </Text>
          {isCompleted && (
            <div className={styles.completedContainer}>
              <Paragraph>{t('senior_title_completed')}</Paragraph>
              <CheckIcon className={styles.checkIcon} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.imageWrapper}>
        <NavigateNextIcon className={styles.icon} />
      </div>
    </div>
  );
};

export default ActivityTile;
