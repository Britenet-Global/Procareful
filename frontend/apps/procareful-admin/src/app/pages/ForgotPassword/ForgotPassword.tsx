import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useNavigate } from 'react-router-dom';
import { type z } from 'zod';
import { Form, Input } from 'antd';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { useStylish } from '@ProcarefulAdmin/styles/authFormStyles';
import { useAuthControllerForgotPassword } from '@Procareful/common/api';
import { emailSchema } from '@Procareful/common/lib';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import { Paragraph, AuthCard } from '@Procareful/ui';
import { useStyles } from './styles';

type ForgotPasswordData = z.infer<typeof emailSchema>;

const ForgotPassword = () => {
  const { styles } = useStyles();
  const stylish = useStylish();
  const { t } = useTypedTranslation();

  const navigate = useNavigate();

  const { mutate: sendEmailToResetPassword, isPending } = useAuthControllerForgotPassword({
    mutation: {
      onSuccess: () => {
        navigate(PathRoutes.ForgotPasswordConfirmation);
      },
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotPasswordData) => {
    sendEmailToResetPassword({ data });
  };

  return (
    <AuthCard>
      <AuthCard.Header>{t('admin_title_forgot_password')}</AuthCard.Header>
      <Paragraph className={styles.forgotPasswordText}>
        {t('admin_inf_forgot_password_instructions')}
      </Paragraph>
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
        <AuthCard.RedirectLink to={PathRoutes.Login}>
          {t('admin_btn_go_back_to_login')}
        </AuthCard.RedirectLink>
        <AuthCard.SubmitButton loading={isPending} className={styles.submitButton}>
          {t('admin_btn_send_reset_instructions')}
        </AuthCard.SubmitButton>
      </Form>
    </AuthCard>
  );
};

export default ForgotPassword;
