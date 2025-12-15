import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useParams, useSearchParams } from 'react-router-dom';
import { type z } from 'zod';
import { Form, Input } from 'antd';
import { useSignUpStore } from '@ProcarefulAdmin/store/signUpStore';
import { useStylish } from '@ProcarefulAdmin/styles/authFormStyles';
import { registerPasswordSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import { useAuthControllerSignup } from '@Procareful/common/api';
import { SearchParams, useNotificationContext, useTypedTranslation } from '@Procareful/common/lib';
import { AuthCard } from '@Procareful/ui';
import { useStyles } from './styles';

type RegisterPasswordData = z.infer<typeof registerPasswordSchema>;

const SetPasswordForm = () => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const { token } = useParams();
  const { notificationApi } = useNotificationContext();
  const stylish = useStylish();
  const [, setSearchParams] = useSearchParams();
  const { email, phoneNumber, resetSignupStore } = useSignUpStore(state => ({
    email: state.email,
    phoneNumber: state.phoneNumber,
    resetSignupStore: state.resetSignupStore,
  }));
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const { mutate: signupUser, isPending } = useAuthControllerSignup({
    mutation: {
      onSuccess: () => {
        resetSignupStore();
        notificationApi.success({
          message: t('admin_form_first_entry_complete_title'),
          description: t('admin_form_first_entry_complete_description'),
        });

        const newSearchParams = new URLSearchParams();
        newSearchParams.set(SearchParams.Step, SearchParams.SignUpSuccess);
        setSearchParams(newSearchParams);
      },
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted, isSubmitSuccessful },
  } = useForm<RegisterPasswordData>({
    resolver: zodResolver(registerPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit: SubmitHandler<RegisterPasswordData> = ({ password }) => {
    signupUser({ data: { email, phone: phoneNumber, password, token: token || '' } });
  };

  const renderPasswordValidation = () => {
    if (isSubmitted && !isSubmitSuccessful) {
      return errors.password?.message;
    }

    if (isPasswordFocused && !isSubmitted) {
      return t('admin_alert_password_hint');
    }
  };

  const isPasswordMessageVisible = !!renderPasswordValidation();

  return (
    <>
      <AuthCard.Header>{t('admin_title_register')}</AuthCard.Header>
      <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className={stylish.form}>
        <div className={cx({ [styles.passwordContainer]: isPasswordMessageVisible })}>
          <FormItem
            control={control}
            name="password"
            label={t('admin_form_password')}
            help={renderPasswordValidation()}
            hasFeedback
          >
            <Input.Password
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
          </FormItem>
        </div>
        <FormItem
          control={control}
          name="confirmPassword"
          label={t('admin_form_confirm_password')}
          help={errors.confirmPassword?.message}
          hasFeedback
        >
          <Input.Password />
        </FormItem>
        <AuthCard.SubmitButton className={styles.button} loading={isPending}>
          {t('admin_btn_sign_up')}
        </AuthCard.SubmitButton>
      </Form>
      <AuthCard.TermsAndPrivacyPolicy i18nKey="admin_inf_register_agreement_text" />
    </>
  );
};

export default SetPasswordForm;
