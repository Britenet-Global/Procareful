import { useTypedTranslation } from '@Procareful/common/lib';
import { ProcarefulAppPathRoutes, SearchParams } from '@Procareful/common/lib/constants';
import { Text } from '@Procareful/ui';
import { removePersonalGrowthDataFromLocalStorage } from '@ProcarefulApp/screens/PersonalGrowth/helpers';
import { type ReactNode, useEffect } from 'react';
import ActivityTile from '../ActivityTile';
import NoDataPlaceholderTile from '../NoDataPlaceholderTile';
import { useStyles } from './styles';

type PersonalGrowthProps = {
  hasAssessmentCompleted: boolean;
  title: string;
  subtitle: string | ReactNode;
  isCompleted: boolean;
};

const PersonalGrowthSection = ({
  isCompleted,
  hasAssessmentCompleted,
  title,
  subtitle,
}: PersonalGrowthProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  const navigationConfig = {
    pathname: ProcarefulAppPathRoutes.PersonalGrowth,
    search: new URLSearchParams({
      [SearchParams.PageSubtitle]: title || '',
    }).toString(),
  };

  useEffect(() => {
    removePersonalGrowthDataFromLocalStorage();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text strong>{t('shared_title_personal_growth')}</Text>
      </div>
      {hasAssessmentCompleted ? (
        <>
          <ActivityTile
            type="book"
            title={title}
            description={subtitle}
            isCompleted={isCompleted}
            variant={isCompleted ? 'div' : 'link'}
            redirectTo={isCompleted ? undefined : navigationConfig}
          />
          <ActivityTile
            redirectTo={ProcarefulAppPathRoutes.MyDiary}
            type="diary"
            title={t('senior_title_diary')}
            description={t('senior_title_diary_description')}
            variant="link"
          />
        </>
      ) : (
        <NoDataPlaceholderTile
          type="book"
          title={t('admin_title_nothing_here')}
          description={t('senior_title_no_challenges_available')}
        />
      )}
    </div>
  );
};

export default PersonalGrowthSection;
