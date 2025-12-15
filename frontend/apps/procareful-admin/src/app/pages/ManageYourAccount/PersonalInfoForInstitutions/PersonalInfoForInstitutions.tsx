import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { type z } from 'zod';
import { Form, Input } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import useFormDirtyStore from '@ProcarefulAdmin/store/formDirtyStore';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { addInstitutionAdminSchema } from '@ProcarefulAdmin/utils';
import {
  type ErrorResponse,
  getAuthControllerGetMeQueryKey,
  type GetMeResponseDto,
  useAdminInstitutionControllerSetMyPersonalSettings,
} from '@Procareful/common/api';
import {
  setBackendFieldErrors,
  useNotificationContext,
  useTypedTranslation,
} from '@Procareful/common/lib';
import { PhoneNumberInput } from '@Procareful/ui';
import { useStyles } from './styles';

type InstitutionData = z.infer<typeof addInstitutionAdminSchema>;

const PersonalInfoForInstitutions = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const stylish = useStylish({ formMode: 'add' });
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();

  const { setDirty } = useFormDirtyStore(state => ({
    setDirty: state.setDirty,
  }));

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );
  const { first_name, last_name, phone_number, email_address } = userData?.details.admin || {};

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isDirty },
  } = useForm<InstitutionData>({
    resolver: zodResolver(addInstitutionAdminSchema),
    values: {
      firstName: first_name || '',
      lastName: last_name || '',
      emailAddress: email_address || '',
      phoneNumber: phone_number || '',
    },
  });

  const { mutate: updatePersonalInfo, isPending } =
    useAdminInstitutionControllerSetMyPersonalSettings({
      mutation: {
        onSuccess: () => {
          notificationApi.success({
            message: t('admin_alert_update_successful'),
            description: t('admin_alert_user_update_successful'),
          });

          queryClient.invalidateQueries({ queryKey: getAuthControllerGetMeQueryKey() });
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
    hasFeedback: true,
    required: true,
  };

  const onSubmit: SubmitHandler<InstitutionData> = ({
    emailAddress,
    firstName,
    lastName,
    phoneNumber,
  }) => {
    updatePersonalInfo({
      data: {
        email_address: emailAddress,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
      },
    });
  };

  useEffect(() => {
    setDirty('personalInfo', isDirty);
  }, [isDirty, setDirty]);

  return (
    <StyledCard title={t('admin_title_personal_info')}>
      <Form layout="horizontal" className={stylish.form} onFinish={handleSubmit(onSubmit)}>
        <div className={styles.nameContainer}>
          <FormItem name="firstName" label={t('admin_form_first_name')} {...formItemCommonProps}>
            <Input autoCapitalize="words" />
          </FormItem>
          <FormItem name="lastName" label={t('admin_form_last_name')} {...formItemCommonProps}>
            <Input />
          </FormItem>
        </div>
        <FormItem name="phoneNumber" label={t('shared_form_phone_number')} {...formItemCommonProps}>
          <PhoneNumberInput />
        </FormItem>
        <FormItem name="emailAddress" label={t('admin_form_email')} {...formItemCommonProps}>
          <Input />
        </FormItem>
        <FormControls
          onReset={reset}
          loading={isPending}
          onSubmit={handleSubmit(onSubmit)}
          confirmButtonText={t('shared_btn_save_changes')}
          resetButtonText={t('admin_btn_reset_changes')}
        />
      </Form>
    </StyledCard>
  );
};

export default PersonalInfoForInstitutions;
