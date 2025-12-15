import { useNavigate } from 'react-router-dom';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import { Paragraph, AuthCard } from '@Procareful/ui';
import { useStyles } from './styles';

const ForgotPasswordConfirmation = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const { t } = useTypedTranslation();

  return (
    <AuthCard containerClassName={styles.cardContainer}>
      <AuthCard.Header>{t('admin_title_forgot_password')}</AuthCard.Header>
      <div className={styles.container}>
        <div className={styles.confirmationTextContainer}>
          <Paragraph className={styles.confirmationText}>
            {t('admin_inf_forgot_password_confirmation')}
          </Paragraph>
        </div>
        <AuthCard.SubmitButton onClick={() => navigate(PathRoutes.Login)}>
          {t('admin_btn_login')}
        </AuthCard.SubmitButton>
      </div>
    </AuthCard>
  );
};

export default ForgotPasswordConfirmation;
