import { useUserControllerGetLanguage } from '@Procareful/common/api';
import {
  ProcarefulAppPathRoutes,
  LocalStorageKey,
  SearchParams,
} from '@Procareful/common/lib/constants';
import { Title, Text } from '@Procareful/ui';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Image } from 'antd';
import OnboardingCarousel from './OnboardingCarousel';
import OnboardingLayout from './OnboardingLayout';
import { pagesWithButtonArray, onboardingConfig } from './constants';
import { useStyles } from './styles';

const Onboarding = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: languageData } = useUserControllerGetLanguage();
  const currentLanguage = languageData?.details.language.toLowerCase() || 'en';

  const step = parseInt(searchParams.get(SearchParams.Step) || '1', 10);

  const updateStepInParams = (newStep: number) => {
    if (newStep >= 1 && newStep <= 6) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(SearchParams.Step, newStep.toString());
      setSearchParams(newSearchParams);
    }
  };

  const handleIncrementStep = () => {
    if (step < 6) {
      updateStepInParams(step + 1);
    }
  };

  const handleDecrementStep = () => {
    if (step > 1) {
      updateStepInParams(step - 1);
    }
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem(LocalStorageKey.HasUserOnboarding, 'true');
    navigate(ProcarefulAppPathRoutes.Dashboard);
  };

  const isCarouselStep = pagesWithButtonArray.includes(step);

  const { title, description, imagePath } = onboardingConfig(currentLanguage)[step - 1];

  useEffect(() => {
    const checkHasUserOnboarding = localStorage.getItem(LocalStorageKey.HasUserOnboarding);

    if (checkHasUserOnboarding) {
      navigate(ProcarefulAppPathRoutes.Dashboard);
    }
  }, [navigate]);

  return (
    <OnboardingLayout
      step={step}
      onIncrementStep={handleIncrementStep}
      onDecrementStep={handleDecrementStep}
      onCompleteOnboarding={handleCompleteOnboarding}
    >
      {!isCarouselStep ? (
        <div className={styles.cardContainer}>
          <div className={styles.imageContainer}>
            <Image className={styles.carouselImage} preview={false} src={imagePath} />
          </div>
          <div className={styles.textContainer}>
            <Title level={3} className={styles.heading}>
              {title}
            </Title>
            <Text className={styles.description}>{description}</Text>
          </div>
        </div>
      ) : (
        <OnboardingCarousel heading={title} description={description} imagePath={imagePath} />
      )}
    </OnboardingLayout>
  );
};

export default Onboarding;
