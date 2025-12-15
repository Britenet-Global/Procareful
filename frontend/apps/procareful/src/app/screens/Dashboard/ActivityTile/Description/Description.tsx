import { truncateSentence } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import type { ReactNode } from 'react';
import { type ActivityType } from '../../constants';
import CompletedInfo from '../CompletedInfo';
import { useStyles } from './styles';

type DescriptionProps = {
  type: ActivityType;
  description: ReactNode;
  isCompleted?: boolean;
  isProgressCompleted?: boolean;
};

const Description = ({ type, description, isCompleted, isProgressCompleted }: DescriptionProps) => {
  const { styles } = useStyles();

  const isDescriptionString = typeof description === 'string';

  if (type === 'book' || type === 'diary') {
    return (
      <Text className={styles.description}>
        {isDescriptionString ? truncateSentence(description as string, 80) : description}
      </Text>
    );
  }

  if (
    (!isCompleted && isDescriptionString && typeof isCompleted === 'boolean') ||
    !isProgressCompleted ||
    (!isCompleted && typeof isCompleted === 'boolean')
  ) {
    return (
      <Text className={styles.description}>{truncateSentence(description as string, 80)}</Text>
    );
  }

  return <CompletedInfo type={type} />;
};

export default Description;
