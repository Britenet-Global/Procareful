import { Fragment } from 'react';
import { Progress } from 'antd';
import { Text, globalStyles } from '@Procareful/ui';
import { useStyles } from '../styles';

type PerformanceChartsProps = {
  progressData: { label: string; percent?: number }[];
  totalPerformance?: number;
};

const PerformanceCharts = ({ progressData, totalPerformance }: PerformanceChartsProps) => {
  const { styles } = useStyles();

  return (
    <div className={styles.progressContainer}>
      <Progress
        type="circle"
        percent={totalPerformance}
        strokeColor={globalStyles.themeColors.colorPrimaryHover}
        strokeWidth={4}
        className={styles.progress}
      />
      <div className={styles.lineProgressContainer}>
        {progressData.map((item, index) => (
          <Fragment key={index}>
            <Text className={styles.text}>{item.label}</Text>
            <Progress
              percent={item.percent}
              strokeColor={globalStyles.themeColors.colorPrimaryHover}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default PerformanceCharts;
