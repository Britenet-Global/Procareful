import { Tag } from 'antd';
import { Title } from '@Procareful/ui';
import { useStyles } from './styles';

type TargetWordTagProps = {
  targetWord: string;
};

export const TargetWordTag = ({ targetWord }: TargetWordTagProps) => {
  const { styles } = useStyles();

  return (
    <Tag className={styles.tag}>
      <Title level={2}>{targetWord}</Title>
    </Tag>
  );
};
