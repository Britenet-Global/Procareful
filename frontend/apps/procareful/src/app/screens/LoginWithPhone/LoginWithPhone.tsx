import { type ErrorResponse, useAuthControllerGeneratePinForPhone } from '@Procareful/common/api';
import { ProcarefulAppPathRoutes, SessionStorageKey } from '@Procareful/common/lib/constants';
import { useTypedTranslation, useAuthStore } from '@Procareful/common/lib/hooks';
import { phoneSchema, setBackendFieldErrors } from '@Procareful/common/lib/utils';
import { AuthCard, Paragraph, PhoneNumberInput } from '@Procareful/ui';
import { useStylish } from '@ProcarefulApp/styles/authFormStyles';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { type z } from 'zod';
import { Button, Form } from 'antd';

type LoginWithPhoneData = z.infer<typeof phoneSchema>;

const LoginWithPhone = () => {
  const stylish = useStylish();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const userPhoneNumber = location.state?.phoneNumber;

  const { setUserPhoneNumber } = useAuthStore(state => ({
    setUserPhoneNumber: state.setUserPhoneNumber,
  }));

  const { mutate: handleGeneratePin, isPending } = useAuthControllerGeneratePinForPhone({
    mutation: {
      onSuccess: (_, { data: { phone } }) => {
        sessionStorage.setItem(SessionStorageKey.PhoneNumber, phone);
        navigate(ProcarefulAppPathRoutes.LoginWithPhoneConfirmationCode);
      },
      onError: (error: ErrorResponse) => {
        setBackendFieldErrors(error, setError);
      },
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginWithPhoneData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: userPhoneNumber || '' },
  });

  const onSubmit: SubmitHandler<LoginWithPhoneData> = ({ phoneNumber }) => {
    setUserPhoneNumber(phoneNumber);
    handleGeneratePin({ data: { phone: phoneNumber } });
  };

  useEffect(() => {
    sessionStorage.removeItem(SessionStorageKey.PhoneNumber);
  }, []);

  return (
    <AuthCard>
      <AuthCard.Header>{t('shared_title_login_with_phone')}</AuthCard.Header>
      <Paragraph>{t('shared_inf_login_with_phone_instructions')}</Paragraph>
      <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className={stylish.form}>
        <FormItem
          control={control}
          name="phoneNumber"
          help={errors.phoneNumber?.message}
          hasFeedback
          preserve
        >
          <PhoneNumberInput className={stylish.phoneInput} />
        </FormItem>
        <div className={stylish.buttonsContainer}>
          <AuthCard.SubmitButton loading={isPending}>
            {t('shared_btn_continue')}
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

export default LoginWithPhone;
