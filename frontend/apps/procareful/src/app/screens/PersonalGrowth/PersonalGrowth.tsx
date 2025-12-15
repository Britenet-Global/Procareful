import { useUserControllerCanSkipChallenge } from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { SearchParams, ProcarefulAppPathRoutes } from '@Procareful/common/lib/constants';
import TopBarLayout from '@ProcarefulApp/layout/TopBarLayout';
import { useSearchParams } from 'react-router-dom';
import { personalGrowthChallengeSteps } from './constants';
import { getNewSearchParams } from './helpers';

const PersonalGrowth = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTypedTranslation();

  const { data: personalGrowthCanSkipData } = useUserControllerCanSkipChallenge();
  const isNextChallengeReady = Boolean(personalGrowthCanSkipData?.details);

  const step = Number(searchParams.get(SearchParams.Step)) || 0;
  const subtitle = searchParams.get(SearchParams.PageSubtitle) || '';
  const personalGrowthId = searchParams.get(SearchParams.Id);

  const isFirstStep = step === 0;
  const isLastStep = step === personalGrowthChallengeSteps.length - 1;

  const getSubtitle = () => {
    if (isFirstStep) {
      return undefined;
    }

    if (isLastStep) {
      return isNextChallengeReady
        ? t('senior_games_finished_game_successfully')
        : t('senior_title_last_challenge_behind');
    }

    return subtitle;
  };

  const getBackToConfig = () => {
    const hasBackToEnabled = isFirstStep || isLastStep;

    if (!hasBackToEnabled) {
      return;
    }

    if (isFirstStep) {
      return ProcarefulAppPathRoutes.Dashboard;
    }

    if (isLastStep && personalGrowthId) {
      return {
        pathName: ProcarefulAppPathRoutes.PersonalGrowth,
        search: getNewSearchParams({
          personalGrowthId,
          searchParams,
          stepNumber: personalGrowthChallengeSteps.length - 2,
        }).toString(),
      };
    }
  };

  return (
    <TopBarLayout backTo={getBackToConfig()} subtitle={getSubtitle()}>
      {personalGrowthChallengeSteps[step]}
    </TopBarLayout>
  );
};

export default PersonalGrowth;
