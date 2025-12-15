import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { List, Spin } from 'antd';
import { type GetGamesEngagementResponseDto } from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import Line from './Line';
import { useStyles } from './styles';

type HeatMapFCProps = {
  seniorsData: GetGamesEngagementResponseDto[];
  isLoading: boolean;
  onReachEnd?: () => void;
  isLoadingNextPage: boolean;
};

const HeatMap = ({ seniorsData, isLoading, isLoadingNextPage, onReachEnd }: HeatMapFCProps) => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const { ref, inView } = useInView({
    threshold: 1,
  });

  const renderListWithCell = () => {
    const allItems = seniorsData.flatMap(pageData => pageData.details.gamesScores.items || []);

    if (allItems.length === 0) return null;

    return (
      <div>
        <List
          loading={isLoadingNextPage}
          itemLayout="horizontal"
          dataSource={allItems}
          className={styles.heatMap}
          renderItem={({ userId, firstName, lastName, scores }) => (
            <Line key={userId} firstName={firstName} lastName={lastName} scores={scores} />
          )}
        />
      </div>
    );
  };

  useEffect(() => {
    if (inView && onReachEnd) {
      onReachEnd();
    }
  }, [inView, onReachEnd]);

  if (isLoading) {
    return <Spin className={styles.initialSpin} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.text}>{t('admin_table_days_ago', { days: '30' })}</Text>
        <Text className={styles.text}>{t('admin_table_yesterday')}</Text>
      </div>
      <div
        className={cx(styles.timeline, {
          [styles.scrollable]:
            seniorsData[0].details.gamesScores.items &&
            seniorsData[0].details.gamesScores.items.length > 4,
        })}
      >
        {renderListWithCell()}
        <div ref={ref} />
      </div>
    </div>
  );
};

export default HeatMap;
