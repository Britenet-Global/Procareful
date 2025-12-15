import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { type z } from 'zod';
import { Form, Input } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import type { PartialUpdateCaregiverProps } from '@ProcarefulAdmin/typings';
import { basicInfoFormalCaregiverSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import {
  useAdminInstitutionControllerUpdateFormalCaregiverInfo,
  type ErrorResponse,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';

type BasicInfoData = z.infer<typeof basicInfoFormalCaregiverSchema>;
type BasicInfoProps = PartialUpdateCaregiverProps<BasicInfoData>;

const BasicInfo = ({ caregiverId, firstName, lastName, onSuccess }: BasicInfoProps) => {
  const stylish = useStylish({ formMode: 'edit' });
  const { t } = useTypedTranslation();
  const { control, reset, handleSubmit, setError } = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoFormalCaregiverSchema),
    values: { firstName, lastName },
  });

  const { mutate: updateFormalCaregiverBasicInfo } =
    useAdminInstitutionControllerUpdateFormalCaregiverInfo({
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
    wrapperCol: { span: 15 },
    labelAlign: 'left' as FormLabelAlign,
  };

  const onSubmit = ({ firstName, lastName }: BasicInfoData) => {
    updateFormalCaregiverBasicInfo({
      id: caregiverId,
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
        <FormControls onReset={reset} onSubmit={handleSubmit(onSubmit)} />
      </Form>
    </StyledCard>
  );
};

export default BasicInfo;
