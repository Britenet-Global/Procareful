import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { Trans } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { type z } from 'zod';
import { Checkbox, Form } from 'antd';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { useUserCredentialsStore } from '@ProcarefulAdmin/store/userCredentialsStore';
import { useStylish } from '@ProcarefulAdmin/styles/authFormStyles';
import { getInitialRoute } from '@ProcarefulAdmin/utils/getInitialRoute';
import { loginConfirmationSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import {
  getAuthControllerGetMeQueryKey,
  useAuthControllerResendVerificationCode,
  useAuthControllerValidateVerificationCode,
} from '@Procareful/common/api';
import {
  useNotificationContext,
  useTypedTranslation,
  formatConfirmationCode,
  INPUT_PLACEHOLDERS,
} from '@Procareful/common/lib';
import { Paragraph, AuthCard, MaskedInput } from '@Procareful/ui';
import { useStyles } from './styles';

type LoginConfirmationData = z.infer<typeof loginConfirmationSchema>;

const LoginConfirmation = () => {
  const { styles } = useStyles();
  const stylish = useStylish();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const { notificationApi } = useNotificationContext();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const userEmail = searchParams.get('email');
  const { userCredentials } = useUserCredentialsStore(state => ({
    userCredentials: state.userCredentials,
  }));
  const { email } = userCredentials || {};

  const { mutate: confirmCode, isPending } = useAuthControllerValidateVerificationCode({
    mutation: {
      onSuccess: data => {
        const { first_login: hasLoggedInBefore, roles } = data.details.admin || {};
        queryClient.setQueryData(getAuthControllerGetMeQueryKey(), () => data);
        const initialRoute = getInitialRoute(true, hasLoggedInBefore, roles);

        navigate(initialRoute);
      },
    },
  });

  const { mutate: resendVerificationCode } = useAuthControllerResendVerificationCode({
    mutation: {
      onSuccess: () => {
        notificationApi.success({
          message: t('admin_title_code_sent'),
          description: t('admin_inf_code_sent'),
        });
      },
    },
  });

  const onSubmit = ({ code, rememberMe }: LoginConfirmationData) => {
    confirmCode({
      data: {
        code: code.replace('-', ''),
        rememberMe,
      },
    });
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginConfirmationData>({
    resolver: zodResolver(loginConfirmationSchema),
    defaultValues: { code: '', rememberMe: false },
  });

  useEffect(() => {
    if (!email) {
      navigate(PathRoutes.Login);
    }
  }, [email, navigate]);

  return (
    <AuthCard containerClassName={styles.container}>
      <AuthCard.Header>{t('admin_title_login_confirmation')}</AuthCard.Header>
      <Paragraph>
        <Trans>
          {t('admin_inf_login_confirmation', {
            email: userEmail || '',
          })}
        </Trans>
      </Paragraph>
      <AuthCard.TextButton
        onClick={() => resendVerificationCode()}
        className={styles.resendCodeButton}
      >
        {t('admin_btn_send_code_again')}
      </AuthCard.TextButton>
      <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className={stylish.form}>
        <FormItem
          control={control}
          name="code"
          label={t('shared_form_code')}
          help={errors.code?.message}
          hasFeedback
        >
          <MaskedInput
            placeholder={INPUT_PLACEHOLDERS.VERIFICATION_CODE}
            maskFunction={formatConfirmationCode}
            autoFocus
          />
        </FormItem>
        <FormItem
          control={control}
          name="rememberMe"
          help={errors.rememberMe?.message}
          hasFeedback
          valuePropName="checked"
        >
          <Checkbox>{t('admin_form_remember_me')}</Checkbox>
        </FormItem>
        <AuthCard.SubmitButton loading={isPending}>{t('admin_btn_login')}</AuthCard.SubmitButton>
      </Form>
      <AuthCard.TermsAndPrivacyPolicy />
    </AuthCard>
  );
};

export default LoginConfirmation;
