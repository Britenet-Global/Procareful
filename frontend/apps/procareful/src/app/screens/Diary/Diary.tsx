import { useUserControllerGetCompletedPersonalGrowthChallenges } from '@Procareful/common/api';
import { ProcarefulAppPathRoutes, useTypedTranslation, TimeFormat } from '@Procareful/common/lib';
import { RedirectTile } from '@ProcarefulApp/components/RedirectTile';
import TopBarLayout from '@ProcarefulApp/layout/TopBarLayout';
import dayjs from 'dayjs';
import Placeholder from './Placeholder';
import { useStyles } from './styles';

const Diary = () => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();

  const {
    data: personalGrowthChallengesData,
    isLoading,
    isSuccess,
  } = useUserControllerGetCompletedPersonalGrowthChallenges();

  const personalGrowthChallenges = personalGrowthChallengesData?.details || [];
  const hasPersonalGrowthChallenges = personalGrowthChallenges?.length > 0;

  const getSubtitle = () => {
    if (isLoading) {
      return;
    }

    return hasPersonalGrowthChallenges
      ? t('senior_title_diary_journey_reflection')
      : t('senior_title_no_post_placeholder');
  };

  return (
    <TopBarLayout
      backTo={ProcarefulAppPathRoutes.Dashboard}
      subtitle={getSubtitle()}
      subtitleClassName={cx({
        [styles.subtitle]: hasPersonalGrowthChallenges,
        [styles.noDataSubtitle]: !hasPersonalGrowthChallenges,
      })}
      isLoading={isLoading}
    >
      {isSuccess && !hasPersonalGrowthChallenges && <Placeholder />}
      {personalGrowthChallenges?.map(
        ({
          user_personal_growth_challenges,
          stuck_in_memory_the_most,
          positive_emotions,
          id,
          updated_at,
        }) => (
          <RedirectTile
            key={id}
            title={user_personal_growth_challenges.title}
            header={dayjs(updated_at).format(TimeFormat.DATE_FORMAT)}
            subtitle={
              (stuck_in_memory_the_most || positive_emotions) && t('senior_inf_memories_added')
            }
            isCompleted={Boolean(stuck_in_memory_the_most || positive_emotions)}
            redirectTo={id.toString()}
          />
        )
      )}
    </TopBarLayout>
  );
};

export default Diary;
