import { Progress } from 'antd';
import type { GetUserPerformanceResponse } from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { globalStyles, Text, Title } from '@Procareful/ui';
import { useStyles } from './styles';

type PhysicalActivityProps = {
  physicalActivityData?: GetUserPerformanceResponse;
};

const PhysicalActivity = ({ physicalActivityData }: PhysicalActivityProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  const { physicalActivity } = physicalActivityData?.details || {};

  return (
    <div className={styles.container}>
      <Progress
        type="circle"
        percent={physicalActivity}
        strokeColor={globalStyles.themeColors.colorPrimaryHover}
        strokeWidth={4}
        className={styles.progress}
      />
      <Title level={6} className={styles.header}>
        {t('shared_title_physical_activity')}
      </Title>
      <Text className={styles.description}>{`(${t('admin_table_last_30_days')})`}</Text>
    </div>
  );
};

export default PhysicalActivity;
