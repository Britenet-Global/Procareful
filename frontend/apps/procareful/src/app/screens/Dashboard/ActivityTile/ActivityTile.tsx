import { Text } from '@Procareful/ui';
import { type ReactNode } from 'react';
import { Link, type To } from 'react-router-dom';
import { Progress } from 'antd';
import { activityIconVariants, type ActivityType } from '../constants';
import Description from './Description';
import { useStyles } from './styles';

type ActivityTileProps = {
  isCompleted?: boolean;
  type: ActivityType;
  title: string;
  description: string | ReactNode;
  progressActivity?: {
    total: number;
    completed: number;
  };
  redirectTo?: To;
  variant?: 'link' | 'div';
};

const ActivityTile = ({
  isCompleted,
  type,
  title,
  description,
  progressActivity,
  redirectTo,
  variant = 'link',
}: ActivityTileProps) => {
  const { styles, theme } = useStyles();

  const { total = 0, completed = 0 } = progressActivity || {};

  const completedPercentage = (completed / total) * 100;
  const isProgressCompleted = completed === total;

  const renderCommonContent = () => (
    <>
      {activityIconVariants[type]}
      <div className={styles.sideContainer}>
        <div className={styles.textContainer}>
          <Text strong>{title}</Text>
          <Description
            description={description}
            isCompleted={isCompleted}
            isProgressCompleted={isProgressCompleted}
            type={type}
          />
        </div>
        {!isProgressCompleted && progressActivity && (
          <Progress
            className={styles.circularProgress}
            size={theme.fontSize > 16 ? 60 : 50}
            type="circle"
            percent={completedPercentage}
            format={() => `${completed} / ${total}`}
          />
        )}
      </div>
    </>
  );

  if (variant === 'link' && redirectTo) {
    return (
      <Link to={redirectTo} className={styles.card}>
        {renderCommonContent()}
      </Link>
    );
  }

  return <div className={styles.card}>{renderCommonContent()}</div>;
};

export default ActivityTile;
