import {
  getUserControllerGetActivePersonalGrowthChallengeQueryKey,
  getUserControllerGetDashboardQueryKey,
  useUserControllerCanSkipChallenge,
  useUserControllerGetActivePersonalGrowthChallenge,
  useUserControllerSkipChallenge,
} from '@Procareful/common/api';
import { useToggle, useTypedTranslation } from '@Procareful/common/lib';
import { SearchParams, ProcarefulAppPathRoutes } from '@Procareful/common/lib/constants';
import { Title, Text } from '@Procareful/ui';
import ProcarefulLogo from '@Procareful/ui/assets/icons/procareful-logo.svg?react';
import ConfirmationModal from '@ProcarefulApp/components/ConfirmationModal';
import { useStylish } from '@ProcarefulApp/styles/activityDetailsStyles';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from 'antd';
import { getNewSearchParams } from '../helpers';
import { PERSONAL_GROWTH_POINT, personalGrowthIcon } from './constants';

const PersonalGrowth = () => {
  const stylish = useStylish();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isSkipModalOpen, , setSkipModalVisibility] = useToggle();
  const [isNewChallengeModalOpen, , setNewChallengeModalVisibility] = useToggle();
  const [isLastChallengeModalOpen, , setLastChallengeModalVisibility] = useToggle();

  const { data: personalGrowthData, isRefetching } =
    useUserControllerGetActivePersonalGrowthChallenge();

  const { title, description, icon_type } =
    personalGrowthData?.details.user_personal_growth_challenges || {};

  const challengeIcon = personalGrowthIcon[icon_type as keyof typeof personalGrowthIcon] || 'spa';
  const personalGrowthId = personalGrowthData?.details.id;

  const { data: canSkipPersonalGrowthChallengeData } = useUserControllerCanSkipChallenge();
  const isLastChallenge = !canSkipPersonalGrowthChallengeData?.details;

  const { mutate: skipChallenge, isPending: isSkipChallengePending } =
    useUserControllerSkipChallenge({
      mutation: {
        onSuccess: () => {
          setSkipModalVisibility(false);
          setNewChallengeModalVisibility(true);
        },
      },
    });

  const handleSkipSuccess = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: getUserControllerGetActivePersonalGrowthChallengeQueryKey(),
      }),
      queryClient.invalidateQueries({
        queryKey: getUserControllerGetDashboardQueryKey(),
      }),
    ]);
  };

  const handleSkip = () =>
    isLastChallenge ? setLastChallengeModalVisibility(true) : setSkipModalVisibility(true);

  const handleSkipConfirm = () => {
    if (!personalGrowthId) {
      return;
    }

    isLastChallenge
      ? navigate(ProcarefulAppPathRoutes.Dashboard)
      : skipChallenge({ personalGrowthId });
  };

  const handleNewChallengeConfirm = async () => {
    await handleSkipSuccess();

    setNewChallengeModalVisibility(false);
  };

  const handleChallengeComplete = () => {
    if (!personalGrowthId) {
      return;
    }

    const newSearchParams = getNewSearchParams({
      searchParams,
      stepNumber: 1,
      personalGrowthId: personalGrowthId.toString(),
    });

    newSearchParams.set(SearchParams.Id, personalGrowthId.toString());
    setSearchParams(newSearchParams, { replace: true });
  };

  const handleDoItLater = async () => {
    await handleSkipSuccess();

    setNewChallengeModalVisibility(true);
    navigate(ProcarefulAppPathRoutes.Dashboard);
  };

  return (
    <>
      <div className={stylish.container}>
        <div>
          <div className={stylish.imageContainer}>
            <span className={stylish.circularBackground}>{challengeIcon}</span>
          </div>
          <div className={stylish.headingContainer}>
            <Title level={4} className={stylish.titleHeader}>
              {title}
            </Title>
            <Text className={stylish.description}>{description}</Text>
            <div className={stylish.iconsMainContainer}>
              <div className={stylish.iconContainer}>
                <ProcarefulLogo />
                <Text className={stylish.iconDescription}>{PERSONAL_GROWTH_POINT}</Text>
              </div>
            </div>
          </div>
        </div>
        <div className={stylish.buttonContainer}>
          <Button type="primary" size="large" onClick={handleChallengeComplete}>
            {t('senior_btn_completed')}
          </Button>
          <Button size="large" onClick={handleSkip}>
            {t('admin_btn_skip')}
          </Button>
        </div>
      </div>
      <ConfirmationModal
        open={isSkipModalOpen}
        loading={isSkipChallengePending}
        onConfirm={handleSkipConfirm}
        onCancel={() => setSkipModalVisibility(false)}
        title={t('senior_title_is_sure_to_skip_activity')}
        confirmText={t('senior_btn_skip_activity')}
        cancelText={t('senior_btn_back_to_challenge')}
      />
      <ConfirmationModal
        open={isNewChallengeModalOpen}
        loading={isRefetching}
        onConfirm={handleNewChallengeConfirm}
        onCancel={handleDoItLater}
        title={t('senior_title_new_challenge_is_here_for_you')}
        confirmText={t('senior_btn_see_challenge')}
        cancelText={t('senior_btn_do_it_later')}
      />
      <ConfirmationModal
        open={isLastChallengeModalOpen}
        onConfirm={() => setLastChallengeModalVisibility(false)}
        onCancel={handleSkipConfirm}
        title={t('senior_title_final_challenge')}
        description={t('senior_inf_final_challenge_description')}
        confirmText={t('senior_btn_back_to_exercise')}
        cancelText={t('senior_btn_skip_exercise')}
      />
    </>
  );
};

export default PersonalGrowth;
