import { type ErrorResponse, useAuthControllerGeneratePinForEmail } from '@Procareful/common/api';
import {
  ProcarefulAppPathRoutes,
  LocalStorageKey,
  SessionStorageKey,
} from '@Procareful/common/lib/constants';
import { useAuthStore, useTypedTranslation } from '@Procareful/common/lib/hooks';
import { emailSchema, setBackendFieldErrors } from '@Procareful/common/lib/utils';
import { AuthCard, Paragraph } from '@Procareful/ui';
import { useStylish } from '@ProcarefulApp/styles/authFormStyles';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { type z } from 'zod';
import { Button, Form, Input } from 'antd';

type LoginWithEmailData = z.infer<typeof emailSchema>;

const LoginWithEmail = () => {
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.email;
  const stylish = useStylish();
  const { setUserEmail } = useAuthStore(state => ({
    setUserEmail: state.setUserEmail,
  }));
  const { mutate: handleGeneratePin, isPending: isGeneratePinPending } =
    useAuthControllerGeneratePinForEmail({
      mutation: {
        onSuccess: (_, { data: { email } }) => {
          sessionStorage.setItem(SessionStorageKey.Email, email);
          navigate(ProcarefulAppPathRoutes.LoginWithEmailConfirmationCode);
        },
        onError: (error: ErrorResponse) => {
          setBackendFieldErrors(error, setError);
        },
      },
    });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginWithEmailData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: userEmail || '' },
  });

  const onSubmit: SubmitHandler<LoginWithEmailData> = ({ email }) => {
    setUserEmail(email.toLocaleLowerCase());
    handleGeneratePin({ data: { email: email.toLocaleLowerCase() } });
    localStorage.setItem(LocalStorageKey.GeneratedCodeStartDate, dayjs().toString());
  };

  useEffect(() => {
    sessionStorage.removeItem(SessionStorageKey.Email);
  }, []);

  return (
    <AuthCard>
      <AuthCard.Header>{t('senior_title_login_with_email')}</AuthCard.Header>
      <Paragraph className={stylish.paragraph}>
        {t('senior_inf_login_with_email_instructions')}
      </Paragraph>
      <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className={stylish.form}>
        <FormItem control={control} name="email" help={errors.email?.message} hasFeedback>
          <Input placeholder={t('shared_form_enter_email')} />
        </FormItem>
        <div className={stylish.buttonsContainer}>
          <AuthCard.SubmitButton loading={isGeneratePinPending}>
            {t('shared_btn_send_code')}
          </AuthCard.SubmitButton>
          <Button
            type="default"
            className={stylish.alternativeButton}
            onClick={() => navigate(ProcarefulAppPathRoutes.LoginMethod)}
          >
            {t('shared_btn_alternative_login')}
          </Button>
        </div>
      </Form>
      <AuthCard.TermsAndPrivacyPolicy />
    </AuthCard>
  );
};

export default LoginWithEmail;
