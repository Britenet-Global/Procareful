import { ProcarefulAppPathRoutes } from '@Procareful/common/lib';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'antd';
import { useStyles } from './styles';

export const ErrorScreen = () => {
  const { styles } = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(ProcarefulAppPathRoutes.Dashboard);
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <span className={styles.icon}>⚠</span>
        <span>{t('senior_inf_error_boundary_title')}</span>
        <Button size="large" type="primary" className={styles.button} onClick={handleNavigate}>
          {t('senior_btn_home')}
        </Button>
      </Card>
    </div>
  );
};
