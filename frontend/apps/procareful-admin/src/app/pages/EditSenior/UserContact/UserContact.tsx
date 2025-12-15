import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { type z } from 'zod';
import { Form, Input } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { PaginationSize } from '@ProcarefulAdmin/constants';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { seniorContactSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import {
  getAdminInstitutionControllerGetUserByIdQueryKey,
  useAdminInstitutionControllerUpdateContactUserById,
  type ErrorResponse,
} from '@Procareful/common/api';
import {
  formatNumbersOnly,
  useNotificationContext,
  useTypedTranslation,
} from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';
import { MaskedInput, PhoneNumberInput, Title } from '@Procareful/ui';

type UserContactData = z.infer<typeof seniorContactSchema> & { seniorId: number };

const UserContact = ({ seniorId, ...props }: UserContactData) => {
  const stylish = useStylish({ formMode: 'edit' });
  const { t } = useTypedTranslation();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();

  const {
    control,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserContactData>({
    resolver: zodResolver(seniorContactSchema),
    defaultValues: { ...props },
  });

  const { mutate: updateSeniorContactInfo, isPending } =
    useAdminInstitutionControllerUpdateContactUserById({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetUserByIdQueryKey(seniorId, {
              page: 1,
              pageSize: PaginationSize.Large,
            }),
          });
          notificationApi.success({
            message: t('admin_title_update_successful'),
            description: t('admin_inf_senior_updated_subtitle'),
          });
        },
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
    city,
    building,
    flat,
    street,
    zipCode,
    emailAddress,
    phoneNumber,
  }) => {
    const data = {
      address: {
        city,
        building,
        flat,
        street,
        zip_code: zipCode,
      },
      email_address: emailAddress || null,
      phone_number: phoneNumber,
    };

    updateSeniorContactInfo({ id: seniorId, data });
  };

  return (
    <StyledCard title={t('admin_title_user_contact_information')}>
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
        </FormItem>
        <Title level={6} className={stylish.formTitle}>
          {t('admin_inf_address')}
        </Title>
        <FormItem
          name="city"
          label={t('admin_form_city')}
          wrapperCol={{ span: 8 }}
          {...formItemCommonProps}
        >
          <Input />
        </FormItem>
        <FormItem
          name="street"
          label={t('admin_form_street')}
          wrapperCol={{ span: 8 }}
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

export default UserContact;
