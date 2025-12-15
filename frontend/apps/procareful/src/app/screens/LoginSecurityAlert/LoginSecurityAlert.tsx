import { formatPhoneToDisplay, useTypedTranslation } from '@Procareful/common/lib';
import { ProcarefulAppPathRoutes, LocalStorageKey } from '@Procareful/common/lib/constants';
import { AuthCard, Paragraph, Text } from '@Procareful/ui';
import useSecurityModal from '@ProcarefulApp/hooks/useSecurityModal';
import { useStylish } from '@ProcarefulApp/styles/authFormStyles';
import { useNavigate } from 'react-router-dom';
import { parseMessage } from './helpers';
import { useStyles } from './styles';

const LoginSecurityAlert = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const stylish = useStylish();
  const { isUserBlocked } = useSecurityModal();
  const securityAlertData = localStorage.getItem(LocalStorageKey.SecurityAlertData);
  const { email, message, phone } = parseMessage(securityAlertData || '') || {};
  const navigate = useNavigate();

  const handleRedirectButtonClick = () => {
    localStorage.removeItem(LocalStorageKey.SecurityAlertData);
    navigate(ProcarefulAppPathRoutes.LoginMethod);
  };

  return (
    <AuthCard>
      <AuthCard.Header>{t('senior_title_security_alert')}</AuthCard.Header>
      <div>
        <Paragraph>{message}</Paragraph>
        <div className={styles.institutionDetailsContainer}>
          {email && <Text>{email}</Text>}
          {phone && <Text>{formatPhoneToDisplay(phone)}</Text>}
        </div>
      </div>
      <div className={stylish.buttonsContainer}>
        <AuthCard.SubmitButton disabled={isUserBlocked} onClick={handleRedirectButtonClick}>
          {t('senior_btn_return_to_login')}
        </AuthCard.SubmitButton>
      </div>
      <AuthCard.TermsAndPrivacyPolicy />
    </AuthCard>
  );
};

export default LoginSecurityAlert;
