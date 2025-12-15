import { useSearchParams } from 'react-router-dom';
import { useSignUpStore } from '@ProcarefulAdmin/store/signUpStore';
import { SearchParams } from '@Procareful/common/lib';
import { AuthCard } from '@Procareful/ui';
import EmailForm from './EmailForm';
import PhoneNumberForm from './PhoneNumberForm';
import SetPasswordForm from './SetPasswordForm';
import SuccessCard from './SuccessCard';
import { useStyles } from './styles';

type RegisterSearchParams = SearchParams.PhoneNumber | SearchParams.SetPassword;

const Signup = () => {
  const { styles } = useStyles();
  const [searchParams] = useSearchParams();
  const { email } = useSignUpStore(state => ({
    email: state.email,
  }));
  const { PhoneNumber, SetPassword, SignUpSuccess } = SearchParams;
  const formattedSearchParams = searchParams.get(SearchParams.Step);

  const renderContentByParams = {
    [PhoneNumber]: <PhoneNumberForm userEmail={email} />,
    [SetPassword]: <SetPasswordForm />,
    [SignUpSuccess]: <SuccessCard />,
  };

  return (
    <AuthCard containerClassName={styles.authCardContainer}>
      {formattedSearchParams ? (
        renderContentByParams[formattedSearchParams as RegisterSearchParams]
      ) : (
        <EmailForm />
      )}
    </AuthCard>
  );
};

export default Signup;
