import { useTypedTranslation } from '@Procareful/common/lib';
import { AuthCard, Paragraph, Title } from '@Procareful/ui';
import LogoSvg from '@Procareful/ui/assets/icons/procareful-logo.svg?react';
import Icon from '@ant-design/icons';
import { useEffect, useState } from 'react';
import PWAPrompt from 'react-ios-pwa-prompt';
import { usePromptEventTrigger } from './hooks';
import { useStyles } from './styles';
import AppIcon from '/images/procareful-logo180.png';

const isIPhonePlatform = window.navigator.platform === 'iPhone';

const Download = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const [isVisible, setVisibleState] = useState(false);

  const [prompt, promptToInstall] = usePromptEventTrigger();

  useEffect(() => {
    if (prompt) {
      setVisibleState(true);
    }
  }, [prompt]);

  return (
    <AuthCard containerClassName={styles.container}>
      <div className={styles.headerContainer}>
        <Icon component={LogoSvg} className={styles.icon} />
        <Title level={3}>{t('senior_title_welcome_aboard')}</Title>
      </div>
      <div className={styles.descriptionContainer}>
        <Paragraph>{t('senior_inf_download_app')}</Paragraph>
      </div>
      <AuthCard.SubmitButton disabled={!isVisible} htmlType="button" onClick={promptToInstall}>
        {t('shared_btn_download')}
      </AuthCard.SubmitButton>
      <Paragraph className={styles.recommendedBrowsersInfo}>
        {t('senior_inf_recommended_browser')}
      </Paragraph>
      {isIPhonePlatform && <PWAPrompt isShown appIconPath={AppIcon} />}
    </AuthCard>
  );
};

export default Download;
