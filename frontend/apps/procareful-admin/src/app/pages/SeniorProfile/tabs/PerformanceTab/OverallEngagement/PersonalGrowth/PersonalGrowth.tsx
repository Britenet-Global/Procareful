import { Progress } from 'antd';
import type { GetUserPerformanceResponse } from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { globalStyles, Text, Title } from '@Procareful/ui';
import { useStyles } from './styles';

type PersonalGrowthProps = {
  personalData: GetUserPerformanceResponse;
};

const PersonalGrowth = ({ personalData }: PersonalGrowthProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  const { personalGrowth } = personalData.details || {};
  const { personalGrowthAllChallenges, personalGrowthCompletedChallenges } = personalGrowth || {};

  if (!personalGrowth) return;

  const personalGrowthPercentage =
    personalGrowthAllChallenges && personalGrowthCompletedChallenges
      ? Math.round((personalGrowthCompletedChallenges / personalGrowthAllChallenges) * 100)
      : 0;

  return (
    <div className={styles.container}>
      <Progress
        type="circle"
        percent={personalGrowthPercentage}
        strokeColor={globalStyles.themeColors.colorPrimaryHover}
        strokeWidth={4}
        className={styles.progress}
        format={() => `${personalGrowthCompletedChallenges}/${personalGrowthAllChallenges}`}
      />
      <Title level={6} className={styles.header}>
        {t('shared_title_personal_growth')}
      </Title>
      <Text className={styles.description}>{`(${t('admin_inf_all_time')})`}</Text>
    </div>
  );
};

export default PersonalGrowth;
