import { type Key, useTypedTranslation } from '@Procareful/common/lib';
import { Text, Title } from '@Procareful/ui';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useStyles } from './styles';

type NoDataPlaceholderProps = {
  title: string;
  description: string;
  className?: string;
};

const NoDataPlaceholder = ({ title, description, className }: NoDataPlaceholderProps) => {
  const { cx, styles } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <div className={cx(styles.container, className)}>
      <BarChartIcon className={styles.icon} />
      <Title level={6}>{t(title as Key)}</Title>
      <Text className={styles.description}>{t(description as Key)}</Text>
    </div>
  );
};

export default NoDataPlaceholder;
