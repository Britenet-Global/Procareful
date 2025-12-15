import { Progress } from 'antd';
import type { GetUserPerformanceResponse } from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { globalStyles, Text, Title } from '@Procareful/ui';
import { useStyles } from './styles';

type CognitiveGamesProps = {
  personalData: GetUserPerformanceResponse;
};

const CognitiveGames = ({ personalData }: CognitiveGamesProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  const { cognitiveGames } = personalData.details || {};

  return (
    <div className={styles.container}>
      <Progress
        type="circle"
        percent={cognitiveGames}
        strokeColor={globalStyles.themeColors.colorPrimaryHover}
        strokeWidth={4}
        className={styles.progress}
      />
      <Title level={6} className={styles.header}>
        {t('admin_title_cognitive_games')}
      </Title>
      <Text className={styles.description}>{`(${t('admin_table_last_30_days')})`}</Text>
    </div>
  );
};

export default CognitiveGames;
