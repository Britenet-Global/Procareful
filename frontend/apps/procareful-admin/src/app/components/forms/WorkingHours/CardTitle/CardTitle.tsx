import { useTypedTranslation } from '@Procareful/common/lib';
import { Text, Title } from '@Procareful/ui';
import { useStyles } from './styles';

const CardTitle = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <div className={styles.container}>
      <Title level={5}>{t('admin_inf_working_hours')}</Title>
      <Text>{t('admin_inf_set_your_availability_for_contact')}</Text>
    </div>
  );
};

export default CardTitle;
