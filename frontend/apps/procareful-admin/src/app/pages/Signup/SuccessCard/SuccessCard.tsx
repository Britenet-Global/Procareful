import { useNavigate } from 'react-router-dom';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { useTypedTranslation } from '@Procareful/common/lib';
import { AuthCard, Paragraph } from '@Procareful/ui';
import { useStyles } from './styles';

const SuccessCard = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();

  return (
    <>
      <AuthCard.Header>{t('admin_title_you_are_all_set')}</AuthCard.Header>
      <Paragraph>{t('admin_inf_you_are_all_set_subtitle')}</Paragraph>
      <AuthCard.SubmitButton
        className={styles.button}
        onClick={() => navigate(PathRoutes.InitialPath)}
      >
        {t('admin_btn_login')}
      </AuthCard.SubmitButton>
      <AuthCard.TermsAndPrivacyPolicy />
    </>
  );
};

export default SuccessCard;
