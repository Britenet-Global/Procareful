import { Button } from 'antd';
import { Text, Title } from '@Procareful/ui';
import ErrorIcon from '@mui/icons-material/Error';
import { useStyles } from './styles';

type NotificationAlertProps = {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onConfirm?: () => void;
  className?: string;
};

const NotificationAlert = ({
  title,
  subtitle,
  buttonText,
  onConfirm,
  className,
}: NotificationAlertProps) => {
  const { styles, cx } = useStyles();

  return (
    <div className={cx(styles.container, styles.warning, className)}>
      <div className={styles.headerContainer}>
        <Title level={6}>{title}</Title>
        <ErrorIcon className={styles.icon} />
      </div>
      {subtitle && (
        <div className={styles.descriptionContainer}>
          <Text className={styles.description}>{subtitle}</Text>
        </div>
      )}
      {buttonText && onConfirm && (
        <Button type="primary" danger onClick={onConfirm} className={styles.button}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default NotificationAlert;
