import { useTypedTranslation } from '@Procareful/common/lib';
import { Paragraph } from '@Procareful/ui';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { useStyles } from './styles';

const Placeholder = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <DashboardOutlinedIcon />
      </div>
      <div className={styles.centered}>
        <Paragraph>{t('senior_inf_no_post_placeholder_info')}</Paragraph>
      </div>
    </div>
  );
};

export default Placeholder;
