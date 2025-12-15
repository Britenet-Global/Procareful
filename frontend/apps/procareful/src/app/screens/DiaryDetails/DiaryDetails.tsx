import { useUserControllerGetPersonalGrowthChallenge } from '@Procareful/common/api';
import { ProcarefulAppPathRoutes, useTypedTranslation } from '@Procareful/common/lib';
import TopBarLayout from '@ProcarefulApp/layout/TopBarLayout';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import EditableForm from './EditableForm';
import ReadOnlyForm from './ReadOnlyForm';
import Subtitle from './Subtitle';
import { useStyles } from './styles';

const DiaryDetails = () => {
  const { t } = useTypedTranslation();
  const { styles } = useStyles();
  const { id: personalGrowthChallengeId } = useParams();

  const [isEditable, setIsEditable] = useState(false);

  const { data: personalGrowthChallengeData, isLoading } =
    useUserControllerGetPersonalGrowthChallenge(Number(personalGrowthChallengeId), {
      query: {
        enabled: Boolean(personalGrowthChallengeId),
      },
    });

  const { positive_emotions, stuck_in_memory_the_most, updated_at } =
    personalGrowthChallengeData?.details || {};

  const { title } = personalGrowthChallengeData?.details.user_personal_growth_challenges || {};

  return (
    <TopBarLayout
      title={t('senior_title_my_diary')}
      subtitle={isLoading ? undefined : <Subtitle title={title} createdAt={updated_at} />}
      backTo={ProcarefulAppPathRoutes.MyDiary}
      isLoading={isLoading}
    >
      <div className={styles.container}>
        {isEditable ? (
          <EditableForm
            onFormComplete={() => setIsEditable(false)}
            personalGrowthChallengeId={Number(personalGrowthChallengeId)}
            positiveEmotions={positive_emotions || ''}
            stuckInMemoryTheMost={stuck_in_memory_the_most || ''}
          />
        ) : (
          <ReadOnlyForm
            positiveEmotions={positive_emotions || ''}
            stuckInMemoryTheMost={stuck_in_memory_the_most || ''}
            onEdit={() => setIsEditable(true)}
          />
        )}
      </div>
    </TopBarLayout>
  );
};

export default DiaryDetails;
