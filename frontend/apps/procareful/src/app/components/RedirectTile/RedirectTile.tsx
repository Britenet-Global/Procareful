import { Paragraph, Text } from '@Procareful/ui';
import CheckIcon from '@mui/icons-material/Check';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link, type To } from 'react-router-dom';
import { useStyles } from './styles';

type RedirectTileProps = {
  title: string;
  header?: string;
  subtitle?: string;
  isCompleted?: boolean;
  redirectTo?: To;
};

export const RedirectTile = ({
  title,
  header,
  isCompleted,
  subtitle,
  redirectTo,
}: RedirectTileProps) => {
  const { styles, cx } = useStyles();

  if (!redirectTo) {
    return;
  }

  return (
    <Link className={cx(styles.card, { [styles.singleLinePadding]: !isCompleted })} to={redirectTo}>
      <div className={styles.sideContainer}>
        <div className={styles.textContainer}>
          {header && <Text className={styles.header}>{header}</Text>}
          <Text strong>{title}</Text>
          {subtitle && (
            <div className={styles.completedContainer}>
              <Paragraph>{subtitle}</Paragraph>
              {isCompleted && <CheckIcon className={styles.checkIcon} />}
            </div>
          )}
        </div>
      </div>
      <div className={styles.imageWrapper}>
        <NavigateNextIcon className={styles.icon} />
      </div>
    </Link>
  );
};
