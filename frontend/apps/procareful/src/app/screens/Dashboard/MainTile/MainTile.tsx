import { i18n } from '@Procareful/common/i18n';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Text, Title } from '@Procareful/ui';
import BrainIcon from '@Procareful/ui/assets/icons/procareful-logo.svg?react';
import Icon from '@ant-design/icons';
import { Progress } from 'antd';
import { useStyles } from './styles';

type MainTileProps = {
  name: string;
  totalActivities: number;
  completedActivities: number;
  dailyProgress: number;
};

const MainTile = ({ name, totalActivities, completedActivities, dailyProgress }: MainTileProps) => {
  const { styles, theme } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.upperContainer}>
        <div className={styles.iconContainer}>
          <Icon component={BrainIcon} className={styles.brainIcon} />
        </div>
        <Text className={styles.welcomeText} strong>
          {`${t('admin_title_greeting')}${name ? ` ${name}` : ''}!`}
        </Text>
      </div>
      <div className={styles.bottomContainer}>
        <Title level={theme.fontSize > 16 ? 5 : 6}>{t('senior_title_daily_progress')}</Title>
        <div className={styles.progressContainer}>
          <Progress percent={dailyProgress} />
        </div>
        <Text className={styles.description}>
          {i18n.t('senior_title_game_progress_summary', { completedActivities, totalActivities })}
        </Text>
      </div>
    </div>
  );
};

export default MainTile;
