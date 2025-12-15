import dayjs from 'dayjs';
import { Progress } from 'antd';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import { Title, Text } from '@Procareful/ui';
import { useStyles } from './styles';

type UserDailyTaskCompletionProps = {
  completedParticipantsCount: number;
  participantCount: number;
};

const PERCENT_CONVERSION_FACTOR = 100;

const UserDailyTaskCompletion = ({
  completedParticipantsCount,
  participantCount,
}: UserDailyTaskCompletionProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const userTaskCompletionRate =
    (completedParticipantsCount / participantCount) * PERCENT_CONVERSION_FACTOR;
  const formattedDate = dayjs(new Date()).format('D MMM');

  return (
    <StyledCard className={styles.cardContainer} fullHeight>
      <div className={styles.container}>
        <Progress
          type="circle"
          percent={userTaskCompletionRate}
          format={_ => `${completedParticipantsCount} / ${participantCount}`}
          strokeWidth={11}
          className={styles.progress}
        />
        <div className={styles.textContainer}>
          <Title level={5}>{t('admin_title_completed_task')}</Title>
          <Text className={styles.currentDate}>{formattedDate}</Text>
        </div>
      </div>
    </StyledCard>
  );
};

export default UserDailyTaskCompletion;
