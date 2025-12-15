import { TimeFormat, useTypedTranslation } from '@Procareful/common/lib';
import { Title, Text } from '@Procareful/ui';
import dayjs from 'dayjs';
import { useStyles } from './styles';

type SubtitleProps = {
  title?: string;
  createdAt?: string;
};

const Subtitle = ({ title, createdAt }: SubtitleProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <div className={styles.container}>
      <Text>{t('senior_title_personal_growth_challenge')}</Text>
      {title && <Title level={4}>{title}</Title>}
      {createdAt && (
        <Text className={styles.date}>{dayjs(createdAt).format(TimeFormat.DATE_FORMAT)}</Text>
      )}
    </div>
  );
};

export default Subtitle;
