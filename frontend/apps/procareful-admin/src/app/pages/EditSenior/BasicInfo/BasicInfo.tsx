import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { type z } from 'zod';
import { DatePicker, Form, Input } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { basicInfoSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import {
  getAdminInstitutionControllerGetUsersQueryKey,
  useAdminInstitutionControllerUpdateInfoUserById,
  type ErrorResponse,
} from '@Procareful/common/api';
import { useNotificationContext, useTypedTranslation, TimeFormat } from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';

type BasicInfoData = z.infer<typeof basicInfoSchema> & { seniorId: number };

const BasicInfo = ({ seniorId, ...props }: BasicInfoData) => {
  const stylish = useStylish({ formMode: 'edit' });
  const { t } = useTypedTranslation();
  const queryClient = useQueryClient();
  const { notificationApi } = useNotificationContext();

  const { control, reset, handleSubmit, setError } = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: { ...props },
  });

  const { mutate: updateSeniorBasicInfo, isPending } =
    useAdminInstitutionControllerUpdateInfoUserById({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetUsersQueryKey(),
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

  const onSubmit: SubmitHandler<BasicInfoData> = ({ dateOfBirth, firstName, lastName }) => {
    const data = {
      date_of_birth: dateOfBirth?.toISOString(),
      first_name: firstName,
      last_name: lastName,
    };
    updateSeniorBasicInfo({ id: seniorId, data });
  };

  return (
    <StyledCard title={t('admin_title_basic_info')}>
      <Form layout="horizontal" className={stylish.form}>
        <FormItem
          name="firstName"
          label={t('admin_form_first_name')}
          wrapperCol={{ span: 15 }}
          {...formItemCommonProps}
        >
          <Input />
        </FormItem>
        <FormItem
          name="lastName"
          label={t('admin_form_last_name')}
          wrapperCol={{ span: 15 }}
          {...formItemCommonProps}
        >
          <Input />
        </FormItem>
        <FormItem
          name="dateOfBirth"
          label={t('admin_form_date_of_birth')}
          wrapperCol={{ span: 9 }}
          {...formItemCommonProps}
        >
          <DatePicker
            placeholder={t('admin_form_select_date')}
            format={TimeFormat.DATE_FORMAT}
            className={stylish.datePicker}
          />
        </FormItem>
        <FormControls onReset={reset} onSubmit={handleSubmit(onSubmit)} loading={isPending} />
      </Form>
    </StyledCard>
  );
};

export default BasicInfo;
