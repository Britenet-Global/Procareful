import { forwardRef } from 'react';
import { Tooltip } from 'antd';
import { Text } from '@Procareful/ui';
import { useStyles } from '../styles';

type SeniorNameProps = {
  name: string;
};

const SeniorName = forwardRef<HTMLSpanElement, SeniorNameProps>(({ name }, ref) => {
  const { styles } = useStyles();

  return (
    <Tooltip title={<Text className={styles.tooltipText}>{name}</Text>} color="white">
      <Text ref={ref} className={styles.seniorName}>
        {name}
      </Text>
    </Tooltip>
  );
});

SeniorName.displayName = 'SeniorName';

export default SeniorName;
