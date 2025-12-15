import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useSearchParams } from 'react-router-dom';
import { type z } from 'zod';
import { Form, Input } from 'antd';
import { useSignUpStore } from '@ProcarefulAdmin/store/signUpStore';
import { useStylish } from '@ProcarefulAdmin/styles/authFormStyles';
import { emailSchema, SearchParams, useTypedTranslation } from '@Procareful/common/lib';
import { AuthCard } from '@Procareful/ui';

type RegisterEmailData = z.infer<typeof emailSchema>;

const EmailForm = () => {
  const stylish = useStylish();
  const { t } = useTypedTranslation();
  const { email, setEmail } = useSignUpStore(state => ({
    email: state.email,
    setEmail: state.setEmail,
  }));
  const [, setSearchParams] = useSearchParams();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterEmailData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email },
  });

  const onSubmit: SubmitHandler<RegisterEmailData> = data => {
    setEmail(data.email);
    const searchParams = new URLSearchParams();
    searchParams.set(SearchParams.Step, SearchParams.PhoneNumber);
    setSearchParams(searchParams.toString());
  };

  return (
    <>
      <AuthCard.Header>{t('admin_title_register')}</AuthCard.Header>
      <AuthCard.Description description="admin_form_register_email_description" />
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
        <AuthCard.SubmitButton className={stylish.submitButton}>
          {t('shared_btn_continue')}
        </AuthCard.SubmitButton>
      </Form>
      <AuthCard.TermsAndPrivacyPolicy i18nKey="admin_inf_register_agreement_text"></AuthCard.TermsAndPrivacyPolicy>
    </>
  );
};

export default EmailForm;
