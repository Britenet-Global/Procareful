import { ProcarefulAppPathRoutes } from '@Procareful/common/lib/constants';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import { AuthCard } from '@Procareful/ui';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Link } from 'react-router-dom';
import LoginOptionCard from './LoginOptionCard';
import { useStyles } from './styles';

const LoginMethod = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  return (
    <AuthCard>
      <AuthCard.Header>{t('senior_title_select_login_method')}</AuthCard.Header>
      <div className={styles.cardsContainer}>
        <Link to={ProcarefulAppPathRoutes.LoginWithPhone}>
          <LoginOptionCard
            title={t('senior_title_login_with_assistance')}
            subtitle={t('senior_inf_login_with_assistance_instruction')}
            icon={PeopleAltOutlinedIcon}
          />
        </Link>
        <Link to={ProcarefulAppPathRoutes.LoginWithEmail}>
          <LoginOptionCard
            title={t('senior_title_login_without_assistance')}
            subtitle={t('senior_inf_login_without_assistance_instruction')}
            icon={PersonOutlineOutlinedIcon}
          />
        </Link>
      </div>
      <AuthCard.TermsAndPrivacyPolicy />
    </AuthCard>
  );
};

export default LoginMethod;
