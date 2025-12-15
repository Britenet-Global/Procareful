import { Text } from '@Procareful/ui';
import { activityIconVariants } from '../constants';
import { useStyles } from './styles';

type NoDataPlaceholderTileProps = {
  type: 'game' | 'strength' | 'book';
  title: string;
  description: string;
};

const NoDataPlaceholderTile = ({ type, description, title }: NoDataPlaceholderTileProps) => {
  const { styles } = useStyles();

  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>{activityIconVariants[type]}</div>
      <Text strong>{title}</Text>
      <Text>{description}</Text>
    </div>
  );
};

export default NoDataPlaceholderTile;
