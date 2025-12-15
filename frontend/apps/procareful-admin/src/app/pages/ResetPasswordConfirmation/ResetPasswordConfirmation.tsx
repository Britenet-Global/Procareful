import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import { Paragraph, AuthCard } from '@Procareful/ui';
import { useStyles } from './styles';

const supportEmail = 'support.address@email.com';

const ResetPasswordConfirmation = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const { t } = useTypedTranslation();

  return (
    <AuthCard containerClassName={styles.cardContainer}>
      <AuthCard.Header>{t('admin_title_reset_password_success')}</AuthCard.Header>
      <div className={styles.container}>
        <div className={styles.confirmationTextContainer}>
          <Paragraph className={styles.confirmationText}>
            <Trans>
              {t('admin_inf_reset_password_confirmation', {
                supportEmail,
              })}
            </Trans>
          </Paragraph>
        </div>
        <AuthCard.SubmitButton onClick={() => navigate(PathRoutes.Login)}>
          {t('admin_btn_login')}
        </AuthCard.SubmitButton>
      </div>
    </AuthCard>
  );
};

export default ResetPasswordConfirmation;
