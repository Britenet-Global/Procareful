import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { type z } from 'zod';
import { Form, Select } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import FormControls from '@ProcarefulAdmin/components/FormControls';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import useFormDirtyStore from '@ProcarefulAdmin/store/formDirtyStore';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import { selectRoleOptions } from '@ProcarefulAdmin/utils';
import { roleSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import {
  type GetMeResponseDto,
  type ErrorResponse,
  useAdminInstitutionControllerUpdateFormalCaregiverRoles,
  getAuthControllerGetMeQueryKey,
  getAdminInstitutionControllerGetFormalCaregiverRolesQueryKey,
} from '@Procareful/common/api';
import { type Key, useNotificationContext, useTypedTranslation } from '@Procareful/common/lib';
import { setBackendFieldErrors } from '@Procareful/common/lib/utils';

type RoleData = z.infer<typeof roleSchema>;

const Role = ({ position }: RoleData) => {
  const stylish = useStylish({ formMode: 'edit' });
  const { t } = useTypedTranslation();
  const queryClient = useQueryClient();
  const { notificationApi } = useNotificationContext();
  const { setDirty } = useFormDirtyStore(state => ({
    setDirty: state.setDirty,
  }));

  const {
    control,
    reset,
    handleSubmit,
    setError,
    formState: { isDirty, isSubmitSuccessful },
  } = useForm<RoleData>({
    resolver: zodResolver(roleSchema),
    values: { position },
  });

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );

  const { mutate: updateFormalCaregiverRole, isPending } =
    useAdminInstitutionControllerUpdateFormalCaregiverRoles({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getAdminInstitutionControllerGetFormalCaregiverRolesQueryKey(),
          });

          notificationApi.success({
            message: t('admin_title_update_successful'),
            description: t('admin_inf_caregiver_updated_subtitle'),
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

  const onSubmit = ({ position }: RoleData) => {
    const caregiverId = userData?.details.admin.id;

    if (caregiverId) {
      updateFormalCaregiverRole({
        caregiverId: caregiverId,
        data: {
          role_name: position,
        },
      });
    }
  };

  useDeepCompareEffect(() => {
    reset({ position });
  }, [position]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      setDirty('personalInfo', false);

      return;
    }

    setDirty('personalInfo', isDirty);
  }, [isDirty, setDirty, isSubmitSuccessful]);

  return (
    <StyledCard title={t('admin_title_role')}>
      <Form layout="horizontal" className={stylish.form}>
        <FormItem
          name="position"
          label={t('admin_form_select')}
          wrapperCol={{ span: 15 }}
          {...formItemCommonProps}
        >
          <Select
            placeholder={t('admin_form_role_placeholder')}
            options={selectRoleOptions?.map(o => ({ ...o, label: t(o.label as Key) }))}
            mode="multiple"
          />
        </FormItem>
        <FormControls onReset={reset} onSubmit={handleSubmit(onSubmit)} loading={isPending} />
      </Form>
    </StyledCard>
  );
};

export default Role;
