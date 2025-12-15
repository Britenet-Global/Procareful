import { formatPhoneToDisplay } from '@Procareful/common/lib';
import { ProcarefulAppPathRoutes } from '@Procareful/common/lib/constants';
import { useTypedTranslation, useAuthStore } from '@Procareful/common/lib/hooks';
import { AuthCard, Paragraph } from '@Procareful/ui';
import { useStyles } from './styles';

const DefaultSubtitle = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const { phoneNumber } = useAuthStore(state => ({
    phoneNumber: state.phoneNumber,
  }));

  const formattedPhoneNumber = formatPhoneToDisplay(phoneNumber);

  return (
    <div className={styles.container}>
      <Paragraph>{t('senior_inf_confirmation_code_instructions')}</Paragraph>
      <div className={styles.phoneNumberContainer}>
        <Paragraph className={styles.phoneNumber}>{formattedPhoneNumber}</Paragraph>
        <AuthCard.RedirectLink to={ProcarefulAppPathRoutes.LoginWithPhone} state={{ phoneNumber }}>
          {t('shared_btn_change')}
        </AuthCard.RedirectLink>
      </div>
    </div>
  );
};

export default DefaultSubtitle;
