import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useNavigate } from 'react-router-dom';
import { Form, Input } from 'antd';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { useUserCredentialsStore } from '@ProcarefulAdmin/store/userCredentialsStore';
import { useStylish } from '@ProcarefulAdmin/styles/authFormStyles';
import type { LoginData } from '@ProcarefulAdmin/typings';
import { loginSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import { useAuthControllerLogin } from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import { AuthCard } from '@Procareful/ui';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useStyles } from './styles';

const Login = () => {
  const stylish = useStylish();
  const navigate = useNavigate();
  const { t } = useTypedTranslation();
  const { styles } = useStyles();

  const { userCredentials, setUserCredentials } = useUserCredentialsStore(state => ({
    userCredentials: state.userCredentials,
    setUserCredentials: state.setUserCredentials,
  }));

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { ...userCredentials },
  });

  const { mutate: login, isPending } = useAuthControllerLogin({
    mutation: {
      onSuccess: () => {
        navigate({
          pathname: PathRoutes.LoginConfirmation,
          search: new URLSearchParams({
            email: getValues('email').toLocaleLowerCase(),
          }).toString(),
        });
      },
    },
  });

  const onSubmit = ({ email, password }: LoginData) => {
    login({
      data: {
        email: email.toLowerCase(),
        password,
      },
    });
    setUserCredentials({ email: email.toLowerCase() });
  };

  return (
    <AuthCard>
      <AuthCard.Header>{t('admin_title_login')}</AuthCard.Header>
      <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className={stylish.form}>
        <FormItem
          control={control}
          name="email"
          label={t('shared_form_email')}
          help={errors.email?.message}
          hasFeedback
        >
          <Input />
        </FormItem>
        <FormItem
          control={control}
          name="password"
          label={t('admin_form_password')}
          help={errors.password?.message}
          hasFeedback
          className={styles.icon}
        >
          <Input.Password
            iconRender={visible =>
              visible ? (
                <VisibilityOutlinedIcon className={styles.icon} />
              ) : (
                <VisibilityOffOutlinedIcon className={styles.icon} />
              )
            }
          />
        </FormItem>
        <AuthCard.RedirectLink to={PathRoutes.ForgotPassword}>
          {t('admin_btn_forgot_my_password')}
        </AuthCard.RedirectLink>
        <AuthCard.SubmitButton loading={isPending}>{t('admin_btn_login')}</AuthCard.SubmitButton>
      </Form>
      <AuthCard.TermsAndPrivacyPolicy />
    </AuthCard>
  );
};

export default Login;
