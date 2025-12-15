import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useParams, useSearchParams } from 'react-router-dom';
import type { z } from 'zod';
import { Form } from 'antd';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { useSignUpStore } from '@ProcarefulAdmin/store/signUpStore';
import { useStylish } from '@ProcarefulAdmin/styles/authFormStyles';
import { registerPhoneSchema } from '@ProcarefulAdmin/utils';
import { useAuthControllerVerifySignupCredentials } from '@Procareful/common/api';
import { SearchParams, useTypedTranslation } from '@Procareful/common/lib';
import { AuthCard, Text, PhoneNumberInput } from '@Procareful/ui';
import { useStyles } from './styles';

type PhoneNumberFormProps = {
  userEmail: string;
};

type RegisterPhoneNumberData = z.infer<typeof registerPhoneSchema>;

const PhoneNumberForm = ({ userEmail }: PhoneNumberFormProps) => {
  const stylish = useStylish();
  const { t } = useTypedTranslation();
  const { styles } = useStyles();
  const [, setSearchParams] = useSearchParams();
  const { token } = useParams();

  const { phoneNumber, setPhoneNumber, email } = useSignUpStore(
    ({ phoneNumber, setPhoneNumber, email }) => ({
      phoneNumber,
      setPhoneNumber,
      email,
    })
  );

  const { mutate: verifySignupCredentials, isPending } = useAuthControllerVerifySignupCredentials({
    mutation: {
      onSuccess: (_, { data }) => {
        setPhoneNumber(data.phone_number);
        setSearchParams(`${SearchParams.Step}=${SearchParams.SetPassword}`);
      },
      onError: () => {
        setError('phoneNumber', {
          type: 'manual',
          message: t('admin_inf_email_and_phone_number_does_not_match'),
        });
      },
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterPhoneNumberData>({
    resolver: zodResolver(registerPhoneSchema),
    defaultValues: { phoneNumber },
  });

  const onSubmit: SubmitHandler<RegisterPhoneNumberData> = ({ phoneNumber }) => {
    verifySignupCredentials({
      data: {
        email_address: email,
        phone_number: phoneNumber,
        token: token ?? '',
      },
    });
  };

  return (
    <>
      <AuthCard.Header>{t('admin_title_login_confirmation')}</AuthCard.Header>
      <AuthCard.Description description="admin_form_register_phone_description">
        <div className={styles.emailContainer}>
          <Text strong>{userEmail}</Text>
          <AuthCard.RedirectLink
            to={{ pathname: PathRoutes.Signup.replace(':token', token ?? '') }}
            className={styles.changeEmailLink}
          >
            {t('shared_btn_change')}
          </AuthCard.RedirectLink>
        </div>
      </AuthCard.Description>
      <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className={stylish.form}>
        <FormItem
          control={control}
          name="phoneNumber"
          label={t('shared_form_enter_phone_number')}
          help={errors.phoneNumber?.message}
          hasFeedback
        >
          <PhoneNumberInput />
        </FormItem>
        <AuthCard.SubmitButton className={stylish.submitButton} loading={isPending}>
          {t('shared_btn_continue')}
        </AuthCard.SubmitButton>
      </Form>
      <AuthCard.TermsAndPrivacyPolicy i18nKey="admin_inf_register_agreement_text"></AuthCard.TermsAndPrivacyPolicy>
    </>
  );
};

export default PhoneNumberForm;
