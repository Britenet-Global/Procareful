import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useNavigate } from 'react-router-dom';
import { Form, Input } from 'antd';
import { type FormLabelAlign } from 'antd/es/form/interface';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import UserStatus from '@ProcarefulAdmin/components/UserStatus';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { useStylish } from '@ProcarefulAdmin/styles/superAdminStyles';
import type { UserStatus as UserStatusType } from '@ProcarefulAdmin/typings';
import {
  type GetInstitutionDto,
  SetStatusDtoStatus,
  getAdminControllerGetInstitutionByIdQueryKey,
  type RoleDto,
  useAdminControllerDeactivateInstitution,
  useAdminControllerActivateInstitution,
  useAdminControllerDeleteInstitution,
} from '@Procareful/common/api';
import { useNotificationContext, useTypedTranslation, TimeFormat } from '@Procareful/common/lib';

type InstitutionStatusFormProps = {
  id?: GetInstitutionDto['id'];
  registration?: GetInstitutionDto['created_at'];
  userRoles?: RoleDto[];
  status?: GetInstitutionDto['status']['status_name'];
  name?: GetInstitutionDto['name'];
};

const InstitutionStatusForm = ({
  id,
  registration,
  status,
  userRoles,
  name,
}: InstitutionStatusFormProps) => {
  const stylish = useStylish();
  const { notificationApi } = useNotificationContext();
  const { t } = useTypedTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { control } = useForm({
    defaultValues: {
      id,
      registration: dayjs(registration).format(TimeFormat.FULL_DATE_TIME_SEPARATED_BY_SEMICOLON),
    },
  });

  const { mutate: handleInstitutionDeactivation } = useAdminControllerDeactivateInstitution({
    mutation: {
      onSuccess: () => {
        notificationApi.success({
          message: t('admin_title_institution_deactivated'),
          description: t('admin_inf_institution_deactivated'),
        });

        queryClient.invalidateQueries({
          queryKey: getAdminControllerGetInstitutionByIdQueryKey(Number(id)),
        });
      },
    },
  });

  const { mutate: handleInstitutionActivation } = useAdminControllerActivateInstitution({
    mutation: {
      onSuccess: () => {
        notificationApi.success({
          message: t('admin_title_institution_activate'),
          description: t('admin_inf_institution_activated'),
        });
        queryClient.invalidateQueries({
          queryKey: getAdminControllerGetInstitutionByIdQueryKey(Number(id)),
        });
      },
    },
  });

  const { mutate: handleInstitutionDelete, isPending: isInstitutionDeletePending } =
    useAdminControllerDeleteInstitution({
      mutation: {
        onSuccess: () => {
          navigate(PathRoutes.Institutions);
          notificationApi.success({
            message: t('admin_title_institution_removed'),
            description: t('admin_inf_institution_removed'),
          });
        },
      },
    });

  const formItemCommonProps = {
    control,
    className: stylish.input,
    labelCol: { span: 6 },
    labelAlign: 'left' as FormLabelAlign,
  };

  const handleChangeInstitutionStatus = (status: SetStatusDtoStatus) => {
    if (!id) {
      return;
    }

    const payload = {
      institutionId: id,
    };

    status === SetStatusDtoStatus.active
      ? handleInstitutionActivation(payload)
      : handleInstitutionDeactivation(payload);
  };

  return (
    <StyledCard title={t('admin_title_institution_status')}>
      <Form layout="horizontal" className={stylish.form}>
        <FormItem
          name="id"
          label={t('admin_form_institution_id')}
          wrapperCol={{ span: 15 }}
          {...formItemCommonProps}
        >
          <Input readOnly disabled />
        </FormItem>
        <FormItem
          name="registration"
          label={t('admin_form_registration')}
          wrapperCol={{ span: 15 }}
          {...formItemCommonProps}
        >
          <Input readOnly disabled />
        </FormItem>
        {name && status && (
          <UserStatus
            userDetails={{
              roles: userRoles,
              status: status as unknown as UserStatusType,
              name,
            }}
            onDeactivationConfirm={() => handleChangeInstitutionStatus(SetStatusDtoStatus.inactive)}
            onActivate={() => handleChangeInstitutionStatus(SetStatusDtoStatus.active)}
            onDeletionConfirm={() => handleInstitutionDelete({ institutionId: Number(id) })}
            loading={isInstitutionDeletePending}
          />
        )}
      </Form>
    </StyledCard>
  );
};

export default InstitutionStatusForm;
