import type { ReactNode } from 'react';
import { type Key, useTypedTranslation } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import { useStyles } from './styles';

type DescriptionProps = {
  description: Key;
  children?: ReactNode;
};

const Description = ({ description, children }: DescriptionProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <div className={styles.container}>
      <Text>{t(description)}</Text>
      {children}
    </div>
  );
};

export default Description;
