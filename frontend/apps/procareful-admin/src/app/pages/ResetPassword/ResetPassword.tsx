import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { type z } from 'zod';
import { Form, Input } from 'antd';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { resetPasswordSchema } from '@ProcarefulAdmin/utils';
import { useAuthControllerResetPassword } from '@Procareful/common/api';
import { useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { Paragraph, AuthCard } from '@Procareful/ui';
import { useStyles } from './styles';

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const { t } = useTypedTranslation();
  const { styles, cx } = useStyles();
  const stylish = useStylish();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const linkId = searchParams.get(SearchParams.Id);

  const { mutate: resetPassword, isPending } = useAuthControllerResetPassword({
    mutation: {
      onSuccess: () => {
        navigate(PathRoutes.ResetPasswordConfirmation);
      },
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted, isSubmitSuccessful },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = ({ password }: ResetPasswordData) => {
    resetPassword({
      params: { linkId: linkId || '' },
      data: {
        newPassword: password,
      },
    });
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
    <AuthCard>
      <AuthCard.Header>{t('admin_title_reset_password')}</AuthCard.Header>
      <Paragraph className={styles.forgotPasswordText}>
        {t('admin_inf_reset_password_instructions')}
      </Paragraph>
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
          label={t('admin_form_confirm_new_password')}
          help={errors.confirmPassword?.message}
          hasFeedback
        >
          <Input.Password />
        </FormItem>
        <AuthCard.SubmitButton loading={isPending}>
          {t('shared_btn_continue')}
        </AuthCard.SubmitButton>
      </Form>
      <AuthCard.TermsAndPrivacyPolicy />
    </AuthCard>
  );
};

export default ResetPassword;
