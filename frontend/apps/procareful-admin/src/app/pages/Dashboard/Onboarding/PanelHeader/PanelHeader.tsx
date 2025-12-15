import { Progress } from 'antd';
import { i18n } from '@Procareful/common/i18n';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Title, Paragraph } from '@Procareful/ui';
import { useStyles } from './styles';

type PanelHeaderProps = {
  remainingSteps: number;
  completionPercentage: number;
};

const PanelHeader = ({ remainingSteps, completionPercentage }: PanelHeaderProps) => {
  const { t } = useTypedTranslation();
  const { styles } = useStyles();

  return (
    <>
      <Title level={3}>
        {t('admin_title_onboarding')}
        <span role="img" aria-label="party pooper icon">
          🎉
        </span>
      </Title>
      <Paragraph className={styles.welcomeDescription}>
        {t('admin_inf_onboarding_description')}
      </Paragraph>
      <div className={styles.progressContainer}>
        <Title level={6}>
          {i18n.t('admin_onboarding_remaining_steps', { count: remainingSteps })}
        </Title>
        <Progress percent={completionPercentage} status="normal" className={styles.progress} />
      </div>
    </>
  );
};

export default PanelHeader;
