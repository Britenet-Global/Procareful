import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import type { SeniorActivity } from '@ProcarefulAdmin/typings';
import { truncateSentence } from '@Procareful/common/lib/utils/textFormatters';
import { Text } from '@Procareful/ui';
import { useStyles } from './styles';

const TableActivityCell = ({ title, exerciseType, type, duration }: Omit<SeniorActivity, 'id'>) => {
  const { styles, cx } = useStyles();

  return (
    <StyledCard className={styles.container} shadow={false}>
      <div className={cx(styles.accentColor, styles[type])} />
      <div className={styles.columnContainer}>
        <Text className={styles.headingText}>{title}</Text>
        <Text className={styles.descriptionText}>{truncateSentence(exerciseType, 20)}</Text>
        {duration && <Text className={styles.durationText}>{duration}</Text>}
      </div>
    </StyledCard>
  );
};

export default TableActivityCell;
