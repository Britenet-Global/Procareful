import { type PropsWithChildren } from 'react';
import { Title, Text } from '@Procareful/ui';
import { useStyles } from './styles';

const CardTitle = ({ children }: PropsWithChildren) => {
  const { styles } = useStyles();

  return (
    <div className={styles.titleContainer}>
      <Text className={styles.requiredMark}>* </Text>
      <Title level={5}>{children}</Title>
    </div>
  );
};

export default CardTitle;
