import { type ErrorResponse, useAuthControllerLoginViaPhone } from '@Procareful/common/api';
import {
  ProcarefulAppPathRoutes,
  LocalStorageKey,
  SessionStorageKey,
} from '@Procareful/common/lib/constants';
import { useTypedTranslation, useAuthStore } from '@Procareful/common/lib/hooks';
import {
  confirmationCodeSchema,
  formatConfirmationCode,
  setBackendFieldErrors,
} from '@Procareful/common/lib/utils';
import { MaskedInput, AuthCard } from '@Procareful/ui';
import { useStylish } from '@ProcarefulApp/styles/authFormStyles';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useNavigate } from 'react-router-dom';
import { type z } from 'zod';
import { Button, Form } from 'antd';
import DefaultSubtitle from './DefaultSubtitle';
import FailureSubtitle from './FailureSubtitle';

type LoginWithPhoneConfirmationCodeData = z.infer<typeof confirmationCodeSchema>;

const LoginWithPhoneConfirmationCode = () => {
  const stylish = useStylish();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const { phoneNumber, setAuthState, setUserPhoneNumber } = useAuthStore(state => ({
    phoneNumber: state.phoneNumber,
    setAuthState: state.setAuthState,
    setUserPhoneNumber: state.setUserPhoneNumber,
  }));
  const {
    mutate: handleLoginViaPhone,
    isPending: isLoginViaPhonePending,
    isSuccess: isLoginViaPhoneSuccess,
  } = useAuthControllerLoginViaPhone({
    mutation: {
      onSuccess: () => {
        localStorage.setItem(LocalStorageKey.IsAuthenticated, 'true');
        sessionStorage.removeItem(SessionStorageKey.PhoneNumber);
        setAuthState({ isAuth: true, isLoading: false });
        navigate(ProcarefulAppPathRoutes.Onboarding);
      },
      onError: (error: ErrorResponse) => {
        setBackendFieldErrors(error, setError);

        if (
          error?.response?.data &&
          'error' in error.response.data &&
          typeof error.response.data.details === 'string'
        ) {
          localStorage.setItem(LocalStorageKey.SecurityAlertData, error.response.data.details);
          localStorage.setItem(LocalStorageKey.UserBlockStartDate, dayjs().toString());
          navigate(ProcarefulAppPathRoutes.LoginSecurityAlert);
        }
      },
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitted, isSubmitSuccessful },
  } = useForm<LoginWithPhoneConfirmationCodeData>({
    resolver: zodResolver(confirmationCodeSchema),
    defaultValues: { code: '' },
  });

  const handleFormSubmit: SubmitHandler<LoginWithPhoneConfirmationCodeData> = ({ code }) => {
    handleLoginViaPhone({
      data: {
        phone: phoneNumber,
        pin: code.replace(/(\d{3})-(\d{3})/, '$1$2'),
      },
    });
  };

  const hasCodeSubmissionFailed = isSubmitted && isSubmitSuccessful && !isLoginViaPhoneSuccess;

  useEffect(() => {
    const cachedPhoneNumber = sessionStorage.getItem(SessionStorageKey.PhoneNumber);

    if (!phoneNumber.length && cachedPhoneNumber) {
      setUserPhoneNumber(cachedPhoneNumber);
    }
  }, [phoneNumber.length, setUserPhoneNumber]);

  return (
    <AuthCard>
      <AuthCard.Header>
        {hasCodeSubmissionFailed
          ? t('senior_title_invalid_code')
          : t('senior_title_confirmation_code')}
      </AuthCard.Header>
      {hasCodeSubmissionFailed ? <FailureSubtitle /> : <DefaultSubtitle />}
      <Form onFinish={handleSubmit(handleFormSubmit)} layout="vertical" className={stylish.form}>
        <FormItem control={control} name="code" help={errors.code?.message} hasFeedback>
          <MaskedInput
            placeholder={t('shared_form_enter_code')}
            maskFunction={formatConfirmationCode}
          />
        </FormItem>
        <div className={stylish.buttonsContainer}>
          <AuthCard.SubmitButton loading={isLoginViaPhonePending}>
            {t('shared_btn_continue')}
          </AuthCard.SubmitButton>
          <Button
            type="default"
            className={stylish.alternativeButton}
            onClick={() => {
              sessionStorage.removeItem(SessionStorageKey.PhoneNumber);
              navigate(ProcarefulAppPathRoutes.LoginMethod);
            }}
          >
            {t('shared_btn_alternative_login')}
          </Button>
        </div>
      </Form>
      <AuthCard.TermsAndPrivacyPolicy />
    </AuthCard>
  );
};

export default LoginWithPhoneConfirmationCode;
