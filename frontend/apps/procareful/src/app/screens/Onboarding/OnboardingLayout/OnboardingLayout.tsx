import { Title } from '@Procareful/ui';
import LogoSvg from '@Procareful/ui/assets/icons/procareful-logo.svg?react';
import Icon from '@ant-design/icons';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { cx } from 'antd-style';
import { pagesWithButtonArray } from '../constants';
import { useStyles } from './styles';

type OnboardingLayoutProps = PropsWithChildren & {
  step: number;
  onIncrementStep: () => void;
  onDecrementStep: () => void;
  onCompleteOnboarding: () => void;
};

const OnboardingLayout = ({
  step,
  onIncrementStep,
  onDecrementStep,
  onCompleteOnboarding,
  children,
}: OnboardingLayoutProps) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  const isCarouselStep = pagesWithButtonArray.includes(step);
  const isLastStep = step === 6;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.centeredContainer}>
        <div className={styles.logoContainer}>
          <Icon component={LogoSvg} className={styles.icon} />
          <Title level={4}>Procareful</Title>
        </div>
        <div className={styles.childrenComponent}>{children}</div>
        <div className={styles.buttonContainer}>
          {!isCarouselStep ? (
            <Button
              onClick={!isLastStep ? onIncrementStep : onCompleteOnboarding}
              type="primary"
              className={styles.submitButton}
            >
              {step === 1
                ? t('senior_btn_onboarding_welcome_page')
                : t('senior_btn_onboarding_end_page')}
            </Button>
          ) : (
            <div className={styles.stepComponent}>
              <Button className={styles.carouselButtons} onClick={onDecrementStep}>
                {t('admin_btn_back')}
              </Button>
              {pagesWithButtonArray.map(page => (
                <div
                  key={page}
                  className={cx(styles.carouselDots, { [styles.carouselActiveDot]: step === page })}
                />
              ))}
              <Button className={styles.carouselButtons} onClick={onIncrementStep}>
                {t('senior_btn_onboarding_carousel_next_page')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
