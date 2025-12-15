import { Text } from '@Procareful/ui';
import { iconVariants } from './constants';
import { useStyles } from './styles';

type AmountTileProps = {
  title: string;
  amount: number;
  iconType: 'single' | 'double' | 'multi';
};

const AmountTile = ({ title, amount, iconType }: AmountTileProps) => {
  const { styles } = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <Text className={styles.text} strong>
          {title}
        </Text>
        <Text className={styles.amount} strong>
          {amount}
        </Text>
      </div>
      {iconVariants[iconType]}
    </div>
  );
};

export default AmountTile;
