import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { type z } from 'zod';
import { Form, Input } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { basicInfoFormalCaregiverSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import {
  getAdminInstitutionControllerGetInstitutionAdminQueryKey,
  useAdminInstitutionControllerUpdateAdminInstitutionInfo,
  type ErrorResponse,
} from '@Procareful/common/api';
import { useNotificationContext, useTypedTranslation } from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';

type BasicInfoData = z.infer<typeof basicInfoFormalCaregiverSchema> & { adminId: number };

const BasicInfo = ({ adminId, ...props }: BasicInfoData) => {
  const stylish = useStylish({ formMode: 'edit' });
  const { t } = useTypedTranslation();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();

  const { control, reset, handleSubmit, setError } = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoFormalCaregiverSchema),
    defaultValues: { ...props },
  });

  const formItemCommonProps = {
    control,
    className: stylish.input,
    labelCol: { span: 6 },
    wrapperCol: { span: 15 },
    labelAlign: 'left' as FormLabelAlign,
  };

  const { mutate: updateInstitutionAdminBasicInfo, isPending } =
    useAdminInstitutionControllerUpdateAdminInstitutionInfo({
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

  const onSubmit: SubmitHandler<BasicInfoData> = ({ firstName, lastName }) => {
    updateInstitutionAdminBasicInfo({
      adminId,
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    });
  };

  return (
    <StyledCard title={t('admin_title_basic_info')}>
      <Form layout="horizontal" className={stylish.form}>
        <FormItem name="firstName" label={t('admin_form_first_name')} {...formItemCommonProps}>
          <Input />
        </FormItem>
        <FormItem name="lastName" label={t('admin_form_last_name')} {...formItemCommonProps}>
          <Input />
        </FormItem>
        <FormControls onReset={reset} onSubmit={handleSubmit(onSubmit)} loading={isPending} />
      </Form>
    </StyledCard>
  );
};

export default BasicInfo;
