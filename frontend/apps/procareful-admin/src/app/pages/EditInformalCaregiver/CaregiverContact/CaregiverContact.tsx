import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { type z } from 'zod';
import { Form, Input } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import ResendRegistrationLinkButton from '@ProcarefulAdmin/components/ResendRegistrationLinkButton';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import type { PartialUpdateCaregiverProps } from '@ProcarefulAdmin/typings';
import { userContactSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import {
  useAdminInstitutionControllerUpdateInformalCaregiverContact,
  type ErrorResponse,
} from '@Procareful/common/api';
import { formatNumbersOnly, useTypedTranslation } from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';
import { Title, PhoneNumberInput, MaskedInput } from '@Procareful/ui';
import { useStyles } from './styles';

type UserContactData = z.infer<typeof userContactSchema>;
type UserContactProps = PartialUpdateCaregiverProps<UserContactData> & {
  showResendRegistrationLinkButton: boolean;
};

const CaregiverContact = ({
  onSuccess,
  caregiverId,
  showResendRegistrationLinkButton,
  ...userContactData
}: UserContactProps) => {
  const stylish = useStylish({ formMode: 'edit' });
  const { styles } = useStyles();

  const { t } = useTypedTranslation();

  const {
    control,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserContactData>({
    values: { ...userContactData },
    resolver: zodResolver(userContactSchema),
  });

  const { mutate: updateCaregiverContactInfo, isPending } =
    useAdminInstitutionControllerUpdateInformalCaregiverContact({
      mutation: {
        onSuccess,
        onError: (error: ErrorResponse) => {
          setBackendFieldErrors(error, setError);
        },
      },
    });

  const formItemCommonProps = {
    control,
    className: stylish.input,
    labelCol: { span: 6 },
    labelAlign: 'left' as FormLabelAlign,
  };

  const onSubmit: SubmitHandler<UserContactData> = ({
    emailAddress,
    phoneNumber,
    building,
    flat,
    city,
    street,
    zipCode,
  }) => {
    updateCaregiverContactInfo({
      id: caregiverId,
      data: {
        email_address: emailAddress,
        phone_number: phoneNumber || '',
        address: {
          building,
          flat,
          street,
          city,
          zip_code: zipCode,
        },
      },
    });
  };

  return (
    <StyledCard title={t('admin_title_caregiver_contact_information')}>
      <Form layout="horizontal" className={stylish.form}>
        <FormItem
          name="phoneNumber"
          label={t('admin_form_phone_number')}
          wrapperCol={{ span: 15 }}
          {...formItemCommonProps}
        >
          <PhoneNumberInput />
        </FormItem>
        <FormItem
          name="emailAddress"
          label={t('admin_form_email')}
          wrapperCol={{ span: 15 }}
          {...formItemCommonProps}
        >
          <Input />
          {showResendRegistrationLinkButton && (
            <ResendRegistrationLinkButton
              userId={caregiverId}
              className={styles.resendActivationLinkContainer}
            />
          )}
        </FormItem>
        <Title level={6} className={stylish.formTitle}>
          {t('admin_inf_address')}
        </Title>
        <FormItem
          name="city"
          label={t('admin_form_city')}
          wrapperCol={{ span: 15 }}
          {...formItemCommonProps}
        >
          <Input />
        </FormItem>
        <FormItem
          name="street"
          label={t('admin_form_street')}
          wrapperCol={{ span: 15 }}
          {...formItemCommonProps}
        >
          <Input />
        </FormItem>
        <FormItem
          name="building"
          label={t('admin_form_building')}
          wrapperCol={{ span: 8 }}
          {...formItemCommonProps}
        >
          <Input />
        </FormItem>
        <FormItem
          name="flat"
          label={t('admin_form_flat')}
          wrapperCol={{ span: 8 }}
          {...formItemCommonProps}
        >
          <Input />
        </FormItem>
        <FormItem
          label={t('admin_form_zip_code')}
          name="zipCode"
          help={errors.zipCode?.message}
          wrapperCol={{ span: 8 }}
          {...formItemCommonProps}
        >
          <MaskedInput maskFunction={val => formatNumbersOnly(val, true)} />
        </FormItem>
        <FormControls onReset={reset} onSubmit={handleSubmit(onSubmit)} loading={isPending} />
      </Form>
    </StyledCard>
  );
};

export default CaregiverContact;
