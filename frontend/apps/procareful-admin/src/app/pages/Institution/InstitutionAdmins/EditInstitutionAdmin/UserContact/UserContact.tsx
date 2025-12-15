import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { type z } from 'zod';
import { Form, Input } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import ResendRegistrationLinkButton from '@ProcarefulAdmin/components/ResendRegistrationLinkButton';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { editInstitutionAdminSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import {
  getAdminInstitutionControllerGetInstitutionAdminQueryKey,
  useAdminInstitutionControllerUpdateAdminInstitutionContact,
  type ErrorResponse,
} from '@Procareful/common/api';
import { useNotificationContext, useTypedTranslation } from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';
import { PhoneNumberInput } from '@Procareful/ui';

type UserContact = z.infer<typeof editInstitutionAdminSchema> & {
  adminId: number;
  showResendRegistrationLinkButton: boolean;
};

const UserContact = ({ adminId, showResendRegistrationLinkButton, ...props }: UserContact) => {
  const stylish = useStylish({ formMode: 'edit' });
  const { t } = useTypedTranslation();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();

  const { control, reset, handleSubmit, setError } = useForm<UserContact>({
    resolver: zodResolver(editInstitutionAdminSchema),
    defaultValues: { ...props },
  });

  const formItemCommonProps = {
    control,
    className: stylish.input,
    labelCol: { span: 6 },
    labelAlign: 'left' as FormLabelAlign,
  };

  const { mutate: updateInstitutionAdminContactInfo, isPending } =
    useAdminInstitutionControllerUpdateAdminInstitutionContact({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetInstitutionAdminQueryKey(adminId),
          });
          notificationApi.success({
            message: t('admin_form_alert_saved'),
            description: t('admin_form_alert_successfully_saved_data'),
          });
        },
        onError: (error: ErrorResponse) => {
          setBackendFieldErrors(error, setError);
        },
      },
    });

  const onSubmit: SubmitHandler<UserContact> = ({ emailAddress, phoneNumber }) => {
    updateInstitutionAdminContactInfo({
      adminId,
      data: { email_address: emailAddress, phone_number: phoneNumber },
    });
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
          {showResendRegistrationLinkButton && <ResendRegistrationLinkButton userId={adminId} />}
        </FormItem>
        <FormControls onReset={reset} onSubmit={handleSubmit(onSubmit)} loading={isPending} />
      </Form>
    </StyledCard>
  );
};

export default UserContact;
