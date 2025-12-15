import {
  type ErrorResponse,
  useAuthControllerGeneratePinForEmail,
  useAuthControllerLoginViaEmail,
} from '@Procareful/common/api';
import {
  ProcarefulAppPathRoutes,
  LocalStorageKey,
  SessionStorageKey,
} from '@Procareful/common/lib/constants';
import {
  useAuthStore,
  useNotificationContext,
  useTypedTranslation,
} from '@Procareful/common/lib/hooks';
import {
  confirmationCodeSchema,
  formatConfirmationCode,
  setBackendFieldErrors,
} from '@Procareful/common/lib/utils';
import { MaskedInput, AuthCard, Paragraph } from '@Procareful/ui';
import { useStylish } from '@ProcarefulApp/styles/authFormStyles';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { type z } from 'zod';
import { Button, Form } from 'antd';
import ResendCodeTimer from './ResendCodeTimer';
import { useStyles } from './styles';

type LoginWithPhoneConfirmationCodeData = z.infer<typeof confirmationCodeSchema>;
type ResendCodeTimerHandles = {
  resetTimer: () => void;
};

const LoginWithEmailConfirmationCode = () => {
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const { styles, cx } = useStyles();
  const stylish = useStylish();
  const { notificationApi } = useNotificationContext();
  const timerRef = useRef<ResendCodeTimerHandles>(null);
  const nowDate = dayjs();
  const startTimerDate = dayjs(localStorage.getItem(LocalStorageKey.GeneratedCodeStartDate));
  const { email, setAuthState, setUserEmail } = useAuthStore(state => ({
    email: state.email,
    setAuthState: state.setAuthState,
    setUserEmail: state.setUserEmail,
  }));
  const { mutate: handleGeneratePin } = useAuthControllerGeneratePinForEmail({
    mutation: {
      onSuccess: () => {
        notificationApi.success({
          message: t('admin_title_code_sent'),
          description: t('admin_inf_code_sent'),
        });
      },
      onError: () => {
        notificationApi.error({
          message: t('admin_title_alert_error'),
          description: t('admin_inf_alert_title'),
        });
      },
    },
  });

  const {
    mutate: handleLoginViaEmail,
    isPending: isLoginViaEmailLoading,
    isSuccess: isLoginViaEmailSuccess,
  } = useAuthControllerLoginViaEmail({
    mutation: {
      onSuccess: () => {
        localStorage.setItem(LocalStorageKey.IsAuthenticated, 'true');
        sessionStorage.removeItem(SessionStorageKey.Email);
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

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitted, isSubmitSuccessful },
  } = useForm<LoginWithPhoneConfirmationCodeData>({
    resolver: zodResolver(confirmationCodeSchema),
    defaultValues: { code: '' },
  });

  const hasCodeSubmissionFailed =
    isSubmitted && isSubmitSuccessful && !isLoginViaEmailSuccess && !isLoginViaEmailLoading;

  const onSubmit: SubmitHandler<LoginWithPhoneConfirmationCodeData> = ({ code }) => {
    handleLoginViaEmail({ data: { email, pin: code.replace(/(\d{3})-(\d{3})/, '$1$2') } });
  };

  const handleResetClick = () => {
    handleGeneratePin({ data: { email } });
    timerRef?.current?.resetTimer();
  };

  useEffect(() => {
    const cachedEmail = sessionStorage.getItem(SessionStorageKey.Email);

    if (!email.length && cachedEmail) {
      setUserEmail(cachedEmail);
    }
  }, [email.length, setUserEmail]);

  return (
    <AuthCard containerClassName={cx({ [styles.cardContainer]: hasCodeSubmissionFailed })}>
      <AuthCard.Header>
        {hasCodeSubmissionFailed ? t('senior_title_invalid_code') : t('shared_form_code')}
      </AuthCard.Header>
      <div className={styles.subtitleContainer}>
        {hasCodeSubmissionFailed && (
          <Paragraph>{t('senior_inf_invalid_code_instruction')}</Paragraph>
        )}
        <Paragraph
          className={cx(styles.paragraph, { [styles.greyOutText]: hasCodeSubmissionFailed })}
        >
          <Trans>
            {t('shared_inf_verification_code', {
              email,
            })}
          </Trans>
          <br />
          <AuthCard.RedirectLink
            to={ProcarefulAppPathRoutes.LoginWithEmail}
            className={styles.changeEmailLink}
            state={{ email }}
          >
            {t('shared_btn_change')}
          </AuthCard.RedirectLink>
        </Paragraph>
      </div>
      <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className={stylish.form}>
        <FormItem control={control} name="code" help={errors.code?.message} hasFeedback>
          <MaskedInput
            placeholder={t('shared_form_enter_code')}
            maskFunction={formatConfirmationCode}
          />
        </FormItem>
        <AuthCard.TextButton
          disabled={isTimerRunning}
          className={cx(styles.resendCodeButtonContainer, {
            [styles.resendCodeButtonContainerDisabled]: isTimerRunning,
          })}
          onClick={handleResetClick}
        >
          <ResendCodeTimer
            ref={timerRef}
            onRunningStateChange={setIsTimerRunning}
            initialTime={nowDate.diff(startTimerDate, 'seconds')}
            className={cx(styles.resendCodeButtonContent, {
              [styles.resendCodeButtonContentDisabled]: isTimerRunning,
            })}
          >
            {t('senior_btn_resend_code')}
          </ResendCodeTimer>
        </AuthCard.TextButton>
        <div className={stylish.buttonsContainer}>
          <AuthCard.SubmitButton loading={isLoginViaEmailLoading}>
            {t('shared_btn_continue')}
          </AuthCard.SubmitButton>
          <Button
            type="default"
            className={stylish.alternativeButton}
            onClick={() => {
              sessionStorage.removeItem(SessionStorageKey.Email);
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

export default LoginWithEmailConfirmationCode;
