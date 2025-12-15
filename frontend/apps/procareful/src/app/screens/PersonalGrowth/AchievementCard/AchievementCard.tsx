import {
  getUserControllerGetActivePersonalGrowthChallengeQueryKey,
  useUserControllerGetActivePersonalGrowthChallenge,
} from '@Procareful/common/api';
import { useToggle, useTypedTranslation } from '@Procareful/common/lib';
import { ProcarefulAppPathRoutes } from '@Procareful/common/lib/constants';
import { Text } from '@Procareful/ui';
import Trophy from '@Procareful/ui/assets/gifs/completed-game.gif';
import ConfirmationModal from '@ProcarefulApp/components/ConfirmationModal';
import TrophyWithFireworks from '@ProcarefulAppAssets/success-2.gif';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Image } from 'antd';
import { getNewSearchParams, removePersonalGrowthDataFromLocalStorage } from '../helpers';
import { useStyles } from './styles';

const AchievementCard = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isNewChallengeModalOpen, , setNewChallengeModalVisibility] = useToggle();

  const { data: activeChallengeData } = useUserControllerGetActivePersonalGrowthChallenge();

  // Check if an active challenge exists.
  // If an active challenge exists, it means we haven't finished all the challenges yet.
  // If no active challenge exists, it means there are still challenges to be completed.
  // The "can-skip" endpoint won't work here because marking the challenge as completed on the previous page
  // will cause the "can-skip" endpoint to return false. However, this false value corresponds to the next challenge,
  // not the one we just completed.
  const hasCompletedAllChallenges = !activeChallengeData?.details?.active;

  const handleOk = () => {
    if (hasCompletedAllChallenges) {
      handleGoBack();

      return;
    }

    setNewChallengeModalVisibility(true);
  };

  const handleNextChallenge = async () => {
    await queryClient.invalidateQueries({
      queryKey: getUserControllerGetActivePersonalGrowthChallengeQueryKey(),
    });

    const newSearchParams = getNewSearchParams({
      searchParams,
      stepNumber: 0,
    });

    removePersonalGrowthDataFromLocalStorage();
    setSearchParams(newSearchParams);
    setNewChallengeModalVisibility(false);

    return;
  };

  const handleGoBack = () => {
    removePersonalGrowthDataFromLocalStorage();
    setNewChallengeModalVisibility(true);
    navigate(ProcarefulAppPathRoutes.Dashboard);
  };

  return (
    <div className={styles.container}>
      <Text className={styles.rewardText}>{t('senior_inf_finished_exercise')}</Text>
      <Image src={hasCompletedAllChallenges ? TrophyWithFireworks : Trophy} preview={false} />
      <Text>
        {hasCompletedAllChallenges
          ? t('senior_inf_challenge_congrats')
          : t('senior_inf_finished_exercise_appendix')}
      </Text>
      <Button size="large" className={styles.button} onClick={handleOk}>
        {t('shared_btn_ok')}
      </Button>
      <ConfirmationModal
        open={isNewChallengeModalOpen}
        onConfirm={handleNextChallenge}
        onCancel={handleGoBack}
        title={t('senior_title_new_challenge_is_here_for_you')}
        confirmText={t('senior_btn_see_challenge')}
        cancelText={t('senior_btn_do_it_later')}
      />
    </div>
  );
};

export default AchievementCard;
